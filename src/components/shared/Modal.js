import React from 'react';
import modalCloseIcon from "../../resources/icons/modal-close.png";

const Modal = ({children, onClose}) => {
    return (
        <div className="fixed top-0 left-0 flex h-screen w-screen items-center justify-center bg-black bg-opacity-40 transition-all duration-100 calc z-40">
            <div className="rounded-2xl bg-white transition-all duration-200 scale-1">
                <div className="btn float-right m-1" onClick={onClose}>
                    <img src={modalCloseIcon} alt=""/>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;
