import React from 'react';

/**
 * Componente de tarjeta para selección de tipo de reporte
 */
const ReportTypeCard = ({ type, onSelect, isSelected = false }) => {
    return (
        <div 
            onClick={() => onSelect(type.id)}
            className={`bg-gradient-to-br ${type.gradient} hover:${type.hoverGradient} rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                isSelected ? 'ring-4 ring-white ring-opacity-50' : ''
            }`}
            role="button"
            tabIndex={0}
            aria-label={`Seleccionar ${type.title}`}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(type.id);
                }
            }}
        >
            <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={type.icon}/>
                    </svg>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{type.title}</h4>
                <p className="text-white text-opacity-90 text-sm">
                    {type.description}
                </p>
            </div>
        </div>
    );
};

export default ReportTypeCard; 