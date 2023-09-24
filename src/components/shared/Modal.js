import React, {useState} from 'react';
import modalCloseIcon from "../../resources/icons/modal-close.png";

const Modal = ({children, onClose}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({x: 0, y: 0});
    const [modalPosition, setModalPosition] = useState({top: 0, left: 0});
    const [isBackground, setIsBackground] = useState(true)

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setIsBackground(false)
        setDragOffset({
            x: e.clientX - modalPosition.left,
            y: e.clientY - modalPosition.top,
        });
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            const newLeft = e.clientX - dragOffset.x;
            const newTop = e.clientY - dragOffset.y;
            setModalPosition({left: newLeft, top: newTop});
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div
            className={`fixed top-0 left-0 flex h-screen w-screen transition-colors duration-100 calc z-40 ${isBackground ? "bg-black bg-opacity-40" : null}`}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <div
                style={{top: modalPosition.top + 'px', left: modalPosition.left + 'px'}}
                className={`fixed transform translate-x-1/2 translate-y-1/2 rounded-2xl bg-white transition-colors duration-200 scale-1 ${isBackground ? null : "border-2 border-blue-600"}`}
            >
                <div className="flex justify-start">
                    <div
                        onMouseDown={handleMouseDown}
                        className="w-full z-40 cursor-move"
                    ></div>
                    <div className="btn float-right m-1" onClick={onClose}>
                        <img draggable="false" src={modalCloseIcon} alt=""/>
                    </div>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;
