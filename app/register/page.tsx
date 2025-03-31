"use client";

import React, { useEffect, useState } from 'react';
import InputComponent from '@/app/components/common/inputComponent'
import ButtonComponent from '../components/common/buttonComponent';
import SnackBarComponent, { SnackBarType } from '../components/common/snackBarComponent';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerThunk } from '../lib/redux/thunks/register.thunk';
import { useAppDispatch, useAppSelector } from '../lib/redux/hooks';

export default function Register() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const stateRegister = useAppSelector((state) => state.authReducer.getregister);
    const [email, setEmail] = useState('');
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');
    
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [nombreError, setNombreError] = useState('')
    
    const [isFormValid, setIsFormValid] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        type: 'Error' as SnackBarType
    });

    useEffect(()=>{

        if(stateRegister.status == 'failed'){
            setSnackbar({
                open: true,
                message: stateRegister.error || '',
                type: 'Error'
            });
        }

        if(stateRegister.status == 'succeeded'){
            setSnackbar({
                open: true,
                message: '¡Registro exitoso!',
                type: 'Success'
            });

            setTimeout(() => {
                router.push('/home'); // Redireccionar al dashboard
            }, 1500);
        }

    },[stateRegister]);

    const handleCloseSnackbar = () => {
        setSnackbar({
            ...snackbar,
            open: false
        });
    };

    const handleInputNombre = (data: string) => {
        setNombre(data);
        
        if (!data.trim()) {
            setNombreError('El nombre es obligatorio');
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(data)) {
            setNombreError('Ingresa un nombre válido (solo letras y espacios)');
        } else if (data.trim().length < 2) {
            setNombreError('El nombre debe tener al menos 2 caracteres');
        } else {
            setNombreError('');
        }
        
        validateForm(data, password);
    };

    const handleInputEmail = (data: string) => {
        setEmail(data);
        
        if (!data.trim()) {
            setEmailError('El correo electrónico es obligatorio');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data)) {
            setEmailError('Ingresa un correo electrónico válido');
        } else {
            setEmailError('');
        }
        
        validateForm(data, password);
    };
    
    const handleInputPassword = (data: string) => {
        setPassword(data);
        
        if (!data) {
            setPasswordError('La contraseña es obligatoria');
        } else if (data.length < 6) {
            setPasswordError('La contraseña debe tener al menos 6 caracteres');
        } else {
            setPasswordError('');
        }
        
        validateForm(email, data);
    };
    
    const validateForm = (emailValue: string, pass: string) => {
        const isEmailValid = emailValue.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
        const isPassValid = pass.length >= 6;
        
        setIsFormValid(Boolean(isEmailValid) && Boolean(isPassValid));
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isFormValid) {
            let errorMessage = '';
            
            if (!email) {
                setEmailError('El correo electrónico es obligatorio');
                errorMessage = 'El correo electrónico es obligatorio';
            } else if (emailError) {
                errorMessage = emailError;
            }
            
            if (!password) {
                setPasswordError('La contraseña es obligatoria');
                if (!errorMessage) errorMessage = 'La contraseña es obligatoria';
            } else if (passwordError && !errorMessage) {
                errorMessage = passwordError;
            }
            if(!nombre){
                setPasswordError('El nombre es obligatorio');
                if (!errorMessage) errorMessage = 'El nombre es obligatorio';
            } else if (nombreError && !errorMessage) {
                errorMessage = nombreError;
            }
            
            // Si hay errores, mostrar en el Snackbar
            if (errorMessage) {
                setSnackbar({
                    open: true,
                    message: errorMessage,
                    type: 'Error'
                });
            }
            
            return;
        }
        
        dispatch(
            registerThunk({
                name: nombre,
                email,
                password
            })
        );
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-100 p-4">

         <div className='w-[30rem] rounded-[1rem] bg-white p-8 shadow-2xl '>
            <form onSubmit={handleSubmit} className='grid gap-[1rem]'>

                <div className='w-full text-center grid gap-[.5rem]'>
                    <h1 className='text-[var(--colorSmartNest)]'>SmartNest Spa</h1>
                    <p>Crea una cuenta para acceder a nuestros servicios</p>
                </div>

                {/* Snackbar unificado para mostrar mensajes */}
                <SnackBarComponent 
                    type={snackbar.type}
                    isOpen={snackbar.open}
                    onClose={handleCloseSnackbar}
                >
                    {typeof snackbar.message === 'object' 
                    ? (snackbar.message as Error).message 
                    : snackbar.message}
                </SnackBarComponent>

                <div className='grid gap-[1.5rem]'>
                    <div>
                        <InputComponent 
                            className='w-full'
                            placeholder="Nombre Completo" 
                            name="nombre" 
                            id={'nombre'} 
                            type={'text'}  
                            onChange={(e: string) => { handleInputNombre(e); }} 
                            autoComplete="nombre"
                            value={nombre}
                            error={!!nombreError}
                            helperText={nombreError}
                        />
                    </div>
                     <div>
                        <InputComponent 
                            className='w-full'
                            placeholder="Correo electrónico" 
                            name="email" 
                            id={'email'} 
                            type={'email'}  
                            onChange={(e: string) => { handleInputEmail(e); }} 
                            autoComplete="email"
                            value={email}
                            error={!!emailError}
                            helperText={emailError}
                        />
                    </div>
                    <div>
                        <InputComponent 
                            className='w-full'
                            placeholder="Contraseña" 
                            name="password" 
                            id={'password'} 
                            type={'password'}  
                            onChange={(e: string) => { handleInputPassword(e); }} 
                            autoComplete="current-password"
                            value={password}
                            error={!!passwordError}
                            helperText={passwordError}
                        />
                    </div>
                    
                    <ButtonComponent>
                        {stateRegister.status == 'loading' ? 'PROCESANDO...' : 'REGISTRATE'}
                    </ButtonComponent>


                    <div className={`flex items-center w-full my-2`}>
                        <div className="flex-grow h-px bg-gray-300"></div>
                        <div className="flex items-center justify-center w-5 h-5 mx-3">
                            <span className="text-gray-500 text-lg font-medium">O</span>
                        </div>
                        <div className="flex-grow h-px bg-gray-300"></div>
                    </div>

                    <div className='text-center'>
                        <p>¿Ya tienes una cuenta? <Link href="/login">Inicia sesión</Link></p>
                    </div>
                </div>
                <div>

                </div>
            </form>
         </div>
        </div>
    );
}