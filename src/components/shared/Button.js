import React from 'react';

const Button = ({children, buttonStyle, onClick, disabled}) => {
    let className = `btn flex justify-center items-center px-1.5 py-1.5 text-white rounded-lg bg-blue-500 hover:shadow-md hover:bg-blue-700 active:bg-blue-900 active:shadow-xl disabled:bg-gray-400 transition-all duration-100 `

    return (
        <button onClick={onClick} disabled={disabled} className={className+buttonStyle}>{children}</button>
    );
};

export default Button;