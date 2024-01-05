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
            className="account_card w-48 h-64 my-3 ml-4 px-2 py-1.5 space-y-1 rounded-2xl border-blue-600 border-2 shadow-xl">
            <div className="flex justify-between">
                <div
                    className="w-7 h-7 rounded-3xl bg-white border-2 border-blue-600 flex justify-center items-center shadow-lg">
                    <img className="w-6 h-6 rounded-3xl"
                         src={accountProc.avatarUrl ? accountProc.avatarUrl : userAvatarSm} alt=""/>
                </div>
                <div className="text-sm text-center w-28">{data[selected].authData.login.length > 12
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
                    className="text-xs mt-1">Market: {accountProc.balances.marketBalance > -1 ? accountProc.balances.marketBalance + " RUB" :
                    <Spinner className={"w-3 h-3 inline-block ml-1 border-blue-600"}/>}<img
                    onClick={() => dispatch(getMarketBalanceThunkCreator(selected))} className="inline ml-1"
                    src={refreshIcon} alt=""/></div>
                <div
                    className="text-xs mt-1">Steam: {accountProc.balances.steamBalance > -1 ? accountProc.balances.steamBalance + " RUB" :
                    <Spinner className={"w-3 h-3 inline-block ml-1 border-blue-600"}/>}<img
                    onClick={() => dispatch(getSteamBalanceThunkCreator(selected))} className="inline ml-1"
                    src={refreshIcon} alt=""/></div>
                <div
                    className="text-xs mt-1">Инвентарь: {accountProc.balances.inventoryCost > -1 ? accountProc.balances.inventoryCost + " RUB" :
                    <Spinner className={"w-3 h-3 inline-block ml-1 border-blue-600"}/>}<img
                    onClick={() => dispatch(getInventoryCostThunkCreator(selected))} className="inline ml-1"
                    src={refreshIcon} alt=""/></div>
                <div
                    className="text-xs mt-1">Лоты: {accountProc.balances.steamMarketLots > -1 ? accountProc.balances.steamMarketLots + " RUB" :
                    <Spinner className={"w-3 h-3 inline-block ml-1 border-blue-600"}/>}<img
                    onClick={() => dispatch(getSteamMarketLotsThunkCreator(selected))} className="inline ml-1"
                    src={refreshIcon} alt=""/></div>
            </div>
            <div className="pl-3">
                <div className="text-center text-sm">Статус <img
                    onClick={() => dispatch(getMarketStatusThunkCreator(selected))} className="inline ml-1"
                    src={refreshIcon} alt=""/></div>
                <div className="text-xs mt-0.5 flex justify-between items-center">
                    <div className="">Онлайн:</div>
                    <div className="">{accountProc.status.online === -1 ?
                        <Spinner className={"w-3 h-3 inline-block ml-1 border-blue-600"}/> : accountProc.status.online ?
                            <img src={okIcon} alt=""/> : <img src={notOkIcon} alt=""/>}</div>
                </div>
                <div className="text-xs mt-0.5 flex justify-between items-center">
                    <div className="">Ссылка на обмен:</div>
                    <div className="">{accountProc.status.tradeLink === -1 ? <Spinner
                        className={"w-3 h-3 inline-block ml-1 border-blue-600"}/> : accountProc.status.tradeLink ?
                        <img src={okIcon} alt=""/> : <img src={notOkIcon} alt=""/>}</div>

                </div>
                <div className="text-xs mt-0.5 flex justify-between items-center">
                    <div className="">Доступность трейд офферов:</div>
                    <div className="">{accountProc.status.tradeOfferAvailability === -1 ? <Spinner
                        className={"w-3 h-3 inline-block ml-1 border-blue-600"}/> : accountProc.status.tradeOfferAvailability ?
                        <img src={okIcon} alt=""/> : <img src={notOkIcon} alt=""/>}</div>

                </div>
                <div className="text-xs mt-0.5 flex justify-between items-center">
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
