import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Alert } from '../components/Alert';
import toast from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export const LoginPage = () => {
  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Auth context
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log("LoginPage: User already authenticated, redirecting...");
      navigate('/');
    }
    
    return () => {
      if (error) {
        clearError();
      }
    };
  }, [isAuthenticated, navigate, clearError, error]);

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("LoginPage: Attempting login...");
    const success = await login(username, password);

    if (success) {
      console.log("LoginPage: Login successful.");
      toast.success('¡Inicio de sesión exitoso!');
      navigate('/');
    } else {
      console.log("LoginPage: Login failed. Error should be displayed.");
    }
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with visual accent */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 h-2" />
          
          <div className="px-6 py-8 sm:p-10">
            {/* Logo placeholder - replace with your actual logo */}
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-sun h-12 w-12 text-primary animate-float"><path d="M12 2v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="M20 12h2"></path><path d="m19.07 4.93-1.41 1.41"></path><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"></path><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"></path></svg>
              </div>
            </div>
            
            <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
              Reservamos
            </h2>

            <h2 className="text-center text-2xl font-extrabold text-gray-700 mb-2">
              Weather App
            </h2>

            <p className="text-center text-sm text-gray-600 mb-8">
              Inicia sesión en tu cuenta para continuar
            </p>

            {/* Error alert */}
            {error && (
              <Alert
                type="error"
                message={error}
                onDismiss={clearError}
                className="mb-6"
              />
            )}

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Username field with icon */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="username-login"
                  name="username"
                  type="text"
                  required
                  className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              {/* Password field with toggle visibility */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password-login"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login button */}
              <Button
                type="submit"
                variant="primary"
                className="w-full py-3 rounded-lg text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 transition-colors shadow-md"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Ingresando...' : 'Iniciar sesión'}
              </Button>
            </form>
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-center">
            <p className="text-sm text-gray-600">
              ¿Aún no tienes cuenta?{' '}
              <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};