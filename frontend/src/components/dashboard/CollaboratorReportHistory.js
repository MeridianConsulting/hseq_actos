import React, { useState, useEffect } from 'react';
import { getUser } from '../../utils/auth';
import ReportService from '../../services/reportService';
import SuccessAnimation from '../SuccessAnimation';
import EditReportModal from '../forms/EditReportModal';

const CollaboratorReportHistory = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
      console.error('Error al cargar reportes del usuario:', error);
      setError('Error al cargar reportes: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditReport = (report) => {
    setSelectedReport(report);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    // Recargar la lista de reportes después de una edición exitosa
    if (user?.id) {
      loadUserReports(user.id);
    }
  };

  const handleDeleteReport = (report) => {
    setSelectedReport(report);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedReport) return;

    setIsDeleting(true);
    try {
      const result = await ReportService.deleteReport(selectedReport.id);
      
      if (result.success) {
        setReports(prev => prev.filter(report => report.id !== selectedReport.id));
        setSuccessMessage('Reporte eliminado exitosamente');
        setShowSuccessAnimation(true);
        setShowDeleteModal(false);
        setSelectedReport(null);
      } else {
        throw new Error(result.message || 'Error al eliminar el reporte');
      }
    } catch (error) {
      console.error('Error al eliminar reporte:', error);
      setError('Error al eliminar el reporte: ' + error.message);
      setShowDeleteModal(false);
      setSelectedReport(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSuccessAnimationComplete = () => {
    setShowSuccessAnimation(false);
    setSuccessMessage('');
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
        return 'Pendiente';
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
      'hallazgos': 'Hallazgos',
      'incidentes': 'Incidentes',
      'conversaciones': 'Conversaciones'
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

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
        
        {/* Información sobre estados */}
        <div className="bg-white bg-opacity-5 rounded-lg p-4 mb-6">
          <p className="text-white text-opacity-80 text-sm">
            <span className="font-semibold">Nota:</span> Solo puedes editar y eliminar reportes con estado "Pendiente". 
            Los reportes en revisión, aprobados o rechazados no pueden ser modificados.
          </p>
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
                    {report.descripcion_hallazgo || report.descripcion_incidente || report.descripcion_conversacion || 'Sin descripción'}
                  </p>
                  <div className="flex justify-between text-sm text-white text-opacity-60">
                    <span>Fecha evento: {formatDate(report.fecha_evento)}</span>
                    {report.evidencias && report.evidencias.length > 0 && (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        {report.evidencias.length} evidencia{report.evidencias.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button 
                    onClick={() => handleEditReport(report)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center space-x-2 ${
                      report.estado === 'pendiente'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    }`}
                    disabled={report.estado !== 'pendiente'}
                    title={report.estado !== 'pendiente' ? 'Solo se pueden editar reportes pendientes' : 'Editar reporte'}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    <span>Editar</span>
                  </button>
                  <button 
                    onClick={() => handleDeleteReport(report)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center space-x-2 ${
                      report.estado === 'pendiente'
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    }`}
                    disabled={report.estado !== 'pendiente'}
                    title={report.estado !== 'pendiente' ? 'Solo se pueden eliminar reportes pendientes' : 'Eliminar reporte'}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl max-w-md w-full shadow-2xl border border-gray-700">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  ¿Eliminar reporte?
                </h3>
                <p className="text-white text-opacity-70">
                  ¿Estás seguro de que quieres eliminar este reporte? Esta acción no se puede deshacer.
                </p>
              </div>
              
              <div className="bg-white bg-opacity-5 rounded-lg p-4 mb-6">
                <p className="text-white font-semibold">
                  {selectedReport.asunto || selectedReport.asunto_conversacion || 'Sin asunto'}
                </p>
                <p className="text-white text-opacity-60 text-sm">
                  {getEventTypeLabel(selectedReport.tipo_reporte)} • {formatDate(selectedReport.creado_en)}
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    isDeleting 
                      ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline"></div>
                      Eliminando...
                    </>
                  ) : (
                    'Eliminar'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Report Modal */}
      <EditReportModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        report={selectedReport}
        onSuccess={handleEditSuccess}
      />

      {/* Success Animation */}
      <SuccessAnimation
        isVisible={showSuccessAnimation}
        onComplete={handleSuccessAnimationComplete}
        message={successMessage}
        showConfetti={true}
        size="medium"
        duration={1000}
        fadeOutDuration={2000}
      />
    </>
  );
};

export default CollaboratorReportHistory; 