import React from 'react';

const LocalMenuButton = ({text, icon, className, ...props}) => {
    return (
        <div
            className={"btn flex justify-start items-center px-1.5 py-1.5 rounded hover:shadow-md hover:bg-gray-200 active:bg-blue-500 active:text-gray-300 active:shadow-xl transition-all duration-300 " + className}
            {...props}>
            <div className="">
                <img src={icon} alt=""/>
            </div>
            {text
                ?<div className="ml-4">{text}</div>
                :null}

        </div>
    );
};

export default LocalMenuButton;