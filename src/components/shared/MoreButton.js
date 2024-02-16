import React, {useState} from 'react';
import moreImage from "../../resources/icons/more-icon.png";

const MoreButton = ({actions}) => {
    const [visible, onVisible] = useState(false);

    const handleAction = (action) => {
        action();
        onVisible(!visible);
    };

    return (
        <div className="relative">
            {visible && <div className="absolute top-6 right-0 z-40 w-24 rounded bg-white p-2 text-center text-black shadow-xl">
                {
                    actions &&actions.map((item, index) => {
                        return <div key={index} className="cursor-pointer select-none border-b-2 text-sm p-0.5" onClick={() => handleAction(item.onClick)}>
                            {item.text}
                        </div>
                    })
                }

            </div>}
            <div className="h-5 w-5">
                <img src={moreImage} onClick={() => onVisible(!visible)}
                     className='cursor-pointer shadow-2xl' alt=""/>
            </div>

        </div>
    );
};

export default MoreButton;
