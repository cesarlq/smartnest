import { User } from "./users"


export interface InitialStateTaskI {
    postTask: {
        status: 'idle' | 'loading' | 'succeeded' | 'failed',
        error: null | string
    }
    responsePostTask: null | responsePostTaskI,


    getAllTask: {
        status: 'idle' | 'loading' | 'succeeded' | 'failed',
        error: null | string
    },
    responsegetAllTask: null | responsegetAllTaskI,

    putSubTask: {
        status: 'idle' | 'loading' | 'succeeded' | 'failed',
        error: null | string
    },
    responseSubTask: unknown,

    putCommit: {
        status: 'idle' | 'loading' | 'succeeded' | 'failed',
        error: null | string
    },
    responseputCommit: unknown,

    putChangeStatus: {
        status: 'idle' | 'loading' | 'succeeded' | 'failed',
        error: null | string
    },
    responseChangeStatus: null | string,

    putChangeSubStatus: {
        status: 'idle' | 'loading' | 'succeeded' | 'failed',
        error: null | string
    },
    responseChangeSubStatus: null | string,

    deleteTask: {
        status: 'idle' | 'loading' | 'succeeded' | 'failed',
        error: null | string
    },
    responseDeleteTask: null | responseDeleteTaskI,

    deleteSubTask: {
        status: 'idle' | 'loading' | 'succeeded' | 'failed',
        error: null | string
    },
    responseDeleteSubTask: null | responseDeleteTaskI,

    editSubTask: {
        status: 'idle' | 'loading' | 'succeeded' | 'failed',
        error: null | string
    },
    responseEditSubTask: null | responseEditTaskI,

    editTask: {
        status: 'idle' | 'loading' | 'succeeded' | 'failed',
        error: null | string
    },
    responseEditTask: null | responseEditTaskI
}

export interface responsegetAllTaskI {
    success: boolean,
    message: string,
    allTask: TaskI[]
}

export interface responsePostTaskI {
    success: true,
    message: string,
    taskId: string,
    task: TaskI
}

export interface responseDeleteTaskI {
    success: boolean,
    message: string
}

export interface responseEditTaskI {
    success: boolean,
    message: string,
    updatedTask?: TaskI
}

export interface Comment {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt?: Date;
    userId: string;
}

export interface SubTask {
    id: string;
    title: string;
    description?: string;
    status: 'pendiente' | 'completada';
    createdAt: Date;
    updatedAt?: Date;
    taskId: string;
}

export interface TaskI {
    _id?: string;
    title: string;
    description: string;
    status?: 'pendiente' | 'completada';
    createdAt?: Date;
    updatedAt?: Date;
    userId?: string;
    user?: User;
    subTasks?: SubTask[];
    comments?: Comment[];
}

export interface TaskFilter {
    status?: 'pendiente' | 'completada' | 'todas';
    searchTerm?: string;
    sortBy?: 'createdAt' | 'title' | 'status';
    sortOrder?: 'asc' | 'desc';
}

