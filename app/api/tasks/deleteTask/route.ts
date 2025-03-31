import { NextResponse } from "next/server";
import { connectDB } from "../../mongoDb";
import { ObjectId } from "mongodb";

export async function DELETE(request: Request) {
    console.log("Eliminando tarea");
    
    try {
        const { taskId } = await request.json();
        
        if (!taskId) {
            return NextResponse.json({
                success: false,
                message: 'ID de tarea no proporcionado'
            }, { status: 400 });
        }

        const db = await connectDB();
        const tasksCollection = db.collection('tasks');
        
        const result = await tasksCollection.deleteOne({ _id: new ObjectId(taskId) });
        
        if (result.deletedCount === 0) {
            return NextResponse.json({
                success: false,
                message: 'No se encontró la tarea para eliminar'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Tarea eliminada correctamente'
        });
    } catch (error) {
        console.error("Error eliminando tarea:", error);
        return NextResponse.json({
            success: false,
            message: 'Error eliminando tarea',
            details: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }
}
