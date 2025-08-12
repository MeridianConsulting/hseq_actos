import React, { useState, useEffect } from 'react';
import { getUser } from '../../utils/auth';
import ReportService from '../../services/reportService';
import ReportDetailsModal from '../ReportDetailsModal';

const ReportHistory = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = getUser();
    if (userData) {
      setUser(userData);
      loadUserReports(userData.id);
    }
  }, []);

  const loadUserReports = async (userId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await ReportService.getReportsByUser(userId);
      
      if (result.success) {
        setReports(result.reports);
      } else {
        setError(result.message || 'Error al cargar reportes');
      }
    } catch (error) {
      //
      setError('Error al cargar reportes: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (reportId) => {
    setSelectedReportId(reportId);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedReportId(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendiente':
        return 'bg-yellow-500';
      case 'en_revision':
        return 'bg-blue-500';
      case 'aprobado':
        return 'bg-green-500';
      case 'rechazado':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pendiente':
        return 'Pendiente de Revisión';
      case 'en_revision':
        return 'En Revisión';
      case 'aprobado':
        return 'Aprobado';
      case 'rechazado':
        return 'Rechazado';
      default:
        return status;
    }
  };

  const getEventTypeLabel = (type) => {
    const labels = {
      'hallazgos': 'Hallazgos y Condiciones',
      'incidentes': 'Incidentes HSE',
      'conversaciones': 'Conversaciones y Reflexiones'
    };
    return labels[type] || type;
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'hallazgos':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        );
      case 'incidentes':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
        );
      case 'conversaciones':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const getLocationText = (report) => {
    switch (report.tipo_reporte) {
      case 'hallazgos':
        return report.lugar_hallazgo || report.lugar_hallazgo_otro || 'No especificada';
      case 'incidentes':
        return report.ubicacion_incidente || 'No especificada';
      case 'conversaciones':
        return report.sitio_evento_conversacion || 'No especificada';
      default:
        return 'No especificada';
    }
  };

  const getDescriptionText = (report) => {
    switch (report.tipo_reporte) {
      case 'hallazgos':
        return report.descripcion_hallazgo || report.asunto || 'Sin descripción';
      case 'incidentes':
        return report.descripcion_incidente || report.asunto || 'Sin descripción';
      case 'conversaciones':
        return report.descripcion_conversacion || report.asunto_conversacion || 'Sin descripción';
      default:
        return report.asunto || 'Sin descripción';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const refreshReports = () => {
    if (user?.id) {
      loadUserReports(user.id);
    }
  };

  // Exponer el método de refresh para que el padre pueda llamarlo
  useEffect(() => {
    if (window.reportHistoryRefresh) {
      window.reportHistoryRefresh = refreshReports;
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-6">
          Mis Reportes
        </h3>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white text-opacity-70 mt-4">Cargando tus reportes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-6">
          Mis Reportes
        </h3>
        <div className="text-center py-12">
          <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-4 max-w-md mx-auto">
            <svg className="w-12 h-12 mx-auto text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p className="text-red-300 text-lg mb-2">Error al cargar reportes</p>
            <p className="text-white text-opacity-70">{error}</p>
            <button
              onClick={() => loadUserReports(user?.id)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">
            Mis Reportes
          </h3>
          <div className="text-right">
            <p className="text-white text-opacity-70 text-sm">Total de reportes</p>
            <p className="text-2xl font-bold text-white">{reports.length}</p>
          </div>
        </div>
        
        {reports.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white text-opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <p className="text-white text-opacity-70 text-lg">
              Aún no tienes reportes registrados
            </p>
            <p className="text-white text-opacity-50 text-sm mt-2">
              Tus reportes aparecerán aquí una vez que los envíes
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map(report => (
              <div key={report.id} className="bg-white bg-opacity-5 rounded-xl p-6 border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
                      {getEventTypeIcon(report.tipo_reporte)}
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(report.estado)}`}>
                        {getStatusLabel(report.estado)}
                      </span>
                      <p className="text-white text-sm font-semibold mt-1">
                        {getEventTypeLabel(report.tipo_reporte)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-opacity-50 text-xs">
                      {formatDate(report.creado_en)}
                    </p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-white font-semibold mb-2">
                    {report.asunto || report.asunto_conversacion || 'Sin asunto'}
                  </h4>
                  <p className="text-white text-opacity-90 mb-2 line-clamp-2">
                    {getDescriptionText(report)}
                  </p>
                  <div className="flex justify-between text-sm text-white text-opacity-60">
                    <span>Ubicación: {getLocationText(report)}</span>
                    <span>Fecha evento: {formatDate(report.fecha_evento)}</span>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button 
                    onClick={() => handleViewDetails(report.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    <span>Ver Detalles</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Report Details Modal */}
      <ReportDetailsModal
        isOpen={showDetailsModal}
        onClose={handleCloseDetails}
        reportId={selectedReportId}
      />
    </>
  );
};

export default ReportHistory; 