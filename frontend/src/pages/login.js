import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/img/logo_meridian_blanco.png';
import '../assets/css/styles.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Animation entrance effect
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simular carga
    setTimeout(() => {
      setIsLoading(false);
      console.log('Login data:', formData);
    }, 2000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4" style={{
      background: `linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 35%, var(--color-tertiary-dark) 100%)`
    }}>
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs using brand colors */}
        <div 
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full mix-blend-multiply filter blur-xl animate-blob"
          style={{ backgroundColor: 'rgba(51, 97, 157, 0.15)' }} // primary color
        ></div>
        <div 
          className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"
          style={{ backgroundColor: 'rgba(99, 201, 219, 0.12)' }} // tertiary color
        ></div>
        <div 
          className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"
          style={{ backgroundColor: 'rgba(244, 211, 94, 0.08)' }} // accent color
        ></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        
        {/* Animated Lines using brand gradient */}
        <div className="absolute inset-0">
          <svg className="w-full h-full">
            <defs>
              <linearGradient id="brand-line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(51, 97, 157, 0.15)" />
                <stop offset="50%" stopColor="rgba(99, 201, 219, 0.12)" />
                <stop offset="100%" stopColor="rgba(244, 211, 94, 0.1)" />
              </linearGradient>
            </defs>
            <path d="M0,50 Q250,25 500,50 T1000,50" stroke="url(#brand-line-gradient)" strokeWidth="2" fill="none" className="animate-pulse" />
            <path d="M0,150 Q300,125 600,150 T1200,150" stroke="url(#brand-line-gradient)" strokeWidth="1" fill="none" className="animate-pulse animation-delay-1000" />
          </svg>
        </div>
      </div>

      {/* Login Card - CENTRADO PERFECTAMENTE */}
      <div className={`relative w-full max-w-md mx-auto z-10 transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}>
        {/* Multiple Shadow Layers for Depth using brand colors */}
        <div 
          className="absolute -inset-1 rounded-3xl blur-lg opacity-40 animate-pulse"
          style={{
            background: `linear-gradient(45deg, rgba(51, 97, 157, 0.25), rgba(99, 201, 219, 0.2), rgba(244, 211, 94, 0.15))`
          }}
        ></div>
        <div 
          className="absolute -inset-2 rounded-3xl blur-2xl opacity-20"
          style={{
            background: `linear-gradient(45deg, rgba(51, 97, 157, 0.15), rgba(99, 201, 219, 0.1))`
          }}
        ></div>
        
        {/* Main Card with Advanced Glassmorphism using brand colors */}
        <div 
          className="relative backdrop-blur-2xl rounded-3xl shadow-2xl border overflow-hidden group transition-all duration-700"
          style={{
            backgroundColor: 'rgba(252, 247, 255, 0.12)', // secondary with transparency
            borderColor: 'rgba(252, 247, 255, 0.25)',
            boxShadow: '0 25px 50px -12px rgba(4, 8, 15, 0.4)'
          }}
        >
          {/* Shimmer Effect using brand colors */}
          <div 
            className="absolute inset-0 -translate-x-full animate-shimmer group-hover:translate-x-full transition-transform duration-1000"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(252, 247, 255, 0.1), transparent)`
            }}
          ></div>
          
          {/* Logo Meridian - Movido dentro del contenedor */}
          <div className={`relative px-8 pt-8 pb-4 text-center transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
            <div className="relative group inline-block">
              <div 
                className="absolute -inset-2 rounded-xl blur-sm group-hover:blur opacity-0 group-hover:opacity-100 transition-all duration-500"
                style={{ 
                  background: `linear-gradient(45deg, rgba(51, 97, 157, 0.3), rgba(99, 201, 219, 0.2))` 
                }}
              ></div>
              <img 
                src={logo} 
                alt="Meridian Consulting" 
                className="relative h-12 w-auto sm:h-14 md:h-16 filter drop-shadow-2xl group-hover:scale-110 transition-all duration-500"
                style={{
                  filter: 'drop-shadow(0 10px 25px rgba(51, 97, 157, 0.3)) drop-shadow(0 0 20px rgba(99, 201, 219, 0.2))'
                }}
              />
            </div>
          </div>
          
          {/* Header with Enhanced Gradient using brand colors */}
          <div 
            className={`relative px-8 py-6 text-center transition-all duration-700 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0'}`}
            style={{
              background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 50%, var(--color-tertiary-dark) 100%)`
            }}
          >
            {/* Animated Background Elements */}
            <div 
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, rgba(252, 247, 255, 0.08) 0%, transparent 50%, rgba(252, 247, 255, 0.05) 100%)`
              }}
            ></div>
            <div 
              className="absolute top-0 left-0 w-full h-1"
              style={{
                background: `linear-gradient(90deg, transparent, rgba(244, 211, 94, 0.6), transparent)`
              }}
            ></div>
            
            <div className="relative z-10">
              <h1 
                className="text-3xl font-bold mb-4 animate-text-shimmer"
                style={{ color: 'var(--color-secondary)' }}
              >
                HSEQ Platform
              </h1>
              <div className="text-sm space-y-3" style={{ color: 'rgba(252, 247, 255, 0.9)' }}>
                <p className="font-semibold tracking-wide">
                  Sistema de Gestión de Seguridad y Calidad
                </p>
                <p className="text-xs leading-relaxed max-w-xs mx-auto" style={{ color: 'rgba(252, 247, 255, 0.75)' }}>
                  Reporte de incidentes, hallazgos, condiciones y actos inseguros de manera trazable y accesible
                </p>
              </div>
            </div>
          </div>

          {/* Platform Info Section with Enhanced Design using brand colors */}
          <div 
            className={`px-8 py-5 border-b transition-all duration-700 delay-500 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-5 opacity-0'}`}
            style={{
              background: `linear-gradient(90deg, rgba(252, 247, 255, 0.08), rgba(99, 201, 219, 0.05))`,
              borderColor: 'rgba(252, 247, 255, 0.15)'
            }}
          >
            <div className="flex items-center space-x-4 group transition-colors duration-300" style={{ color: 'rgba(252, 247, 255, 0.9)' }}>
              <div className="relative">
                <div 
                  className="absolute inset-0 rounded-full blur-sm group-hover:blur-md transition-all duration-300"
                  style={{ backgroundColor: 'rgba(99, 201, 219, 0.2)' }}
                ></div>
                <svg 
                  className="relative h-6 w-6 transition-colors duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  style={{ color: 'var(--color-tertiary)' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="text-sm">
                <p className="font-semibold transition-colors duration-300" style={{ color: 'var(--color-secondary)' }}>Acceso Seguro</p>
                <p className="text-xs transition-colors duration-300" style={{ color: 'rgba(252, 247, 255, 0.6)' }}>Plataforma centralizada para gestión de HSEQ</p>
              </div>
            </div>
          </div>

          {/* Form with Enhanced Animations using brand colors */}
          <div className={`px-8 py-10 transition-all duration-700 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Document Number Field with Enhanced Effects */}
              <div className="space-y-3 group">
                <label 
                  htmlFor="number" 
                  className="block text-sm font-semibold transition-colors duration-300"
                  style={{ 
                    color: 'rgba(252, 247, 255, 0.9)',
                    '--group-focus-color': 'var(--color-tertiary)'
                  }}
                >
                  Documento de Identidad
                </label>
                <div className="relative">
                  <div 
                    className="absolute inset-0 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-all duration-500"
                    style={{
                      background: `linear-gradient(45deg, rgba(51, 97, 157, 0.15), rgba(99, 201, 219, 0.1))`
                    }}
                  ></div>
                  <input
                    type="text"
                    id="number"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    className="relative w-full px-5 py-4 backdrop-blur-sm border rounded-2xl focus:outline-none focus:ring-2 transition-all duration-500 placeholder-opacity-40"
                    style={{
                      backgroundColor: 'rgba(252, 247, 255, 0.08)',
                      borderColor: 'rgba(252, 247, 255, 0.25)',
                      color: 'var(--color-secondary)',
                      '--placeholder-color': 'rgba(252, 247, 255, 0.4)',
                      '--focus-ring-color': 'rgba(99, 201, 219, 0.5)',
                      '--focus-border-color': 'rgba(99, 201, 219, 0.6)'
                    }}
                    placeholder="Número de documento"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <svg 
                      className="h-5 w-5 group-focus-within:text-tertiary transition-colors duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      style={{ color: 'rgba(252, 247, 255, 0.4)' }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password Field with Enhanced Effects */}
              <div className="space-y-3 group">
                <label 
                  htmlFor="password" 
                  className="block text-sm font-semibold transition-colors duration-300"
                  style={{ color: 'rgba(252, 247, 255, 0.9)' }}
                >
                  Contraseña de Usuario
                </label>
                <div className="relative">
                  <div 
                    className="absolute inset-0 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-all duration-500"
                    style={{
                      background: `linear-gradient(45deg, rgba(99, 201, 219, 0.12), rgba(244, 211, 94, 0.08))`
                    }}
                  ></div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="relative w-full px-5 py-4 backdrop-blur-sm border rounded-2xl focus:outline-none focus:ring-2 transition-all duration-500"
                    style={{
                      backgroundColor: 'rgba(252, 247, 255, 0.08)',
                      borderColor: 'rgba(252, 247, 255, 0.25)',
                      color: 'var(--color-secondary)',
                      '--focus-ring-color': 'rgba(99, 201, 219, 0.5)'
                    }}
                    placeholder="••••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 transition-all duration-300 hover:scale-110"
                    style={{ 
                      color: 'rgba(252, 247, 255, 0.4)',
                      '--hover-color': 'var(--color-tertiary)'
                    }}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button with Advanced Effects using brand colors */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full font-bold py-4 px-8 rounded-2xl transition-all duration-500 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
                  style={{
                    background: `linear-gradient(45deg, var(--color-accent), var(--color-accent-light), var(--color-accent-dark))`,
                    color: 'var(--color-dark)',
                    boxShadow: '0 10px 25px -5px rgba(244, 211, 94, 0.4)',
                    '--hover-shadow': '0 20px 40px -12px rgba(244, 211, 94, 0.5)',
                    '--focus-ring-color': 'rgba(244, 211, 94, 0.5)'
                  }}
                >
                  {/* Button Shimmer Effect using brand colors */}
                  <div 
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                    style={{
                      background: `linear-gradient(90deg, transparent, rgba(252, 247, 255, 0.3), transparent)`
                    }}
                  ></div>
                  
                  {/* Loading Animation using brand colors */}
                  {isLoading && (
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(45deg, var(--color-accent-dark), var(--color-accent))`
                      }}
                    >
                      <div className="flex items-center justify-center h-full space-x-2">
                        <div 
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{ backgroundColor: 'var(--color-dark)' }}
                        ></div>
                        <div 
                          className="w-2 h-2 rounded-full animate-bounce animation-delay-100"
                          style={{ backgroundColor: 'var(--color-dark)' }}
                        ></div>
                        <div 
                          className="w-2 h-2 rounded-full animate-bounce animation-delay-200"
                          style={{ backgroundColor: 'var(--color-dark)' }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <span className={`relative flex items-center justify-center space-x-2 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                    <svg 
                      className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Iniciar Sesión</span>
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Custom Styles for Advanced Animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes text-shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-text-shimmer {
          background: linear-gradient(-45deg, var(--color-secondary), var(--color-tertiary-light), var(--color-secondary), var(--color-accent-light));
          background-size: 400% 400%;
          animation: text-shimmer 3s ease-in-out infinite;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        
        .animation-delay-100 { animation-delay: 0.1s; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(252, 247, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(252, 247, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        /* Custom focus and hover states using CSS variables */
        input:focus {
          border-color: var(--focus-border-color, rgba(99, 201, 219, 0.6)) !important;
          box-shadow: 0 0 0 2px var(--focus-ring-color, rgba(99, 201, 219, 0.5)) !important;
          background-color: rgba(252, 247, 255, 0.12) !important;
        }

        input:hover {
          background-color: rgba(252, 247, 255, 0.1) !important;
          border-color: rgba(252, 247, 255, 0.35) !important;
        }

        input::placeholder {
          color: var(--placeholder-color, rgba(252, 247, 255, 0.4)) !important;
        }

        button:hover {
          box-shadow: var(--hover-shadow) !important;
        }

        button:focus {
          box-shadow: 0 0 0 2px var(--focus-ring-color) !important;
        }

        .group:focus-within label {
          color: var(--group-focus-color, var(--color-tertiary)) !important;
        }

        .group svg:hover {
          color: var(--hover-color) !important;
        }
      `}</style>
    </div>
  );
};

export default Login;