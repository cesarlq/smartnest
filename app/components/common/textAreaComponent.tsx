"use client";
import React, { useState } from 'react';

interface TextAreaComponentProps {
    description: string;
    placeholder: string;
    id: string;
    rows: number;
    name: string;
    label?: string;
    maxLength?: number;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    error?: string;
    onChange: (value: string) => void;
}

export default function TextAreaComponent({
    description,
    placeholder,
    rows,
    id,
    name,
    label,
    maxLength,
    required = false,
    disabled = false,
    className = "",
    error,
    onChange
}: TextAreaComponentProps) {
    const [charCount, setCharCount] = useState(description?.length || 0);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setCharCount(value.length);
        onChange(value);
    };

    return (
        <div className="w-full mb-4">
            {label && (
                <label 
                    htmlFor={id} 
                    className="block text-[var(--colorText)] text-sm font-medium mb-1"
                >
                    {label} {required && <span className="text-[var(--bgError)]">*</span>}
                </label>
            )}
            <div className="relative">
                <textarea
                    id={id}
                    name={name}
                    rows={rows}
                    className={`
                        w-full 
                        rounded-[var(--roundedGlobal)] 
                        border 
                        ${error ? 'border-[var(--bgError)]' : 'border-gray-300'} 
                        shadow-sm 
                        focus:border-[var(--colorSmartNest)] 
                        focus:ring-1 
                        focus:ring-[var(--colorSmartNest)] 
                        focus:outline-none
                        text-sm 
                        p-3
                        transition-all
                        duration-200
                        disabled:bg-gray-100
                        disabled:text-gray-500
                        disabled:cursor-not-allowed
                        ${className}
                    `}
                    style={{
                        outline: 'none',
                    }}
                    placeholder={placeholder}
                    value={description}
                    onChange={handleChange}
                    maxLength={maxLength}
                    required={required}
                    disabled={disabled}
                />
                
                {maxLength && (
                    <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                        {charCount}/{maxLength}
                    </div>
                )}
            </div>
            
            {error && (
                <p className="mt-1 text-xs text-[var(--bgError)]">{error}</p>
            )}
        </div>
    );
}