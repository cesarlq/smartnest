"use client";

import React, { useEffect, useState } from 'react';
import InputComponent from '@/app/components/common/inputComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faPlus  } from '@fortawesome/free-solid-svg-icons';
import TextAreaComponent from '../common/textAreaComponent';
import { useAuth } from '@/app/context/AuthContext';
import { useAppDispatch, useAppSelector } from '@/app/lib/redux/hooks';
import { PostTask } from '@/app/lib/redux/thunks/task.thunk';
import SnackBarComponent, { SnackBarType } from '../common/snackBarComponent';
import { resetTask } from '@/app/lib/redux/reducers/tasks.reducer';

export default function ModalTask({onCancel}:{onCancel: () => void;}) {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const statePostTask = useAppSelector((state) => state.taskReducer.postTask);
  const [title, setTitle] = useState('');
  const [description, setDescription]= useState('');
  const [titleError, setTitleError] = useState('');
   const [snackbar, setSnackbar] = useState({
          open: false,
          message: '',
          type: 'Error' as SnackBarType
      });
  

  useEffect(()=>{
      if(statePostTask.status == 'failed'){
        setSnackbar({
          open: true,
          message: statePostTask.error || '',
          type: 'Error'
      });
      }

      if (statePostTask.status == 'succeeded') {
        setSnackbar({
            open: true,
            message: '¡Tarea agregada con exito!',
            type: 'Success'
        });
        setTimeout(() => {
          onCancel()
          dispatch(resetTask());
      }, 1500);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[statePostTask])

  const handleTitleChange = (value: string) => {
    setTitle(value);
    
    if (!value.trim()) {
      setTitleError('El título es obligatorio');
    } else if (value.trim().length < 3) {
      setTitleError('El título debe tener al menos 3 caracteres');
    } else {
      setTitleError('');
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
        ...snackbar,
        open: false
    });
};

  const handletextArea= (value: string)=>{
    setDescription(value);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

      dispatch(
        PostTask({
            title:title.trim(),
            description: description.trim(), 
            userId: user ? user.id.toString() : ''
        })
      );    
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-800 flex items-center">
          <FontAwesomeIcon className='h-full w-[1.2rem] text-[var(--colorSmartNest)] opacity-60 pr-2' icon={faPlus} /> 
          Nueva Tarea
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-500"
          aria-label="Cerrar"
        >
          <FontAwesomeIcon className='h-full w-[1.2rem] text-[var(--colorText)] opacity-60' icon={faXmark} /> 
        </button>
      </div>

      <div className='py-3 absolute bottom-[2rem] right-[2rem]'>
        <SnackBarComponent 
              type={snackbar.type}
              isOpen={snackbar.open}
              onClose={handleCloseSnackbar}
          >
                {typeof snackbar.message === 'object' 
              ? (snackbar.message as Error).message 
              : snackbar.message}
          </SnackBarComponent>
      </div>
        
      
      <form onSubmit={handleSubmit} className="animate-fadeIn">
        <div className="space-y-5">
          <div>
            <InputComponent
              placeholder="Título de la tarea"
              name="title"
              id="title"
              type="text"
              onChange={handleTitleChange}
              value={title}
              error={!!titleError}
              helperText={titleError}
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <svg className="mr-1 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Descripción (opcional)
            </label>
            <TextAreaComponent
              id="description"
              name="description"
              description={description}
              onChange={(value) => handletextArea(value)}
              placeholder="Describe tu tarea aquí..."
              rows={4}
              maxLength={200}
            />
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={titleError ? true: false}
                className="px-4 py-2 bg-[var(--colorSmartNest)] border border-transparent rounded-md text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Crear Tarea
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}