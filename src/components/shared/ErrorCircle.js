import React, {useState} from 'react';
import errorImage from "../../resources/icons/error-image.png";


const ErrorCircle = ({error}) => {
    const [visible, onVisible] = useState(false);
    return (
        <div className="relative">
            {visible && <div className="absolute top-6 right-0 z-40 w-40 rounded-lg bg-white p-2 text-red-400 shadow-xl">
                <div className="p-1 text-sm shadow-md">
                    {error.length > 240
                    ? error.substring(0, 240) + "..."
                    : error}
                </div>
            </div>}

            <img src={errorImage} onMouseEnter={() => onVisible(true)} onMouseLeave={() => onVisible(false)}
                 className='cursor-pointer shadow-2xl' alt=""/>
        </div>
    );
};

export default ErrorCircle;
