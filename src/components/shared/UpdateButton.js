import React, {useEffect, useState} from 'react';
import Spinner from "./Spinner";

let updateListenersAdd = false;
const UpdateButton = ({settings}) => {
    const [update, onUpdate] = useState(0);
    const [percent, onPercent] = useState(0);

    useEffect(()=>{
        if(!updateListenersAdd){
            window.ipcRenderer.on("update-not-available", () => {
                onUpdate(0);
                console.log("update-not-available");
            });
            window.ipcRenderer.on("update-available", () => {
                console.log("update-available");
            });
            window.ipcRenderer.on("checking-for-update", () => {
                onUpdate(1);
                console.log("checking-for-update");
            });
            window.ipcRenderer.on("download-progress", (event, args) => {
                onUpdate(2);
                onPercent(args)
                console.log("download-progress:"  + args);
            });
            window.ipcRenderer.on("update-downloaded", () => {
                onUpdate(3);
                console.log("update-downloaded");
            });
            updateListenersAdd = true;
        }
    }, [])

    return (
        <div>
            {update === 1?<UpdateCheck/>:null}
            {update === 2?<UpdateDownload percent={percent}/>:null}
            {update === 3?<UpdateReady settings={settings}/>:null}
        </div>
    );
};

const UpdateCheck = () => {
    return (
        <div className="update_btn flex justify-center space-x-1 items-center w-32 h-4 rounded bg-blue-500">
            <div className="">
                <Spinner className={"w-3 h-3 inline-block ml-1"}/>
            </div>
            <div className="text-gray-300" >Проверка обновлений</div>
        </div>
    );
};

const UpdateDownload = ({percent}) => {
    const percentToWidth = String(Math.round(80/100 * percent));
    return (
        <div className="update_btn flex justify-around space-x-1 items-center w-32 h-4 px-1 rounded bg-blue-500">
            <div className="w-20 h-1 bg-blue-950 rounded">
                <div className="h-1 bg-white rounded" style={{width: percentToWidth + "px"}}></div>
            </div>
            <div className="text-gray-300" >{percent.toFixed(0)}%</div>
        </div>
    );
};

const UpdateReady = ({settings}) => {
    return (
        <div className="update_btn flex justify-center space-x-1 items-center w-32 h-4 rounded bg-green-600 hover:bg-green-700 transition-all duration-200">
            <div onClick={() => window.ipcRenderer.send("lets-update", {accounts: settings})} className="text-gray-300" >Установить</div>
        </div>
    );
};


export default UpdateButton;