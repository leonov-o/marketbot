import {user} from "../../service/User";
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
    STOP_MONITORING, SUM_ALL_ACCOUNTS_BALANCE,
    SUM_ALL_BALANCE
} from "../constants/actionTypes";

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
export const sumAllAccountsBalanceAction = () => ({type: SUM_ALL_ACCOUNTS_BALANCE});

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
            const accounts = getState().accounts;

            try {
                for (let i = 0; i < accounts.length; i++) {
                    const account = accounts[i];

                    if (account.used && !getState().process[i].cookies) {
                        await handleAccountInitialization(dispatch, getState, account, i, false);
                        await new Promise(resolve => setTimeout(resolve, 45000)); //auth delay
                    }
                }
            } catch (error) {
                console.error("Error during account initialization:", error);
            } finally {
                dispatch(onAuthAction(false));
            }
        }
    };
};

export const accountsReAuthThunkCreator = (i) => async (dispatch, getState) => {

    console.log("reauth");
    dispatch(onAuthAction(true));
    const accounts = getState().accounts;
    try {
        const account = accounts[i];
        if (account.used) {
            await handleAccountInitialization(dispatch, getState, account, i, true);
        }
    } catch (error) {
        console.error("Error during account reauth:", error);
    }

};
const handleAccountInitialization = async (dispatch, getState, account, index, reAuth) => {
    try {
        dispatch(onLoadingAction(index, true));

        const {
            community,
            steam_id,
            session_id,
            cookies
        } = await user.authSteam(account.authData);

        const avatarUrl = await user.getUserAvatar(community, steam_id);

        dispatch(initAccountAction({community, steam_id, session_id, cookies, avatarUrl, i: index}));

        if(!reAuth){
            [
                startMarketPingPongTimerThunkCreator,
                marketUpdateInventoryTimerThunkCreator,
                setGetMarketStatusTimerThunkCreator,
                setUpdateBalanceTimerThunkCreator,
                getMarketBuyHistoryThunkCreator,
                startSteamTradeAcceptWhenItemSoldTimerThunkCreator,
                startSteamTradeAcceptTimerThunkCreator,
                autoSellPurchasedItemsThunkCreator,
                autoMonitoringStartTimerThunkCreator,
                autoSetItemsStartTimerThunkCreator,
                autoAutobuyStartTimerThunkCreator
            ].forEach(timer => dispatch(timer(index)));
        }

        dispatch(onErrorAction(index, null));
        dispatch(onLoadingAction(index, false));

    } catch (error) {
        dispatch(onErrorAction(index, error.message));

        const errorList = [
            "HTTP error 429",
            "CAPTCHA",
            "SteamGuardMobile",
            "getaddrinfo ENOTFOUND steamcommunity.com",
            "ESOCKETTIMEDOUT",
            "RateLimitExceeded"
        ];

        if (errorList.includes(error.message)) {
            await new Promise(resolve => setTimeout(resolve, 60000));
        }
    }
};


export const startMarketPingPongTimerThunkCreator = (i) => {
    return async (dispatch, getState) => {
        const logging = (log) => dispatch(onLogsAddAction(i, log));
        let timerId = setTimeout(async function tick() {
            try {
                const online = await user.marketPingPong(getState().accounts[i].authData.marketApi, getState().process[i].session_id);
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
                    if (balance && balance >= Number(startLimit)) {
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
            dispatch(sumAllAccountsBalanceAction());
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
            dispatch(sumAllAccountsBalanceAction());
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
            dispatch(sumAllAccountsBalanceAction());
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
            dispatch(sumAllAccountsBalanceAction());
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
            await user.autobuyAuth(getState().process[i].session_id, page, loggingAutobuy);
            if (getState().accounts[i].funcSaves.autobuy.fields.autoSetMaxPercentFromTable) {
                const minPercent = await user.maxPercentInTableForAutobuy(getState().accounts[i].funcSaves.autobuy.fields, page);
                loggingAutobuy(`Мин. %: ${minPercent}`);
                if (Number(minPercent) < Number(getState().accounts[i].funcSaves.autobuy.fields.autoSetMaxPercentFromTableValue)) {
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
