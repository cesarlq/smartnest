"use client";

import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import InputComponent from '@/app/components/common/inputComponent'
import ButtonComponent from '../components/common/buttonComponent';
import SnackBarComponent, { SnackBarType } from '../components/common/snackBarComponent';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../lib/redux/hooks';
import {loginThunk} from '@/app/lib/redux/thunks/auth.thunk'
import { LoginCredentialsI } from '../lib/interfaces/users';

export default function Login() {
    const dispatch = useAppDispatch();
    const stateLoginvalidation = useAppSelector((state) => state.authReducer);
    const router = useRouter();

    const {
            register,
            handleSubmit,
            formState: { errors },
            setValue,
            watch
        } = useForm<LoginCredentialsI>({
            mode: 'onChange',
            defaultValues: {
                email: '',
                password: ''
            }
        });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        type: 'Error' as SnackBarType
    });

    const emailValue = watch('email');
    const passwordValue = watch('password');

    useEffect(() => {
        console.log("Estado de login:", stateLoginvalidation);
        
        if (stateLoginvalidation.getAuth.status === 'succeeded') {
            setSnackbar({
                open: true,
                message: '¡Inicio de sesión exitoso!',
                type: 'Success'
            });

            // Guardar datos en localStorage si están disponibles
            const authData = stateLoginvalidation.auth;
            if (authData) {
                // El token podría estar en la respuesta directamente
                const authResponse = authData as unknown as { token?: string };
                if (authResponse.token) {
                    localStorage.setItem('token', authResponse.token);
                }
                
                // El usuario siempre debe estar presente
                if (authData.user) {
                    localStorage.setItem('user', JSON.stringify(authData.user));
                }
            }

            // Redirección inmediata al home
            console.log("Redirigiendo a /home...");
            
            // Usar window.location.href para una redirección más directa
            if (typeof window !== 'undefined') {
                window.location.href = '/home';
            } else {
                router.push('/home');
            }
        }

        if (stateLoginvalidation.getAuth.status === 'failed') {
            setSnackbar({
                open: true,
                message: stateLoginvalidation.getAuth.error || '',
                type: 'Error'
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stateLoginvalidation]);


    const handleCloseSnackbar = () => {
        setSnackbar({
            ...snackbar,
            open: false
        });
    };
    
    const handleInputEmail = (value: string) => {
        setValue('email', value, { 
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
        });
    };
    
    const handleInputPassword = (value: string) => {
        setValue('password', value, { 
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
        });
    };
    
    const onSubmit: SubmitHandler<LoginCredentialsI> = (data) => {
        dispatch(
            loginThunk({
                email: data.email,
                password: data.password
            })
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-100 p-4">

         <div className='w-[30rem] rounded-[1rem] bg-white p-8 shadow-2xl '>
            <form onSubmit={handleSubmit(onSubmit)}  className='grid gap-[1rem]'>

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
                            id={'email'} 
                            type={'email'}  
                            onChange={handleInputEmail} 
                            autoComplete="email"
                            value={emailValue}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            name={register('email', {
                                required: 'El correo electrónico es obligatorio',
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Ingresa un correo electrónico válido'
                                }
                            }).name}
                        />
                    </div>
                    <div>
                        <InputComponent 
                            className='w-full'
                            placeholder="Contraseña" 
                            id={'password'} 
                            type={'password'}  
                            onChange={handleInputPassword} 
                            autoComplete="current-password"
                            value={passwordValue}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            name={register('password', {
                                required: 'La contraseña es obligatoria',
                                minLength: {
                                    value: 6,
                                    message: 'La contraseña debe tener al menos 6 caracteres'
                                }
                            }).name}
                        />
                    </div>
                    
                    <ButtonComponent
                        disabled={false}>
                        {stateLoginvalidation.getAuth.status === 'loading' ? 'PROCESANDO...' : 'INICIAR SESIÓN'}
                    </ButtonComponent>

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