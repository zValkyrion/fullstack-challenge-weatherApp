// src/components/Input.jsx
import React from 'react';

export const Input = React.forwardRef(({
  type = 'text',
  name,
  id,
  placeholder,
  value,
  onChange,
  disabled = false,
  error = false, // Para indicar estado de error visualmente
  className = '', // Para permitir clases adicionales desde fuera
  ...props // Para pasar cualquier otro prop estándar de input (ej. autoComplete, required)
}, ref) => {

  // --- Estilos Mejorados ---
  const baseStyle = `
    block w-full appearance-none rounded-md border border-gray-300 // Borde explícito
    px-3 py-2 // Padding interno
    text-gray-900 placeholder:text-gray-400 // Color de texto y placeholder
    focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary // Estilo de foco: sin outline, borde y anillo suaves
    transition duration-150 ease-in-out // Transición suave
    text-sm sm:text-base // Tamaño de texto base
    shadow-sm // Sombra sutil
    hover:border-gray-400 // Hover sutil
    disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-70 disabled:hover:border-gray-300 // Estilos deshabilitado
  `;

  // Estilos condicionales para el estado de error (sobrescriben borde/anillo de foco)
  const errorStyle = error
    ? 'border-red-500 text-red-700 focus:border-red-500 focus:ring-red-500 placeholder:text-red-300'
    : 'border-gray-300 focus:border-primary focus:ring-primary';

  // Combinamos los estilos
  const combinedClassName = `${baseStyle} ${error ? errorStyle : ''} ${className}`.trim().replace(/\s+/g, ' '); // Limpia espacios extra

  return (
    <input
      ref={ref} // Reenvía la ref al elemento input real
      type={type}
      name={name}
      id={id || name} // Usa 'name' como fallback para 'id' si no se proporciona
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={combinedClassName} // Aplica las clases combinadas
      {...props} // Pasa props adicionales al input
    />
  );
});

// Añadir un displayName ayuda en las React DevTools
Input.displayName = 'Input';
