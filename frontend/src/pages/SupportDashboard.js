import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../utils/auth';
import ReportService from '../services/reportService';
import ReportDetailsModal from '../components/ReportDetailsModal';
import '../assets/css/styles.css';
import { gradosCriticidad, tiposAfectacion, reportTypes } from '../config/formOptions';

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
  // Filtros y paginación
  const [filters, setFilters] = useState({
    tipo_reporte: '',
    estado: '',
    grado_criticidad: '',
    tipo_afectacion: '',
    date_from: '',
    date_to: '',
    q: '',
    page: 1,
    per_page: 10,
    sort_by: 'creado_en',
    sort_dir: 'desc'
  });
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    const userData = getUser();
    if (userData) {
      setUser(userData);
    }
    setIsVisible(true);
    // Cargar reportes al inicializar
    loadReports();
  }, []);

  // Recargar cuando cambie pestaña o paginación básica
  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, filters.page, filters.per_page, filters.sort_by, filters.sort_dir]);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      // Armar filtros a enviar; para pestaña 'closed' no filtramos por estado (se filtra local por 2 valores)
      const apiFilters = { ...filters };
      // Reflejar pestañas en filtros de estado solo cuando aplica
      if (activeTab === 'pending') apiFilters.estado = 'pendiente';
      else if (activeTab === 'in_review') apiFilters.estado = 'en_revision';
      else if (activeTab === 'closed') delete apiFilters.estado;

      const result = await ReportService.getAllReports(apiFilters);
      
      if (result.success) {
        setReports(result.reports || []);
        setMeta(result.meta || null);
      } else {
        setMessage('Error al cargar reportes: ' + result.message);
      }
    } catch (error) {
      //
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
      //
      setMessage('Error al actualizar el estado: ' + error.message);
    }
  };

  // Manejadores de filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };
  const handleSearch = (e) => {
    e.preventDefault();
    loadReports();
  };
  const handleReset = () => {
    setFilters({
      tipo_reporte: '', estado: '', grado_criticidad: '', tipo_afectacion: '',
      date_from: '', date_to: '', q: '', page: 1, per_page: 10, sort_by: 'creado_en', sort_dir: 'desc'
    });
    // Vuelve a cargar con filtros limpios
    setTimeout(loadReports, 0);
  };
  const handlePageChange = (nextPage) => {
    if (!meta) return;
    const totalPages = meta.total_pages || 1;
    const page = Math.min(Math.max(1, nextPage), totalPages);
    if (page !== filters.page) {
      setFilters((p) => ({ ...p, page }));
    }
  };
  const handlePerPageChange = (e) => {
    const per = parseInt(e.target.value || '10', 10);
    setFilters((p) => ({ ...p, per_page: per, page: 1 }));
  };

  // Exportación CSV (página actual)
  const exportCsv = () => {
    const rows = filteredReports.map((r) => ({
      id: r.id,
      tipo_reporte: r.tipo_reporte,
      asunto: r.asunto || r.asunto_conversacion || '',
      estado: r.estado,
      fecha_evento: r.fecha_evento || '',
      grado_criticidad: r.grado_criticidad || '',
      tipo_afectacion: r.tipo_afectacion || '',
      nombre_usuario: r.nombre_usuario || '',
      creado_en: r.creado_en
    }));
    const headers = Object.keys(rows[0] || {
      id: '', tipo_reporte: '', asunto: '', estado: '', fecha_evento: '', grado_criticidad: '', tipo_afectacion: '', nombre_usuario: '', creado_en: ''
    });
    const escape = (v) => {
      const s = (v ?? '').toString();
      const needsQuote = /[",\n;]/.test(s);
      const inner = s.replace(/"/g, '""');
      return needsQuote ? `"${inner}"` : inner;
    };
    const csv = [headers.join(','), ...rows.map(row => headers.map(h => escape(row[h])).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reportes_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
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
      <header className="bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white drop-shadow">
                Panel de Soporte
              </h1>
              {user && (
                <span className="ml-4 text-sm bg-white/10 px-3 py-1 rounded-full text-gray-200 border border-gray-600">
                  {user.nombre}
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
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
          <div className="bg-gray-900/80 backdrop-blur-md rounded-3xl p-8 mb-8 shadow-2xl border border-gray-700">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4 drop-shadow">
                ¡Bienvenido, {user?.nombre}!
              </h2>
              <p className="text-gray-200 text-lg">
                Gestiona y revisa los reportes de seguridad para mantener un ambiente de trabajo seguro
              </p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-700">
              <div className="flex items-center">
                <div className="bg-yellow-500 p-3 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-gray-300 text-sm">Pendientes</p>
                  <p className="text-2xl font-bold text-white drop-shadow">{stats.pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-700">
              <div className="flex items-center">
                <div className="bg-blue-500 p-3 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-gray-300 text-sm">En Revisión</p>
                  <p className="text-2xl font-bold text-white drop-shadow">{stats.inReview}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-700">
              <div className="flex items-center">
                <div className="bg-green-500 p-3 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-gray-300 text-sm">Cerrados</p>
                  <p className="text-2xl font-bold text-white drop-shadow">{stats.closed}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-2 mb-8">
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
            <button
              onClick={loadReports}
              className="py-3 px-4 rounded-lg font-semibold bg-gray-800 text-white hover:bg-gray-700"
              title="Refrescar lista"
            >
              Refrescar
            </button>
          </div>

          {/* Filter Bar */}
          <form onSubmit={handleSearch} className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-4 mb-6 grid grid-cols-1 md:grid-cols-6 gap-3 border border-gray-700">
            <div>
              <label className="block text-gray-300 text-xs mb-1">Tipo de reporte</label>
              <select name="tipo_reporte" value={filters.tipo_reporte} onChange={handleFilterChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Todos</option>
                {reportTypes.map(rt => (
                  <option key={rt.id} value={rt.id}>{rt.title.replace(/^\d+\.\s*/,'')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-xs mb-1">Criticidad</label>
              <select name="grado_criticidad" value={filters.grado_criticidad} onChange={handleFilterChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Todas</option>
                {gradosCriticidad.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-xs mb-1">Afectación</label>
              <select name="tipo_afectacion" value={filters.tipo_afectacion} onChange={handleFilterChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Todas</option>
                {tiposAfectacion.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-xs mb-1">Desde</label>
              <input type="date" name="date_from" value={filters.date_from} onChange={handleFilterChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-gray-300 text-xs mb-1">Hasta</label>
              <input type="date" name="date_to" value={filters.date_to} onChange={handleFilterChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-gray-300 text-xs mb-1">Buscar</label>
              <input type="text" name="q" placeholder="Texto libre" value={filters.q} onChange={handleFilterChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-6 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Aplicar</button>
                <button type="button" onClick={handleReset} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">Limpiar</button>
                <button type="button" onClick={exportCsv} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg">Exportar CSV</button>
              </div>
              <div className="flex items-center space-x-2 text-gray-200 text-sm">
                <span>Por página</span>
                <select value={filters.per_page} onChange={handlePerPageChange} className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {[10,20,50,100].map(n => (<option key={n} value={n}>{n}</option>))}
                </select>
              </div>
            </div>
          </form>

          {/* Message */}
          {message && (
            <div className="mb-6 p-4 rounded-lg bg-blue-500 bg-opacity-20 text-blue-100 border border-blue-500">
              {message}
            </div>
          )}

          {/* Reports List */}
          <div className="bg-gray-900/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-gray-700">
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
                  <div key={report.id} className="bg-gray-800/90 rounded-xl p-6 border border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(report.estado)} drop-shadow`}>
                          {report.estado}
                        </span>
                        <span className="text-gray-300 text-sm">
                          ID: {report.id}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-sm font-semibold drop-shadow">{getEventTypeLabel(report.tipo_reporte)}</p>
                        <p className="text-gray-400 text-xs">{getLocationText(report)}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-200 mb-2 leading-relaxed">{getDescriptionText(report)}</p>
                      <div className="flex justify-between text-sm text-gray-300">
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
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                      >
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Paginación */}
            {meta && meta.total_pages > 1 && (
              <div className="flex items-center justify-between mt-6 text-gray-200">
                <button disabled={filters.page <= 1} onClick={() => handlePageChange(filters.page - 1)} className={`px-4 py-2 rounded ${filters.page <= 1 ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'}`}>
                  Anterior
                </button>
                <div>
                  Página {meta.page} de {meta.total_pages} • Total: {meta.total}
                </div>
                <button disabled={meta.page >= meta.total_pages} onClick={() => handlePageChange(filters.page + 1)} className={`px-4 py-2 rounded ${meta.page >= meta.total_pages ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'}`}>
                  Siguiente
                </button>
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