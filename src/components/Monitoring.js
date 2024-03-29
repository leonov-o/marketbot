import Button from "./shared/Button";
import Header from "./shared/Header";
import {useDispatch, useSelector} from "react-redux";
import {
    changeFieldValueAction,
    getMonitoringItemsThunkCreator,
    pasteMonitoringItemsValueAction,
    saveMonitoringItemsValueAction,
    startMonitoringTimerThunkCreator,
    stopMonitoringAction
} from "../store/actions/actionCreators";
import CheckboxWithQuestion from "./shared/CheckboxWithQuestion";
import MonitoringItems from "./shared/MonitoringItems";
import Spinner from "./shared/Spinner";

const Monitoring = ({selected}) => {
    const data = useSelector(state => state.accounts[selected]["funcSaves"]["monitoring"]["fields"]);
    const process = useSelector(state => state.process[selected]["func"]["monitoring"]);
    const dispatch = useDispatch();

    const setCheckboxValue = (e) => {
        dispatch(changeFieldValueAction({
            field: e.target.id,
            selected: selected,
            type: "monitoring",
            value: (e.target.checked)
        }));
    }

    const setInputValue = (e) => {
        dispatch(changeFieldValueAction({
            field: e.target.id,
            selected: selected,
            type: "monitoring",
            value: (e.target.value)
        }));
    }

    const items = process.items.map((item, i) => {

        return (
            item.error ? <div className="mt-40 text-center">{item.error}</div> :
                <MonitoringItems item={item} selected={selected} disabled={process.funcAddress} index={i} key={i}/>
        );
    });

    return (
        <div className="monitoring">
            <Header>Мониторинг цен</Header>
            <div className="flex">

                <div className="w-[630px]">
                    <div className="mt-3 flex px-4">
                        <div className="w-96">Название предмета</div>
                        <div className="w-28 text-center">Мин. порог</div>
                        <div className="w-28 text-center">Макс. порог</div>
                    </div>
                    <div className="mt-1 rounded-2xl border-2 border-blue-100 px-4 shadow-2xl py-1.5 space-y-1">
                        <ul className="overflow-y-auto h-[530px]">
                            {process.onLoading ?
                                <Spinner className={"w-36 h-36 border-blue-600 m-auto mt-40 "}/> : items}
                        </ul>
                    </div>
                    <div className="float-right mt-1 text-xs space-y-px">
                        <Button onClick={() => dispatch(pasteMonitoringItemsValueAction(selected))}
                                buttonStyle="w-24 h-6"
                                disabled={process.funcAddress || process.onLoading}>Вставить</Button>
                        <Button onClick={() => dispatch(saveMonitoringItemsValueAction(selected))}
                                buttonStyle="w-24 h-6"
                                disabled={process.funcAddress || process.onLoading}>Сохранить</Button>
                    </div>
                </div>

                <div className="mt-10 ml-7 w-52 text-sm">
                    <Button buttonStyle={"w-52 h-9"} disabled={process.funcAddress || process.onLoading}
                            onClick={() => {
                                dispatch(getMonitoringItemsThunkCreator(selected))
                            }}>Обновить выставленые предметы</Button>
                    <div className="mt-2 flex justify-between">
                        <Button buttonStyle={"w-16 h-9"} disabled={process.funcAddress || process.onLoading}
                                onClick={() => {
                                    dispatch(startMonitoringTimerThunkCreator(selected))
                                }}>Старт</Button>
                        <div
                            className={`w-8 h-8 rounded-full ${process.funcAddress ? "bg-green-500" : "bg-red-500"}`}></div>
                        <Button buttonStyle={"w-16 h-9"} disabled={process.onLoading} onClick={() => {
                            dispatch(stopMonitoringAction(selected))
                        }}>Стоп</Button>
                    </div>
                    <CheckboxWithQuestion text="Автоматически подставлять мин. порог"
                                          description={"Подставляет минимальный порог на N руб. ниже цены покупки"}
                                          id="autoMinLimit"
                                          onChange={setCheckboxValue}
                                          disabled={process.funcAddress || process.onLoading}
                                          checked={data.autoMinLimit}/>
                    <div className="mt-2 flex items-center justify-start space-x-2">
                        <div>-</div>
                        <input id="autoMinLimitValue"  onChange={setInputValue} value={data.autoMinLimitValue}
                               className="h-6 w-12 rounded-md border-2 border-gray-300 text-center text-sm active:border-orange-500 disabled:bg-gray-200"
                               type="number" disabled={!data.autoMinLimit || process.funcAddress || process.onLoading}/>
                        <div className="">
                            <fieldset className="space-x-2" id="group">
                                <input type="radio" checked={(data.autoMinLimitMode === "number") || (!data.autoMinLimitMode)} onChange={setInputValue} value="number" id="autoMinLimitMode" name="group"/>
                                <label htmlFor="number">RUB</label>
                                <input type="radio" checked={data.autoMinLimitMode === "percent"} onChange={setInputValue} value="percent"  id="autoMinLimitMode" name="group"/>
                                <label htmlFor="percent">%</label>
                            </fieldset>
                        </div>
                    </div>
                    <CheckboxWithQuestion text="Автоматически подставлять макс. порог"
                                          description={"Подставляет максимальный порог на N руб. выше цены покупки"}
                                          id="autoMaxLimit"
                                          onChange={setCheckboxValue}
                                          disabled={process.funcAddress || process.onLoading}
                                          checked={data.autoMaxLimit}/>
                    <div className="mt-2 flex items-center justify-start space-x-2">
                        <div>+</div>
                        <input id="autoMaxLimitValue" onChange={setInputValue} value={data.autoMaxLimitValue}
                               className="h-6 w-12 rounded-md border-2 border-gray-300 text-center text-sm active:border-orange-500 disabled:bg-gray-200"
                               type="number" disabled={!data.autoMaxLimit || process.funcAddress || process.onLoading}/>
                        <div> RUB</div>
                    </div>
                    <CheckboxWithQuestion text={"Автоматически запускать \"Мониторинг цен\""}
                                          description={"\"Мониторинг цен\" будет автоматически обновлять выставленные предметы и включаться раз в 6 часов. Доступна при включенных функциях автоматической подстановки мин. и макс. порогов."}
                                          id="autoMonitoringStart"
                                          onChange={setCheckboxValue}
                                          disabled={process.funcAddress || process.onLoading || !data.autoMinLimit || !data.autoMaxLimit}
                                          checked={data.autoMonitoringStart}/>
                </div>
            </div>
        </div>
    );
}

export default Monitoring;
