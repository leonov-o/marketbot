import React from 'react';

const Spinner = ({className}) => {
    return (
        <div className={"animate-spin rounded-full border-t-2 " + className} ></div>
    );
};

export default Spinner;
