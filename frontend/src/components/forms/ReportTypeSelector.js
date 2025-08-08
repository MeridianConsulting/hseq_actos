import React from 'react';
import { reportTypes } from '../../config/formOptions';

const ReportTypeSelector = ({ onSelect }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/10">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white">Selecciona el tipo de reporte HSE</h3>
        <p className="text-white text-opacity-80 text-sm mt-1">Elige una categoría para iniciar el registro</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportTypes.map((type) => (
          <div 
            key={type.id}
            onClick={() => onSelect(type.id)}
            className={`bg-gradient-to-br ${type.gradient} hover:${type.hoverGradient} rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl ring-1 ring-white/10`}
          >
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-inner">
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
        ))}
      </div>
    </div>
  );
};

export default ReportTypeSelector; 