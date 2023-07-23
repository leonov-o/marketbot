import React from 'react';
import {Link} from "react-router-dom";
import backIcon from "../resources/icons/back-icon.png"
import monitoringIcon from '../resources/icons/monitoring-icon.png'
import setItemsIcon from '../resources/icons/setitems-icon.png'
import autobuyIcon from '../resources/icons/autobuy-icon.png'
import LocalMenuButton from "./shared/LocalMenuButton";


const LocalMenu = ({onSelect}) => {

    const buttons = [
        {
            text: "",
            icon: backIcon,
            className: "w-52",
            onClick: () => onSelect(undefined),
            link: "/"
        },
        {
            text: "Мониторинг цен",
            icon: monitoringIcon,
            className: "w-52",
            link: "/monitoring"
        },
        {
            text: "Выставление предметов",
            icon: setItemsIcon,
            className: "w-52",
            link: "/setItems"
        },
        {
            text: "Autobuy",
            icon: autobuyIcon,
            className: "w-52",
            link: "/autobuy"
        },
    ]


    return (
        <div className="my-1 px-3 local_menu">
            {buttons.map((item, i) => (
                <Link  key={i} to={item.link}>
                    <LocalMenuButton text={item.text} icon={item.icon} className={item.className} onClick={item.onClick}/>
                </Link>
            ))}
        </div>
    );
};

export default LocalMenu;
