import React, {useState} from 'react';
import Input from "./shared/Input";
import Button from "./shared/Button";
import Header from "./shared/Header";
import Modal from "./shared/Modal";
import {useSelector} from "react-redux";


const BalanceTransfer = ({onBalanceTransfer}) => {
    const data = useSelector(state => state.accounts)

    const [sum, onSum] = useState('');
    const [apiRecipient, onApiRecipient] = useState('');
    const [apiSender, onApiSender] = useState('');
    const [payPass, onPayPass] = useState('');
    const [success, onSuccess] = useState(false)

    const onSelectApiRecipient = (e) => {
        const api = data.find(item => item.authData.login === e.target.value).authData.marketApi;
        onApiRecipient(api);
    }
    const onSelectApiSender = (e) => {
        const api = data.find(item => item.authData.login === e.target.value).authData.marketApi;
        onApiSender(api);
    }

    const onSendMoney = async () => {
        onSuccess(false);
        let url = `https://market.csgo.com/api/v2/money-send/${sum * 100}/${apiRecipient}?pay_pass=${payPass}&key=${apiSender}`
        let res = await fetch(encodeURI(url));
        let json = await res.json();
        if (json.success) {
            onSuccess(true);
            await new Promise((r) => setTimeout(r, 4000));
            onSuccess(false);
        }
    }

    return (
        <Modal onClose={() => {
            onBalanceTransfer(false)
        }}>
            <div className="px-9 pb-6">
                <div className="text-center">
                    <Header>Перенос баланса</Header>
                </div>
                <div className="mt-3 ml-4">
                    <Input text={"Сумма"} inputStyle={"w-56 text-sm"} value={sum}
                           onChange={e => onSum(e.target.value)}/>
                    <div className="flex items-end justify-between space-x-2">
                        <Input text={"API-ключ получателя"} inputStyle={"w-56 text-sm"} value={apiRecipient}
                               onChange={e => onApiRecipient(e.target.value)}/>
                        <select defaultValue={'Выбор аккаунта'} onChange={onSelectApiRecipient}>
                            <option disabled={true} hidden={true}>Выбор аккаунта</option>
                            {data.map((item, i) => (<option key={i}>{item.authData.login}</option>))}
                        </select>
                    </div>
                    <div className="flex items-end justify-between space-x-2">
                        <Input text={"API-ключ отправителя"} inputStyle={"w-56 text-sm"} value={apiSender}
                               onChange={e => onApiSender(e.target.value)}/>
                        <select defaultValue={'Выбор аккаунта'} onChange={onSelectApiSender}>
                            <option disabled={true} hidden={true}>Выбор аккаунта</option>
                            {data.map((item, i) => (<option key={i}>{item.authData.login}</option>))}
                        </select>
                    </div>
                    <Input text={"Платежный пароль"} inputStyle={"w-56 text-sm"} value={payPass}
                           onChange={e => onPayPass(e.target.value)}/>
                    {success ? <div className="w-28 text-blue-500">Успешно</div> : null}
                    <div className="mt-3 flex justify-center">
                        <Button onClick={() => onSendMoney()} buttonStyle={"w-36"}>Отправить</Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default BalanceTransfer;
