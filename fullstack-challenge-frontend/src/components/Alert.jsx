import React from 'react';
import { FiAlertCircle, FiCheckCircle, FiX } from 'react-icons/fi';

export const Alert = ({
    type = 'error', // 'error', 'success', 'warning', 'info'
    title,
    message,
    onDismiss, // Función opcional para cerrar la alerta
    className = '',
}) => {
    const baseStyle = `p-4 rounded-md border`;
    const typeStyles = {
        error: 'bg-red-50 border-red-200 text-red-800',
        success: 'bg-green-50 border-green-200 text-green-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
    };
    const icons = {
        error: <FiAlertCircle className="h-5 w-5" aria-hidden="true" />,
        success: <FiCheckCircle className="h-5 w-5" aria-hidden="true" />,
        warning: <FiAlertCircle className="h-5 w-5" aria-hidden="true" />, 
        info: <FiAlertCircle className="h-5 w-5" aria-hidden="true" />, 
    };

    return (
        <div className={`${baseStyle} ${typeStyles[type]} ${className}`.trim()} role="alert">
            <div className="flex">
                <div className="flex-shrink-0">{icons[type]}</div>
                <div className="ml-3">
                    {title && <h3 className="text-sm font-medium">{title}</h3>}
                    {message && <div className={`text-sm ${title ? 'mt-1' : ''}`}>{message}</div>}
                </div>
                {onDismiss && (
                    <div className="ml-auto pl-3">
                        <div className="-mx-1.5 -my-1.5">
                            <button
                                type="button"
                                onClick={onDismiss}
                                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2
                                    ${type === 'error' ? 'text-red-500 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50' : ''}
                                    ${type === 'success' ? 'text-green-500 hover:bg-green-100 focus:ring-green-600 focus:ring-offset-green-50' : ''}
                                    ${type === 'warning' ? 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600 focus:ring-offset-yellow-50' : ''}
                                    ${type === 'info' ? 'text-blue-500 hover:bg-blue-100 focus:ring-blue-600 focus:ring-offset-blue-50' : ''}
                                `}
                            >
                                <span className="sr-only">Dismiss</span>
                                <FiX className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};