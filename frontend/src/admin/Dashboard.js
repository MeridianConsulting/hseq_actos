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
import { reportService, userService } from '../services/api';
import ReportsTable from '../components/ReportsTable';

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  const handlePeriodChange = useCallback((period) => {
    setSelectedPeriod(period);
  }, []);
  const [user, setUser] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState(null);
  const [reports, setReports] = useState([]);
  const [supports, setSupports] = useState([]);

  const { stats, loading, error } = useDashboardStats(selectedPeriod);

  // Bar chart: Reportes por periodo (dinámico por selectedPeriod)
  const incidentsByMonth = useMemo(() => (stats?.incidentesPorMes || []).map(m => ({
    month: m.mes_corto || m.mes,
    incidentes: Number(m.incidentes),
    hallazgos: Number(m.hallazgos),
    conversaciones: Number(m.conversaciones),
  })), [stats?.incidentesPorMes]);

  // Pie chart: Distribución por tipo
  const incidentsByType = useMemo(() => stats?.distribucionTipo?.map(t => ({
    id: t.tipo_reporte,
    label: t.tipo_reporte.charAt(0).toUpperCase() + t.tipo_reporte.slice(1),
    value: Number(t.cantidad),
    color: t.color
  })) || [], [stats?.distribucionTipo]);

  // Resumen de reportes para gráfico de barras (sustituye Métricas de seguridad)
  const totalReportes = useMemo(() => Number(stats?.kpis?.total_reportes) || 0, [stats?.kpis?.total_reportes]);
  const totalCerrados = useMemo(() => Number(stats?.kpis?.total_cerrados) || 0, [stats?.kpis?.total_cerrados]);
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

  // KPIs
  const kpis = useMemo(() => [
    { title: 'Total Incidentes', value: stats?.kpis?.total_incidentes ?? '-', color: '#ef4444', icon: '⚠️' },
    { title: 'Reportes Procesados', value: stats?.kpis?.total_reportes ?? '-', color: '#22c55e', icon: '📋' },
    { title: 'Capacitaciones', value: stats?.kpis?.total_conversaciones ?? '-', color: '#3b82f6', icon: '🎓' },
    { title: 'Días sin Accidentes', value: stats?.diasSinAccidentes ?? '-', color: '#f59e0b', icon: '🏆' }
  ], [stats?.kpis, stats?.diasSinAccidentes]);

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

  useEffect(() => {
    const userData = getUser();
    if (userData) {
      setUser(userData);
      setTimeout(() => setIsVisible(true), 100);
    }
    // Cargar datos para asignación si es admin
    if (isAdmin()) {
      loadAssignmentData();
    }
  }, [loadAssignmentData]);

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

  const handleDownloadPDF = useCallback(async () => {
    const title = 'Reporte Ejecutivo HSEQ';
    const generatedAt = new Date().toLocaleString('es-ES');
    const totalTipos = incidentsByType.reduce((a, d) => a + (Number(d.value) || 0), 0);
    const estilos = `
      <style>
        * { box-sizing: border-box; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        body { margin: 30px; color: #1a202c; background: #ffffff; }
        h1 { margin: 0 0 16px; font-size: 28px; font-weight: 700; color: #2d3748; border-bottom: 3px solid #3182ce; padding-bottom: 8px; }
        h2 { margin: 24px 0 12px; font-size: 18px; font-weight: 600; color: #4a5568; }
        p { margin: 0 0 12px; font-size: 14px; line-height: 1.5; }
        .muted { color: #718096; font-size: 13px; }
        .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 20px 0; }
        .kpi { padding: 16px; border: 2px solid #e2e8f0; border-radius: 12px; background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .kpi .val { font-size: 24px; font-weight: 800; margin-bottom: 4px; }
        .kpi .muted { margin: 0; font-size: 12px; font-weight: 500; }
        .table { width: 100%; border-collapse: collapse; font-size: 12px; margin: 16px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .table th, .table td { border: 1px solid #e2e8f0; padding: 12px 16px; text-align: left; }
        .table th { background: linear-gradient(135deg, #3182ce 0%, #2c5282 100%); color: white; font-weight: 600; }
        .table tr:nth-child(even) { background-color: #f7fafc; }
        .table tr:hover { background-color: #edf2f7; }
        .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 20px 0; }
        .box { border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px; background: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; background: linear-gradient(135deg, #3182ce 0%, #2c5282 100%); color: white; font-weight: 600; font-size: 11px; margin: 0 4px; }
        .header-info { background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3182ce; }
        @media print { 
          .no-print { display: none; } 
          body { margin: 20px; }
          .kpi-grid { grid-template-columns: repeat(2, 1fr); }
          .grid2 { grid-template-columns: 1fr; }
        }
      </style>`;

    const kpiRows = `
      <div class="kpi-grid">
        <div class="kpi"><div class="val" style="color:#ef4444">${kpis[0]?.value ?? '-'}</div><div class="muted">${kpis[0]?.title}</div></div>
        <div class="kpi"><div class="val" style="color:#22c55e">${kpis[1]?.value ?? '-'}</div><div class="muted">${kpis[1]?.title}</div></div>
        <div class="kpi"><div class="val" style="color:#3b82f6">${kpis[2]?.value ?? '-'}</div><div class="muted">${kpis[2]?.title}</div></div>
        <div class="kpi"><div class="val" style="color:#f59e0b">${kpis[3]?.value ?? '-'}</div><div class="muted">${kpis[3]?.title}</div></div>
      </div>`;

    const tablaIncMes = `
      <table class="table">
        <thead><tr><th>Periodo</th><th>Incidentes</th><th>Hallazgos</th><th>Conversaciones</th></tr></thead>
        <tbody>
          ${(incidentsByMonth || []).map(r => `<tr><td>${r.month}</td><td>${r.incidentes}</td><td>${r.hallazgos}</td><td>${r.conversaciones}</td></tr>`).join('')}
        </tbody>
      </table>`;

    const tablaTipo = `
      <table class="table">
        <thead><tr><th>Tipo</th><th>Cantidad</th></tr></thead>
        <tbody>
          ${(incidentsByType || []).map(r => `<tr><td>${r.label || r.id}</td><td>${r.value}</td></tr>`).join('')}
          <tr><th>Total</th><th>${totalTipos}</th></tr>
        </tbody>
      </table>`;

    const abiertosCrit = `
      <table class="table">
        <thead><tr><th>Criterio</th><th>Valor</th></tr></thead>
        <tbody>
          <tr><td>Total reportes</td><td>${Number(totalReportes)}</td></tr>
          <tr><td>Total cerrados</td><td>${Number(totalCerrados)}</td></tr>
          <tr><td>Abiertos Baja</td><td>${Number(abiertosPorCriticidad.Baja)}</td></tr>
          <tr><td>Abiertos Media</td><td>${Number(abiertosPorCriticidad.Media)}</td></tr>
          <tr><td>Abiertos Alta</td><td>${Number(abiertosPorCriticidad.Alta)}</td></tr>
          <tr><td>Abiertos Muy Alta</td><td>${Number(abiertosPorCriticidad['Muy Alta'])}</td></tr>
        </tbody>
      </table>`;

    // Obtener datos de reportes por proyecto
    let resumenPorProyecto = [];
    try {
      const resp = await reportService.getAllReports({ per_page: 1000, page: 1 });
      if (resp?.success && Array.isArray(resp.reports)) {
        const detalles = resp.reports.map((r) => ({
          ID: r.id,
          Tipo: r.tipo_reporte,
          Estado: r.estado,
          UsuarioID: r.id_usuario,
          NombreUsuario: r.nombre_usuario || '',
          ProyectoUsuario: r.proyecto_usuario || '',
          Asunto: r.asunto || r.asunto_conversacion || '',
          FechaEvento: r.fecha_evento || '',
          GradoCriticidad: r.grado_criticidad || '',
          AreaProceso: r.ubicacion_incidente || r.lugar_hallazgo || r.sitio_evento_conversacion || '',
          Creado: r.creado_en || ''
        }));

        if (detalles.length > 0) {
          // Agrupar por proyecto y contar reportes
          const proyectos = {};
          detalles.forEach(r => {
            const proyecto = r.ProyectoUsuario || 'Sin Proyecto';
            if (!proyectos[proyecto]) {
              proyectos[proyecto] = {
                proyecto: proyecto,
                total_reportes: 0,
                incidentes: 0,
                hallazgos: 0,
                conversaciones: 0,
                usuarios_unicos: new Set()
              };
            }
            proyectos[proyecto].total_reportes++;
            proyectos[proyecto].usuarios_unicos.add(r.UsuarioID);
            
            if (r.Tipo === 'incidentes') proyectos[proyecto].incidentes++;
            else if (r.Tipo === 'hallazgos') proyectos[proyecto].hallazgos++;
            else if (r.Tipo === 'conversaciones') proyectos[proyecto].conversaciones++;
          });

          // Convertir a array y agregar cantidad de usuarios únicos
          resumenPorProyecto = Object.values(proyectos).map(p => ({
            Proyecto: p.proyecto,
            TotalReportes: p.total_reportes,
            Incidentes: p.incidentes,
            Hallazgos: p.hallazgos,
            Conversaciones: p.conversaciones,
            UsuariosUnicos: p.usuarios_unicos.size
          }));
        }
      }
    } catch (e) {
      // Si hay error, continuar sin la tabla de proyectos
    }

    // Obtener todos los proyectos únicos del sistema para mostrar los que tienen 0 reportes
    let todosLosProyectos = [];
    try {
      const resp = await userService.fetchUsers();
      if (resp?.success && Array.isArray(resp.data)) {
        const proyectosUnicos = new Set();
        resp.data.forEach(user => {
          if (user.Proyecto && user.Proyecto.trim() !== '') {
            proyectosUnicos.add(user.Proyecto.trim());
          }
        });
        todosLosProyectos = Array.from(proyectosUnicos).sort();
      }
    } catch (e) {
      // Si hay error, continuar sin obtener todos los proyectos
    }

    // Crear tabla de reportes por proyecto incluyendo proyectos con 0 reportes
    const tablaPorProyecto = `
      <table class="table">
        <thead><tr><th>Proyecto</th><th>Total Reportes</th><th>Incidentes</th><th>Hallazgos</th><th>Conversaciones</th><th>Usuarios Únicos</th></tr></thead>
        <tbody>
          ${resumenPorProyecto.map(r => `<tr><td>${r.Proyecto}</td><td>${r.TotalReportes}</td><td>${r.Incidentes}</td><td>${r.Hallazgos}</td><td>${r.Conversaciones}</td><td>${r.UsuariosUnicos}</td></tr>`).join('')}
          ${todosLosProyectos.filter(proyecto => !resumenPorProyecto.find(r => r.Proyecto === proyecto)).map(proyecto => `<tr><td>${proyecto}</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>`).join('')}
        </tbody>
      </table>`;
    


    const html = `
      <!doctype html><html><head><meta charset="utf-8"/>${estilos}</head>
      <body>
        <div class="no-print" style="text-align:right;margin-bottom:16px;">
          <button onclick="window.print()" style="padding:12px 20px;border:none;border-radius:8px;background:linear-gradient(135deg, #3182ce 0%, #2c5282 100%);color:#fff;font-weight:600;cursor:pointer;box-shadow:0 2px 4px rgba(0,0,0,0.2);">📄 Imprimir / Guardar PDF</button>
        </div>
        
        <h1>${title}</h1>
        
        <div class="header-info">
          <p class="muted"><strong>📅 Generado:</strong> ${generatedAt}</p>
          <p class="muted"><strong>📊 Periodo:</strong> ${selectedPeriod === 'month' ? 'Mensual' : selectedPeriod === 'quarter' ? 'Trimestral' : 'Anual'}</p>
          <p class="muted"><strong>🏢 Área/Proceso destacado:</strong> <span class="badge">${areaProcesoTop}</span></p>
          <p class="muted"><strong>🔍 Hallazgo más reportado:</strong> <span class="badge">${hallazgoMasReportado}</span></p>
        </div>

        <h2>📈 Indicadores Clave de Rendimiento</h2>
        ${kpiRows}

        <div class="grid2">
          <div class="box">
            <h2>📊 Cantidad de reportes por periodo</h2>
            ${tablaIncMes}
          </div>
          <div class="box">
            <h2>📋 Distribución por tipo</h2>
            ${tablaTipo}
          </div>
        </div>

        <h2>📋 Resumen de Totales y Abiertos por Criticidad</h2>
        <div class="box">${abiertosCrit}</div>

        <h2>🏗️ Reportes por Proyecto</h2>
        <div class="box">${tablaPorProyecto}</div>
        
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

  const handleDownloadExcel = useCallback(async () => {
    // Prepare data sets
    const kpiRows = [
      { KPI: kpis[0]?.title || 'Total Incidentes', Valor: kpis[0]?.value ?? '-' },
      { KPI: kpis[1]?.title || 'Reportes Procesados', Valor: kpis[1]?.value ?? '-' },
      { KPI: kpis[2]?.title || 'Capacitaciones', Valor: kpis[2]?.value ?? '-' },
      { KPI: kpis[3]?.title || 'Días sin Accidentes', Valor: kpis[3]?.value ?? '-' }
    ];

    const porPeriodo = (incidentsByMonth || []).map(r => ({
      Periodo: r.month,
      Incidentes: r.incidentes,
      Hallazgos: r.hallazgos,
      Conversaciones: r.conversaciones
    }));

    const porTipo = (incidentsByType || []).map(r => ({
      Tipo: r.label || r.id,
      Cantidad: r.value
    }));

    const resumen = [
      { Metrica: 'Total reportes', Valor: Number(totalReportes) },
      { Metrica: 'Total cerrados', Valor: Number(totalCerrados) },
      { Metrica: 'Abiertos Baja', Valor: Number(abiertosPorCriticidad.Baja) },
      { Metrica: 'Abiertos Media', Valor: Number(abiertosPorCriticidad.Media) },
      { Metrica: 'Abiertos Alta', Valor: Number(abiertosPorCriticidad.Alta) },
      { Metrica: 'Abiertos Muy Alta', Valor: Number(abiertosPorCriticidad['Muy Alta']) },
      { Metrica: 'Área/Proceso destacado', Valor: areaProcesoTop },
      { Metrica: 'Hallazgo más reportado', Valor: hallazgoMasReportado },
      { Metrica: 'Periodo', Valor: selectedPeriod === 'month' ? 'Mensual' : selectedPeriod === 'quarter' ? 'Trimestral' : 'Anual' }
    ];

    // Try to fetch detailed reports for an extra sheet
    let detalles = [];
    try {
      console.log('🔍 Iniciando fetch de reportes para Excel...');
      const resp = await reportService.getAllReports({ per_page: 1000, page: 1 });
      console.log('📊 Respuesta completa de getAllReports:', resp);
      console.log('✅ ¿Success?:', resp?.success);
      console.log('📋 ¿Tiene reports?:', resp?.reports);
      console.log('📊 Cantidad de reportes:', resp?.reports?.length);
      
      if (resp?.success && Array.isArray(resp.reports)) {
        detalles = resp.reports.map((r) => {
          console.log('📝 Procesando reporte:', r);
          return {
            ID: r.id,
            Tipo: r.tipo_reporte,
            Estado: r.estado,
            UsuarioID: r.id_usuario,
            NombreUsuario: r.nombre_usuario || '',
            ProyectoUsuario: r.proyecto_usuario || '',
            Asunto: r.asunto || r.asunto_conversacion || '',
            FechaEvento: r.fecha_evento || '',
            GradoCriticidad: r.grado_criticidad || '',
            AreaProceso: r.ubicacion_incidente || r.lugar_hallazgo || r.sitio_evento_conversacion || '',
            Creado: r.creado_en || ''
          };
        });
      }
    } catch (e) {
      // Ignore; Excel will be generated without the details sheet
    }

    // Agregar hoja de resumen por proyecto
    let resumenPorProyecto = [];
    try {
      console.log('📊 Procesando resumen por proyecto...');
      console.log('📋 Cantidad de detalles:', detalles.length);
      if (detalles.length > 0) {
        // Agrupar por proyecto y contar reportes
        const proyectos = {};
        detalles.forEach(r => {
          console.log('🔍 Procesando reporte para proyecto:', r.ProyectoUsuario, 'Tipo:', r.Tipo);
          const proyecto = r.ProyectoUsuario || 'Sin Proyecto';
          if (!proyectos[proyecto]) {
            proyectos[proyecto] = {
              proyecto: proyecto,
              total_reportes: 0,
              incidentes: 0,
              hallazgos: 0,
              conversaciones: 0,
              usuarios_unicos: new Set()
            };
          }
          proyectos[proyecto].total_reportes++;
          proyectos[proyecto].usuarios_unicos.add(r.UsuarioID);
          
          if (r.Tipo === 'incidentes') proyectos[proyecto].incidentes++;
          else if (r.Tipo === 'hallazgos') proyectos[proyecto].hallazgos++;
          else if (r.Tipo === 'conversaciones') proyectos[proyecto].conversaciones++;
        });
        
        console.log('📊 Proyectos procesados:', proyectos);

        // Convertir a array y agregar cantidad de usuarios únicos
        resumenPorProyecto = Object.values(proyectos).map(p => ({
          Proyecto: p.proyecto,
          TotalReportes: p.total_reportes,
          Incidentes: p.incidentes,
          Hallazgos: p.hallazgos,
          Conversaciones: p.conversaciones,
          UsuariosUnicos: p.usuarios_unicos.size
        }));
      }
    } catch (e) {
      // Ignore; Excel will be generated without the project summary sheet
    }

    // Obtener todos los proyectos únicos del sistema para mostrar los que tienen 0 reportes
    let todosLosProyectos = [];
    try {
      const resp = await userService.fetchUsers();
      if (resp?.success && Array.isArray(resp.data)) {
        const proyectosUnicos = new Set();
        resp.data.forEach(user => {
          if (user.Proyecto && user.Proyecto.trim() !== '') {
            proyectosUnicos.add(user.Proyecto.trim());
          }
        });
        todosLosProyectos = Array.from(proyectosUnicos).sort();
      }
    } catch (e) {
      // Si hay error, continuar sin obtener todos los proyectos
    }

    // Agregar proyectos con 0 reportes al resumen
    const proyectosConCero = todosLosProyectos
      .filter(proyecto => !resumenPorProyecto.find(r => r.Proyecto === proyecto))
      .map(proyecto => ({
        Proyecto: proyecto,
        TotalReportes: 0,
        Incidentes: 0,
        Hallazgos: 0,
        Conversaciones: 0,
        UsuariosUnicos: 0
      }));

    // Combinar proyectos con reportes y proyectos con 0 reportes
    resumenPorProyecto = [...resumenPorProyecto, ...proyectosConCero];

    const periodLabel = selectedPeriod === 'month' ? 'mensual' : selectedPeriod === 'quarter' ? 'trimestral' : 'anual';
    const fileName = `reporte_hseq_${periodLabel}_${new Date().toISOString().substring(0,10)}.xlsx`;

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

      const addTableSheet = (name, headerDefs, rows) => {
        const ws = wb.addWorksheet(name, { views: [{ state: 'frozen', ySplit: 1 }] });
        
        // Agregar título de la hoja
        const titleRow = ws.addRow([name.toUpperCase()]);
        titleRow.font = { bold: true, size: 16, color: { argb: 'FF2E5BBA' } };
        titleRow.alignment = { horizontal: 'center' };
        ws.mergeCells(`A1:${String.fromCharCode(65 + headerDefs.length - 1)}1`);
        
        // Agregar línea en blanco
        ws.addRow([]);
        
        // Agregar tabla
        const tableStartRow = 3;
        ws.addTable({
          name: `${name.replace(/\s+/g, '')}Table`,
          ref: `A${tableStartRow}`,
          style: { 
            theme: 'TableStyleMedium2', 
            showRowStripes: true,
            showFirstColumn: false,
            showLastColumn: false
          },
          headerRow: true,
          columns: headerDefs.map(h => ({ name: h })),
          rows: rows.map(r => headerDefs.map(h => r[h]))
        });
        
        // Estilizar encabezados
        const headerRow = ws.getRow(tableStartRow);
        headerRow.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
        headerRow.fill = { 
          type: 'pattern', 
          pattern: 'solid', 
          fgColor: { argb: 'FF2E5BBA' } 
        };
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
        headerRow.height = 25;
        
        // Estilizar datos
        for (let i = tableStartRow + 1; i <= tableStartRow + rows.length; i++) {
          const dataRow = ws.getRow(i);
          dataRow.font = { size: 11 };
          dataRow.alignment = { vertical: 'middle' };
          dataRow.height = 20;
          
          // Alternar colores de filas
          if (i % 2 === 0) {
            dataRow.fill = { 
              type: 'pattern', 
              pattern: 'solid', 
              fgColor: { argb: 'FFF8F9FA' } 
            };
          }
        }
        
        // Ajustar ancho de columnas
        headerDefs.forEach((h, i) => {
          const maxLen = Math.max(h.length, ...rows.map(r => (r[h] ? String(r[h]).length : 0)));
          ws.getColumn(i + 1).width = Math.min(Math.max(15, maxLen + 3), 50);
        });
        
        return ws;
      };

      addTableSheet('KPIs', ['KPI','Valor'], cleanDataForExcel(kpiRows));
      addTableSheet('PorPeriodo', ['Periodo','Incidentes','Hallazgos','Conversaciones'], cleanDataForExcel(porPeriodo));
      addTableSheet('PorTipo', ['Tipo','Cantidad'], cleanDataForExcel(porTipo));
      addTableSheet('Resumen', ['Metrica','Valor'], cleanDataForExcel(resumen));
      if (detalles.length > 0) addTableSheet('Detalles', Object.keys(detalles[0]), cleanDataForExcel(detalles));
      if (resumenPorProyecto.length > 0) addTableSheet('ResumenPorProyecto', Object.keys(resumenPorProyecto[0]), cleanDataForExcel(resumenPorProyecto));

      const buffer = await wb.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
      
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(cleanDataForXLSX(kpiRows)), 'KPIs');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(cleanDataForXLSX(porPeriodo)), 'PorPeriodo');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(cleanDataForXLSX(porTipo)), 'PorTipo');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(cleanDataForXLSX(resumen)), 'Resumen');
      if (detalles.length > 0) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(cleanDataForXLSX(detalles)), 'Detalles');
      if (resumenPorProyecto.length > 0) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(cleanDataForXLSX(resumenPorProyecto)), 'ResumenPorProyecto');
      XLSX.writeFile(wb, fileName);
      return;
    } catch (e) {
      // Last-resort CSV
      const header = Object.keys(porPeriodo[0] || { Periodo:'', Incidentes:'', Hallazgos:'', Conversaciones:'' });
      const rows = [header.join(','), ...porPeriodo.map(r => header.map(h => `${(r[h] ?? '').toString().replaceAll('"','""')}`).join(','))];
      const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName.replace('.xlsx','.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [stats, selectedPeriod, reportService, userService]);

  // Line chart: Tendencias mensuales
  const monthlyTrends = useMemo(() => [
    {
      id: 'Incidentes',
      color: '#ef4444',
      data: (stats?.tendencias || []).map(m => ({
        x: m.mes_corto || m.mes,
        y: Number(m.incidentes)
      }))
    },
    {
      id: 'Hallazgos',
      color: '#eab308',
      data: (stats?.tendencias || []).map(m => ({
        x: m.mes_corto || m.mes,
        y: Number(m.hallazgos)
      }))
    },
    {
      id: 'Conversaciones',
      color: '#3b82f6',
      data: (stats?.tendencias || []).map(m => ({
        x: m.mes_corto || m.mes,
        y: Number(m.conversaciones)
      }))
    }
  ], [stats?.tendencias]);

  const reportesResumenChart = useMemo(() => [
    { categoria: 'Total', 'Total': totalReportes, 'Cerrados': 0, 'Abiertos Baja': 0, 'Abiertos Media': 0, 'Abiertos Alta': 0, 'Abiertos Muy Alta': 0 },
    { categoria: 'Cerrados', 'Total': 0, 'Cerrados': totalCerrados, 'Abiertos Baja': 0, 'Abiertos Media': 0, 'Abiertos Alta': 0, 'Abiertos Muy Alta': 0 },
    { categoria: 'Abiertos', 'Total': 0, 'Cerrados': 0, 'Abiertos Baja': abiertosPorCriticidad.Baja, 'Abiertos Media': abiertosPorCriticidad.Media, 'Abiertos Alta': abiertosPorCriticidad.Alta, 'Abiertos Muy Alta': abiertosPorCriticidad['Muy Alta'] }
  ], [totalReportes, totalCerrados, abiertosPorCriticidad]);

  return (
    <>
      <Header />
      <div className="min-h-screen" style={{
        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 35%, var(--color-tertiary-dark) 100%)'
      }}>
        {/* Main Content Container */}
        <div className="container mx-auto px-4 pb-8 pt-8">

          {/* Welcome Section */}
          {user && (
            <div className={`transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="text-center mb-6 md:mb-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-white">
                  ¡Bienvenido, {getUserName()}!
                </h1>
                <p className="text-base md:text-xl text-gray-200">
                  Plataforma HSEQ - Sistema de Gestión de Seguridad y Calidad
                </p>
              </div>

              {/* User Information Card - Redesigned */}
              <div className="max-w-4xl mx-auto mb-6 md:mb-8 transition-all duration-1000 delay-300">
                <div className="bg-gray-900/80 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-700 overflow-hidden">
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
                      <div className="space-y-4 dashboard-section">
                        <h4 className="text-lg font-semibold mb-4 flex items-center" style={{ color: 'var(--color-secondary)' }}>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Información Personal
                        </h4>
                        <div className="space-y-3">
                          <div className="bg-white bg-opacity-5 rounded-xl p-4 border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300 dashboard-card">
                            <p className="text-xs font-medium mb-1" style={{ color: 'rgba(252, 247, 255, 0.6)' }}>NOMBRE COMPLETO</p>
                            <div className="dashboard-card-content">
                              <p className="text-lg font-semibold text-break-word" style={{ color: 'var(--color-secondary)' }} title={user.nombre}>{user.nombre}</p>
                            </div>
                          </div>
                          <div className="bg-white bg-opacity-5 rounded-xl p-4 border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300 dashboard-card">
                            <p className="text-xs font-medium mb-1" style={{ color: 'rgba(252, 247, 255, 0.6)' }}>DOCUMENTO</p>
                            <div className="dashboard-card-content">
                              <p className="text-lg font-semibold text-break-word" style={{ color: 'var(--color-secondary)' }} title={user.cedula}>{user.cedula}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-4 dashboard-section">
                        <h4 className="text-lg font-semibold mb-4 flex items-center" style={{ color: 'var(--color-secondary)' }}>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Información de Contacto
                        </h4>
                        <div className="space-y-3">
                          <div className="bg-white bg-opacity-5 rounded-xl p-4 border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300 dashboard-card">
                            <p className="text-xs font-medium mb-1" style={{ color: 'rgba(252, 247, 255, 0.6)' }}>CORREO ELECTRÓNICO</p>
                            <div className="dashboard-card-content">
                              <p className="text-lg font-semibold text-break-word" style={{ color: 'var(--color-secondary)' }} title={user.correo}>{user.correo}</p>
                            </div>
                          </div>
                          <div className="bg-white bg-opacity-5 rounded-xl p-4 border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300 dashboard-card">
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
                      <div className="space-y-4 dashboard-section">
                        <h4 className="text-lg font-semibold mb-4 flex items-center" style={{ color: 'var(--color-secondary)' }}>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Información del Sistema
                        </h4>
                        <div className="space-y-3">
                          <div className="bg-white bg-opacity-5 rounded-xl p-4 border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300 dashboard-card">
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
                          <div className="bg-white bg-opacity-5 rounded-xl p-4 border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300 dashboard-card">
                            <p className="text-xs font-medium mb-1" style={{ color: 'rgba(252, 247, 255, 0.6)' }}>ÚLTIMO ACCESO</p>
                            <div className="dashboard-card-content">
                              <p className="text-sm font-medium text-break-word" style={{ color: 'var(--color-secondary)' }} title={new Date().toLocaleDateString('es-ES', { 
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
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="flex flex-wrap justify-center gap-2">
              {['month', 'quarter', 'year'].map((period) => (
                <button
                  key={period}
                  onClick={() => handlePeriodChange(period)}
                  className={`py-2 px-3 md:px-4 rounded-lg font-semibold transition-all duration-300 text-sm md:text-base ${
                    selectedPeriod === period ? 'scale-105' : 'hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: selectedPeriod === period 
                      ? 'var(--color-tertiary)' 
                      : 'rgba(252, 247, 255, 0.15)',
                    color: selectedPeriod === period 
                      ? 'var(--color-dark)' 
                      : 'var(--color-secondary)',
                    border: '1px solid rgba(252, 247, 255, 0.3)'
                  }}
                >
                  {period === 'month' ? 'Mensual' : period === 'quarter' ? 'Trimestral' : 'Anual'}
                </button>
              ))}
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {loading && <div className="text-center text-lg text-gray-300 col-span-full">Cargando KPIs...</div>}
            {error && <div className="text-center text-lg text-red-500 col-span-full">{error}</div>}
            {!loading && !error && kpis.map((kpi, index) => (
              <div 
                key={index}
                className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-gray-700 hover:transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                <h3 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: kpi.color }}>
                  {kpi.value}
                </h3>
                <p className="text-xs md:text-sm text-gray-400">
                  {kpi.title}
                </p>
              </div>
            ))}
          </div>

          {/* Charts Grid - Enhanced */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-8 mb-8">
            {loading && <div className="text-center text-lg text-gray-300 col-span-full">Cargando gráficos...</div>}
            {error && <div className="text-center text-lg text-red-500 col-span-full">{error}</div>}
            {!loading && !error && (
              <>
                {/* Bar Chart - Incidentes por Mes */}
                <div 
                  className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-3xl p-6 shadow-2xl"
                  style={{
                    height: '450px',
                    position: 'relative',
                    overflow: 'hidden'
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
                            Cantidad de reportes por periodo
                          </h3>
                          <p className="text-xs md:text-sm" style={{ color: 'rgba(252, 247, 255, 0.6)' }}>
                            Análisis mensual
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 md:space-x-3">
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ef4444' }}></div>
                          <span className="text-xs" style={{ color: 'rgba(252, 247, 255, 0.7)' }}>Incidentes</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#eab308' }}></div>
                          <span className="text-xs" style={{ color: 'rgba(252, 247, 255, 0.7)' }}>Hallazgos</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3b82f6' }}></div>
                          <span className="text-xs" style={{ color: 'rgba(252, 247, 255, 0.7)' }}>Conversaciones</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chart Container */}
                  <div className="relative" style={{ height: '280px', minHeight: '280px' }}>
                    <ResponsiveBar
                      data={incidentsByMonth}
                      keys={['incidentes', 'hallazgos', 'conversaciones']}
                      indexBy="month"
                      margin={{ top: 20, right: 80, bottom: 50, left: 40 }}
                      padding={0.35}
                      groupMode="stacked"
                      valueScale={{ type: 'linear' }}
                      colors={[ '#ef4444', '#eab308', '#3b82f6' ]}
                      theme={{
                        background: 'transparent',
                        text: { fill: '#f3f4f6', fontSize: 12 },
                        axis: { ticks: { text: { fill: '#d1d5db', fontSize: 10 } } },
                        grid: { line: { stroke: 'rgba(255,255,255,0.1)' } }
                      }}
                      axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0
                      }}
                      legends={[
                        {
                          dataFrom: 'keys',
                          anchor: 'bottom-right',
                          direction: 'column',
                          translateX: 70,
                          translateY: 0,
                          itemsSpacing: 2,
                          itemWidth: 100,
                          itemHeight: 18,
                          itemTextColor: '#fcf7ff'
                        }
                      ]}
                    />
                  </div>
                </div>

                {/* Resumen de Reportes - Barras por estado y criticidad */}
                <div 
                  className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-3xl p-6 shadow-2xl"
                  style={{
                    height: '450px',
                    position: 'relative',
                    overflow: 'hidden'
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
                          <h3 className="text-xl font-bold" style={{ color: 'var(--color-secondary)' }}>
                            Resumen de reportes
                          </h3>
                          <p className="text-sm" style={{ color: 'rgba(252, 247, 255, 0.6)' }}>
                            Totales y abiertos por criticidad
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-xs" style={{ color: 'rgba(252, 247, 255, 0.7)' }}>
                          Área/Proceso: <span className="font-semibold" style={{ color: 'var(--color-secondary)' }}>{areaProcesoTop}</span>
                        </div>
                        <div className="text-xs" style={{ color: 'rgba(252, 247, 255, 0.7)' }}>
                          Hallazgo más reportado: <span className="font-semibold" style={{ color: 'var(--color-secondary)' }}>{hallazgoMasReportado}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chart Container */}
                  <div className="relative" style={{ height: '320px' }}>
                    <ResponsiveBar
                      data={reportesResumenChart}
                      keys={['Total','Cerrados','Abiertos Baja','Abiertos Media','Abiertos Alta','Abiertos Muy Alta']}
                      indexBy="categoria"
                      margin={{ top: 20, right: 120, bottom: 50, left: 60 }}
                      padding={0.3}
                      groupMode="stacked"
                      valueScale={{ type: 'linear' }}
                      colors={[ '#60a5fa', '#34d399', '#86efac', '#fde68a', '#fbbf24', '#f87171' ]}
                      theme={{
                        background: 'transparent',
                        text: { fill: '#fcf7ff' },
                        axis: { ticks: { text: { fill: '#fcf7ff' } } },
                        grid: { line: { stroke: 'rgba(252, 247, 255, 0.1)' } }
                      }}
                      axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0
                      }}
                      legends={[
                        {
                          dataFrom: 'keys',
                          anchor: 'bottom-right',
                          direction: 'column',
                          translateX: 110,
                          translateY: 0,
                          itemsSpacing: 2,
                          itemWidth: 120,
                          itemHeight: 20,
                          itemTextColor: '#fcf7ff'
                        }
                      ]}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* (Se movió la sección de asignación más abajo) */}

          {/* Second Row Charts - Enhanced */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-8">
            {loading && <div className="text-center text-lg text-gray-300 col-span-full">Cargando gráficos...</div>}
            {error && <div className="text-center text-lg text-red-500 col-span-full">{error}</div>}
            {!loading && !error && (
              <>
                {/* Line Chart - Tendencias Mensuales */}
                <div 
                  className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-3xl p-6 shadow-2xl"
                  style={{
                    height: '450px',
                    position: 'relative',
                    overflow: 'hidden'
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
                            Tendencias Mensuales
                          </h3>
                          <p className="text-sm" style={{ color: 'rgba(252, 247, 255, 0.6)' }}>
                            Evolución temporal
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ef4444' }}></div>
                          <span className="text-xs" style={{ color: 'rgba(252, 247, 255, 0.7)' }}>Incidentes</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#22c55e' }}></div>
                          <span className="text-xs" style={{ color: 'rgba(252, 247, 255, 0.7)' }}>Reportes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chart Container */}
                  <div className="relative" style={{ height: '320px' }}>
                    <ResponsiveLine
                      data={monthlyTrends}
                      margin={{ top: 20, right: 80, bottom: 50, left: 60 }}
                      xScale={{ type: 'point' }}
                      yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
                      curve="cardinal"
                      axisTop={null}
                      axisRight={null}
                      theme={{
                        background: 'transparent',
                        text: { fill: '#fcf7ff' },
                        axis: { ticks: { text: { fill: '#fcf7ff' } } },
                        grid: { line: { stroke: 'rgba(252, 247, 255, 0.1)' } }
                      }}
                      pointSize={10}
                      pointColor={{ theme: 'background' }}
                      pointBorderWidth={2}
                      pointBorderColor={{ from: 'serieColor' }}
                      pointLabelYOffset={-12}
                      useMesh={true}
                      legends={[
                        {
                          anchor: 'bottom-right',
                          direction: 'column',
                          translateX: 100,
                          translateY: 0,
                          itemsSpacing: 0,
                          itemDirection: 'left-to-right',
                          itemWidth: 80,
                          itemHeight: 20,
                          itemTextColor: '#fcf7ff',
                          symbolSize: 12,
                          symbolShape: 'circle'
                        }
                      ]}
                    />
                  </div>
                </div>

                {/* Pie Chart - Incidentes por Tipo */}
                <div 
                  className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-3xl p-6 shadow-2xl"
                  style={{
                    height: '450px',
                    position: 'relative',
                    overflow: 'hidden'
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
                            Distribución por Tipo
                          </h3>
                          <p className="text-sm" style={{ color: 'rgba(252, 247, 255, 0.6)' }}>
                            Clasificación de incidentes
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold" style={{ color: 'var(--color-secondary)' }}>
                          {incidentsByType.reduce((acc, d) => acc + (Number(d.value) || 0), 0)}
                        </div>
                        <div className="text-xs" style={{ color: 'rgba(252, 247, 255, 0.6)' }}>Total</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chart Container */}
                  <div className="relative" style={{ height: '320px' }}>
                    <ResponsivePie
                      data={incidentsByType}
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
                      arcLinkLabelsSkipAngle={10}
                      arcLinkLabelsTextColor="#fcf7ff"
                      arcLinkLabelsThickness={2}
                      arcLinkLabelsColor={{ from: 'color' }}
                      arcLabelsSkipAngle={10}
                      arcLabelsTextColor="#000"
                      legends={[
                        {
                          anchor: 'bottom',
                          direction: 'row',
                          translateY: 56,
                          itemWidth: 100,
                          itemHeight: 18,
                          itemTextColor: '#fcf7ff',
                          symbolSize: 18,
                          symbolShape: 'circle'
                        }
                      ]}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Download Reports Section */}
          <div className="mt-12 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
              {/* Reporte Principal */}
              <div className="bg-gray-900/80 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-gray-700 hover:transform hover:scale-105 transition-all duration-500 shadow-2xl">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl mb-4 md:mb-6">📊</div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white">
                    Reporte Ejecutivo HSEQ
                  </h3>
                  <p className="text-xs md:text-sm mb-4 md:mb-6 text-gray-300">
                    Reporte completo con métricas, estadísticas y análisis de tendencias del sistema HSEQ
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

              {/* Reportes Detallados */}
              <div className="bg-gray-900/80 backdrop-blur-md rounded-3xl p-8 border border-gray-700 hover:transform hover:scale-105 transition-all duration-500 shadow-2xl">
                <div className="text-center">
                  <div className="text-5xl mb-6">📋</div>
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    Reportes Detallados
                  </h3>
                  <p className="text-sm mb-6 text-gray-300">
                    Accede a reportes específicos por proyecto, tipo y fecha
                  </p>
                  
                  {/* Quick actions */}
                  <div className="space-y-3 mb-6">
                    <button className="w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 border text-sm bg-gray-800 text-gray-100 border-gray-600 hover:bg-gray-700">
                      📊 Reporte por Proyecto
                    </button>
                  </div>
                  
                  <button 
                    className="w-full group relative font-bold py-4 px-6 rounded-2xl transition-all duration-500 transform hover:scale-105 overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
                    style={{
                      background: 'linear-gradient(45deg, #22c55e, #16a34a)',
                      color: 'white',
                      boxShadow: '0 15px 35px -5px rgba(34, 197, 94, 0.5)',
                      '--focus-ring-color': 'rgba(34, 197, 94, 0.5)'
                    }}
                    onClick={handleDownloadExcel}
                  >
                    <div 
                      className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)'
                      }}
                    ></div>
                    <span className="relative flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>GENERAR EXCEL</span>
                    </span>
                  </button>
                </div>
              </div>

              {/* Administración de Usuarios (solo Admin) */}
              {isAdmin() && (
                <div className="bg-gray-900/80 backdrop-blur-md rounded-3xl p-8 border border-gray-700 hover:transform hover:scale-105 transition-all duration-500 shadow-2xl">
                  <div className="text-center">
                    <div className="text-5xl mb-6">👥</div>
                    <h3 className="text-2xl font-bold mb-4 text-white">
                      Administración de Usuarios
                    </h3>
                    <p className="text-sm mb-6 text-gray-300">
                      Gestiona usuarios, roles y accesos del sistema
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-lg font-bold" style={{ color: 'var(--color-tertiary)' }}>Roles</div>
                        <div className="text-xs opacity-70 text-gray-400">Admin, Coord, Colab</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold" style={{ color: 'var(--color-tertiary)' }}>Accesos</div>
                        <div className="text-xs opacity-70 text-gray-400">Protegidos por token</div>
                      </div>
                    </div>

                    <button 
                      onClick={goToUserAdmin}
                      className="w-full group relative font-bold py-4 px-6 rounded-2xl transition-all duration-500 transform hover:scale-105 overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent mb-4"
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
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20h6M3 20h6M12 14a4 4 0 100-8 4 4 0 000 8z" />
                        </svg>
                        <span>IR A ADMINISTRACIÓN</span>
                      </span>
                    </button>

                    <button 
                      onClick={goToCreateReport}
                      className="w-full group relative font-bold py-4 px-6 rounded-2xl transition-all duration-500 transform hover:scale-105 overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
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
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>CREAR REPORTE</span>
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Additional Info Bar */}
            <div className="mt-8 text-center">
              <div className="inline-flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 px-4 md:px-6 py-3 rounded-2xl backdrop-blur-lg bg-gray-800/50 border border-gray-700">
                <div className="flex items-center space-x-2">
                  <span className="text-xs md:text-sm text-gray-400">Última actualización:</span>
                  <span className="text-xs md:text-sm font-medium text-gray-100">
                    {new Date().toLocaleDateString('es-ES')}
                  </span>
                </div>
                <div className="hidden md:block w-px h-4 bg-gray-700"></div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs md:text-sm text-gray-400">Formatos disponibles:</span>
                  <div className="flex space-x-2">
                    <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}>PDF</span>
                    <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#86efac' }}>Excel</span>
                    <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd' }}>CSV</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gestión y asignación de reportes (solo Admin) - Ubicada al final */}
          {isAdmin() && (
            <div className="mt-12 mb-8">
              <div className="bg-gray-900/80 backdrop-blur-md rounded-3xl p-8 border border-gray-700 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      Asignación Rápida de Reportes
                    </h3>
                    <p className="text-sm text-gray-300">
                      Asigna reportes pendientes al equipo de soporte o administradores
                    </p>
                  </div>
                  <button
                    onClick={loadAssignmentData}
                    className="px-4 py-2 rounded-xl text-sm font-semibold"
                    style={{
                      background: 'linear-gradient(45deg, var(--color-tertiary), var(--color-tertiary-light))',
                      color: 'var(--color-dark)'
                    }}
                  >
                    Refrescar
                  </button>
                </div>

                {assignError && (
                  <div className="mb-4 px-4 py-3 rounded-xl border"
                       style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.35)', color: '#fca5a5' }}>
                    {assignError}
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="text-left text-xs md:text-sm" style={{ color: 'rgba(252, 247, 255, 0.7)' }}>
                        <th className="px-2 md:px-6 py-2 md:py-3">ID</th>
                        <th className="px-2 md:px-6 py-2 md:py-3">Tipo</th>
                        <th className="px-2 md:px-6 py-2 md:py-3">Asunto</th>
                        <th className="px-2 md:px-6 py-2 md:py-3">Estado</th>
                        <th className="px-2 md:px-6 py-2 md:py-3">Asignado a</th>
                        <th className="px-2 md:px-6 py-2 md:py-3" style={{ width: '200px' }}>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignLoading && (
                        <tr><td className="px-6 py-6" colSpan="6" style={{ color: 'var(--color-secondary)' }}>Cargando...</td></tr>
                      )}
                      {!assignLoading && reports.length === 0 && (
                        <tr><td className="px-6 py-6" colSpan="6" style={{ color: 'var(--color-secondary)' }}>No hay reportes pendientes</td></tr>
                      )}
                      {!assignLoading && reports.map((r) => {
                        const assigned = supports.find(s => String(s.id) === String(r.revisado_por));
                        return (
                          <tr key={r.id} className="border-t border-white border-opacity-10">
                            <td className="px-2 md:px-6 py-3 md:py-4 text-xs md:text-sm" style={{ color: 'var(--color-secondary)' }}>#{r.id}</td>
                            <td className="px-2 md:px-6 py-3 md:py-4 text-xs md:text-sm" style={{ color: 'var(--color-secondary)' }}>{r.tipo_reporte}</td>
                            <td className="px-2 md:px-6 py-3 md:py-4 text-xs md:text-sm" style={{ color: 'var(--color-secondary)' }}>{r.asunto || r.asunto_conversacion || '-'}</td>
                            <td className="px-2 md:px-6 py-3 md:py-4">
                              <span className="px-2 md:px-3 py-1 rounded-full text-xs font-bold capitalize" style={{
                                backgroundColor: r.estado === 'pendiente' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                                color: r.estado === 'pendiente' ? '#fde68a' : '#93c5fd',
                                border: '1px solid rgba(252, 247, 255, 0.2)'
                              }}>{r.estado}</span>
                            </td>
                            <td className="px-2 md:px-6 py-3 md:py-4 text-xs md:text-sm" style={{ color: 'var(--color-secondary)' }}>{assigned ? assigned.nombre : '—'}</td>
                            <td className="px-2 md:px-6 py-3 md:py-4">
                              <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2">
                                <select
                                  defaultValue=""
                                  onChange={(e) => handleAssignToSupport(r.id, e.target.value)}
                                  className="w-full md:flex-1 px-2 md:px-3 py-1 md:py-2 rounded-xl bg-white bg-opacity-10 border border-white border-opacity-20 focus:outline-none text-xs md:text-sm"
                                  style={{ color: 'var(--color-secondary)' }}
                                >
                                  <option value="" style={{ color: '#0b1220' }}>Asignar a…</option>
                                  {supports.map(s => (
                                    <option key={s.id} value={s.id} style={{ color: '#0b1220' }}>
                                      {s.nombre} {s.rol === 'admin' ? '(Admin)' : '(Soporte)'}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  onClick={loadAssignmentData}
                                  className="w-full md:w-auto px-2 md:px-3 py-1 md:py-2 rounded-xl text-xs"
                                  style={{ backgroundColor: 'rgba(252, 247, 255, 0.15)', color: 'var(--color-secondary)', border: '1px solid rgba(252, 247, 255, 0.3)' }}
                                >
                                  Actualizar
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Nueva sección: Gestión completa de reportes (solo Admin) */}
          {isAdmin() && (
            <div className="mt-12 mb-8">
              <div className="bg-gray-900/80 backdrop-blur-md rounded-3xl p-8 border border-gray-700 shadow-2xl">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white">
                    Gestión Completa de Reportes
                  </h3>
                  <p className="text-sm text-gray-300">
                    Visualiza, filtra y gestiona todos los reportes del sistema con herramientas avanzadas
                  </p>
                </div>

                {/* Reports Table Component */}
                <ReportsTable 
                  user={user}
                  showStatusActions={true}
                  title="Todos los Reportes"
                  containerClassName=""
                  useDarkTheme={true}
                />
              </div>
            </div>
          )}
        </div>
        
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
        
        <div style={{ backgroundColor: 'transparent', backgroundImage: 'none' }}>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Dashboard;