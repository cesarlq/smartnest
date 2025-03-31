"use client"

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPenToSquare, faTrashCan, faChevronDown, faClipboard, faComments, faFloppyDisk, faBan } from '@fortawesome/free-solid-svg-icons';
import SelectComponent from '@/app/components/common/selectComponent';
import TextFieldAdornmentComponent from '@/app/components/common/textFieldAdornmentComponent';
import StatusChipComponent from '@/app/components/common/statusChipComponent';
import CheckboxComponent from '@/app/components/common/checkboxComponent';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/app/lib/redux/hooks';
import { addCommment, DeleteSubTask, DeleteTask, EditSubTask, GetAlltask, PutAddSubTask, subTaskStatusChange, taskStatusChange } from '@/app/lib/redux/thunks/task.thunk';
import { SubTask, User, Comment } from '@/app/lib/interfaces/taskInterface';
import InputComponent from '@/app/components/common/inputComponent';
import SnackBarComponent, { SnackBarType } from '@/app/components/common/snackBarComponent';
import TextAreaComponent from '@/app/components/common/textAreaComponent';
import ButtonComponent from '@/app/components/common/buttonComponent';

export default function Task() {
    const dispatch = useAppDispatch();
    const stateGetAllTask = useAppSelector((state) => state.taskReducer.getAllTask);
    const statePostTask = useAppSelector((state) => state.taskReducer.postTask);
    const statePutAddSubTask = useAppSelector((state) => state.taskReducer.putSubTask);
    const stateaddCommment = useAppSelector((state) => state.taskReducer.putCommit);
    const stateTaskStatusChange = useAppSelector((state) => state.taskReducer.putChangeStatus)
    const stateSubTaskStatusChange = useAppSelector((state) => state.taskReducer.putChangeSubStatus)
    const stateDeleteTask = useAppSelector((state) => state.taskReducer.deleteTask);
    const stateDeleteSubTask = useAppSelector((state) => state.taskReducer.deleteSubTask);
    const stateEditSubTask = useAppSelector((state) => state.taskReducer.editSubTask);
    const responseGetAllTask = useAppSelector((state) => state.taskReducer.responsegetAllTask);
    const [selectedValue, setSelectedValue] = useState<string | number>('');
    const [searchValue, setSearchValue] = useState('');
    const [rows, setRows] = useState<Array<ReturnType<typeof createData>>>([]);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [newSubTask, setNewSubTask] = useState('');
    const [newComment, setNewComment] = useState('');
    const [editingSubTask, setEditingSubTask] = useState<{id: string, taskId: string, currentStatus: "pendiente" | "completada" ,title: string} | null>(null);
    const [snackbar, setSnackbar] = useState({
            open: false,
            message: '',
            type: 'Error' as SnackBarType
        });
    const handleCloseSnackbar = () => {
        setSnackbar({
            ...snackbar,
            open: false
        });
    };

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    const options = [
        { value: '', label: 'Todos' },
        { value: 'pendiente', label: 'Pendiente' },
        { value: 'completada', label: 'Completada' },
      ];

    const handleExpandClick = (rowId: string | undefined) => {
        if (rowId) {
            setExpandedRow(expandedRow === rowId ? null : rowId);
        }
    };

    const handleAddSubTask = async (taskId: string | undefined, title: string) => {

        if (!taskId || !title.trim()) {
            setSnackbar({
                open: true,
                message: '¡Error en taskId o No hay titulo!',
                type: 'Warning'
            });
        }else {
            dispatch(
                PutAddSubTask({
                    title,
                    taskId: taskId ?? ''
                })
            )
        }
        
    };

    const handleAddComment = async (taskId: string | undefined, content: string, userId: string | undefined) => {
        if (!taskId || !content.trim() || !userId) {
            setSnackbar({
                open: true,
                message: '¡Sin contenido!',
                type: 'Warning'
            });
        }else {
            dispatch(
                addCommment({
                    taskId,
                    content,
                    userId
                })
            )
        }
    };

    const handleInputComents = (data: string) => {
        setNewComment(data);
        
    };

    const handleInputNewSubTas = (data: string) => {
        setNewSubTask(data)
    };

    // Función para actualizar el estado de una tarea
    const handleTaskStatusChange = async (taskId: string | undefined, currentStatus: 'pendiente' | 'completada' | undefined) => {
        if (!taskId || !currentStatus){
            setSnackbar({
                open: true,
                message: '¡Sin contenido!',
                type: 'Warning'
            });
        }else {
            dispatch(
                taskStatusChange({
                    taskId,
                    currentStatus
                })
            )
        }
    };

    // Función para actualizar el estado de una subtarea
    const handleSubTaskStatusChange = async (taskId: string | undefined, subTaskId: string, currentStatus: 'pendiente' | 'completada') => {

        if (!taskId || !subTaskId) {
            setSnackbar({
                open: true,
                message: '¡Sin contenido!',
                type: 'Warning'
            });
        }else {
            dispatch(
                subTaskStatusChange({
                    taskId,
                    subTaskId,
                    currentStatus
                })
            )
        }
    };

    // Función para eliminar una tarea
    const handleDeleteTask = async (taskId: string | undefined) => {
        if (!taskId) {
            setSnackbar({
                open: true,
                message: '¡ID de tarea no proporcionado!',
                type: 'Warning'
            });
        } else {
            dispatch(
                DeleteTask({
                    taskId
                })
            );
        }
    };

    // Función para eliminar una subtarea
    const handleDeleteSubTask = async (taskId: string | undefined, subTaskId: string) => {
        if (!taskId || !subTaskId) {
            setSnackbar({
                open: true,
                message: '¡ID de tarea o subtarea no proporcionado!',
                type: 'Warning'
            });
        } else {
            dispatch(
                DeleteSubTask({
                    taskId,
                    subTaskId
                })
            );
        }
    };

    // Función para iniciar la edición de una subtarea
    const startEditSubTask = (taskId: string | undefined, subTaskId: string,currentStatus: "pendiente" | "completada", title: string) => {
        if (taskId && subTaskId) {
            setEditingSubTask({
                id: subTaskId,
                taskId,
                currentStatus,
                title
            });
        }
    };

    // Función para guardar la edición de una subtarea
    const saveEditSubTask = () => {
        if (editingSubTask) {
            dispatch(
                EditSubTask({
                    taskId: editingSubTask.taskId,
                    subTaskId: editingSubTask.id,
                    currentStatus: editingSubTask.currentStatus,
                    title: editingSubTask.title
                })
            );
            setEditingSubTask(null);
        }
    };

    // Función para cancelar la edición de una subtarea
    const cancelEditSubTask = () => {
        setEditingSubTask(null);
    };

    // Función para manejar cambios en el título de la subtarea en edición
    const handleEditSubTaskChange = (value: string) => {
        if (editingSubTask) {
            setEditingSubTask({
                ...editingSubTask,
                title: value
            });
        }
    };
    
    useEffect(()=>{

        if(stateSubTaskStatusChange.status == 'succeeded'){
            setSnackbar({
                open: true,
                message: '¡status de tarea cambiado Correctamente!',
                type: 'Success'
            });
        }

        if(stateSubTaskStatusChange.status == 'failed'){
            setSnackbar({
                open: true,
                message: stateSubTaskStatusChange.error || '¡Error al cambiar estatus de tarea!',
                type: 'Error'
            });
        }

    }, [stateSubTaskStatusChange])

    useEffect(()=>{
        if(stateDeleteTask.status == 'succeeded'){
            setSnackbar({
                open: true,
                message: '¡Tarea eliminada correctamente!',
                type: 'Success'
            });
        }

        if(stateDeleteTask.status == 'failed'){
            setSnackbar({
                open: true,
                message: stateDeleteTask.error || '¡Error al eliminar tarea!',
                type: 'Error'
            });
        }
    }, [stateDeleteTask])

    useEffect(()=>{
        if(stateDeleteSubTask.status == 'succeeded'){
            setSnackbar({
                open: true,
                message: '¡Subtarea eliminada correctamente!',
                type: 'Success'
            });
        }

        if(stateDeleteSubTask.status == 'failed'){
            setSnackbar({
                open: true,
                message: stateDeleteSubTask.error || '¡Error al eliminar subtarea!',
                type: 'Error'
            });
        }
    }, [stateDeleteSubTask])

    useEffect(()=>{
        if(stateEditSubTask.status == 'succeeded'){
            setSnackbar({
                open: true,
                message: '¡Subtarea editada correctamente!',
                type: 'Success'
            });
        }

        if(stateEditSubTask.status == 'failed'){
            setSnackbar({
                open: true,
                message: stateEditSubTask.error || '¡Error al editar subtarea!',
                type: 'Error'
            });
        }
    }, [stateEditSubTask])

    useEffect(()=>{

        if(stateTaskStatusChange.status == 'succeeded'){
            setSnackbar({
                open: true,
                message: '¡status de tarea cambiado Correctamente!',
                type: 'Success'
            });
        }

        if(stateTaskStatusChange.status == 'failed'){
            setSnackbar({
                open: true,
                message: stateTaskStatusChange.error || '¡Error al cambiar estatus de tarea!',
                type: 'Error'
            });
        }

    }, [stateTaskStatusChange])

    useEffect(()=>{
        if(statePutAddSubTask.status == 'succeeded'){
            setNewSubTask('');

            setSnackbar({
                open: true,
                message: '¡Subtarea Agregada de Manera Correcta!',
                type: 'Success'
            });
        
        }

        if(statePutAddSubTask.status == 'failed'){
            setSnackbar({
                open: true,
                message: statePutAddSubTask.error || '¡Error al agregar Subtarea!',
                type: 'Error'
            });
        }

    },[statePutAddSubTask])

    useEffect(()=>{

        if(stateaddCommment.status == 'succeeded'){
            setNewComment('');

            setSnackbar({
                open: true,
                message: 'Commentario Agregado de Manera Correcta!',
                type: 'Success'
            });
            
        }

        if(stateaddCommment.status == 'failed'){
            setSnackbar({
                open: true,
                message: stateaddCommment.error || '¡Error al agregar comentario!',
                type: 'Error'
            });
        }

    },[stateaddCommment])

    useEffect(()=>{
        dispatch(
            GetAlltask()
        )
    },[statePostTask, statePutAddSubTask, stateaddCommment, stateTaskStatusChange, stateSubTaskStatusChange, stateDeleteTask, stateDeleteSubTask, stateEditSubTask])

    useEffect(() => {
        console.log(stateGetAllTask);
        if(stateGetAllTask.status == 'succeeded'){
            
            console.log(responseGetAllTask);

            const filteredTasks = selectedValue
                ? (responseGetAllTask?.allTask || []).filter(task => task.status === selectedValue)
                : (responseGetAllTask?.allTask || []);

            const searchFilteredTasks = searchValue
                ? filteredTasks.filter(task =>
                    task.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
                    task.description?.toLowerCase().includes(searchValue.toLowerCase())
                )
                : filteredTasks;

            const newRows = searchFilteredTasks.map((task) => {
                return createData(
                    task._id,
                    task.title,
                    task.description,
                    task.status,
                    task.createdAt,
                    task.updatedAt,
                    task.userId,
                    task.user,
                    task.subTasks,
                    task.comments
                );
            });
            
            setRows(newRows);
        }
    },[stateGetAllTask, responseGetAllTask, selectedValue, searchValue])

    function createData(
    _id?: string,
    title?: string,
    description?: string,
    status?: 'pendiente' | 'completada',
    createdAt?: Date,
    updatedAt?: Date,
    userId?: string,
    user?: User,
    subTasks?: SubTask[],
    comments?: Comment[]
    
    ) {
    return { _id, title, description, status, createdAt,updatedAt,userId,user, subTasks, comments};
    }

    return (
        <div>
            <div >
               <h1>Tareas</h1> 
               <p>Gestiona todas tus tareas desde aquí</p>
            </div>

            <div className='w-full shadow p-4 rounded-[var(--roundedGlobal)] bg-white flex gap-3 my-4'>
                <div className='w-full'>
                    <p>Filtrar por estado</p>
                    <SelectComponent
                        label={undefined}
                        className='mx-0'
                        id="basic-select"
                        value={selectedValue}
                        onChange={(value) => setSelectedValue(value as string | number)}
                        options={options}
                    />
                </div>
                <div className='w-full'>
                    <p>Buscar</p>
                   <TextFieldAdornmentComponent
                        id="search-field"
                        placeholder="Buscar..."
                        value={searchValue}
                        onChange={setSearchValue}
                        startIcon={<FontAwesomeIcon className='w-[1.2rem]' icon={faSearch} />}
                    />
                </div>
            </div>

            {/* Table */}
            <div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Mis tareas</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                    </TableHead>

                    <TableBody>
                    {rows.map((row) => (
                        <React.Fragment key={row._id}>
                            <TableRow
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    <div className='flex gap-3'>
                                        <div>
                                            <CheckboxComponent
                                                {...label}
                                                checked={row.status === 'completada'}
                                                onChange={() => handleTaskStatusChange(row._id, row.status)}
                                            />
                                        </div>
                                        <div className='grid gap-3'>
                                            <div className='grid'>
                                                <p>{row.title}</p>
                                                <p>{row.description}</p>
                                                
                                            </div>
                                            
                                            <div className='flex gap-3'>
                                                <p>
                                                    <StatusChipComponent status={row.status} />
                                                </p>
                                                <span className='flex items-center'>
                                                    <FontAwesomeIcon className='w-[1.2rem] opacity-30' icon={faClipboard} />
                                                    {row.subTasks?.length || 0}/{row.subTasks?.length || 0}
                                                </span>
                                                <span className='flex items-center'>
                                                    <FontAwesomeIcon className='w-[1.2rem] opacity-30' icon={faComments} />
                                                    {row.comments?.length || 0}
                                                </span>
                                                <span className='flex items-center'>
                                                    {row.createdAt ? new Date(row.createdAt).toLocaleString() : ''}
                                                </span>
                                            </div>
                                        </div>
                                        
                                    </div>
                                    
                                </TableCell>
                                <TableCell>
                                    <div className='flex gap-3 justify-self-end'>
                                        <FontAwesomeIcon className='w-[1.2rem] cursor-pointer' icon={faPenToSquare} />
                                        <FontAwesomeIcon
                                            className='w-[1.2rem] cursor-pointer'
                                            icon={faTrashCan}
                                            onClick={() => handleDeleteTask(row._id)}
                                        />
                                        <FontAwesomeIcon
                                            className={`w-[1.2rem] cursor-pointer transition-transform duration-300 ${expandedRow === row._id ? 'rotate-180' : ''}`}
                                            icon={faChevronDown}
                                            onClick={() => handleExpandClick(row._id)}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                            
                            {expandedRow === row._id && (
                                <TableRow>
                                    <TableCell colSpan={2}>
                                        <div className="p-4rounded-[var(--roundedGlobal)]">
                                            <div className="mb-4">
                                            <div className="mt-2">
                                                    {row.subTasks && row.subTasks.length > 0 ? (
                                                        <ul className="list-disc pl-5 ">
                                                            {row.subTasks.map((subTask) => (
                                                                <li key={subTask.id} className="mb-1 list-none">
                                                                    <div className="flex items-center gap-2 justify-between">
                                                                        <div className="flex items-center gap-2">
                                                                            <CheckboxComponent
                                                                                checked={subTask.status === 'completada'}
                                                                                onChange={() => handleSubTaskStatusChange(row._id, subTask.id, subTask.status)}
                                                                            />
                                                                            <p>
                                                                                <StatusChipComponent status={subTask.status} />
                                                                            </p>
                                                                            {editingSubTask && editingSubTask.id === subTask.id ? (
                                                                                <div className="flex items-center gap-2">
                                                                                    <InputComponent 
                                                                                        className='w-full'
                                                                                        placeholder={''}
                                                                                        name="text" 
                                                                                        id={'SubTask'} 
                                                                                        type={'text'}  
                                                                                        value={editingSubTask.title}
                                                                                        onChange={(e: string) => { handleEditSubTaskChange(e); }} 
                                                                                        autoComplete="email"
                                                                                    />
                                                                                    <ButtonComponent
                                                                                        onClick={saveEditSubTask}
                                                                                    >
                                                                                        <FontAwesomeIcon className='w-[1.2rem]' icon={faFloppyDisk} />
                                                                                    </ButtonComponent>
                                                                                    <ButtonComponent
                                                                                        onClick={cancelEditSubTask}
                                                                                        className="bg-gray-500 text-white"
                                                                                    >
                                                                                        <FontAwesomeIcon className='w-[1.2rem]' icon={faBan} />
                                                                                    </ButtonComponent>
                                                                                </div>
                                                                            ) : (
                                                                                <span>{subTask.title}</span>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex gap-2">
                                                                            <FontAwesomeIcon
                                                                                className="w-[1rem] cursor-pointer text-blue-500"
                                                                                icon={faPenToSquare}
                                                                                onClick={() => startEditSubTask(row._id, subTask.id, subTask.status, subTask.title)}
                                                                            />
                                                                            <FontAwesomeIcon
                                                                                className="w-[1rem] cursor-pointer text-red-500"
                                                                                icon={faTrashCan}
                                                                                onClick={() => handleDeleteSubTask(row._id, subTask.id)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p>No hay subtareas</p>
                                                    )}
                                                </div>

                                                <h3 className="mb-2">Subtareas ({row.subTasks?.length || 0})</h3>
                                                <div className="flex gap-2 mb-2">
                                                    <InputComponent 
                                                        className='w-full'
                                                        placeholder="Agregar nueva subtarea..." 
                                                        name="subTask" 
                                                        id={'subTask'} 
                                                        type={'text'}  
                                                        value={newSubTask}
                                                        onChange={(e) => { handleInputNewSubTas(e) }} 
                                                    />
                                                    <ButtonComponent
                                                        onClick={() => handleAddSubTask(row._id, newSubTask)}
                                                    >
                                                        Agregar
                                                    </ButtonComponent>
                                                </div>
                                               
                                            </div>
                                            
                                            <div>
                                            <div className="mt-2">
                                                    {row.comments && row.comments.length > 0 ? (
                                                        <div className="space-y-2">
                                                            {row.comments.map((comment) => (
                                                                <div key={comment.id} className="p-2 bg-white border border-gray-200 rounded-md">
                                                                    <div className="flex justify-between items-center mb-1">
                                                                        <span className="text-xs text-gray-500">
                                                                            {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ''}
                                                                        </span>
                                                                    </div>
                                                                    <p>{comment.content}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-500">No hay comentarios</p>
                                                    )}
                                                </div>
                                                <h3 className="mb-2">Comentarios ({row.comments?.length || 0})</h3>
                                                <div className="flex gap-2 mb-2">
                                                    <TextAreaComponent
                                                        id="comment"
                                                        name="comment"
                                                        description={newComment}
                                                        onChange={(value) => handleInputComents(value)}
                                                        placeholder="Agregar nuevo comentario..."
                                                        rows={4}
                                                        maxLength={200}
                                                    />
                                                    <ButtonComponent
                                                        className="h-[100%]"
                                                        onClick={() => handleAddComment(row._id, newComment, row.userId)}
                                                    >
                                                        Comentar
                                                    </ButtonComponent>
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </React.Fragment>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
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
            
        </div>
    );
}
