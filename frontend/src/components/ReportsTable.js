import React, { useState, useEffect, useCallback } from 'react';
import ReportService from '../services/reportService';
import ReportDetailsModal from './ReportDetailsModal';
import ApprovalModal from './ApprovalModal';
import { buildApi, buildUploadsUrl } from '../config/api';
import { gradosCriticidad, tiposAfectacion, reportTypes } from '../config/formOptions';
import { reportService, userService } from '../services/api';

// Función para formatear la fecha y hora del reporte correctamente
const formatReportDateTime = (fechaEvento, creadoEn) => {
  try {
    // Siempre usar creado_en para mostrar la fecha y hora exacta de creación del reporte
    // fecha_evento solo tiene la fecha del evento, no la hora de creación
    const fecha = creadoEn || fechaEvento;
    
    if (!fecha) return 'Fecha no disponible';
    
    // Crear objeto Date - manejar diferentes formatos
    let date;
    
    // Si es un string, intentar parsearlo
    if (typeof fecha === 'string') {
      // Intentar diferentes formatos de fecha
      if (fecha.includes('T')) {
        // Formato ISO: "2024-01-15T14:30:00.000Z"
        date = new Date(fecha);
      } else if (fecha.includes('-') && fecha.includes(':')) {
        // Formato MySQL: "2024-01-15 14:30:00"
        date = new Date(fecha.replace(' ', 'T'));
      } else if (fecha.includes('-')) {
        // Solo fecha: "2024-01-15" - agregar hora por defecto
        date = new Date(fecha + 'T00:00:00');
      } else {
        // Otros formatos
        date = new Date(fecha);
      }
    } else {
      // Si ya es un objeto Date o timestamp
      date = new Date(fecha);
    }
    
    // Verificar que la fecha sea válida
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }
    
    // Formatear en español colombiano con zona horaria específica
    return date.toLocaleString('es-CO', {
      timeZone: 'America/Bogota',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false // Usar formato 24 horas
    });
    
  } catch (error) {
    return 'Error en fecha';
  }
};

// Función para determinar a qué proceso (gestión) pertenece un proyecto
const getProcesoFromProyecto = (proyecto) => {
  if (!proyecto || proyecto.trim() === '') {
    return 'Gestión Administrativa';
  }
  
  const proyectoTrim = proyecto.trim();
  
  // Gestión Proyecto - Petroservicios
  if (proyectoTrim === 'PETROSERVICIOS') {
    return 'Gestión Proyecto - Petroservicios';
  }
  
  // Gestión Administrativa
  const proyectosAdministrativos = [
    'ADMINISTRACION',
    'COMPANY MAN - ADMINISTRACION',
    'ADMINISTRACION - STAFF',
    'FRONTERA - ADMINISTRACION',
    'Administrativo',
    'PETROSERVICIOS - ADMINISTRACION',
    'ADMINISTRACION COMPANY MAN'
  ];
  if (proyectosAdministrativos.includes(proyectoTrim)) {
    return 'Gestión Administrativa';
  }
  
  // Gestión Proyecto - Company man
  const proyectosCompanyMan = [
    '3047761-4',
    'COMPANY MAN - APIAY',
    'COMPANY MAN',
    'COMPANY MAN - CPO09',
    'COMPANY MAN - GGS',
    'COMPANY MAN - CASTILLA'
  ];
  if (proyectosCompanyMan.includes(proyectoTrim)) {
    return 'Gestión Proyecto - Company man';
  }
  
  // Gestión Proyecto Frontera
  if (proyectoTrim === 'FRONTERA') {
    return 'Gestión Proyecto Frontera';
  }
  
  // Gestión Proyecto ZIRCON
  if (proyectoTrim === 'ZIRCON') {
    return 'Gestión Proyecto ZIRCON';
  }
  
  // Si no coincide con ninguna gestión, retornar el proyecto original
  return proyectoTrim;
};

// Función para calcular días transcurridos desde la creación del reporte
const calculateDaysElapsed = (fechaEvento, creadoEn, fechaCierre = null) => {
  try {
    const fecha = creadoEn || fechaEvento;
    if (!fecha) return 0;
    
    let date;
    if (typeof fecha === 'string') {
      if (fecha.includes('T')) {
        date = new Date(fecha);
      } else if (fecha.includes('-') && fecha.includes(':')) {
        date = new Date(fecha.replace(' ', 'T'));
      } else if (fecha.includes('-')) {
        date = new Date(fecha + 'T00:00:00');
      } else {
        date = new Date(fecha);
      }
    } else {
      date = new Date(fecha);
    }
    
    if (isNaN(date.getTime())) return 0;
    
    // Usar fecha de cierre si se proporciona, sino usar fecha actual
    const endDate = fechaCierre ? new Date(fechaCierre) : new Date();
    const diffTime = Math.abs(endDate - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  } catch (error) {
    return 0;
  }
};

// Función para obtener el estado de tiempo del reporte
const getTimeStatus = (fechaEvento, creadoEn, estado, fechaRevision) => {
  // Si el reporte está cerrado, calcular días desde creación hasta cierre
  if (estado === 'aprobado' || estado === 'rechazado') {
    const fechaCierre = fechaRevision || new Date(); // Usar fecha de revisión si existe, sino fecha actual
    const daysElapsed = calculateDaysElapsed(fechaEvento, creadoEn, fechaCierre);
    return {
      days: daysElapsed,
      isOverdue: false, // Los reportes cerrados nunca están vencidos
      status: `Se gestionó en ${daysElapsed} días`,
      statusClass: 'text-green-500',
      bgClass: 'bg-green-100 text-green-800',
      darkBgClass: 'bg-green-900/30 text-green-300 border-green-700/50',
      isClosed: true
    };
  } else {
    // Para reportes abiertos, calcular días desde creación hasta ahora
    const daysElapsed = calculateDaysElapsed(fechaEvento, creadoEn);
    return {
      days: daysElapsed,
      isOverdue: daysElapsed > 15,
      status: daysElapsed <= 15 ? 'A tiempo' : 'Vencido',
      statusClass: daysElapsed <= 15 ? 'text-green-500' : 'text-red-500',
      bgClass: daysElapsed <= 15 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
      darkBgClass: daysElapsed <= 15 ? 'bg-green-900/30 text-green-300 border-green-700/50' : 'bg-red-900/30 text-red-300 border-red-700/50',
      isClosed: false
    };
  }
};

const ReportsTable = ({ 
  user, 
  showStatusActions = true, 
  onStatusChange, 
  containerClassName = "",
  title = "Reportes",
  useDarkTheme = true,
  externalFilters = {}
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
    proceso: '', // Cambiado de proyecto a proceso
    revisado_por: '', // Filtro de usuario creador del reporte
    efectividad_cierre: '', // Nuevo filtro de efectividad de cierre
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
  const [responsables, setResponsables] = useState([]); // Lista de usuarios responsables (soporte/admin)

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
      const usersResult = await userService.fetchUsers();
      
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
      
      // Extraer proyectos únicos de todos los usuarios
      const proyectosUnicos = new Set();
      users.forEach((user) => {
        if (user.Proyecto && user.Proyecto.trim() !== '') {
          proyectosUnicos.add(user.Proyecto.trim());
        }
      });
      const proyectosArray = Array.from(proyectosUnicos).sort();
      setProyectos(proyectosArray);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
    }
  };

  // Cargar responsables (usuarios con rol soporte o admin)
  const loadResponsables = async () => {
    try {
      const [soporteResult, adminResult] = await Promise.all([
        userService.fetchUsers({ rol: 'soporte', activo: 1 }),
        userService.fetchUsers({ rol: 'admin', activo: 1 })
      ]);
      
      let soporteUsers = [];
      let adminUsers = [];
      
      // Procesar usuarios de soporte
      if (soporteResult.success && soporteResult.data) {
        soporteUsers = soporteResult.data;
      } else if (Array.isArray(soporteResult)) {
        soporteUsers = soporteResult;
      }
      
      // Procesar usuarios admin
      if (adminResult.success && adminResult.data) {
        adminUsers = adminResult.data;
      } else if (Array.isArray(adminResult)) {
        adminUsers = adminResult;
      }
      
      // Combinar y ordenar por nombre
      const todosResponsables = [...soporteUsers, ...adminUsers].sort((a, b) => 
        (a.nombre || '').localeCompare(b.nombre || '')
      );
      
      setResponsables(todosResponsables);
    } catch (error) {
      console.error('Error al cargar responsables:', error);
    }
  };

  const loadReports = useCallback(async () => {
    setIsLoading(true);
    try {
      // Cargar reportes con filtros aplicados pero sin filtrar por estado
      const apiFilters = { ...externalFilters, ...filters };
      
      // Mapear 'proceso' a 'proyecto' para el backend (mapeo de Gestiones a Proyectos)
      if (apiFilters.proceso) {
        if (apiFilters.proceso === 'petroservicios') {
          // Gestión Proyecto - Petroservicios
          apiFilters.proyecto = 'PETROSERVICIOS';
        } else if (apiFilters.proceso === 'administrativa') {
          // Gestión Administrativa
          apiFilters.proyecto = 'ADMINISTRACION,COMPANY MAN - ADMINISTRACION,ADMINISTRACION - STAFF,FRONTERA - ADMINISTRACION,Administrativo,PETROSERVICIOS - ADMINISTRACION,ADMINISTRACION COMPANY MAN';
        } else if (apiFilters.proceso === 'company-man') {
          // Gestión Proyecto - Company man
          apiFilters.proyecto = '3047761-4,COMPANY MAN - APIAY,COMPANY MAN,COMPANY MAN - CPO09,COMPANY MAN - GGS,COMPANY MAN - CASTILLA';
        } else if (apiFilters.proceso === 'frontera') {
          // Gestión Proyecto Frontera
          apiFilters.proyecto = 'FRONTERA';
        } else if (apiFilters.proceso === 'zircon') {
          // Gestión Proyecto ZIRCON
          apiFilters.proyecto = 'ZIRCON';
        }
        delete apiFilters.proceso;
      }
      
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
    // Cargar estadísticas, proyectos, responsables y reportes al inicializar
    loadStats();
    loadProyectos();
    loadResponsables();
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
      tipo_reporte: '', estado: '', grado_criticidad: '', tipo_afectacion: '', proceso: '',
      revisado_por: '', efectividad_cierre: '', date_from: '', date_to: '', q: '', page: 1, per_page: 10, sort_by: 'creado_en', sort_dir: 'desc'
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
      'conversaciones': 'Conversaciones',
      'pqr': 'PQR'
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
      case 'pqr':
        return 'Contacto: ' + (report.telefono_contacto || 'No especificado');
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
      case 'pqr':
        return report.descripcion_hallazgo || report.asunto || 'Sin descripción';
      default:
        return report.asunto || 'Sin descripción';
    }
  };

  // Filtrar reportes por la pestaña activa y filtros adicionales
  const filteredReports = reports.filter(report => {
    // Filtro por pestaña activa
    let matchesTab = false;
    switch (activeTab) {
      case 'pending':
        matchesTab = report.estado === 'pendiente';
        break;
      case 'in_review':
        matchesTab = report.estado === 'en_revision';
        break;
      case 'closed':
        matchesTab = report.estado === 'aprobado' || report.estado === 'rechazado';
        break;
      default:
        matchesTab = true;
    }
    
    if (!matchesTab) return false;
    
    // Filtro por responsable (usuario que creó el reporte)
    if (filters.revisado_por) {
      const responsableId = parseInt(filters.revisado_por);
      const reportUserId = parseInt(report.id_usuario);
      if (reportUserId !== responsableId) return false;
    }
    
    // Filtro por efectividad de cierre
    if (filters.efectividad_cierre) {
      const timeStatus = getTimeStatus(report.fecha_evento, report.creado_en, report.estado, report.fecha_revision);
      const daysElapsed = timeStatus.days;
      
      switch (filters.efectividad_cierre) {
        case 'a_tiempo':
          if (daysElapsed > 15) return false;
          break;
        case 'vencido':
          if (daysElapsed <= 15) return false;
          break;
        case 'cerrado_rapido':
          if (daysElapsed > 7) return false;
          break;
        case 'cerrado_normal':
          if (daysElapsed <= 7 || daysElapsed > 15) return false;
          break;
      }
    }
    
    return true;
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
          onClick={() => { loadStats(); loadProyectos(); loadResponsables(); loadReports(); }}
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
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-4">
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
         <label className={`block text-xs mb-1 font-medium ${useDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Proceso</label>
          <select name="proceso" value={filters.proceso} onChange={handleFilterChange} className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
            useDarkTheme 
              ? 'bg-gray-800 border-gray-600 text-gray-100' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}>
           <option value="">Todos los Procesos</option>
           <option value="petroservicios">Gestión Proyecto - Petroservicios</option>
           <option value="administrativa">Gestión Administrativa</option>
           <option value="company-man">Gestión Proyecto - Company man</option>
           <option value="frontera">Gestión Proyecto Frontera</option>
           <option value="zircon">Gestión Proyecto ZIRCON</option>
         </select>
       </div>
                <div>
         <label className={`block text-xs mb-1 font-medium ${useDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Usuario asignado</label>
          <select name="revisado_por" value={filters.revisado_por} onChange={handleFilterChange} className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
            useDarkTheme 
              ? 'bg-gray-800 border-gray-600 text-gray-100' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}>
           <option value="">Todos</option>
           {responsables.map(resp => (
             <option key={resp.id} value={resp.id}>{resp.nombre}</option>
           ))}
         </select>
       </div>
                <div>
          <label className={`block text-xs mb-1 font-medium ${useDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Efectividad de cierre</label>
          <select name="efectividad_cierre" value={filters.efectividad_cierre} onChange={handleFilterChange} className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
            useDarkTheme 
              ? 'bg-gray-800 border-gray-600 text-gray-100' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}>
           <option value="">Todos</option>
           <option value="a_tiempo">A tiempo (≤15 días)</option>
           <option value="vencido">Vencido (&gt;15 días)</option>
           <option value="cerrado_rapido">Cerrado rápido (≤7 días)</option>
           <option value="cerrado_normal">Cerrado normal (8-15 días)</option>
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
            {filteredReports.map(report => {
              const timeStatus = getTimeStatus(report.fecha_evento, report.creado_en, report.estado, report.fecha_revision);
              return (
              <div key={report.id} className={`rounded-xl p-4 sm:p-6 border ${
                useDarkTheme 
                  ? timeStatus.isClosed
                    ? 'bg-green-900/20 border-green-700/50'
                    : timeStatus.isOverdue 
                      ? 'bg-red-900/20 border-red-700/50' 
                      : 'bg-gray-800/90 border-gray-700'
                  : timeStatus.isClosed
                    ? 'bg-green-100/20 border-green-300/50'
                    : timeStatus.isOverdue
                      ? 'bg-red-100/20 border-red-300/50'
                      : 'bg-white/20 border-white/30'
              }`}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0 mb-4">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(report.estado)} drop-shadow`}>
                      {report.estado}
                    </span>
                    <span className={`text-xs sm:text-sm ${
                      useDarkTheme ? 'text-gray-300' : 'text-white/80'
                    }`}>
                      ID: {report.id}
                    </span>
                    {/* Badge de Proceso */}
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border ${
                      useDarkTheme 
                        ? 'bg-purple-900/40 text-purple-200 border-purple-700/50' 
                        : 'bg-purple-500/30 text-purple-100 border-purple-400/50'
                    }`}>
                      {getProcesoFromProyecto(report.proyecto_usuario)}
                    </span>
                    {/* Indicador de tiempo transcurrido */}
                    <div className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                      useDarkTheme ? timeStatus.darkBgClass : timeStatus.bgClass
                    }`}>
                      {timeStatus.days} días
                    </div>
                    {/* Estado de tiempo */}
                    <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      timeStatus.isOverdue 
                        ? useDarkTheme 
                          ? 'bg-red-900/50 text-red-300 border border-red-700/50' 
                          : 'bg-red-100 text-red-800 border border-red-300'
                        : useDarkTheme
                          ? 'bg-green-900/50 text-green-300 border border-green-700/50'
                          : 'bg-green-100 text-green-800 border border-green-300'
                    }`}>
                      {timeStatus.status}
                    </div>
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
                    <span>Fecha: {formatReportDateTime(report.fecha_evento, report.creado_en)}</span>
                  </div>
                  
                  {/* Indicador de Responsable */}
                  {report.nombre_revisor ? (
                    <div className={`mt-3 flex items-center space-x-2 p-3 rounded-lg border ${
                      useDarkTheme 
                        ? 'bg-blue-900/30 border-blue-700/50' 
                        : 'bg-blue-500/20 border-blue-400/50'
                    }`}>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        useDarkTheme ? 'bg-blue-600' : 'bg-blue-500'
                      }`}>
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs font-medium ${
                          useDarkTheme ? 'text-blue-300' : 'text-blue-100'
                        }`}>Caso asignado a:</p>
                        <p className={`text-sm font-bold ${
                          useDarkTheme ? 'text-white' : 'text-white'
                        }`}>{report.nombre_revisor}</p>
                      </div>
                      <div className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-semibold ${
                        useDarkTheme 
                          ? 'bg-green-900/50 text-green-300 border border-green-700/50' 
                          : 'bg-green-500/30 text-green-100 border border-green-400/50'
                      }`}>
                        ✓ Asignado
                      </div>
                    </div>
                  ) : report.estado !== 'pendiente' ? (
                    <div className={`mt-3 flex items-center space-x-2 p-3 rounded-lg border ${
                      useDarkTheme 
                        ? 'bg-gray-800/50 border-gray-700' 
                        : 'bg-gray-500/20 border-gray-400/50'
                    }`}>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        useDarkTheme ? 'bg-gray-700' : 'bg-gray-500'
                      }`}>
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs font-medium ${
                          useDarkTheme ? 'text-gray-400' : 'text-gray-200'
                        }`}>Responsable:</p>
                        <p className={`text-sm font-semibold ${
                          useDarkTheme ? 'text-gray-300' : 'text-white'
                        }`}>Sin asignar</p>
                      </div>
                    </div>
                  ) : (
                    <div className={`mt-3 flex items-center space-x-2 p-3 rounded-lg border ${
                      useDarkTheme 
                        ? 'bg-yellow-900/20 border-yellow-700/50' 
                        : 'bg-yellow-500/20 border-yellow-400/50'
                    }`}>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        useDarkTheme ? 'bg-yellow-700' : 'bg-yellow-500'
                      }`}>
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs font-medium ${
                          useDarkTheme ? 'text-yellow-300' : 'text-yellow-100'
                        }`}>Estado:</p>
                        <p className={`text-sm font-bold ${
                          useDarkTheme ? 'text-white' : 'text-white'
                        }`}>Esperando asignación</p>
                      </div>
                      <div className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-semibold ${
                        useDarkTheme 
                          ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-700/50' 
                          : 'bg-yellow-500/30 text-yellow-100 border border-yellow-400/50'
                      }`}>
                        ⏳ Pendiente
                      </div>
                    </div>
                  )}
                  
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
              );
            })}
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
