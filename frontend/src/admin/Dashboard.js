import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getUser, logout, getUserName, isAdmin, isCoordinator } from '../utils/auth';
import '../assets/css/styles.css';

// Importar componentes de Nivo
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveRadar } from '@nivo/radar';

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [user, setUser] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const userData = getUser();
    if (userData) {
      setUser(userData);
      setTimeout(() => setIsVisible(true), 100);
    }
  }, []);

  const handleLogout = () => {
    logout();
  };

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
      <div className="dashboard-container" style={{
        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 35%, var(--color-tertiary-dark) 100%)'
      }}>
        {/* Animated Background Particles */}
        <div className="dashboard-background">
          <div 
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full mix-blend-multiply filter blur-xl animate-blob"
            style={{ backgroundColor: 'rgba(51, 97, 157, 0.15)' }}
          ></div>
          <div 
            className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"
            style={{ backgroundColor: 'rgba(99, 201, 219, 0.12)' }}
          ></div>
          <div 
            className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"
            style={{ backgroundColor: 'rgba(244, 211, 94, 0.08)' }}
          ></div>
        </div>
        
        {/* Main Content Container */}
        <div className="dashboard-content container mx-auto px-4 pb-8 pt-8">

          {/* Welcome Section */}
          {user && (
            <div className={`transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--color-secondary)' }}>
                  ¡Bienvenido, {getUserName()}!
                </h1>
                <p className="text-xl" style={{ color: 'rgba(252, 247, 255, 0.8)' }}>
                  Plataforma HSEQ - Sistema de Gestión de Seguridad y Calidad
                </p>
              </div>

              {/* User Information Card - Redesigned */}
              <div className="max-w-4xl mx-auto mb-8 transition-all duration-1000 delay-300">
                <div 
                  className="backdrop-blur-2xl rounded-3xl shadow-2xl border overflow-hidden"
                  style={{
                    backgroundColor: 'rgba(252, 247, 255, 0.12)',
                    borderColor: 'rgba(252, 247, 255, 0.25)',
                    boxShadow: '0 25px 50px -12px rgba(4, 8, 15, 0.4)'
                  }}
                >
                  {/* Header Section with Avatar */}
                  <div 
                    className="relative p-8 text-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(51, 97, 157, 0.2) 0%, rgba(99, 201, 219, 0.1) 100%)',
                      borderBottom: '1px solid rgba(252, 247, 255, 0.1)'
                    }}
                  >
                    {/* Decorative background elements */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                      <div 
                        className="absolute -top-10 -left-10 w-20 h-20 rounded-full opacity-20"
                        style={{ backgroundColor: 'var(--color-accent)' }}
                      ></div>
                      <div 
                        className="absolute -bottom-10 -right-10 w-16 h-16 rounded-full opacity-15"
                        style={{ backgroundColor: 'var(--color-tertiary)' }}
                      ></div>
                    </div>
                    
                    {/* Avatar and User Info */}
                    <div className="relative z-10">
                      <div 
                        className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center relative group"
                        style={{ 
                          background: 'linear-gradient(135deg, rgba(51, 97, 157, 0.3) 0%, rgba(99, 201, 219, 0.2) 100%)',
                          border: '3px solid rgba(252, 247, 255, 0.3)'
                        }}
                      >
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-secondary)' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <div 
                          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: 'linear-gradient(135deg, rgba(244, 211, 94, 0.2) 0%, rgba(99, 201, 219, 0.2) 100%)'
                          }}
                        ></div>
                      </div>
                      <h3 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-secondary)' }}>
                        {user.nombre}
                      </h3>
                      <span 
                        className="inline-block px-4 py-2 rounded-full text-sm font-bold capitalize"
                        style={{
                          backgroundColor: isAdmin() ? 'rgba(220, 38, 38, 0.2)' : 
                                         isCoordinator() ? 'rgba(59, 130, 246, 0.2)' : 
                                         'rgba(34, 197, 94, 0.2)',
                          color: isAdmin() ? '#fca5a5' : 
                                 isCoordinator() ? '#93c5fd' : 
                                 '#86efac',
                          border: '1px solid rgba(252, 247, 255, 0.2)'
                        }}
                      >
                        {user.rol}
                      </span>
                    </div>
                  </div>

                  {/* User Details Grid */}
                  <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold mb-4 flex items-center" style={{ color: 'var(--color-secondary)' }}>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Información Personal
                        </h4>
                        <div className="space-y-3">
                          <div className="bg-white bg-opacity-5 rounded-xl p-4 border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300">
                            <p className="text-xs font-medium mb-1" style={{ color: 'rgba(252, 247, 255, 0.6)' }}>NOMBRE COMPLETO</p>
                            <p className="text-lg font-semibold" style={{ color: 'var(--color-secondary)' }}>{user.nombre}</p>
                          </div>
                          <div className="bg-white bg-opacity-5 rounded-xl p-4 border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300">
                            <p className="text-xs font-medium mb-1" style={{ color: 'rgba(252, 247, 255, 0.6)' }}>DOCUMENTO</p>
                            <p className="text-lg font-semibold" style={{ color: 'var(--color-secondary)' }}>{user.cedula}</p>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold mb-4 flex items-center" style={{ color: 'var(--color-secondary)' }}>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Información de Contacto
                        </h4>
                        <div className="space-y-3">
                          <div className="bg-white bg-opacity-5 rounded-xl p-4 border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300">
                            <p className="text-xs font-medium mb-1" style={{ color: 'rgba(252, 247, 255, 0.6)' }}>CORREO ELECTRÓNICO</p>
                            <p className="text-lg font-semibold" style={{ color: 'var(--color-secondary)' }}>{user.correo}</p>
                          </div>
                          <div className="bg-white bg-opacity-5 rounded-xl p-4 border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300">
                            <p className="text-xs font-medium mb-1" style={{ color: 'rgba(252, 247, 255, 0.6)' }}>ESTADO</p>
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#22c55e' }}></div>
                              <p className="text-sm font-medium" style={{ color: '#86efac' }}>Activo</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* System Information */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold mb-4 flex items-center" style={{ color: 'var(--color-secondary)' }}>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Información del Sistema
                        </h4>
                        <div className="space-y-3">
                          <div className="bg-white bg-opacity-5 rounded-xl p-4 border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300">
                            <p className="text-xs font-medium mb-1" style={{ color: 'rgba(252, 247, 255, 0.6)' }}>ROL DEL SISTEMA</p>
                            <span 
                              className="inline-block px-3 py-1 rounded-full text-sm font-bold capitalize"
                              style={{
                                backgroundColor: isAdmin() ? 'rgba(220, 38, 38, 0.2)' : 
                                               isCoordinator() ? 'rgba(59, 130, 246, 0.2)' : 
                                               'rgba(34, 197, 94, 0.2)',
                                color: isAdmin() ? '#fca5a5' : 
                                       isCoordinator() ? '#93c5fd' : 
                                       '#86efac',
                                border: '1px solid rgba(252, 247, 255, 0.2)'
                              }}
                            >
                              {user.rol}
                            </span>
                          </div>
                          <div className="bg-white bg-opacity-5 rounded-xl p-4 border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300">
                            <p className="text-xs font-medium mb-1" style={{ color: 'rgba(252, 247, 255, 0.6)' }}>ÚLTIMO ACCESO</p>
                            <p className="text-sm font-medium" style={{ color: 'var(--color-secondary)' }}>
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
          )}

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

          {/* Charts Grid - Enhanced */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Bar Chart - Incidentes por Mes */}
            <div 
              className="chart-container group"
              style={{
                background: 'linear-gradient(135deg, rgba(252, 247, 255, 0.15) 0%, rgba(252, 247, 255, 0.08) 100%)',
                border: '1px solid rgba(252, 247, 255, 0.2)',
                borderRadius: '1.5rem',
                padding: '1.5rem',
                height: '450px',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 20px 40px -10px rgba(4, 8, 15, 0.3)',
                transition: 'all 0.4s cubic-bezier(0.19, 1, 0.22, 1)'
              }}
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                <div className="w-full h-full rounded-full" style={{ background: 'linear-gradient(45deg, var(--color-accent), var(--color-tertiary))' }}></div>
              </div>
              
              {/* Chart Header */}
              <div className="relative z-10 mb-6">
                <div className="flex items-center justify-between mb-3">
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
                      <h3 className="text-xl font-bold" style={{ color: 'var(--color-secondary)' }}>
                        Incidentes y Reportes
                      </h3>
                      <p className="text-sm" style={{ color: 'rgba(252, 247, 255, 0.6)' }}>
                        Análisis mensual
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
              className="chart-container group"
              style={{
                background: 'linear-gradient(135deg, rgba(252, 247, 255, 0.15) 0%, rgba(252, 247, 255, 0.08) 100%)',
                border: '1px solid rgba(252, 247, 255, 0.2)',
                borderRadius: '1.5rem',
                padding: '1.5rem',
                height: '450px',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 20px 40px -10px rgba(4, 8, 15, 0.3)',
                transition: 'all 0.4s cubic-bezier(0.19, 1, 0.22, 1)'
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
                    <div className="text-2xl font-bold" style={{ color: 'var(--color-secondary)' }}>143</div>
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
          </div>

          {/* Second Row Charts - Enhanced */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Line Chart - Tendencias Mensuales */}
            <div 
              className="chart-container group"
              style={{
                background: 'linear-gradient(135deg, rgba(252, 247, 255, 0.15) 0%, rgba(252, 247, 255, 0.08) 100%)',
                border: '1px solid rgba(252, 247, 255, 0.2)',
                borderRadius: '1.5rem',
                padding: '1.5rem',
                height: '450px',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 20px 40px -10px rgba(4, 8, 15, 0.3)',
                transition: 'all 0.4s cubic-bezier(0.19, 1, 0.22, 1)'
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

            {/* Radar Chart - Métricas de Seguridad */}
            <div 
              className="chart-container group"
              style={{
                background: 'linear-gradient(135deg, rgba(252, 247, 255, 0.15) 0%, rgba(252, 247, 255, 0.08) 100%)',
                border: '1px solid rgba(252, 247, 255, 0.2)',
                borderRadius: '1.5rem',
                padding: '1.5rem',
                height: '450px',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 20px 40px -10px rgba(4, 8, 15, 0.3)',
                transition: 'all 0.4s cubic-bezier(0.19, 1, 0.22, 1)'
              }}
            >
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-20 h-20 opacity-5">
                <div className="w-full h-full rounded-full" style={{ background: 'linear-gradient(45deg, var(--color-primary), var(--color-tertiary))' }}></div>
              </div>
              
              {/* Chart Header */}
              <div className="relative z-10 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ 
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                      }}
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold" style={{ color: 'var(--color-secondary)' }}>
                        Métricas de Seguridad
                      </h3>
                      <p className="text-sm" style={{ color: 'rgba(252, 247, 255, 0.6)' }}>
                        Indicadores clave
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold" style={{ color: '#22c55e' }}>85.8%</div>
                    <div className="text-xs" style={{ color: 'rgba(252, 247, 255, 0.6)' }}>Promedio</div>
                  </div>
                </div>
              </div>
              
              {/* Chart Container */}
              <div className="relative" style={{ height: '320px' }}>
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
