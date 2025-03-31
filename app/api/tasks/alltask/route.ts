import { NextResponse } from "next/server";
import { getAllTasks } from "../../mongoDb";

export async function GET() {
    console.log("Obteniendo tareas");
    
    try {
        const allTask = await getAllTasks()

        return NextResponse.json({
            success: true,
            message: 'Obteniendo tareas correctamente',
            allTask
        });
    } catch (error) {
        console.error("Error Obteniendo tareas:", error);
        return NextResponse.json({ 
            success: false, 
            message: 'Error Obteniendo tareas',
            details: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }
}