// src/components/Button.jsx
import React from 'react';
import { Spinner } from './Spinner'; // Asumimos que crearemos Spinner.jsx

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // primary, secondary, danger, ghost
  size = 'md', // sm, md, lg
  disabled = false,
  isLoading = false,
  iconLeft, // Componente de icono opcional a la izquierda
  iconRight, // Componente de icono opcional a la derecha
  className = '', // Clases adicionales
  ...props
}) => {
  const baseStyle = `
    inline-flex items-center justify-center rounded-md font-semibold
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    transition-colors duration-150 ease-in-out shadow-sm
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantStyles = {
    primary: `bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500`,
    secondary: `bg-gray-200 text-gray-800 hover:bg-gray-300 focus-visible:ring-gray-400`,
    danger: `bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500`,  
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const combinedClassName = `
    ${baseStyle}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${isLoading ? 'cursor-wait' : ''}
    ${className}
  `;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={combinedClassName.trim()}
      {...props}
    >
      {isLoading && <Spinner size="sm" className="mr-2" />}
      {!isLoading && iconLeft && <span className="mr-2 -ml-1 h-4 w-4">{iconLeft}</span>}
      {children}
      {!isLoading && iconRight && <span className="ml-2 -mr-1 h-4 w-4">{iconRight}</span>}
    </button>
  );
};