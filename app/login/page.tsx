"use client";

import React, { useEffect, useState } from 'react';
import InputComponent from '@/app/components/common/inputComponent'
import ButtonComponent from '../components/common/buttonComponent';
import SnackBarComponent, { SnackBarType } from '../components/common/snackBarComponent';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../lib/redux/hooks';
import {loginThunk} from '@/app/lib/redux/thunks/auth.thunk'

export default function Login() {
    const dispatch = useAppDispatch();
    const stateLoginvalidation = useAppSelector((state) => state.authReducer.getAuth);


    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    
    const [isFormValid, setIsFormValid] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        type: 'Error' as SnackBarType
    });

    useEffect(()=> {
        console.log(stateLoginvalidation)
        if (stateLoginvalidation.status == 'succeeded') {
            setSnackbar({
                open: true,
                message: '¡Inicio de sesión exitoso!',
                type: 'Success'
            });

             // Esperar a que el usuario vea el mensaje de éxito antes de redirigir
             setTimeout(() => {
                router.push('/home');
            }, 1500);
        }

        if (stateLoginvalidation.status == 'failed') {
            setSnackbar({
                open: true,
                message: stateLoginvalidation.error || '',
                type: 'Error'
            });
        }
        
    },[stateLoginvalidation])


    const handleCloseSnackbar = () => {
        setSnackbar({
            ...snackbar,
            open: false
        });
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
        // Verifica si el formulario es válido según ambos campos
        const isEmailValid = emailValue.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
        const isPassValid = pass.length >= 6;
        
        setIsFormValid(Boolean(isEmailValid) && Boolean(isPassValid));
    };



    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Combinar errores en un solo mensaje si existen
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
            loginThunk({
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
                    <p>Inicia sesión para acceder a tus servicios</p>
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
                        {stateLoginvalidation.status == 'loading' ? 'PROCESANDO...' : 'INICIAR SESIÓN'}
                    </ButtonComponent>

                    <div className='text-center'>
                        <p>¿Olvidaste tu contraseña? <Link href="/recuperar">Recupérala aquí</Link></p>
                    </div>

                    <div className={`flex items-center w-full my-2`}>
                        <div className="flex-grow h-px bg-gray-300"></div>
                        <div className="flex items-center justify-center w-5 h-5 mx-3">
                            <span className="text-gray-500 text-lg font-medium">O</span>
                        </div>
                        <div className="flex-grow h-px bg-gray-300"></div>
                    </div>

                    <div className='text-center'>
                        <p>¿No tienes una cuenta?  <Link href="/register">Regístrate</Link></p>
                    </div>
                </div>
                <div>

                </div>
            </form>
         </div>
        </div>
    );
}