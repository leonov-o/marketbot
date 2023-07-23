import React from 'react';

const GlobalMenuButton = ({icon, text, ...props}) => {
    return (
        <div
            className="btn globalBtn flex justify-around items-center space-x-2 px-2 py-1.5 rounded hover:shadow-md hover:bg-gray-200 active:bg-blue-500 active:text-gray-300 active:shadow-xl transition-all duration-200 cursor:pointer"
            {...props}>
            <div className="">
                <img src={icon} className="" alt=""/>
            </div>
            <div className="" id="Main">{text}</div>
        </div>
    );
};

export default GlobalMenuButton;