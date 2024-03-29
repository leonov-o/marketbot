import React, {useEffect, useRef} from 'react';
import Button from "./shared/Button";
import Input from "./shared/Input";
import Header from "./shared/Header";
import {useDispatch, useSelector} from "react-redux";
import {changeFieldValueAction, startAutobuyTimerThunkCreator, stopAutobuyAction} from "../store/actions/actionCreators";
import Checkbox from "./shared/Checkbox";
import CheckboxWithQuestion from "./shared/CheckboxWithQuestion";

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
    const checkboxWithQuestion = [
        // {
        //     text: "Динамический мин. %",
        //     id: "dynamicPercent",
        //     checked: data.dynamicPercent,
        // },
        {
            text: "Автоматическая продажа предметов",
            description: "Продажа купленных предметов на 0.05 руб. ниже минимальной цены.",
            id: "autoSell",
            checked: data.autoSell,
        },
        // {
        //     text: "Aвтоматическая подстановка поля \"Мин. %\" максимальным значением в таблице",
        //     description: "Выбирает процент самого верхнего предмета в таблице и подставляет в поле \"Мин. %\".",
        //     id: "autoSetMaxPercentFromTable",
        //     checked: data.autoSetMaxPercentFromTable,
        // }
    ];

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

                <div className="mt-3 w-[600px]">
                    <div className="mt-1 rounded-2xl border-2 border-blue-100 px-4 shadow-2xl py-1.5 space-y-1">
                        <ul ref={endListRef} className="overflow-y-auto h-[560px]">
                            {items}
                        </ul>
                    </div>
                </div>

                <div className="mt-3 ml-11 w-52 text-sm">
                    <div className="mt-2 flex justify-between">
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



                    {checkboxWithQuestion.map((item, i) => (
                        <CheckboxWithQuestion key={i} disabled={process.browser} text={item.text}
                                              description={item.description} id={item.id} onChange={setCheckboxValue}
                                              checked={item.checked}/>
                    ))}

                    <CheckboxWithQuestion text={"Aвтоматическая подстановка поля \"Мин. %\" максимальным значением в таблице"}
                                          description={"Выбирает процент самого верхнего предмета в таблице и подставляет в поле \"Мин. %\"."}
                                          id="autoSetMaxPercentFromTable"
                                          onChange={setCheckboxValue}
                                          disabled={process.browser}
                                          checked={data.autoSetMaxPercentFromTable}/>
                    <div className="mt-2 flex justify-end space-x-4">
                        <div className={"text-sm"}>не ниже</div>
                        <input id="autoSetMaxPercentFromTableValue" onChange={setFieldValue} value={data.autoSetMaxPercentFromTableValue}
                               className="h-6 w-16 rounded-md border-2 border-gray-300 text-center text-sm active:border-orange-500 disabled:bg-gray-200"
                               type="number" disabled={process.browser || !data.autoSetMaxPercentFromTable}/>
                        <div className={"text-sm"}> %</div>
                    </div>

                    <CheckboxWithQuestion text={"Автоматически запускать \"Autobuy\" при балансе"}
                                          description={"\"Autobuy\" будет автоматически включаться по выставленным параметрам раз в 2 часа. Важно, чтобы поле \"Мин. %\" было заполнено, либо воспользуйтесь функцией автоматической подстановки поля \"Мин. %\" максимальным значением в таблице."}
                                          id="autoAutobuyStart"
                                          onChange={setCheckboxValue}
                                          disabled={process.browser}
                                          checked={data.autoAutobuyStart}/>
                    <div className="mt-2 flex justify-end space-x-4">
                        <div className={"text-sm"}>от</div>
                        <input id="autoAutobuyStartValue" onChange={setFieldValue} value={data.autoAutobuyStartValue}
                               className="h-6 w-16 rounded-md border-2 border-gray-300 text-center text-sm active:border-orange-500 disabled:bg-gray-200"
                               type="number" disabled={process.browser || !data.autoAutobuyStart}/>
                        <div className={"text-sm"}> RUB</div>
                    </div>

                    <div className="mt-4 flex items-center space-x-2">
                        {checkbox.map((item, i) => (
                            <Checkbox key={i} text={item.text} id={item.id} onChange={setCheckboxValue}
                                      checked={item.checked} disabled={process.browser}/>
                        ))}
                    </div>

                    <div className="mt-4 flex flex-wrap justify-between">
                        {inputs.map((item, i) => (
                            <Input key={i} id={item.id} text={item.text} inputStyle={item.inputStyle}
                                   onChange={setFieldValue} value={item.value} type="number" disabled={process.browser}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Autobuy;
