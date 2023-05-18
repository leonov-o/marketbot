const remote = require('@electron/remote');
const wnd = remote.getCurrentWindow();

const request = require('request');
const fs = require("fs");
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
var data_price = false;
const file_settings = 'config.json';
const SteamCommunity = require('steamcommunity');
let community = new SteamCommunity();
var SteamTotp = require("steam-totp");
const cheerio = require("cheerio");
const {ipcRenderer} = require("electron");
ipcRenderer.on("message", function (event, text) {
  console.log("Message from updater: ", text);
} );
// https://steamcommunity.com/market/myhistory?start=500&count=500
document.querySelector(".btn-close").addEventListener("click", () => {
    wnd.close();
})
document.querySelector(".btn-turn").addEventListener("click", () => {
    wnd.minimize();
})
var menu_pos = 1;
var func_title = document.querySelector(".logs-title");
var func_calc_status = false;
var config = {};
var api_market;
var api_steam;
var steam_id;
var steam_login;
var steam_pass;
var shared_secret;
var session_id;
var list = [];
var filter_list = [];
var configJson;



function logging(text){
  var now = new Date().toLocaleTimeString();
  var div_logs_table = document.querySelector(".logs-area");
  var logs_table = document.querySelector(".logs-table");
  let li = document.createElement("li");
  li.className = "li_log";
  logs_table.appendChild(li);
  li.textContent = now + " " +text;
  div_logs_table.scrollTop = div_logs_table.scrollHeight;

}
var use = 0;
async function use_settings() {

  if (use == 0) {
    await paste_settings();
    console.log("paste_settings()")
    use = 1;
  }
  document.querySelector(".btn-use-settings").disabled = true;
  steam_login = document.querySelector(".steam-login").value;
  steam_pass = document.querySelector(".steam-pass").value;
  api_market = document.querySelector(".market-api").value;
  api_steam = document.querySelector(".steam-api").value;
  shared_secret = document.querySelector(".shared-secret").value;
  await auth_steam();
  await check_market_bal();
  await check_status_market();
}
use_settings();


function del_settings() {
  document.querySelector(".market-api").value = '';
  document.querySelector(".steam-api").value = '';
  document.querySelector(".steam-login").value = '';
  document.querySelector(".steam-pass").value = '';
  document.querySelector(".shared-secret").value = '';
  var select = document.querySelector("#account_select");
  select.innerHTML = "";
  document.querySelector(".btn-save-settings").disabled = false;
  document.querySelector(".btn-use-settings").disabled = false;
  // var config;
  // console.log(config);
  // var json = JSON.stringify(config);
  fs.writeFileSync(remote.app.getPath("userData") + '/' + file_settings, "{}", function() {});
}

function save_settings() {
    document.querySelector(".btn-use-settings").disabled = false;
    var configJson = JSON.parse(fs.readFileSync(remote.app.getPath("userData") + '/' + file_settings, "utf8"));
    var login_steam = document.querySelector(".steam-login").value;
    console.log(login_steam);
    console.log(configJson);
    if (!(login_steam in configJson )){
      var market_api = document.querySelector(".market-api").value;
      var steam_api = document.querySelector(".steam-api").value;
      var steam_login = document.querySelector(".steam-login").value;
      var steam_pass = document.querySelector(".steam-pass").value;
      var shared_secret = document.querySelector(".shared-secret").value;

      settings_list = {
        'market_api': market_api,
        'steam_api' : steam_api,
        'steam_login': steam_login,
        'steam_pass' : steam_pass,
        'shared_secret' : shared_secret
      };
      console.log(settings_list);
      config[""+login_steam+""] = settings_list;

      var select = document.querySelector("#account_select");
      var option = document.createElement("option");
      option.innerHTML = login_steam;
      option.value = login_steam;
      option.id = select.length + 1;
      select.appendChild(option);
      option.selected = true;


      console.log(config);
      var json = JSON.stringify(config);
      console.log(json);
      fs.writeFileSync(remote.app.getPath("userData") + '/' + file_settings, json, "utf-8", function() {});
    }



}
var select = document.querySelector("#account_select");

select.addEventListener("change", function(evt) {

  var expression = evt.target.value;
  console.log(expression);
  var configJson = JSON.parse(fs.readFileSync(remote.app.getPath("userData") + '/' + file_settings, "utf8"));
  console.log(configJson[""+expression+""]);
  var api_market_set = configJson[""+expression+""]["market_api"];
  var api_steam_set = configJson[""+expression+""]["steam_api"];
  var steam_login_set = configJson[""+expression+""]["steam_login"];
  var steam_pass_set = configJson[""+expression+""]["steam_pass"];
  var shared_secret_set = configJson[""+expression+""]["shared_secret"];


  document.querySelector(".market-api").value = api_market_set;
  document.querySelector(".steam-api").value = api_steam_set;
  document.querySelector(".steam-login").value = steam_login_set;
  document.querySelector(".steam-pass").value = steam_pass_set;
  document.querySelector(".shared-secret").value = shared_secret_set;
  document.querySelector(".btn-use-settings").disabled = false;



});


async function paste_settings() {
  try{
     var configJson = await JSON.parse(fs.readFileSync(remote.app.getPath("userData") + '/' + file_settings, "utf8"));
     if (!(configJson == '{}')) {
       document.querySelector(".btn-save-settings").disabled = true;
     }
     console.log(configJson);



  }catch(e) {
    console.log(e);
    logging('Заполните данные в окне "Настройки"');
    // var config = '';
    // console.log(config);
    // var json = JSON.stringify(config);
    fs.writeFileSync(remote.app.getPath("userData") + '/' + file_settings, "{}", function() {});

    configJson = JSON.parse(fs.readFileSync(remote.app.getPath("userData") + '/' + file_settings, "utf8"));
  }
  var keys = Object.keys(configJson);
  for (key in keys) {
    console.log(keys);

    console.log("for: " + keys[key]);
      api_market = configJson[keys[key]]["market_api"];
      api_steam = configJson[keys[key]]["steam_api"];
      steam_login = configJson[keys[key]]["steam_login"];
      steam_pass = configJson[keys[key]]["steam_pass"];
      shared_secret = configJson[keys[key]]["shared_secret"];
      document.querySelector(".market-api").value = api_market;
      document.querySelector(".steam-api").value = api_steam;
      document.querySelector(".steam-login").value = steam_login;
      document.querySelector(".steam-pass").value = steam_pass;
      document.querySelector(".shared-secret").value = shared_secret;
      var select = document.querySelector("#account_select");
      var option = document.createElement("option");
      option.innerHTML = steam_login;
      option.value = steam_login;
      option.id = select.length + 1;
      select.appendChild(option);
      option.selected = true;
    }

}

try {
  fetch("https://market.csgo.com/api/v2/update-inventory/?key=" + api_market);
}catch(e){}

function get_user_info() {
  try {
    var url = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=" + api_steam + "&steamids=" + steam_id;
    request(url, function(error, response, body) {
        document.querySelector(".profile-name").textContent = JSON.parse(body)["response"]["players"][0]["personaname"];
        document.querySelector(".profile-icon").setAttribute("src", JSON.parse(body)["response"]["players"][0]["avatar"]);
        console.log(JSON.parse(body)["response"]["players"][0]);
        logging('Данные о аккаунте пользователя успешно получены.');
    });
  }catch(e) {
    logging('Не удалось получить данные об аккаунте. Возможно Вы что-то не заполнили в окне "Настройки"');
  }
}

document.querySelector(".btn-main").addEventListener("click", () => {
    menu_pos = 1;
    menu_work();
});
document.querySelector(".btn-price-reg").addEventListener("click", () => {
    menu_pos = 2;
    menu_work();
});
document.querySelector(".btn-items-set").addEventListener("click", () => {
    menu_pos = 3;
    menu_work();
});
document.querySelector(".btn-autobuy").addEventListener("click", () => {
    menu_pos = 4;
    menu_work();
});
document.querySelector(".btn-send").addEventListener("click", () => {
    menu_pos = 5;
    menu_work();
});
document.querySelector(".btn-calc").addEventListener("click", () => {
    menu_pos = 6;
    menu_work();
});
document.querySelector(".btn-settings").addEventListener("click", () => {
    menu_pos = 7;
    menu_work();
});
document.querySelector(".refresh-icon").addEventListener("click", () => {
    document.querySelector(".profile-bal-market").textContent = "-";
    setTimeout(check_market_bal, 2000);
});
document.querySelector(".refresh-icon-status").addEventListener("click", () => {
    document.querySelector(".profile-trade-link").textContent = "-";
    document.querySelector(".profile-trade-check").textContent = "-";
    document.querySelector(".profile-site-online").textContent = "-";
    document.querySelector(".profile-site-notmpban").textContent = "-";
    setTimeout(check_status_market, 2000);
});
document.querySelector(".btn-about").addEventListener("click", () => {
        menu_pos = 8;
        menu_work();
    });
    // РАБОТА КНОПОК МЕНЮ
function menu_work() {
    switch (menu_pos) {
        case 1:
            func_title.textContent = "Главная";
            document.querySelector(".func-logs").style = "display:grid;"
            document.querySelector(".func-reg-price").style = "display:none;"
            document.querySelector(".func-set-items").style = "display:none;"
            document.querySelector(".func-autobuy").style = "display:none;"
            document.querySelector(".func-send").style = "display:none;"
            document.querySelector(".func-calc").style = "display:none;"
            document.querySelector(".func-settings").style = "display:none;"
            document.querySelector(".func-about").style = "display:none;"
            break;
        case 2:
            func_title.textContent = "Мониторинг цен";
            document.querySelector(".func-logs").style = "display:none;"
            document.querySelector(".func-reg-price").style = "display:block;"
            document.querySelector(".func-set-items").style = "display:none;"
            document.querySelector(".func-autobuy").style = "display:none;"
            document.querySelector(".func-send").style = "display:none;"
            document.querySelector(".func-calc").style = "display:none;"
            document.querySelector(".func-settings").style = "display:none;"
            document.querySelector(".func-about").style = "display:none;"
            break;
        case 3:
            func_title.textContent = "Выставление предметов";
            document.querySelector(".func-logs").style = "display:none;"
            document.querySelector(".func-reg-price").style = "display:none;"
            document.querySelector(".func-set-items").style = "display:block;"
            document.querySelector(".func-autobuy").style = "display:none;"
            document.querySelector(".func-send").style = "display:none;"
            document.querySelector(".func-calc").style = "display:none;"
            document.querySelector(".func-settings").style = "display:none;"
            document.querySelector(".func-about").style = "display:none;"
            break;
        case 4:
            func_title.textContent = "Autobuy";
            document.querySelector(".func-logs").style = "display:none;"
            document.querySelector(".func-reg-price").style = "display:none;"
            document.querySelector(".func-set-items").style = "display:none;"
            document.querySelector(".func-autobuy").style = "display:block;"
            document.querySelector(".func-send").style = "display:none;"
            document.querySelector(".func-calc").style = "display:none;"
            document.querySelector(".func-settings").style = "display:none;"
            document.querySelector(".func-about").style = "display:none;"
            break;
        case 5:
            func_title.textContent = "Перенос баланса";
            document.querySelector(".func-logs").style = "display:none;"
            document.querySelector(".func-reg-price").style = "display:none;"
            document.querySelector(".func-set-items").style = "display:none;"
            document.querySelector(".func-autobuy").style = "display:none;"
            document.querySelector(".func-send").style = "display:block;"
            document.querySelector(".func-calc").style = "display:none;"
            document.querySelector(".func-settings").style = "display:none;"
            document.querySelector(".func-about").style = "display:none;"
            break;
        case 6:
            func_title.textContent = "Калькулятор выгоды";
            document.querySelector(".func-logs").style = "display:none;"
            document.querySelector(".func-reg-price").style = "display:none;"
            document.querySelector(".func-set-items").style = "display:none;"
            document.querySelector(".func-autobuy").style = "display:none;"
            document.querySelector(".func-send").style = "display:none;"
            document.querySelector(".func-calc").style = "display:block;"
            document.querySelector(".func-settings").style = "display:none;"
            document.querySelector(".func-about").style = "display:none;"
            break;
        case 7:
            func_title.textContent = "Настройки";
            document.querySelector(".func-logs").style = "display:none;"
            document.querySelector(".func-reg-price").style = "display:none;"
            document.querySelector(".func-set-items").style = "display:none;"
            document.querySelector(".func-autobuy").style = "display:none;"
            document.querySelector(".func-send").style = "display:none;"
            document.querySelector(".func-calc").style = "display:none;"
            document.querySelector(".func-settings").style = "display:block;"
            document.querySelector(".func-about").style = "display:none;"
            break;
        case 8:
            func_title.textContent = "О программе";
            document.querySelector(".func-logs").style = "display:none;"
            document.querySelector(".func-reg-price").style = "display:none;"
            document.querySelector(".func-set-items").style = "display:none;"
            document.querySelector(".func-autobuy").style = "display:none;"
            document.querySelector(".func-send").style = "display:none;"
            document.querySelector(".func-calc").style = "display:none;"
            document.querySelector(".func-settings").style = "display:none;"
            document.querySelector(".func-about").style = "display:block;"
            break;
    }
}
// РАБОТА КАЛЬКУЛЯТОРА
function calc() {
    document.querySelector(".calc_price_without_commission").textContent = (s_price.value - s_price.value / 100 * commission.value);
    document.querySelector(".calc_profit").textContent = ((s_price.value - s_price.value / 100 * commission.value) / f_price.value + "x");
}
var f_price = document.querySelector("#f_price");
var s_price = document.querySelector("#s_price");
var commission = document.querySelector("#commission");
f_price.addEventListener("input", () => {
    f_price.value = f_price.value.replace(",", ".");
    f_price.value = f_price.value.replace(/[^0-9\.]/g, "");
    calc();
});
s_price.addEventListener("input", () => {
    s_price.value = s_price.value.replace(",", ".");
    s_price.value = s_price.value.replace(/[^0-9\.]/g, "");
    calc();
});
commission.addEventListener("input", () => {
    commission.value = commission.value.replace(",", ".");
    commission.value = commission.value.replace(/[^0-9\.]/g, "");
    calc();
});
/////////////////////////////////////////////////////////////////
setInterval(() => {fetch("https://market.csgo.com/api/v2/update-inventory/?key=" + api_market)}, 60000);

//ОБНОВЛЕНИЕ БАЛАНСА МАРКЕТА
async function check_market_bal() {
  var response = await fetch(encodeURI("https://market.csgo.com/api/v2/get-money?key=" + api_market));
  if (response.ok) {
      console.log(response);
      var body = await response.json();
      console.log(body);
      document.querySelector(".profile-bal-market").textContent = await body["money"] + " " + body["currency"];
  } else {
      document.querySelector(".profile-bal-market").textContent = "???";
  }
}
// async function check_market_bal() {
//     await request("https://market.csgo.com/api/v2/get-money?key=" + api_market, async function(error, response, body) {
//         if (response.statusCode === 200) {
//             console.log(body);
//             document.querySelector(".profile-bal-market").textContent = await JSON.parse(body)["money"] + " " + JSON.parse(body)["currency"];
//         } else {
//             console.error('error:', error);
//             document.querySelector(".profile-bal-market").textContent = "???";
//         }
//     });
//
// }
/////////////////////////////////////////////////////////////////
//ОБНОВЛЕНИЕ СТАТУСА НА МАРКЕТЕ
function check_status_market() {
    request("https://market.csgo.com/api/v2/test?key=" + api_market, function(error, response, body) {
        if (response.statusCode === 200) {
            console.log('body:', body);
            var user_token = JSON.parse(body)["status"]["user_token"];
            var trade_check = JSON.parse(body)["status"]["trade_check"];
            var site_online = JSON.parse(body)["status"]["site_online"];
            var site_notmpban = JSON.parse(body)["status"]["site_notmpban"];
            if (user_token == true) {
                document.querySelector(".profile-trade-link").textContent = "✔";
                document.querySelector(".profile-trade-link").style = "color: #0F9E52;";
            } else {
                document.querySelector(".profile-trade-link").textContent = "✘";
                document.querySelector(".profile-trade-link").style = "color: #A3180A;";
            }
            if (trade_check == true) {
                document.querySelector(".profile-trade-check").textContent = "✔";
                document.querySelector(".profile-trade-check").style = "color: #0F9E52;";
            } else {
                document.querySelector(".profile-trade-check").textContent = "✘";
                document.querySelector(".profile-trade-check").style = "color: #A3180A;";
            }
            if (site_online == true) {
                document.querySelector(".profile-site-online").textContent = "✔";
                document.querySelector(".profile-site-online").style = "color: #0F9E52;";
            } else {
                document.querySelector(".profile-site-online").textContent = "✘";
                document.querySelector(".profile-site-online").style = "color: #A3180A;";
            }
            if (site_notmpban == true) {
                document.querySelector(".profile-site-notmpban").textContent = "Отсутствует";
                document.querySelector(".profile-site-notmpban").style = "color: #0F9E52;";
            } else {
                document.querySelector(".profile-site-notmpban").textContent = "Присутствует";
                document.querySelector(".profile-site-notmpban").style = "color: #A3180A;";
            }
        } else {
            console.error('error:', error);
            document.querySelector(".profile-trade-link").textContent = "???";
            document.querySelector(".profile-trade-check").textContent = "???";
            document.querySelector(".profile-site-online").textContent = "???";
            document.querySelector(".profile-site-notmpban").textContent = "???";
        }
    })
}
/////////////////////////////////////////////////////////////////
setTimeout(check_market_bal, 2000);
setTimeout(check_status_market, 2000);
/////////////////////////////////////////////////////////////////
//МОНИТОРИНГ ЦЕН
document.querySelector(".save-reg").addEventListener("click", () => save_reg_price());
document.querySelector(".paste-reg").addEventListener("click", () => paste_reg_price());

function paste_reg_price() {
  var save_list = [];
  save_list = JSON.parse(fs.readFileSync(remote.app.getPath("userData") + '/save_price_reg.json', "utf8"));
  document.querySelectorAll(".li_newItem").forEach((item, i) => {
    var data_name = item.getAttribute("data-name");
    var search = save_list.indexOf(data_name);
    try {
      var name = save_list[search];
      var min_limit = save_list[search+1];
      var max_limit = save_list[search+2];
      document.querySelector("li[data-name = '" + name + "'] input[class= 'min-limit-market']").value = min_limit;
      document.querySelector("li[data-name = '" + name + "'] input[class= 'max-limit-market']").value = max_limit;
    }catch(e){

    }
  });

}

function save_reg_price() {
  var save_list = [];
  document.querySelectorAll(".li_newItem").forEach((item, i) => {
    var name = item.getAttribute("data-name");
    console.log(name);
    var min_limit = document.querySelector("li[data-name = '" + name + "'] input[class= 'min-limit-market']").value;
    if (min_limit == "") {
      document.querySelector("li[data-name = '" + name + "'] input[class= 'min-limit-market']").value = 0;
      min_limit = "0";
    }
    var max_limit = document.querySelector("li[data-name = '" + name + "'] input[class= 'max-limit-market']").value;
    if (max_limit == "") {
      document.querySelector("li[data-name = '" + name + "'] input[class= 'max-limit-market']").value = 0;
      max_limit = "0";
    }

    save_list.push(name,  min_limit, max_limit);
  });
  fs.writeFile(remote.app.getPath("userData") + '/save_price_reg.json', JSON.stringify(save_list), function () {});

}



function show_item_info(e) {
    document.querySelector(".market_hash_name").textContent = e.getAttribute("data-name");
    document.querySelector(".item_id_steam").textContent = e.getAttribute("data-id");
    document.querySelector(".item_id_market").textContent = e.getAttribute("data-class-ins-id");
    document.querySelector(".item_price").textContent = e.getAttribute("data-price") + " " + e.getAttribute("data-currency");
    document.querySelector(".item-image").src = e.getAttribute("data-image")+'128x128';
    document.querySelector(".min_price").textContent = "";
    document.querySelector(".best_offer").textContent = "";


}
document.querySelector(".refresh-items").addEventListener("click", () => refresh_inv());

function show_min_price() {
    document.querySelector(".status-code").textContent = '-';
    var market_hash_name = document.querySelector(".market_hash_name").textContent;
    request(encodeURI("https://market.csgo.com/api/v2/search-item-by-hash-name?key=" + api_market + "&hash_name=" + market_hash_name), function(error, response, body) {
        document.querySelector(".status-code").textContent = response.statusCode;
        var min_price_coin = JSON.parse(body)["data"][0]["price"];
        var min_price = min_price_coin / 100;
        document.querySelector("li[data-name = '" + market_hash_name + "']").setAttribute("data-min-price", min_price);
        document.querySelector(".min_price").textContent = min_price + " RUB";
        console.log("min: ", min_price);
    });
}

function show_best_offer() {
    document.querySelector(".status-code").textContent = '-';
    var classid_instanceid = document.querySelector(".item_id_steam").textContent;
    request("https://market.csgo.com/api/BestBuyOffer/" + classid_instanceid + "/?key=" + api_market, function(error, response, body) {
        document.querySelector(".status-code").textContent = response.statusCode;
        var best_offer_coin = JSON.parse(body)["best_offer"];
        var best_offer = best_offer_coin / 100;
        document.querySelector(".best_offer").textContent = best_offer + " RUB";
        console.log("bestOffer: ", best_offer);
    });
}

function refresh_inv() {
    document.querySelector(".status-code").textContent = '-';
    var list = document.querySelector(".items-content-reg");
    list.innerHTML = '';
    request("https://market.csgo.com/api/v2/items?key=" + api_market, function(error, response, body) {
        document.querySelector(".status-code").textContent = response.statusCode;
        try {
            var item_list = [];
            console.log(item_list);
            for (i = 0;; i++) {
                var market_hash_name = JSON.parse(body)["items"][i]["market_hash_name"];
                var item_id = JSON.parse(body)["items"][i]["item_id"];
                var class_id = JSON.parse(body)["items"][i]["classid"];
                var instance_id = JSON.parse(body)["items"][i]["instanceid"];
                var classid_instanceid = class_id + "_" + instance_id;
                var status = JSON.parse(body)["items"][i]["status"];
                var item_price = JSON.parse(body)["items"][i]["price"];
                var currency = JSON.parse(body)["items"][i]["currency"];
                // if (status == "2") update inv cash
                if (item_list.includes(market_hash_name) === false && status == "1") {
                    let li = document.createElement("li");
                    li.className = "li_newItem";
                    li.setAttribute("data-name", market_hash_name);
                    li.setAttribute("data-id", classid_instanceid);
                    li.setAttribute("data-class-ins-id", item_id);
                    li.setAttribute("data-price", item_price);
                    li.setAttribute("data-min-price", "");
                    li.setAttribute("data-currency", currency);
                    li.setAttribute("onclick", "show_item_info(this)");
                    var opt = {
                      "query" : market_hash_name,
                      "appid" : 730,
                      "searchDescriptions" : false
                    }
                    community.marketSearch(opt, function(err, items) {
                      li.setAttribute("data-image", items[0]["image"]);

                    })
                    list.appendChild(li);
                    li.innerHTML = "<span class='item-name'>" + market_hash_name + "</span><input class='min-limit-market'><input class='max-limit-market'>";
                    document.querySelector("li[data-name = '" + market_hash_name + "'] input[class= 'max-limit-market']").value = Math.round(item_price + (item_price/100)*50);
                    console.log(market_hash_name);
                    item_list.push(market_hash_name);
                    console.log(class_id);

                }
            }
        } catch (e) {
            var li = document.createElement("li");
            li.className = "li_Item";
            list.appendChild(li);
            li.textContent = "-";
            console.log(e);
        }
    });
}
// получить текущий список предметов api
// обновить инфу о моей и мин цене
// проверить лимиты
// действие

async function reg_price() {
    document.querySelector(".status-code").textContent = '-';
    try {
        reg_item_list = [];
        let response = await fetch("https://market.csgo.com/api/v2/items?key=" + api_market);
        if (response.ok) {
            console.log("response OK");
            document.querySelector(".status-code").textContent = '-';
            document.querySelector(".status-code").textContent = "OK";
        } else {
            console.log("response NOT OK");
            document.querySelector(".status-code").textContent = '-';
            document.querySelector(".status-code").textContent = "NOT OK";
            return;
        }
        var data = await response.json();
        for (i = 0;; i++) {
             let market_hash_name = data["items"][i]["market_hash_name"];
             let item_id = data["items"][i]["item_id"];
             let class_id = data["items"][i]["classid"];
             let instance_id = data["items"][i]["instanceid"];
             let classid_instanceid = class_id + "_" + instance_id;
             let status = data["items"][i]["status"];
             let item_price = data["items"][i]["price"];
             let currency = data["items"][i]["currency"];
            if (status == "2") {
              let take_offer = await fetch("https://market.csgo.com/api/v2/trade-request-give-p2p-all?key=" + api_market);
              let upd_inv = await fetch("https://market.csgo.com/api/v2/update-inventory/?key=" + api_market);
              console.log("status = 2 upd")

            }

            if (reg_item_list.includes(market_hash_name) === false && status == "1") {
                let search_min_price = await fetch(encodeURI("https://market.csgo.com/api/v2/search-item-by-hash-name?key=" + api_market + "&hash_name=" + market_hash_name));
                if (search_min_price.ok) {
                    console.log("search_min_price OK");
                    document.querySelector(".status-code").textContent = '-';
                    document.querySelector(".status-code").textContent = "OK";
                } else {
                    console.log("search_min_price NOT OK");
                    document.querySelector(".status-code").textContent = '-';
                    document.querySelector(".status-code").textContent = "NOT OK";
                    continue;
                }
                let min_price_data = await search_min_price.json();
                let min_price_coin = min_price_data["data"][0]["price"];
                let second_price_coin = min_price_data["data"][1]["price"];
                let min_price = min_price_coin / 100;
                document.querySelector("li[data-name = '" + market_hash_name + "']").setAttribute("data-min-price", min_price);
                document.querySelector("li[data-name = '" + market_hash_name + "']").setAttribute("data-price", item_price);
                let min_limit = await document.querySelector("li[data-name = '" + market_hash_name + "']").getAttribute('data-minlimit');
                let max_limit = await document.querySelector("li[data-name = '" + market_hash_name + "']").getAttribute('data-maxlimit');
                if (min_limit == '') {
                  document.querySelector("li[data-name = '" + market_hash_name + "']").setAttribute("data-minlimit", 0);
                  min_limit = 0;
                }

                if (item_price * 100 > min_price_coin && min_price_coin > min_limit * 100 && min_price_coin < max_limit * 100) {

                    let res_low_price = await fetch("https://market.csgo.com/api/MassSetPrice/" + classid_instanceid + "/" + (min_price_coin - 3) + "/?key=" + api_market);
                    logging("Скин: " + market_hash_name + " Старая цена: " + item_price + " Новая цена: " + (min_price_coin - 3)/100 + " Мин. порог: " + min_limit +  " Действие: понижение цены ");
                    console.log("Скин: " + market_hash_name + "Старая цена:" + item_price + "Новая цена:" + (min_price_coin - 3) +  "Действие: понижение");

                    if (res_low_price.ok) {
                        console.log("res_low_price OK");
                        document.querySelector(".status-code").textContent = '-';
                        document.querySelector(".status-code").textContent = "OK";
                    } else {
                        console.log("res_low_price NOT OK");
                        document.querySelector(".status-code").textContent = '-';
                        document.querySelector(".status-code").textContent = "NOT OK";
                    }
                }
                if (item_price * 100 == min_price_coin && second_price_coin > min_price_coin && second_price_coin > min_limit * 100 && item_price * 100 < second_price_coin - 3 && second_price_coin < max_limit * 100) {
                    let res_high_price = await fetch("https://market.csgo.com/api/MassSetPrice/" + classid_instanceid + "/" + (second_price_coin - 3) + "/?key=" + api_market);
                    logging("Скин: " + market_hash_name + " Старая цена: " + item_price + " Новая цена: " + (min_price_coin - 3)/100 + " Макс. порог: " + max_limit +  " Действие: повышение цены ");

                    console.log("Скин: " + market_hash_name + " Старая цена: " + item_price + " Новая цена: " + (second_price_coin - 3) +  " Действие: повышение ");

                    if (res_high_price.ok) {
                        console.log("res_high_price OK");
                        document.querySelector(".status-code").textContent = '-';
                        document.querySelector(".status-code").textContent = "OK";
                    } else {
                        console.log("res_high_price NOT OK");
                        document.querySelector(".status-code").textContent = '-';
                        document.querySelector(".status-code").textContent = "NOT OK";
                    }
                }
                reg_item_list.push(market_hash_name);

            }
        }
    } catch (e) {
        console.log(e);
    }
}




var start_timer;
document.querySelector(".btn-start").addEventListener("click", () => {
    document.querySelector(".sp-ind").style = 'background-color: #3fff009e';
    document.querySelector(".btn-start").setAttribute("disabled", "true");
    document.querySelector(".btn-refresh").setAttribute("disabled", "true");
    document.querySelectorAll(".li_newItem").forEach((item, i) => {
      let min_limit = item.querySelector(".min-limit-market").value;
      let max_limit = item.querySelector(".max-limit-market").value;
      item.setAttribute("data-minlimit",min_limit);
      item.setAttribute("data-maxlimit",max_limit);
      item.querySelector(".min-limit-market").setAttribute("disabled", "true");
      item.querySelector(".max-limit-market").setAttribute("disabled", "true");

    });

    start_timer = setTimeout(async function  tick() {
      await reg_price();
      start_timer = setTimeout(tick, 15000); // (*)
    }, 15000);
});
document.querySelector(".btn-stop").addEventListener("click", () => {
    document.querySelector(".sp-ind").style = 'background-color: #ff000066';
    document.querySelector(".btn-start").removeAttribute("disabled");
    document.querySelector(".btn-refresh").removeAttribute("disabled");
    document.querySelectorAll(".li_newItem input").forEach((item, i) => {
      item.removeAttribute("disabled");
    });
    clearTimeout(start_timer);
});
////////////////////////////////////////////////////////////////

//АВТОРИЗАЦИЯ СТИМ(ПОЛУЧЕНИЕ ID? SESSIONID)
function auth_steam(){
  try {
    var code = SteamTotp.generateAuthCode(shared_secret);
    console.log(code);
  }catch(e){
    logging('Не удалось сгенерировать SteamGuard код, возможно Вы не ввели shared_secret в окне "Настройки"');
  }

  var details = {
      "accountName": steam_login,
      "password": steam_pass,
      "twoFactorCode": code,
  };
  community.login(details, function (err, cookies, sessionID, steamguard, oAuthToken) {
    console.log(err, sessionID);
    steam_id  = steamguard.split("||")[0];
    session_id = sessionID;
    console.log("steamid: ", steam_id);
    try {
        get_user_info();
    } catch (e) {}
    });
  }

///////////////////////////////////////////////////////////////

//ПОЛУЧЕНИЕ БАЗЫ ПОКУПОК СТИМ
async function loadDataPrice() {
  document.querySelectorAll(".btn-load-data").forEach((item, i) => {
    item.remove();
  });

  if (data_price == false) {
    document.querySelectorAll(".wait-data").forEach((item, i) => {
      item.textContent = "  wait...";
    });

    for (var start = 0; start <=2500; start+=500){
      var url = "https://steamcommunity.com/market/myhistory?start=" + start + "&count=500";

      const response = await fetch(url, {headers: {cookie: session_id.join(";")}});
      const data = await response.json();
      const html = data["results_html"];
      const $ = cheerio.load(html);
      var html_fs = $.html();
      await $(".market_listing_item_name").slice(0, 500).each((idx, elem) => {
          let name = $(elem).text();
          var pos = 1;
          var price = 2;
          list.push([name]);

      });
      await $(".market_listing_price").slice(0, 500).each((idx, elem) => {
          let price = $(elem).text().replace("\n", "").replace(/\t/g, "");
          var index = idx + start;
          list[index].push(price.replace("pуб.", '').replace(",", ".").replace(/\s/g, ""));
      });
      await $(".market_listing_listed_date_combined").slice(0, 500).each((idx, elem) => {
          let pos = $(elem).text().split(":")[0].replace("\n", "").replace(/\t/g, "");
          var index = idx + start;

          list[index].push(pos);
      });
      await console.log("listBefore: ", list.length);
    }

    list = list.filter(item => item[2] == 'Purchased');

    console.log("listAfter: ", list.length);
    list.forEach((item, i) => {
        if (filter_list.includes(item[0]) == false) {
            filter_list.push(item[0], item[1]);
            // console.log("add item");
        }
      });
    console.log(filter_list);
    data_price = true;
  }
  document.querySelectorAll(".wait-data").forEach((item, i) => {
    item.textContent = "  ✔";
  });

}


function show_steam_price() {
  var market_hash_name = document.querySelector(".market_hash_name").textContent.split("(")[0].replace("(",'').trim();
  console.log(market_hash_name);
  var item_index = filter_list.indexOf(market_hash_name);// ВДРУГ ПЕРЕСТАНЕТ РАБОТАТЬ УБЕРИ VAR
  if (item_index == -1) {
    document.querySelector(".steam_price").textContent = "Не найдено :(";

  }else{
    console.log(item_index + " price: " + filter_list[item_index + 1] + " RUB");
    document.querySelector(".steam_price").textContent = filter_list[item_index + 1] + " RUB";
  }

}
///////////////////////////////////////////////////////////////

document.querySelector(".refresh-items-set").addEventListener("click", () => refresh_set_inv());
document.querySelector(".start-set").addEventListener("click", () => set_items());

//ВЫСТАВЛЕНИЕ ПРЕДМЕТОВ
async function refresh_set_inv() {
  var list_set = document.querySelector(".items-content-set");
  list_set.innerHTML = '';
  while (true) {
    console.log("while start")
    try {
      var response = await fetch(encodeURI("https://market.csgo.com/api/v2/my-inventory/?key=" + api_market));
      var data = await response.json();
      break;
    } catch (e) {
      console.log(e);
    }
  }


  var items = [];
  try {
      for (i = 0;; i++) {
          var market_hash_name = data["items"][i]["market_hash_name"];
          var id = data["items"][i]["id"];
          var class_id = data["items"][i]["classid"];
          var instance_id = data["items"][i]["instanceid"];
          var classid_instanceid = class_id + "_" + instance_id;
          if (items.includes(market_hash_name) === false) {
            while (true) {
              console.log("minwhile start")

              try {
                var min_price_response = await fetch(encodeURI("https://market.csgo.com/api/v2/search-item-by-hash-name?key=" + api_market + "&hash_name=" + market_hash_name));
                console.log(min_price_response);
                var min_price_json = await min_price_response.json();
                break;
              }catch(e) {
                console.log(e);
              }
            }
              var min_price = min_price_json["data"][0]["price"]/100;
              let li = document.createElement("li");
              li.className = "li_newItemSet";
              li.setAttribute("data-name", market_hash_name);
              li.setAttribute("data-id", id);
              li.setAttribute("data-class-ins-id", classid_instanceid);
              li.setAttribute("data-min-price", min_price);
              if (data_price == false) steam_price_set = "...";
              if (data_price == true) {
                var market_hash_name_for_data = market_hash_name.split("(")[0].replace("(",'').trim();
                var item_index = filter_list.indexOf(market_hash_name_for_data);// ВДРУГ ПЕРЕСТАНЕТ РАБОТАТЬ УБЕРИ VAR
                if (item_index == -1) {
                  steam_price_set = "...";

                }else{
                  steam_price_set = filter_list[item_index + 1];
                }

              }

              li.innerHTML = '<span class="item_name">' + market_hash_name + '</span><span class="min_price_set">' + min_price + ' RUB</span><span class="buy_price">' + steam_price_set + ' RUB</span><input type="text" class="set_price">';
              list_set.appendChild(li);
              items.push(market_hash_name);
              if(steam_price_set != "...") {
                if (min_price >= steam_price_set){
                  document.querySelector("li[data-name = '" + market_hash_name + "'] input[class= 'set_price']").value = Math.round(min_price);
                }else{
                  document.querySelector("li[data-name = '" + market_hash_name + "'] input[class= 'set_price']").value = Math.round(steam_price_set);
              }
            }

          }
      }
  } catch (e) {
      console.log(e);
  }
}

async function set_items() {
    document.querySelector(".btn-refresh-set").setAttribute("disabled", "true");
    document.querySelector(".btn-start-set").setAttribute("disabled", "true");
    document.querySelectorAll(".li_newItemSet input").forEach((item, i) => {
        item.setAttribute("disabled", "true");
    });
    while (true) {
        console.log("while start")
        try {
            var response = await fetch("https://market.csgo.com/api/v2/my-inventory/?key=" + api_market);
            var data = await response.json();
            break;
        } catch (e) {
            console.log(e);
        }
    }
    try {
        for (i = 0;; i++) {
            console.log(i)
            var market_hash_name = data["items"][i]["market_hash_name"];
            var id = data["items"][i]["id"];
            var class_id = data["items"][i]["classid"];
            var instance_id = data["items"][i]["instanceid"];
            var classid_instanceid = class_id + "_" + instance_id;
            try{
              var my_price = document.querySelector("li[data-name = '" + market_hash_name + "'] input[class= 'set_price']").value;

            }catch(e) {
              continue;
            }
            if (my_price == '') document.querySelector("li[data-name = '" + market_hash_name + "']").remove();
            else {
                while (true) {
                    try {
                        console.log("else work")
                        var set_on_price = await fetch("https://market.csgo.com/api/SetPrice/new_" + classid_instanceid + "/" + my_price * 100 + "/?key=" + api_market);
                        var set_on_price_js = await set_on_price.json();
                        console.log(set_on_price_js);
                        break;
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        }
    } catch (e) {
        console.log(e);
        document.querySelector(".btn-refresh-set").removeAttribute("disabled");
        document.querySelector(".btn-start-set").removeAttribute("disabled");
        document.querySelectorAll(".li_newItemSet input").forEach((item, i) => {
            item.removeAttribute("disabled");
        });
        var upd_inv = await fetch("https://market.csgo.com/api/v2/update-inventory/?key=" + api_market);
        refresh_set_inv();
    }
}
///////////////////////////////////////////////////////////////
//окно AUTOBUY
function loggingAutobuy(text) {
  var now = new Date().toLocaleTimeString();
  var div_autobuy = document.querySelector(".autobuy-logs");
  var logs_autobuy = document.querySelector(".autobuy-logs-table");
  let li = document.createElement("li");
  li.className = "new-autobuy-log";
  logs_autobuy.appendChild(li);
  li.textContent = now + " " +text;
  div_autobuy.scrollTop = div_autobuy.scrollHeight;
}
var guard_input =false;
var browser, page;

async function loginInSteam() {
  //var executablePath = puppeteer.executablePath() //для разработки
  var executablePath = puppeteer.executablePath().replace("app.asar", "app.asar.unpacked") //для публикации
  browser = await puppeteer.launch({executablePath: executablePath, headless: true, args: ['--start-fullscreen'] });
  page = await browser.newPage();
  // await page.setViewport({ width: 1366, height: 768});
  // await page.setExtraHTTPHeaders({
  //       'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36',
  //       'accept': 'application/json, text/plain, */*',
  //       'accept-encoding': 'gzip, deflate, br',
  //       'accept-language': 'ru-RU,ru;q=0.9'
  //   })
  loggingAutobuy("Авторизация Steam...");
  await page.goto('https://steamcommunity.com/login/home'); //переходим по ссылке для авторизации
//   await page.screenshot({
//   path: 'screenshot.jpg'
// });

  await page.waitForSelector(".newlogindialog_LoginForm_3Tsg9"); //ждем пока загрузится форма для вписывания логина/пароля
  await page.waitFor(1000); //просто ждем 1 секунду
  await page.click('.newlogindialog_TextField_2KXGK:first-child input'); //кликаем на поле, куда нужно вписывать логин
  await page.type(".newlogindialog_TextField_2KXGK:first-child input", steam_login); //вписываем сам логин
  await page.click('.newlogindialog_TextField_2KXGK:nth-child(2) input'); //кликаем на поле, куда нужно вписывать пароль
  await page.type(".newlogindialog_TextField_2KXGK:nth-child(2) input", steam_pass); //вписываем сам пароль
  await page.waitFor(1000); //ждем 1 секунду
  await page.click('.newlogindialog_SignInButtonContainer_14fsn .newlogindialog_SubmitButton_2QgFE'); //кликаем на кнопку "войти"
//   await page.screenshot({
//   path: 'screenshot2.jpg'
// });
  await page.waitForSelector(".segmentedinputs_SegmentedCharacterInput_3PDBF"); //ждем пока прогрузится окно для ввода гуард кода
  if (shared_secret == ''){
    //ввод стим гвард
    document.querySelector(".steamguard-dialog").style = "display: block;"
    loggingAutobuy("Введите SteamGuard код в поле справа -->");
    while (guard_input == false){
      loggingAutobuy("Ожидание ввода...")
      await page.waitFor(3000); //ждем 3 секунду
    }
    if (guard_input == true){
      var code = document.querySelector(".code-input").value;
      loggingAutobuy("SteamGuard код введен.")
      document.querySelector(".steamguard-dialog").style = "display: none;"
      guard_input = false;

    }
  }else {
    var code = SteamTotp.generateAuthCode(shared_secret); //генерируем гуард код

  }
  await page.keyboard.type(code); //печатаем на клавиатуре наш код (просто page.type() - не работает)
  await page.waitFor(1000); //ждем 1 секунду
  // await page.click('#login_twofactorauth_buttonset_entercode > div.auth_button.leftbtn > div.auth_button_h3'); //кликаем на кнопку подтвердить/войти
  //ждем пока прогрузится наш профиль (если появилась кнопка РЕДАКТИРОВАТЬ, то значит мы залогинились) костыль конечно, но как сделать по другому не совсем понятно.
  await page.waitFor(5000); //ждем 2 секунду
//   await page.screenshot({
//   path: 'screenshot3.jpg'
// });

  await page.waitForSelector('#global_actions > a > img');
  console.log('Залогинились в Steam'); //выводим в коносль что залогинились
  loggingAutobuy("Успешно.");

}

async function loginInTable() {
  loggingAutobuy("Авторизация Altskins.com...");
  await page.goto('https://table.altskins.com/login/steam'); //переходим по ссылке для входа
  await page.waitFor(1500);
  await page.waitForSelector('#imageLogin'); //ждем кнопку входа в Стиме
  await page.waitFor(1500);
  await page.click('#imageLogin'); //кликаем на нее
  await page.waitFor(3000);
  console.log('Залогинились в Altskins'); //выводим в коносль что залогинились
  loggingAutobuy("Успешно.");


}

async function parseTable() {
    var min_price = document.querySelector(".min_price_autobuy").value;
    var max_price = document.querySelector(".max_price_autobuy").value;
    var filter = document.querySelector(".filter_autobuy").value;
    var min_percent = document.querySelector(".min_percent_autobuy").value;
    var max_percent = document.querySelector(".max_percent_autobuy").value;
    var limit_balance = document.querySelector(".limit_autobuy").value

    var knife = document.querySelector(".knife_autobuy");
    var stattrak = document.querySelector(".stattrak_autobuy");
    var souvenir = document.querySelector(".souvenir_autobuy");
    var sticker = document.querySelector(".sticker_autobuy");
    if (knife.checked) {
      knife = 1;
    }else {
      knife = 0;
    }

    if (stattrak.checked) {
      stattrak = 1;
    }else {
      stattrak = 0;
    }

    if (souvenir.checked) {
      souvenir = 1;
    }else {
      souvenir = 0;
    }

    if (sticker.checked) {
      sticker = 1;
    }else {
      sticker = 0;
    }

    var csgo_link = "https://table.altskins.com/ru/site/items?ItemsFilter%5Bknife%5D=0&ItemsFilter%5Bknife%5D="+knife+"&ItemsFilter%5Bstattrak%5D=0&ItemsFilter%5Bstattrak%5D="+stattrak+"&ItemsFilter%5Bsouvenir%5D=0&ItemsFilter%5Bsouvenir%5D="+souvenir+"&ItemsFilter%5Bsticker%5D=0&ItemsFilter%5Bsticker%5D="+sticker+"&ItemsFilter%5Btype%5D=1&ItemsFilter%5Bservice1%5D=showtm&ItemsFilter%5Bservice2%5D=showsteama&ItemsFilter%5Bunstable1%5D=1&ItemsFilter%5Bunstable2%5D=1&ItemsFilter%5Bhours1%5D=192&ItemsFilter%5Bhours2%5D=192&ItemsFilter%5BpriceFrom1%5D="+min_price+"&ItemsFilter%5BpriceTo1%5D="+max_price+"&ItemsFilter%5BpriceFrom2%5D=&ItemsFilter%5BpriceTo2%5D=&ItemsFilter%5BsalesBS%5D=&ItemsFilter%5BsalesTM%5D=&ItemsFilter%5BsalesST%5D="+filter+"&ItemsFilter%5Bname%5D=&ItemsFilter%5Bservice1Minutes%5D=&ItemsFilter%5Bservice2Minutes%5D=&ItemsFilter%5BpercentFrom1%5D="+min_percent+"&ItemsFilter%5BpercentFrom2%5D=&ItemsFilter%5Btimeout%5D=5&ItemsFilter%5Bservice1CountFrom%5D=1&ItemsFilter%5Bservice1CountTo%5D=&ItemsFilter%5Bservice2CountFrom%5D=1&ItemsFilter%5Bservice2CountTo%5D=&ItemsFilter%5BpercentTo1%5D="+max_percent+"&ItemsFilter%5BpercentTo2%5D="


    console.log("min_price: " + min_price);
    console.log("max_price: " + max_price);
    console.log("min_percent: " + min_percent);
    console.log("max_percent: " + max_percent);
    console.log("filter: " + filter);
    console.log("limit_balance: " + limit_balance);
    console.log("knife: " + knife);
    console.log("stattrak: " + stattrak);
    console.log("souvenir: " + souvenir);
    console.log("sticker: " + sticker);




    await page.goto(csgo_link); //переходим по ссылке  с настройками
    var skins = await page.$$('tr.tr');
    try {
      await check_market_bal();//обновление баланса
      var check_bal_m = await document.querySelector(".profile-bal-market").textContent;
      var check_bal = await check_bal_m.replace(" RUB", "");

      await console.log("Balance: " + check_bal);

    } catch (e) {

    }

    loggingAutobuy("Поиск предметов");
    for (let i = 0; i < skins.length; i++) {
        var skin_name_sel = await skins[i].$("span.copy");
        var skin_name = await (await skin_name_sel.getProperty('textContent')).jsonValue();
        var skin_price_sel = await skins[i].$("span[attribute='pricetm']");
        var skin_price = await (await skin_price_sel.getProperty('textContent')).jsonValue();
        console.log(skin_name + ":" + skin_price);
        var skin_price_penny = Math.ceil(skin_price) * 100;
        console.log("Skin: " + skin_name + " Round price: " + skin_price_penny);
        for (var d = 0; d <= 5; d++) {
            try {

                console.log("new_check_bal: " + (check_bal - Math.ceil(skin_price)));
                if ((check_bal - Math.ceil(skin_price)) <= limit_balance) {
                  console.log("skip item");
                  break;
                }
                var url = "https://market.csgo.com/api/v2/buy?key=" + api_market + "&hash_name=" + skin_name + "&price=" + skin_price_penny;
                console.log(encodeURI(url));
                var response = await fetch(encodeURI(url));
                var data = await response.json();
                console.log(data);
                if (data["success"] == true){
                  loggingAutobuy("Куплен: " + skin_name + " Цена покупки: " + skin_price + " RUB");
                  check_bal = check_bal - Math.ceil(skin_price);
                  console.log("check_bal_aftr_buy: " + check_bal);
                }
                break;
            } catch (e) {
                await page.waitFor(1000);
                console.log(e);
            }
        }
        await page.waitFor(1000);

    }
}
var autobuy_timer;
document.querySelector(".start-autobuy").addEventListener("click" , async () => {
  document.querySelector(".start-autobuy").setAttribute("disabled", "true");
  document.querySelector(".min_percent_autobuy").setAttribute("disabled", "true");
  document.querySelector(".max_percent_autobuy").setAttribute("disabled", "true");
  document.querySelector(".limit_autobuy").setAttribute("disabled", "true");
  document.querySelector(".min_price_autobuy").setAttribute("disabled", "true");
  document.querySelector(".max_price_autobuy").setAttribute("disabled", "true");
  document.querySelector(".filter_autobuy").setAttribute("disabled", "true");
  document.querySelector(".knife_autobuy").setAttribute("disabled", "true");
  document.querySelector(".stattrak_autobuy").setAttribute("disabled", "true");
  document.querySelector(".souvenir_autobuy").setAttribute("disabled", "true");
  document.querySelector(".sticker_autobuy").setAttribute("disabled", "true");

  loggingAutobuy("Старт");
  await loginInSteam();
  await loginInTable();
  autobuy_timer = setTimeout(async function  ticktak() {
    await parseTable();
    autobuy_timer = setTimeout(ticktak, 5000); // (*)
  }, 5000);

});
document.querySelector(".stop-autobuy").addEventListener("click", async () => {
  document.querySelector(".start-autobuy").removeAttribute("disabled");
  document.querySelector(".min_percent_autobuy").removeAttribute("disabled");
  document.querySelector(".max_percent_autobuy").removeAttribute("disabled");
  document.querySelector(".limit_autobuy").removeAttribute("disabled");
  document.querySelector(".min_price_autobuy").removeAttribute("disabled");
  document.querySelector(".max_price_autobuy").removeAttribute("disabled");
  document.querySelector(".filter_autobuy").removeAttribute("disabled");
  document.querySelector(".knife_autobuy").removeAttribute("disabled");
  document.querySelector(".stattrak_autobuy").removeAttribute("disabled");
  document.querySelector(".souvenir_autobuy").removeAttribute("disabled");
  document.querySelector(".sticker_autobuy").removeAttribute("disabled");

  loggingAutobuy("Стоп");
  await browser.close();
  clearTimeout(autobuy_timer);
});

///////////////////////////////////////////////////////////////


//Перенос баланса(отправка)
document.querySelector(".send_money").addEventListener("click", async () => {
  var count = document.querySelector(".count_send").value;
  var api_got = document.querySelector(".api_user").value;
  var api_get = document.querySelector(".api_own").value;
  var paymant_pass = document.querySelector(".pay_pass").value;
  var url = "https://market.csgo.com/api/v2/money-send/"+ count*100 +"/" + api_got +"?pay_pass="+paymant_pass+"&key=" + api_get;
  console.log(encodeURI(url));
  var response = await fetch(encodeURI(url));
  var data = await response.json();
  console.log(data);
  if (data["success"] == true){
    console.log("SUCCESS transaction");
  }

});
///////////////////////////////////////////////////////////////
