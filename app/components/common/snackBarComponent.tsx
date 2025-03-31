"use client";

import React, { useEffect } from 'react';

export type SnackBarType = 'Error' | 'Warning' | 'Success' | 'Info';

interface SnackBarProps {
    children: React.ReactNode;
    type: SnackBarType;
    isOpen: boolean;
    onClose: () => void;
    autoHideDuration?: number;
}

export default function SnackBarComponent({
    children,
    type,
    isOpen,
    onClose,
    autoHideDuration = 3000
}: SnackBarProps) {
    let styleSnackBarBg;
    
    switch(type) {
        case 'Error':
            styleSnackBarBg = 'bg-[var(--bgError)] text-[var(--colorError)]';
            break;
        case 'Warning':
            styleSnackBarBg = 'bg-[var(--bgWarning)] text-[var(--colorWarning)]';
            break;
        case 'Success':
            styleSnackBarBg = 'bg-[var(--bgSuccess)] text-[var(--colorSuccess)]';
            break;
        case 'Info':
            styleSnackBarBg = 'bg-[var(--bgInfo)] text-[var(--colorInfo)]';
            break;
    }

    useEffect(() => {
        if (isOpen && autoHideDuration) {
            const timer = setTimeout(() => {
                onClose();
            }, autoHideDuration);
            
            return () => {
                clearTimeout(timer);
            };
        }
    }, [isOpen, onClose, autoHideDuration]);

    if (!isOpen) return null;

    return (
        <div 
            className={`w-full ${styleSnackBarBg} p-4 rounded flex justify-between items-center shadow-md transition-all duration-300 ease-in-out`}
            role="alert"
        >
            <div>{children}</div>
            <button 
                onClick={onClose} 
                className="ml-4 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Cerrar"
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    );
}