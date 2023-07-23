import React from 'react';

const Input = ({text, inputStyle, ...props}) => {
    let className = "rounded-lg bg-gray-100 border-blue-500 disabled:bg-gray-200 disabled:border-gray-300 outline-orange-300 border-2 mt-1.5 text-center ";
    return (
        <div className="mt-2">
            <div className="text-sm">{text}</div>
            <input className={className + inputStyle} {...props} type="text"/>
        </div>
    );
};

export default Input;
