import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../utils/auth';
import '../assets/css/styles.css';

const CoordinatorDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    en_revision: 0,
    cerrados: 0,
    por_tipo: {}
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const userData = getUser();
    if (userData) {
      setUser(userData);
    }
    setIsVisible(true);
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Datos de ejemplo para demostración
      const mockReports = [
        {
          id: 1,
          tipo_evento: 'acto_inseguro',
          ubicacion: 'Oficina 201',
          fecha_evento: '2025-01-15T10:30:00',
          descripcion: 'Empleado no utilizando equipo de protección',
          estado: 'pendiente',
          reportado_por: 'Juan Pérez',
          asignado_a: 'Soporte Técnico',
          prioridad: 'alta',
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
          asignado_a: 'Soporte Técnico',
          prioridad: 'media',
          creado_en: '2025-01-14T14:25:00'
        },
        {
          id: 3,
          tipo_evento: 'incidente',
          ubicacion: 'Almacén',
          fecha_evento: '2025-01-13T09:15:00',
          descripcion: 'Caída de material desde estantería',
          estado: 'cerrado',
          reportado_por: 'Carlos López',
          asignado_a: 'Soporte Técnico',
          prioridad: 'alta',
          creado_en: '2025-01-13T09:20:00'
        }
      ];
      
      setReports(mockReports);
      
      // Calcular estadísticas
      const statsData = {
        total: mockReports.length,
        pendientes: mockReports.filter(r => r.estado === 'pendiente').length,
        en_revision: mockReports.filter(r => r.estado === 'en revisión').length,
        cerrados: mockReports.filter(r => r.estado === 'cerrado').length,
        por_tipo: mockReports.reduce((acc, report) => {
          acc[report.tipo_evento] = (acc[report.tipo_evento] || 0) + 1;
          return acc;
        }, {})
      };
      
      setStats(statsData);
    } catch (error) {
      setMessage('Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignReport = async (reportId, assignTo) => {
    try {
      setReports(prev => 
        prev.map(report => 
          report.id === reportId ? { ...report, asignado_a: assignTo } : report
        )
      );
      setMessage('Reporte asignado correctamente');
    } catch (error) {
      setMessage('Error al asignar el reporte');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta':
        return 'bg-red-500';
      case 'media':
        return 'bg-yellow-500';
      case 'baja':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
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
                Panel de Coordinación
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
                Supervisa y coordina los reportes de seguridad para garantizar un ambiente de trabajo seguro
              </p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
              <div className="flex items-center">
                <div className="bg-blue-500 p-3 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-white text-opacity-70 text-sm">Total Reportes</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
              <div className="flex items-center">
                <div className="bg-yellow-500 p-3 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-white text-opacity-70 text-sm">Pendientes</p>
                  <p className="text-2xl font-bold text-white">{stats.pendientes}</p>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
              <div className="flex items-center">
                <div className="bg-blue-600 p-3 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-white text-opacity-70 text-sm">En Revisión</p>
                  <p className="text-2xl font-bold text-white">{stats.en_revision}</p>
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
                  <p className="text-2xl font-bold text-white">{stats.cerrados}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 mb-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'overview'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
              }`}
            >
              Resumen
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'reports'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
              }`}
            >
              Gestión de Reportes
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'analytics'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
              }`}
            >
              Analíticas
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className="mb-6 p-4 rounded-lg bg-blue-500 bg-opacity-20 text-blue-100 border border-blue-500">
              {message}
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Reports */}
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Reportes Recientes
                </h3>
                <div className="space-y-4">
                  {reports.slice(0, 3).map(report => (
                    <div key={report.id} className="bg-white bg-opacity-5 rounded-xl p-4 border border-white border-opacity-10">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(report.estado)}`}>
                            {report.estado}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getPriorityColor(report.prioridad)}`}>
                            {report.prioridad}
                          </span>
                        </div>
                        <span className="text-white text-opacity-50 text-xs">
                          #{report.id}
                        </span>
                      </div>
                      <p className="text-white text-sm font-semibold mb-1">{getEventTypeLabel(report.tipo_evento)}</p>
                      <p className="text-white text-opacity-70 text-xs">{report.ubicacion}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Distribution by Type */}
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Distribución por Tipo
                </h3>
                <div className="space-y-4">
                  {Object.entries(stats.por_tipo).map(([tipo, cantidad]) => (
                    <div key={tipo} className="flex items-center justify-between">
                      <span className="text-white text-opacity-90">{getEventTypeLabel(tipo)}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${(cantidad / stats.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-white font-semibold text-sm w-8 text-right">{cantidad}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reports Management Tab */}
          {activeTab === 'reports' && (
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">
                Gestión de Reportes
              </h3>
              
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                  <p className="text-white text-opacity-70 mt-4">Cargando reportes...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map(report => (
                    <div key={report.id} className="bg-white bg-opacity-5 rounded-xl p-6 border border-white border-opacity-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(report.estado)}`}>
                            {report.estado}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getPriorityColor(report.prioridad)}`}>
                            {report.prioridad}
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
                          <span>Asignado a: {report.asignado_a}</span>
                        </div>
                        <div className="flex justify-between text-sm text-white text-opacity-60 mt-1">
                          <span>Fecha: {new Date(report.fecha_evento).toLocaleString()}</span>
                          <span>Creado: {new Date(report.creado_en).toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <select 
                          className="bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                          onChange={(e) => handleAssignReport(report.id, e.target.value)}
                        >
                          <option value="" className="bg-gray-800 text-white">Reasignar a...</option>
                          <option value="Soporte Técnico" className="bg-gray-800 text-white">Soporte Técnico</option>
                          <option value="Especialista Senior" className="bg-gray-800 text-white">Especialista Senior</option>
                          <option value="Equipo de Seguridad" className="bg-gray-800 text-white">Equipo de Seguridad</option>
                        </select>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200">
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">
                Analíticas y Métricas
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Completion Rate */}
                <div className="bg-white bg-opacity-5 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Tasa de Resolución</h4>
                  <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#10B981"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${(stats.cerrados / stats.total) * 251.2} 251.2`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {Math.round((stats.cerrados / stats.total) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Average Response Time */}
                <div className="bg-white bg-opacity-5 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Tiempo Promedio de Respuesta</h4>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">2.3</div>
                    <div className="text-white text-opacity-70">días</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CoordinatorDashboard;