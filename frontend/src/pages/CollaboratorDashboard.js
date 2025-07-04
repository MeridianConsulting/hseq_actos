import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../utils/auth';
import '../assets/css/styles.css';

const CollaboratorDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('report');
  const [reportData, setReportData] = useState({
    tipo_evento: '',
    ubicacion: '',
    fecha_evento: '',
    descripcion: '',
    evidencia: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const userData = getUser();
    if (userData) {
      setUser(userData);
    }
    setIsVisible(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setReportData(prev => ({
      ...prev,
      evidencia: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Aquí iría la lógica para enviar el reporte al backend
      console.log('Reporte enviado:', reportData);
      setMessage('Reporte enviado exitosamente');
      
      // Limpiar formulario
      setReportData({
        tipo_evento: '',
        ubicacion: '',
        fecha_evento: '',
        descripcion: '',
        evidencia: null
      });
      
      // Reset file input
      const fileInput = document.getElementById('evidencia');
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      setMessage('Error al enviar el reporte');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen" style={{
      background: `linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 35%, var(--color-tertiary-dark) 100%)`
    }}>
      {/* Header */}
      <header className="bg-white bg-opacity-10 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">
                Panel de Colaborador
              </h1>
              {user && (
                <span className="ml-4 text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full text-white">
                  {user.nombre}
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Welcome Card */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 mb-8 shadow-2xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                ¡Bienvenido, {user?.nombre}!
              </h2>
              <p className="text-white text-opacity-90 text-lg">
                Reporta condiciones y actos inseguros para mantener nuestro ambiente de trabajo seguro
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 mb-8">
            <button
              onClick={() => setActiveTab('report')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'report'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
              }`}
            >
              Nuevo Reporte
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'history'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
              }`}
            >
              Mis Reportes
            </button>
          </div>

          {/* Report Form */}
          {activeTab === 'report' && (
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">
                Reportar Condición o Acto Inseguro
              </h3>
              
              {message && (
                <div className={`mb-6 p-4 rounded-lg ${
                  message.includes('exitosamente') 
                    ? 'bg-green-500 bg-opacity-20 text-green-100 border border-green-500' 
                    : 'bg-red-500 bg-opacity-20 text-red-100 border border-red-500'
                }`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tipo de Evento */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Tipo de Evento *
                  </label>
                  <select
                    name="tipo_evento"
                    value={reportData.tipo_evento}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    required
                  >
                    <option value="" className="bg-gray-800 text-white">Seleccione un tipo</option>
                    <option value="acto_inseguro" className="bg-gray-800 text-white">Acto Inseguro</option>
                    <option value="condicion_insegura" className="bg-gray-800 text-white">Condición Insegura</option>
                    <option value="incidente" className="bg-gray-800 text-white">Incidente</option>
                    <option value="casi_accidente" className="bg-gray-800 text-white">Casi Accidente</option>
                    <option value="accidente" className="bg-gray-800 text-white">Accidente</option>
                  </select>
                </div>

                {/* Ubicación */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Ubicación *
                  </label>
                  <input
                    type="text"
                    name="ubicacion"
                    value={reportData.ubicacion}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="Ej: Oficina 201, Planta de producción, etc."
                    required
                  />
                </div>

                {/* Fecha del Evento */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Fecha del Evento *
                  </label>
                  <input
                    type="datetime-local"
                    name="fecha_evento"
                    value={reportData.fecha_evento}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    required
                  />
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Descripción Detallada *
                  </label>
                  <textarea
                    name="descripcion"
                    value={reportData.descripcion}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                    placeholder="Describe detalladamente lo que observaste o lo que ocurrió..."
                    required
                  />
                </div>

                {/* Evidencia */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Evidencia (Opcional)
                  </label>
                  <input
                    type="file"
                    id="evidencia"
                    name="evidencia"
                    onChange={handleFileChange}
                    accept="image/*,.pdf,.doc,.docx"
                    className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                  <p className="text-gray-300 text-sm mt-2">
                    Formatos permitidos: JPG, PNG, PDF, DOC, DOCX (máx. 10MB)
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                        </svg>
                        <span>Enviar Reporte</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">
                Historial de Reportes
              </h3>
              
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-white text-opacity-50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <p className="text-white text-opacity-70 text-lg">
                  Aún no tienes reportes registrados
                </p>
                <p className="text-white text-opacity-50 text-sm mt-2">
                  Tus reportes aparecerán aquí una vez que los envíes
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CollaboratorDashboard; 