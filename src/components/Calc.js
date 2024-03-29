import React, { useMemo } from 'react';
import {useValidate} from "../hooks/useValidate";
import Modal from "./shared/Modal";
import Header from "./shared/Header";
import Input from "./shared/Input";



const Calc = ({onCalc}) => {
    const [firstPrice, setFirstPrice] = useValidate('');
    const [secondPrice, setSecondPrice] = useValidate('');
    const [commission, setCommission] = useValidate(13);

    const onCalculate = () => {
        return (withoutComm / firstPrice).toFixed(2);

    }

    const onWithoutCommission = () => {
        return (secondPrice - (secondPrice / 100) * commission).toFixed(2);
    }

    const withoutComm = useMemo(() => onWithoutCommission(), [secondPrice, commission]);
    const result = useMemo(() => onCalculate(), [firstPrice, secondPrice, commission]);

    return (
        <Modal onClose={() => {
            onCalc(false)
        }}>
            <div className="w-80 px-11 pb-6">
                <div className="text-center">
                    <Header>Калькулятор выгоды</Header>
                </div>
                <div className="mt-2 flex flex-wrap justify-center">
                    <Input value={firstPrice} onChange={e => setFirstPrice(e.target.value)} text={"Цена 1"}
                           inputStyle={"w-56 h-8"}/>
                    <Input value={secondPrice} onChange={e => setSecondPrice(e.target.value)} text={"Цена 2"}
                           inputStyle={"w-56 h-8"}/>
                    <Input value={commission} onChange={e => setCommission(e.target.value)} text={"% комиссии"}
                           inputStyle={"w-56 h-8"}/>
                </div>

                <div className="mt-3">
                    <div className="text-sm">Цена продажи с учетом комиссии: {withoutComm}</div>
                    <div className="mt-2 text-center text-2xl text-blue-600">{result}x</div>
                </div>
            </div>
        </Modal>
    );
};

export default Calc;
