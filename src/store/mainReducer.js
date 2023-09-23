import {user} from "../service/User";


const defaultState = {
    ...window.dataConfig,
    auth: false,
    process: window.dataConfig.accounts.map(() => ({
        loading: true,
        steam_id: null,
        session_id: null,
        cookie: null,
        avatarUrl: null,
        error: null,
        tradableItems: -1,
        marketBuyHistory: [],
        logs: [],
        status: {
            online: -1,
            tradeLink: -1,
            tradeOfferAvailability: -1,
            saleAvailability: -1
        },
        balances: {
            all: -1,
            marketBalance: -1,
            steamBalance: -1,
            inventoryCost: -1,
            steamMarketLots: -1
        },
        func: {
            monitoring: {
                funcAddress: null,
                onLoading: false,
                items: []
            },
            setItems: {
                func: false,
                onLoading: false,
                items: []
            },
            autobuy: {
                browser: null,
                funcAddress: null,
                logs: [],
                purchasedItems: []
            }
        }
    }))
}

const CHANGE_FIELD_VALUE = "CHANGE_FIELD_VALUE";
const CHANGE_USED_STATE = "CHANGE_USED_STATE";
const ADD_ACCOUNT = "ADD_ACCOUNT";
const EDIT_ACCOUNT = "EDIT_ACCOUNT";
const DELETE_ACCOUNT = "DELETE_ACCOUNT";
const ON_LOGS_ADD = "ON_LOGS_ADD";
const ON_LOGS_AUTOBUY_ADD = "ON_LOGS_AUTOBUY_ADD";


const ON_AUTH = "ON_AUTH";
const INIT_ACCOUNT = "INIT_ACCOUNT";
const ON_LOADING = "ON_LOADING";
const ON_ERROR = "ON_ERROR";

const GET_MARKET_STATUS = "GET_MARKET_STATUS";

const SUM_ALL_BALANCE = "SUM_ALL_BALANCE";
const GET_MARKET_BALANCE = "GET_MARKET_BALANCE";
const GET_STEAM_BALANCE = "GET_STEAM_BALANCE";
const GET_INVENTORY_COST = "GET_INVENTORY_COST";
const GET_STEAM_MARKET_LOTS = "GET_STEAM_MARKET_LOTS";
const GET_MARKET_BUY_HISTORY = "GET_MARKET_BUY_HISTORY";

const GET_MONITORING_ITEMS = "GET_MONITORING_ITEMS";
const GET_SET_ITEMS = "GET_SET_ITEMS";
const ON_LOADING_MONITORING_ITEMS = "ON_LOADING_MONITORING_ITEMS";
const ON_LOADING_SET_ITEMS = "ON_LOADING_SET_ITEMS";
const CHANGE_MONITORING_ITEM_FIELDS = "CHANGE_MONITORING_ITEM_FIELDS";
const CHANGE_SET_ITEM_FIELDS = "CHANGE_SET_ITEM_FIELDS";
const SAVE_MONITORING_ITEMS_VALUE = "SAVE_MONITORING_ITEMS_VALUE";
const PASTE_MONITORING_ITEMS_VALUE = "PASTE_MONITORING_ITEMS_VALUE";
const START_MONITORING = "START_MONITORING";
const STOP_MONITORING = "STOP_MONITORING";
const SET_ITEMS = "SET_ITEMS";
const AUTOBUY_BROWSER_START = "AUTOBUY_BROWSER_START";
const START_AUTOBUY = "START_AUTOBUY";
const STOP_AUTOBUY = "STOP_AUTOBUY";
const ADD_PURCHASED_ITEMS = "ADD_PURCHASED_ITEMS";
const REMOVE_PURCHASED_ITEMS = "REMOVE_PURCHASED_ITEMS";
export const mainReducer = (state = defaultState, action) => {
    switch (action.type) {
        case CHANGE_FIELD_VALUE: {
            const newState = {...state};
            newState.accounts[action.payload.selected]["funcSaves"][action.payload.type]["fields"][action.payload.field] = action.payload.value;
            return newState;
        }
        case CHANGE_USED_STATE: {
            const newState = {...state};
            newState.accounts[action.payload.selected]["used"] = action.payload.value;
            return newState;
        }
        case ADD_ACCOUNT: {
            const newState = {...state};
            newState.accounts.push({
                "used": true,
                "authData": action.payload.authData,
                "funcSaves": {
                    "monitoring": {
                        "itemPrices": [],
                        "fields": {
                            "autoMinLimit": false,
                            "autoMaxLimit": false
                        }
                    },
                    "setItems": {
                        "fields": {
                            "autoSetHigherPrice": false
                        }
                    },
                    "autobuy": {
                        "fields": {
                            "autoAutobuyStart": false,
                            "autoAutobuyStartValue": "500",
                            "autoSell": false,
                            "dynamicPercent": false,
                            "knife": false,
                            "stattrak": true,
                            "souvenir": true,
                            "sticker": true,
                            "minPercent": "",
                            "maxPercent": "",
                            "minPrice": "10",
                            "maxPrice": "",
                            "salesFilter": "300",
                            "balanceLimit": ""
                        }
                    }
                }
            });
            newState.process.push({
                loading: true,
                steam_id: null,
                session_id: null,
                cookie: null,
                avatarUrl: null,
                error: null,
                tradableItems: -1,
                marketBuyHistory: [],
                logs: [],
                status: {
                    online: -1,
                    tradeLink: -1,
                    tradeOfferAvailability: -1,
                    saleAvailability: -1
                },
                balances: {
                    all: -1,
                    marketBalance: -1,
                    steamBalance: -1,
                    inventoryCost: -1,
                    steamMarketLots: -1
                },
                func: {
                    monitoring: {
                        funcAddress: null,
                        onLoading: false,
                        items: []
                    },
                    setItems: {
                        func: false,
                        onLoading: false,
                        items: []
                    },
                    autobuy: {
                        browser: null,
                        funcAddress: null,
                        logs: [],
                        purchasedItems: []
                    }
                }
            });
            return newState;
        }
        case EDIT_ACCOUNT: {
            const newState = {...state};
            newState.accounts[action.payload.selected]["authData"] = action.payload.authData;
            return newState;
        }
        case DELETE_ACCOUNT: {
            const funcObj = state.process[action.payload.selected]["func"]
            for (let key in funcObj) {
                clearInterval(funcObj[key]);
                funcObj[key] = null;
            }
            return {
                ...state,
                accounts: state.accounts.filter((item, i) => action.payload.selected !== i),
                process: state.process.filter((item, i) => action.payload.selected !== i)
            };
        }
        case ON_LOGS_ADD: {
            const newState = {...state};
            if (newState.process[action.payload.i].logs.length >= 700)
                newState.process[action.payload.i].logs = [];
            newState.process[action.payload.i].logs.push(`${new Date().toLocaleTimeString()} ${action.payload.log}`);
            return newState;
        }
        case ON_LOGS_AUTOBUY_ADD: {
            const newState = {...state};
            if (newState.process[action.payload.i].func.autobuy.logs.length >= 700)
                newState.process[action.payload.i].func.autobuy.logs = [];
            newState.process[action.payload.i].func.autobuy.logs.push(`${new Date().toLocaleTimeString()} ${action.payload.log}`);
            return newState;
        }
        case ON_AUTH: {
            return {...state, auth: action.payload.flag};
        }
        case INIT_ACCOUNT: {
            const newState = {...state};
            newState.process[action.payload.i].community = action.payload.community;
            newState.process[action.payload.i].steam_id = action.payload.steam_id;
            newState.process[action.payload.i].session_id = action.payload.session_id;
            newState.process[action.payload.i].cookies = action.payload.cookies;
            newState.process[action.payload.i].avatarUrl = action.payload.avatarUrl;
            return newState;
        }
        case ON_LOADING: {
            const newState = {...state};
            newState.process[action.payload.i].loading = action.payload.flag;
            return newState;
        }
        case ON_ERROR: {
            const newState = {...state};
            newState.process[action.payload.i].error = action.payload.error;
            return newState;
        }
        case GET_MARKET_STATUS: {
            const newState = {...state};
            newState.process[action.payload.i].status.online = action.payload.status.site_online;
            newState.process[action.payload.i].status.tradeLink = action.payload.status.user_token;
            newState.process[action.payload.i].status.tradeOfferAvailability = action.payload.status.trade_check;
            newState.process[action.payload.i].status.saleAvailability = action.payload.status.site_notmpban;
            return newState;
        }
        case SUM_ALL_BALANCE: {
            const newState = {...state};
            const {
                marketBalance,
                steamBalance,
                inventoryCost,
                steamMarketLots
            } = newState.process[action.payload.i].balances;
            newState.process[action.payload.i].balances.all = Number((marketBalance + steamBalance + inventoryCost + steamMarketLots).toFixed(2));
            return newState;
        }
        case GET_MARKET_BALANCE: {
            const newState = {...state};
            newState.process[action.payload.i].balances.marketBalance = action.payload.sum;
            return newState;
        }
        case GET_STEAM_BALANCE: {
            const newState = {...state};
            newState.process[action.payload.i].balances.steamBalance = action.payload.sum;
            return newState;
        }
        case GET_INVENTORY_COST: {
            const newState = {...state};
            newState.process[action.payload.i].tradable = action.payload.data.tradable;
            newState.process[action.payload.i].balances.inventoryCost = action.payload.data.inv_cost;
            return newState;
        }
        case GET_STEAM_MARKET_LOTS: {
            const newState = {...state};
            newState.process[action.payload.i].balances.steamMarketLots = action.payload.sum;
            return newState;
        }
        case GET_MARKET_BUY_HISTORY: {
            const newState = {...state};
            newState.process[action.payload.i].marketBuyHistory = action.payload.history;
            return newState;
        }
        case CHANGE_MONITORING_ITEM_FIELDS: {
            const newState = {...state};
            newState.process[action.payload.selected].func.monitoring.items[action.payload.i][action.payload.field] = action.payload.value;
            return newState;
        }
        case CHANGE_SET_ITEM_FIELDS: {
            const newState = {...state};
            newState.process[action.payload.selected].func.setItems.items[action.payload.i][action.payload.field] = action.payload.value;
            return newState;
        }
        case SAVE_MONITORING_ITEMS_VALUE: {
            const newState = {...state};
            newState.accounts[action.payload.i].funcSaves.monitoring.itemPrices = [];
            const items = newState.process[action.payload.i].func.monitoring.items;
            for (let item of items) {
                newState.accounts[action.payload.i].funcSaves.monitoring.itemPrices.push(
                    {
                        name: item.name,
                        minLimit: item.minLimit,
                        maxLimit: item.maxLimit
                    }
                )
            }
            return newState;
        }
        case PASTE_MONITORING_ITEMS_VALUE: {
            const newState = {...state};
            const items = newState.accounts[action.payload.i].funcSaves.monitoring.itemPrices;
            console.log(items)
            for (let item of items) {
                const monitoringItemIndex = newState.process[action.payload.i].func.monitoring.items.findIndex((el) => (el.name === item.name));
                console.log(monitoringItemIndex);
                if (monitoringItemIndex !== -1) {
                    newState.process[action.payload.i].func.monitoring.items[monitoringItemIndex].minLimit = item.minLimit;
                    newState.process[action.payload.i].func.monitoring.items[monitoringItemIndex].maxLimit = item.maxLimit;
                }
            }
            return newState;
        }
        case ON_LOADING_MONITORING_ITEMS: {
            const newState = {...state};
            newState.process[action.payload.i].func.monitoring.onLoading = action.payload.flag;
            return newState;
        }
        case ON_LOADING_SET_ITEMS: {
            const newState = {...state};
            newState.process[action.payload.i].func.setItems.onLoading = action.payload.flag;
            return newState;
        }
        case GET_MONITORING_ITEMS: {
            const newState = {...state};
            const {
                autoMinLimit,
                autoMaxLimit,
                autoMinLimitValue,
                autoMaxLimitValue
            } = newState.accounts[action.payload.i].funcSaves.monitoring.fields;
            if (autoMinLimit) {
                for (let item of action.payload.items) {
                    const historyPrice = newState.process[action.payload.i].marketBuyHistory[item.name]
                    if (autoMinLimitValue !== "" && historyPrice)
                        item.minLimit = Math.floor(historyPrice - Number(autoMinLimitValue));
                }
            }
            if (autoMaxLimit) {
                for (let item of action.payload.items) {
                    const historyPrice = newState.process[action.payload.i].marketBuyHistory[item.name]
                    if (autoMaxLimitValue !== "" && historyPrice)
                        item.maxLimit = Math.floor(historyPrice + Number(autoMaxLimitValue));
                }
            }
            newState.process[action.payload.i].func.monitoring.items = action.payload.items;
            return newState;
        }
        case GET_SET_ITEMS: {
            const newState = {...state};
            const {autoSetHigherPrice} = newState.accounts[action.payload.i].funcSaves.setItems.fields;
            if (autoSetHigherPrice) {
                for (let item of action.payload.items) {
                    const historyPrice = newState.process[action.payload.i].marketBuyHistory[item.name]
                    if (historyPrice && item.minPrice)
                        item.price = Math.floor(Math.max(historyPrice, item.minPrice));
                }
            }
            newState.process[action.payload.i].func.setItems.items = action.payload.items;
            return newState;
        }
        case START_MONITORING: {
            const newState = {...state};
            newState.process[action.payload.i].func.monitoring.funcAddress = action.payload.funcAddress
            return newState;
        }
        case STOP_MONITORING: {
            clearTimeout(state.process[action.payload.i].func.monitoring.funcAddress);
            const newState = {...state};
            newState.process[action.payload.i].func.monitoring.funcAddress = null;
            newState.process[action.payload.i].logs.push(`${new Date().toLocaleTimeString()} "Мониторинг цен" остановлен`);
            return newState;
        }
        case SET_ITEMS: {
            const newState = {...state};
            newState.process[action.payload.i].func.setItems.func = action.payload.flag
            return newState;
        }
        case AUTOBUY_BROWSER_START: {
            const newState = {...state};
            newState.process[action.payload.i].func.autobuy.browser = action.payload.browser;
            return newState;
        }
        case START_AUTOBUY: {
            const newState = {...state};
            newState.process[action.payload.i].func.autobuy.funcAddress = action.payload.funcAddress;
            return newState;
        }
        case STOP_AUTOBUY: {
            clearTimeout(state.process[action.payload.i].func.autobuy.funcAddress);
            const browser = state.process[action.payload.i].func.autobuy.browser;
            if (browser)
                browser.close();
            const newState = {...state};
            newState.process[action.payload.i].func.autobuy.browser = null;
            newState.process[action.payload.i].func.autobuy.funcAddress = null;
            newState.process[action.payload.i].logs.push(`${new Date().toLocaleTimeString()} "Autobuy" остановлен`);
            newState.process[action.payload.i].func.autobuy.logs.push(`${new Date().toLocaleTimeString()} Стоп`);
            return newState;
        }
        case ADD_PURCHASED_ITEMS: {
            const newState = {...state};
            newState.process[action.payload.i].func.autobuy.purchasedItems.push(action.payload.item);
            return newState;
        }
        case REMOVE_PURCHASED_ITEMS: {
            const newState = {...state};
            const {market_hash_name, instanceid} = action.payload;
            const searchedIndex = newState.process[action.payload.i].func.autobuy.purchasedItems.findIndex((elem) => elem.market_hash_name === market_hash_name && elem.real_instance === instanceid);
            if (searchedIndex >= 0) {
                newState.process[action.payload.i].func.autobuy.purchasedItems.splice(searchedIndex, 1);
            }

            return newState;
        }
        default:
            return state;
    }
}

export const changeFieldValueAction = (payload) => ({type: CHANGE_FIELD_VALUE, payload});
export const changeUsedStateAction = (payload) => ({type: CHANGE_USED_STATE, payload});

export const addAccountAction = (payload) => ({type: ADD_ACCOUNT, payload});
export const editAccountAction = (payload) => ({type: EDIT_ACCOUNT, payload});
export const deleteAccountAction = (selected) => ({type: DELETE_ACCOUNT, payload: {selected}});
export const onLogsAddAction = (i, log) => ({type: ON_LOGS_ADD, payload: {i, log}});
export const onLogsAutobuyAddAction = (i, log) => ({type: ON_LOGS_AUTOBUY_ADD, payload: {i, log}});

export const onErrorAction = (i, error) => ({type: ON_ERROR, payload: {i, error}});
export const onLoadingAction = (i, flag) => ({type: ON_LOADING, payload: {i, flag}});
export const onLoadingMonitoringItemsAction = (i, flag) => ({type: ON_LOADING_MONITORING_ITEMS, payload: {i, flag}})
export const onLoadingSetItemsAction = (i, flag) => ({type: ON_LOADING_SET_ITEMS, payload: {i, flag}})
export const changeMonitoringItemFieldsAction = (selected, i, field, value) => ({
    type: CHANGE_MONITORING_ITEM_FIELDS,
    payload: {selected, i, field, value}
});
export const changeSetItemFieldsAction = (selected, i, field, value) => ({
    type: CHANGE_SET_ITEM_FIELDS,
    payload: {selected, i, field, value}
});
export const saveMonitoringItemsValueAction = (i) => ({type: SAVE_MONITORING_ITEMS_VALUE, payload: {i}});
export const pasteMonitoringItemsValueAction = (i) => ({type: PASTE_MONITORING_ITEMS_VALUE, payload: {i}});

export const getMonitoringItemsAction = (i, items) => ({type: GET_MONITORING_ITEMS, payload: {i, items}})
export const getSetItemsAction = (i, items) => ({type: GET_SET_ITEMS, payload: {i, items}})

export const startMonitoringAction = (i, funcAddress) => ({type: START_MONITORING, payload: {i, funcAddress}});
export const stopMonitoringAction = (i) => ({type: STOP_MONITORING, payload: {i}});
export const setItemsAction = (i, flag) => ({type: SET_ITEMS, payload: {i, flag}});
export const onAuthAction = (flag) => ({type: ON_AUTH, payload: {flag}});
export const autobuyBrowserStartAction = (i, browser) => ({type: AUTOBUY_BROWSER_START, payload: {i, browser}});
export const startAutobuyAction = (i, funcAddress) => ({type: START_AUTOBUY, payload: {i, funcAddress}});
export const stopAutobuyAction = (i) => ({type: STOP_AUTOBUY, payload: {i}});
export const addPurchasedItemsAction = (i, item) => ({type: ADD_PURCHASED_ITEMS, payload: {i, item}});
export const removePurchasedItemAction = (i, instanceid, market_hash_name) => ({
    type: REMOVE_PURCHASED_ITEMS,
    payload: {i, instanceid, market_hash_name}
});


export const initAccountAction = (payload) => ({type: INIT_ACCOUNT, payload});
export const getMarketStatusAction = (i, status) => ({type: GET_MARKET_STATUS, payload: {i, status}});
export const sumAllBalanceAction = (i) => ({type: SUM_ALL_BALANCE, payload: {i}});
export const getMarketBalanceAction = (i, sum) => ({type: GET_MARKET_BALANCE, payload: {i, sum}});
export const getSteamBalanceAction = (i, sum) => ({type: GET_STEAM_BALANCE, payload: {i, sum}});
export const getInventoryCostAction = (i, data) => ({type: GET_INVENTORY_COST, payload: {i, data}});
export const getSteamMarketLotsAction = (i, sum) => ({type: GET_STEAM_MARKET_LOTS, payload: {i, sum}});
export const getMarketBuyHistoryAction = (i, history) => ({type: GET_MARKET_BUY_HISTORY, payload: {i, history}});


export const accountsInitThunkCreator = () => {
    return async (dispatch, getState) => {
        if (!getState().auth) {
            console.log("initAcc");
            dispatch(onAuthAction(true));
            for (let i = 0; i < getState().accounts.length; i++) {
                console.log(getState().accounts[i].authData.login);
                if (getState().accounts[i].used && !getState().process[i].cookies) {
                    try {
                        const {
                            community,
                            steam_id,
                            session_id,
                            cookies
                        } = await user.authSteam(getState().accounts[i].authData);
                        const avatarUrl = await user.getUserAvatar(community, steam_id);
                        dispatch(initAccountAction({community, steam_id, session_id, cookies, avatarUrl, i}));
                        dispatch(startMarketPingPongTimerThunkCreator(i));
                        dispatch(marketUpdateInventoryTimerThunkCreator(i));
                        dispatch(setGetMarketStatusTimerThunkCreator(i));
                        dispatch(setUpdateBalanceTimerThunkCreator(i));
                        dispatch(getMarketBuyHistoryThunkCreator(i));
                        dispatch(startSteamTradeAcceptWhenItemSoldTimerThunkCreator(i));
                        dispatch(startSteamTradeAcceptTimerThunkCreator(i));
                        dispatch(autoSellPurchasedItemsThunkCreator(i));
                        dispatch(autoMonitoringStartTimerThunkCreator(i));
                        dispatch(autoSetItemsStartTimerThunkCreator(i));
                        dispatch(autoAutobuyStartTimerThunkCreator(i));
                        dispatch(onErrorAction(i, null));
                        dispatch(onLoadingAction(i, false));
                    } catch (e) {
                        dispatch(onErrorAction(i, e.message));
                        if (e.message === "HTTP error 429" || e.message === "CAPTCHA" || e.message === "SteamGuardMobile" || e.message === "getaddrinfo ENOTFOUND steamcommunity.com" || e.message === "ESOCKETTIMEDOUT") {
                            i--;
                            await new Promise(r => setTimeout(r, 30000));
                            continue;
                        }
                    }
                    await new Promise(r => setTimeout(r, 30000)); //auth delay
                }
            }
            dispatch(onAuthAction(false));
        }
    }
}

export const startMarketPingPongTimerThunkCreator = (i) => {
    return async (dispatch, getState) => {
        const logging = (log) => dispatch(onLogsAddAction(i, log));
        let timerId = setTimeout(async function tick() {
            try {
                const online = await user.marketPingPong(getState().accounts[i].authData.marketApi);
                if (online)
                    logging("Поддержание онлайна: да")
                else
                    logging("Поддержание онлайна: нет")
            } catch (e) {
                console.log(`startMarketPingPongTimeThunkCreator error: ${e}`)
            }
            timerId = setTimeout(tick, 180000);
        }, 1000);
    }
}

export const marketUpdateInventoryTimerThunkCreator = (i) => {
    return async (dispatch, getState) => {
        let timerId = setTimeout(async function tick() {
            try {
                await user.marketUpdateInventory(getState().accounts[i].authData.marketApi);
            } catch (e) {
                console.log(`marketUpdateInventoryTimerThunkCreator error: ${e}`)
            }
            timerId = setTimeout(tick, 3600000);
        }, 2500);
    }
}

export const autoMonitoringStartTimerThunkCreator = (i) => {
    return async (dispatch, getState) => {
        let timerId = setTimeout(async function tick() {
            if (getState().accounts[i].funcSaves.monitoring.fields.autoMonitoringStart) {
                try {
                    dispatch(stopMonitoringAction(i));
                    do {
                        dispatch(getMonitoringItemsThunkCreator(i))
                        console.log(getState().accounts[i].authData.login + " Автоматический старт загрузки предметов Мониторинга");
                        await user.sleep(2000);
                        while (getState().process[i].func.monitoring.onLoading) {
                            console.log(getState().accounts[i].authData.login + " Еще грузит");
                            await user.sleep(3000);
                        }
                    } while (getState().process[i].func.monitoring.items[0] && getState().process[i].func.monitoring.items[0].error)

                    if (getState().process[i].func.monitoring.items.length) {
                        console.log(getState().accounts[i].authData.login + " Старт мониторинга")

                        dispatch(startMonitoringTimerThunkCreator(i));
                    } else {
                        console.log(getState().accounts[i].authData.login + " Предметов нет")
                    }
                } catch (e) {
                    console.log(`autoMonitoringStartTimerThunkCreator error: ${e}`)
                }
            }
            timerId = setTimeout(tick, 21600000);
        }, 50000);
    }
}

export const autoSetItemsStartTimerThunkCreator = (i) => {
    return async (dispatch, getState) => {
        let timerId = setTimeout(async function tick() {
            if (getState().accounts[i].funcSaves.setItems.fields.autoSetItemsStart) {
                try {
                    do {
                        dispatch(getSetItemsThunkCreator(i));
                        console.log(getState().accounts[i].authData.login + " Автоматический старт загрузки предметов для Выставления");
                        await user.sleep(2000);
                        while (getState().process[i].func.setItems.onLoading) {
                            console.log(getState().accounts[i].authData.login + " Еще грузит");
                            await user.sleep(3000);
                        }
                    } while (getState().process[i].func.setItems.items[0] && getState().process[i].func.setItems.items[0].error)

                    if (getState().process[i].func.setItems.items.length) {
                        console.log(getState().accounts[i].authData.login + " Старт выставления")
                        dispatch(setItemsThunkCreator(i));
                    } else {
                        console.log(getState().accounts[i].authData.login + " Предметов нет")
                    }
                } catch (e) {
                    console.log(`autoSetItemsStartTimerThunkCreator error: ${e}`)
                }
            }
            timerId = setTimeout(tick, 10800000);
        }, 10000);
    }
}

export const autoAutobuyStartTimerThunkCreator = (i) => {
    return async (dispatch, getState) => {
        let timerId = setTimeout(async function tick() {
            if (getState().accounts[i].funcSaves.autobuy.fields.autoAutobuyStart) {
                try {
                    const startLimit = getState().accounts[i].funcSaves.autobuy.fields.autoAutobuyStartValue;
                    dispatch(stopAutobuyAction(i));
                    await user.sleep(3000);
                    const balance = await user.getMarketBalance(getState().accounts[i].authData.marketApi)
                    if(balance && balance >= Number(startLimit)){
                        dispatch(startAutobuyTimerThunkCreator(i));
                    }
                } catch (e) {
                    console.log(`autoAutobuyStartTimerThunkCreator error: ${e}`)
                }
            }
            timerId = setTimeout(tick, 7200000);
        }, 30000);
    }
}

export const autoSellPurchasedItemsThunkCreator = (i) => {
    return async (dispatch, getState) => {
        const logging = (log) => dispatch(onLogsAddAction(i, log));
        const removeItem = (instanceid, market_hash_name) => dispatch(removePurchasedItemAction(i, instanceid, market_hash_name));
        let timerId = setTimeout(async function tick() {
            try {
                const isAutoSold = getState().accounts[i].funcSaves.autobuy.fields.autoSell;
                if (isAutoSold) {
                    const {community, steam_id, cookies, session_id} = getState().process[i];
                    const purchasedItems = getState().process[i].func.autobuy.purchasedItems;
                    if (purchasedItems && purchasedItems.length) {
                        await user.autoSellPurchasedItems(community, steam_id, cookies, session_id, purchasedItems, logging, removeItem);
                    }
                }
            } catch (e) {
                console.log(`autoSellPurchasedItemsThunkCreator error: ${e}`)
            }
            timerId = setTimeout(tick, 1800000);
        }, 300000);
    }
}

export const getMarketBalanceThunkCreator = (i) => {
    return async (dispatch, getState) => {
        try {
            dispatch(getMarketBalanceAction(i, -1));
            const sum = await user.getMarketBalance(getState().accounts[i].authData.marketApi);
            dispatch(getMarketBalanceAction(i, sum));
            dispatch(sumAllBalanceAction(i));
        } catch (e) {
            console.log(`getMarketBalanceThunkCreator error: ${e}`)
        }
    }
}

export const getSteamBalanceThunkCreator = (i) => {
    return async (dispatch, getState) => {
        try {
            dispatch(getSteamBalanceAction(i, -1));
            const sum = await user.getSteamBalance(getState().process[i].session_id, getState().process[i].steam_id);
            dispatch(getSteamBalanceAction(i, sum));
            dispatch(sumAllBalanceAction(i));
        } catch (e) {
            console.log(`getSteamBalanceThunkCreator error: ${e}`)
        }
    }
}

export const getInventoryCostThunkCreator = (i) => {
    return async (dispatch, getState) => {
        try {
            dispatch(getInventoryCostAction(i, {inv_cost: -1, tradable: -1}));
            const data = await user.getInventoryCost(getState().process[i].steam_id, getState().process[i].session_id);
            dispatch(getInventoryCostAction(i, data));
            dispatch(sumAllBalanceAction(i));
        } catch (e) {
            console.log(`getInventoryCostThunkCreator error: ${e}`)
        }
    }
}

export const getSteamMarketLotsThunkCreator = (i) => {
    return async (dispatch, getState) => {
        try {
            dispatch(getSteamMarketLotsAction(i, -1));
            const sum = await user.getSteamMarketLots(getState().process[i].session_id);
            dispatch(getSteamMarketLotsAction(i, sum));
            dispatch(sumAllBalanceAction(i));
        } catch (e) {
            console.log(`getSteamMarketLotsThunkCreator error: ${e}`)
        }
    }
}

export const getMarketBuyHistoryThunkCreator = (i) => {
    return async (dispatch, getState) => {
        try {
            dispatch(getMarketBuyHistoryAction(i, -1));
            const history = await user.getMarketBuyHistory(getState().process[i].session_id);
            dispatch(getMarketBuyHistoryAction(i, history));
        } catch (e) {
            console.log(`getMarketBuyHistoryThunkCreator error: ${e}`)
        }
    }
}

export const setUpdateBalanceTimerThunkCreator = (i) => {
    return async (dispatch) => {
        let timerId = setTimeout(function tick() {
            dispatch(getMarketBalanceThunkCreator(i));
            dispatch(getSteamBalanceThunkCreator(i));
            dispatch(getInventoryCostThunkCreator(i));
            dispatch(getSteamMarketLotsThunkCreator(i))
            timerId = setTimeout(tick, 7200000);
        }, 2000);
    }
}

export const getMarketStatusThunkCreator = (i) => {
    return async (dispatch, getState) => {
        try {
            dispatch(getMarketStatusAction(i, {site_online: -1, user_token: -1, site_notmpban: -1, trade_check: -1}));
            const status = await user.getMarketStatus(getState().accounts[i].authData.marketApi);
            dispatch(getMarketStatusAction(i, status));
        } catch (e) {
            console.log(`getSteamMarketLotsThunkCreator error: ${e}`)
        }
    }
}

export const setGetMarketStatusTimerThunkCreator = (i) => {
    return async (dispatch) => {
        let timerId = setTimeout(function tick() {
            dispatch(getMarketStatusThunkCreator(i));
            timerId = setTimeout(tick, 900000);
        }, 5000);
    }
}


export const startSteamTradeAcceptWhenItemSoldTimerThunkCreator = (i) => {
    return async (dispatch, getState) => {
        const marketApi = getState().accounts[i].authData.marketApi;
        const community = getState().process[i].community;
        const identity_secret = getState().accounts[i].authData.identity_secret;
        const logging = (log) => dispatch(onLogsAddAction(i, log));

        let timerId = setTimeout(async function tick() {
            try {
                if (community)
                    await user.steamTradeAcceptWhenItemSold(marketApi, community, identity_secret, logging);
            } catch (e) {
                console.log(`startSteamTradeAcceptWhenItemSoldTimerThunkCreator ${e.message}`);
            }
            timerId = setTimeout(tick, 60000); // (*)
        }, 2000);

    }
}
export const startSteamTradeAcceptTimerThunkCreator = (i) => {
    return async (dispatch, getState) => {
        const community = getState().process[i].community;
        const identity_secret = getState().accounts[i].authData.identity_secret;
        const logging = (log) => dispatch(onLogsAddAction(i, log));
        let timerId = setTimeout(async function tick() {
            try {
                if (community)
                    await user.steamTradeAccept(community, identity_secret, logging);
            } catch (e) {
                console.log(`startSteamTradeAcceptTimerThunkCreator ${e.message}`);
            }
            timerId = setTimeout(tick, 600000); // (*)
        }, 30000);
    }
}

export const getMonitoringItemsThunkCreator = (i) => {
    return async (dispatch, getState) => {
        try {
            dispatch(onLoadingMonitoringItemsAction(i, true))
            const items = await user.monitoringGetItems(getState().accounts[i].authData.marketApi, getState().accounts[i].authData.steamApi);
            dispatch(getMonitoringItemsAction(i, items));
            dispatch(onLoadingMonitoringItemsAction(i, false))
        } catch (e) {
            dispatch(onLoadingMonitoringItemsAction(i, false))
            console.log(`getMonitoringItemsThunkCreator ${e.message}`);
            dispatch(getMonitoringItemsAction(i, [{error: e.message}]));
        }

    }
}

export const startMonitoringTimerThunkCreator = (i) => {
    return async (dispatch, getState) => {
        const logging = (log) => dispatch(onLogsAddAction(i, log));
        logging('Запуск "Мониторинг цен"');
        let timerId = setTimeout(async function tick() {
            dispatch(startMonitoringAction(i, timerId));
            try {
                const result = await user.monitoringPrices(getState().accounts[i].authData.marketApi, getState().process[i].func.monitoring.items, logging);
                if (result === "NO_ITEMS") {
                    dispatch(stopMonitoringAction(i));
                }
            } catch (e) {
                console.log(`startMonitoringTimerThunkCreator ${e.message}`);
            }
            if (getState().process[i].func.monitoring.funcAddress) {
                timerId = setTimeout(tick, 15000);
                dispatch(startMonitoringAction(i, timerId));
            }
        }, 1000);
    }
}

export const getSetItemsThunkCreator = (i) => {
    return async (dispatch, getState) => {
        try {
            dispatch(onLoadingSetItemsAction(i, true))
            const items = await user.setItemsGetItems(getState().accounts[i].authData.marketApi);
            dispatch(getSetItemsAction(i, items));
            dispatch(onLoadingSetItemsAction(i, false))
        } catch (e) {
            dispatch(onLoadingSetItemsAction(i, false))
            console.log(`getSetItemsThunkCreator ${e.message}`);
            dispatch(getSetItemsAction(i, [{error: e.message}]));
        }

    }
}

export const setItemsThunkCreator = (i) => {
    return async (dispatch, getState) => {
        try {
            dispatch(setItemsAction(i, true))
            await user.setItems(getState().accounts[i].authData.marketApi, getState().process[i].func.setItems.items);
            dispatch(setItemsAction(i, false))
        } catch (e) {
            dispatch(setItemsAction(i, false))
            console.log(`getSetItemsThunkCreator ${e.message}`);
        }
        dispatch(getSetItemsThunkCreator(i));
    }
}

export const startAutobuyTimerThunkCreator = (i) => {
    return async (dispatch, getState) => {
        const logging = (log) => dispatch(onLogsAddAction(i, log));
        const loggingAutobuy = (log) => dispatch(onLogsAutobuyAddAction(i, log));
        const addPurchaseItem = (item) => dispatch(addPurchasedItemsAction(i, item));
        const isAutoSold = getState().accounts[i].funcSaves.autobuy.fields.autoSell;

        logging('Запуск "Autobuy"');
        try {
            const {browser, page} = await user.autobuyBrowserStart();
            dispatch(autobuyBrowserStartAction(i, browser));
            await user.autobuyAuth(getState().accounts[i].authData, page, loggingAutobuy);
            if(getState().accounts[i].funcSaves.autobuy.fields.autoSetMaxPercentFromTable){
                const minPercent = await user.maxPercentInTableForAutobuy(getState().accounts[i].funcSaves.autobuy.fields, page);
                loggingAutobuy(`Мин. %: ${minPercent}`);
                if(Number(minPercent) < Number(getState().accounts[i].funcSaves.autobuy.fields.autoSetMaxPercentFromTableValue)){
                    dispatch(stopAutobuyAction(i));
                    loggingAutobuy(`Мин. % ниже ограничения.`);
                    return
                }
                dispatch(changeFieldValueAction({
                    field: "minPercent",
                    selected: i,
                    type: "autobuy",
                    value: minPercent
                }))
                await user.sleep(2000);
            }

            let timerId = setTimeout(async function tick() {
                dispatch(startAutobuyAction(i, timerId));
                try {
                    await user.autobuy(getState().accounts[i].authData.marketApi, getState().accounts[i].funcSaves.autobuy.fields, page, loggingAutobuy, isAutoSold, addPurchaseItem);

                } catch (e) {
                    console.log(`startAutobuyTimerThunkCreator ${e.message}`);
                }
                if (getState().process[i].func.autobuy.browser) {
                    timerId = setTimeout(tick, 5000);
                    dispatch(startAutobuyAction(i, timerId));
                }
            }, 1000);
        } catch (e) {
            console.log(`startAutobuyTimerThunkCreator ${e.message}`);
            dispatch(stopAutobuyAction(i));
        }
    }
}