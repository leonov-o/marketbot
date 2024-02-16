import React, {useState} from 'react';
import Modal from "./shared/Modal";
import Header from "./shared/Header";
import Input from "./shared/Input";
import Button from "./shared/Button";
import axios from "axios";
import {bot_id, chat_id} from "../constants";


const BugReport = ({setBugReport}) => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("")

    const onBugReportSend = async () => {
        let message = `*${title}* %0A%0A${body}`;
        await axios.get(`https://api.telegram.org/bot${bot_id}/sendMessage?parse_mode=Markdown&chat_id=${chat_id}&text=${message}`);
    }

    return (
        <Modal onClose={() => {
            setBugReport(false);
        }}>
            <div className="px-11 py-6">

                <div className="text-center">
                    <Header>Сообщить об ошибке</Header>
                </div>

                <Input value={title} onChange={e => setTitle(e.target.value)}  text={"Тема"} inputStyle={"w-96 text-left"} />
                <div className="mt-2">
                    <div className="text-sm">Подробно опишите проблему</div>
                    <textarea value={body} onChange={e => setBody(e.target.value)} className="h-36 w-96 resize-none rounded-lg border-2 border-blue-500 bg-gray-100 p-1 outline-orange-300 mt-1.5"/>
                </div>

                <div className="mt-3 flex justify-center">
                    <Button onClick={onBugReportSend} buttonStyle={"w-36"}>Отправить</Button>
                </div>

            </div>
        </Modal>
    );
};

export default BugReport;
