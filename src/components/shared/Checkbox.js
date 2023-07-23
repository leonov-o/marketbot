import React from 'react';

const Checkbox = ({text,...props}) => {
    return (
        <div className="inline-flex">
            <input type="checkbox" {...props}/>
            <div className="text-xs">{text}</div>
        </div>
    );
};

export default Checkbox;