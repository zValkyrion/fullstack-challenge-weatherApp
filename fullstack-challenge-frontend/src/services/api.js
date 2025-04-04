import axios from 'axios';

// 1. Lee la URL base de la API desde las variables de entorno de Vite
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log(`[API Service Frontend] Initializing with API Base URL: ${API_BASE_URL}`);

// 2. Crea una instancia de Axios preconfigurada
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. --- Interceptor para añadir el Token JWT a las peticiones ---
apiClient.interceptors.request.use(
  (config) => {
    // console.log(`[Axios Interceptor Frontend] Intercepting request to: ${config.url}`);
    let token = null;
    try {
      token = localStorage.getItem('authToken');
    } catch (e) {
       console.error('[Axios Interceptor Frontend] Error reading localStorage:', e);
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('[Axios Interceptor Frontend] Request Setup Error:', error);
    return Promise.reject(error);
  }
);

// 4. --- Funciones específicas para llamar a los endpoints del backend ---

// Función para el Login
export const loginUser = async (credentials) => {
  try {
    console.log('[API Service Frontend] Calling POST /auth/login');
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error("[API Service Frontend] Login API error:", error.response?.data || error.message);
    throw error.response?.data || new Error('Login failed');
  }
};

// Función para el Signup
export const signupUser = async (userData) => {
  try {
    console.log('[API Service Frontend] Calling POST /auth/signup');
    const response = await apiClient.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    console.error("[API Service Frontend] Signup API error:", error.response?.data || error.message);
    throw error.response?.data || new Error('Signup failed');
  }
};

// Función para obtener el clima de varias ciudades por nombre
export const getCitiesWeather = async (cityNames) => {
  const namesQueryParam = cityNames.join(',');
  try {
    console.log(`[API Service Frontend] Calling GET /weather/cities?names=${namesQueryParam}`);
    const response = await apiClient.get(`/weather/cities?names=${namesQueryParam}`);
    return response.data;
  } catch (error) {
    console.error("[API Service Frontend] Get Cities Weather API error:", error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to fetch cities weather');
  }
};

// Función para obtener el pronóstico de 7 días por coordenadas
// (Esta función devuelve el ARRAY de pronóstico como lo hacía antes)
export const getForecast = async (lat, lon) => {
   if (isNaN(parseFloat(lat)) || isNaN(parseFloat(lon))) {
       console.error("[API Service Frontend] getForecast: Invalid coordinates", { lat, lon });
       throw new Error('Coordenadas inválidas para pronóstico.');
   }
  try {
    console.log(`[API Service Frontend] Calling GET /weather/forecast?lat=${lat}&lon=${lon}`);
    const response = await apiClient.get(`/weather/forecast?lat=${lat}&lon=${lon}`);
    return response.data;
  } catch (error) {
    console.error("[API Service Frontend] Get Forecast API error:", error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to fetch forecast');
  }
};

// Función para obtener detalles COMPLETOS (ubicación + clima actual) por coordenadas
export const getCityDetailsByCoords = async (latitude, longitude) => {
  // Validación básica
  if (isNaN(latitude) || isNaN(longitude)) {
    console.error("[API Service Frontend] getCityDetailsByCoords: Invalid coordinates", { latitude, longitude });
    throw new Error('Coordenadas inválidas.');
  }

  try {
    const endpointPath = `/weather/details-by-coords?lat=${latitude}&lon=${longitude}`;
    console.log(`[API Service Frontend] Calling GET ${endpointPath}`);
    const response = await apiClient.get(endpointPath);
    // Se espera que la respuesta ya venga formateada desde el backend como { location: {...}, current: {...} }
    console.log("[API Service Frontend] Response received from details endpoint:", response.data);
    return response.data;

  } catch (error) {
    console.error(`[API Service Frontend] Get City Details by Coords error (${latitude}, ${longitude}):`, error.response?.data || error.message);
    // Relanzar para que useQuery lo maneje
    throw error.response?.data || new Error('No se pudieron obtener los detalles completos de la ciudad');
  }
};

export default apiClient;
