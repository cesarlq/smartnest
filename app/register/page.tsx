"use client";

import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import InputComponent from '@/app/components/common/inputComponent'
import ButtonComponent from '../components/common/buttonComponent';
import SnackBarComponent, { SnackBarType } from '../components/common/snackBarComponent';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerThunk } from '../lib/redux/thunks/register.thunk';
import { useAppDispatch, useAppSelector } from '../lib/redux/hooks';
import { RegisterDataI } from '../lib/interfaces/users';

export default function Register() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const stateRegister = useAppSelector((state) => state.authReducer.getregister);

    const { 
        register, 
        handleSubmit, 
        formState: { errors }, 
        setValue, 
        watch 
    } = useForm<RegisterDataI>({
        mode: 'onChange',
        defaultValues: {
            nombre: '',
            email: '',
            password: ''
        }
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        type: 'Error' as SnackBarType
    });
    const nombreValue = watch('nombre');
    const emailValue = watch('email');
    const passwordValue = watch('password');

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[stateRegister]);

    const handleCloseSnackbar = () => {
        setSnackbar({
            ...snackbar,
            open: false
        });
    };

    const handleInputNombre = (value: string) => {
        setValue('nombre', value, { 
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
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
    
    const onSubmit: SubmitHandler<RegisterDataI> = (data) => {
        dispatch(
            registerThunk({
                name: data.nombre,
                email: data.email,
                password: data.password
            })
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-100 p-4">

         <div className='w-[30rem] rounded-[1rem] bg-white p-8 shadow-2xl '>
            <form onSubmit={handleSubmit(onSubmit)} className='grid gap-[1rem]'>

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
                            id={'nombre'} 
                            type={'text'}  
                            onChange={handleInputNombre} 
                            autoComplete="nombre"
                            value={nombreValue}
                            error={!!errors.nombre}
                            helperText={errors.nombre?.message}
                            name={register('nombre', {
                                required: 'El nombre es obligatorio',
                                minLength: {
                                    value: 2,
                                    message: 'El nombre debe tener al menos 2 caracteres'
                                },
                                pattern: {
                                    value: /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/,
                                    message: 'Ingresa un nombre válido (solo letras y espacios)'
                                }
                            }).name}
                        />
                    </div>
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
                    
                    <ButtonComponent disabled={false}>
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