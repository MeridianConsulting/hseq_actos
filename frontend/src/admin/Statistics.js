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

const Statistics = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const goBackToDashboard = () => {
    navigate('/dashboard');
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
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-8 pt-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--color-secondary)' }}>
              📊 Dashboard de Estadísticas
            </h1>
            <p className="text-xl" style={{ color: 'rgba(252, 247, 255, 0.8)' }}>
              Métricas y análisis del sistema HSEQ - {getUserName()}
            </p>
          </div>

          {/* Navigation and Filters */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <button 
              onClick={goBackToDashboard}
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
              <span>Volver al Dashboard</span>
            </button>

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
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Statistics;
