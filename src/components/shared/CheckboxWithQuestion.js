import React, {useState} from 'react';

const CheckboxWithQuestion = ({text, description, ...props}) => {
    const [visible, onVisible] = useState(false);
    return (
        <div className="flex items-center space-x-2 mt-4 relative">
            <input type="checkbox" {...props}/>
            <div className="text-xs">{text}<sup
                className="text-blue-600 text-xs font-bold hover:cursor-pointer" onMouseEnter={() => onVisible(true)}
                onMouseLeave={() => onVisible(false)}>?</sup></div>
            {visible ? <CheckboxDescription description={description}/> : null}
        </div>
    );
};

const CheckboxDescription = ({description}) => {
    return (
        <div className="z-10 absolute right-2 top-8 w-48 p-2 rounded-md border-2 border-blue-600 text-justify bg-gray-100">
            {description}
        </div>
    );
};

export default CheckboxWithQuestion;