import React from 'react';
import okIcon from "../resources/icons/OK.png"
import notOkIcon from "../resources/icons/NOT OK.png"
import {useDispatch, useSelector} from "react-redux";
import userAvatarSm from "../resources/icons/user-avatar-sm.png";
import ErrorCircle from "./shared/ErrorCircle";
import Spinner from "./shared/Spinner";
import {
    getMarketBalanceThunkCreator,
    getSteamBalanceThunkCreator,
    getInventoryCostThunkCreator,
    getSteamMarketLotsThunkCreator, getMarketStatusThunkCreator
} from "../store/actions/actionCreators";
import refreshIcon from "../resources/icons/refresh_b.png";

const AccountCard = ({selected}) => {
    const data = useSelector(state => state.accounts);
    const accountProc = useSelector(state => state.process[selected]);
    const dispatch = useDispatch();
    return (
        <div
            className="my-3 ml-4 h-64 w-48 rounded-2xl border-2 border-blue-600 px-2 shadow-xl account_card py-1.5 space-y-1">
            <div className="flex justify-between">
                <div
                    className="flex h-7 w-7 items-center justify-center rounded-3xl border-2 border-blue-600 bg-white shadow-lg">
                    <img className="h-6 w-6 rounded-3xl"
                         src={accountProc.avatarUrl ? accountProc.avatarUrl : userAvatarSm} alt=""/>
                </div>
                <div className="w-28 text-center text-sm">{data[selected].authData.login.length > 12
                    ? data[selected].authData.login.substring(0, 12) + "..."
                    : data[selected].authData.login}</div>

                <div className="">
                    {accountProc.error && <ErrorCircle error={accountProc.error}/>}
                </div>
            </div>

            <div className="pl-3">
                <div
                    className="text-center text-sm">Баланс: {accountProc.balances.all > -1 ? accountProc.balances.all + " RUB" :
                    <Spinner className={"w-3 h-3 inline-block ml-1"}/>}</div>
                <div
                    className="mt-1 text-xs">Market: {accountProc.balances.marketBalance > -1 ? accountProc.balances.marketBalance + " RUB" :
                    <Spinner className={"w-3 h-3 inline-block ml-1 border-blue-600"}/>}<img
                    onClick={() => dispatch(getMarketBalanceThunkCreator(selected))} className="ml-1 inline"
                    src={refreshIcon} alt=""/></div>
                <div
                    className="mt-1 text-xs">Steam: {accountProc.balances.steamBalance > -1 ? accountProc.balances.steamBalance + " RUB" :
                    <Spinner className={"w-3 h-3 inline-block ml-1 border-blue-600"}/>}<img
                    onClick={() => dispatch(getSteamBalanceThunkCreator(selected))} className="ml-1 inline"
                    src={refreshIcon} alt=""/></div>
                <div
                    className="mt-1 text-xs">Инвентарь: {accountProc.balances.inventoryCost > -1 ? accountProc.balances.inventoryCost + " RUB" :
                    <Spinner className={"w-3 h-3 inline-block ml-1 border-blue-600"}/>}<img
                    onClick={() => dispatch(getInventoryCostThunkCreator(selected))} className="ml-1 inline"
                    src={refreshIcon} alt=""/></div>
                <div
                    className="mt-1 text-xs">Лоты: {accountProc.balances.steamMarketLots > -1 ? accountProc.balances.steamMarketLots + " RUB" :
                    <Spinner className={"w-3 h-3 inline-block ml-1 border-blue-600"}/>}<img
                    onClick={() => dispatch(getSteamMarketLotsThunkCreator(selected))} className="ml-1 inline"
                    src={refreshIcon} alt=""/></div>
            </div>
            <div className="pl-3">
                <div className="text-center text-sm">Статус <img
                    onClick={() => dispatch(getMarketStatusThunkCreator(selected))} className="ml-1 inline"
                    src={refreshIcon} alt=""/></div>
                <div className="flex items-center justify-between text-xs mt-0.5">
                    <div className="">Онлайн:</div>
                    <div className="">{accountProc.status.online === -1 ?
                        <Spinner className={"w-3 h-3 inline-block ml-1 border-blue-600"}/> : accountProc.status.online ?
                            <img src={okIcon} alt=""/> : <img src={notOkIcon} alt=""/>}</div>
                </div>
                <div className="flex items-center justify-between text-xs mt-0.5">
                    <div className="">Ссылка на обмен:</div>
                    <div className="">{accountProc.status.tradeLink === -1 ? <Spinner
                        className={"w-3 h-3 inline-block ml-1 border-blue-600"}/> : accountProc.status.tradeLink ?
                        <img src={okIcon} alt=""/> : <img src={notOkIcon} alt=""/>}</div>

                </div>
                <div className="flex items-center justify-between text-xs mt-0.5">
                    <div className="">Доступность трейд офферов:</div>
                    <div className="">{accountProc.status.tradeOfferAvailability === -1 ? <Spinner
                        className={"w-3 h-3 inline-block ml-1 border-blue-600"}/> : accountProc.status.tradeOfferAvailability ?
                        <img src={okIcon} alt=""/> : <img src={notOkIcon} alt=""/>}</div>

                </div>
                <div className="flex items-center justify-between text-xs mt-0.5">
                    <div className="">Доступность продаж:</div>
                    <div className="">{accountProc.status.saleAvailability === -1 ? <Spinner
                        className={"w-3 h-3 inline-block ml-1 border-blue-600"}/> : accountProc.status.saleAvailability ?
                        <img src={okIcon} alt=""/> : <img src={notOkIcon} alt=""/>}</div>

                </div>
            </div>
        </div>
    );
};

export default AccountCard;
