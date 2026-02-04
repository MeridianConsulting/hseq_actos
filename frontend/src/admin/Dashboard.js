import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getUser, logout, getUserName, isAdmin } from '../utils/auth';
import '../assets/css/styles.css';

// Importar componentes de Nivo
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveRadar } from '@nivo/radar';
import { useDashboardStats } from '../hooks/useDashboardStats';
import reportService from '../services/reportService';
import { userService } from '../services/api';
import { buildApi, buildUploadsUrl } from '../config/api';
import ReportsTable from '../components/ReportsTable';
import { reportTypes, gradosCriticidad } from '../config/formOptions';
import { AlertCircle, Clock, CircleCheck, Calendar, BarChart2, TrendingUp, Loader2, FileSpreadsheet, Search, X, User, Users, Plus } from 'lucide-react';

// Nombres de proceso unificados (PDF pág. 2)
const getProcesoFromProyecto = (proyecto) => {
  if (!proyecto || proyecto.trim() === '') {
    return 'Administrativo';
  }
  const proyectoTrim = proyecto.trim();
  if (proyectoTrim === 'PETROSERVICIOS') return 'Proyecto Petroservicios';
  const proyectosAdministrativos = [
    'ADMINISTRACION', 'COMPANY MAN - ADMINISTRACION', 'ADMINISTRACION - STAFF',
    'FRONTERA - ADMINISTRACION', 'Administrativo', 'PETROSERVICIOS - ADMINISTRACION', 'ADMINISTRACION COMPANY MAN'
  ];
  if (proyectosAdministrativos.includes(proyectoTrim)) return 'Administrativo';
  const proyectosCompanyMan = [
    '3047761-4', 'COMPANY MAN - APIAY', 'COMPANY MAN', 'COMPANY MAN - CPO09', 'COMPANY MAN - GGS', 'COMPANY MAN - CASTILLA'
  ];
  if (proyectosCompanyMan.includes(proyectoTrim)) return 'Proyecto CW_Company Man';
  if (proyectoTrim === 'FRONTERA') return 'Proyecto Frontera';
  if (proyectoTrim === 'ZIRCON') return 'Proyecto ZIRCON';
  return proyectoTrim;
};

// Leyenda HTML reutilizable (fuera del SVG para evitar solapamientos)
const LegendRow = ({ items }) => (
  <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-xs text-gray-200">
    {items.map(it => (
      <div key={it.label} className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full" style={{ background: it.color }} />
        <span className="whitespace-nowrap">{it.label}</span>
      </div>
    ))}
  </div>
);

const formatPeriodTick = (v) => {
  const s = String(v);
  return s.length > 10 ? s.slice(0, 10) + '…' : s;
};

const formatProcesoTick = (v) => {
  const s = String(v);
  return s.length > 22 ? s.slice(0, 22) + '…' : s;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('year');
  
  const handlePeriodChange = useCallback((period) => {
    console.log('handlePeriodChange llamado con:', period);
    setSelectedPeriod(period);
    // Los datos se recargarán automáticamente porque effectivePeriod cambia
    // y el hook useDashboardStats se ejecutará de nuevo
  }, []);
  const [user, setUser] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState(null);
  const [reports, setReports] = useState([]);
  const [supports, setSupports] = useState([]);
  const [reportsForProcessChart, setReportsForProcessChart] = useState([]);
  const [closedReports, setClosedReports] = useState([]);
  
  // Filtros para Excel
  const [excelFilters, setExcelFilters] = useState({
    tipo_reporte: '',
    estado: '',
    grado_criticidad: '',
    proceso: '', // Cambiado de proyecto a proceso
    revisado_por: '',
    date_from: '',
    date_to: ''
  });
  const [proyectos, setProyectos] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [showExcelFiltersModal, setShowExcelFiltersModal] = useState(false);

  // Modal Consolidados por usuario
  const [showConsolidadosModal, setShowConsolidadosModal] = useState(false);
  const [consolidadosType, setConsolidadosType] = useState('');
  const [consolidadosUsers, setConsolidadosUsers] = useState([]);
  const [consolidadosLoading, setConsolidadosLoading] = useState(false);
  const [consolidadosSearch, setConsolidadosSearch] = useState('');
  const [consolidadosDateFrom, setConsolidadosDateFrom] = useState('');
  const [consolidadosDateTo, setConsolidadosDateTo] = useState('');

  const handleOpenConsolidadosModal = useCallback(() => {
    setShowConsolidadosModal(true);
    setConsolidadosType('');
    setConsolidadosUsers([]);
    setConsolidadosSearch('');
    setConsolidadosDateFrom('');
    setConsolidadosDateTo('');
  }, []);

  const handleCloseConsolidadosModal = useCallback(() => {
    setShowConsolidadosModal(false);
  }, []);

  const fetchConsolidadosUsers = useCallback(async (type, dateFrom = null, dateTo = null) => {
    try {
      setConsolidadosLoading(true);
      setConsolidadosType(type);
      
      // Construir filtros
      const filters = { tipo_reporte: type, per_page: 10000, page: 1 };
      
      // Agregar filtros de fecha si están presentes
      if (dateFrom) {
        filters.date_from = dateFrom;
      }
      if (dateTo) {
        filters.date_to = dateTo;
      }
      
      const resp = await reportService.getAllReports(filters);
      const list = resp?.reports || resp?.data || [];
      
      // Filtrar por fechas si están presentes (filtro adicional en el cliente por si el backend no lo aplica correctamente)
      let filteredList = list;
      if (dateFrom || dateTo) {
        filteredList = list.filter(r => {
          const fechaReporte = r.fecha_evento || r.creado_en;
          if (!fechaReporte) return false;
          
          const fecha = new Date(fechaReporte);
          if (dateFrom && fecha < new Date(dateFrom)) return false;
          if (dateTo) {
            const fechaToEnd = new Date(dateTo);
            fechaToEnd.setHours(23, 59, 59, 999); // Incluir todo el día final
            if (fecha > fechaToEnd) return false;
          }
          return true;
        });
      }
      
      const map = new Map();
      filteredList.forEach(r => {
        const name = r.nombre_usuario || r.nombre || r.Usuario || 'Sin nombre';
        const id = r.id_usuario || r.user_id || r.id || null;
        const key = `${name}||${id}`;
        if (!map.has(key)) map.set(key, { id, nombre: name, count: 0 });
        map.get(key).count += 1;
      });
      const arr = Array.from(map.values()).sort((a, b) => (b.count - a.count) || ((a.nombre || '').localeCompare(b.nombre || '')));
      setConsolidadosUsers(arr);
    } catch (e) {
      console.error('Error cargando consolidados por usuario:', e);
      setConsolidadosUsers([]);
    } finally {
      setConsolidadosLoading(false);
    }
  }, []);

  const filteredConsolidadosUsers = useMemo(() => {
    if (!consolidadosSearch) return consolidadosUsers;
    const q = consolidadosSearch.toLowerCase();
    return consolidadosUsers.filter(u => (u.nombre || '').toLowerCase().includes(q));
  }, [consolidadosUsers, consolidadosSearch]);

  // Filtro global de proceso (gestión) para dashboards/reportes
  const [dashboardProceso, setDashboardProceso] = useState('');
  const dashboardFilters = useMemo(() => {
    if (!dashboardProceso) return {};
    if (dashboardProceso === 'petroservicios') {
      // Gestión Proyecto - Petroservicios
      return { proyecto: 'PETROSERVICIOS' };
    } else if (dashboardProceso === 'administrativa') {
      // Gestión Administrativa
      return { proyecto: 'ADMINISTRACION,COMPANY MAN - ADMINISTRACION,ADMINISTRACION - STAFF,FRONTERA - ADMINISTRACION,Administrativo,PETROSERVICIOS - ADMINISTRACION,ADMINISTRACION COMPANY MAN' };
    } else if (dashboardProceso === 'company-man') {
      // Gestión Proyecto - Company man
      return { proyecto: '3047761-4,COMPANY MAN - APIAY,COMPANY MAN,COMPANY MAN - CPO09,COMPANY MAN - GGS,COMPANY MAN - CASTILLA' };
    } else if (dashboardProceso === 'frontera') {
      // Gestión Proyecto Frontera
      return { proyecto: 'FRONTERA' };
    } else if (dashboardProceso === 'zircon') {
      // Gestión Proyecto ZIRCON
      return { proyecto: 'ZIRCON' };
    }
    return {};
  }, [dashboardProceso]);
  const effectivePeriod = selectedPeriod;
  
  // Calcular fechas según el período seleccionado para filtrar reportes
  const periodDateFilters = useMemo(() => {
    const now = new Date();
    let dateFrom, dateTo;
    
    if (selectedPeriod === 'month') {
      // Mes actual
      dateFrom = new Date(now.getFullYear(), now.getMonth(), 1);
      dateTo = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (selectedPeriod === 'quarter') {
      // Trimestre actual (Q1: 0-2, Q2: 3-5, Q3: 6-8, Q4: 9-11)
      const currentQuarter = Math.floor(now.getMonth() / 3);
      dateFrom = new Date(now.getFullYear(), currentQuarter * 3, 1);
      dateTo = new Date(now.getFullYear(), (currentQuarter + 1) * 3, 0, 23, 59, 59, 999);
    } else if (selectedPeriod === 'year') {
      // Año actual
      dateFrom = new Date(now.getFullYear(), 0, 1);
      dateTo = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    }
    
    if (dateFrom && dateTo) {
      return {
        date_from: dateFrom.toISOString().split('T')[0],
        date_to: dateTo.toISOString().split('T')[0]
      };
    }
    
    return {};
  }, [selectedPeriod]);

  // Etiqueta del período activo y rango formateado (para KPI y gráfico)
  const periodLabel = useMemo(() => {
    if (selectedPeriod === 'month') return 'Mensual';
    if (selectedPeriod === 'quarter') return 'Trimestral';
    return 'Anual';
  }, [selectedPeriod]);

  const periodRangeFormatted = useMemo(() => {
    const from = periodDateFilters.date_from;
    const to = periodDateFilters.date_to;
    if (!from || !to) return '';
    const formatDate = (d) => {
      const [y, m, day] = d.split('-');
      return `${day}/${m}/${y}`;
    };
    return `${formatDate(from)} - ${formatDate(to)}`;
  }, [periodDateFilters.date_from, periodDateFilters.date_to]);

  // Combinar filtros de dashboard con filtros de fecha del período
  const dashboardStatsFilters = useMemo(() => {
    return {
      ...dashboardFilters,
      ...periodDateFilters
    };
  }, [dashboardFilters, periodDateFilters]);
  const { stats, loading, error } = useDashboardStats(effectivePeriod, dashboardStatsFilters);
  
  // Debug: Log cuando cambie el período seleccionado
  useEffect(() => {
    console.log('Período seleccionado:', selectedPeriod, 'Effective period enviado al backend:', effectivePeriod);
    console.log('Filtros de fecha para reportes:', periodDateFilters);
    console.log('Filtros combinados para dashboard stats:', dashboardStatsFilters);
    console.log('Stats actuales:', stats);
  }, [selectedPeriod, effectivePeriod, periodDateFilters, dashboardStatsFilters, stats]);

  // Utilidades para agrupar por periodo (mes/trimestre/año)
  const monthNameToIndex = useMemo(() => ({
    'ene': 0, 'enero': 0,
    'feb': 1, 'febrero': 1,
    'mar': 2, 'marzo': 2,
    'abr': 3, 'abril': 3,
    'may': 4, 'mayo': 4,
    'jun': 5, 'junio': 5,
    'jul': 6, 'julio': 6,
    'ago': 7, 'agosto': 7,
    'sep': 8, 'sept': 8, 'septiembre': 8,
    'oct': 9, 'octubre': 9,
    'nov': 10, 'noviembre': 10,
    'dic': 11, 'diciembre': 11
  }), []);

  const parseMonthIndex = (m) => {
    if (m.mes_num != null) return Math.max(0, Math.min(11, Number(m.mes_num) - 1));
    const raw = (m.mes_corto || m.mes || '').toString().trim().toLowerCase();
    if (raw && monthNameToIndex.hasOwnProperty(raw)) return monthNameToIndex[raw];
    return undefined;
  };

  const parseYear = (m) => {
    if (m.anio != null) return Number(m.anio);
    if (m.year != null) return Number(m.year);
    // Intentar extraer año de periodos tipo "Ene 2024" o "2024"
    const str = (m.periodo || m.mes || m.mes_corto || '').toString();
    const match = str.match(/(20\d{2}|19\d{2})/);
    return match ? Number(match[1]) : undefined;
  };

  const aggregateByPeriod = (rows, periodType) => {
    if (periodType === 'month') {
      const monthRows = rows.map(m => {
        const y = parseYear(m);
        const mi = parseMonthIndex(m);
        const label = (m.mes_corto || m.mes || m.periodo || '').toString() || '—';
        return {
          period: label,
          _y: y ?? 0,
          _m: mi ?? 0,
          incidentes: Number(m.incidentes) || 0,
          hallazgos: Number(m.hallazgos) || 0,
          conversaciones: Number(m.conversaciones) || 0,
          pqr: Number(m.pqr || 0) || 0
        };
      });
      monthRows.sort((a, b) => (a._y - b._y) || (a._m - b._m));
      return monthRows.map(({ _y, _m, ...rest }) => rest);
    }
    const acc = new Map();
    rows.forEach(m => {
      const y = parseYear(m);
      const mi = parseMonthIndex(m);
      let key;
      let label;
      if (periodType === 'quarter') {
        const q = mi != null ? (Math.floor(mi / 3) + 1) : (m.tri || m.q);
        key = `${y || ''}-Q${q || ''}`;
        label = m.trimestre_corto || m.trimestre || m.periodo || (q ? `T${q} ${y || ''}` : '');
      } else {
        key = `${y || ''}`;
        label = (y != null ? String(y) : (m.periodo || ''));
      }
      if (!acc.has(key)) acc.set(key, { period: label, incidentes: 0, hallazgos: 0, conversaciones: 0, pqr: 0 });
      const cur = acc.get(key);
      cur.incidentes += Number(m.incidentes) || 0;
      cur.hallazgos += Number(m.hallazgos) || 0;
      cur.conversaciones += Number(m.conversaciones) || 0;
      cur.pqr += Number(m.pqr || 0) || 0;
    });
    // Ordenar por año y trimestre si posible
    const sorted = Array.from(acc.values()).sort((a, b) => {
      const ay = Number((a.period.match(/(20\d{2}|19\d{2})/) || [])[1]) || 0;
      const by = Number((b.period.match(/(20\d{2}|19\d{2})/) || [])[1]) || 0;
      if (ay !== by) return ay - by;
      const aq = Number((a.period.match(/T(\d)/) || [])[1]) || 0;
      const bq = Number((b.period.match(/T(\d)/) || [])[1]) || 0;
      return aq - bq;
    });
    return sorted;
  };

  // Bar chart: Reportes por periodo (dinámico por selectedPeriod)
  const incidentsByMonth = useMemo(() => {
    const data = stats?.incidentesPorMes || [];
    if (!Array.isArray(data)) return [];
    const periodType = selectedPeriod;
    return aggregateByPeriod(data, periodType);
  }, [stats?.incidentesPorMes, selectedPeriod]);

  // Colores determinísticos por categoría (evita repetición de color entre series)
  const SERIES_COLOR = {
    incidentes: '#3B82F6',
    hallazgos: '#F59E0B',
    conversaciones: '#10B981',
    pqr: '#A855F7'
  };

  // Pie chart: Distribución por tipo (definida más abajo con filtro de periodo)

  // Resumen de gestión para gráfico de barras (sustituye Métricas de seguridad)
  const totalReportes = useMemo(() => Number(stats?.kpis?.total_reportes) || 0, [stats?.kpis?.total_reportes]);
  const pendientes = useMemo(() => Number(stats?.kpis?.pendientes) || 0, [stats?.kpis?.pendientes]);
  // Cerrados: usa campo directo del backend si existe; si no, lo calcula como Aprobados + Rechazados
  const totalCerrados = useMemo(() => {
    const direct = Number(stats?.kpis?.total_cerrados);
    if (!Number.isNaN(direct) && direct > 0) return direct;
    const aprobados = Number(stats?.kpis?.aprobados) || 0;
    const rechazados = Number(stats?.kpis?.rechazados) || 0;
    return aprobados + rechazados;
  }, [stats?.kpis?.total_cerrados, stats?.kpis?.aprobados, stats?.kpis?.rechazados]);
  const totalAbiertosCalc = useMemo(() => Math.max(totalReportes - totalCerrados, 0), [totalReportes, totalCerrados]);
  const totalAbiertos = useMemo(() => Number(stats?.kpis?.total_abiertos) || totalAbiertosCalc, [stats?.kpis?.total_abiertos, totalAbiertosCalc]);

  const abiertosPorCriticidad = useMemo(() => ({
    Baja: Number(stats?.abiertosPorCriticidad?.baja) || 0,
    Media: Number(stats?.abiertosPorCriticidad?.media) || 0,
    Alta: Number(stats?.abiertosPorCriticidad?.alta) || 0,
    'Muy Alta': Number(stats?.abiertosPorCriticidad?.muy_alta) || 0
  }), [stats?.abiertosPorCriticidad]);

  const areaProcesoTop = useMemo(() => stats?.areaProcesoTop || stats?.area_mas_reporta || '-', [stats?.areaProcesoTop, stats?.area_mas_reporta]);
  const hallazgoMasReportado = useMemo(() => stats?.hallazgoMasReportado || stats?.hallazgo_mas_reportado || '-', [stats?.hallazgoMasReportado, stats?.hallazgo_mas_reportado]);

  // KPIs (coherentes con Resumen de gestión)
  const kpis = useMemo(() => [
    {
      title: 'Total reportes (período)',
      value: totalReportes ?? '-',
      color: '#ef4444',
      Icon: AlertCircle,
      subtitle: periodRangeFormatted ? `${periodLabel} · ${periodRangeFormatted}` : periodLabel
    },
    { title: 'Pendientes', value: pendientes ?? '-', color: '#fbbf24', Icon: Clock },
    { title: 'Cerrados', value: totalCerrados ?? '-', color: '#22c55e', Icon: CircleCheck }
  ], [totalReportes, pendientes, totalCerrados, periodLabel, periodRangeFormatted]);

  // Cargar proyectos únicos
  const loadProyectos = useCallback(async () => {
    try {
      const usersResult = await userService.fetchUsers();
      let users = [];
      if (usersResult.success && usersResult.data) {
        users = usersResult.data;
      } else if (Array.isArray(usersResult)) {
        users = usersResult;
      }
      
      const proyectosUnicos = new Set();
      users.forEach((user) => {
        if (user.Proyecto && user.Proyecto.trim() !== '') {
          proyectosUnicos.add(user.Proyecto.trim());
        }
      });
      setProyectos(Array.from(proyectosUnicos).sort());
    } catch (e) {
      console.error('Error cargando proyectos:', e);
    }
  }, []);

  // Cargar responsables (soporte + admin)
  const loadResponsables = useCallback(async () => {
    try {
      const [soporteResult, adminResult] = await Promise.all([
        userService.fetchUsers({ rol: 'soporte', activo: 1 }),
        userService.fetchUsers({ rol: 'admin', activo: 1 })
      ]);
      
      let soporteUsers = [];
      let adminUsers = [];
      
      if (soporteResult.success && soporteResult.data) {
        soporteUsers = soporteResult.data;
      } else if (Array.isArray(soporteResult)) {
        soporteUsers = soporteResult;
      }
      
      if (adminResult.success && adminResult.data) {
        adminUsers = adminResult.data;
      } else if (Array.isArray(adminResult)) {
        adminUsers = adminResult;
      }
      
      const todosResponsables = [...soporteUsers, ...adminUsers].sort((a, b) => 
        (a.nombre || '').localeCompare(b.nombre || '')
      );
      
      setResponsables(todosResponsables);
    } catch (e) {
      console.error('Error cargando responsables:', e);
    }
  }, []);

  const loadAssignmentData = useCallback(async () => {
    try {
      setAssignLoading(true);
      setAssignError(null);
      const [repResp, supResp, adminResp] = await Promise.all([
        reportService.fetchReports({ estado: 'pendiente' }),
        userService.fetchUsers({ rol: 'soporte', activo: 1 }),
        userService.fetchUsers({ rol: 'admin', activo: 1 })
      ]);
      if (repResp?.success) setReports(repResp.reports || repResp.data || []);
      // Combinar usuarios de soporte y administradores
      const soporteUsers = supResp?.success ? (supResp.data || []) : [];
      const adminUsers = adminResp?.success ? (adminResp.data || []) : [];
      setSupports([...soporteUsers, ...adminUsers]);
    } catch (e) {
      setAssignError(e.message || 'Error cargando datos de asignación');
    } finally {
      setAssignLoading(false);
    }
  }, [reportService, userService]);

  // Cargar reportes para gráfica de procesos (cerrados y en revisión) - filtrados por período Y por Proceso
  const loadReportsForProcessChart = useCallback(async () => {
    try {
      const filters = { per_page: 10000, page: 1 };

      // Aplicar filtro de proceso (mismo mapping del dashboardStats)
      Object.assign(filters, dashboardFilters);

      // Agregar filtro de fecha según el período seleccionado
      if (selectedPeriod !== 'all') {
        const now = new Date();
        let dateFrom, dateTo;

        if (selectedPeriod === 'month') {
          dateFrom = new Date(now.getFullYear(), now.getMonth(), 1);
          dateTo = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        } else if (selectedPeriod === 'quarter') {
          const currentQuarter = Math.floor(now.getMonth() / 3);
          dateFrom = new Date(now.getFullYear(), currentQuarter * 3, 1);
          dateTo = new Date(now.getFullYear(), (currentQuarter + 1) * 3, 0, 23, 59, 59, 999);
        } else if (selectedPeriod === 'year') {
          dateFrom = new Date(now.getFullYear(), 0, 1);
          dateTo = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        }

        if (dateFrom && dateTo) {
          filters.date_from = dateFrom.toISOString().split('T')[0];
          filters.date_to = dateTo.toISOString().split('T')[0];
        }
      }

      const resp = await reportService.getAllReports(filters);

      let allReports = [];
      let closedOnlyReports = [];

      if (resp?.success && Array.isArray(resp.reports)) {
        let filteredReports = resp.reports;

        if (selectedPeriod !== 'all') {
          const now = new Date();
          let dateFrom, dateTo;

          if (selectedPeriod === 'month') {
            dateFrom = new Date(now.getFullYear(), now.getMonth(), 1);
            dateTo = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
          } else if (selectedPeriod === 'quarter') {
            const currentQuarter = Math.floor(now.getMonth() / 3);
            dateFrom = new Date(now.getFullYear(), currentQuarter * 3, 1);
            dateTo = new Date(now.getFullYear(), (currentQuarter + 1) * 3, 0, 23, 59, 59, 999);
          } else if (selectedPeriod === 'year') {
            dateFrom = new Date(now.getFullYear(), 0, 1);
            dateTo = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
          }

          if (dateFrom && dateTo) {
            filteredReports = resp.reports.filter(r => {
              const fechaReporte = r.fecha_evento || r.creado_en;
              if (!fechaReporte) return false;
              const fecha = new Date(fechaReporte);
              return fecha >= dateFrom && fecha <= dateTo;
            });
          }
        }

        allReports = filteredReports.filter(r =>
          r.estado === 'aprobado' || r.estado === 'rechazado' || r.estado === 'en_revision'
        );

        closedOnlyReports = filteredReports.filter(r =>
          r.estado === 'aprobado' || r.estado === 'rechazado'
        );
      }

      setReportsForProcessChart(allReports);
      setClosedReports(closedOnlyReports);
    } catch (e) {
      console.error('Error cargando reportes para gráfica de procesos:', e);
      setReportsForProcessChart([]);
      setClosedReports([]);
    }
  }, [selectedPeriod, dashboardFilters]);

  useEffect(() => {
    const userData = getUser();
    if (userData) {
      setUser(userData);
      setTimeout(() => setIsVisible(true), 100);
    }
    // Cargar datos para asignación si es admin
    if (isAdmin()) {
      loadAssignmentData();
      loadProyectos();
      loadResponsables();
    }
    // Cargar reportes para gráfica de procesos
    loadReportsForProcessChart();
  }, [loadAssignmentData, loadProyectos, loadResponsables, loadReportsForProcessChart]);

  // Recargar reportes cuando cambie el período o el filtro de proceso
  useEffect(() => {
    loadReportsForProcessChart();
  }, [selectedPeriod, dashboardProceso, loadReportsForProcessChart]);

  const handleAssignToSupport = useCallback(async (reportId, supportUserId) => {
    if (!supportUserId) return;
    try {
      setAssignLoading(true);
      const selectedUser = supports.find(s => String(s.id) === String(supportUserId));
      const assignedRole = selectedUser?.rol === 'admin' ? 'administrador' : 'equipo de soporte';
      await reportService.updateReportStatus({
        report_id: reportId,
        status: 'en_revision',
        revisor_id: Number(supportUserId),
        comentarios: `Asignado a ${assignedRole}`
      });
      // Refrescar lista
      await loadAssignmentData();
    } catch (e) {
      setAssignError(e.message || 'No se pudo asignar el reporte');
    } finally {
      setAssignLoading(false);
    }
  }, [loadAssignmentData, reportService, supports]);

  const handleLogout = useCallback(() => {
    logout();
  }, []);

  const goBackToHome = useCallback(() => {
    navigate('/home');
  }, [navigate]);

  const goToUserAdmin = useCallback(() => {
    navigate('/admin/users');
  }, [navigate]);

  const goToCreateReport = useCallback(() => {
    navigate('/reportar');
  }, [navigate]);

  // Handlers para filtros de Excel
  const handleExcelFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setExcelFilters(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleResetExcelFilters = useCallback(() => {
    setExcelFilters({
      tipo_reporte: '',
      estado: '',
      grado_criticidad: '',
      proceso: '',
      revisado_por: '',
      date_from: '',
      date_to: ''
    });
  }, []);

  const handleDownloadPDF = useCallback(async () => {
    const title = 'Reportes Detallados HSEQ';
    const generatedAt = new Date().toLocaleString('es-ES');
    
    const estilos = `
      <style>
        * { box-sizing: border-box; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        body { margin: 20px; color: #1a202c; background: #ffffff; }
        h1 { margin: 0 0 20px; font-size: 32px; font-weight: 700; color: #2d3748; border-bottom: 4px solid #3182ce; padding-bottom: 12px; text-align: center; }
        .header-info { background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 6px solid #3182ce; text-align: center; }
        
        .report-card { border: 3px solid #e2e8f0; border-radius: 16px; padding: 24px; margin: 30px 0; background: #ffffff; box-shadow: 0 6px 15px rgba(0,0,0,0.1); page-break-inside: avoid; }
        .report-header { background: linear-gradient(135deg, #3182ce 0%, #2c5282 100%); color: white; padding: 16px; border-radius: 12px; margin: -24px -24px 24px -24px; }
        .report-title { font-size: 22px; font-weight: 700; margin: 0; }
        .report-meta { font-size: 12px; margin-top: 8px; opacity: 0.9; }
        
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 20px 0; }
        .info-item { padding: 12px; background: #f7fafc; border-left: 4px solid #3182ce; border-radius: 6px; }
        .info-label { font-size: 11px; font-weight: 600; color: #718096; text-transform: uppercase; margin-bottom: 4px; }
        .info-value { font-size: 14px; font-weight: 600; color: #2d3748; }
        
        .description-box { background: #f7fafc; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #3182ce; }
        .description-title { font-size: 13px; font-weight: 700; color: #4a5568; margin-bottom: 8px; }
        .description-text { font-size: 13px; line-height: 1.6; color: #2d3748; white-space: pre-wrap; }
        
        .evidence-section { margin-top: 20px; }
        .evidence-title { font-size: 16px; font-weight: 700; color: #2d3748; margin-bottom: 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
        .evidence-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 16px; }
        .evidence-item { border: 2px solid #e2e8f0; border-radius: 8px; padding: 8px; background: #f7fafc; }
        .evidence-image { width: 100%; height: auto; border-radius: 6px; display: block; max-height: 200px; object-fit: cover; }
        
        .badge { display: inline-block; padding: 6px 14px; border-radius: 20px; font-weight: 600; font-size: 11px; margin: 4px; }
        .badge-success { background: #10b981; color: white; }
        .badge-warning { background: #f59e0b; color: white; }
        .badge-danger { background: #ef4444; color: white; }
        .badge-info { background: #3b82f6; color: white; }
        .badge-purple { background: #a855f7; color: white; }
        
        .status-badge { padding: 8px 16px; border-radius: 24px; font-weight: 700; font-size: 12px; display: inline-block; }
        .status-pendiente { background: #fef3c7; color: #92400e; border: 2px solid #fbbf24; }
        .status-revision { background: #dbeafe; color: #1e3a8a; border: 2px solid #3b82f6; }
        .status-aprobado { background: #d1fae5; color: #065f46; border: 2px solid #10b981; }
        .status-rechazado { background: #fee2e2; color: #991b1b; border: 2px solid #ef4444; }
        
        @media print { 
          .no-print { display: none !important; } 
          body { margin: 15px; }
          .report-card { page-break-inside: avoid; margin: 20px 0; }
          .evidence-grid { grid-template-columns: repeat(2, 1fr); }
        }
      </style>`;

    // Obtener todos los reportes con detalles completos
    let allReports = [];
    try {
      const resp = await reportService.getAllReports({ per_page: 1000, page: 1 });
      if (resp?.success && Array.isArray(resp.reports)) {
        allReports = resp.reports;
      }
    } catch (e) {
      console.error('Error obteniendo reportes:', e);
    }

    // Función auxiliar para obtener badge de tipo
    const getTipoBadge = (tipo) => {
      const tipos = {
        'incidentes': '<span class="badge badge-danger">Incidente</span>',
        'hallazgos': '<span class="badge badge-warning">Hallazgo</span>',
        'conversaciones': '<span class="badge badge-info">Conversación</span>',
        'pqr': '<span class="badge badge-purple">PQR</span>'
      };
      return tipos[tipo] || '<span class="badge badge-info">' + tipo + '</span>';
    };

    // Función auxiliar para obtener badge de estado (HTML para PDF; sin emojis)
    const getEstadoBadge = (estado) => {
      const estados = {
        'pendiente': '<span class="status-badge status-pendiente">Pendiente</span>',
        'en_revision': '<span class="status-badge status-revision">En Revisión</span>',
        'aprobado': '<span class="status-badge status-aprobado">Aprobado</span>',
        'rechazado': '<span class="status-badge status-rechazado">Rechazado</span>'
      };
      return estados[estado] || '<span class="status-badge status-pendiente">' + estado + '</span>';
    };

    // Función para generar HTML de un reporte
    const generateReportHTML = (report) => {
      const tipoReporte = report.tipo_reporte;
      const asunto = report.asunto || report.asunto_conversacion || 'Sin asunto';
      
      let infoFields = '';
      
      // Campos comunes
      infoFields += `
        <div class="info-item">
          <div class="info-label">Usuario</div>
          <div class="info-value">${report.nombre_usuario || 'N/A'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Proyecto</div>
          <div class="info-value">${report.proyecto_usuario || 'N/A'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Fecha del Evento</div>
          <div class="info-value">${report.fecha_evento || 'N/A'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Creado el</div>
          <div class="info-value">${new Date(report.creado_en).toLocaleDateString('es-ES')}</div>
        </div>
      `;

      // Campos específicos por tipo
      if (tipoReporte === 'hallazgos') {
        infoFields += `
          <div class="info-item">
            <div class="info-label">Lugar del Hallazgo</div>
            <div class="info-value">${report.lugar_hallazgo || 'N/A'} ${report.lugar_hallazgo_otro ? '- ' + report.lugar_hallazgo_otro : ''}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Tipo de Hallazgo</div>
            <div class="info-value">${report.tipo_hallazgo || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Estado Condición</div>
            <div class="info-value">${report.estado_condicion || 'N/A'}</div>
          </div>
        `;
      } else if (tipoReporte === 'incidentes') {
        infoFields += `
          <div class="info-item">
            <div class="info-label">Grado de Criticidad</div>
            <div class="info-value">${report.grado_criticidad || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">📍 Ubicación del Incidente</div>
            <div class="info-value">${report.ubicacion_incidente || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">🕐 Hora del Evento</div>
            <div class="info-value">${report.hora_evento || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">🎯 Tipo de Afectación</div>
            <div class="info-value">${report.tipo_afectacion || 'N/A'}</div>
          </div>
        `;
      } else if (tipoReporte === 'conversaciones') {
        infoFields += `
          <div class="info-item">
            <div class="info-label">💬 Tipo de Conversación</div>
            <div class="info-value">${report.tipo_conversacion || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Sitio del Evento</div>
            <div class="info-value">${report.sitio_evento_conversacion || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Lugar</div>
            <div class="info-value">${report.lugar_hallazgo_conversacion || 'N/A'} ${report.lugar_hallazgo_conversacion_otro ? '- ' + report.lugar_hallazgo_conversacion_otro : ''}</div>
          </div>
        `;
      } else if (tipoReporte === 'pqr') {
        infoFields += `
          <div class="info-item">
            <div class="info-label">Tipo de PQR</div>
            <div class="info-value">${report.tipo_pqr || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Teléfono</div>
            <div class="info-value">${report.telefono_contacto || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Correo</div>
            <div class="info-value">${report.correo_contacto || 'N/A'}</div>
          </div>
        `;
      }

      // Descripción
      const descripcion = report.descripcion_hallazgo || report.descripcion_incidente || report.descripcion_conversacion || 'Sin descripción';
      const recomendaciones = report.recomendaciones || '';
      const comentarios = report.comentarios_revision || '';

      // Evidencias
      let evidenciasHTML = '';
      if (report.evidencias && report.evidencias.length > 0) {
        evidenciasHTML = `
          <div class="evidence-section">
            <div class="evidence-title">Evidencias Fotográficas</div>
            <div class="evidence-grid">
              ${report.evidencias.map(ev => `
                <div class="evidence-item">
                  <img src="${ev.cdn_url || ev.url_archivo}" alt="Evidencia" class="evidence-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
                  <p style="display:none; text-align:center; padding:20px; color:#718096;">Imagen no disponible</p>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      return `
        <div class="report-card">
          <div class="report-header">
            <div class="report-title">${asunto}</div>
            <div class="report-meta">
              ${getTipoBadge(tipoReporte)} 
              ${getEstadoBadge(report.estado)}
              <span style="margin-left: 10px;">ID: #${report.id}</span>
            </div>
          </div>
          
          <div class="info-grid">
            ${infoFields}
          </div>

          <div class="description-box">
            <div class="description-title">Descripción</div>
            <div class="description-text">${descripcion}</div>
          </div>

          ${recomendaciones ? `
            <div class="description-box" style="border-left-color: #10b981;">
              <div class="description-title">Recomendaciones</div>
              <div class="description-text">${recomendaciones}</div>
            </div>
          ` : ''}

          ${comentarios ? `
            <div class="description-box" style="border-left-color: #3b82f6;">
              <div class="description-title">Comentarios de Revisión</div>
              <div class="description-text">${comentarios}</div>
              ${report.nombre_revisor ? `<p style="margin-top: 8px; font-size: 12px; color: #718096;"><strong>Revisado por:</strong> ${report.nombre_revisor} - ${new Date(report.fecha_revision).toLocaleDateString('es-ES')}</p>` : ''}
            </div>
          ` : ''}

          ${evidenciasHTML}
        </div>
      `;
    };

    // Generar HTML para todos los reportes
    const reportesHTML = allReports.length > 0 
      ? allReports.map(report => generateReportHTML(report)).join('')
      : '<p style="text-align: center; padding: 40px; color: #718096; font-size: 16px;">No hay reportes disponibles</p>';
    


    const html = `
      <!doctype html><html><head><meta charset="utf-8"/>${estilos}</head>
      <body>
        <div class="no-print" style="text-align:right;margin-bottom:16px;">
          <button onclick="window.print()" style="padding:12px 20px;border:none;border-radius:8px;background:linear-gradient(135deg, #3182ce 0%, #2c5282 100%);color:#fff;font-weight:600;cursor:pointer;box-shadow:0 2px 4px rgba(0,0,0,0.2);">Imprimir / Guardar PDF</button>
        </div>
        
        <h1>${title}</h1>
        
        <div class="header-info">
          <p style="margin: 8px 0; font-size: 14px; color: #4a5568;"><strong>Generado:</strong> ${generatedAt}</p>
          <p style="margin: 8px 0; font-size: 14px; color: #4a5568;"><strong>Total de Reportes:</strong> ${allReports.length}</p>
          <p style="margin: 8px 0; font-size: 13px; color: #718096;">Sistema de Gestión de Seguridad, Salud Ocupacional y Medio Ambiente - Meridian Colombia</p>
        </div>

        ${reportesHTML}
        
        <div style="margin-top: 40px; padding: 20px; background: #f7fafc; border-radius: 8px; text-align: center; border-left: 4px solid #3182ce;">
          <p style="margin: 0; color: #4a5568; font-size: 12px;">
            <strong>Reporte generado automáticamente por el Sistema HSEQ</strong><br>
            Meridian Colombia - Sistema de Gestión de Seguridad, Salud Ocupacional y Medio Ambiente
          </p>
        </div>
      </body></html>`;

    const w = window.open('', '_blank');
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
  }, [stats, selectedPeriod, reportService, userService]);

  const handleDownloadExcel = useCallback(async (customFilters = {}, fileNamePrefix = '') => {

     // Obtener todos los reportes con información completa y filtros aplicados
     let reportesDetallados = [];
     try {
       console.log('Obteniendo reportes con filtros:', customFilters);
       
       // Combinar filtros personalizados con configuración de paginación
       const queryParams = {
         per_page: 10000,
         page: 1,
         ...customFilters
       };
       
       const resp = await reportService.getAllReports(queryParams);
       console.log('Respuesta del servidor:', resp);
       
       // Manejar diferentes estructuras de respuesta
       let reports = [];
       if (resp?.success && Array.isArray(resp.reports)) {
         reports = resp.reports;
       } else if (Array.isArray(resp)) {
         reports = resp;
       } else if (resp?.data && Array.isArray(resp.data)) {
         reports = resp.data;
       } else if (resp?.reports && Array.isArray(resp.reports)) {
         reports = resp.reports;
       }
       
       console.log('Reportes procesados:', reports.length);
       
       if (reports.length > 0) {
         reportesDetallados = reports.map((r) => {
           const baseInfo = {
             ID: r.id,
             TipoReporte: r.tipo_reporte,
             Estado: r.estado,
             Usuario: r.nombre_usuario || '',
             Proceso: r.proyecto_usuario || '',
             Asunto: r.asunto || r.asunto_conversacion || '',
             FechaEvento: r.fecha_evento || '',
             FechaCreacion: r.creado_en ? new Date(r.creado_en).toLocaleDateString('es-ES') : '',
           };

           // Campos específicos según tipo de reporte
           if (r.tipo_reporte === 'hallazgos') {
             return {
               ...baseInfo,
               LugarHallazgo: r.lugar_hallazgo || '',
               LugarHallazgoOtro: r.lugar_hallazgo_otro || '',
               TipoHallazgo: r.tipo_hallazgo || '',
               EstadoCondicion: r.estado_condicion || '',
               Descripcion: r.descripcion_hallazgo || '',
               Recomendaciones: r.recomendaciones || '',
               ComentariosRevision: r.comentarios_revision || '',
               Revisor: r.nombre_revisor || '',
               FechaRevision: r.fecha_revision ? new Date(r.fecha_revision).toLocaleDateString('es-ES') : '',
               Evidencias: r.evidencias && r.evidencias.length > 0 ? r.evidencias.map(ev => ev.cdn_url || ev.url_archivo).join('; ') : 'Sin evidencias',
               // Mantener referencias a evidencias para procesamiento de imágenes
               _evidencias: r.evidencias || []
             };
           } else if (r.tipo_reporte === 'incidentes') {
             return {
               ...baseInfo,
               GradoCriticidad: r.grado_criticidad || '',
               UbicacionIncidente: r.ubicacion_incidente || '',
               HoraEvento: r.hora_evento || '',
               TipoAfectacion: r.tipo_afectacion || '',
               Descripcion: r.descripcion_incidente || '',
               Recomendaciones: r.recomendaciones || '',
               ComentariosRevision: r.comentarios_revision || '',
               Revisor: r.nombre_revisor || '',
               FechaRevision: r.fecha_revision ? new Date(r.fecha_revision).toLocaleDateString('es-ES') : '',
               Evidencias: r.evidencias && r.evidencias.length > 0 ? r.evidencias.map(ev => ev.cdn_url || ev.url_archivo).join('; ') : 'Sin evidencias',
               // Mantener referencias a evidencias para procesamiento de imágenes
               _evidencias: r.evidencias || []
             };
           } else if (r.tipo_reporte === 'conversaciones') {
             return {
               ...baseInfo,
               TipoConversacion: r.tipo_conversacion || '',
               SitioEvento: r.sitio_evento_conversacion || '',
               LugarConversacion: r.lugar_hallazgo_conversacion || '',
               LugarConversacionOtro: r.lugar_hallazgo_conversacion_otro || '',
               Descripcion: r.descripcion_conversacion || '',
               ComentariosRevision: r.comentarios_revision || '',
               Revisor: r.nombre_revisor || '',
               FechaRevision: r.fecha_revision ? new Date(r.fecha_revision).toLocaleDateString('es-ES') : '',
               Evidencias: r.evidencias && r.evidencias.length > 0 ? r.evidencias.map(ev => ev.cdn_url || ev.url_archivo).join('; ') : 'Sin evidencias',
               // Mantener referencias a evidencias para procesamiento de imágenes
               _evidencias: r.evidencias || []
             };
           } else if (r.tipo_reporte === 'pqr') {
             return {
               ...baseInfo,
               TipoPQR: r.tipo_pqr || '',
               TelefonoContacto: r.telefono_contacto || '',
               CorreoContacto: r.correo_contacto || '',
               Descripcion: r.descripcion_hallazgo || '',
               ComentariosRevision: r.comentarios_revision || '',
               Revisor: r.nombre_revisor || '',
               FechaRevision: r.fecha_revision ? new Date(r.fecha_revision).toLocaleDateString('es-ES') : '',
               Evidencias: r.evidencias && r.evidencias.length > 0 ? r.evidencias.map(ev => ev.cdn_url || ev.url_archivo).join('; ') : 'Sin evidencias',
               // Mantener referencias a evidencias para procesamiento de imágenes
               _evidencias: r.evidencias || []
             };
           } else {
             return {
               ...baseInfo,
               Descripcion: r.descripcion_hallazgo || r.descripcion_incidente || r.descripcion_conversacion || '',
               ComentariosRevision: r.comentarios_revision || '',
               Revisor: r.nombre_revisor || '',
               FechaRevision: r.fecha_revision ? new Date(r.fecha_revision).toLocaleDateString('es-ES') : '',
               Evidencias: r.evidencias && r.evidencias.length > 0 ? r.evidencias.map(ev => ev.cdn_url || ev.url_archivo).join('; ') : 'Sin evidencias',
               // Mantener referencias a evidencias para procesamiento de imágenes
               _evidencias: r.evidencias || []
             };
           }
         });
       } else {
         console.log('No se encontraron reportes');
         alert('No se encontraron reportes para generar el Excel');
         return;
       }
     } catch (e) {
       console.error('Error obteniendo reportes:', e);
       alert('Error al obtener los reportes: ' + e.message);
       return;
     }

    // Sanear prefijo para filename
    const safePrefix = String(fileNamePrefix || '').trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\-]/g, '');
    const fileName = `${safePrefix ? safePrefix + '_' : ''}reportes_detallados_hseq_${new Date().toISOString().substring(0,10)}.xlsx`;

     // Funciones auxiliares para procesamiento de imágenes (copiadas de ReportDetailsModal)
     const isProbablyImageBlob = async (blob) => {
       try {
         const buf = await blob.slice(0, 12).arrayBuffer();
         const b = new Uint8Array(buf);
         // JPEG
         if (b[0]===0xFF && b[1]===0xD8 && b[2]===0xFF) return true;
         // PNG
         if (b[0]===0x89 && b[1]===0x50 && b[2]===0x4E && b[3]===0x47) return true;
         // GIF
         if (b[0]===0x47 && b[1]===0x49 && b[2]===0x46) return true;
         // WEBP (RIFF....WEBP)
         if (b[0]===0x52 && b[1]===0x49 && b[2]===0x46 && b[3]===0x46 && b[8]===0x57 && b[9]===0x45 && b[10]===0x42 && b[11]===0x50) return true;
       } catch {}
       return false;
     };

     const extToMime = (name='') => {
       const ext = String(name).toLowerCase().split('.').pop();
       const map = { jpg:'image/jpeg', jpeg:'image/jpeg', png:'image/png', gif:'image/gif', webp:'image/webp', bmp:'image/bmp' };
       return map[ext] || '';
     };

     const coerceImageBlobType = (blob, evObj) => {
       const mime = (blob?.type || '').toLowerCase();
       if (mime.startsWith('image/')) return blob;
       const forced = extToMime(evObj?.url_archivo || '');
       return forced ? new Blob([blob], { type: forced }) : blob;
     };

     const fetchApiImageBlob = async (id) => {
       const token = localStorage.getItem('token') || '';

       // 1) Authorization header
       let resp = await fetch(buildApi(`evidencias/${id}`), {
         method: 'GET',
         headers: { 'Accept': 'image/*', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
         credentials: 'include',
       });
       if (resp.ok) return await resp.blob();

       // 2) Fallback con ?token=
       resp = await fetch(buildApi(`evidencias/${id}?token=${encodeURIComponent(token)}`), {
         method: 'GET',
         headers: { 'Accept': 'image/*' },
         credentials: 'include',
       });
       if (!resp.ok) throw new Error(`API HTTP ${resp.status}`);
       return await resp.blob();
     };

     const getEvidenceBlob = async (evidenciaId, evObj) => {
       // 1) Intento URL pública
       try {
         const url = buildUploadsUrl(evObj.url_archivo);
         const resp = await fetch(url, { method: 'GET', headers: { 'Accept': 'image/*' }, mode: 'cors' });
         if (resp.ok) {
           let pubBlob = await resp.blob();
           pubBlob = coerceImageBlobType(pubBlob, evObj);
           if (await isProbablyImageBlob(pubBlob)) {
             return { blob: pubBlob, contentType: pubBlob.type || '' };
           }
         }
       } catch (_) {}

       // 2) Intento API autenticada
       try {
         let apiBlob = coerceImageBlobType(await fetchApiImageBlob(evidenciaId), evObj);
         if (!(await isProbablyImageBlob(apiBlob))) throw new Error('not-image');
         return { blob: apiBlob, contentType: apiBlob.type || '' };
       } catch (e2) {
         // 3) Último recurso: URL público sin validación
         const url = buildUploadsUrl(evObj.url_archivo);
         const resp = await fetch(url, { method: 'GET', headers: { 'Accept': 'image/*' } });
         if (!resp.ok) throw new Error(`Public HTTP ${resp.status}`);
         const pubBlob = coerceImageBlobType(await resp.blob(), evObj);
         return { blob: pubBlob, contentType: pubBlob.type || '' };
       }
     };

     const dataUrlToBase64 = (dataUrl) => dataUrl.split(',')[1] || '';

     // Try ExcelJS for styled tables
     try {
       const ExcelJSModule = await import('exceljs');
       const ExcelJS = ExcelJSModule.default || ExcelJSModule;
       const wb = new ExcelJS.Workbook();
       wb.creator = 'HSEQ';
       wb.created = new Date();

       // Función para limpiar datos antes de agregarlos al Excel
       const cleanDataForExcel = (data) => {
         return data.map(row => {
           const cleanRow = {};
           Object.keys(row).forEach(key => {
             const value = row[key];
             // Convertir valores problemáticos a strings seguros
             if (value === null || value === undefined) {
               cleanRow[key] = '';
             } else if (typeof value === 'object') {
               cleanRow[key] = JSON.stringify(value);
             } else {
               cleanRow[key] = String(value);
             }
           });
           return cleanRow;
         });
       };

       // Crear una sola hoja con todos los reportes detallados
       if (reportesDetallados.length > 0) {
         const ws = wb.addWorksheet('Reportes Detallados', { views: [{ state: 'frozen', ySplit: 1 }] });
         
         // Agregar título de la hoja
         const titleRow = ws.addRow(['REPORTES DETALLADOS HSEQ - MERIDIAN COLOMBIA']);
         titleRow.font = { bold: true, size: 18, color: { argb: 'FF2E5BBA' } };
         titleRow.alignment = { horizontal: 'center' };
         ws.mergeCells(`A1:${String.fromCharCode(65 + Object.keys(reportesDetallados[0]).length - 1)}1`);
         
         // Agregar información de generación
         const infoRow = ws.addRow([`Generado el: ${new Date().toLocaleString('es-ES')} | Total de reportes: ${reportesDetallados.length}`]);
         infoRow.font = { size: 12, color: { argb: 'FF666666' } };
         infoRow.alignment = { horizontal: 'center' };
         ws.mergeCells(`A2:${String.fromCharCode(65 + Object.keys(reportesDetallados[0]).length - 1)}2`);
         
         // Agregar línea en blanco
         ws.addRow([]);
         
         // Procesar cada reporte individualmente para incluir imágenes
         let currentRow = 4;
         
         for (let reportIndex = 0; reportIndex < reportesDetallados.length; reportIndex++) {
           const reporte = reportesDetallados[reportIndex];
           
           // Agregar encabezado del reporte
           const reportHeaderRow = ws.addRow([`REPORTE ${reporte.ID} - ${reporte.TipoReporte.toUpperCase()}`]);
           reportHeaderRow.font = { bold: true, size: 14, color: { argb: 'FF2E5BBA' } };
           reportHeaderRow.fill = { 
             type: 'pattern', 
             pattern: 'solid', 
             fgColor: { argb: 'FFF0F8FF' } 
           };
           ws.mergeCells(`A${currentRow}:H${currentRow}`);
           currentRow++;
           
           // Agregar información básica del reporte
           const basicInfo = [
             ['ID', reporte.ID],
             ['Tipo', reporte.TipoReporte],
             ['Estado', reporte.Estado],
             ['Usuario', reporte.Usuario],
             ['Proyecto', reporte.Proyecto],
             ['Asunto', reporte.Asunto],
             ['Fecha Evento', reporte.FechaEvento],
             ['Fecha Creación', reporte.FechaCreacion]
           ];
           
           basicInfo.forEach(([label, value]) => {
             ws.getCell(`A${currentRow}`).value = label;
             ws.getCell(`A${currentRow}`).font = { bold: true };
             ws.getCell(`B${currentRow}`).value = value;
             ws.mergeCells(`B${currentRow}:H${currentRow}`);
             currentRow++;
           });
           
           // Agregar campos específicos según tipo
           if (reporte.TipoReporte === 'hallazgos') {
             const specificInfo = [
               ['Lugar Hallazgo', reporte.LugarHallazgo],
               ['Tipo Hallazgo', reporte.TipoHallazgo],
               ['Estado Condición', reporte.EstadoCondicion],
               ['Descripción', reporte.Descripcion],
               ['Recomendaciones', reporte.Recomendaciones]
             ];
             specificInfo.forEach(([label, value]) => {
               if (value) {
                 ws.getCell(`A${currentRow}`).value = label;
                 ws.getCell(`A${currentRow}`).font = { bold: true };
                 ws.getCell(`B${currentRow}`).value = value;
                 ws.mergeCells(`B${currentRow}:H${currentRow}`);
                 currentRow++;
               }
             });
           } else if (reporte.TipoReporte === 'incidentes') {
             const specificInfo = [
               ['Grado Criticidad', reporte.GradoCriticidad],
               ['Ubicación', reporte.UbicacionIncidente],
               ['Hora Evento', reporte.HoraEvento],
               ['Tipo Afectación', reporte.TipoAfectacion],
               ['Descripción', reporte.Descripcion]
             ];
             specificInfo.forEach(([label, value]) => {
               if (value) {
                 ws.getCell(`A${currentRow}`).value = label;
                 ws.getCell(`A${currentRow}`).font = { bold: true };
                 ws.getCell(`B${currentRow}`).value = value;
                 ws.mergeCells(`B${currentRow}:H${currentRow}`);
                 currentRow++;
               }
             });
           } else if (reporte.TipoReporte === 'conversaciones') {
             const specificInfo = [
               ['Tipo Conversación', reporte.TipoConversacion],
               ['Sitio Evento', reporte.SitioEvento],
               ['Lugar Conversación', reporte.LugarConversacion],
               ['Descripción', reporte.Descripcion]
             ];
             specificInfo.forEach(([label, value]) => {
               if (value) {
                 ws.getCell(`A${currentRow}`).value = label;
                 ws.getCell(`A${currentRow}`).font = { bold: true };
                 ws.getCell(`B${currentRow}`).value = value;
                 ws.mergeCells(`B${currentRow}:H${currentRow}`);
                 currentRow++;
               }
             });
           } else if (reporte.TipoReporte === 'pqr') {
             const specificInfo = [
               ['Tipo PQR', reporte.TipoPQR],
               ['Teléfono Contacto', reporte.TelefonoContacto],
               ['Correo Contacto', reporte.CorreoContacto],
               ['Descripción', reporte.Descripcion]
             ];
             specificInfo.forEach(([label, value]) => {
               if (value) {
                 ws.getCell(`A${currentRow}`).value = label;
                 ws.getCell(`A${currentRow}`).font = { bold: true };
                 ws.getCell(`B${currentRow}`).value = value;
                 ws.mergeCells(`B${currentRow}:H${currentRow}`);
                 currentRow++;
               }
             });
           }
           
           // Agregar información de revisión si existe
           if (reporte.ComentariosRevision || reporte.FechaRevision) {
             currentRow++;
             ws.getCell(`A${currentRow}`).value = 'INFORMACIÓN DE REVISIÓN';
             ws.getCell(`A${currentRow}`).font = { bold: true, size: 12, color: { argb: 'FF2E5BBA' } };
             ws.mergeCells(`A${currentRow}:H${currentRow}`);
             currentRow++;
             
             if (reporte.FechaRevision) {
               ws.getCell(`A${currentRow}`).value = 'Fecha Revisión';
               ws.getCell(`A${currentRow}`).font = { bold: true };
               ws.getCell(`B${currentRow}`).value = reporte.FechaRevision;
               ws.mergeCells(`B${currentRow}:H${currentRow}`);
               currentRow++;
             }
             
             if (reporte.ComentariosRevision) {
               ws.getCell(`A${currentRow}`).value = 'Comentarios';
               ws.getCell(`A${currentRow}`).font = { bold: true };
               ws.getCell(`B${currentRow}`).value = reporte.ComentariosRevision;
               ws.mergeCells(`B${currentRow}:H${currentRow}`);
               currentRow++;
             }
           }
           
           // PROCESAR EVIDENCIAS (SIN IMÁGENES TEMPORALMENTE)
           if (reporte._evidencias && reporte._evidencias.length > 0) {
             currentRow++;
             ws.getCell(`A${currentRow}`).value = `EVIDENCIAS (${reporte._evidencias.length})`;
             ws.getCell(`A${currentRow}`).font = { bold: true, size: 12, color: { argb: 'FF2E5BBA' } };
             ws.mergeCells(`A${currentRow}:H${currentRow}`);
             currentRow++;
             
             for (let evIndex = 0; evIndex < reporte._evidencias.length; evIndex++) {
               const evidencia = reporte._evidencias[evIndex];
               
               // Solo mostrar información de la evidencia
               ws.getCell(`A${currentRow}`).value = `Evidencia ${evIndex + 1}`;
               ws.getCell(`A${currentRow}`).font = { bold: true };
               ws.getCell(`B${currentRow}`).value = evidencia.nombre_archivo || evidencia.url_archivo || 'Sin nombre';
               ws.mergeCells(`B${currentRow}:H${currentRow}`);
               currentRow++;
             }
           }
           
           // Agregar separador entre reportes
           currentRow += 2;
           ws.getCell(`A${currentRow}`).value = '─'.repeat(50);
           ws.getCell(`A${currentRow}`).font = { color: { argb: 'FFCCCCCC' } };
           ws.mergeCells(`A${currentRow}:H${currentRow}`);
           currentRow += 2;
         }
         
         // Ajustar ancho de columnas
         ws.getColumn('A').width = 20;
         ws.getColumn('B').width = 50;
         ws.getColumn('C').width = 15;
         ws.getColumn('D').width = 15;
         ws.getColumn('E').width = 15;
         ws.getColumn('F').width = 15;
         ws.getColumn('G').width = 15;
         ws.getColumn('H').width = 15;
       }

       const buffer = await wb.xlsx.writeBuffer();
       const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
       const link = document.createElement('a');
       link.href = URL.createObjectURL(blob);
       link.download = fileName;
       document.body.appendChild(link);
       link.click();
       document.body.removeChild(link);
       
       // Mostrar mensaje de éxito con estadísticas
       const totalEvidencias = reportesDetallados.reduce((acc, r) => acc + (r._evidencias?.length || 0), 0);
       const evidenciasImagenes = reportesDetallados.reduce((acc, r) => {
         if (r._evidencias) {
           return acc + r._evidencias.filter(ev => 
             (ev.tipo_archivo && ev.tipo_archivo.startsWith('image/')) ||
             /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(ev.url_archivo || ev.nombre_archivo || '')
           ).length;
         }
         return acc;
       }, 0);
       
       alert(`Excel generado exitosamente con ${reportesDetallados.length} reportes y ${totalEvidencias} evidencias (sin imágenes embebidas temporalmente).`);
       return;
     } catch (e) {
       // continue to xlsx fallback
     }

     // Fallback: xlsx simple
     try {
       const XLSXModule = await import('xlsx');
       const XLSX = XLSXModule.default || XLSXModule;
       const wb = XLSX.utils.book_new();
       
       // Función para limpiar datos para XLSX
       const cleanDataForXLSX = (data) => {
         return data.map(row => {
           const cleanRow = {};
           Object.keys(row).forEach(key => {
             const value = row[key];
             if (value === null || value === undefined) {
               cleanRow[key] = '';
             } else if (typeof value === 'object') {
               cleanRow[key] = JSON.stringify(value);
             } else {
               cleanRow[key] = String(value);
             }
           });
           return cleanRow;
         });
       };
       
       // Solo agregar la hoja de reportes detallados
       if (reportesDetallados.length > 0) {
         XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(cleanDataForXLSX(reportesDetallados)), 'Reportes Detallados');
       }
       
       XLSX.writeFile(wb, fileName);
       return;
     } catch (e) {
       // Last-resort CSV
       if (reportesDetallados.length > 0) {
         const header = Object.keys(reportesDetallados[0]);
         const rows = [header.join(','), ...reportesDetallados.map(r => header.map(h => `${(r[h] ?? '').toString().replaceAll('"','""')}`).join(','))];
         const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
         const link = document.createElement('a');
         link.href = URL.createObjectURL(blob);
         link.download = fileName.replace('.xlsx','.csv');
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
       }
     }
  }, [stats, selectedPeriod, reportService, userService]);

  const handleDownloadExcelWithFilters = useCallback(async () => {
    // Limpiar filtros vacíos y mapear proceso a proyecto para el backend
    const cleanFilters = {};
    Object.keys(excelFilters).forEach(key => {
      if (excelFilters[key] !== '') {
        // Mapear 'proceso' a 'proyecto' para el backend (mapeo de Gestiones a Proyectos)
        if (key === 'proceso') {
          if (excelFilters[key] === 'petroservicios') {
            // Gestión Proyecto - Petroservicios
            cleanFilters['proyecto'] = 'PETROSERVICIOS';
          } else if (excelFilters[key] === 'administrativa') {
            // Gestión Administrativa
            cleanFilters['proyecto'] = 'ADMINISTRACION,COMPANY MAN - ADMINISTRACION,ADMINISTRACION - STAFF,FRONTERA - ADMINISTRACION,Administrativo,PETROSERVICIOS - ADMINISTRACION,ADMINISTRACION COMPANY MAN';
          } else if (excelFilters[key] === 'company-man') {
            // Gestión Proyecto - Company man
            cleanFilters['proyecto'] = '3047761-4,COMPANY MAN - APIAY,COMPANY MAN,COMPANY MAN - CPO09,COMPANY MAN - GGS,COMPANY MAN - CASTILLA';
          } else if (excelFilters[key] === 'frontera') {
            // Gestión Proyecto Frontera
            cleanFilters['proyecto'] = 'FRONTERA';
          } else if (excelFilters[key] === 'zircon') {
            // Gestión Proyecto ZIRCON
            cleanFilters['proyecto'] = 'ZIRCON';
          }
        } else {
          cleanFilters[key] = excelFilters[key];
        }
      }
    });
    
    setShowExcelFiltersModal(false);
    await handleDownloadExcel(cleanFilters);
  }, [excelFilters, handleDownloadExcel]);

  // Exportar: Conteo de reportes por usuario (quién reportó más)
  const handleDownloadExcelUserCounts = useCallback(async () => {
    try {
      // Obtener gran cantidad de reportes (sin filtros adicionales)
      const queryParams = { per_page: 10000, page: 1 };
      const resp = await reportService.getAllReports(queryParams);
      if (!resp || !resp.success || !Array.isArray(resp.reports) || resp.reports.length === 0) {
        alert('No se encontraron reportes para generar el resumen por usuario');
        return;
      }

      // Agrupar por usuario que reportó
      const countsByUserId = new Map();
      resp.reports.forEach(r => {
        const userId = r.id_usuario ?? 'desconocido';
        const userName = r.nombre_usuario ?? 'Desconocido';
        if (!countsByUserId.has(userId)) {
          countsByUserId.set(userId, { id_usuario: userId, nombre_usuario: userName, cantidad_reportes: 0 });
        }
        countsByUserId.get(userId).cantidad_reportes += 1;
      });

      // Ordenar descendente por cantidad
      const rows = Array.from(countsByUserId.values()).sort((a, b) => b.cantidad_reportes - a.cantidad_reportes);

      const fileName = `reportes_por_usuario_${new Date().toISOString().substring(0,10)}.xlsx`;

      try {
        // ExcelJS con encabezados bonitos
        const ExcelJSModule = await import('exceljs');
        const ExcelJS = ExcelJSModule.default || ExcelJSModule;
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet('Reporte por Usuario');
        ws.columns = [
          { header: 'ID Usuario', key: 'id_usuario', width: 14 },
          { header: 'Nombre Usuario', key: 'nombre_usuario', width: 36 },
          { header: 'Total de Reportes', key: 'cantidad_reportes', width: 22 }
        ];
        ws.addRows(rows);
        // Estilos mínimos
        ws.getRow(1).font = { bold: true };
        ws.getRow(1).alignment = { horizontal: 'center' };
        ws.eachRow((row, idx) => {
          row.alignment = { vertical: 'middle' };
          if (idx % 2 === 0) {
            row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0B1220' } };
          }
        });
        const buffer = await wb.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(link.href), 1000);
        return;
      } catch (err) {
        // Fallback a xlsx simple
      }

      const XLSXModule = await import('xlsx');
      const XLSX = XLSXModule.default || XLSXModule;
      const wb = XLSX.utils.book_new();
      const sheet = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, sheet, 'Reporte por Usuario');
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      alert('Error al generar Excel por usuario: ' + (error?.message || String(error)));
    }
  }, [reportService]);

  const handleOpenExcelFiltersModal = useCallback(() => {
    setShowExcelFiltersModal(true);
  }, []);

  // Bar chart: Cantidad de reportes por proceso/área
  const reportsByProcess = useMemo(() => {
    // Si hay reportes cargados, agruparlos por proceso
    if (reportsForProcessChart.length > 0) {
      const processMap = new Map();
      
      reportsForProcessChart.forEach(report => {
        const proyecto = report.proyecto_usuario || '';
        const proceso = getProcesoFromProyecto(proyecto);
        
        if (!processMap.has(proceso)) {
          processMap.set(proceso, 0);
        }
        processMap.set(proceso, processMap.get(proceso) + 1);
      });
      
      // Convertir a array y ordenar por cantidad descendente
      return Array.from(processMap.entries())
        .map(([proceso, total]) => ({ proceso, total }))
        .sort((a, b) => b.total - a.total);
    }
    
    // Fallback: intentar usar datos del backend si existen
    const rows = stats?.reportesPorProceso || stats?.reportes_por_proceso || [];
    if (!Array.isArray(rows)) return [];

    return rows.map((r) => ({
      proceso: r.proceso || r.area || r.nombre || 'Sin proceso',
      total: Number(r.total) || Number(r.cantidad) || Number(r.count) || 0,
    }));
  }, [reportsForProcessChart, stats?.reportesPorProceso, stats?.reportes_por_proceso]);

  const processLeftMargin = useMemo(() => {
    const maxLen = Math.max(...(reportsByProcess.map(r => String(r.proceso || '').length)), 10);
    return Math.min(340, 70 + maxLen * 7);
  }, [reportsByProcess]);

  // Pie: Efectividad de cierre (cerrados a tiempo ≤15 días vs no cerrados a tiempo >16 días)
  const closureEffectiveness = useMemo(() => {
    const mk = (label, value, color) => ({ id: label, label, value, color });

    if (!Array.isArray(closedReports) || closedReports.length === 0) {
      return [
        mk('Cerrados a tiempo (≤15 días)', 0, '#22c55e'),
        mk('No cerrados a tiempo (>16 días)', 0, '#ef4444'),
      ];
    }

    let cerradosATiempo = 0;
    let noCerradosATiempo = 0;

    closedReports.forEach(report => {
      const fechaCreacion = report.creado_en ? new Date(report.creado_en) : null;
      const fechaCierre = report.fecha_cierre
        ? new Date(report.fecha_cierre)
        : (report.actualizado_en ? new Date(report.actualizado_en) : null);

      if (fechaCreacion && fechaCierre && !isNaN(fechaCreacion.getTime()) && !isNaN(fechaCierre.getTime())) {
        const diffDays = Math.ceil((fechaCierre - fechaCreacion) / (1000 * 60 * 60 * 24));
        if (diffDays <= 15) cerradosATiempo++;
        else noCerradosATiempo++;
      }
    });

    return [
      mk('Cerrados a tiempo (≤15 días)', cerradosATiempo, '#22c55e'),
      mk('No cerrados a tiempo (>16 días)', noCerradosATiempo, '#ef4444'),
    ];
  }, [closedReports]);

  // Pie: Distribución por tipo filtrada por periodo
  const incidentsByType = useMemo(() => {
    const colors = {
      incidentes: '#ef4444',
      hallazgos: '#eab308',
      conversaciones: '#3b82f6',
      pqr: '#a855f7'
    };
    const labelCap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    // Si es 'Todos', usar los datos del backend directamente si existen
    if (selectedPeriod === 'year' && Array.isArray(stats?.distribucionTipo)) {
      return stats.distribucionTipo.map(t => ({
        id: t.tipo_reporte,
        label: labelCap(t.tipo_reporte),
        value: Number(t.cantidad),
        color: t.color || colors[t.tipo_reporte] || '#8884d8'
      }));
    }
    // Sumar los valores de incidentsByMonth por tipo
    const sum = { incidentes: 0, hallazgos: 0, conversaciones: 0, pqr: 0 };
    incidentsByMonth.forEach(r => {
      sum.incidentes += Number(r.incidentes) || 0;
      sum.hallazgos += Number(r.hallazgos) || 0;
      sum.conversaciones += Number(r.conversaciones) || 0;
      sum.pqr += Number(r.pqr) || 0;
    });
    return Object.entries(sum).map(([k, v]) => ({ id: k, label: labelCap(k), value: v, color: colors[k] }));
  }, [stats?.distribucionTipo, incidentsByMonth, selectedPeriod]);

  const reportesResumenChart = useMemo(() => {
    // Usar KPIs del backend (ya filtrados por periodo si no es 'Todos')
    const pendientes = Number(stats?.kpis?.pendientes) || 0;
    const enRevision = Number(stats?.kpis?.en_revision) || 0;
    const aprobados = Number(stats?.kpis?.aprobados) || 0;
    const rechazados = Number(stats?.kpis?.rechazados) || 0;
    return [{ estado: 'Reportes', Pendientes: pendientes, 'En Revisión': enRevision, Aprobados: aprobados, Rechazados: rechazados }];
  }, [stats?.kpis, selectedPeriod]);

  return (
    <>
      <Header />
      <div className="min-h-screen" style={{
        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 35%, var(--color-tertiary-dark) 100%)'
      }}>
        {/* Main Content Container */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-24 md:pt-28 transition-all duration-500" style={{ maxWidth: '1280px' }}>

          {/* Welcome Section */}
          {user && (
            <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="text-center py-8 px-6 rounded-2xl bg-gradient-to-b from-gray-800/40 to-gray-900/60 border border-gray-700 backdrop-blur-sm" style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 tracking-tight text-white drop-shadow-md">
                  ¡Bienvenido, {getUserName()}!
                </h1>
                <p className="text-sm md:text-base text-gray-300 font-medium tracking-wide">
                  Plataforma HSEQ — Sistema de Gestión de Seguridad y Calidad
                </p>
              </div>

              {/* User Information Card - Redesigned */}
                <div className="mt-8 transition-all duration-1000 delay-300">
                <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-700 overflow-hidden" style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}>
                  {/* Header Section with Avatar */}
                  <div className="relative p-4 md:p-8 text-center bg-gray-800/50 border-b border-gray-700">
                    
                    {/* Avatar and User Info */}
                    <div className="relative z-10">
                      <div className="w-16 h-16 md:w-24 md:h-24 rounded-full mx-auto mb-3 md:mb-4 flex items-center justify-center relative group bg-gray-700 border-2 border-gray-600">
                        <svg className="w-8 h-8 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-secondary)' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <div 
                          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: 'linear-gradient(135deg, rgba(244, 211, 94, 0.2) 0%, rgba(99, 201, 219, 0.2) 100%)'
                          }}
                        ></div>
                      </div>
                      <h3 className="text-xl md:text-3xl font-bold mb-2" style={{ color: 'var(--color-secondary)' }}>
                        {user.nombre}
                      </h3>
                      <span 
                        className="inline-block px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-bold capitalize"
                        style={{
                          backgroundColor: isAdmin() ? 'rgba(220, 38, 38, 0.2)' : 
                                         'rgba(34, 197, 94, 0.2)',
                          color: isAdmin() ? '#fca5a5' : 
                                 '#86efac',
                          border: '1px solid rgba(252, 247, 255, 0.2)'
                        }}
                      >
                        {user.rol}
                      </span>
                    </div>
                  </div>

                  {/* User Details Grid */}
                  <div className="p-4 md:p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 dashboard-grid">
                      {/* Personal Information */}
                      <div className="space-y-4 dashboard-section w-full">
                        <h4 className="text-lg font-semibold mb-4 flex items-center" style={{ color: 'var(--color-secondary)' }}>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Información Personal
                        </h4>
                        <div className="space-y-3">
                          <div className="bg-white bg-opacity-5 rounded-xl p-4 border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300 dashboard-card w-full">
                            <p className="text-xs font-medium mb-1" style={{ color: 'rgba(252, 247, 255, 0.6)' }}>NOMBRE COMPLETO</p>
                            <div className="dashboard-card-content overflow-hidden max-w-full">
                              <p className="text-lg font-semibold break-words w-full" style={{ color: 'var(--color-secondary)', overflowWrap: 'anywhere' }} title={user.nombre}>{user.nombre}</p>
                            </div>
                          </div>
                          <div className="bg-white bg-opacity-5 rounded-xl p-4 border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300 dashboard-card w-full">
                            <p className="text-xs font-medium mb-1" style={{ color: 'rgba(252, 247, 255, 0.6)' }}>DOCUMENTO</p>
                            <div className="dashboard-card-content overflow-hidden max-w-full">
                              <p className="text-lg font-semibold break-words w-full" style={{ color: 'var(--color-secondary)', overflowWrap: 'anywhere' }} title={user.cedula}>{user.cedula}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-4 dashboard-section w-full">
                        <h4 className="text-lg font-semibold mb-4 flex items-center" style={{ color: 'var(--color-secondary)' }}>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Información de Contacto
                        </h4>
                        <div className="space-y-3">
                          <div className="bg-white bg-opacity-5 rounded-xl p-4 border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300 dashboard-card w-full">
                            <p className="text-xs font-medium mb-1" style={{ color: 'rgba(252, 247, 255, 0.6)' }}>CORREO ELECTRÓNICO</p>
                            <div className="dashboard-card-content overflow-hidden max-w-full">
                              <p className="text-lg font-semibold break-words w-full" style={{ color: 'var(--color-secondary)', overflowWrap: 'anywhere' }} title={user.correo}>{user.correo}</p>
                            </div>
                          </div>
                          <div className="bg-white bg-opacity-5 rounded-xl p-4 border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300 dashboard-card w-full">
                            <p className="text-xs font-medium mb-1" style={{ color: 'rgba(252, 247, 255, 0.6)' }}>ESTADO</p>
                            <div className="dashboard-card-content">
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#22c55e' }}></div>
                                <p className="text-sm font-medium" style={{ color: '#86efac' }}>Activo</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* System Information */}
                      <div className="space-y-4 dashboard-section w-full">
                        <h4 className="text-lg font-semibold mb-4 flex items-center" style={{ color: 'var(--color-secondary)' }}>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Información del Sistema
                        </h4>
                        <div className="space-y-3">
                          <div className="bg-white bg-opacity-5 rounded-xl p-4 border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300 dashboard-card w-full">
                            <p className="text-xs font-medium mb-1" style={{ color: 'rgba(252, 247, 255, 0.6)' }}>ROL DEL SISTEMA</p>
                            <div className="dashboard-card-content">
                              <div className="flex justify-center">
                                <span 
                                  className="px-3 py-1 rounded-full text-sm font-bold capitalize text-center"
                                  style={{
                                    backgroundColor: isAdmin() ? 'rgba(220, 38, 38, 0.2)' : 
                                                   'rgba(34, 197, 94, 0.2)',
                                    color: isAdmin() ? '#fca5a5' : 
                                           '#86efac',
                                    border: '1px solid rgba(252, 247, 255, 0.2)'
                                  }}
                                >
                                  {user.rol}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="bg-white bg-opacity-5 rounded-xl p-4 border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300 dashboard-card w-full">
                            <p className="text-xs font-medium mb-1" style={{ color: 'rgba(252, 247, 255, 0.6)' }}>ÚLTIMO ACCESO</p>
                            <div className="dashboard-card-content overflow-hidden max-w-full">
                              <p className="text-sm font-medium break-words w-full" style={{ color: 'var(--color-secondary)', overflowWrap: 'anywhere' }} title={new Date().toLocaleDateString('es-ES', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}>
                                {new Date().toLocaleDateString('es-ES', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Period Filter */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex flex-wrap justify-center gap-3 mb-3">
              {['month', 'quarter', 'year'].map((period) => (
                <button
                  key={period}
                  onClick={() => {
                    console.log('Click en período:', period);
                    handlePeriodChange(period);
                  }}
                  disabled={loading}
                  className={`py-2 px-3 md:px-4 rounded-lg font-semibold transition-all duration-300 text-sm md:text-base ${
                    selectedPeriod === period ? 'scale-105 ring-2 ring-white ring-opacity-50' : 'hover:scale-105'
                  } ${loading ? 'opacity-70 cursor-wait' : ''}`}
                  style={{
                    backgroundColor: selectedPeriod === period 
                      ? 'var(--color-tertiary)' 
                      : 'rgba(252, 247, 255, 0.15)',
                    color: selectedPeriod === period 
                      ? 'var(--color-dark)' 
                      : 'var(--color-secondary)',
                    border: '1px solid rgba(252, 247, 255, 0.3)',
                    boxShadow: selectedPeriod === period ? '0 4px 12px rgba(0,0,0,0.3)' : 'none'
                  }}
                >
                  {loading && selectedPeriod === period ? (
                    <>
                      <svg className="inline w-4 h-4 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Cargando...
                    </>
                  ) : (
                  period === 'month' ? 'Mensual' : period === 'quarter' ? 'Trimestral' : 'Anual'
                  )}
                </button>
              ))}
            </div>
            {/* Indicador visual del período activo */}
            {selectedPeriod && (
              <div className={`text-sm text-gray-300 bg-gray-800/50 px-4 py-2 rounded-lg border transition-all duration-300 ${
                loading ? 'border-yellow-500 animate-pulse' : 'border-gray-700'
              }`}>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">Período activo: </span>
                  <span className={`inline-flex items-center gap-2 font-bold ${
                    selectedPeriod === 'month' ? 'text-blue-300' :
                    selectedPeriod === 'quarter' ? 'text-green-300' :
                    'text-orange-300'
                  }`}>
                    {selectedPeriod === 'month' ? <><Calendar className="w-4 h-4" /> Mes actual</> :
                     selectedPeriod === 'quarter' ? <><BarChart2 className="w-4 h-4" /> Trimestre actual</> :
                     <><TrendingUp className="w-4 h-4" /> Año actual</>}
                  </span>
                  {loading ? (
                    <span className="ml-3 inline-flex items-center gap-2 text-xs text-yellow-400 animate-pulse">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Actualizando datos...
                    </span>
                  ) : stats ? (
                    <>
                      <span className="ml-3 text-xs text-gray-400">
                        | Total reportes: <span className="font-bold text-white">{stats?.kpis?.total_reportes || 0}</span>
                      </span>
                      <span className="ml-3 text-xs text-gray-400">
                        | Pendientes: <span className="font-bold text-yellow-400">{stats?.kpis?.pendientes || 0}</span>
                      </span>
                      <span className="ml-3 text-xs text-gray-400">
                        | Cerrados: <span className="font-bold text-green-400">{stats?.kpis?.aprobados + stats?.kpis?.rechazados || 0}</span>
                      </span>
                    </>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {loading && <div className="text-center text-base text-gray-300 col-span-full">Cargando KPIs...</div>}
            {error && <div className="text-center text-base text-red-500 col-span-full">{error}</div>}
            {!loading && !error && kpis.map((kpi, index) => (
              <div 
                key={index}
                className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 border border-gray-700 hover:transform hover:scale-[1.02] transition-all duration-300"
                style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}
              >
                <div className="flex items-center gap-2 mb-1">
                  {kpi.Icon && <kpi.Icon className="w-5 h-5 flex-shrink-0" style={{ color: kpi.color }} />}
                  <h3 className="text-2xl md:text-3xl font-bold" style={{ color: kpi.color }}>
                    {kpi.value}
                  </h3>
                </div>
                <p className="text-xs md:text-sm text-gray-400">
                  {kpi.title}
                </p>
                {kpi.subtitle && (
                  <p className="text-xs text-gray-500 mt-1 truncate" title={kpi.subtitle}>
                    {kpi.subtitle}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Charts Grid - Enhanced */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            {loading && <div className="text-center text-base text-gray-300 col-span-full">Cargando gráficos...</div>}
            {error && <div className="text-center text-base text-red-500 col-span-full">{error}</div>}
            {!loading && !error && (
              <>
                {/* Bar Chart - Incidentes por Mes */}
                <div 
                  className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-6"
                  style={{
                    height: '450px',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                  }}
                >
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                    <div className="w-full h-full rounded-full" style={{ background: 'linear-gradient(45deg, var(--color-accent), var(--color-tertiary))' }}></div>
                  </div>
                  
                  {/* Chart Header */}
                  <div className="relative z-10 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 space-y-3 md:space-y-0">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ 
                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                          }}
                        >
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg md:text-xl font-bold" style={{ color: 'var(--color-secondary)' }}>
                            Total de reportes por período ({periodLabel})
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chart Container */}
                  <div className="relative bar-periodo-wrapper" style={{ height: '320px', minHeight: '320px' }}>
                    <ResponsiveBar
                      data={incidentsByMonth}
                      keys={['incidentes', 'hallazgos', 'conversaciones', 'pqr']}
                      indexBy="period"
                      margin={{ top: 30, right: 40, bottom: 95, left: 60 }}
                      padding={0.3}
                      groupMode="grouped"
                      valueScale={{ type: 'linear' }}
                      indexScale={{ type: 'band', round: true }}
                      colors={({ id }) => SERIES_COLOR[id] ?? '#6B7280'}
                      tooltip={({ indexValue }) => {
                        const row = incidentsByMonth.find(r => r.period === indexValue);
                        const total = row
                          ? (Number(row.incidentes) || 0) + (Number(row.hallazgos) || 0) + (Number(row.conversaciones) || 0) + (Number(row.pqr) || 0)
                          : 0;
                        return (
                          <div style={{ padding: '8px 12px', background: '#1f2937', color: '#f9fafb', borderRadius: 8, fontSize: 13 }}>
                            Periodo: <strong>{indexValue}</strong> · Total: <strong>{total}</strong>
                          </div>
                        );
                      }}
                      borderRadius={4}
                      enableGridY={true}
                      theme={{
                        background: 'transparent',
                        text: { fill: '#f3f4f6', fontSize: 12 },
                        axis: {
                          ticks: { text: { fill: '#d1d5db', fontSize: 11 } },
                          domain: { line: { stroke: 'rgba(255,255,255,0.15)' } },
                          legend: { text: { fill: '#e5e7eb', fontWeight: 600 } }
                        },
                        grid: { line: { stroke: 'rgba(255,255,255,0.1)' } },
                        tooltip: {
                          container: {
                            background: '#1f2937',
                            color: '#f9fafb',
                            fontSize: 13,
                            borderRadius: 8,
                            padding: '8px 12px',
                            boxShadow: '0 6px 20px rgba(0,0,0,0.4)'
                          }
                        }
                      }}
                      axisBottom={{
                        tickSize: 5,
                        tickPadding: 8,
                        tickRotation: -35,
                        format: formatPeriodTick,
                        legend: 'Periodo',
                        legendPosition: 'middle',
                        legendOffset: 60
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 8,
                        tickRotation: 0,
                        legend: 'Cantidad de reportes',
                        legendPosition: 'middle',
                        legendOffset: -50
                      }}
                      labelSkipHeight={14}
                      labelSkipWidth={16}
                      labelTextColor="#ffffff"
                      label={d => (d.value >= 2 ? d.value : '')}
                      legends={[]}
                    />
                  </div>
                  <LegendRow items={[
                    { label: 'Incidentes', color: SERIES_COLOR.incidentes },
                    { label: 'Hallazgos', color: SERIES_COLOR.hallazgos },
                    { label: 'Conversaciones', color: SERIES_COLOR.conversaciones },
                    { label: 'PQR', color: SERIES_COLOR.pqr },
                  ]} />
                </div>

                {/* Resumen de gestión - Barras por estado y criticidad */}
                <div 
                  className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-6 relative overflow-hidden"
                  style={{
                    height: '450px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                  }}
                >
                  {/* Decorative elements */}
                  <div className="absolute top-0 left-0 w-20 h-20 opacity-5">
                    <div className="w-full h-full rounded-full" style={{ background: 'linear-gradient(45deg, var(--color-accent), var(--color-primary))' }}></div>
                  </div>
                  
                  {/* Chart Header */}
                  <div className="relative z-10 mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ 
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
                          }}
                        >
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3v18h18M7 15l4-4 4 4M7 9h10" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-100 tracking-wide">
                            Resumen de gestión
                          </h3>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-xs text-gray-400">
                          Total: <span className="font-semibold text-gray-100">{stats?.kpis?.total_reportes || 0}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          Tasa aprobación: <span className="font-semibold text-gray-100">{stats?.kpis?.tasa_aprobacion || 0}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chart Container */}
                  <div className="relative" style={{ height: '320px' }}>
                    <ResponsiveBar
                      data={reportesResumenChart}
                      keys={['Pendientes', 'En Revisión', 'Aprobados', 'Rechazados']}
                      indexBy="estado"
                      margin={{ top: 30, right: 30, bottom: 50, left: 60 }}
                      padding={0.15}
                      groupMode="grouped"
                      valueScale={{ type: 'linear' }}
                      colors={[
                        '#fbbf24', // Pendientes
                        '#3b82f6', // En Revisión
                        '#22c55e', // Aprobados
                        '#ef4444'  // Rechazados
                      ]}
                      borderRadius={6}
                      borderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
                      theme={{
                        background: 'transparent',
                        text: { fill: '#f3f4f6', fontSize: 12 },
                        axis: {
                          ticks: { text: { fill: '#d1d5db', fontSize: 10 } },
                          domain: { line: { stroke: 'rgba(255,255,255,0.1)' } },
                          legend: { text: { fill: '#e5e7eb', fontSize: 11, fontWeight: 600 } }
                        },
                        grid: { line: { stroke: 'rgba(255,255,255,0.1)', strokeDasharray: '4 4' } },
                        tooltip: { container: { background: '#111827', color: '#f9fafb', fontSize: 13, borderRadius: 8, padding: '8px 12px', boxShadow: '0 6px 20px rgba(0,0,0,0.4)' } }
                      }}
                      axisBottom={null}
                      axisLeft={null}
                      labelTextColor="#ffffff"
                      labelSkipHeight={16}
                      labelSkipWidth={12}
                      label={d => (d.value >= 2 ? d.value : '')}
                      animate={true}
                      motionConfig="gentle"
                      enableGridY={true}
                      legends={[]}
                      tooltip={({ id, value, color }) => (
                        <div
                          style={{
                            padding: '8px 12px',
                            background: '#1f2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            boxShadow: '0 6px 15px rgba(0,0,0,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <div
                            style={{
                              width: '12px',
                              height: '12px',
                              backgroundColor: color,
                              borderRadius: '3px'
                            }}
                          ></div>
                          <strong style={{ color: '#f3f4f6' }}>{id}:</strong>
                          <span style={{ color: '#d1d5db' }}>{value}</span>
                        </div>
                      )}
                    />
                  </div>
                  <LegendRow items={[
                    { label: 'Pendientes', color: '#fbbf24' },
                    { label: 'En Revisión', color: '#3b82f6' },
                    { label: 'Aprobados', color: '#22c55e' },
                    { label: 'Rechazados', color: '#ef4444' },
                  ]} />
                </div>
              </>
            )}
          </div>

          {/* (Se movió la sección de asignación más abajo) */}

          {/* Second Row Charts - Enhanced */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            {loading && <div className="text-center text-base text-gray-300 col-span-full">Cargando gráficos...</div>}
            {error && <div className="text-center text-base text-red-500 col-span-full">{error}</div>}
            {!loading && !error && (
              <>
                {/* Line Chart - Tendencias Mensuales */}
                <div 
                  className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-6"
                  style={{
                    height: '450px',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                  }}
                >
                  {/* Decorative elements */}
                  <div className="absolute bottom-0 right-0 w-28 h-28 opacity-5">
                    <div className="w-full h-full rounded-full" style={{ background: 'linear-gradient(45deg, var(--color-accent), var(--color-primary))' }}></div>
                  </div>
                  
                  {/* Chart Header */}
                  <div className="relative z-10 mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ 
                            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                          }}
                        >
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold" style={{ color: 'var(--color-secondary)' }}>
                            Cantidad de reportes por proceso
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chart Container */}
                  <div className="relative" style={{ height: '420px' }}>
                    <ResponsiveBar
                      data={reportsByProcess}
                      keys={['total']}
                      indexBy="proceso"
                      layout="horizontal"
                      margin={{ top: 30, right: 120, bottom: 50, left: processLeftMargin }}
                      padding={0.68}
                      innerPadding={6}
                      valueScale={{ type: 'linear' }}
                      indexScale={{ type: 'band', round: true }}
                      colors={(bar) => {
                        const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#a855f7', '#06b6d4', '#f97316', '#84cc16'];
                        return colors[bar.index % colors.length];
                      }}
                      borderRadius={10}
                      borderWidth={1}
                      borderColor={{ from: 'color', modifiers: [['darker', 0.6]] }}
                      enableGridX={true}
                      enableGridY={false}
                      theme={{
                        background: 'transparent',
                        text: { fill: '#f3f4f6', fontSize: 12 },
                        axis: {
                          ticks: { text: { fill: '#d1d5db', fontSize: 11 } },
                          domain: { line: { stroke: 'rgba(255,255,255,0.15)' } },
                          legend: { text: { fill: '#e5e7eb', fontWeight: 600, fontSize: 12 } }
                        },
                        grid: { line: { stroke: 'rgba(255,255,255,0.1)', strokeDasharray: '3 3' } },
                        tooltip: {
                          container: {
                            background: '#1f2937',
                            color: '#f9fafb',
                            fontSize: 13,
                            borderRadius: 8,
                            padding: '10px 14px',
                            boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
                            border: '1px solid rgba(255,255,255,0.1)'
                          }
                        }
                      }}
                      axisTop={null}
                      axisRight={null}
                      axisBottom={{
                        tickSize: 5,
                        tickPadding: 8,
                        tickRotation: 0,
                        legend: 'Cantidad de reportes',
                        legendPosition: 'middle',
                        legendOffset: 40
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 8,
                        tickRotation: 0,
                        format: formatProcesoTick,
                        legend: '',
                        legendPosition: 'middle',
                        legendOffset: -160
                      }}
                      labelSkipHeight={14}
                      labelSkipWidth={16}
                      labelTextColor={{ from: 'color', modifiers: [['darker', 3]] }}
                      label={d => (d.value >= 2 ? d.value : '')}
                      tooltip={({ id, value, indexValue }) => (
                        <div style={{
                          background: '#1f2937',
                          color: '#f9fafb',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.1)',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.4)'
                        }}>
                          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{indexValue}</div>
                          <div style={{ fontSize: '14px' }}>
                            <strong>{value}</strong> reporte{value !== 1 ? 's' : ''}
                          </div>
                        </div>
                      )}
                    />
                  </div>
                </div>

                {/* Pie Chart - Efectividad de cierre */}
                <div 
                  className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-6"
                  style={{
                    height: '450px',
                    position: 'relative',
                    overflow: 'visible',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                  }}
                >
                  {/* Decorative elements */}
                  <div className="absolute top-0 left-0 w-24 h-24 opacity-5">
                    <div className="w-full h-full rounded-full" style={{ background: 'linear-gradient(45deg, var(--color-tertiary), var(--color-accent))' }}></div>
                  </div>
                  
                  {/* Chart Header */}
                  <div className="relative z-10 mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ 
                            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                            boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
                          }}
                        >
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold" style={{ color: 'var(--color-secondary)' }}>
                            Efectividad de cierre
                          </h3>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold" style={{ color: 'var(--color-secondary)' }}>
                          {closureEffectiveness.reduce((acc, d) => acc + (Number(d.value) || 0), 0)}
                        </div>
                        <div className="text-xs" style={{ color: 'rgba(252, 247, 255, 0.6)' }}>Total cerrados</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chart Container */}
                  <div className="relative" style={{ height: '320px' }}>
                    <ResponsivePie
                      data={closureEffectiveness}
                      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                      innerRadius={0.5}
                      padAngle={0.7}
                      cornerRadius={3}
                      activeOuterRadiusOffset={8}
                      colors={{ datum: 'data.color' }}
                      theme={{
                        background: 'transparent',
                        text: { fill: '#fcf7ff' }
                      }}
                      arcLinkLabelsSkipAngle={12}
                      arcLinkLabelsTextColor="#fcf7ff"
                      arcLinkLabelsThickness={2}
                      arcLinkLabelsColor={{ from: 'color' }}
                      arcLabelsSkipAngle={999}
                      enableArcLabels={false}
                      tooltip={({ id, value, label }) => {
                        const total = closureEffectiveness.reduce((acc, d) => acc + (Number(d.value) || 0), 0);
                        return (
                          <div style={{
                            background: '#1f2937',
                            color: '#f9fafb',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            boxShadow: '0 6px 20px rgba(0,0,0,0.4)'
                          }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{label}</div>
                            <div style={{ fontSize: '14px' }}>
                              <strong>{value}</strong> caso{value !== 1 ? 's' : ''}
                            </div>
                            {total > 0 && (
                              <div style={{ fontSize: '12px', marginTop: '4px', color: '#d1d5db' }}>
                                {Math.round((value / total) * 100)}% del total
                              </div>
                            )}
                          </div>
                        );
                      }}
                      legends={[]}
                    />
                  </div>
                  <LegendRow items={[
                    { label: 'Cerrados a tiempo (≤15 días)', color: '#22c55e' },
                    { label: 'No cerrados a tiempo (>16 días)', color: '#ef4444' },
                  ]} />
                </div>
              </>
            )}
          </div>

          {/* Download Reports Section */}
          <div className="mb-8">
            <div className="mb-6 pb-4 border-b border-gray-700/50">
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-tertiary), var(--color-accent))' }}>
                  <BarChart2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Reportes y Exportación</h2>
                  <p className="text-xs text-gray-400 mt-1">Descarga reportes en diferentes formatos</p>
                </div>
              </div>
            </div>
          {/* Filtro global de Proceso para dashboards/reportes */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-300">Proceso</label>
                <select
                  value={dashboardProceso}
                  onChange={(e) => setDashboardProceso(e.target.value)}
                  className="px-3 py-2 bg-gray-800 border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Todos los Procesos</option>
                  <option value="administrativa">Administrativo</option>
                  <option value="company-man">Proyecto CW_Company Man</option>
                  <option value="frontera">Proyecto Frontera</option>
                  <option value="petroservicios">Proyecto Petroservicios</option>
                  <option value="zircon">Proyecto ZIRCON</option>
                </select>
              </div>
              {dashboardProceso && (
                <div className="text-xs text-gray-400">
                  Filtro aplicado a estadísticas, gráficos y tabla: <span className="text-blue-300 font-semibold">{({ administrativa: 'Administrativo', 'company-man': 'Proyecto CW_Company Man', frontera: 'Proyecto Frontera', petroservicios: 'Proyecto Petroservicios', zircon: 'Proyecto ZIRCON' })[dashboardProceso] || dashboardProceso}</span>
                </div>
              )}
            </div>
          </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Reporte Principal */}
               <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 border border-gray-700 hover:transform hover:scale-[1.02] transition-all duration-300" style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}>
                 <div className="text-center">
                   <div className="flex justify-center mb-4 md:mb-6">
                     <BarChart2 className="w-12 h-12 md:w-14 md:h-14 text-white/90" />
                   </div>
                   <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white">
                     Reportes Detallados PDF
                   </h3>
                   <p className="text-xs md:text-sm mb-4 md:mb-6 text-gray-300">
                     PDF completo con cada reporte detallado: información, descripciones, evidencias fotográficas, comentarios de revisión y más
                   </p>
                  
                  {/* Stats preview */}
                  <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                    <div className="text-center">
                      <div className="text-base md:text-lg font-bold" style={{ color: 'var(--color-tertiary)' }}>
                        {loading ? '...' : (stats?.kpis?.total_incidentes ?? '0')}
                      </div>
                      <div className="text-xs opacity-70 text-gray-400">Incidentes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-base md:text-lg font-bold" style={{ color: 'var(--color-tertiary)' }}>
                        {loading ? '...' : (stats?.kpis?.total_reportes ?? '0')}
                      </div>
                      <div className="text-xs opacity-70 text-gray-400">Reportes</div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleDownloadPDF}
                    className="w-full group relative font-bold py-3 md:py-4 px-4 md:px-6 rounded-2xl transition-all duration-500 transform hover:scale-105 overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
                    style={{
                      background: 'linear-gradient(45deg, var(--color-tertiary), var(--color-tertiary-light))',
                      color: 'var(--color-dark)',
                      boxShadow: '0 15px 35px -5px rgba(99, 201, 219, 0.5)',
                      '--focus-ring-color': 'rgba(99, 201, 219, 0.5)'
                    }}
                  >
                    <div 
                      className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(252, 247, 255, 0.4), transparent)'
                      }}
                    ></div>
                    <span className="relative flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm md:text-base">DESCARGAR PDF</span>
                    </span>
                  </button>
                </div>
              </div>

               {/* Excel Todos los Reportes */}
               <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 border border-gray-700 hover:transform hover:scale-[1.02] transition-all duration-300" style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}>
                 <div className="text-center">
                   <div className="flex justify-center mb-4 md:mb-6">
                     <FileSpreadsheet className="w-12 h-12 md:w-14 md:h-14 text-white/90" />
                   </div>
                   <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white">
                     Excel Todos los Reportes
                   </h3>
                   <p className="text-xs md:text-sm mb-4 md:mb-6 text-gray-300">
                     Excel con TODOS los reportes sin filtros: información completa, descripciones y comentarios
                   </p>
                   
                   {/* Quick stats */}
                   <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                     <div className="text-center">
                       <div className="text-base md:text-lg font-bold" style={{ color: 'var(--color-tertiary)' }}>
                         {loading ? '...' : (stats?.kpis?.total_reportes ?? '0')}
                       </div>
                       <div className="text-xs opacity-70 text-gray-400">Reportes</div>
                     </div>
                     <div className="text-center">
                       <div className="text-base md:text-lg font-bold" style={{ color: 'var(--color-tertiary)' }}>1</div>
                       <div className="text-xs opacity-70 text-gray-400">Hoja</div>
                     </div>
                   </div>
                  
                  <button 
                    className="w-full group relative font-bold py-3 md:py-4 px-4 md:px-6 rounded-2xl transition-all duration-500 transform hover:scale-105 overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
                    style={{
                      background: 'linear-gradient(45deg, #22c55e, #16a34a)',
                      color: 'white',
                      boxShadow: '0 15px 35px -5px rgba(34, 197, 94, 0.5)',
                      '--focus-ring-color': 'rgba(34, 197, 94, 0.5)'
                    }}
                    onClick={() => handleDownloadExcel({})}
                  >
                    <div 
                      className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)'
                      }}
                    ></div>
                    <span className="relative flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm md:text-base">GENERAR EXCEL</span>
                    </span>
                  </button>
                </div>
              </div>

              {/* Excel con Filtros */}
               <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 border border-gray-700 hover:transform hover:scale-[1.02] transition-all duration-300" style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}>
                 <div className="text-center">
                   <div className="flex justify-center mb-4 md:mb-6">
                     <Search className="w-12 h-12 md:w-14 md:h-14 text-white/90" />
                   </div>
                   <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white">
                     Excel CON Filtros
                   </h3>
                   <p className="text-xs md:text-sm mb-4 md:mb-6 text-gray-300">
                     Excel personalizado con filtros aplicados: tipo, estado, proceso, responsable, fechas y más
                   </p>
                   
                   {/* Quick stats */}
                   <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                     <div className="text-center">
                       <div className="text-base md:text-lg font-bold" style={{ color: 'var(--color-tertiary)' }}>
                         7
                       </div>
                       <div className="text-xs opacity-70 text-gray-400">Filtros</div>
                     </div>
                     <div className="text-center">
                       <div className="text-base md:text-lg font-bold" style={{ color: 'var(--color-tertiary)' }}>
                         {loading ? '...' : (stats?.kpis?.total_reportes ?? '0')}
                       </div>
                       <div className="text-xs opacity-70 text-gray-400">Reportes</div>
                     </div>
                   </div>
                  
                  <button 
                    className="w-full group relative font-bold py-3 md:py-4 px-4 md:px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
                    style={{
                      background: 'linear-gradient(45deg, #22c55e, #16a34a)',
                      color: 'white',
                      boxShadow: '0 15px 35px -5px rgba(34, 197, 94, 0.5)',
                      '--focus-ring-color': 'rgba(34, 197, 94, 0.5)'
                    }}
                    onClick={handleOpenExcelFiltersModal}
                  >
                    <div 
                      className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)'
                      }}
                    ></div>
                    <span className="relative flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm md:text-base">CONFIGURAR Y GENERAR</span>
                    </span>
                  </button>
                </div>
              </div>

              {/* Excel Reportes por Usuario + Consolidados (lado a lado) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:col-span-2">
                <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 border border-gray-700 hover:transform hover:scale-[1.02] transition-all duration-300" style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}>
                  <div className="text-center">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-xl bg-gray-700/50">
                        <User className="w-8 h-8 text-white/90" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="text-xl md:text-2xl font-bold mb-1 text-white">Excel Reportes por Usuario</h3>
                        <p className="text-xs md:text-sm text-gray-300 mb-3">Total de reportes por usuario (quién reportó más), ordenado descendentemente</p>
                        <button 
                          className="font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                          style={{
                            background: 'linear-gradient(45deg, #22c55e, #16a34a)',
                            color: 'white',
                            boxShadow: '0 12px 24px -8px rgba(34, 197, 94, 0.45)'
                          }}
                          onClick={handleDownloadExcelUserCounts}
                        >
                          EXPORTAR EXCEL
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  onClick={handleOpenConsolidadosModal}
                  className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 border border-gray-700 hover:transform hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                  style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}
                >
                  <div className="text-center">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-xl bg-gray-700/50">
                        <Users className="w-8 h-8 text-white/90" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="text-xl md:text-2xl font-bold mb-1 text-white">Consolidados de reportes por usuario</h3>
                        <p className="text-xs md:text-sm text-gray-300 mb-3">Haz clic para abrir el panel y seleccionar Hallazgos, Conversaciones, Reflexiones o PQRs</p>
                        <button 
                          className="font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                          style={{
                            background: 'linear-gradient(45deg, #06b6d4, #0891b2)',
                            color: 'white',
                            boxShadow: '0 12px 24px -8px rgba(6, 182, 212, 0.35)'
                          }}
                          onClick={handleOpenConsolidadosModal}
                        >
                          ABRIR
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          
            

          {/* Administración de Usuarios (solo Admin) */}
          {isAdmin() && (
            <div className="mb-8">
              <div className="mb-6 pb-4 border-b border-gray-700/50">
                <div className="flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
                    <span className="text-3xl">⚙️</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Administración del Sistema</h2>
                    <p className="text-xs text-gray-400 mt-1">Gestiona usuarios y crea nuevos reportes</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 border border-gray-700 hover:transform hover:scale-[1.02] transition-all duration-300" style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}>
                  <div className="text-center">
                    <div className="flex justify-center mb-4 md:mb-6">
                      <Users className="w-12 h-12 md:w-14 md:h-14 text-white/90" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white">
                      Administración de Usuarios
                    </h3>
                    <p className="text-xs md:text-sm mb-4 md:mb-6 text-gray-300">
                      Gestiona usuarios, roles y accesos del sistema
                    </p>

                    <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                      <div className="text-center">
                        <div className="text-base md:text-lg font-bold" style={{ color: 'var(--color-tertiary)' }}>Roles</div>
                        <div className="text-xs opacity-70 text-gray-400">Admin, Coord, Colab</div>
                      </div>
                      <div className="text-center">
                        <div className="text-base md:text-lg font-bold" style={{ color: 'var(--color-tertiary)' }}>Accesos</div>
                        <div className="text-xs opacity-70 text-gray-400">Protegidos por token</div>
                      </div>
                    </div>

                    <button 
                      onClick={goToUserAdmin}
                      className="w-full group relative font-bold py-3 md:py-4 px-4 md:px-6 rounded-2xl transition-all duration-500 transform hover:scale-105 overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
                      style={{
                        background: 'linear-gradient(45deg, #8b5cf6, #6366f1)',
                        color: 'white',
                        boxShadow: '0 15px 35px -5px rgba(99, 102, 241, 0.45)',
                        '--focus-ring-color': 'rgba(99, 102, 241, 0.5)'
                      }}
                    >
                      <div 
                        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)'
                        }}
                      ></div>
                      <span className="relative flex items-center justify-center space-x-2">
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20h6M3 20h6M12 14a4 4 0 100-8 4 4 0 000 8z" />
                        </svg>
                        <span className="text-sm md:text-base">IR A ADMINISTRACIÓN</span>
                      </span>
                    </button>
                  </div>
                </div>

                <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 border border-gray-700 hover:transform hover:scale-[1.02] transition-all duration-300" style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}>
                  <div className="text-center">
                    <div className="flex justify-center mb-4 md:mb-6">
                      <Plus className="w-12 h-12 md:w-14 md:h-14 text-white/90" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white">
                      Crear Nuevo Reporte
                    </h3>
                    <p className="text-xs md:text-sm mb-4 md:mb-6 text-gray-300">
                      Registra un nuevo hallazgo, incidente, conversación o PQR
                    </p>

                    <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                      <div className="text-center">
                        <div className="text-base md:text-lg font-bold" style={{ color: 'var(--color-tertiary)' }}>4 Tipos</div>
                        <div className="text-xs opacity-70 text-gray-400">Hallazgos, Incidentes...</div>
                      </div>
                      <div className="text-center">
                        <div className="text-base md:text-lg font-bold" style={{ color: 'var(--color-tertiary)' }}>Evidencias</div>
                        <div className="text-xs opacity-70 text-gray-400">Fotos y documentos</div>
                      </div>
                    </div>

                    <button 
                      onClick={goToCreateReport}
                      className="w-full group relative font-bold py-3 md:py-4 px-4 md:px-6 rounded-2xl transition-all duration-500 transform hover:scale-105 overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
                      style={{
                        background: 'linear-gradient(45deg, #10b981, #059669)',
                        color: 'white',
                        boxShadow: '0 15px 35px -5px rgba(16, 185, 129, 0.45)',
                        '--focus-ring-color': 'rgba(16, 185, 129, 0.5)'
                      }}
                    >
                      <div 
                        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)'
                        }}
                      ></div>
                      <span className="relative flex items-center justify-center space-x-2">
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span className="text-sm md:text-base">CREAR REPORTE</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Gestión completa de reportes (solo Admin) */}
          {isAdmin() && (
            <div>
              <div className="mb-6 pb-4 border-b border-gray-700/50">
                <div className="flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                    <FileSpreadsheet className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Gestión Completa de Reportes</h2>
                    <p className="text-xs text-gray-400 mt-1">Visualiza, filtra y gestiona todos los reportes del sistema</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 border border-gray-700" style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}>

                {/* Reports Table Component */}
                <ReportsTable 
                  user={user}
                  showStatusActions={true}
                  title="Todos los Reportes"
                  containerClassName=""
                  useDarkTheme={true}
                  externalFilters={{ 
                    proceso: dashboardProceso || undefined
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
        
      {/* Modal de Filtros Excel */}
      {showExcelFiltersModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}>
            <div className="bg-gray-900 rounded-2xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
              {/* Modal Header */}
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex justify-between items-center z-10">
                <div>
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Search className="w-7 h-7 flex-shrink-0" />
                    Configurar Filtros de Excel
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">Personaliza tu reporte según tus necesidades</p>
                </div>
                <button 
                  onClick={() => setShowExcelFiltersModal(false)}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 font-medium text-gray-300">Tipo de Reporte</label>
                    <select 
                      name="tipo_reporte" 
                      value={excelFilters.tipo_reporte} 
                      onChange={handleExcelFilterChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">Todos los tipos</option>
                      {reportTypes.map(rt => (
                        <option key={rt.id} value={rt.id}>{rt.title.replace(/^\d+\.\s*/,'')}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2 font-medium text-gray-300">Estado</label>
                    <select 
                      name="estado" 
                      value={excelFilters.estado} 
                      onChange={handleExcelFilterChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">Todos los estados</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="en_revision">En Revisión</option>
                      <option value="aprobado">Aprobado</option>
                      <option value="rechazado">Rechazado</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2 font-medium text-gray-300">Grado de Criticidad</label>
                    <select 
                      name="grado_criticidad" 
                      value={excelFilters.grado_criticidad} 
                      onChange={handleExcelFilterChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">Todas las criticidades</option>
                      {gradosCriticidad.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2 font-medium text-gray-300">Proceso</label>
                    <select 
                      name="proceso" 
                      value={excelFilters.proceso} 
                      onChange={handleExcelFilterChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                     <option value="">Todos los Procesos</option>
                     <option value="administrativa">Administrativo</option>
                     <option value="company-man">Proyecto CW_Company Man</option>
                     <option value="frontera">Proyecto Frontera</option>
                     <option value="petroservicios">Proyecto Petroservicios</option>
                     <option value="zircon">Proyecto ZIRCON</option>
                    </select>
                  </div>
                  
                  <div>
                   <label className="block text-sm mb-2 font-medium text-gray-300">Usuario asignado</label>
                    <select 
                      name="revisado_por" 
                      value={excelFilters.revisado_por} 
                      onChange={handleExcelFilterChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">Todos los usuarios</option>
                      {responsables.map(resp => (
                        <option key={resp.id} value={resp.id}>{resp.nombre}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2 font-medium text-gray-300">Fecha Desde</label>
                    <input 
                      type="date" 
                      name="date_from" 
                      value={excelFilters.date_from} 
                      onChange={handleExcelFilterChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2 font-medium text-gray-300">Fecha Hasta</label>
                    <input 
                      type="date" 
                      name="date_to" 
                      value={excelFilters.date_to} 
                      onChange={handleExcelFilterChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
                
                {/* Filtros activos preview */}
                <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-300">Filtros Activos:</span>
                    <span className="text-xs text-gray-400">
                      {Object.values(excelFilters).filter(v => v !== '').length} de 6 filtros aplicados
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(excelFilters).map(([key, value]) => {
                      if (value === '') return null;
                      return (
                        <span key={key} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {key.replace(/_/g, ' ')}: {value}
                        </span>
                      );
                    })}
                    {Object.values(excelFilters).filter(v => v !== '').length === 0 && (
                      <span className="text-xs text-gray-500 italic">No hay filtros aplicados - se generará con todos los reportes</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-6 flex justify-between items-center">
                <button 
                  onClick={handleResetExcelFilters}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Limpiar Filtros</span>
                </button>
                
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setShowExcelFiltersModal(false)}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleDownloadExcelWithFilters}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-lg text-sm font-bold transition-all duration-200 flex items-center space-x-2"
                    style={{ boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)' }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Generar Excel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Consolidados por usuario */}
        {showConsolidadosModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}>
            <div className="bg-gray-900 rounded-2xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
              {/* Header */}
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex justify-between items-center z-10">
                <div>
                  <h3 className="text-2xl font-bold text-white flex items-center"><span className="mr-3">📥</span>Consolidados de reportes por usuario</h3>
                  <p className="text-sm text-gray-400 mt-1">Selecciona un tipo, filtra por fechas y busca por nombre para ver quién reportó información</p>
                </div>
                <button onClick={handleCloseConsolidadosModal} className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
                  <div className="mb-4 md:mb-0">
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => fetchConsolidadosUsers('hallazgos', consolidadosDateFrom || undefined, consolidadosDateTo || undefined)} className={`px-4 py-3 rounded-lg text-sm font-semibold ${consolidadosType==='hallazgos' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-200 hover:bg-gray-700'}`}>
                        Hallazgos
                      </button>
                      <button onClick={() => fetchConsolidadosUsers('conversaciones', consolidadosDateFrom || undefined, consolidadosDateTo || undefined)} className={`px-4 py-3 rounded-lg text-sm font-semibold ${consolidadosType==='conversaciones' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-200 hover:bg-gray-700'}`}>
                        Conversaciones
                      </button>
                      <button onClick={() => fetchConsolidadosUsers('reflexiones', consolidadosDateFrom || undefined, consolidadosDateTo || undefined)} className={`px-4 py-3 rounded-lg text-sm font-semibold ${consolidadosType==='reflexiones' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-200 hover:bg-gray-700'}`}>
                        Reflexiones
                      </button>
                      <button onClick={() => fetchConsolidadosUsers('pqr', consolidadosDateFrom || undefined, consolidadosDateTo || undefined)} className={`px-4 py-3 rounded-lg text-sm font-semibold ${consolidadosType==='pqr' ? 'bg-yellow-600 text-white' : 'bg-gray-800 text-gray-200 hover:bg-gray-700'}`}>
                        PQRs
                      </button>
                    </div>

                    <div className="mt-4">
                      <label className="text-xs text-gray-400 mb-2 block">Filtrar por fechas</label>
                      <div className="space-y-2">
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Fecha desde</label>
                          <input 
                            type="date" 
                            value={consolidadosDateFrom} 
                            onChange={(e) => setConsolidadosDateFrom(e.target.value)} 
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Fecha hasta</label>
                          <input 
                            type="date" 
                            value={consolidadosDateTo} 
                            onChange={(e) => setConsolidadosDateTo(e.target.value)} 
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                          />
                        </div>
                        {(consolidadosDateFrom || consolidadosDateTo) && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                if (consolidadosType) {
                                  fetchConsolidadosUsers(consolidadosType, consolidadosDateFrom || undefined, consolidadosDateTo || undefined);
                                }
                              }}
                              className="flex-1 px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
                            >
                              Aplicar filtros
                            </button>
                            <button
                              onClick={() => {
                                setConsolidadosDateFrom('');
                                setConsolidadosDateTo('');
                                if (consolidadosType) {
                                  fetchConsolidadosUsers(consolidadosType);
                                }
                              }}
                              className="px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors"
                            >
                              Limpiar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="text-xs text-gray-400">Buscar por nombre</label>
                      <input type="text" value={consolidadosSearch} onChange={(e) => setConsolidadosSearch(e.target.value)} placeholder="Escribe un nombre..." className="w-full mt-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="mb-3 text-sm text-gray-300">{consolidadosType ? `Resultados para: ${consolidadosType}` : 'Selecciona un tipo para cargar usuarios'}</div>

                    {consolidadosLoading ? (
                      <div className="text-center text-gray-400 py-6">Cargando...</div>
                    ) : (
                      <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
                        {filteredConsolidadosUsers.length === 0 ? (
                          <div className="text-sm text-gray-500">No se encontraron usuarios</div>
                        ) : (
                          filteredConsolidadosUsers.map(u => (
                            <div key={`${u.id}-${u.nombre}`} className="bg-gray-800 border border-gray-700 rounded-lg p-3 flex items-center justify-between">
                              <div>
                                <div className="text-sm font-semibold text-gray-100">{u.nombre}</div>
                                <div className="text-xs text-gray-400">Reportes: {u.count}</div>
                              </div>
                              <div>
                                <button onClick={() => { 
                                    const tipo = consolidadosType || '';
                                    const userId = u.id || '';
                                    const userName = u.nombre || '';
                                    // Filtrar por user_id (usuario que reportó)
                                    handleDownloadExcel({ tipo_reporte: tipo, user_id: userId }, userName);
                                }}
                                className="px-3 py-1 text-sm rounded-lg"
                                style={{
                                  background: 'linear-gradient(45deg, #22c55e, #16a34a)',
                                  color: 'white',
                                  boxShadow: '0 8px 20px -6px rgba(34,197,94,0.45)'
                                }}
                                >Generar Excel</button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-6 flex justify-end">
                <button onClick={handleCloseConsolidadosModal} className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm">Cerrar</button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Action Buttons */}
        <div className="floating-action-buttons">
          <button 
            onClick={goBackToHome}
            className="floating-button group"
            style={{
              backgroundColor: 'rgba(252, 247, 255, 0.9)',
              color: 'var(--color-primary-dark)',
              border: '2px solid rgba(252, 247, 255, 0.3)'
            }}
            title="Volver al Inicio"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <div className="tooltip">
              Volver al Inicio
            </div>
          </button>
          
          {user && (
            <button 
              onClick={handleLogout}
              className="floating-button group"
              style={{
                background: 'linear-gradient(45deg, #dc2626, #ef4444)',
                color: 'white',
                border: '2px solid rgba(220, 38, 38, 0.3)',
                boxShadow: '0 8px 25px -5px rgba(220, 38, 38, 0.4)'
              }}
              title="Cerrar Sesión"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <div className="tooltip">
                Cerrar Sesión
              </div>
            </button>
          )}
        </div>
      
      <Footer />
    </>
  );
};

export default Dashboard;