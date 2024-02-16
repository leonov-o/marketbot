import React, {useState} from 'react';

const CheckboxWithQuestion = ({text, description, ...props}) => {
    const [visible, onVisible] = useState(false);
    return (
        <div className="relative mt-4 flex items-center space-x-2">
            <input type="checkbox" {...props}/>
            <div className="text-xs">{text}<sup
                className="text-xs font-bold text-blue-600 hover:cursor-pointer" onMouseEnter={() => onVisible(true)}
                onMouseLeave={() => onVisible(false)}>?</sup></div>
            {visible ? <CheckboxDescription description={description}/> : null}
        </div>
    );
};

const CheckboxDescription = ({description}) => {
    return (
        <div className="absolute top-8 right-2 z-10 w-48 rounded-md border-2 border-blue-600 bg-gray-100 p-2 text-justify">
            {description}
        </div>
    );
};

export default CheckboxWithQuestion;
