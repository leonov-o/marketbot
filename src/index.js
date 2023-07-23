import React from 'react';
import ReactDOM from 'react-dom/client';
import {HashRouter as BrowserRouter} from "react-router-dom";
import App from './App';
import "./index.css"
import {Provider} from "react-redux";
import {store} from "./store/index";

window.ipcRenderer.on('save-data', () => {
    const data = {accounts: store.getState().accounts}
    window.ipcRenderer.send('save-data', data);
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>
);
