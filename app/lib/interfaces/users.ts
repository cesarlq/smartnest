export interface newUserI {
    id: string,
    name: string,
    email: string,
    password: string
  };

export interface ResponseNewUserI {
    success: boolean,
    user: {
        id: string,
        email: string,
        name: string
    },
    token: string
}
export interface ResponseuserI {
  success: boolean,
  user: {
    id: string,
    email: string,
    name: string
  }
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentialsI {
  email: string;
  password: string;
}

export interface RegisterDataI {
  nombre: string;
  email: string;
  password: string;
}