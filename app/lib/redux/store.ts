import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/auth.reducer';
import taskReducer from './reducers/tasks.reducer'

export const store = configureStore({
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
	reducer: {
		authReducer,
		taskReducer,
	}
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
