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

    localStorage.setItem('token', responseData.token);
    localStorage.setItem('user', JSON.stringify(responseData.user));
    
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

    localStorage.setItem('token', responseData.token);
    localStorage.setItem('user', JSON.stringify(responseData.user));
    
    return responseData;
  } catch (error) {
    console.error('Error en register:', error);
    throw error;
  }
};