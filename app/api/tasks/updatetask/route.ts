'use server';

import { NextRequest, NextResponse } from 'next/server';
import { Comment, SubTask } from '@/app/lib/interfaces/taskInterface';
import { updateTask, addSubTaskToTask, addCommentToTask, getTaskCollection } from '../../mongoDb';
import { ObjectId } from 'mongodb';

export async function PUT(request: NextRequest) {
    console.log("Recibiendo solicitud para actualizar tarea");
    
    try {
        const body = await request.json();
        console.log("Datos recibidos:", body);
        const { taskId, update, newSubTask, newComment } = body;

        if (!taskId) {
            return NextResponse.json({
                success: false,
                message: 'El ID de la tarea es obligatorio'
            }, { status: 400 });
        }

        let result;

        // Si se proporciona una actualización general
        if (update) {
            // Si la actualización incluye subtareas
            if (update.subTasks && update.subTasks.length > 0) {
                // Obtener la tarea actual
                const collection = await getTaskCollection();
                const task = await collection.findOne({ _id: new ObjectId(taskId) });
                
                if (!task) {
                    return NextResponse.json({
                        success: false,
                        message: 'Tarea no encontrada'
                    }, { status: 404 });
                }
                
                // Actualizar la subtarea específica
                const subTaskToUpdate = update.subTasks[0];
                
                if (!task.subTasks) {
                    task.subTasks = [];
                }
                // Encontrar y actualizar la subtarea
                const updatedSubTasks = task.subTasks.map((subTask: SubTask) => {
                    if (subTask.id === subTaskToUpdate.id) {
                        return {
                            ...subTask,
                            status: subTaskToUpdate.status,
                            title: subTaskToUpdate.title || subTask.title,
                            updatedAt: new Date()
                        };
                    }
                    return subTask;
                });
                
                // Actualizar la tarea con las subtareas actualizadas
                result = await updateTask(taskId, {
                    subTasks: updatedSubTasks,
                    updatedAt: new Date()
                });
            }
            // Si se está intentando cambiar el estado a "completada"
            else if (update.status === 'completada') {
                // Obtener la tarea actual para verificar sus subtareas
                const collection = await getTaskCollection();
                const task = await collection.findOne({ _id: new ObjectId(taskId) });
                
                if (task && task.subTasks && task.subTasks.length > 0) {
                    // Verificar si hay subtareas pendientes
                    const pendingSubTasks = task.subTasks.filter(
                        (subTask: SubTask) => subTask.status === 'pendiente'
                    );
                    
                    if (pendingSubTasks.length > 0) {
                        return NextResponse.json({
                            success: false,
                            message: 'No se puede marcar la tarea como completada porque tiene subtareas pendientes'
                        }, { status: 400 });
                    }
                }
                
                result = await updateTask(taskId, update);
            }
            // Actualización normal
            else {
                
                if(update.removeSubTask){
                    console.log('Eliminando subtarea:', update.removeSubTask);
                    const collection = await getTaskCollection();
                    const task = await collection.findOne({ _id: new ObjectId(taskId) });
                    
                    if (!task) {
                        return NextResponse.json({
                            success: false,
                            message: 'Tarea no encontrada'
                        }, { status: 404 });
                    }
                    
                    if (!task.subTasks) {
                        task.subTasks = [];
                    }
                    
                    // Filtrar las subtareas para eliminar la que tiene el ID proporcionado
                    const updatedSubTasks = task.subTasks.filter((subTask: SubTask) =>
                        subTask.id !== update.removeSubTask
                    );
                    
                    console.log('Subtareas actualizadas:', updatedSubTasks);
                    
                    // Actualizar la tarea con la nueva lista de subtareas
                    result = await updateTask(taskId, {
                        subTasks: updatedSubTasks,
                        updatedAt: new Date()
                    });
                } else {
                    result = await updateTask(taskId, update);
                }
            }
        }

        // Si se proporciona una nueva subtarea
        if (newSubTask) {
            const subTaskData: Omit<SubTask, 'id' | 'taskId'> = {
                title: newSubTask.title,
                description: newSubTask.description,
                status: 'pendiente',
                createdAt: new Date()
            };
            
            result = await addSubTaskToTask(taskId, subTaskData);
        }

        // Si se proporciona un nuevo comentario
        if (newComment) {
            const commentData: Omit<Comment, 'id'> = {
                content: newComment.content,
                userId: newComment.userId,
                createdAt: new Date(),
            };
            
            result = await addCommentToTask(taskId, commentData);
        }

        if (!result) {
            return NextResponse.json({
                success: false,
                message: 'No se proporcionaron datos para actualizar'
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: 'Tarea actualizada correctamente',
            result
        });
    } catch (error) {
        console.error("Error al actualizar tarea:", error);
        return NextResponse.json({ 
            success: false, 
            message: 'Error al actualizar la tarea',
            details: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }
}
