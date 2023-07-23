import React, {useEffect, useRef} from 'react';
import Button from "./shared/Button";
import Input from "./shared/Input";
import Header from "./shared/Header";
import {useDispatch, useSelector} from "react-redux";
import {changeFieldValueAction, startAutobuyTimerThunkCreator, stopAutobuyAction} from "../store/mainReducer";
import Checkbox from "./shared/Checkbox";

const Autobuy = ({selected}) => {
    const data = useSelector(state => state.accounts[selected]["funcSaves"]["autobuy"]["fields"]);
    const process = useSelector(state => state.process[selected]["func"]["autobuy"]);
    const endListRef = useRef(null);
    const scrollToBottom = () => {
        endListRef.current?.scrollTo(0, endListRef.current?.scrollHeight);
    }

    useEffect(() => {
        scrollToBottom()
    });
    const dispatch = useDispatch();
    // const checkboxWithQuestion = [
    //     {
    //         text: "Динамический мин. %",
    //         id: "dynamicPercent",
    //         checked: data.dynamicPercent,
    //     }
    // ];

    const checkbox = [
        {
            text: "Knife",
            id: "knife",
            checked: data.knife,
        },
        {
            text: "Stattrak",
            id: "stattrak",
            checked: data.stattrak,
        },
        {
            text: "Souvenir",
            id: "souvenir",
            checked: data.souvenir,
        },
        {
            text: "Sticker",
            id: "sticker",
            checked: data.sticker,
        }
    ];

    const inputs = [
        {
            text: "Мин. %",
            id: "minPercent",
            value: data.minPercent,
            inputStyle: "w-24"
        },
        {
            text: "Макс. %",
            id: "maxPercent",
            value: data.maxPercent,
            inputStyle: "w-24"
        },
        {
            text: "Мин. цена",
            id: "minPrice",
            value: data.minPrice,
            inputStyle: "w-24"
        },
        {
            text: "Макс. цена",
            id: "maxPrice",
            value: data.maxPrice,
            inputStyle: "w-24"
        },
        {
            text: "Фильтр продаж",
            id: "salesFilter",
            value: data.salesFilter,
            inputStyle: "w-32"
        },
        {
            text: "Ограничение баланса",
            id: "balanceLimit",
            value: data.balanceLimit,
            inputStyle: "w-32"
        },
    ]

    const setCheckboxValue = (e) => {
        console.log(e.target.checked)
        dispatch(changeFieldValueAction({
            field: e.target.id,
            selected: selected,
            type: "autobuy",
            value: (e.target.checked)
        }));
    }

    const setFieldValue = (e) => {
        dispatch(changeFieldValueAction({
            field: e.target.id,
            selected: selected,
            type: "autobuy",
            value: e.target.value
        }));
    }

    const items = process.logs.map((item, i) => {
        return (
            <li key={i}
                className="after:block after:content-[''] after:h-0.5 after:bg-blue-100 after:shadow-2xl after:mt-0.5 flex justify-between items-center mt-0.5">
                <div className="text-xs">{item}</div>
            </li>
        );
    });

    return (
        <div className="monitoring">
            <Header>Autobuy</Header>
            <div className="flex">

                <div className="w-[600px] mt-3">
                    <div className="mt-1 px-4 py-1.5 space-y-1 rounded-2xl border-blue-100 border-2 shadow-2xl ">
                        <ul ref={endListRef} className="overflow-y-auto h-[560px]">
                            {items}
                        </ul>
                    </div>
                </div>

                <div className="mt-3 w-52 ml-11 text-sm">
                    <div className="flex justify-between mt-2">
                        <Button buttonStyle={"w-16 h-9"} disabled={process.browser} onClick={() => {
                            dispatch(startAutobuyTimerThunkCreator(selected))
                        }}>Старт</Button>
                        <div
                            className={`w-8 h-8 rounded-full ${process.browser ? "bg-green-500" : "bg-red-500"}`}></div>
                        <Button buttonStyle={"w-16 h-9"} disabled={process.browser && !process.funcAddress}
                                onClick={() => {
                                    dispatch(stopAutobuyAction(selected))
                                }}>Стоп</Button>
                    </div>

                    {/*{checkboxWithQuestion.map((item,i)=>(*/}
                    {/*    <CheckboxWithQuestion key={i} disabled={process.browser} text={item.text} id={item.id} onChange={setCheckboxValue} checked={item.checked}/>*/}
                    {/*))}*/}

                    <div className="flex items-center space-x-2 mt-4">
                        {checkbox.map((item, i) => (
                            <Checkbox key={i} text={item.text} id={item.id} onChange={setCheckboxValue}
                                      checked={item.checked} disabled={process.browser}/>
                        ))}
                    </div>

                    <div className="flex flex-wrap justify-between mt-4">
                        {inputs.map((item, i) => (
                            <Input key={i} id={item.id} text={item.text} inputStyle={item.inputStyle}
                                   onChange={setFieldValue} value={item.value} disabled={process.browser}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Autobuy;
