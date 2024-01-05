import React, {useEffect} from 'react';
import userAvatarSm from '../resources/icons/user-avatar-sm.png'
import monitoringIconSm from '../resources/icons/monitoring-icon-sm.png'
import setItemsIconSm from '../resources/icons/setitems-icon-sm.png'
import autobuyIconSm from '../resources/icons/autobuy-icon-sm.png'
import openIcon from "../resources/icons/open.png"
import refreshIcon from "../resources/icons/refresh_w.png"
import Header from "./shared/Header";
import {useDispatch, useSelector} from "react-redux";
import {
    accountsInitThunkCreator, getInventoryCostThunkCreator,
    getMarketBalanceThunkCreator,
    getSteamBalanceThunkCreator, getSteamMarketLotsThunkCreator
} from "../store/actions/actionCreators";
import ErrorCircle from "./shared/ErrorCircle";
import Spinner from "./shared/Spinner";


const Account = ({onSelect, account, accountProc, index}) => {
    const dispatch = useDispatch();
    return (
        <div
            className="w-44 h-48 bg-blue-600 mt-3 ml-3 rounded-2xl px-2 py-1.5 text-gray-300 space-y-1 shadow-lg">
            <div className="flex justify-between items-center p-1">
                <div className="w-7 h-7 rounded-3xl bg-white flex justify-center items-center  shadow-lg">
                    <img className="w-6 h-6 rounded-3xl"
                         src={accountProc.avatarUrl ? accountProc.avatarUrl : userAvatarSm} alt=""/>
                </div>
                <div className="text-sm">{account.authData.login.length > 12
                    ? account.authData.login.substring(0, 12) + "..."
                    : account.authData.login}</div>
                <div className="">
                    {accountProc.error && <ErrorCircle error={accountProc.error}/>}
                </div>
            </div>

            {accountProc.loading
                ? <Spinner className="w-28 h-28 mx-auto border-white"/>
                : <div>
                    <div className="relative">
                        <div
                            className="text-center text-xs">Баланс: {accountProc.balances.all > -1 ? accountProc.balances.all + " RUB" :
                            <Spinner className={"w-3 h-3 inline-block ml-1"}/>}</div>
                        <div
                            className="text-xs">Market: {accountProc.balances.marketBalance > -1 ? accountProc.balances.marketBalance + " RUB" :
                            <Spinner className={"w-3 h-3 inline-block ml-1"}/>}<img
                            onClick={() => dispatch(getMarketBalanceThunkCreator(index))} className="inline ml-1"
                            src={refreshIcon} alt=""/></div>
                        <div
                            className="text-xs">Steam: {accountProc.balances.steamBalance > -1 ? accountProc.balances.steamBalance + " RUB" :
                            <Spinner className={"w-3 h-3 inline-block ml-1"}/>}<img
                            onClick={() => dispatch(getSteamBalanceThunkCreator(index))} className="inline ml-1"
                            src={refreshIcon} alt=""/></div>
                        <div
                            className="text-xs">Инвентарь: {accountProc.balances.inventoryCost > -1 ? accountProc.balances.inventoryCost + " RUB" :
                            <Spinner className={"w-3 h-3 inline-block ml-1"}/>}<img
                            onClick={() => dispatch(getInventoryCostThunkCreator(index))} className="inline ml-1"
                            src={refreshIcon} alt=""/></div>
                        <div
                            className="text-xs">Лоты: {accountProc.balances.steamMarketLots > -1 ? accountProc.balances.steamMarketLots + " RUB" :
                            <Spinner className={"w-3 h-3 inline-block ml-1"}/>}<img
                            onClick={() => dispatch(getSteamMarketLotsThunkCreator(index))} className="inline ml-1"
                            src={refreshIcon} alt=""/></div>
                        <div
                            className="text-xs">Доступно скинов для
                            продажи: {accountProc.tradable > -1 ? accountProc.tradable :
                                <Spinner className={"w-3 h-3 inline-block ml-1"}/>}</div>

                        <div onClick={onSelect} className="w-7 h-7 absolute top-9 right-0 cursor-pointer">
                            <img src={openIcon} alt=""/>
                        </div>
                    </div>
                    <div className="">
                        <div className="text-center text-xs">Статус функций</div>
                        <div className="flex justify-center space-x-2 mt-0.5">
                            <div
                                className={`w-5 h-5 ${accountProc.func.monitoring.funcAddress ? "bg-green-500" : "bg-white"} rounded-3xl flex justify-center items-center shadow-2xl`}>
                                <img src={monitoringIconSm} alt=""/>
                            </div>
                            <div
                                className={`w-5 h-5 ${accountProc.func.setItems.func ? "bg-green-500" : "bg-white"} rounded-3xl flex justify-center items-center shadow-2xl`}>
                                <img src={setItemsIconSm} alt=""/>
                            </div>
                            <div
                                className={`w-5 h-5 ${accountProc.func.autobuy.browser ? "bg-green-500" : "bg-white"} rounded-3xl flex justify-center items-center shadow-2xl`}>
                                <img src={autobuyIconSm} alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};


const Accounts = ({onSelect}) => {
    const data = useSelector(state => state.accounts);
    const dataProc = useSelector(state => state.process);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(accountsInitThunkCreator());
    }, [])

    const accounts = data.map((item, i) => {
        if (item.used)
            return (<Account key={i} index={i} account={item} accountProc={dataProc[i]} onSelect={() => onSelect(i)}/>);
    });
    return (
        <div className="accounts block w-3/4 px-11">
            <div className="text-center">
                <Header>Аккаунты</Header>
            </div>
            <div className="h-[520px] overflow-y-auto mt-1">
                <div className="account_list rounded flex flex-wrap ">
                    {accounts}
                </div>
            </div>
        </div>
    );
};

export default Accounts;
