import Button from "./shared/Button";
import Header from "./shared/Header";
import {useDispatch, useSelector} from "react-redux";
import {
    changeFieldValueAction,
    pasteMonitoringItemsValueAction,
    saveMonitoringItemsValueAction, startMonitoringTimerThunkCreator
} from "../store/mainReducer";
import CheckboxWithQuestion from "./shared/CheckboxWithQuestion";
import {getMonitoringItemsThunkCreator, stopMonitoringAction} from "../store/mainReducer";
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
            item.error ? <div className="text-center mt-40">{item.error}</div> :
                <MonitoringItems item={item} selected={selected} disabled={process.funcAddress} index={i} key={i}/>
        );
    });

    return (
        <div className="monitoring">
            <Header>Мониторинг цен</Header>
            <div className="flex">

                <div className="w-[630px]">
                    <div className="flex mt-3 px-4">
                        <div className="w-96">Название предмета</div>
                        <div className="w-28 text-center">Мин. порог</div>
                        <div className="w-28 text-center">Макс. порог</div>
                    </div>
                    <div className="mt-1 px-4 py-1.5  space-y-1 rounded-2xl border-blue-100 border-2 shadow-2xl ">
                        <ul className="overflow-y-auto h-[530px]">
                            {process.onLoading ?
                                <Spinner className={"w-36 h-36 border-blue-600 m-auto mt-40 "}/> : items}
                        </ul>
                    </div>
                    <div className="text-xs float-right space-y-px mt-1">
                        <Button onClick={() => dispatch(pasteMonitoringItemsValueAction(selected))}
                                buttonStyle="w-24 h-6" disabled={process.funcAddress || process.onLoading}>Вставить</Button>
                        <Button onClick={() => dispatch(saveMonitoringItemsValueAction(selected))}
                                buttonStyle="w-24 h-6" disabled={process.funcAddress || process.onLoading}>Сохранить</Button>
                    </div>
                </div>

                <div className="mt-10 w-52 ml-7 text-sm">
                    <Button buttonStyle={"w-52 h-9"} disabled={process.funcAddress || process.onLoading} onClick={() => {
                        dispatch(getMonitoringItemsThunkCreator(selected))
                    }}>Обновить выставленые предметы</Button>
                    <div className="flex justify-between mt-2">
                        <Button buttonStyle={"w-16 h-9"} disabled={process.funcAddress || process.onLoading} onClick={() => {
                            dispatch(startMonitoringTimerThunkCreator(selected))
                        }}>Старт</Button>
                        <div
                            className={`w-8 h-8 rounded-full ${process.funcAddress ? "bg-green-500" : "bg-red-500"}`}></div>
                        <Button buttonStyle={"w-16 h-9"} disabled={process.onLoading} onClick={() => {
                            dispatch(stopMonitoringAction(selected))
                        }}>Стоп</Button>
                    </div>
                    <CheckboxWithQuestion text="Автоматически подставлять мин. порог" description={"Подставляет минимальный порог на N руб. ниже цены покупки"} id="autoMinLimit"
                                          onChange={setCheckboxValue} disabled={process.funcAddress || process.onLoading} checked={data.autoMinLimit}/>
                    <div className="mt-2 flex justify-start space-x-2">
                        <div>-</div>
                        <input id="autoMinLimitValue" onChange={setInputValue} value={data.autoMinLimitValue}
                               className="w-12 h-6 rounded-md border-gray-300 active:border-orange-500 disabled:bg-gray-200 border-2 text-center text-sm"
                               type="text" disabled={!data.autoMinLimit || process.funcAddress || process.onLoading}/>
                        <div> RUB</div>
                    </div>
                    <CheckboxWithQuestion text="Автоматически подставлять макс. порог" description={"Подставляет максимальный порог на N руб. выше цены покупки"} id="autoMaxLimit"
                                          onChange={setCheckboxValue} disabled={process.funcAddress || process.onLoading} checked={data.autoMaxLimit}/>
                    <div className="mt-2 flex justify-start space-x-2">
                        <div>+</div>
                        <input id="autoMaxLimitValue" onChange={setInputValue} value={data.autoMaxLimitValue}
                               className="w-12 h-6 rounded-md border-gray-300 active:border-orange-500 disabled:bg-gray-200 border-2 text-center text-sm"
                               type="text" disabled={!data.autoMaxLimit || process.funcAddress || process.onLoading}/>
                        <div> RUB</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Monitoring;
