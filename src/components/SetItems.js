import React from 'react';
import Button from "./shared/Button";
import Header from "./shared/Header";
import {useDispatch, useSelector} from "react-redux";
import CheckboxWithQuestion from "./shared/CheckboxWithQuestion";
import {
    changeFieldValueAction,
    changeSetItemFieldsAction,
    getMarketBuyHistoryThunkCreator,
    getSetItemsThunkCreator, setItemsThunkCreator
} from "../store/mainReducer";
import Spinner from "./shared/Spinner";

const SetItems = ({selected}) => {
    const data = useSelector(state => state.accounts[selected]["funcSaves"]["setItems"]["fields"]);
    const process = useSelector(state => state.process[selected]["func"]["setItems"]);
    const marketBuyHistory = useSelector(state => state.process[selected]["marketBuyHistory"]);
    const dispatch = useDispatch();
    const checkboxWithQuestion = [
        {
            text: "Автоматически подставлять большую из цен",
            description: "Подставляет большую между минимальной ценой на market.csgo и ценой покупки",
            id: "autoSetHigherPrice",
            checked: data.autoSetHigherPrice,
            disabled: process.onLoading || process.func
        },
        {
            text: "Автоматически запускать \"Выставление предметов\"",
            description: "\"Выставление предметов\" будет автоматически обновлять предметы и выставлять на продажу раз в 6 часов. Доступна при включенной функции автоматической подстановки цены.",
            id: "autoSetItemsStart",
            checked: data.autoSetItemsStart,
            disabled: process.onLoading || process.func || !data.autoSetHigherPrice
        }
    ];

    const setCheckboxValue = (e) => {
        dispatch(changeFieldValueAction({
            field: e.target.id,
            selected: selected,
            type: "setItems",
            value: (e.target.checked)
        }));
    }



    const items = process.items.map((item, i) => {
        return (
            item.error ? <div key={i} className="text-center mt-40">{item.error}</div> :
            <li key={i}
                className="flex justify-between items-center mt-0.5">
                <div className="w-80 text-xs">{item.name}</div>
                <div className="w-20 text-xs text-center">{item.minPrice} RUB</div>
                <div className="w-20 text-xs text-center">{marketBuyHistory[item.name]} RUB</div>
                <input className="w-20 h-6 ml-4 rounded-md border-gray-300 active:border-orange-500 disabled:bg-gray-200 border-2 text-center text-sm" type="text" disabled={process.func} onChange={(e) => dispatch(changeSetItemFieldsAction(selected, i, "price", e.currentTarget.value))} value={item.price}/>

            </li>
        );
    });
    return (
        <div className="monitoring">
            <Header>Выставление предметов</Header>

            <div className="flex">

                <div className="w-[630px]">
                    <div className="flex mt-3 px-4">
                        <div className="w-96">Название предмета</div>
                        <div className="w-28 text-center">Мин. цена</div>
                        <div className="w-28 text-center">Цена покупки</div>
                        <div className="w-28 text-center">Цена</div>

                    </div>
                    <div className="mt-1 px-4 py-1.5  space-y-1 rounded-2xl border-blue-100 border-2 shadow-2xl ">
                        <ul className="overflow-y-auto h-[530px]">
                            {process.onLoading ?
                                <Spinner className={"w-36 h-36 border-blue-600 m-auto mt-40 "}/> : items}
                        </ul>
                    </div>

                </div>

                <div className="mt-10 w-52 ml-7 text-sm">

                    <Button buttonStyle={"w-44 h-9 mx-auto"} disabled={process.onLoading || process.func}  onClick={() => dispatch(getSetItemsThunkCreator(selected))}>Обновить инвентарь</Button>
                    <Button buttonStyle={"w-44 h-9 mt-2 mx-auto"} disabled={process.onLoading || process.func} onClick={() => dispatch(setItemsThunkCreator(selected))}>Выставить</Button>
                    {marketBuyHistory !== -1 ?
                        <Button onClick={() => dispatch(getMarketBuyHistoryThunkCreator(selected))}
                                buttonStyle={"w-44 h-6 mt-6 mx-auto bg-blue-500"}>Обновить цены покупки</Button> :
                        <Spinner className={"w-6 h-6 mt-6 mx-auto border-blue-600"}/>}

                    {checkboxWithQuestion.map((item, i) => (
                        <CheckboxWithQuestion key={i} text={item.text} description={item.description} disabled={item.disabled} id={item.id} onChange={setCheckboxValue}
                                              checked={item.checked}/>
                    ))}

                </div>
            </div>
        </div>
    );
}

export default SetItems;
