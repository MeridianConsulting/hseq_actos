import React, { useState, useEffect, useCallback } from 'react';
import ReportService from '../services/reportService';
import ReportDetailsModal from './ReportDetailsModal';
import ApprovalModal from './ApprovalModal';
import { buildApi, buildUploadsUrl } from '../config/api';
import { gradosCriticidad, tiposAfectacion, reportTypes } from '../config/formOptions';
import { reportService, userService } from '../services/api';

const ReportsTable = ({ 
  user, 
  showStatusActions = true, 
  onStatusChange, 
  containerClassName = "",
  title = "Reportes",
  useDarkTheme = true
}) => {
  const [activeTab, setActiveTab] = useState('pending');
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedReportForApproval, setSelectedReportForApproval] = useState(null);
  
  // Filtros y paginación
  const [filters, setFilters] = useState({
    tipo_reporte: '',
    estado: '',
    grado_criticidad: '',
    tipo_afectacion: '',
    proyecto: '',
    date_from: '',
    date_to: '',
    q: '',
    page: 1,
    per_page: 10,
    sort_by: 'creado_en',
    sort_dir: 'desc'
  });
  const [meta, setMeta] = useState(null);
  const [allReports, setAllReports] = useState([]); // Para estadísticas
  const [proyectos, setProyectos] = useState([]); // Lista de proyectos únicos

  // Cargar estadísticas (todos los reportes)
  const loadStats = async () => {
    try {
      const statsResult = await ReportService.getAllReports({
        per_page: 1000, // Cargar muchos reportes para estadísticas
        page: 1
      });
      
      if (statsResult.success) {
        setAllReports(statsResult.reports || []);
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  // Cargar todos los proyectos desde la base de datos
  const loadProyectos = async () => {
    try {
      console.log('Cargando proyectos desde la base de datos...');
      const usersResult = await userService.fetchUsers();
      
      console.log('Respuesta completa de userService.fetchUsers():', usersResult);
      
      // Intentar diferentes estructuras de respuesta
      let users = [];
      if (usersResult.success && usersResult.data) {
        users = usersResult.data;
      } else if (usersResult.success && usersResult.users) {
        users = usersResult.users;
      } else if (Array.isArray(usersResult)) {
        users = usersResult;
      } else if (usersResult.data) {
        users = usersResult.data;
      }
      
      console.log('Usuarios extraídos:', users.length);
      
      // Extraer proyectos únicos de todos los usuarios
      const proyectosUnicos = new Set();
      users.forEach((user, index) => {
        console.log(`Usuario ${index + 1}:`, user.nombre, 'Proyecto:', user.Proyecto);
        if (user.Proyecto && user.Proyecto.trim() !== '') {
          proyectosUnicos.add(user.Proyecto.trim());
        }
      });
      const proyectosArray = Array.from(proyectosUnicos).sort();
      console.log('Proyectos encontrados:', proyectosArray);
      setProyectos(proyectosArray);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
    }
  };

  const loadReports = useCallback(async () => {
    setIsLoading(true);
    try {
      // Cargar reportes con filtros aplicados pero sin filtrar por estado
      const apiFilters = { ...filters };
      // Solo aplicar filtro de estado si no es 'closed' (que incluye aprobado y rechazado)
      if (activeTab === 'pending') apiFilters.estado = 'pendiente';
      else if (activeTab === 'in_review') apiFilters.estado = 'en_revision';
      else if (activeTab === 'closed') {
        // Para cerrados, cargar tanto aprobados como rechazados
        delete apiFilters.estado;
      }

      const result = await ReportService.getAllReports(apiFilters);
      
      if (result.success) {
        setReports(result.reports || []);
        setMeta(result.meta || null);
      } else {
        setMessage('Error al cargar reportes: ' + result.message);
      }
    } catch (error) {
      setMessage('Error al cargar reportes: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, [filters, activeTab]);

  useEffect(() => {
    // Cargar estadísticas, proyectos y reportes al inicializar
    loadStats();
    loadProyectos();
    loadReports();
  }, [loadReports]);

  // Recargar cuando cambie pestaña o paginación básica
  useEffect(() => {
    loadReports();
  }, [activeTab, filters.page, filters.per_page, filters.sort_by, filters.sort_dir, loadReports]);

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
        
        // Actualizar estadísticas después de cambiar estado
        loadStats();
        
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => setMessage(''), 3000);
        
        // Llamar callback si existe
        if (onStatusChange) {
          onStatusChange(reportId, newStatus);
        }
      } else {
        setMessage('Error al actualizar el estado: ' + result.message);
      }
    } catch (error) {
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
      creado_en: r.creado_en,
      num_evidencias: r.evidencias ? r.evidencias.length : 0,
      evidencias: r.evidencias ? r.evidencias.map(e => e.url_archivo || 'Sin nombre').join('; ') : ''
    }));
    const headers = Object.keys(rows[0] || {
      id: '', tipo_reporte: '', asunto: '', estado: '', fecha_evento: '', grado_criticidad: '', tipo_afectacion: '', nombre_usuario: '', creado_en: '', num_evidencias: '', evidencias: ''
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

  const handleOpenApprovalModal = (report) => {
    setSelectedReportForApproval(report);
    setShowApprovalModal(true);
  };

  const handleCloseApprovalModal = () => {
    setShowApprovalModal(false);
    setSelectedReportForApproval(null);
  };

  const handleApproveWithModal = async (reportId, motivoAprobacion) => {
    try {
      // Update the report status to 'aprobado' (approved/closed)
      const result = await ReportService.updateReportStatus(
        reportId, 
        'aprobado', 
        user?.id, 
        `Caso aprobado por ${user?.nombre}. Motivo: ${motivoAprobacion}`
      );
      
      if (result.success) {
        // Update local state
        setReports(prev => 
          prev.map(report => 
            report.id === reportId ? { ...report, estado: 'aprobado' } : report
          )
        );
        setMessage('Reporte aprobado y cerrado exitosamente');
        
        // Update statistics
        loadStats();
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
        
        // Call callback if exists
        if (onStatusChange) {
          onStatusChange(reportId, 'aprobado');
        }
      } else {
        throw new Error(result.message || 'Error al aprobar el reporte');
      }
    } catch (error) {
      throw new Error('Error al aprobar el reporte: ' + error.message);
    }
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

  // Filtrar reportes por la pestaña activa
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

  // Calcular estadísticas basadas en todos los reportes
  const stats = {
    pending: allReports.filter(r => r.estado === 'pendiente').length,
    inReview: allReports.filter(r => r.estado === 'en_revision').length,
    closed: allReports.filter(r => r.estado === 'aprobado' || r.estado === 'rechazado').length
  };

  return (
    <div className={containerClassName}>
             {/* Statistics Cards */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                 <div 
           className={`backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-xl border ${
             useDarkTheme 
               ? 'bg-gray-900/80 border-gray-700' 
               : 'bg-white/10 border-white/20'
           }`}
         >
           <div className="flex items-center">
             <div className="bg-yellow-500 p-2 sm:p-3 rounded-full">
               <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
               </svg>
             </div>
             <div className="ml-3 sm:ml-4">
               <p className={`text-xs sm:text-sm ${useDarkTheme ? 'text-gray-300' : 'text-white/70'}`}>Pendientes</p>
               <p className={`text-xl sm:text-2xl font-bold drop-shadow ${useDarkTheme ? 'text-white' : 'text-white'}`}>{stats.pending}</p>
             </div>
           </div>
         </div>

                 <div 
           className={`backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-xl border ${
             useDarkTheme 
               ? 'bg-gray-900/80 border-gray-700' 
               : 'bg-white/10 border-white/20'
           }`}
         >
           <div className="flex items-center">
             <div className="bg-blue-500 p-2 sm:p-3 rounded-full">
               <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
               </svg>
             </div>
             <div className="ml-3 sm:ml-4">
               <p className={`text-xs sm:text-sm ${useDarkTheme ? 'text-gray-300' : 'text-white/70'}`}>En Revisión</p>
               <p className={`text-xl sm:text-2xl font-bold drop-shadow ${useDarkTheme ? 'text-white' : 'text-white'}`}>{stats.inReview}</p>
             </div>
           </div>
         </div>

                 <div 
           className={`backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-xl border ${
             useDarkTheme 
               ? 'bg-gray-900/80 border-gray-700' 
               : 'bg-white/10 border-white/20'
           }`}
         >
           <div className="flex items-center">
             <div className="bg-green-500 p-2 sm:p-3 rounded-full">
               <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
               </svg>
             </div>
             <div className="ml-3 sm:ml-4">
               <p className={`text-xs sm:text-sm ${useDarkTheme ? 'text-gray-300' : 'text-white/70'}`}>Cerrados</p>
               <p className={`text-xl sm:text-2xl font-bold drop-shadow ${useDarkTheme ? 'text-white' : 'text-white'}`}>{stats.closed}</p>
             </div>
           </div>
         </div>
      </div>

             {/* Navigation Tabs */}
       <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:space-x-2 mb-8">
                 <button
           onClick={() => setActiveTab('pending')}
           className={`flex-1 py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
             activeTab === 'pending'
               ? useDarkTheme 
                 ? 'bg-white text-blue-600 shadow-lg'
                 : 'bg-white/20 text-white shadow-lg'
               : useDarkTheme
                 ? 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
                 : 'bg-white/10 text-white hover:bg-white/20'
           }`}
         >
           Pendientes
         </button>
                 <button
           onClick={() => setActiveTab('in_review')}
           className={`flex-1 py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
             activeTab === 'in_review'
               ? useDarkTheme 
                 ? 'bg-white text-blue-600 shadow-lg'
                 : 'bg-white/20 text-white shadow-lg'
               : useDarkTheme
                 ? 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
                 : 'bg-white/10 text-white hover:bg-white/20'
           }`}
         >
           En Revisión
         </button>
                 <button
           onClick={() => setActiveTab('closed')}
           className={`flex-1 py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
             activeTab === 'closed'
               ? useDarkTheme 
                 ? 'bg-white text-blue-600 shadow-lg'
                 : 'bg-white/20 text-white shadow-lg'
               : useDarkTheme
                 ? 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
                 : 'bg-white/10 text-white hover:bg-white/20'
           }`}
         >
           Cerrados
         </button>
                 <button
           onClick={() => { loadStats(); loadProyectos(); loadReports(); }}
           className={`py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-semibold text-sm sm:text-base transition-colors duration-200 ${
             useDarkTheme 
               ? 'bg-gray-800 text-white hover:bg-gray-700'
               : 'bg-white/15 text-white hover:bg-white/25'
           }`}
           title="Refrescar lista y estadísticas"
         >
           Refrescar
         </button>
      </div>

             {/* Filter Bar */}
       <form onSubmit={handleSearch} className={`filter-bar backdrop-blur-md rounded-2xl p-4 mb-6 border ${
         useDarkTheme 
           ? 'bg-gray-900/80 border-gray-700' 
           : 'bg-white/10 border-white/20'
       }`}>
         {/* Filter Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3 mb-4">
         <div>
           <label className={`block text-xs mb-1 font-medium ${useDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Tipo de reporte</label>
           <select name="tipo_reporte" value={filters.tipo_reporte} onChange={handleFilterChange} className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
             useDarkTheme 
               ? 'bg-gray-800 border-gray-600 text-gray-100' 
               : 'bg-white border-gray-300 text-gray-900'
           }`}>
            <option value="">Todos</option>
            {reportTypes.map(rt => (
              <option key={rt.id} value={rt.id}>{rt.title.replace(/^\d+\.\s*/,'')}</option>
            ))}
          </select>
        </div>
                 <div>
           <label className={`block text-xs mb-1 font-medium ${useDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Criticidad</label>
           <select name="grado_criticidad" value={filters.grado_criticidad} onChange={handleFilterChange} className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
             useDarkTheme 
               ? 'bg-gray-800 border-gray-600 text-gray-100' 
               : 'bg-white border-gray-300 text-gray-900'
           }`}>
            <option value="">Todas</option>
            {gradosCriticidad.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
          </select>
        </div>
                 <div>
           <label className={`block text-xs mb-1 font-medium ${useDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Afectación</label>
           <select name="tipo_afectacion" value={filters.tipo_afectacion} onChange={handleFilterChange} className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
             useDarkTheme 
               ? 'bg-gray-800 border-gray-600 text-gray-100' 
               : 'bg-white border-gray-300 text-gray-900'
           }`}>
            <option value="">Todas</option>
            {tiposAfectacion.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
          </select>
        </div>
                 <div>
           <label className={`block text-xs mb-1 font-medium ${useDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Proyecto</label>
           <select name="proyecto" value={filters.proyecto} onChange={handleFilterChange} className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
             useDarkTheme 
               ? 'bg-gray-800 border-gray-600 text-gray-100' 
               : 'bg-white border-gray-300 text-gray-900'
           }`}>
            <option value="">Todos</option>
            {proyectos.map(proyecto => (
              <option key={proyecto} value={proyecto}>{proyecto}</option>
            ))}
          </select>
        </div>
                 <div>
           <label className={`block text-xs mb-1 font-medium ${useDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Desde</label>
           <input type="date" name="date_from" value={filters.date_from} onChange={handleFilterChange} className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
             useDarkTheme 
               ? 'bg-gray-800 border-gray-600 text-gray-100' 
               : 'bg-white border-gray-300 text-gray-900'
           }`} />
        </div>
                 <div>
           <label className={`block text-xs mb-1 font-medium ${useDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Hasta</label>
           <input type="date" name="date_to" value={filters.date_to} onChange={handleFilterChange} className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
             useDarkTheme 
               ? 'bg-gray-800 border-gray-600 text-gray-100' 
               : 'bg-white border-gray-300 text-gray-900'
           }`} />
        </div>
                 <div>
           <label className={`block text-xs mb-1 font-medium ${useDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Buscar</label>
           <input type="text" name="q" placeholder="Texto libre" value={filters.q} onChange={handleFilterChange} className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
             useDarkTheme 
               ? 'bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400' 
               : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
           }`} />
         </div>
         </div>
         
         {/* Action Buttons and Pagination */}
         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                         <div className="flex flex-wrap items-center gap-2 sm:gap-3">
               <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm transition-colors duration-200">
                 Aplicar
               </button>
               <button type="button" onClick={handleReset} className={`px-3 sm:px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                 useDarkTheme 
                   ? 'bg-gray-700 hover:bg-gray-600 text-white'
                   : 'bg-white/20 hover:bg-white/30 text-white'
               }`}>
                 Limpiar
               </button>
               <button type="button" onClick={exportCsv} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm transition-colors duration-200">
                 <span className="hidden sm:inline">Exportar</span>
                 <span className="sm:hidden">Exportar</span>
                 <span className="hidden sm:inline"> CSV</span>
               </button>
             </div>
             <div className={`flex items-center space-x-2 text-sm ${
               useDarkTheme ? 'text-gray-200' : 'text-white/80'
             }`}>
               <span className="hidden sm:inline">Por página</span>
               <span className="sm:hidden">Página</span>
               <select value={filters.per_page} onChange={handlePerPageChange} className={`border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                 useDarkTheme 
                   ? 'bg-gray-800 border-gray-600 text-gray-100'
                   : 'bg-white/10 border-white/20 text-white'
               }`}>
                 {[10,20,50,100].map(n => (<option key={n} value={n}>{n}</option>))}
                              </select>
             </div>
           </div>
         </form>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg border ${
          useDarkTheme 
            ? 'bg-blue-500 bg-opacity-20 text-blue-100 border-blue-500'
            : 'bg-blue-500 bg-opacity-10 text-white border-blue-500 border-opacity-50'
        }`}>
          {message}
        </div>
      )}

      {/* Reports List */}
      <div className={`reports-table-container backdrop-blur-md rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border ${
        useDarkTheme 
          ? 'bg-gray-900/80 border-gray-700' 
          : 'bg-white/10 border-white/20'
      }`}>
        <h3 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ${
          useDarkTheme ? 'text-white' : 'text-white'
        }`}>
          {title} {activeTab === 'pending' ? 'Pendientes' : activeTab === 'in_review' ? 'En Revisión' : 'Cerrados'}
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
              <div key={report.id} className={`rounded-xl p-4 sm:p-6 border ${
                useDarkTheme 
                  ? 'bg-gray-800/90 border-gray-700' 
                  : 'bg-white/20 border-white/30'
              }`}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0 mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(report.estado)} drop-shadow`}>
                      {report.estado}
                    </span>
                    <span className={`text-xs sm:text-sm ${
                      useDarkTheme ? 'text-gray-300' : 'text-white/80'
                    }`}>
                      ID: {report.id}
                    </span>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className={`text-sm font-semibold drop-shadow ${
                      useDarkTheme ? 'text-white' : 'text-white'
                    }`}>{getEventTypeLabel(report.tipo_reporte)}</p>
                    <p className={`text-xs ${
                      useDarkTheme ? 'text-gray-400' : 'text-white/60'
                    }`}>{getLocationText(report)}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className={`mb-2 leading-relaxed text-sm sm:text-base ${
                    useDarkTheme ? 'text-gray-200' : 'text-white/90'
                  }`}>{getDescriptionText(report)}</p>
                  <div className={`flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 text-xs sm:text-sm ${
                    useDarkTheme ? 'text-gray-300' : 'text-white/70'
                  }`}>
                    <span>Reportado por: {report.nombre_usuario}</span>
                    <span>Fecha: {new Date(report.fecha_evento || report.creado_en).toLocaleString()}</span>
                  </div>
                  
                  {/* Mostrar primera imagen si existe */}
                  {report.evidencias && report.evidencias.length > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <svg className={`w-4 h-4 ${
                          useDarkTheme ? 'text-gray-400' : 'text-white/60'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <span className={`text-xs ${
                          useDarkTheme ? 'text-gray-400' : 'text-white/60'
                        }`}>Evidencias: {report.evidencias.length}</span>
                      </div>
                      <div className="flex space-x-2 overflow-x-auto pb-2">
                        {report.evidencias.slice(0, 3).map((evidencia, index) => {
                          const isImage = evidencia.tipo_archivo && evidencia.tipo_archivo.startsWith('image/');
                          return (
                            <div key={evidencia.id} className="flex-shrink-0">
                              {isImage ? (
                                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border ${
                                  useDarkTheme 
                                    ? 'bg-gray-700 border-gray-600' 
                                    : 'bg-white/20 border-white/30'
                                }`}>
                                  <img 
                                    src={buildApi(`evidencias/${evidencia.id}?token=${encodeURIComponent(localStorage.getItem('token') || '')}`)}
                                    alt={`Evidencia ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                  <div className={`w-full h-full flex items-center justify-center ${
                                    useDarkTheme ? 'bg-gray-700' : 'bg-white/20'
                                  }`} style={{display: 'none'}}>
                                    <svg className={`w-4 h-4 sm:w-6 sm:h-6 ${
                                      useDarkTheme ? 'text-gray-500' : 'text-white/50'
                                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"/>
                                    </svg>
                                  </div>
                                </div>
                              ) : (
                                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg border flex items-center justify-center ${
                                  useDarkTheme 
                                    ? 'bg-gray-700 border-gray-600' 
                                    : 'bg-white/20 border-white/30'
                                }`}>
                                  <svg className={`w-4 h-4 sm:w-6 sm:h-6 ${
                                    useDarkTheme ? 'text-gray-500' : 'text-white/50'
                                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                  </svg>
                                </div>
                              )}
                            </div>
                          );
                        })}
                        {report.evidencias.length > 3 && (
                          <div className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg border flex items-center justify-center ${
                            useDarkTheme 
                              ? 'bg-gray-700 border-gray-600' 
                              : 'bg-white/20 border-white/30'
                          }`}>
                            <span className={`text-xs ${
                              useDarkTheme ? 'text-gray-400' : 'text-white/60'
                            }`}>+{report.evidencias.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                                 <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-2">
                   {showStatusActions && report.estado === 'pendiente' && (
                     <button
                       onClick={() => handleStatusChange(report.id, 'en_revision')}
                       className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors duration-200"
                     >
                       Tomar Caso
                     </button>
                   )}
                   {showStatusActions && report.estado === 'en_revision' && (
                     <>
                       <button
                         onClick={() => handleOpenApprovalModal(report)}
                         className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors duration-200"
                       >
                         Aprobar
                       </button>
                       <button
                         onClick={() => handleStatusChange(report.id, 'rechazado')}
                         className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors duration-200"
                       >
                         Rechazar
                       </button>
                     </>
                   )}
                   {showStatusActions && (report.estado === 'aprobado' || report.estado === 'rechazado') && (
                     <button
                       onClick={() => handleStatusChange(report.id, 'en_revision')}
                       className="bg-orange-600 hover:bg-orange-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors duration-200"
                       title="Volver a enviar a revisión"
                     >
                       Reabrir
                     </button>
                   )}
                   <button 
                     onClick={() => handleViewDetails(report.id)}
                     className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors duration-200 ${
                       useDarkTheme 
                         ? 'bg-gray-700 hover:bg-gray-600 text-white'
                         : 'bg-white/20 hover:bg-white/30 text-white'
                     }`}
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
          <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 ${
            useDarkTheme ? 'text-gray-200' : 'text-white/80'
          }`}>
            <button disabled={filters.page <= 1} onClick={() => handlePageChange(filters.page - 1)} className={`px-3 sm:px-4 py-2 rounded text-sm ${
              filters.page <= 1 
                ? useDarkTheme 
                  ? 'bg-gray-700 cursor-not-allowed' 
                  : 'bg-white/10 cursor-not-allowed'
                : useDarkTheme
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-white/20 hover:bg-white/30'
            }`}>
              Anterior
            </button>
            <div className="text-center text-sm">
              <span className="hidden sm:inline">Página {meta.page} de {meta.total_pages} • Total: {meta.total}</span>
              <span className="sm:hidden">{meta.page} / {meta.total_pages} ({meta.total})</span>
            </div>
            <button disabled={meta.page >= meta.total_pages} onClick={() => handlePageChange(filters.page + 1)} className={`px-3 sm:px-4 py-2 rounded text-sm ${
              meta.page >= meta.total_pages 
                ? useDarkTheme 
                  ? 'bg-gray-700 cursor-not-allowed' 
                  : 'bg-white/10 cursor-not-allowed'
                : useDarkTheme
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-white/20 hover:bg-white/30'
            }`}>
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* Report Details Modal */}
      <ReportDetailsModal
        isOpen={showDetailsModal}
        onClose={handleCloseDetails}
        reportId={selectedReportId}
      />

      {/* Approval Modal */}
      {selectedReportForApproval && (
        <ApprovalModal
          isOpen={showApprovalModal}
          onClose={handleCloseApprovalModal}
          report={selectedReportForApproval}
          onApprove={handleApproveWithModal}
        />
      )}
    </div>
  );
};

export default ReportsTable;
