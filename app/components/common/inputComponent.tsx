"use client";

import React from 'react';
import { inputComponetI } from '@/app/lib/interfaces/commonInterface';
import { TextField, ThemeProvider, createTheme } from '@mui/material';

// Tema personalizado que coincide con las variables CSS globales
const smartNestTheme = createTheme({
  palette: {
    primary: {
      main: '#009689', // --colorSmartNest
    },
    error: {
      main: '#F44336', // --bgError sin transparencia
    },
  },
  shape: {
    borderRadius: 4.8, // Aproximadamente 0.3rem
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#e0e0e0', // Borde por defecto
              borderRadius: 'var(--roundedGlobal)',
              transition: 'all 0.2s ease-in-out',
            },
            '&:hover fieldset': {
              borderColor: '#009689', // --colorSmartNest en hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#009689', // --colorSmartNest en focus
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#494949', // Color del texto body
            '&.Mui-focused': {
              color: '#009689', // --colorSmartNest en focus
            },
          },
          '& .MuiInputBase-input': {
            color: '#494949', // Color del texto body
            padding: '14px 16px', // Padding más compatible con Tailwind
            fontSize: '0.875rem', // Similar a text-sm de Tailwind
          },
          '& .MuiFormHelperText-root': {
            marginLeft: 0,
            fontSize: '0.75rem', 
          },
        },
      },
    },
  },
});

export default function InputComponent({
  placeholder, 
  name, 
  type, 
  autoComplete, 
  id, 
  className, 
  onChange,
  value,
  error,
  helperText
}: inputComponetI & { 
  value?: string, 
  error?: boolean, 
  helperText?: string 
}) {

  return (
    <ThemeProvider theme={smartNestTheme}>
      <TextField
        className={`transition-all duration-200 ${className}`}
        id={id}
        label={placeholder}
        name={name}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        error={error}
        helperText={helperText}
        fullWidth
        variant="outlined"
        size="small"
      />
    </ThemeProvider>
  );
}