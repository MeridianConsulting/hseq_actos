import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../utils/auth';
import '../assets/css/styles.css';

const SupportDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

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
      // Aquí iría la lógica para cargar reportes del backend
      // Por ahora, datos de ejemplo
      const mockReports = [
        {
          id: 1,
          tipo_evento: 'acto_inseguro',
          ubicacion: 'Oficina 201',
          fecha_evento: '2025-01-15T10:30:00',
          descripcion: 'Empleado no utilizando equipo de protección',
          estado: 'pendiente',
          reportado_por: 'Juan Pérez',
          creado_en: '2025-01-15T10:35:00'
        },
        {
          id: 2,
          tipo_evento: 'condicion_insegura',
          ubicacion: 'Planta de producción',
          fecha_evento: '2025-01-14T14:20:00',
          descripcion: 'Derrame de aceite en el piso',
          estado: 'en revisión',
          reportado_por: 'María García',
          creado_en: '2025-01-14T14:25:00'
        }
      ];
      setReports(mockReports);
    } catch (error) {
      setMessage('Error al cargar reportes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      // Aquí iría la lógica para actualizar el estado del reporte
      setReports(prev => 
        prev.map(report => 
          report.id === reportId ? { ...report, estado: newStatus } : report
        )
      );
      setMessage('Estado del reporte actualizado');
    } catch (error) {
      setMessage('Error al actualizar el estado');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendiente':
        return 'bg-yellow-500';
      case 'en revisión':
        return 'bg-blue-500';
      case 'cerrado':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getEventTypeLabel = (type) => {
    const labels = {
      'acto_inseguro': 'Acto Inseguro',
      'condicion_insegura': 'Condición Insegura',
      'incidente': 'Incidente',
      'casi_accidente': 'Casi Accidente',
      'accidente': 'Accidente'
    };
    return labels[type] || type;
  };

  const filteredReports = reports.filter(report => {
    switch (activeTab) {
      case 'pending':
        return report.estado === 'pendiente';
      case 'in_review':
        return report.estado === 'en revisión';
      case 'closed':
        return report.estado === 'cerrado';
      default:
        return true;
    }
  });

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
                  <p className="text-2xl font-bold text-white">{reports.filter(r => r.estado === 'pendiente').length}</p>
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
                  <p className="text-2xl font-bold text-white">{reports.filter(r => r.estado === 'en revisión').length}</p>
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
                  <p className="text-2xl font-bold text-white">{reports.filter(r => r.estado === 'cerrado').length}</p>
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
                        <p className="text-white text-sm font-semibold">{getEventTypeLabel(report.tipo_evento)}</p>
                        <p className="text-white text-opacity-50 text-xs">{report.ubicacion}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-white text-opacity-90 mb-2">{report.descripcion}</p>
                      <div className="flex justify-between text-sm text-white text-opacity-60">
                        <span>Reportado por: {report.reportado_por}</span>
                        <span>Fecha: {new Date(report.fecha_evento).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      {report.estado === 'pendiente' && (
                        <button
                          onClick={() => handleStatusChange(report.id, 'en revisión')}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                        >
                          Tomar Caso
                        </button>
                      )}
                      {report.estado === 'en revisión' && (
                        <button
                          onClick={() => handleStatusChange(report.id, 'cerrado')}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                        >
                          Cerrar Caso
                        </button>
                      )}
                      <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200">
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
    </div>
  );
};

export default SupportDashboard; 