import React from 'react';

const Header = ({children}) => {
    return (
        <div className="inline-block">
                <span
                    className="text-blue-600 text-2xl after:block after:content-['']  after:h-0.5 after:w-11/12 after:mx-auto after:bg-blue-600 after:shadow-2xl">{children}</span>
        </div>
    );
};

export default Header;
