import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Alert } from '../components/Alert';
import toast from 'react-hot-toast';
import { 
  UserIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon, // Asumiendo v2 de Heroicons
  ShieldCheckIcon, 
  CheckIcon,
  XMarkIcon // Asumiendo v2 de Heroicons para el error de coincidencia
} from '@heroicons/react/24/outline';


// Validación de contraseña (sin cambios)
const validatePassword = (password) => {
  const errors = {
    minLength: password.length < 8,
    uppercase: !/[A-Z]/.test(password),
    lowercase: !/[a-z]/.test(password),
    number: !/[0-9]/.test(password),
  };
  const isValid = Object.values(errors).every(error => !error);
  return { errors, isValid };
};

export const SignupPage = () => {
  // Estados (sin cambios)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordValidation, setPasswordValidation] = useState({
    errors: { minLength: true, uppercase: true, lowercase: true, number: true },
    isValid: false,
  });
  const [passwordTouched, setPasswordTouched] = useState(false);
  const { signup, isLoading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // useEffects (sin cambios)
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    return () => {
      if (error) {
        clearError();
      }
    };
  }, [isAuthenticated, navigate, clearError, error]);

  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    if (passwordTouched) {
      const validationResult = validatePassword(password);
      setPasswordValidation(validationResult);
    }
  }, [password, passwordTouched]);

  // Handlers (sin cambios)
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (!passwordTouched) {
      setPasswordTouched(true);
    }
    if (confirmPassword) {
      setPasswordsMatch(e.target.value === confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordsMatch(password === e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    if (!passwordValidation.isValid) {
      toast.error('La contraseña no cumple con los requisitos de seguridad.');
      setPasswordTouched(true); return;
    }
    if (!passwordsMatch) {
      toast.error('Las contraseñas no coinciden.'); return;
    }
    const success = await signup(username, password);
    if (success) {
      toast.success('¡Registro exitoso! Ahora puedes iniciar sesión.');
      navigate('/login');
    }
  };

  // Requisitos de contraseña (sin cambios)
  const passwordRequirements = [
    { key: 'minLength', label: 'Mínimo 8 caracteres' },
    { key: 'uppercase', label: 'Al menos una letra mayúscula (A-Z)' },
    { key: 'lowercase', label: 'Al menos una letra minúscula (a-z)' },
    { key: 'number', label: 'Al menos un número (0-9)' },
  ];

  return (
    <div className="flex items-center justify-center bg-gradient-to-br px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 h-2" />
          
          {/* Contenido de la tarjeta: reducido px-6 py-8 sm:p-10 a px-6 py-6 sm:px-8 sm:py-8 */}
          <div className="px-6 py-6 sm:px-8 sm:py-8">
            {/* Header: reducidos márgenes mb-* */}
            <div className="flex justify-center mb-4"> {/* mb-6 a mb-4 */}
              <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                <ShieldCheckIcon className="h-10 w-10 text-indigo-600" />
              </div>
            </div>
            
            <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-1"> {/* mb-2 a mb-1 */}
              Crea tu cuenta
            </h2>
            <p className="text-center text-sm text-gray-600 mb-5"> {/* mb-8 a mb-5 */}
              Únete a nosotros en solo unos pasos
            </p>

            {/* Alerta: reducido mb-6 a mb-4 */}
            {error && (
              <Alert
                type="error"
                message={error}
                onDismiss={clearError}
                className="mb-4" // mb-6 a mb-4
              />
            )}

            {/* Formulario: reducido space-y-6 a space-y-4 */}
            <form className="space-y-4" onSubmit={handleSubmit}> {/* space-y-6 a space-y-4 */}
              {/* Campo Username (sin cambios verticales) */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="username-signup" name="username" type="text" required
                  className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Nombre de usuario"
                  value={username} onChange={(e) => setUsername(e.target.value)} disabled={isLoading}
                />
              </div>
              
              {/* Campo Password (sin cambios verticales) */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password-signup" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" required
                  className={`pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${passwordTouched && !passwordValidation.isValid ? 'border-red-300' : ''}`}
                  placeholder="Contraseña"
                  value={password} onChange={handlePasswordChange} onBlur={() => { if(password) setPasswordTouched(true); }} disabled={isLoading} error={passwordTouched && !passwordValidation.isValid}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Requisitos Password: reducido py-3 a py-2, mb-2 a mb-1, space-y-1 a space-y-0.5 */}
              <div className={`rounded-lg bg-gray-50 px-4 py-2 border ${passwordTouched ? (passwordValidation.isValid ? 'border-green-200' : 'border-red-200') : 'border-gray-200'}`}> {/* py-3 a py-2 */}
                <h4 className="text-sm font-medium text-gray-700 mb-1">Requisitos de seguridad:</h4> {/* mb-2 a mb-1 */}
                <ul className="space-y-0.5"> {/* space-y-1 a space-y-0.5 */}
                  {passwordRequirements.map(({ key, label }) => (
                    <li key={key} className="flex items-center text-sm">
                      {passwordTouched && !passwordValidation.errors[key] ? (
                        <CheckIcon className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" /> // Added flex-shrink-0
                      ) : (
                        <div className="h-4 w-4 mr-2 flex-shrink-0" /> // Added flex-shrink-0
                      )}
                      <span className={`${passwordTouched && !passwordValidation.errors[key] ? 'text-green-700' : 'text-gray-600'}`}>
                        {label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Confirmar Password (sin cambios verticales) */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="confirm-password-signup" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" required
                  className={`pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${!passwordsMatch && confirmPassword !== '' ? 'border-red-300' : ''}`}
                  placeholder="Confirmar Contraseña"
                  value={confirmPassword} onChange={handleConfirmPasswordChange} disabled={isLoading} error={!passwordsMatch && confirmPassword !== ''}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                    {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Mensaje Error Coincidencia (sin cambios verticales, pero usa XMarkIcon) */}
              {!passwordsMatch && confirmPassword !== '' && (
                <div className="flex items-center text-sm text-red-600">
                   {/* Usa el icono importado XMarkIcon (o el que corresponda a XIcon en tu versión) */}
                  <XMarkIcon className="h-4 w-4 mr-1" />
                  Las contraseñas no coinciden.
                </div>
              )}

              {/* Botón Sign up: reducido py-3 a py-2.5 */}
              <Button
                type="submit"
                variant="primary"
                className="w-full py-2.5 rounded-lg text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 transition-colors shadow-md" // py-3 a py-2.5
                isLoading={isLoading}
                disabled={isLoading || !passwordsMatch || password === '' || (passwordTouched && !passwordValidation.isValid)}
              >
                {isLoading ? 'Registrando...' : 'Crear cuenta'}
              </Button>
            </form>
          </div>
          
          {/* Footer: reducido py-4 a py-3 */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-center"> {/* py-4 a py-3 */}
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};