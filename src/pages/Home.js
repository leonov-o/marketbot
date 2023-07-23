import React from 'react';
import {Routes, Route} from "react-router-dom";
import Drag from "../components/Drag";
import GlobalMenu from "../components/GlobalMenu";
import Main from "../components/Main";
import Settings from "../components/Settings";


const Home = ({onSelect}) => {

    return (
        <div className="font-body">
            <Drag/>
            <GlobalMenu/>
            <Routes>
                <Route path="/" element={<Main onSelect={onSelect} />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </div>
    );
};

export default Home;
