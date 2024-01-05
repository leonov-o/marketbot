import React from 'react';
import Accounts from "./Accounts";
import Updates from "./Updates";
import updatesEntry from "../service/updatesEntry";
import {useSelector} from "react-redux";


const Main = ({onSelect}) => {
    const summaryBalance = useSelector(state => state.summaryBalance);
    return (
        <>
            <div className="flex">
                <Accounts onSelect={onSelect}/>
                <Updates updatesEntry={updatesEntry}/>
            </div>
            <div className="px-14">Общий баланс: {summaryBalance} RUB</div>
        </>

    );
};

export default Main;
