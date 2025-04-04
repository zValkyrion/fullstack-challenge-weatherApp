import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './Button';
import { FiLogOut, FiUser } from 'react-icons/fi';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirige a login después de logout
  };

  return (
    <nav className="bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo o Título */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-primary hover:text-primary-dark transition-colors ">
              WeatherApp
            </Link>
          </div>

          {/* Links de Navegación / Acciones de Usuario */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600 hidden sm:block">
                  Bienvenido, <span className="font-semibold">{user?.username || 'Usuario'}</span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  iconLeft={<FiLogOut />}
                  aria-label="Cerrar sesión"
                >
                   <span className="hidden sm:inline">Logout</span> {/* Texto opcional para pantallas grandes */}
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                   <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/signup">
                   <Button variant="primary" size="sm">Signup</Button>
                </Link>
              </>
            )}
          </div>
          {/* Aquí podrías añadir un botón de menú para móvil si la navbar se vuelve compleja */}
        </div>
      </div>
    </nav>
  );
};