import React, {useState} from 'react';
import errorImage from "../../resources/icons/error-image.png";


const ErrorCircle = ({error}) => {
    const [visible, onVisible] = useState(false);
    return (
        <div className="relative">
            {visible && <div className="w-40 p-2 text-red-400 bg-white shadow-xl rounded-lg absolute top-6 right-0 z-40">
                <div className=" text-sm shadow-md p-1">
                    {error.length > 240
                    ? error.substring(0, 240) + "..."
                    : error}
                </div>
            </div>}

            <img src={errorImage} onMouseEnter={() => onVisible(true)} onMouseLeave={() => onVisible(false)}
                 className='shadow-2xl cursor-pointer' alt=""/>
        </div>
    );
};

export default ErrorCircle;