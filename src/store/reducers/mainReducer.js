import {
    ADD_ACCOUNT,
    ADD_PURCHASED_ITEMS,
    AUTOBUY_BROWSER_START,
    CHANGE_FIELD_VALUE,
    CHANGE_MONITORING_ITEM_FIELDS,
    CHANGE_SET_ITEM_FIELDS,
    CHANGE_USED_STATE,
    DELETE_ACCOUNT,
    EDIT_ACCOUNT,
    GET_INVENTORY_COST,
    GET_MARKET_BALANCE,
    GET_MARKET_BUY_HISTORY,
    GET_MARKET_STATUS,
    GET_MONITORING_ITEMS,
    GET_SET_ITEMS,
    GET_STEAM_BALANCE,
    GET_STEAM_MARKET_LOTS,
    INIT_ACCOUNT,
    ON_AUTH,
    ON_ERROR,
    ON_LOADING,
    ON_LOADING_MONITORING_ITEMS,
    ON_LOADING_SET_ITEMS,
    ON_LOGS_ADD,
    ON_LOGS_AUTOBUY_ADD,
    PASTE_MONITORING_ITEMS_VALUE,
    REMOVE_PURCHASED_ITEMS,
    SAVE_MONITORING_ITEMS_VALUE,
    SET_ITEMS,
    START_AUTOBUY,
    START_MONITORING,
    STOP_AUTOBUY,
    STOP_MONITORING,
    SUM_ALL_BALANCE
} from "../constants/actionTypes";

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

