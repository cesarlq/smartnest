import { createSlice } from '@reduxjs/toolkit';
import { InitialStateTaskI } from '../../interfaces/taskInterface';
import { PostTask, GetAlltask, PutAddSubTask, addCommment, taskStatusChange, subTaskStatusChange } from '../thunks/task.thunk';

const initialState: InitialStateTaskI = {
     postTask: {
        status: "idle",
        error: null
    },
    responsePostTask: null,

    getAllTask: {
        status: "idle",
        error: null
    },
    responsegetAllTask: null,

    putSubTask: {
        status: "idle",
        error: null
    },
    responseSubTask: null,

    putCommit: {
        status: 'idle',
        error: null
    },
    responseputCommit: null,

    putChangeStatus: {
        status: 'idle',
        error: null ,
    },
    responseChangeStatus: null,

    putChangeSubStatus: {
        status: 'idle',
        error: null ,
    },
    responseChangeSubStatus: null,
    
};

export const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        resetTask(state){
            state.postTask=initialState.postTask;
        },
    },
    extraReducers(auth) {
        //POST Register
        auth.addCase(PostTask.pending, (state) => {
            state.postTask.status = 'loading';
        });
        
        auth.addCase(PostTask.rejected, (state, action) => {
            state.postTask.status = 'failed';
            state.postTask.error = action.payload as string || 'Error desconocido';
        });
        
        auth.addCase(PostTask.fulfilled, (state, action) => {
            state.responsePostTask = action.payload;
            state.postTask.status = 'succeeded';
        });

        //GET Alltask
        auth.addCase(GetAlltask.pending, (state) => {
            state.getAllTask.status = 'loading';
        });
        
        auth.addCase(GetAlltask.rejected, (state, action) => {
            state.getAllTask.status = 'failed';
            state.getAllTask.error = action.payload as string || 'Error desconocido';
        });
        
        auth.addCase(GetAlltask.fulfilled, (state, action) => {
            state.responsegetAllTask = action.payload;
            state.getAllTask.status = 'succeeded';
        });

        //PUT subTask
        auth.addCase(PutAddSubTask.pending, (state) => {
            state.putSubTask.status = 'loading';
        });
        
        auth.addCase(PutAddSubTask.rejected, (state, action) => {
            state.putSubTask.status = 'failed';
            state.putSubTask.error = action.payload as string || 'Error desconocido';
        });
        
        auth.addCase(PutAddSubTask.fulfilled, (state, action) => {
            state.responseSubTask = action.payload;
            state.putSubTask.status = 'succeeded';
        });

        //PUT comment
        auth.addCase(addCommment.pending, (state) => {
            state.putCommit.status = 'loading';
        });
        
        auth.addCase(addCommment.rejected, (state, action) => {
            state.putCommit.status = 'failed';
            state.putCommit.error = action.payload as string || 'Error desconocido';
        });
        
        auth.addCase(addCommment.fulfilled, (state, action) => {
            state.responseputCommit = action.payload;
            state.putCommit.status = 'succeeded';
        });

        //PUT changestatus
        auth.addCase(taskStatusChange.pending, (state) => {
            state.putChangeStatus.status = 'loading';
        });
        
        auth.addCase(taskStatusChange.rejected, (state, action) => {
            state.putChangeStatus.status = 'failed';
            state.putChangeStatus.error = action.payload as string || 'Error desconocido';
        });
        
        auth.addCase(taskStatusChange.fulfilled, (state, action) => {
            state.responseChangeStatus = action.payload;
            state.putChangeStatus.status = 'succeeded';
        });

         //PUT subTaskStatusChange
         auth.addCase(subTaskStatusChange.pending, (state) => {
            state.putChangeSubStatus.status = 'loading';
        });
        
        auth.addCase(subTaskStatusChange.rejected, (state, action) => {
            state.putChangeSubStatus.status = 'failed';
            state.putChangeSubStatus.error = action.payload as string || 'Error desconocido';
        });
        
        auth.addCase(subTaskStatusChange.fulfilled, (state, action) => {
            state.responseChangeSubStatus = action.payload;
            state.putChangeSubStatus.status = 'succeeded';
        });

    },
});

export const { resetTask } = taskSlice.actions;
export default taskSlice.reducer;