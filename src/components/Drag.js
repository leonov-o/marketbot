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
        <div className='drag flex justify-between items-center h-5 pl-1 bg-gradient-to-r from-white via-blue-200 to-white'>
            {bugReport && <BugReport setBugReport={setBugReport}/>}

            <div className="w-40 flex justify-start space-x-1 text-xs">
                <div className=" ">
                    v2.0.10
                </div>
                <UpdateButton settings={settings}/>
            </div>

            <div className="">
                <div className="font-display text-zinc-500">Market<span className="text-blue-500">Bot</span></div>
            </div>

            <div className="w-40 flex justify-end ">
                <div
                    className="btn w-5 h-5 mr-4 flex justify-center items-center hover:bg-gray-200 transition-all duration-200"
                    onClick={() => setBugReport(true)}>
                    <img src={bugReportIcon} alt="bugReport"/>
                </div>
                <div onClick={onMinimize} className="btn w-5 h-5 flex justify-center items-center hover:bg-gray-200 transition-all duration-200">
                    <img src={minimize} alt="minimize"/>
                </div>
                <div onClick={onMaximize} className="btn w-5 h-5 flex justify-center items-center hover:bg-gray-200 transition-all duration-200">
                    <img src={maximize} alt="maximize"/>
                </div>
                <div onClick={onClose} className="btn w-5 h-5 flex justify-center items-center hover:bg-red-400 transition-all duration-200">
                    <img src={close} alt="close"/>
                </div>
            </div>
        </div>
    );
};


export default Drag;
