import React from 'react';

const GlobalMenuButton = ({icon, text, ...props}) => {
    return (
        <div
            className="flex items-center justify-around rounded px-2 transition-all duration-200 btn globalBtn space-x-2 py-1.5 cursor:pointer hover:bg-gray-200 hover:shadow-md active:bg-blue-500 active:text-gray-300 active:shadow-xl"
            {...props}>
            <div className="">
                <img src={icon} className="" alt=""/>
            </div>
            <div className="" id="Main">{text}</div>
        </div>
    );
};

export default GlobalMenuButton;
