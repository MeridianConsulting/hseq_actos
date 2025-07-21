import React from 'react';

const ReportHistory = () => {
  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
      <h3 className="text-2xl font-bold text-white mb-6">
        Historial de Reportes
      </h3>
      
      <div className="text-center py-12">
        <svg className="w-16 h-16 mx-auto text-white text-opacity-50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <p className="text-white text-opacity-70 text-lg">
          Aún no tienes reportes registrados
        </p>
        <p className="text-white text-opacity-50 text-sm mt-2">
          Tus reportes aparecerán aquí una vez que los envíes
        </p>
      </div>
    </div>
  );
};

export default ReportHistory; 