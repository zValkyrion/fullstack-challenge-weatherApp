import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, signupUser } from '../services/api';

// 1. Crear el Contexto de Autenticación
const AuthContext = createContext(null);

// 2. Hook Personalizado para consumir el contexto fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Este error ocurre si useAuth se usa fuera de un AuthProvider
    throw new Error('useAuth must be used within an AuthProvider');
  }
  if (context === null) {
    // Este error podría ocurrir si el Provider aún no ha inicializado su valor
    throw new Error('AuthContext is null, check if AuthProvider wraps the component correctly and has initialized');
  }
  return context;
};

// 3. Componente Proveedor del Contexto
export const AuthProvider = ({ children }) => {
  // --- Estados del Contexto ---
  const [user, setUser] = useState(null); // Información del usuario logueado
  const [token, setToken] = useState(() => localStorage.getItem('authToken') || null); // Token JWT
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('authToken')); // Flag booleano
  const [isLoading, setIsLoading] = useState(false); // Feedback de UI durante llamadas API
  const [error, setError] = useState(null); // Mensajes de error de autenticación

  // --- Efecto para Sincronizar con LocalStorage y estado derivado ---
  // Se ejecuta cuando el componente se monta y cada vez que cambia el 'token'
  useEffect(() => {
    if (token) {
      // Si hay token: guardarlo en localStorage, marcar como autenticado
      localStorage.setItem('authToken', token);
      setIsAuthenticated(true);

      // Cargar info del usuario desde localStorage si no está en el estado 'user'
      // (Útil para persistir la sesión al refrescar la página)
      if (!user) {
        const storedUser = localStorage.getItem('authUser');
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            console.error("AuthContext: Failed to parse stored user from localStorage", e);
            localStorage.removeItem('authUser'); // Limpiar si está corrupto
            localStorage.removeItem('authToken'); // Probablemente el token también sea inválido
            setToken(null); // Dispara re-ejecución de este efecto para limpiar estado
          }
        } else {
           // Si hay token pero no datos de usuario, podría ser una sesión antigua
          console.warn("AuthContext: Auth token exists but no user data found in state or localStorage. Session might be incomplete.");
        }
      } else {
        // Si ya tenemos usuario en el estado, nos aseguramos que esté en localStorage
        // Esto mantiene sincronizado el localStorage si 'user' se actualizara por otra vía
         localStorage.setItem('authUser', JSON.stringify(user));
      }
    } else {
      // Si no hay token: limpiar localStorage y resetear estado de autenticación
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [token]);


  // --- Funciones de Autenticación ---

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null); // Limpia errores previos
    try {
      const data = await loginUser({ username, password }); // Llama a la API
      setToken(data.token); // Actualiza el token (dispara useEffect)
      setUser(data.user); // Actualiza la info del usuario
      setIsLoading(false);
      return true; 

    } catch (err) {
      console.error("AuthContext Login error:", err); // Log detallado del error

      // Extrae el mensaje de error de la API o usa fallbacks
      let errorMessage = err.response?.data?.message // 1. Mensaje específico de la API (ej: 401)
                         || err.message              // 2. Mensaje genérico del error (ej: network error)
                         || 'Error al iniciar sesión. Por favor, inténtalo de nuevo.'; // 3. Mensaje de último recurso

      // --- TRADUCCIÓN / MAPEO DE MENSAJES ESPECÍFICOS (LOGIN) ---
      if (errorMessage === 'Invalid credentials') {
           errorMessage = 'Credenciales inválidas. Verifica tu usuario y contraseña.';
      }
      // Añade más 'else if' para otros errores de login si es necesario
      // else if (errorMessage === 'User account locked') {
      //    errorMessage = 'Tu cuenta está bloqueada.';
      // }
      // ---------------------------------------------------------

      console.log("AuthContext Setting login error state to:", errorMessage);
      setError(errorMessage); // Establece el mensaje de error para la UI

      setIsLoading(false);
      // Asegura limpiar el estado local en caso de fallo de login
      setToken(null); // Esto disparará el useEffect para limpiar localStorage y estado
      return false; // Indica fallo
    }
  };

  const signup = async (username, password) => {
    setIsLoading(true);
    setError(null); // Limpia errores previos
    try {
      const data = await signupUser({ username, password }); // Llama a la API
      setToken(data.token); // Actualiza el token (dispara useEffect)
      setUser(data.user); // Actualiza la info del usuario
      setIsLoading(false);
      return true; // Indica éxito

    } catch (err) {
      console.error("AuthContext Signup error:", err); // Log detallado del error

      // Extrae el mensaje de error de la API o usa fallbacks
      let errorMessage = err.response?.data?.message // 1. Mensaje específico de la API (ej: 409)
                         || err.message              // 2. Mensaje genérico del error
                         || 'Error en el registro. Por favor, inténtalo de nuevo.'; // 3. Mensaje de último recurso

      // --- TRADUCCIÓN / MAPEO DE MENSAJES ESPECÍFICOS (SIGNUP) ---
      if (errorMessage === 'Username already taken') {
           errorMessage = 'El nombre de usuario ya existe. Por favor, elige otro.';
      }
      // Añade más 'else if' para otros errores de signup si es necesario
      // else if (errorMessage === 'Password does not meet criteria') {
      //    errorMessage = 'La contraseña no cumple los requisitos de seguridad.';
      // }
      // ----------------------------------------------------------

      console.log("AuthContext Setting signup error state to:", errorMessage);
      setError(errorMessage); // Establece el mensaje de error para la UI

      setIsLoading(false);
      setToken(null); // Esto disparará el useEffect para limpiar localStorage y estado
      return false; // Indica fallo
    }
  };

  const logout = () => {
    console.log("AuthContext: Logging out..."); // Log para depuración
    // Limpiar el token es suficiente, el useEffect se encargará del resto
    setToken(null);
  };

  // Función para limpiar el estado de error manualmente desde los componentes
  const clearError = () => {
    setError(null);
  };

  // 4. Valor que proveerá el contexto a los componentes consumidores
  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    clearError, // Es importante exportar esta función
  };

  // Renderiza el Provider pasando el objeto 'value'
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
