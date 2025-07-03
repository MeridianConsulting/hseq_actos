import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/img/logo_meridian.png';
import '../assets/css/styles.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-secondary-dark flex items-center justify-center p-4">
      {/* Logo Meridian - Posicionado en esquina superior izquierda */}
      <div className="fixed top-4 left-4 z-50 sm:top-6 sm:left-6 lg:top-8 lg:left-8">
        <div className="relative">
          <img 
            src={logo} 
            alt="Meridian Consulting" 
            className="h-10 w-auto sm:h-12 md:h-14 lg:h-16 xl:h-18 filter drop-shadow-lg hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Background Pattern - Simplified */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-tertiary"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        {/* Subtle Shadow Effect - Removed animation */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-tertiary/10 to-primary/10 rounded-2xl blur-sm opacity-50"></div>
        
        {/* Main Card */}
        <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 overflow-hidden">
          {/* Header - Sin logo, más compacto */}
          <div className="relative bg-gradient-to-r from-primary-dark via-primary to-primary-dark px-8 py-8 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-tertiary/10 to-accent/10"></div>
            <div className="relative">
              <h1 className="text-2xl font-bold text-white mb-3">
                HSEQ Platform
              </h1>
              <div className="text-secondary/90 text-sm space-y-2">
                <p className="font-medium">
                  Sistema de Gestión de Seguridad y Calidad
                </p>
                <p className="text-xs leading-relaxed text-secondary/75">
                  Reporte de incidentes, hallazgos, condiciones y actos inseguros de manera trazable y accesible
                </p>
              </div>
            </div>
          </div>

          {/* Platform Info Section */}
          <div className="px-8 py-4 bg-gradient-to-r from-secondary/30 to-secondary/20 border-b border-secondary/30">
            <div className="flex items-center space-x-3 text-primary-dark">
              <svg className="h-5 w-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div className="text-sm">
                <p className="font-semibold text-primary-dark">Acceso Seguro</p>
                <p className="text-xs text-gray-600">Plataforma centralizada para gestión de HSEQ</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Document Number Field */}
              <div className="space-y-2">
                <label htmlFor="number" className="block text-sm font-semibold text-primary-dark">
                  Documento de Identidad
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="number"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-secondary border border-secondary-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 placeholder-gray-400"
                    placeholder="Número de documento"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-primary-dark">
                  Contraseña de Usuario
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-secondary border border-secondary-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 placeholder-gray-400"
                    placeholder="••••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-primary transition-colors"
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative bg-gradient-to-r from-accent to-accent-dark hover:from-accent-dark hover:to-accent text-dark font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                {isLoading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-accent to-accent-dark">
                    <div className="flex items-center justify-center h-full">
                      <svg className="animate-spin h-5 w-5 text-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </div>
                )}
                <span className={isLoading ? 'opacity-0' : ''}>
                  Iniciar Sesión
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;