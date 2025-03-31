
import { createAsyncThunk } from '@reduxjs/toolkit';
import { register } from '../../services/auth';
import { ResponseNewUserI } from '../../interfaces/users';

export const registerThunk = createAsyncThunk(
	'user/registerThunk', 
	async (params: { name: string,  email: string, password: string }, { rejectWithValue }) => {
	  try {
		const response = await register(params.name, params.email, params.password) as ResponseNewUserI;
		return response;
	  } catch (error) {
		return rejectWithValue(
		  error instanceof Error ? error : 'Error desconocido al Registrarte'
		);
	  }
	}
  );