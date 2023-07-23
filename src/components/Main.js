import React from 'react';
import Accounts from "./Accounts";
import Updates from "./Updates";
import updatesEntry from "../service/updatesEntry";


const Main = ({onSelect}) => {
    return (
        <div className="flex">
            <Accounts onSelect={onSelect}/>
            <Updates updatesEntry={updatesEntry}/>
        </div>
    );
};

export default Main;
