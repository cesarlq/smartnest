import { createSlice } from '@reduxjs/toolkit';
import { InitialStateAhutI } from '../../interfaces/auth';
import { loginThunk } from '../thunks/auth.thunk';
import { registerThunk } from '../thunks/register.thunk';

const initialState: InitialStateAhutI = {
    getAuth: {
        status: "idle",
        error: null
    },
    getregister: {
        status: "idle",
        error: null
    },

    auth: null,
    register: null,
    
};

export const userSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers(auth) {

        //GET login Validation
        auth.addCase(loginThunk.pending, (state) => {
            state.getAuth.status = 'loading';
        });
        
        auth.addCase(loginThunk.rejected, (state, action) => {
            state.getAuth.status = 'failed';
            state.getAuth.error = action.payload as string || 'Error desconocido';
        });
        
        auth.addCase(loginThunk.fulfilled, (state, action) => {
            state.auth = action.payload;
            state.getAuth.status = 'succeeded';
        });

        //POST Register
        auth.addCase(registerThunk.pending, (state) => {
            state.getregister.status = 'loading';
        });
        
        auth.addCase(registerThunk.rejected, (state, action) => {
            state.getregister.status = 'failed';
            state.getregister.error = action.payload as string || 'Error desconocido';
        });
        
        auth.addCase(registerThunk.fulfilled, (state, action) => {
            state.register = action.payload;
            state.getregister.status = 'succeeded';
        });
    },
});

export default userSlice.reducer;