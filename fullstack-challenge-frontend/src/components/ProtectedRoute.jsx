// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Spinner } from './Spinner';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

   if (isLoading) {
       return (
          <div className="flex justify-center items-center h-screen">
               <Spinner size="lg" />
           </div>
       );
    }

  if (!isAuthenticated) {
    // Redirige a login, guardando la ubicación a la que intentaba ir
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si está autenticado, renderiza el componente hijo
  return children;
};