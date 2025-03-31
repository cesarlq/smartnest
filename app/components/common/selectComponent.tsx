"use client";

import React from 'react';
import { selectComponentI } from '@/app/lib/interfaces/commonInterface';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  ThemeProvider,
  createTheme,
  SelectChangeEvent
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
    MuiFormControl: {
      styleOverrides: {
        root: {
          margin: '8px 0',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#494949', // Color del texto body
          '&.Mui-focused': {
            color: '#009689', // --colorSmartNest en focus
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          color: '#494949', // Color del texto body
          fontSize: '0.875rem', // Similar a text-sm de Tailwind
          height: '40px', // Altura estandarizada
          '&:before': {
            borderColor: '#e0e0e0', // Borde por defecto
          },
          '&:hover:not(.Mui-disabled):before': {
            borderColor: '#009689', // --colorSmartNest en hover
          },
          '&.Mui-focused:after': {
            borderColor: '#009689', // --colorSmartNest en focus
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          height: '40px', // Altura estandarizada para variante outlined
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          height: '40px', // Altura estandarizada para variante filled
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          height: '40px', // Altura estandarizada para variante standard
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem', // Similar a text-sm de Tailwind
          '&.Mui-selected': {
            backgroundColor: 'rgba(0, 150, 137, 0.1)', // --colorSmartNest con transparencia
            '&:hover': {
              backgroundColor: 'rgba(0, 150, 137, 0.2)', // --colorSmartNest con más transparencia en hover
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(0, 150, 137, 0.05)', // --colorSmartNest con mucha transparencia
          },
        },
      },
    },
  },
});

export default function SelectComponent({
  label,
  id,
  value,
  onChange,
  options,
  className = '',
  error = false,
  helperText = '',
  minWidth = '100%',
  variant = 'standard'
}: selectComponentI) {
  
  const handleChange = (event: SelectChangeEvent<string | number | readonly string[]>) => {
    onChange(event.target.value);
  };

  const labelId = `${id}-label`;

  return (
    <ThemeProvider theme={smartNestTheme}>
      <FormControl 
        variant={variant} 
        sx={{ m: 1, minWidth: minWidth, marginLeft: '0px!important', marginRight: '0px!important' }}
        error={error}
        className={`transition-all duration-200 ${className}`}
        fullWidth
      >
        {label != undefined &&  <InputLabel id={labelId}>{label}</InputLabel>}
        <Select
          labelId={labelId}
          id={id}
          value={value}
          onChange={handleChange}
          label={label}
        >
          {options.map((option, index) => (
            <MenuItem 
              key={index} 
              value={option.value} 
              disabled={option.disabled}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </ThemeProvider>
  );
}