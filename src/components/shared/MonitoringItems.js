import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {changeMonitoringItemFieldsAction} from "../../store/actions/actionCreators";

const MonitoringItems = ({item, selected, index, disabled}) => {
    const dispatch = useDispatch();
    const [visibleInfo, onVisibleInfo] = useState(false);
    const marketBuyHistory = useSelector(state => state.process[selected]["marketBuyHistory"]);
    const buyPrice = marketBuyHistory[item.name]?marketBuyHistory[item.name]:"...";

    const legacyPrice = item.minPrice < item.price && item.minPrice < item.minLimit
    return (
        <li
            className={`flex justify-between px-1 items-center rounded-md mt-0.5 relative transition-all ${legacyPrice?"bg-red-200":null}`}>
            <div className="w-80 text-xs">{item.name}</div>
            <input onFocus={() => onVisibleInfo(true)} onBlur={() => onVisibleInfo(false)}
                   onChange={(e) => dispatch(changeMonitoringItemFieldsAction(selected, index, "minLimit", e.currentTarget.value))}
                   className="ml-14 h-6 w-24 rounded-md border-2 border-gray-300 text-center text-sm active:border-orange-500 disabled:bg-gray-200"
                   value={item.minLimit} disabled={disabled} type="text"/>
            <input onFocus={() => onVisibleInfo(true)} onBlur={() => onVisibleInfo(false)}
                   onChange={(e) => dispatch(changeMonitoringItemFieldsAction(selected, index, "maxLimit", e.currentTarget.value))}
                   className="ml-4 h-6 w-24 rounded-md border-2 border-gray-300 text-center text-sm active:border-orange-500 disabled:bg-gray-200"
                   value={item.maxLimit} disabled={disabled} type="text"/>
            {visibleInfo ? <ItemInfo item={item} selected={selected} buyPrice={buyPrice}/> : null}
        </li>
    );
};

const ItemInfo = ({item, buyPrice}) => {
    return (
        <div className="absolute top-5 z-10 flex rounded-md border-2 border-blue-100 bg-white w-[350px]">
            <div className="flex w-24 bg-gray-200 p-2 align-middle">
                <img className="h-full w-full"
                     src={"https://community.akamai.steamstatic.com/economy/image/" + item.img + "/360fx360f"} alt=""/>
            </div>
            <div className="p-5 pl-2 text-xs">
                <div className="">Моя цена: {item.price} RUB</div>
                <div className="">Минимальная цена: {item.minPrice} RUB</div>
                <div className="">Цена покупки: {buyPrice} RUB</div>
                <div className="">Цена моментальной продажи: {item.orderPrice} RUB</div>
            </div>
        </div>
    );
};

export default MonitoringItems;
