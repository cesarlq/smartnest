import React from 'react';

export default function ButtonComponent({children, className, onClick}: {children: React.ReactNode, className?:string, onClick?: () => void;}) {
    return (
        <button onClick={onClick} className={`${className} border border-transparent text-sm font-medium shadow-sm bg-[var(--colorSmartNest)] text-white p-3 rounded-[var(--roundedGlobal)]  hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors`}>
            {children}
        </button>
    );
}
