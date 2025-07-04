import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getUserName, isAdmin, isCoordinator } from '../utils/auth';
import '../assets/css/styles.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const goBackToHome = () => {
    navigate('/home');
  };

  return (
    <>
      <Header />
      <div className="min-h-screen" style={{
        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 35%, var(--color-tertiary-dark) 100%)'
      }}>
        <div className="container mx-auto px-4 py-8">
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

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Card 1 - Reportes */}
            <div 
              className="backdrop-blur-2xl rounded-2xl p-6 border hover:transform hover:scale-105 transition-all duration-300"
              style={{
                backgroundColor: 'rgba(252, 247, 255, 0.12)',
                borderColor: 'rgba(252, 247, 255, 0.25)',
                boxShadow: '0 10px 30px -5px rgba(4, 8, 15, 0.3)'
              }}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-secondary)' }}>
                  Reportes HSEQ
                </h3>
                <p className="text-sm mb-4" style={{ color: 'rgba(252, 247, 255, 0.7)' }}>
                  Gestiona y visualiza reportes de seguridad
                </p>
                <button 
                  className="w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--color-tertiary)',
                    color: 'var(--color-dark)'
                  }}
                >
                  Ver Reportes
                </button>
              </div>
            </div>

            {/* Card 2 - Usuarios (solo para admin/coordinator) */}
            {(isAdmin() || isCoordinator()) && (
              <div 
                className="backdrop-blur-2xl rounded-2xl p-6 border hover:transform hover:scale-105 transition-all duration-300"
                style={{
                  backgroundColor: 'rgba(252, 247, 255, 0.12)',
                  borderColor: 'rgba(252, 247, 255, 0.25)',
                  boxShadow: '0 10px 30px -5px rgba(4, 8, 15, 0.3)'
                }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">👥</div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-secondary)' }}>
                    Gestión de Usuarios
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'rgba(252, 247, 255, 0.7)' }}>
                    Administra usuarios del sistema
                  </p>
                  <button 
                    className="w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300"
                    style={{
                      backgroundColor: 'var(--color-tertiary)',
                      color: 'var(--color-dark)'
                    }}
                  >
                    Gestionar
                  </button>
                </div>
              </div>
            )}

            {/* Card 3 - Configuración */}
            <div 
              className="backdrop-blur-2xl rounded-2xl p-6 border hover:transform hover:scale-105 transition-all duration-300"
              style={{
                backgroundColor: 'rgba(252, 247, 255, 0.12)',
                borderColor: 'rgba(252, 247, 255, 0.25)',
                boxShadow: '0 10px 30px -5px rgba(4, 8, 15, 0.3)'
              }}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">⚙️</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-secondary)' }}>
                  Configuración
                </h3>
                <p className="text-sm mb-4" style={{ color: 'rgba(252, 247, 255, 0.7)' }}>
                  Ajustes del sistema y perfil
                </p>
                <button 
                  className="w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--color-tertiary)',
                    color: 'var(--color-dark)'
                  }}
                >
                  Configurar
                </button>
              </div>
            </div>

            {/* Card 4 - Estadísticas */}
            <div 
              className="backdrop-blur-2xl rounded-2xl p-6 border hover:transform hover:scale-105 transition-all duration-300"
              style={{
                backgroundColor: 'rgba(252, 247, 255, 0.12)',
                borderColor: 'rgba(252, 247, 255, 0.25)',
                boxShadow: '0 10px 30px -5px rgba(4, 8, 15, 0.3)'
              }}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-secondary)' }}>
                  Estadísticas
                </h3>
                <p className="text-sm mb-4" style={{ color: 'rgba(252, 247, 255, 0.7)' }}>
                  Métricas y análisis de datos
                </p>
                <button 
                  onClick={() => navigate('/statistics')}
                  className="w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--color-tertiary)',
                    color: 'var(--color-dark)'
                  }}
                >
                  Ver Métricas
                </button>
              </div>
            </div>

            {/* Card 5 - Incidentes */}
            <div 
              className="backdrop-blur-2xl rounded-2xl p-6 border hover:transform hover:scale-105 transition-all duration-300"
              style={{
                backgroundColor: 'rgba(252, 247, 255, 0.12)',
                borderColor: 'rgba(252, 247, 255, 0.25)',
                boxShadow: '0 10px 30px -5px rgba(4, 8, 15, 0.3)'
              }}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-secondary)' }}>
                  Gestión de Incidentes
                </h3>
                <p className="text-sm mb-4" style={{ color: 'rgba(252, 247, 255, 0.7)' }}>
                  Registra y monitorea incidentes
                </p>
                <button 
                  className="w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--color-tertiary)',
                    color: 'var(--color-dark)'
                  }}
                >
                  Ver Incidentes
                </button>
              </div>
            </div>

            {/* Card 6 - Capacitaciones */}
            <div 
              className="backdrop-blur-2xl rounded-2xl p-6 border hover:transform hover:scale-105 transition-all duration-300"
              style={{
                backgroundColor: 'rgba(252, 247, 255, 0.12)',
                borderColor: 'rgba(252, 247, 255, 0.25)',
                boxShadow: '0 10px 30px -5px rgba(4, 8, 15, 0.3)'
              }}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">🎓</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-secondary)' }}>
                  Capacitaciones
                </h3>
                <p className="text-sm mb-4" style={{ color: 'rgba(252, 247, 255, 0.7)' }}>
                  Programas de entrenamiento
                </p>
                <button 
                  className="w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--color-tertiary)',
                    color: 'var(--color-dark)'
                  }}
                >
                  Ver Cursos
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div 
            className="backdrop-blur-2xl rounded-2xl p-8 border text-center"
            style={{
              backgroundColor: 'rgba(252, 247, 255, 0.08)',
              borderColor: 'rgba(252, 247, 255, 0.2)'
            }}
          >
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-secondary)' }}>
              Acciones Rápidas
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                className="py-2 px-6 rounded-lg font-semibold transition-all duration-300 hover:transform hover:scale-105"
                style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  color: '#93c5fd',
                  border: '1px solid rgba(59, 130, 246, 0.3)'
                }}
              >
                Nuevo Reporte
              </button>
              <button 
                className="py-2 px-6 rounded-lg font-semibold transition-all duration-300 hover:transform hover:scale-105"
                style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  color: '#86efac',
                  border: '1px solid rgba(34, 197, 94, 0.3)'
                }}
              >
                Registrar Incidente
              </button>
              <button 
                className="py-2 px-6 rounded-lg font-semibold transition-all duration-300 hover:transform hover:scale-105"
                style={{
                  backgroundColor: 'rgba(168, 85, 247, 0.2)',
                  color: '#c4b5fd',
                  border: '1px solid rgba(168, 85, 247, 0.3)'
                }}
              >
                Generar Informe
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
