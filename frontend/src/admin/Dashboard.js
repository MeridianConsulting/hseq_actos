import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getUserName } from '../utils/auth';
import '../assets/css/styles.css';

// Importar componentes de Nivo
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveRadar } from '@nivo/radar';

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const goBackToHome = () => {
    navigate('/home');
  };

  // Datos de ejemplo para los gráficos
  const incidentsByMonth = [
    { month: 'Ene', incidentes: 12, reportes: 45, capacitaciones: 8 },
    { month: 'Feb', incidentes: 8, reportes: 52, capacitaciones: 12 },
    { month: 'Mar', incidentes: 15, reportes: 38, capacitaciones: 6 },
    { month: 'Abr', incidentes: 6, reportes: 61, capacitaciones: 15 },
    { month: 'May', incidentes: 11, reportes: 49, capacitaciones: 9 },
    { month: 'Jun', incidentes: 4, reportes: 58, capacitaciones: 18 }
  ];

  const incidentsByType = [
    { id: 'Accidentes', label: 'Accidentes', value: 23, color: '#ef4444' },
    { id: 'Casi Accidentes', label: 'Casi Accidentes', value: 45, color: '#f97316' },
    { id: 'Condiciones Inseguras', label: 'Condiciones Inseguras', value: 32, color: '#eab308' },
    { id: 'Actos Inseguros', label: 'Actos Inseguros', value: 28, color: '#22c55e' },
    { id: 'Ambientales', label: 'Ambientales', value: 15, color: '#3b82f6' }
  ];

  const monthlyTrends = [
    {
      id: 'Incidentes',
      color: '#ef4444',
      data: [
        { x: 'Ene', y: 12 },
        { x: 'Feb', y: 8 },
        { x: 'Mar', y: 15 },
        { x: 'Abr', y: 6 },
        { x: 'May', y: 11 },
        { x: 'Jun', y: 4 }
      ]
    },
    {
      id: 'Reportes',
      color: '#22c55e',
      data: [
        { x: 'Ene', y: 45 },
        { x: 'Feb', y: 52 },
        { x: 'Mar', y: 38 },
        { x: 'Abr', y: 61 },
        { x: 'May', y: 49 },
        { x: 'Jun', y: 58 }
      ]
    }
  ];

  const safetyMetrics = [
    { metric: 'Cumplimiento EPP', value: 85 },
    { metric: 'Capacitación', value: 92 },
    { metric: 'Inspecciones', value: 78 },
    { metric: 'Documentación', value: 88 },
    { metric: 'Procedimientos', value: 90 },
    { metric: 'Auditorías', value: 82 }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen" style={{
        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 35%, var(--color-tertiary-dark) 100%)'
      }}>
        <div className="container mx-auto px-4 py-8 pb-8">
          {/* Header Section */}
          <div className="text-center mb-12 pt-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--color-secondary)' }}>
              Panel de Control
            </h1>
            <p className="text-xl" style={{ color: 'rgba(252, 247, 255, 0.8)' }}>
              Bienvenido al dashboard, {getUserName()}
            </p>
          </div>

          {/* Back Button */}
          <div className="mb-8">
            <button 
              onClick={goBackToHome}
              className="flex items-center space-x-2 font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
              style={{
                backgroundColor: 'rgba(252, 247, 255, 0.15)',
                color: 'var(--color-secondary)',
                border: '1px solid rgba(252, 247, 255, 0.3)'
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Volver al Inicio</span>
            </button>
          </div>

          {/* Period Filter */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              {['month', 'quarter', 'year'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`py-2 px-4 rounded-lg font-semibold transition-all duration-300 ${
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { title: 'Total Incidentes', value: '56', change: '-12%', color: '#ef4444', icon: '⚠️' },
              { title: 'Reportes Procesados', value: '303', change: '+8%', color: '#22c55e', icon: '📋' },
              { title: 'Capacitaciones', value: '68', change: '+15%', color: '#3b82f6', icon: '🎓' },
              { title: 'Días sin Accidentes', value: '45', change: '+5', color: '#f59e0b', icon: '🏆' }
            ].map((kpi, index) => (
              <div 
                key={index}
                className="backdrop-blur-2xl rounded-2xl p-6 border hover:transform hover:scale-105 transition-all duration-300"
                style={{
                  backgroundColor: 'rgba(252, 247, 255, 0.12)',
                  borderColor: 'rgba(252, 247, 255, 0.25)',
                  boxShadow: '0 10px 30px -5px rgba(4, 8, 15, 0.3)'
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{kpi.icon}</span>
                  <span 
                    className="text-sm font-bold px-2 py-1 rounded"
                    style={{ 
                      backgroundColor: kpi.change.startsWith('+') ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: kpi.change.startsWith('+') ? '#86efac' : '#fca5a5'
                    }}
                  >
                    {kpi.change}
                  </span>
                </div>
                <h3 className="text-3xl font-bold mb-1" style={{ color: kpi.color }}>
                  {kpi.value}
                </h3>
                <p className="text-sm" style={{ color: 'rgba(252, 247, 255, 0.7)' }}>
                  {kpi.title}
                </p>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Bar Chart - Incidentes por Mes */}
            <div 
              className="backdrop-blur-2xl rounded-2xl p-6 border"
              style={{
                backgroundColor: 'rgba(252, 247, 255, 0.12)',
                borderColor: 'rgba(252, 247, 255, 0.25)',
                height: '400px'
              }}
            >
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-secondary)' }}>
                Incidentes y Reportes por Mes
              </h3>
              <div style={{ height: '320px' }}>
                <ResponsiveBar
                  data={incidentsByMonth}
                  keys={['incidentes', 'reportes']}
                  indexBy="month"
                  margin={{ top: 20, right: 80, bottom: 50, left: 60 }}
                  padding={0.3}
                  valueScale={{ type: 'linear' }}
                  colors={['#ef4444', '#22c55e']}
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
                      translateX: 120,
                      translateY: 0,
                      itemsSpacing: 2,
                      itemWidth: 100,
                      itemHeight: 20,
                      itemTextColor: '#fcf7ff'
                    }
                  ]}
                />
              </div>
            </div>

            {/* Pie Chart - Incidentes por Tipo */}
            <div 
              className="backdrop-blur-2xl rounded-2xl p-6 border"
              style={{
                backgroundColor: 'rgba(252, 247, 255, 0.12)',
                borderColor: 'rgba(252, 247, 255, 0.25)',
                height: '400px'
              }}
            >
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-secondary)' }}>
                Distribución de Incidentes por Tipo
              </h3>
              <div style={{ height: '320px' }}>
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
          </div>

          {/* Second Row Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Line Chart - Tendencias Mensuales */}
            <div 
              className="backdrop-blur-2xl rounded-2xl p-6 border"
              style={{
                backgroundColor: 'rgba(252, 247, 255, 0.12)',
                borderColor: 'rgba(252, 247, 255, 0.25)',
                height: '400px'
              }}
            >
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-secondary)' }}>
                Tendencias Mensuales
              </h3>
              <div style={{ height: '320px' }}>
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

            {/* Radar Chart - Métricas de Seguridad */}
            <div 
              className="backdrop-blur-2xl rounded-2xl p-6 border"
              style={{
                backgroundColor: 'rgba(252, 247, 255, 0.12)',
                borderColor: 'rgba(252, 247, 255, 0.25)',
                height: '400px'
              }}
            >
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-secondary)' }}>
                Métricas de Seguridad (%)
              </h3>
              <div style={{ height: '320px' }}>
                <ResponsiveRadar
                  data={safetyMetrics}
                  keys={['value']}
                  indexBy="metric"
                  maxValue={100}
                  margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
                  curve="linearClosed"
                  borderWidth={2}
                  borderColor={{ from: 'color' }}
                  gridLevels={5}
                  gridShape="circular"
                  gridLabelOffset={36}
                  enableDots={true}
                  dotSize={10}
                  dotColor={{ theme: 'background' }}
                  dotBorderWidth={2}
                  dotBorderColor={{ from: 'color' }}
                  enableDotLabel={true}
                  dotLabel="value"
                  dotLabelYOffset={-12}
                  colors={['#22c55e']}
                  theme={{
                    background: 'transparent',
                    text: { fill: '#fcf7ff' },
                    grid: { line: { stroke: 'rgba(252, 247, 255, 0.2)' } }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Download Reports Section */}
          <div className="mt-12 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Reporte Principal */}
              <div 
                className="backdrop-blur-2xl rounded-3xl p-8 border hover:transform hover:scale-105 transition-all duration-500"
                style={{
                  backgroundColor: 'rgba(252, 247, 255, 0.15)',
                  borderColor: 'rgba(252, 247, 255, 0.3)',
                  boxShadow: '0 20px 50px -15px rgba(4, 8, 15, 0.5)'
                }}
              >
                <div className="text-center">
                  <div className="text-5xl mb-6">📊</div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-secondary)' }}>
                    Reporte Ejecutivo HSEQ
                  </h3>
                  <p className="text-sm mb-6" style={{ color: 'rgba(252, 247, 255, 0.8)' }}>
                    Reporte completo con métricas, estadísticas y análisis de tendencias del sistema HSEQ
                  </p>
                  
                  {/* Stats preview */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-lg font-bold" style={{ color: 'var(--color-tertiary)' }}>56</div>
                      <div className="text-xs opacity-70" style={{ color: 'rgba(252, 247, 255, 0.6)' }}>Incidentes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold" style={{ color: 'var(--color-tertiary)' }}>303</div>
                      <div className="text-xs opacity-70" style={{ color: 'rgba(252, 247, 255, 0.6)' }}>Reportes</div>
                    </div>
                  </div>
                  
                  <button 
                    className="w-full group relative font-bold py-4 px-6 rounded-2xl transition-all duration-500 transform hover:scale-105 overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
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
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>DESCARGAR PDF</span>
                    </span>
                  </button>
                </div>
              </div>

              {/* Reportes Detallados */}
              <div 
                className="backdrop-blur-2xl rounded-3xl p-8 border hover:transform hover:scale-105 transition-all duration-500"
                style={{
                  backgroundColor: 'rgba(252, 247, 255, 0.15)',
                  borderColor: 'rgba(252, 247, 255, 0.3)',
                  boxShadow: '0 20px 50px -15px rgba(4, 8, 15, 0.5)'
                }}
              >
                <div className="text-center">
                  <div className="text-5xl mb-6">📋</div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-secondary)' }}>
                    Reportes Detallados
                  </h3>
                  <p className="text-sm mb-6" style={{ color: 'rgba(252, 247, 255, 0.8)' }}>
                    Accede a reportes específicos por departamento, tipo de incidente y período
                  </p>
                  
                  {/* Quick actions */}
                  <div className="space-y-3 mb-6">
                    <button 
                      className="w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 border text-sm"
                      style={{
                        backgroundColor: 'rgba(252, 247, 255, 0.1)',
                        color: 'var(--color-secondary)',
                        borderColor: 'rgba(252, 247, 255, 0.3)'
                      }}
                    >
                      📊 Reporte por Departamento
                    </button>
                    <button 
                      className="w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 border text-sm"
                      style={{
                        backgroundColor: 'rgba(252, 247, 255, 0.1)',
                        color: 'var(--color-secondary)',
                        borderColor: 'rgba(252, 247, 255, 0.3)'
                      }}
                    >
                      📈 Análisis de Tendencias
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
            </div>
            
            {/* Additional Info Bar */}
            <div className="mt-8 text-center">
              <div 
                className="inline-flex items-center space-x-6 px-6 py-3 rounded-2xl backdrop-blur-lg"
                style={{
                  backgroundColor: 'rgba(252, 247, 255, 0.1)',
                  border: '1px solid rgba(252, 247, 255, 0.2)'
                }}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm" style={{ color: 'rgba(252, 247, 255, 0.7)' }}>Última actualización:</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--color-secondary)' }}>
                    {new Date().toLocaleDateString('es-ES')}
                  </span>
                </div>
                <div className="w-px h-4" style={{ backgroundColor: 'rgba(252, 247, 255, 0.3)' }}></div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm" style={{ color: 'rgba(252, 247, 255, 0.7)' }}>Formatos disponibles:</span>
                  <div className="flex space-x-2">
                    <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}>PDF</span>
                    <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#86efac' }}>Excel</span>
                    <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd' }}>CSV</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: 'transparent', backgroundImage: 'none' }}>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
