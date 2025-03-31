import { createAsyncThunk } from "@reduxjs/toolkit";
import { addComment, addNewTask, addSubTask, allTask, changetaskStatusChange, changetaSubTaskStatus } from "../../services/tasks";

export const PostTask = createAsyncThunk(
    'user/PostTask', 
    async (params: { title:string, description: string, userId: string}, { rejectWithValue }) => {
      try {
        const response = await addNewTask(params.title, params.description, params.userId);
        return response;
      } catch (error) {
        return rejectWithValue(
          error instanceof Error ? error : 'Error desconocido al Registrarte'
        );
      }
    }
  );

export const GetAlltask = createAsyncThunk(
    'user/GetAlltask', 
    async (_, { rejectWithValue }) => {
      try {
        const response = await allTask();
        return response;
      } catch (error) {
        return rejectWithValue(
          error instanceof Error ? error : 'Error desconocido al Registrarte'
        );
      }
    }
  );

export const PutAddSubTask = createAsyncThunk(
  'user/updatetask',
  async (params: { title: string, taskId: string}, { rejectWithValue }) => {
    try {
      const response = await addSubTask(params.taskId, params.title);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error : 'Error desconocido al Actualizar Tarea'
      );
    }
  }
);

export const addCommment = createAsyncThunk(
  'user/addCommment',
  async (params: { taskId: string , content: string, userId: string }, { rejectWithValue }) => {
    try {
      const response = await addComment(params.taskId, params.content, params.userId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error : 'Error desconocido al Actualizar Tarea'
      );
    }
  }
);

export const taskStatusChange = createAsyncThunk(
  'user/taskStatusChange',
  async (params: { taskId: string | undefined, currentStatus: 'pendiente' | 'completada' | undefined }, { rejectWithValue }) => {
    try {
      const response = await changetaskStatusChange(params.taskId, params.currentStatus);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error : 'Error desconocido al Actualizar Tarea'
      );
    }
  }
);

export const subTaskStatusChange = createAsyncThunk(
  'user/subTaskStatusChange',
  async (params: { taskId: string | undefined, subTaskId: string, currentStatus: 'pendiente' | 'completada'}, { rejectWithValue }) => {
    try {
      const response = await changetaSubTaskStatus(params.taskId, params.subTaskId, params.currentStatus);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error : 'Error desconocido al Actualizar Tarea'
      );
    }
  }
);