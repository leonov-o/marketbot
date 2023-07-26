import React, {useEffect, useRef} from 'react';
import {useSelector} from "react-redux";

const Logs = ({selected}) => {
    const logsEntry = useSelector(state => state.process[selected].logs);
    const endListRef = useRef(null);
    const scrollToBottom = () => {
        endListRef.current?.scrollTo(0, endListRef.current?.scrollHeight);
    }

    useEffect(() => {
        scrollToBottom()
    }, []);

    const logs = logsEntry.map((item, i) => {
        return (
            <li key={i} className="after:block after:content-[''] after:h-0.5 after:bg-blue-100 after:shadow-2xl after:mt-0.5 whitespace-pre-wrap">
                <div className="text-xs">{item}</div>
            </li>
        );
    })

    return (
        <div className="my-3 ml-4 w-48 logs">
            <div className="text-center">Логи</div>
            <div className="px-3 py-1.5 space-y-1 rounded-2xl border-blue-100 border-2 shadow-2xl">
                <ul ref={endListRef} className="h-44 overflow-y-auto">
                    {logs}
                </ul>
            </div>
        </div>
    );
};

export default Logs;
