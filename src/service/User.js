const SteamCommunity = window.require("steamcommunity");
// const {LoginSession, EAuthTokenPlatformType} = window.require("steam-session");


const SteamTotp = window.require("steam-totp");
const cheerio = window.require("cheerio");
const fetch = window.require("node-fetch");


class User {

    defaultHeaders = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Language': 'ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'max-age=0',
        'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'Connection': 'keep-alive',
        'Origin': 'steamcommunity.com',
        // 'Host': 'steamcommunity.com',
    };

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    generateAuthCode(shared_secret) { //                      ВОЗВРАЩАЕТ КОД СТИМ ГУАРД
        return SteamTotp.generateAuthCode(shared_secret);
    }

    getUserAvatar(community, steam_id) {
        return new Promise((resolve, reject) => {
            community.getSteamUser(new SteamCommunity.SteamID(steam_id), (err, user) => {
                if (err) {
                    reject(err);
                }
                resolve(`https://avatars.cloudflare.steamstatic.com/${user.avatarHash}_medium.jpg`);
            });
        }).then(res => res);
    }

    authSteam({login, password, shared_secret}) {
        return new Promise((resolve, reject) => {
            let steam_id;
            let session_id;
            let details = {
                "accountName": login,
                "password": password,
                "twoFactorCode": this.generateAuthCode(shared_secret)
            };
            const community = new SteamCommunity();
            community.login(details, (err, cookies, sessionID) => {
                if (!err) {
                    console.log("AUTH Data")
                    console.log(sessionID)
                    steam_id = (sessionID.findLast((el) => el.startsWith("steamLoginSecure="))).split("steamLoginSecure=")[1].split("%7C%")[0];
                    session_id = [
                        sessionID.findLast((el) => el.startsWith("steamCountry=") && el.includes("Domain=steamcommunity.com")),
                        sessionID.findLast((el) => el.startsWith("steamLoginSecure=") && el.includes("Domain=steamcommunity.com")),
                        sessionID.findLast((el) => el.startsWith("sessionid=") && el.includes("Domain=steamcommunity.com"))
                    ];
                    resolve({
                        community,
                        steam_id,
                        session_id,
                        cookies
                    });

                } else {
                    reject(err);
                }

            });
        }).then(res => res);
    }

    // async authSteam({login, password, shared_secret}) {
    //     let session = new LoginSession(EAuthTokenPlatformType.WebBrowser);
    //     let details = {
    //         "accountName": login,
    //         "password": password,
    //         "steamGuardCode": this.generateAuthCode(shared_secret)
    //     };
    //     const result = await session.startWithCredentials(details);
    //     await this.sleep(3000)
    //
    //     console.log(result)
    //     console.log("\n")
    //     console.log(session.refreshToken)
    //     console.log(session)
    //
    //
    //     const cookie = await session.getWebCookies()
    //     console.log(cookie)
    // }


    async _getSteamWebApiToken(session_id) {
        const url = "https://steamcommunity.com/pointssummary/ajaxgetasyncconfig";
        let headers = {
            Cookie: session_id.join(";")
        }
        const res = await fetch(url, {headers});

        const json = await res.json();
        console.log("webapi_token")
        console.log(json)
        return json["data"]["webapi_token"];
    }

    async marketPingPong(marketApi, session_id) {
        const url = "https://market.csgo.com/api/v2/ping-new?key=" + marketApi;
        for (let attempt = 0; attempt < 3; attempt++) {
            const access_token = await this._getSteamWebApiToken(session_id);
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({access_token})
            });
            if (!res.ok) {
                await this.sleep(2000);
                continue;
            }
            const json = await res.json();
            console.log("ping pong");
            console.log(json);
            return json.success;
        }
    }

    async marketUpdateInventory(marketApi) {
        const url = "https://market.csgo.com/api/v2/update-inventory/?key=" + marketApi;
        for (let attempt = 0; attempt < 3; attempt++) {
            const res = await fetch(url);
            if (!res.ok) {
                await this.sleep(2000);
                continue;
            }
            const json = await res.json();
            console.log("update inventory");
            console.log(json);
            return json.success;
        }
    }

    async steamTradeAcceptWhenItemSold(marketApi, community, identity_secret, logging) {
        const url = "https://market.csgo.com/api/v2/trades/?key=";
        for (let i = 0; i < 5; i++) {
            const res = await fetch(url + marketApi);
            if (!res.ok) {
                console.log(`steamTradeAcceptWhenItemSold statusCode: ${res.status} statusText: ${res.statusText}`);
                await this.sleep(1000);
                continue;
            }
            const json = await res.json();
            console.log(json);
            if (json.success && json.trades) {
                if (json.trades.find((elem) => elem.dir === "in")) {
                    await this.steamTradeAccept(community, identity_secret, logging);
                }
            }
            return json.status;
        }
        throw new Error("Произошла ошибка подтверждении обмена market.csgo.com");
    }

    async steamTradeAccept(community, identity_secret, logging) {
        return new Promise((resolve, reject) => {
            let time = SteamTotp.time();
            const confKey = SteamTotp.generateConfirmationKey(identity_secret, time, "conf");
            const allowKey = SteamTotp.generateConfirmationKey(identity_secret, time, "allow");
            logging("Подтверждаю обмены.")
            community.acceptAllConfirmations(time, confKey, allowKey, (err, confs) => {
                if (err) {
                    logging("ОШИБКА ПОДТВЕРЖДЕНИЯ")
                    reject(err)
                }
                if (confs && confs.length) {
                    let logText = "Подтверждены обмены:\n"
                    console.log(confs);
                    for (let conf of confs) {
                        logText += conf.title + "\n";
                    }
                    logging(logText)
                }
                resolve(confs);
            })
        }).then(res => (res)).catch(err => logging(err));
    }

    //get market status
    async getMarketStatus(market_api) {
        const url = "https://market.csgo.com/api/v2/test?key=";
        for (let i = 0; i < 5; i++) {
            const res = await fetch(url + market_api);
            if (!res.ok) {
                console.log(`getMarketStatus statusCode: ${res.status} statusText: ${res.statusText}`);
                await this.sleep(5000);
                continue;
            }
            const json = await res.json();
            if (!json.success) {
                if (json.error === "Bad KEY")
                    throw new Error("Ошибка! Проверьте marketApi ключ.");
            }
            return json.status;
        }
        throw new Error("Произошла ошибка при получении баланса market.csgo.com");

    }

// Market Wallet Balance
    async getMarketBalance(market_api) {
        const url = 'https://market.csgo.com/api/v2/get-money?key=';
        for (let i = 0; i < 5; i++) {
            const res = await fetch(url + market_api);
            if (!res.ok) {
                if (res.status === 401) {
                    throw new Error("Ошибка! Проверьте marketApi ключ.");
                }
                console.log(`getMarketBalance statusCode: ${res.status} statusText: ${res.statusText}`);
                await this.sleep(5000);
                continue;
            }
            const json = await res.json();
            return Number(json.money);
        }
        throw new Error("Произошла ошибка при получении баланса market.csgo.com");
    }

    // Steam Wallet Balance
    async getSteamBalance(session_id, steam_id) {
        const url = 'https://steamcommunity.com/profiles/' + steam_id;
        let headers = {
            Cookie: session_id.join(";"),
            'Referer': 'https://store.steampowered.com/',
            'Host': 'steamcommunity.com',
        }
        for (let i = 0; i < 3; i++) {
            const res = await fetch(url, {
                headers: {
                    ...this.defaultHeaders,
                    ...headers
                }
            });
            if (!res.ok) {
                console.log(`getSteamBalance statusCode: ${res.status} statusText: ${res.statusText}`);
                await this.sleep(10000);
                continue;
            }
            const $ = cheerio.load(await res.text());
            const balance = $("#header_wallet_balance").text().replaceAll(" pуб.", " ").replaceAll(",", ".");
            if (!balance) break;
            return parseFloat(balance);
        }
        throw new Error("Произошла ошибка при получении баланса steamcommunity.com");
    }

// Steam Inventory Cost
    async getInventoryCost(steam_id, session_id) { //returns Steam inventory cost
        const inventoryUrl = `https://steamcommunity.com/inventory/${steam_id}/730/2?l=russian&count=5000`;

        const json = await this._getInventory(inventoryUrl, session_id);
        const inventory = this._getAmount(json);
        const tradable = this._getTradable(json);
        if (!inventory)
            return {inv_cost: 0, tradable: 0};
        let inv_length = 0;
        for (let i = 0; i < inventory.length; i++) {
            inv_length += inventory[i][1];
        }

        let inv_cost = 0;
        for (let i = 0; i < inventory.length; i++) {
            try {
                inv_cost += await this._getPriceSteam(session_id, inventory[i][0]) * inventory[i][1];
            } catch (e) {
            }
        }
        inv_cost = Number(inv_cost.toFixed(2));
        return {inv_cost, tradable};
    }

    async _getInventory(inventoryUrl, session_id) {
        for (let i = 0; i < 5; i++) {
            const res = await fetch(inventoryUrl, {
                headers:
                    {
                        ...this.defaultHeaders,
                        Cookie: session_id.join(";")
                    }
            });
            if (!res.ok) {
                console.log(`getInventory statusCode: ${res.status} statusText: ${res.statusText}`);
                await this.sleep(30000);
                continue;
            }

            return await res.json();
        }
        throw new Error("Произошла ошибка при получении инвентаря steamcommunity.com");
    }

    _getAmount(data) {
        const result = [];
        const history = [];
        if (data["total_inventory_count"]) {
            for (let i = 0; i < data.descriptions.length; i++) {
                if (history.indexOf(data.descriptions[i].classid) === -1) {
                    history.push(data.descriptions[i].classid);
                } else {
                    continue;
                }
                let amount = 0;
                for (let j = 0; j < data.assets.length; j++) {
                    if (data.descriptions[i].classid === data.assets[j].classid) {
                        amount++;
                    }
                }
                if (data.descriptions[i].marketable) {
                    result.push([data.descriptions[i].market_hash_name, amount]);
                }
            }
            const include = [];
            const newResult = [];
            result.forEach((item, i, arr) => {
                if (!include.includes(item[0])) {
                    let amount = item[1];
                    for (let j = i + 1; j < arr.length; j++) {
                        if (arr[j].indexOf(item[0]) === 0) {
                            amount += arr[j][1];
                        }
                    }
                    include.push(item[0]);
                    newResult.push([item[0], amount]);
                }
            })
            return newResult;
        }
        return 0;
    }

    _getTradable(data) {
        let count = 0;
        if (data["total_inventory_count"]) {
            for (let i = 0; i < data.descriptions.length; i++) {
                if (data.descriptions[i].tradable) {
                    count++;
                }
            }
            return count;
        }
        return 0;
    }


    async _getPriceSteam(session_id, market_hash_name) {
        const priceOverviewSteam = "https://steamcommunity.com/market/priceoverview/?country=RU&currency=5&appid=730&market_hash_name=" + encodeURIComponent(market_hash_name);
        const headers = {
            //'If-Modified-Since': new Date().toUTCString(),
            Cookie: session_id.join(";"),
            'X-Requested-With': 'XMLHttpRequest',
            // 'Referer': `https://steamcommunity.com/profiles/${this.steam_id}/inventory/`
        }

        for (let i = 0; i < 2; i++) {
            const res = await fetch(priceOverviewSteam, {
                headers: {
                    ...this.defaultHeaders,
                    ...headers
                }
            });
            if (!res.ok) {
                console.log(`getPriceSteam statusCode: ${res.status} statusText: ${res.statusText}`);
                await this.sleep(20000);
                continue;
            }
            const json = await res.json();

            if (json["lowest_price"]) {
                let price = Number(json["lowest_price"].replace(" руб.", "").replace(",", "."));
                return Number(price.toFixed(2));
            } else if (json["median_price"]) {
                let price = Number(json["median_price"].replace(" руб.", "").replace(",", "."));
                return Number(price.toFixed(2));
            } else {
                await this.sleep(7000);
            }

        }
        throw new Error("Произошла ошибка при получении цены предмета.");
    }


    //Steam Lots Cost
    async getSteamMarketLots(session_id) { //returns Steam lots cost
        let headers = {
            Cookie: session_id.join(";"),
            'Referer': 'https://steamcommunity.com/market/'
        }
        let sum = 0;
        let start = 0;
        let total_count = 0;

        do {
            for (let i = 0; i < 5; i++) {
                const url = `https://steamcommunity.com/market/mylistings?start=${start}&count=100`;
                const res = await fetch(url, {
                    headers: {
                        ...this.defaultHeaders,
                        ...headers
                    }
                });

                if (!res.ok) {
                    console.log(`getSteamMarketLots statusCode: ${res.status} statusText: ${res.statusText}`);
                    if (i === 4) {
                        throw new Error("Произошла ошибка при получении стоимости лотов.");
                    }
                    await this.sleep(10000);
                    continue;
                }
                const json = await res.json();
                total_count = json.total_count;
                const $ = cheerio.load(json.results_html);
                const active_lots = $(".my_listing_section:nth-child(1) > #tabContentsMyActiveMarketListingsRows > .market_listing_row >  .market_listing_my_price > span > span > span > span:nth-child(3)");
                for (let i = 0; i < active_lots.length; i++) {
                    const price = Number(active_lots.eq(i).text()
                        .replace("(", "")
                        .replace(")", "")
                        .replace(",", ".")
                        .replace("pуб.", "")
                        .trim());
                    sum += price;
                }

                sum = Number(sum.toFixed(2));
                break;
            }
            start += 100;
        } while (total_count)
        return sum;
    }

    //Steam Market History
    async getMarketBuyHistory(session_id) {
        let history = {};
        for (let start = 0; start <= 1000; start += 500) {
            for (let i = 0; i < 5; i++) {
                let url = `https://steamcommunity.com/market/myhistory?start=${start}&count=500`;
                const res = await fetch(url, {
                    headers: {
                        ...this.defaultHeaders,
                        cookie: session_id.join(";")
                    }
                });
                if (!res.ok) {
                    console.log(`getMarketBuyHistory statusCode: ${res.status} statusText: ${res.statusText}`);
                    await this.sleep(10000);
                    continue;
                }
                const json = await res.json();
                const html = json.results_html;
                const $ = cheerio.load(html);
                await $(".market_listing_row").slice(0).each((i, elem) => {
                        try {
                            // let name = $(elem).find(".market_listing_item_name").text();
                            let history_row = $(elem).find(".market_listing_item_name").attr("id");
                            const pattern = new RegExp(`CreateItemHoverFromContainer\\(\\s*g_rgAssets\\s*,\\s*\\\'${history_row}\\\'\\s*,\\s*(\\d+)\\s*,\\s*\\\'(\\d+)\\\'\\s*,\\s*\\\'(\\d+)\\\'\\s*,\\s*(\\d+)\\s*\\);`);
                            const match = json.hovers.match(pattern);
                            const [, , , assetid] = match;
                            const name = json.assets["730"]["2"][assetid]["market_hash_name"];
                            let price = Number($(elem).find(".market_listing_price").text().match(/\d+,?\d*/im)[0].replace(",", "."));
                            let pos = $(elem).find(".market_listing_listed_date_combined").text().match(/[А-Яа-яA-Za-z]*:/)[0].replace(":", '').replace("t", "");

                            if ((pos === "Purchased" || pos === "Приобретено") && !history[name]) {
                                history[name] = price;
                            }
                        } catch (e) {
                            // console.log("historyBuy")
                            // console.log(e)
                        }
                    }
                );
                break;
            }
        }
        return history;
    }


    async getMinMarketPrice(market_api, market_hash_name) {
        for (let i = 0; i < 5; i++) {
            const url = "https://market.csgo.com/api/v2/search-item-by-hash-name?key=";
            const res = await fetch(encodeURI(url + market_api + "&hash_name=" + market_hash_name));
            if (!res.ok) {
                continue
            }
            const json = await res.json();
            console.log(json);
            return Number((json.data[0].price / 100).toFixed(2))
        }
    }

    async getBestMarketOffer(market_api, class_id, instance_id) {
        for (let i = 0; i < 5; i++) {
            const url = "https://market.csgo.com/api/BestBuyOffer/";
            const res = await fetch(url + class_id + "_" + instance_id + "/?key=" + market_api);
            if (!res.ok) {
                continue
            }
            const json = await res.json();
            console.log(json);

            return Number((json["best_offer"] / 100).toFixed(2))
        }
    }

    async getSkinImageUrl(steam_api, class_id) {
        const url = `https://api.steampowered.com/ISteamEconomy/GetAssetClassInfo/v1/?appid=730&key=${steam_api}&class_count=1&classid0=${class_id}`
        const res = await fetch(url);
        if (!res.ok) {
            return
        }
        const json = await res.json();
        return json.result[class_id]["icon_url"];
    }

    //Monitoring

    //refresh inventory
    async monitoringGetItems(market_api, steam_api) {
        const itemList = [];
        const url = "https://market.csgo.com/api/v2/items?key=";
        const res = await fetch(url + market_api);
        if (!res.ok) {
            throw new Error("Ошибка: " + res.statusText);
        }
        const json = await res.json();
        if (json.items) {
            for (let item of json.items) {
                if (!itemList.find(el => el.name === item["market_hash_name"]) && item.status === "1") {
                    const minPrice = await this.getMinMarketPrice(market_api, item["market_hash_name"]);
                    const orderPrice = await this.getBestMarketOffer(market_api, item["classid"], item["instanceid"]);
                    const img = await this.getSkinImageUrl(steam_api, item["classid"]);
                    itemList.push({
                        name: item["market_hash_name"],
                        item_id: item["item_id"],
                        assetid: item["assetid"],
                        classid: item["classid"],
                        instanceid: item["instanceid"],
                        real_instance: item["real_instance"],
                        img: img,
                        price: item.price,
                        minPrice: minPrice,
                        orderPrice: orderPrice,
                        minLimit: "",
                        maxLimit: ""
                    });
                }
            }
        }

        return itemList;
    }

    async monitoringPrices(marketApi, itemsData, logging) {
        let monitoringItemsList = [];
        let res = await fetch("https://market.csgo.com/api/v2/items?key=" + marketApi);
        if (!res.ok) {
            return;
        }
        let json = await res.json();
        console.log(json);
        if (json.items == null) {
            return 'NO_ITEMS';
        }
        for (let i = 0; i < json["items"].length; i++) {
            const {market_hash_name, classid, instanceid, status, price} = json["items"][i];
            const currentItem = itemsData.find((elem) => (elem.name === market_hash_name));
            const {minLimit, maxLimit} = currentItem;
            if (status === "2") {
                await fetch("https://market.csgo.com/api/v2/trade-request-give-p2p-all?key=" + marketApi);
                await fetch("https://market.csgo.com/api/v2/update-inventory/?key=" + marketApi);
            } else if (!monitoringItemsList.includes(market_hash_name) && status === "1" && minLimit && maxLimit) {
                const minPriceResponse = await fetch(encodeURI(`https://market.csgo.com/api/v2/search-item-by-hash-name?key=${marketApi}&hash_name=${market_hash_name}`));
                if (!minPriceResponse.ok) {
                    continue;
                }
                const minPriceJson = await minPriceResponse.json();
                const minPriceCoin = minPriceJson["data"][0]["price"];
                const secondPriceCoin = minPriceJson["data"][1]["price"];

                currentItem.minPrice = minPriceCoin / 100;
                currentItem.price = price;
                if (
                    price * 100 > minPriceCoin &&
                    minPriceCoin > minLimit * 100 &&
                    minPriceCoin < maxLimit * 100
                ) {
                    const priceLowResponse = await fetch(encodeURI(`https://market.csgo.com/api/MassSetPrice/${classid}_${instanceid}/${minPriceCoin - 3}/?key=${marketApi}`));
                    logging(`Скин: ${market_hash_name} Старая цена: ${price} Новая цена: ${(minPriceCoin - 3) / 100} Мин. порог: ${minLimit} Действие: понижение цены`);

                    if (!priceLowResponse.ok) {
                        continue
                    }
                } else if (
                    price * 100 === minPriceCoin &&
                    secondPriceCoin > minPriceCoin &&
                    secondPriceCoin > minLimit * 100 &&
                    price * 100 < secondPriceCoin - 3 &&
                    secondPriceCoin < maxLimit * 100
                ) {
                    let priceUpResponse = await fetch(encodeURI(`https://market.csgo.com/api/MassSetPrice/${classid}_${instanceid}/${secondPriceCoin - 3}/?key=${marketApi}`));
                    logging(`Скин: ${market_hash_name} Старая цена: ${price} Новая цена: ${(minPriceCoin - 3) / 100} Действие: повышение цены`);

                    if (!priceUpResponse.ok) {
                        continue
                    }
                }
                monitoringItemsList.push(market_hash_name);
            }
        }
    }

    async setItemsGetItems(marketApi) {
        let attempt = 0;
        let itemList = [];
        let res = await fetch(encodeURI("https://market.csgo.com/api/v2/my-inventory/?key=" + marketApi));
        if (!res.ok) {
            throw new Error("Ошибка: " + res.statusText);
        }
        let json = await res.json();
        for (let i = 0; i < json["items"].length; i++) {
            let {market_hash_name, id, classid, instanceid} = json["items"][i];
            if (!itemList.some((elem) => (elem.name === market_hash_name))) {

                let minPriceResponse = await fetch(encodeURI(`https://market.csgo.com/api/v2/search-item-by-hash-name?key=${marketApi}&hash_name=${market_hash_name}`));
                if (!minPriceResponse.ok) {
                    await this.sleep(1000);
                    if (attempt < 5) {
                        attempt++
                        i--;
                    }
                    continue
                }
                attempt = 0;
                let minPriceJson = await minPriceResponse.json();
                console.log(minPriceJson)
                let minPrice = minPriceJson["data"][0] && minPriceJson["data"][0]["price"] / 100;

                itemList.push({
                    name: market_hash_name,
                    minPrice: minPrice,
                    price: null
                });
            }
        }
        return itemList;
    }

    async setItems(marketApi, items) {
        let attempt = 0;
        let res = await fetch("https://market.csgo.com/api/v2/my-inventory/?key=" + marketApi);
        if (!res.ok)
            return
        let json = await res.json();
        for (let i = 0; i < json["items"].length; i++) {
            const {market_hash_name, id} = json["items"][i];
            const item = items.find((elem) => (elem.name === market_hash_name));
            if (item && item.price) {
                let setItemResponse = await fetch(`https://market.csgo.com/api/v2/add-to-sale?key=${marketApi}&id=${id}&price=${item.price * 100}&cur=RUB`);
                if (!setItemResponse.ok) {
                    await this.sleep(500);
                    if (attempt < 3) {
                        attempt++
                        i--;
                    }
                    continue
                }
                attempt = 0;
                let setItemJson = await setItemResponse.json();
                if (!setItemJson.success) {
                    const errorsToCheck = ["inventory_not_loaded", "item_not_received", "item_not_in_inventory"];
                    if (errorsToCheck.includes(setItemJson.error))
                        await fetch("https://market.csgo.com/api/v2/update-inventory/?key=" + marketApi);
                }
            }
        }
    }

    async autobuyBrowserStart() {
        const puppeteer = window.puppeteer;
        //let executablePath = puppeteer.executablePath() //для разработки
        let executablePath = puppeteer.executablePath().replace("app.asar", "app.asar.unpacked") //для публикации
        let browser = await puppeteer.launch({
            executablePath: executablePath,
            headless: true,
            args: ['--start-fullscreen', '--disable-web-security']
        });
        let page = await browser.newPage();
        return {browser, page};
    }


    async autobuyAuth(session_id, page, loggingAutobuy) {
        console.log(session_id)
        const cookie = [
            {
                name: "steamLoginSecure",
                value: session_id.find(part => part.includes("steamLoginSecure=")).split(";")[0].replace("steamLoginSecure=", ""),
                domain: ".steamcommunity.com",
                path: "/",
                httpOnly: true,
                secure: true
            }
        ];
        await page.setCookie(...cookie);
        loggingAutobuy("Авторизация Altskins.com...");
        await page.goto('https://steamcommunity.com/openid/login?openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.mode=checkid_setup&openid.return_to=http%3A%2F%2Ftable.altskins.com%2Flogin%2Fsteam&openid.realm=http%3A%2F%2Ftable.altskins.com&openid.ns.sreg=http%3A%2F%2Fopenid.net%2Fextensions%2Fsreg%2F1.1&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select'); //переходим по ссылке для входа

        await page.waitForTimeout(1500);
        await page.waitForSelector('#imageLogin'); //ждем кнопку входа в Стиме
        await page.waitForTimeout(1500);
        await page.click('#imageLogin'); //кликаем на нее
        await page.waitForTimeout(6000);
        await page.waitForSelector('img.header-avatar');
        loggingAutobuy("Успешно.");

        // const {login, password, shared_secret} = authData;
        // loggingAutobuy("Авторизация Steam...");
        // await page.goto('https://steamcommunity.com/login/home'); //переходим по ссылке для авторизации
        // await page.waitForSelector("._2v60tM463fW0V7GDe92E5f"); //ждем пока загрузится форма для вписывания логина/пароля
        // await page.waitFor(1000); //просто ждем 1 секунду
        // await page.click("._3BkiHun-mminuTO-Y-zXke:nth-child(1) input"); //кликаем на поле, куда нужно вписывать логин
        // await page.type("._3BkiHun-mminuTO-Y-zXke:nth-child(1) input", login); //вписываем сам логин
        // await page.waitForTimeout(500); //ждем
        // await page.click('._3BkiHun-mminuTO-Y-zXke:nth-child(2) input'); //кликаем на поле, куда нужно вписывать пароль
        // await page.type("._3BkiHun-mminuTO-Y-zXke:nth-child(2) input", password); //вписываем сам пароль
        // await page.waitForTimeout(1000); //ждем 1 секунду
        // await page.click('.DjSvCZoKKfoNSmarsEcTS'); //кликаем на кнопку "войти"
        // await page.waitForSelector("._1gzkmmy_XA39rp9MtxJfZJ"); //ждем пока прогрузится окно для ввода гуард кода
        // await page.focus("._1gzkmmy_XA39rp9MtxJfZJ > input:nth-child(1)");
        // await page.waitForTimeout(2000); //ждем 2 секунду
        // await page.keyboard.type(this.generateAuthCode(shared_secret));
        // await page.waitForTimeout(6000);
        // await page.waitForSelector('#global_actions > a > img');
        // loggingAutobuy("Успешно.");
        // loggingAutobuy("Авторизация Altskins.com...");
        // await page.goto('https://table.altskins.com/login/steam'); //переходим по ссылке для входа
        // await page.waitForTimeout(1500);
        // await page.waitForSelector('#imageLogin'); //ждем кнопку входа в Стиме
        // await page.waitForTimeout(1500);
        // await page.click('#imageLogin'); //кликаем на нее
        // await page.waitForTimeout(6000);
        // await page.waitForSelector('img.header-avatar');
        // loggingAutobuy("Успешно.");
    }

    async maxPercentInTableForAutobuy(settings, page) {
        let {
            knife,
            stattrak,
            souvenir,
            sticker,
            maxPercent,
            minPrice,
            maxPrice,
            salesFilter
        } = settings;
        let table_link = "https://table.altskins.com/ru/site/items?ItemsFilter%5Bknife%5D=0&ItemsFilter%5Bknife%5D=" + Number(knife) + "&ItemsFilter%5Bstattrak%5D=0&ItemsFilter%5Bstattrak%5D=" + Number(stattrak) + "&ItemsFilter%5Bsouvenir%5D=0&ItemsFilter%5Bsouvenir%5D=" + Number(souvenir) + "&ItemsFilter%5Bsticker%5D=0&ItemsFilter%5Bsticker%5D=" + Number(sticker) + "&ItemsFilter%5Btype%5D=1&ItemsFilter%5Bservice1%5D=showtm&ItemsFilter%5Bservice2%5D=showsteama&ItemsFilter%5Bunstable1%5D=1&ItemsFilter%5Bunstable2%5D=1&ItemsFilter%5Bhours1%5D=192&ItemsFilter%5Bhours2%5D=192&ItemsFilter%5BpriceFrom1%5D=" + minPrice + "&ItemsFilter%5BpriceTo1%5D=" + maxPrice + "&ItemsFilter%5BpriceFrom2%5D=&ItemsFilter%5BpriceTo2%5D=&ItemsFilter%5BsalesBS%5D=&ItemsFilter%5BsalesTM%5D=&ItemsFilter%5BsalesST%5D=" + salesFilter + "&ItemsFilter%5Bname%5D=&ItemsFilter%5Bservice1Minutes%5D=&ItemsFilter%5Bservice2Minutes%5D=&ItemsFilter%5BpercentFrom1%5D=" + "&ItemsFilter%5BpercentFrom2%5D=&ItemsFilter%5Btimeout%5D=5&ItemsFilter%5Bservice1CountFrom%5D=1&ItemsFilter%5Bservice1CountTo%5D=&ItemsFilter%5Bservice2CountFrom%5D=1&ItemsFilter%5Bservice2CountTo%5D=&ItemsFilter%5BpercentTo1%5D=" + maxPercent + "&ItemsFilter%5BpercentTo2%5D=";
        await page.goto(table_link);
        await page.waitForTimeout(3000);
        let skins = await page.$$('tr.tr');
        if (skins && skins.length) {
            const skin_percent_selector = await skins[0].$("td.tmsteama_class > div.percent");
            const skin_percent = await (await skin_percent_selector.getProperty('textContent')).jsonValue();
            return Number(skin_percent.replace("%", "")).toFixed(0);
        } else {
            return "100";
        }
    }

    async autobuy(marketApi, settings, page, loggingAutobuy, isAutoSold, addPurchaseItem) {
        let {
            knife,
            stattrak,
            souvenir,
            sticker,
            minPercent,
            maxPercent,
            minPrice,
            maxPrice,
            salesFilter,
            balanceLimit
        } = settings;

        let table_link = "https://table.altskins.com/ru/site/items?ItemsFilter%5Bknife%5D=0&ItemsFilter%5Bknife%5D=" + Number(knife) + "&ItemsFilter%5Bstattrak%5D=0&ItemsFilter%5Bstattrak%5D=" + Number(stattrak) + "&ItemsFilter%5Bsouvenir%5D=0&ItemsFilter%5Bsouvenir%5D=" + Number(souvenir) + "&ItemsFilter%5Bsticker%5D=0&ItemsFilter%5Bsticker%5D=" + Number(sticker) + "&ItemsFilter%5Btype%5D=1&ItemsFilter%5Bservice1%5D=showtm&ItemsFilter%5Bservice2%5D=showsteama&ItemsFilter%5Bunstable1%5D=1&ItemsFilter%5Bunstable2%5D=1&ItemsFilter%5Bhours1%5D=192&ItemsFilter%5Bhours2%5D=192&ItemsFilter%5BpriceFrom1%5D=" + minPrice + "&ItemsFilter%5BpriceTo1%5D=" + maxPrice + "&ItemsFilter%5BpriceFrom2%5D=&ItemsFilter%5BpriceTo2%5D=&ItemsFilter%5BsalesBS%5D=&ItemsFilter%5BsalesTM%5D=&ItemsFilter%5BsalesST%5D=" + salesFilter + "&ItemsFilter%5Bname%5D=&ItemsFilter%5Bservice1Minutes%5D=&ItemsFilter%5Bservice2Minutes%5D=&ItemsFilter%5BpercentFrom1%5D=" + minPercent + "&ItemsFilter%5BpercentFrom2%5D=&ItemsFilter%5Btimeout%5D=5&ItemsFilter%5Bservice1CountFrom%5D=1&ItemsFilter%5Bservice1CountTo%5D=&ItemsFilter%5Bservice2CountFrom%5D=1&ItemsFilter%5Bservice2CountTo%5D=&ItemsFilter%5BpercentTo1%5D=" + maxPercent + "&ItemsFilter%5BpercentTo2%5D="
        await page.goto(table_link);
        await page.waitForTimeout(3000);
        const purchasedItemsId = [];
        let balance = await this.getMarketBalance(marketApi);//обновление баланса
        await console.log("Balance: " + balance);

        loggingAutobuy("Поиск предметов");
        let skins = await page.$$('tr.tr');
        for (let i = 0; i < skins.length; i++) {
            let skin_name_selector = await skins[i].$("span.copy");
            let skin_name = await (await skin_name_selector.getProperty('textContent')).jsonValue();
            let skin_price_selector = await skins[i].$("span[attribute='pricetm']");
            let skin_price = await (await skin_price_selector.getProperty('textContent')).jsonValue();
            console.log(skin_name + ":" + skin_price);
            let skin_price_penny = Math.ceil(skin_price) * 100;
            console.log("Skin: " + skin_name + " Round price: " + skin_price_penny);
            for (let i = 0; i < 10; i++) {//ограничение количество покупок одного предмета
                if ((balance - Math.ceil(skin_price)) <= balanceLimit) {
                    console.log("skip item");
                    break;
                }
                const url = `https://market.csgo.com/api/v2/buy?key=${marketApi}&hash_name=${skin_name}&price=${skin_price_penny}`;
                console.log(encodeURI(url));
                let res = await fetch(encodeURI(url));
                if (!res.ok) {
                    await this.sleep(1000);
                    continue
                }
                let json = await res.json();
                console.log(json);
                if (json["success"]) {
                    loggingAutobuy("Куплен: " + skin_name + " Цена покупки: " + skin_price + " RUB");
                    purchasedItemsId.push(json.id);
                    balance -= Math.ceil(skin_price);
                } else {
                    break
                }
            }
            await this.sleep(1000);
        }
        if (isAutoSold && purchasedItemsId.length) {//check purchased items trades info
            const url = `https://market.csgo.com/api/v2/items?key=${marketApi}`;
            for (let attempt = 0; attempt < 3; attempt++) {
                let res = await fetch(encodeURI(url));
                if (!res.ok) {
                    await this.sleep(2000);
                    continue
                }
                let json = await res.json();
                if (json.success) {
                    for (let id of purchasedItemsId) {
                        for (let item of json.items) {
                            if (item.status === "3" || item.status === "4") {
                                if (item["item_id"] === id)
                                    addPurchaseItem({
                                        market_hash_name: item.market_hash_name,
                                        assetid: item.assetid,
                                        classid: item.classid,
                                        instanceid: item.instanceid,
                                        real_instance: item.real_instance
                                    });
                            }
                        }
                    }
                }
                break;
            }
        }
    }

    async autoSellPurchasedItems(community, steam_id, cookies, session_id, purchasedItems, logging, removeItem) {
        const inventoryUrl = `https://steamcommunity.com/inventory/${steam_id}/730/2?l=russian&count=5000`;
        const filteredPurchaseItems = [];
        console.log(purchasedItems);
        for (let item of purchasedItems) {
            const itemInFiltered = filteredPurchaseItems.find((elem) => elem.market_hash_name === item.market_hash_name && elem.real_instance === item.real_instance);
            if (itemInFiltered) {
                itemInFiltered.amount++;
            } else {
                filteredPurchaseItems.push({
                    ...item,
                    amount: 1
                })
            }
        }
        console.log(filteredPurchaseItems);
        const inventoryJson = await this._getInventory(inventoryUrl, session_id);
        let logText = "Проданы предметы:\n";
        for (let item of filteredPurchaseItems) {
            try {
                const inventoryItem = inventoryJson.descriptions.find((elem) => elem.market_hash_name === item.market_hash_name && elem.instanceid === item.real_instance);
                if (inventoryItem) {
                    const itemLowestPrice = await this._getPriceSteam(session_id, item.market_hash_name);
                    if (itemLowestPrice) {
                        const sellPrice = Number((itemLowestPrice - 0.05).toFixed(2));
                        const {classid} = inventoryItem;
                        const assetItems = inventoryJson.assets.filter((elem) => elem.classid === classid && elem.instanceid === item.real_instance);
                        if (assetItems && assetItems.length) {
                            for (let i = 0; i < item.amount, i < assetItems.length; i++) {
                                const {assetid} = assetItems[i];
                                const result = await this.itemSaleSteam(community, steam_id, cookies, session_id, assetid, sellPrice);
                                console.log(result)
                                if (result.success) {
                                    console.log(`SOlD ${item.market_hash_name} ${assetid} Price: ${itemLowestPrice} SoldPrice: ${sellPrice}`);
                                    removeItem(item.real_instance, item.market_hash_name);
                                    logText += `${item.market_hash_name} Цена: ${sellPrice}\n`;
                                }
                                await this.sleep(3000);
                            }
                        }
                    }
                }
            } catch (e) {
                console.log(`autoSellPurchasedItems error ${e}`)
            }
        }
        logging(logText);
    }

    async itemSaleSteam(community, steam_id, cookies, session_id, assetid, price) {
        return new Promise((resolve, reject) => {
            const newPrice = Number(((price * 100) / 1.15).toFixed(0));
            let requestOptions = {
                form: {
                    "sessionid": cookies,
                    "appid": "730",
                    "contextid": "2",
                    "assetid": assetid,
                    "amount": 1,
                    "price": newPrice + ''
                },
                headers: {
                    'Origin': 'https://steamcommunity.com',
                    'Referer': 'https://steamcommunity.com/profiles/' + steam_id + '/inventory/',
                    'Cookie': session_id,
                    "Host": "steamcommunity.com"
                },
                json: true
            }

            community.httpRequestPost("https://steamcommunity.com/market/sellitem/", requestOptions, (err, response, json) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(json);
                }
            }, "steamcommunity");
        }).then(res => res).catch(err => err);
    }
}

export const user = new User();

