'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faGauge, faListCheck, faGear, faPlus, faSignOut } from '@fortawesome/free-solid-svg-icons';
import ButtonComponent from '../common/buttonComponent';
import Cardscomponent from '../common/cardscomponent';
import ModalTask from '../modalTask/modalTask';
import { useAppDispatch, useAppSelector } from '@/app/lib/redux/hooks';
import { GetAlltask } from '@/app/lib/redux/thunks/task.thunk';
import { useAuth } from '@/app/context/AuthContext';

const menuItems = [
    { name: 'Dashboard', path: '/home/dashboard', icon: <FontAwesomeIcon className='h-full w-[1.2rem] text-[var(--colorText)] opacity-60' icon={faGauge} /> },
    { name: 'Mis Tareas', path: '/home/tasks', icon: <FontAwesomeIcon className='h-full w-[1.2rem] text-[var(--colorText)] opacity-60' icon={faListCheck} /> },
    { name: 'Configuración', path: '/home/settings', icon: <FontAwesomeIcon className='h-full w-[1.2rem] text-[var(--colorText)] opacity-60' icon={faGear} /> }
];

export default function MenuComponent({children}: {children:React.ReactNode}) {
    const [isMobile, setIsMobile] = useState(false);
    const [menuVisible, setMenuVisible] = useState(true);
    const [isOpen, setisOpen] = useState(false);
    const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
    const settingsMenuRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const tasksState = useAppSelector((state) => state.taskReducer.responsegetAllTask);
    const { user, logout } = useAuth();

    const pendingTasks = tasksState?.allTask?.filter((task) => task.status === 'pendiente')?.length || 0;
    const completedTasks = tasksState?.allTask?.filter((task) => task.status === 'completada')?.length || 0;
    
    useEffect(() => {
        dispatch(GetAlltask());
    }, [dispatch]);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkIfMobile();
        
        window.addEventListener('resize', checkIfMobile);
        
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    useEffect(() => {
        setMenuVisible(!isMobile);
    }, [isMobile]);

    // Efecto para cerrar el menú de configuración cuando se hace clic fuera de él
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
                setSettingsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    // Verificar la información del usuario en el contexto y localStorage
    console.log('Usuario del contexto:', user);
    console.log('Usuario en localStorage:', localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null);
    
    // Intentar obtener el usuario del localStorage si no está en el contexto
    const userFromStorage = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null;
    const userName = user?.name || userFromStorage?.name || 'Usuario';
    const userEmail = user?.email || userFromStorage?.email || 'usuario@example.com';
    
    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const handleAddTask = () =>{
        setisOpen(true);
    }

    const closeModal =() =>{
        setisOpen(false);
    }

    const handleOutsideClick = () => {
        if (isMobile && menuVisible) {
            setMenuVisible(false);
        }
    };
    

    return (
        <div className="flex flex-col h-screen">
            <header className="bg-white shadow-sm border-b border-gray-200 z-10">
                <div className="max-w-full mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={toggleMenu}
                            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                            aria-label="Toggle menu"
                        >
                            <FontAwesomeIcon 
                                className='h-full w-[1rem] text-gray-600' 
                                icon={faBars} 
                            />
                        </button>

                        <svg className="h-8 w-8 text-[var(--colorSmartNest)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        <h1 className="text-xl font-medium text-gray-800">SmartNest Spa</h1>
                    </div>
                    <ButtonComponent
                        disabled={false}
                        onClick={handleAddTask}
                        className="inline-flex items-center px-4 py-2 gap-2"
                    >
                        <FontAwesomeIcon 
                                className='h-full w-[1rem]' 
                                icon={faPlus} 
                        />
                            <p className='hidden lg:block'>Nueva Tarea</p>
                    </ButtonComponent>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">

                {isMobile && menuVisible && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-30 z-10"
                        onClick={handleOutsideClick}
                    ></div>
                )}
                
                <div 
                    className={`
                        h-full w-[16rem] bg-white shadow p-4 
                        transform transition-transform duration-300 ease-in-out
                        ${menuVisible ? 'translate-x-0' : '-translate-x-full'}
                        fixed md:relative
                        z-20
                    `}
                >
                    <nav>
                        <ul className="space-y-2 ">
                            {menuItems.map((item, index) => (
                                <li key={index} className='!mb-0'>
                                    <Link href={item.path} className="flex p-2 text-sm items-center rounded-md hover:bg-gray-100 transition-colors gap-3">
                                        {item.icon}
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="mt-4 flex-grow h-px bg-gray-300"></div>

                    <div className='py-4'>
                        <p className=' font-bold '>RESUMEN</p>

                        <div className='flex w-full gap-4 pt-3'>
                            <Cardscomponent
                                className='w-full'
                                type='Error'
                                name={'Pendientes'}
                                qty={pendingTasks}
                            />

                            <Cardscomponent
                                className='w-full'
                                type='Success'
                                name={'Completadas'}
                                qty={completedTasks}
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex-grow h-px bg-gray-300"></div>

                    <div className="py-4 border-t border-gray-200 mt-auto">
                        <div className="flex items-center">
                            <div className="h-9 w-9 rounded-full bg-[var(--colorSmartNest)] text-white flex items-center justify-center">
                            <span className="text-sm font-medium">U</span>
                            </div>
                            <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700">{userName}</p>
                            <p className="text-xs text-gray-500">{userEmail}</p>
                            </div>
                            <div className="ml-auto relative">
                                <button
                                    className="text-gray-400 hover:text-gray-500"
                                    onClick={() => setSettingsMenuOpen(!settingsMenuOpen)}
                                >
                                    <FontAwesomeIcon
                                        className='h-full w-[1.5rem]'
                                        icon={faGear}
                                    />
                                </button>
                                
                                {/* Menú desplegable */}
                                {settingsMenuOpen && (
                                    <div
                                        ref={settingsMenuRef}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                                    >
                                        <button
                                            onClick={logout}
                                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <FontAwesomeIcon
                                                icon={faSignOut}
                                                className="mr-3 h-4 w-4 text-gray-500"
                                            />
                                            Cerrar sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <main 
                    className={`
                        flex-1 p-4 transition-all duration-300 ease-in-out
                        ${menuVisible ? 'md:ml-0' : 'md:ml-[-16rem]'}
                        w-full overflow-scroll
                    `}
                >
                    {children}
                </main>
            </div>
            {isOpen && (
                <div className="fixed inset-0 bg-[#0000004f] flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                    <ModalTask onCancel={closeModal}/>
                </div>
                </div>
      )}
        </div>
    );
}