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
                   className="w-24 h-6 ml-14 rounded-md border-gray-300 active:border-orange-500 disabled:bg-gray-200 border-2 text-center text-sm"
                   value={item.minLimit} disabled={disabled} type="text"/>
            <input onFocus={() => onVisibleInfo(true)} onBlur={() => onVisibleInfo(false)}
                   onChange={(e) => dispatch(changeMonitoringItemFieldsAction(selected, index, "maxLimit", e.currentTarget.value))}
                   className="w-24 h-6 ml-4 rounded-md border-gray-300 active:border-orange-500 disabled:bg-gray-200 border-2 text-center text-sm"
                   value={item.maxLimit} disabled={disabled} type="text"/>
            {visibleInfo ? <ItemInfo item={item} selected={selected} buyPrice={buyPrice}/> : null}
        </li>
    );
};

const ItemInfo = ({item, buyPrice}) => {
    return (
        <div className="absolute rounded-md top-5 bg-white border-blue-100 border-2 w-[350px] flex z-10">
            <div className="w-24 p-2 bg-gray-200 flex align-middle">
                <img className="w-full h-full"
                     src={"https://community.akamai.steamstatic.com/economy/image/" + item.img + "/360fx360f"} alt=""/>
            </div>
            <div className="text-xs p-5 pl-2">
                <div className="">Моя цена: {item.price} RUB</div>
                <div className="">Минимальная цена: {item.minPrice} RUB</div>
                <div className="">Цена покупки: {buyPrice} RUB</div>
                <div className="">Цена моментальной продажи: {item.orderPrice} RUB</div>
            </div>
        </div>
    );
};

export default MonitoringItems;