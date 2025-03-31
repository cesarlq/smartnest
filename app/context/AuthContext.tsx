"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
const SERVER_URL = process.env.SERVER_URL || '';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }
      
      try {
        const token = window.localStorage.getItem('token');
        const userData = window.localStorage.getItem('user');
        
        console.log('Token en localStorage:', token);
        console.log('Usuario en localStorage:', userData);
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          console.log('Usuario parseado:', parsedUser);
          setUser(parsedUser);
          
          // Si estamos en la página de login o registro y el usuario ya está autenticado,
          // redirigir al home
          const currentPath = window.location.pathname;
          if (currentPath === '/login' || currentPath === '/register') {
            console.log('Usuario ya autenticado, redirigiendo a /home');
            router.push('/home');
          }
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('token');
          window.localStorage.removeItem('user');
        }
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      console.log('Iniciando sesión con:', { email });
      
      const response = await fetch(`${SERVER_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Respuesta del servidor:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }
      
      // Guardar datos de sesión
      if (data.token) {
        console.log('Guardando token en localStorage');
        localStorage.setItem('token', data.token);
      }
      
      if (data.user) {
        console.log('Guardando usuario en localStorage:', data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      // Establecer el usuario en el contexto
      setUser(data.user);
      
      // Redirigir al usuario después de iniciar sesión
      console.log('Redirigiendo a /home después de login exitoso');
      
      // Usar window.location.href para una redirección más directa
      if (typeof window !== 'undefined') {
        window.location.href = '/home';
      } else {
        router.push('/home');
      }
      
      return data;
    } catch (error) {
      console.error('Error en login:', error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Error desconocido al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    console.log('Cerrando sesión...');
    
    try {
      
      try {
        const response = await fetch(`${SERVER_URL}/api/auth/logout`, {
          method: 'POST',
          credentials: 'include',
        });
        
        const data = await response.json();
        console.log('Respuesta del servidor al logout:', data);
      } catch (apiError) {
        
        console.log('No se pudo contactar con la API de logout:', apiError);
      }
      
      
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('user');
        
        
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        
        
        const domain = window.location.hostname;
        document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
        
        
        if (domain === 'localhost') {
          document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=;';
        }
      }
      
      
      setUser(null);
      
      
      console.log('Redirigiendo a /login después de logout');
      
      
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error en el proceso de logout:', error);
      
      
      setUser(null);
      
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      } else {
        router.push('/login');
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
}