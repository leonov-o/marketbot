import React, {useState} from 'react';
import bugReportIcon from "../resources/icons/bug-report.png"
import minimize from "../resources/icons/minimize.png"
import maximize from "../resources/icons/maximize.png"
import close from "../resources/icons/close.png"
import BugReport from "./BugReport";
import UpdateButton from "./shared/UpdateButton";
import {useSelector} from "react-redux";






const Drag = () => {
    const settings = useSelector(state => state.accounts);

    const [bugReport, setBugReport] = useState(false);

    const onMinimize = () => {
        window.ipcRenderer.send("minimize-window");
    }

    const onMaximize = () => {
        window.ipcRenderer.send("maximize-window");
    }

    const onClose = () => {
        window.ipcRenderer.send("close", {accounts: settings});
    }

    return (
        <div className='flex h-5 items-center justify-between bg-gradient-to-r from-white via-blue-200 to-white pl-1 drag'>
            {bugReport && <BugReport setBugReport={setBugReport}/>}

            <div className="flex w-40 justify-start text-xs space-x-1">
                <div className="">
                    v2.0.11
                </div>
                <UpdateButton settings={settings}/>
            </div>

            <div className="">
                <div className="text-zinc-500 font-display">Market<span className="text-blue-500">Bot</span></div>
            </div>

            <div className="flex w-40 justify-end">
                <div
                    className="mr-4 flex h-5 w-5 items-center justify-center transition-all duration-200 btn hover:bg-gray-200"
                    onClick={() => setBugReport(true)}>
                    <img src={bugReportIcon} alt="bugReport"/>
                </div>
                <div onClick={onMinimize} className="flex h-5 w-5 items-center justify-center transition-all duration-200 btn hover:bg-gray-200">
                    <img src={minimize} alt="minimize"/>
                </div>
                <div onClick={onMaximize} className="flex h-5 w-5 items-center justify-center transition-all duration-200 btn hover:bg-gray-200">
                    <img src={maximize} alt="maximize"/>
                </div>
                <div onClick={onClose} className="flex h-5 w-5 items-center justify-center transition-all duration-200 btn hover:bg-red-400">
                    <img src={close} alt="close"/>
                </div>
            </div>
        </div>
    );
};


export default Drag;
