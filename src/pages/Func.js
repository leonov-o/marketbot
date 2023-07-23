import React from 'react';
import Drag from "../components/Drag";
import LocalMenu from "../components/LocalMenu";
import AccountCard from "../components/AccountCard";
import Logs from "../components/Logs";
import Monitoring from "../components/Monitoring";
import SetItems from "../components/SetItems";
import Autobuy from "../components/Autobuy";
import {Routes, Route} from "react-router-dom";

const Func = ({onSelect, selected}) => {
    return (
        <div className="font-body">
            <Drag />
            <div className="flex justify-start">
                <div className="">
                    <LocalMenu onSelect={onSelect}/>
                    <AccountCard selected={selected}/>
                    <Logs selected={selected}/>
                </div>
                <div className="">
                    <Routes>
                        <Route path="/monitoring"  element={<Monitoring selected={selected}/>} />
                        <Route path="/setItems"  element={<SetItems selected={selected}/>} />
                        <Route path="/autobuy"  element={<Autobuy selected={selected}/>} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default Func;
