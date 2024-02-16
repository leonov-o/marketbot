import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import Calc from "../components/Calc";
import BalanceTransfer from "../components/BalanceTransfer";
import AboutProgram from "../components/AboutProgram";
import mainIcon from "../resources/icons/main-icon.png"
import calcIcon from "../resources/icons/calc-icon.png"
import infoIcon from "../resources/icons/info-icon.png"
import settingsIcon from "../resources/icons/settings-icon.png"
import balanceIcon from '../resources/icons/balance-icon.png'
import GlobalMenuButton from "./shared/GlobalMenuButton";



const GlobalMenu = () => {
    const buttons = [
        {
            text: "Главная",
            icon: mainIcon,
            onClick: (e) => btnActive(e),
            link: "/"
        },
        {
            text: "Перенос баланса",
            icon: balanceIcon,
            onClick: () => onBalanceTransfer(true)
        },
        {
            text: "Калькулятор выгоды",
            icon: calcIcon,
            onClick: () => onCalc(true)
        },
        {
            text: "О программе",
            icon: infoIcon,
            onClick: () => onAboutProgram(true)
        },
        {
            text: "Настройки",
            icon: settingsIcon,
            onClick: (e) => btnActive(e),
            link: '/settings',
            link_style: 'ml-auto'
        }
    ];

    //STATES
    const [balanceTransfer, onBalanceTransfer] = useState(false);
    const [calc, onCalc] = useState(false);
    const [aboutProgram, onAboutProgram] = useState(false);

    useEffect(() => {
        let event = new Event('click', {bubbles : true, cancelable : true});
        const btn = document.querySelectorAll(".globalBtn");
        btn[0].dispatchEvent(event);
    }, []);

    const btnActive = (e) => {
        const btn = document.querySelectorAll(".globalBtn");
        for(let i = 0; i <btn.length; i++) {
            btn[i].className="flex cursor-pointer items-center justify-around rounded px-2 transition-all duration-200 btn globalBtn space-x-2 py-1.5 hover:bg-gray-200 hover:shadow-md active:bg-blue-500 active:text-gray-300 active:shadow-xl";
        }
        e.currentTarget.className = "flex items-center justify-around rounded bg-blue-500 px-2 text-gray-300 shadow-xl transition-all duration-200 btn globalBtn space-x-2 py-1.5"
    }

    return (
        <div className="after:block after:bg-blue-500 px-3 globalMenu after:h-0.5">
            <div className="my-1 flex">

                {balanceTransfer && <BalanceTransfer onBalanceTransfer={onBalanceTransfer}/>}
                {calc && <Calc onCalc={onCalc}/>}
                {aboutProgram && <AboutProgram onAboutProgram={onAboutProgram}/>}

                {buttons.map((item, i) => (
                    item.hasOwnProperty("link")
                        ?<Link key={i} className={item.link_style} to={item.link}><GlobalMenuButton text={item.text} icon={item.icon} onClick={item.onClick}/></Link>
                        :<GlobalMenuButton key={i} text={item.text} icon={item.icon} onClick={item.onClick}/>
                ))}
            </div>
        </div>
    );
};

export default GlobalMenu;
