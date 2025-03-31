import { createSlice } from '@reduxjs/toolkit';
import { InitialStateTaskI } from '../../interfaces/taskInterface';
import { PostTask, GetAlltask, PutAddSubTask, addCommment, taskStatusChange, subTaskStatusChange, DeleteTask, DeleteSubTask, EditSubTask, EditTask } from '../thunks/task.thunk';

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
        error: null,
    },
    responseChangeStatus: null,

    putChangeSubStatus: {
        status: 'idle',
        error: null,
    },
    responseChangeSubStatus: null,

    deleteTask: {
        status: 'idle',
        error: null
    },
    responseDeleteTask: null,

    deleteSubTask: {
        status: 'idle',
        error: null
    },
    responseDeleteSubTask: null,

    editSubTask: {
        status: 'idle',
        error: null
    },
    responseEditSubTask: null,
    editTask: {
        status: 'idle',
        error: null
    },
    responseEditTask: null
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

       //DELETE Task
       auth.addCase(DeleteTask.pending, (state) => {
           state.deleteTask.status = 'loading';
       });
       
       auth.addCase(DeleteTask.rejected, (state, action) => {
           state.deleteTask.status = 'failed';
           state.deleteTask.error = action.payload as string || 'Error desconocido';
       });
       
       auth.addCase(DeleteTask.fulfilled, (state, action) => {
           state.responseDeleteTask = action.payload;
           state.deleteTask.status = 'succeeded';
       });

       //DELETE SubTask
       auth.addCase(DeleteSubTask.pending, (state) => {
           state.deleteSubTask.status = 'loading';
       });
       
       auth.addCase(DeleteSubTask.rejected, (state, action) => {
           state.deleteSubTask.status = 'failed';
           state.deleteSubTask.error = action.payload as string || 'Error desconocido';
       });
       
       auth.addCase(DeleteSubTask.fulfilled, (state, action) => {
           state.responseDeleteSubTask = action.payload;
           state.deleteSubTask.status = 'succeeded';
       });

       //EDIT SubTask
       auth.addCase(EditSubTask.pending, (state) => {
           state.editSubTask.status = 'loading';
       });
       
       auth.addCase(EditSubTask.rejected, (state, action) => {
           state.editSubTask.status = 'failed';
           state.editSubTask.error = action.payload as string || 'Error desconocido';
       });
       
       auth.addCase(EditSubTask.fulfilled, (state, action) => {
           state.responseEditSubTask = action.payload;
           state.editSubTask.status = 'succeeded';
       });

       //EDIT Task
       auth.addCase(EditTask.pending, (state) => {
           state.editTask.status = 'loading';
       });
       
       auth.addCase(EditTask.rejected, (state, action) => {
           state.editTask.status = 'failed';
           state.editTask.error = action.payload as string || 'Error desconocido';
       });
       
       auth.addCase(EditTask.fulfilled, (state, action) => {
           state.responseEditTask = action.payload;
           state.editTask.status = 'succeeded';
       });
   },
});

export const { resetTask } = taskSlice.actions;
export default taskSlice.reducer;