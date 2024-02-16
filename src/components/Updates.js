import React from 'react';
import Header from "./shared/Header";

const Updates = ({updatesEntry}) => {
    const updates = updatesEntry.map((item, i) => {
        return (
            <li key={i} className="after:block after:content-[''] after:h-0.5 after:bg-blue-600 after:shadow-2xl after:mt-0.5">
                <div className="text-xs text-blue-600">{item.version}</div>
                <div className="whitespace-pre-wrap text-sm">{item.body}</div>
            </li>
        );

    })
    return (
        <div className="mr-11 update_news">
            <div className="text-center">
                <Header>Обновления</Header>
            </div>
                <div className="mt-4 w-60 rounded-2xl border-2 border-blue-600 px-3 py-3 shadow-2xl">
                    <ul className='h-96 overflow-y-auto'>
                        {updates}
                    </ul>
                </div>

        </div>
    );
};

export default Updates;
