"use client";

import React from 'react';
import { textFieldAdornmentI } from '@/app/lib/interfaces/commonInterface';
import { 
  TextField, 
  InputAdornment, 
  ThemeProvider, 
  createTheme 
} from '@mui/material';

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
            height: '40px', // Altura estandarizada
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
          '& .MuiFilledInput-root': {
            height: '40px', // Altura estandarizada para variante filled
          },
          '& .MuiInput-root': {
            height: '40px', // Altura estandarizada para variante standard
          },
          '& .MuiInputLabel-root': {
            color: '#494949', // Color del texto body
            '&.Mui-focused': {
              color: '#009689', // --colorSmartNest en focus
            },
          },
          '& .MuiInputBase-input': {
            color: '#494949', // Color del texto body
            padding: '8px 16px', // Padding ajustado para altura estándar
            fontSize: '0.875rem', // Similar a text-sm de Tailwind
          },
          '& .MuiFormHelperText-root': {
            marginLeft: 0,
            fontSize: '0.75rem',
          },
          '& .MuiInputAdornment-root': {
            color: '#009689', // --colorSmartNest
            opacity: 0.6,
            height: '40px', // Altura estandarizada
            display: 'flex',
            alignItems: 'center',
          },
        },
      },
    },
  },
});

export default function TextFieldAdornmentComponent({
  id,
  label,
  placeholder,
  value = '',
  onChange,
  className = '',
  error = false,
  helperText = '',
  fullWidth = true,
  variant = 'outlined',
  startIcon,
  endIcon,
  disabled = false,
  required = false,
  multiline = false,
  rows,
  maxRows
}: textFieldAdornmentI) {
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <ThemeProvider theme={smartNestTheme}>
      <TextField
        id={id}
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={`transition-all duration-200 ${className}`}
        error={error}
        helperText={helperText}
        fullWidth={fullWidth}
        variant={variant}
        disabled={disabled}
        required={required}
        multiline={multiline}
        rows={rows}
        maxRows={maxRows}
        InputProps={{
          startAdornment: startIcon ? (
            <InputAdornment position="start">
              {startIcon}
            </InputAdornment>
          ) : null,
          endAdornment: endIcon ? (
            <InputAdornment position="end">
              {endIcon}
            </InputAdornment>
          ) : null,
        }}
        sx={{ m: 1 }}
      />
    </ThemeProvider>
  );
}