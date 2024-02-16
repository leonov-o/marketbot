import React, {useState} from 'react';

import editIcon from "../resources/icons/edit-icon.png";
import trashIcon from "../resources/icons/trash-icon.png";
import Button from "./shared/Button";
import Input from "./shared/Input";
import Header from "./shared/Header";
import {useDispatch, useSelector} from "react-redux";
import {
    addAccountAction,
    changeUsedStateAction,
    deleteAccountAction,
    editAccountAction
} from "../store/actions/actionCreators";


const Settings = () => {
    const data = useSelector(state => state.accounts);
    const dispatch = useDispatch();
    const [login, onLogin] = useState("");
    const [password, onPassword] = useState("");
    const [marketApi, onMarketApi] = useState("");
    const [steamApi, onSteamApi] = useState("");
    const [shared_secret, onShared_secret] = useState("");
    const [identity_secret, onIdentity_secret] = useState("");

    const [selected, onSelected] = useState(undefined);
    const [addAccount, onAddAccount] = useState(false);
    const [editAccount, onEditAccount] = useState(false);


    const inputs = [
        {
            text: "Логин Steam",
            value: login,
            style: "w-56 text-sm",
            onChange: (e) => onLogin(e.target.value)
        },
        {
            text: "Пароль Steam",
            value: password,
            style: "w-56 text-sm",
            onChange: (e) => onPassword(e.target.value)
        },
        {
            text: "marketApi",
            value: marketApi,
            style: "w-56 text-sm",
            onChange: (e) => onMarketApi(e.target.value)
        },
        {
            text: "steamApi",
            value: steamApi,
            style: "w-56 text-sm",
            onChange: (e) => onSteamApi(e.target.value)
        },
        {
            text: "shared_secret",
            value: shared_secret,
            style: "w-56 text-sm",
            onChange: (e) => onShared_secret(e.target.value)
        },
        {
            text: "identity_secret",
            value: identity_secret,
            style: "w-56 text-sm",
            onChange: (e) => onIdentity_secret(e.target.value)
        },
    ]

    const onEdit = (i) => {
        onSelected(i);
        onAddAccount(false);
        onEditAccount(true);

        onLogin(data[i].authData.login || "");
        onPassword(data[i].authData.password || "");
        onMarketApi(data[i].authData.marketApi || "");
        onSteamApi(data[i].authData.steamApi || "");
        onShared_secret(data[i].authData.shared_secret || "");
        onIdentity_secret(data[i].authData.identity_secret || "");
    }

    const onAdd = () => {
        onEditAccount(false);
        onAddAccount(true);

        onLogin('');
        onPassword('');
        onMarketApi('');
        onSteamApi('');
        onShared_secret('');
        onIdentity_secret('');
    }

    const setCheckboxValue = (e, i) => {
        dispatch(changeUsedStateAction({
            selected: i,
            value: e.target.checked
        }))
    }

    const onSave = () => {
        if (addAccount) {
            dispatch(addAccountAction({
                authData: {
                    login,
                    password,
                    marketApi,
                    steamApi,
                    shared_secret,
                    identity_secret
                }
            }));
        } else {
            dispatch(editAccountAction({
                selected,
                authData: {
                    login,
                    password,
                    marketApi,
                    steamApi,
                    shared_secret,
                    identity_secret
                }
            }));
        }
        onAddAccount(false);
        onEditAccount(false);
    }

    const onDelete = (i) => {
        dispatch(deleteAccountAction(i));
    }

    const items = data.map((item, i) => {
        return (
            <li key={i}
                className="flex w-64 cursor-default items-center justify-between rounded border-b-2 py-1 shadow-sm px-1.5 hover:bg-gray-200">
                <input type="checkbox" checked={item.used} onChange={(e) => setCheckboxValue(e, i)}/>
                <div className="ml-3 w-40">{item.authData.login.length > 12
                    ? item.authData.login.substring(0, 12) + "..."
                    : item.authData.login}</div>
                <div className="active:-translate-y-0.5" onClick={() => onEdit(i)}>
                    <img src={editIcon} alt="personIcon"/>
                </div>
                <div className="active:-translate-y-0.5" onClick={() => onDelete(i)}>
                    <img src={trashIcon} alt="personIcon"/>
                </div>
            </li>
        );
    })
    return (
        <div className="transition-all settings">
            <div className="mt-3 text-center">
                <Header>Настройки</Header>
            </div>

            <div className="mt-9 flex items-center justify-center space-x-5">
                <ul className="h-96 overflow-y-auto overflow-x-hidden rounded-xl border-2 border-blue-500 p-2">
                    {items}
                    <li className="flex w-64 justify-center py-1 btn px-1.5">
                        {!(addAccount || editAccount) &&
                            <Button buttonStyle="w-1/2 h-7" onClick={onAdd}>Добавить аккаунт</Button>}
                    </li>
                </ul>

                {(addAccount || editAccount) && <div className="">
                    {inputs.map((item, i) => (
                        <Input key={i} inputStyle={item.style} text={item.text} value={item.value}
                               onChange={item.onChange}/>
                    ))}
                    <Button buttonStyle={"ml-auto mt-2 h-7"} onClick={onSave}>Сохранить</Button>
                </div>}

            </div>
        </div>
    );
};

export default Settings;
