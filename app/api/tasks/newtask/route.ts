'use server';

import { NextRequest, NextResponse } from 'next/server';
import { TaskI } from '@/app/lib/interfaces/taskInterface';
import { addTask } from '../../mongoDb';

export async function POST(request: NextRequest) {
    console.log("Recibiendo solicitud para crear nueva tarea");
    
    try {
        const body = await request.json();
        console.log("Datos recibidos:", body);
        const { title, description, userId } = body;

        if (!title) {
            return NextResponse.json({ 
                success: false, 
                message: 'El título es obligatorio' 
            }, { status: 400 });
        }

        const newTask: TaskI = {
            title: title.trim(),
            description: description?.trim() || '',
            status: 'pendiente',
            createdAt: new Date(),
            userId: userId || '',
            subTasks: [],
            comments: []
        };

        const result = await addTask({newTask});

        return NextResponse.json({
            success: true,
            message: 'Tarea creada correctamente',
            taskId: result.insertedId,
            task: newTask
        });
    } catch (error) {
        console.error("Error al crear tarea:", error);
        return NextResponse.json({ 
            success: false, 
            message: 'Error al crear la tarea',
            details: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }
}