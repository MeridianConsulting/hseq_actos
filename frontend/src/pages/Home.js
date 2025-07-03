import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getUser, logout, getUserName, isAdmin, isCoordinator } from '../utils/auth';
import '../assets/css/styles.css';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const userData = getUser();
    if (userData) {
      setUser(userData);
      // Animation entrance effect
      setTimeout(() => setIsVisible(true), 100);
    }
  }, []);

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 35%, var(--color-tertiary-dark) 100%)'
      }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen" style={{
        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 35%, var(--color-tertiary-dark) 100%)'
      }}>
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden">
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

        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className={`transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--color-secondary)' }}>
                ¡Bienvenido, {getUserName()}!
              </h1>
              <p className="text-xl" style={{ color: 'rgba(252, 247, 255, 0.8)' }}>
                Plataforma HSEQ - Sistema de Gestión de Seguridad y Calidad
              </p>
            </div>

            {/* User Info Card */}
            <div className={`max-w-2xl mx-auto mb-8 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div 
                className="backdrop-blur-2xl rounded-3xl shadow-2xl border p-8"
                style={{
                  backgroundColor: 'rgba(252, 247, 255, 0.12)',
                  borderColor: 'rgba(252, 247, 255, 0.25)',
                  boxShadow: '0 25px 50px -12px rgba(4, 8, 15, 0.4)'
                }}
              >
                <div className="text-center mb-6">
                  <div 
                    className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(51, 97, 157, 0.3)' }}
                  >
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-secondary)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-secondary)' }}>
                    Información del Usuario
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white bg-opacity-10 rounded-xl p-4">
                    <p className="text-sm font-semibold mb-1" style={{ color: 'rgba(252, 247, 255, 0.7)' }}>Nombre Completo</p>
                    <p className="text-lg font-bold" style={{ color: 'var(--color-secondary)' }}>{user.nombre}</p>
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-xl p-4">
                    <p className="text-sm font-semibold mb-1" style={{ color: 'rgba(252, 247, 255, 0.7)' }}>Documento</p>
                    <p className="text-lg font-bold" style={{ color: 'var(--color-secondary)' }}>{user.cedula}</p>
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-xl p-4">
                    <p className="text-sm font-semibold mb-1" style={{ color: 'rgba(252, 247, 255, 0.7)' }}>Correo Electrónico</p>
                    <p className="text-lg font-bold" style={{ color: 'var(--color-secondary)' }}>{user.correo}</p>
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-xl p-4">
                    <p className="text-sm font-semibold mb-1" style={{ color: 'rgba(252, 247, 255, 0.7)' }}>Rol del Sistema</p>
                    <span 
                      className="inline-block px-3 py-1 rounded-full text-sm font-bold capitalize"
                      style={{
                        backgroundColor: isAdmin() ? 'rgba(220, 38, 38, 0.2)' : 
                                       isCoordinator() ? 'rgba(59, 130, 246, 0.2)' : 
                                       'rgba(34, 197, 94, 0.2)',
                        color: isAdmin() ? '#fca5a5' : 
                               isCoordinator() ? '#93c5fd' : 
                               '#86efac'
                      }}
                    >
                      {user.rol}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 max-w-md mx-auto transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {/* Dashboard Button */}
              <button 
                className="flex-1 group relative font-bold py-4 px-6 rounded-2xl transition-all duration-500 transform hover:scale-105 overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
                style={{
                  background: 'linear-gradient(45deg, var(--color-tertiary), var(--color-tertiary-light))',
                  color: 'var(--color-dark)',
                  boxShadow: '0 10px 25px -5px rgba(99, 201, 219, 0.4)',
                  '--focus-ring-color': 'rgba(99, 201, 219, 0.5)'
                }}
              >
                <div 
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(252, 247, 255, 0.3), transparent)'
                  }}
                ></div>
                <span className="relative flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Panel Principal</span>
                </span>
              </button>

              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="group relative font-bold py-4 px-6 rounded-2xl transition-all duration-500 transform hover:scale-105 overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
                style={{
                  background: 'linear-gradient(45deg, #dc2626, #ef4444)',
                  color: 'white',
                  boxShadow: '0 10px 25px -5px rgba(220, 38, 38, 0.4)',
                  '--focus-ring-color': 'rgba(220, 38, 38, 0.5)'
                }}
              >
                <div 
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)'
                  }}
                ></div>
                <span className="relative flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Cerrar Sesión</span>
                </span>
              </button>
            </div>

            {/* Quick Stats or Actions for Admins */}
            {(isAdmin() || isCoordinator()) && (
              <div className={`max-w-4xl mx-auto mt-12 transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div 
                    className="backdrop-blur-xl rounded-2xl p-6 text-center border"
                    style={{
                      backgroundColor: 'rgba(252, 247, 255, 0.08)',
                      borderColor: 'rgba(252, 247, 255, 0.2)'
                    }}
                  >
                    <div className="text-3xl mb-2">📊</div>
                    <h4 className="font-bold mb-2" style={{ color: 'var(--color-secondary)' }}>Reportes</h4>
                    <p className="text-sm" style={{ color: 'rgba(252, 247, 255, 0.7)' }}>Gestionar reportes HSEQ</p>
                  </div>
                  <div 
                    className="backdrop-blur-xl rounded-2xl p-6 text-center border"
                    style={{
                      backgroundColor: 'rgba(252, 247, 255, 0.08)',
                      borderColor: 'rgba(252, 247, 255, 0.2)'
                    }}
                  >
                    <div className="text-3xl mb-2">👥</div>
                    <h4 className="font-bold mb-2" style={{ color: 'var(--color-secondary)' }}>Usuarios</h4>
                    <p className="text-sm" style={{ color: 'rgba(252, 247, 255, 0.7)' }}>Administrar usuarios</p>
                  </div>
                  <div 
                    className="backdrop-blur-xl rounded-2xl p-6 text-center border"
                    style={{
                      backgroundColor: 'rgba(252, 247, 255, 0.08)',
                      borderColor: 'rgba(252, 247, 255, 0.2)'
                    }}
                  >
                    <div className="text-3xl mb-2">⚙️</div>
                    <h4 className="font-bold mb-2" style={{ color: 'var(--color-secondary)' }}>Configuración</h4>
                    <p className="text-sm" style={{ color: 'rgba(252, 247, 255, 0.7)' }}>Configurar sistema</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Custom Styles for Animations */}
        <style jsx>{`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          
          .animate-blob {
            animation: blob 7s infinite;
          }
          
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
          
          button:hover {
            box-shadow: var(--hover-shadow) !important;
          }

          button:focus {
            box-shadow: 0 0 0 2px var(--focus-ring-color) !important;
          }
        `}</style>
      </div>    
      <Footer />
    </>
  );
};

export default Home; 