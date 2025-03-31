
import { createAsyncThunk } from '@reduxjs/toolkit';
import { login } from '../../services/auth';
import { ResponseuserI } from '../../interfaces/users';

export const loginThunk = createAsyncThunk(
	'user/loginThunk', 
	async (params: { email: string, password: string }, { rejectWithValue }) => {
	  try {
		const response = await login(params.email, params.password) as ResponseuserI;
		return response;
	  } catch (error) {
		return rejectWithValue(
		  error instanceof Error ? error : 'Error desconocido al iniciar sesión'
		);
	  }
	}
  );