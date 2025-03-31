import React from 'react';

export default function Cardscomponent(
    {className, type, name, qty}: 
    {
        className?:string, 
        type:'Error' | 'Warning' | 'Success' | 'Info'
        name: string,
        qty: number,
    }) {
    let styleSnackBarBg;
    
    switch(type) {
        case 'Error':
            styleSnackBarBg = 'text-[var(--bgError)] ';
            break;
        case 'Warning':
            styleSnackBarBg = 'text-[var(--bgWarning)] ';
            break;
        case 'Success':
            styleSnackBarBg = 'text-[var(--bgSuccess)] ';
            break;
        case 'Info':
            styleSnackBarBg = 'text-[var(--bgInfo)] ';
            break;
    }
    
    return (
        <div className={`${className} text-center border border-[#4949492c] p-3 rounded-[var(--roundedGlobal)] `}>
            <p>{name}</p>
            <span className={` font-bold text-sm ${styleSnackBarBg}`}>{qty}</span>
        </div>
    );
}