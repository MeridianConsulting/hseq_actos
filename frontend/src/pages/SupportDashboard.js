import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../utils/auth';
import ReportService from '../services/reportService';
import ReportDetailsModal from '../components/ReportDetailsModal';
import '../assets/css/styles.css';

const SupportDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const userData = getUser();
    if (userData) {
      setUser(userData);
    }
    setIsVisible(true);
    // Cargar reportes al inicializar
    loadReports();
  }, []);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      // Cargar todos los reportes desde el backend
      const result = await ReportService.getAllReports();
      
      if (result.success) {
        setReports(result.reports);
      } else {
        setMessage('Error al cargar reportes: ' + result.message);
      }
    } catch (error) {
      console.error('Error al cargar reportes:', error);
      setMessage('Error al cargar reportes: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      // Actualizar estado del reporte usando el servicio
      const result = await ReportService.updateReportStatus(
        reportId, 
        newStatus, 
        user?.id, 
        `Estado cambiado a ${newStatus} por ${user?.nombre}`
      );
      
      if (result.success) {
        // Actualizar el estado local
        setReports(prev => 
          prev.map(report => 
            report.id === reportId ? { ...report, estado: newStatus } : report
          )
        );
        setMessage('Estado del reporte actualizado exitosamente');
        
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error al actualizar el estado: ' + result.message);
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      setMessage('Error al actualizar el estado: ' + error.message);
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

  const handleLogout = () => {
    logout();
    navigate('/');
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

  const getEventTypeLabel = (type) => {
    const labels = {
      'hallazgos': 'Hallazgos',
      'incidentes': 'Incidentes',
      'conversaciones': 'Conversaciones'
    };
    return labels[type] || type;
  };

  const getLocationText = (report) => {
    // Obtener la ubicación según el tipo de reporte
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
    // Obtener la descripción según el tipo de reporte
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

  const filteredReports = reports.filter(report => {
    switch (activeTab) {
      case 'pending':
        return report.estado === 'pendiente';
      case 'in_review':
        return report.estado === 'en_revision';
      case 'closed':
        return report.estado === 'aprobado' || report.estado === 'rechazado';
      default:
        return true;
    }
  });

  // Calcular estadísticas
  const stats = {
    pending: reports.filter(r => r.estado === 'pendiente').length,
    inReview: reports.filter(r => r.estado === 'en_revision').length,
    closed: reports.filter(r => r.estado === 'aprobado' || r.estado === 'rechazado').length
  };

  return (
    <div className="min-h-screen" style={{
      background: `linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 35%, var(--color-tertiary-dark) 100%)`
    }}>
      {/* Header */}
      <header className="bg-white bg-opacity-10 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">
                Panel de Soporte
              </h1>
              {user && (
                <span className="ml-4 text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full text-white">
                  {user.nombre}
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Welcome Card */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 mb-8 shadow-2xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                ¡Bienvenido, {user?.nombre}!
              </h2>
              <p className="text-white text-opacity-90 text-lg">
                Gestiona y revisa los reportes de seguridad para mantener un ambiente de trabajo seguro
              </p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
              <div className="flex items-center">
                <div className="bg-yellow-500 p-3 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-white text-opacity-70 text-sm">Pendientes</p>
                  <p className="text-2xl font-bold text-white">{stats.pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
              <div className="flex items-center">
                <div className="bg-blue-500 p-3 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-white text-opacity-70 text-sm">En Revisión</p>
                  <p className="text-2xl font-bold text-white">{stats.inReview}</p>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
              <div className="flex items-center">
                <div className="bg-green-500 p-3 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-white text-opacity-70 text-sm">Cerrados</p>
                  <p className="text-2xl font-bold text-white">{stats.closed}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 mb-8">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'pending'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setActiveTab('in_review')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'in_review'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
              }`}
            >
              En Revisión
            </button>
            <button
              onClick={() => setActiveTab('closed')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'closed'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
              }`}
            >
              Cerrados
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className="mb-6 p-4 rounded-lg bg-blue-500 bg-opacity-20 text-blue-100 border border-blue-500">
              {message}
            </div>
          )}

          {/* Reports List */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">
              Reportes {activeTab === 'pending' ? 'Pendientes' : activeTab === 'in_review' ? 'En Revisión' : 'Cerrados'}
            </h3>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                <p className="text-white text-opacity-70 mt-4">Cargando reportes...</p>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-white text-opacity-50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <p className="text-white text-opacity-70 text-lg">
                  No hay reportes en esta categoría
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReports.map(report => (
                  <div key={report.id} className="bg-white bg-opacity-5 rounded-xl p-6 border border-white border-opacity-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(report.estado)}`}>
                          {report.estado}
                        </span>
                        <span className="text-white text-opacity-70 text-sm">
                          ID: {report.id}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-sm font-semibold">{getEventTypeLabel(report.tipo_reporte)}</p>
                        <p className="text-white text-opacity-50 text-xs">{getLocationText(report)}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-white text-opacity-90 mb-2">{getDescriptionText(report)}</p>
                      <div className="flex justify-between text-sm text-white text-opacity-60">
                        <span>Reportado por: {report.nombre_usuario}</span>
                        <span>Fecha: {new Date(report.fecha_evento || report.creado_en).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      {report.estado === 'pendiente' && (
                        <button
                          onClick={() => handleStatusChange(report.id, 'en_revision')}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                        >
                          Tomar Caso
                        </button>
                      )}
                      {report.estado === 'en_revision' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(report.id, 'aprobado')}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                          >
                            Aprobar
                          </button>
                          <button
                            onClick={() => handleStatusChange(report.id, 'rechazado')}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                          >
                            Rechazar
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleViewDetails(report.id)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                      >
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Report Details Modal */}
      <ReportDetailsModal
        isOpen={showDetailsModal}
        onClose={handleCloseDetails}
        reportId={selectedReportId}
      />
    </div>
  );
};

export default SupportDashboard; 