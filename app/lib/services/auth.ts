export const login = async (email: string, password: string) => {
  try {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    };

    const response = await fetch('/api/auth/login', options);
    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage = responseData.message || `Error: ${response.statusText}`;
      console.log('Mensaje de error recibido:', errorMessage);
      throw new Error(errorMessage);

    }

    console.log('Respuesta del login:', responseData);
    
    if (typeof window !== 'undefined') {
      if (responseData.token) {
        window.localStorage.setItem('token', responseData.token);
      } else {
        console.error('No se recibió token en la respuesta');
      }
      
      if (responseData.user) {
        console.log('Guardando usuario en localStorage:', responseData.user);
        window.localStorage.setItem('user', JSON.stringify(responseData.user));
      } else {
        console.error('No se recibió información de usuario en la respuesta');
      }
    }
    
    return responseData;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

export const register = async (name: string, email: string, password: string) => {
  try {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name, email, password }),
    };

    const response = await fetch('/api/auth/register', options);
    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage = responseData.message || `Error: ${response.statusText}`;
      console.log('Mensaje de error recibido:', errorMessage);
      throw new Error(errorMessage);

    }

    console.log('Respuesta del registro:', responseData);
    
    if (typeof window !== 'undefined') {
      if (responseData.token) {
        window.localStorage.setItem('token', responseData.token);
      } else {
        console.error('No se recibió token en la respuesta de registro');
      }
      
      if (responseData.user) {
        console.log('Guardando usuario registrado en localStorage:', responseData.user);
        window.localStorage.setItem('user', JSON.stringify(responseData.user));
      } else {
        console.error('No se recibió información de usuario en la respuesta de registro');
      }
    }
    
    return responseData;
  } catch (error) {
    console.error('Error en register:', error);
    throw error;
  }
};