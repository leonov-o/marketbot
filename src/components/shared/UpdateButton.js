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
        <div className="flex h-4 w-32 items-center justify-center rounded bg-blue-500 update_btn space-x-1">
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
        <div className="flex h-4 w-32 items-center justify-around rounded bg-blue-500 px-1 update_btn space-x-1">
            <div className="h-1 w-20 rounded bg-blue-950">
                <div className="h-1 rounded bg-white" style={{width: percentToWidth + "px"}}></div>
            </div>
            <div className="text-gray-300" >{percent.toFixed(0)}%</div>
        </div>
    );
};

const UpdateReady = ({settings}) => {
    return (
        <div className="flex h-4 w-32 items-center justify-center rounded bg-green-600 transition-all duration-200 update_btn space-x-1 hover:bg-green-700">
            <div onClick={() => window.ipcRenderer.send("lets-update", {accounts: settings})} className="text-gray-300" >Установить</div>
        </div>
    );
};


export default UpdateButton;
