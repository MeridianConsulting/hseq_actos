import React from 'react';

/**
 * Componente de cabecera para formularios
 */
const FormHeader = ({ title, onBack, subtitle }) => {
    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <h3 className="text-2xl font-bold text-white">
                    {title}
                </h3>
                {subtitle && (
                    <p className="text-gray-300 text-sm mt-1">
                        {subtitle}
                    </p>
                )}
            </div>
            {onBack && (
                <button
                    onClick={onBack}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                    aria-label="Volver"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                    </svg>
                    <span>Volver</span>
                </button>
            )}
        </div>
    );
};

export default FormHeader; 