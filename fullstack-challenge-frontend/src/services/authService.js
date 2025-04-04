import api from './api';

export const loginUser = async (credentials) => {
  try {
    // Llama al endpoint de login del backend
    const response = await api.post('/auth/login', credentials);
    // La instancia 'api' ya incluye el manejo base de errores y URL
    // Devuelve los datos de la respuesta (que deberían incluir token y user)
    return response.data;
  } catch (error) {
    // El interceptor de respuesta ya podría haber manejado/logueado el error.
    // Aquí puedes añadir lógica específica si es necesario, o simplemente relanzar.
    console.error("Error in loginUser service:", error.response?.data?.message || error.message);
    // Lanza el error para que AuthContext o el componente lo capturen
    throw error.response?.data || new Error('Login failed');
  }
};

export const signupUser = async (credentials) => {
  try {
    // Llama al endpoint de signup del backend
    const response = await api.post('/auth/signup', credentials);
    // Devuelve los datos de la respuesta
    return response.data;
  } catch (error) {
    console.error("Error in signupUser service:", error.response?.data?.message || error.message);
    // Lanza el error para que AuthContext o el componente lo capturen
    throw error.response?.data || new Error('Signup failed');
  }
};

