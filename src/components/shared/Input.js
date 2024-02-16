import React from 'react';

const Input = ({text, inputStyle, type = "text", ...props}) => {
    let className = "rounded-lg border-2 border-blue-500 bg-gray-100 text-center outline-orange-300 mt-1.5 disabled:border-gray-300 disabled:bg-gray-200";
    return (
        <div className="mt-2">
            <div className="text-sm">{text}</div>
            <input className={className + inputStyle} type={type} {...props}/>
        </div>
    );
};

export default Input;
