import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../utils/auth';
import SuccessAnimation from '../components/SuccessAnimation';
import ReportService from '../services/reportService';
import '../assets/css/styles.css';

const CollaboratorDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('report');
  const [selectedReportType, setSelectedReportType] = useState(null);
  const [reportData, setReportData] = useState({
    // Campos comunes para todos los tipos de reporte
    asunto: '',
    fecha_evento: '',
    
    // Campos específicos para Hallazgos y Condiciones Inseguras
    lugar_hallazgo: '',
    lugar_hallazgo_otro: '',
    tipo_hallazgo: '',
    descripcion_hallazgo: '',
    recomendaciones: '',
    estado_condicion: '',
    
    // Campos específicos para Incidentes HSE
    grado_criticidad: '',
    ubicacion_incidente: '',
    hora_evento: '',
    tipo_afectacion: '',
    descripcion_incidente: '',
    
    // Campos específicos para Conversaciones y Reflexiones HSE
    tipo_conversacion: '',
    sitio_evento_conversacion: '',
    lugar_hallazgo_conversacion: '',
    lugar_hallazgo_conversacion_otro: '',
    descripcion_conversacion: '',
    asunto_conversacion: '',
    
    // Campo para evidencia
    evidencia: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

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

    try {
      // Procesar evidencia si existe
      let evidencia = null;
      if (reportData.evidencia) {
        evidencia = await ReportService.processEvidence(reportData.evidencia);
      }

      // Preparar datos del reporte
      const reportDataToSend = ReportService.prepareReportData(
        reportData, 
        selectedReportType, 
        user.id
      );

      // Agregar evidencia si existe
      if (evidencia) {
        reportDataToSend.evidencia = evidencia;
      }

      // Enviar reporte al backend
      const result = await ReportService.createReport(reportDataToSend);
      
      if (result.success) {
        // Mostrar animación de éxito
        setShowSuccessAnimation(true);
        
        // Limpiar formulario
        setReportData({
          // Campos comunes para todos los tipos de reporte
          asunto: '',
          fecha_evento: '',
          
          // Campos específicos para Hallazgos y Condiciones Inseguras
          lugar_hallazgo: '',
          lugar_hallazgo_otro: '',
          tipo_hallazgo: '',
          descripcion_hallazgo: '',
          recomendaciones: '',
          estado_condicion: '',
          
          // Campos específicos para Incidentes HSE
          grado_criticidad: '',
          ubicacion_incidente: '',
          hora_evento: '',
          tipo_afectacion: '',
          descripcion_incidente: '',
          
          // Campos específicos para Conversaciones y Reflexiones HSE
          tipo_conversacion: '',
          sitio_evento_conversacion: '',
          lugar_hallazgo_conversacion: '',
          lugar_hallazgo_conversacion_otro: '',
          descripcion_conversacion: '',
          asunto_conversacion: '',
          
          // Campo para evidencia
          evidencia: null
        });
        
        // Reset file inputs
        const fileInput = document.getElementById('evidencia');
        const fileInputIncidente = document.getElementById('evidencia_incidente');
        const fileInputConversacion = document.getElementById('evidencia_conversacion');
        if (fileInput) fileInput.value = '';
        if (fileInputIncidente) fileInputIncidente.value = '';
        if (fileInputConversacion) fileInputConversacion.value = '';
        
        console.log('Reporte enviado exitosamente:', result);
      } else {
        throw new Error(result.message || 'Error al enviar el reporte');
      }
      
    } catch (error) {
      console.error('Error al enviar el reporte:', error);
      alert('Error al enviar el reporte: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessAnimationComplete = () => {
    setShowSuccessAnimation(false);
    // Volver a la pantalla inicial después de la animación
    setSelectedReportType(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleReportTypeSelection = (type) => {
    setSelectedReportType(type);
  };

  const handleBackToSelection = () => {
    setSelectedReportType(null);
  };

  const renderReportTypeSelection = () => (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
      <h3 className="text-2xl font-bold text-white mb-8 text-center">
        Selecciona el tipo de reporte HSE
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Opción 1: Incidentes HSE */}
        <div 
          onClick={() => handleReportTypeSelection('incidentes')}
          className="bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <div className="text-center">
            <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <h4 className="text-xl font-bold text-white mb-2">1. Incidentes HSE</h4>
            <p className="text-white text-opacity-90 text-sm">
              Reporta incidentes de seguridad, salud y medio ambiente
            </p>
          </div>
        </div>

        {/* Opción 2: Hallazgos y condiciones inseguras */}
        <div 
          onClick={() => handleReportTypeSelection('hallazgos')}
          className="bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <div className="text-center">
            <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
            <h4 className="text-xl font-bold text-white mb-2">2. Hallazgos y condiciones inseguras</h4>
            <p className="text-white text-opacity-90 text-sm">
              Identifica y reporta condiciones y actos inseguros
            </p>
          </div>
        </div>

        {/* Opción 3: Conversaciones y reflexiones HSE */}
        <div 
          onClick={() => handleReportTypeSelection('conversaciones')}
          className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <div className="text-center">
            <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </div>
            <h4 className="text-xl font-bold text-white mb-2">3. Conversaciones y reflexiones HSE</h4>
            <p className="text-white text-opacity-90 text-sm">
              Registra conversaciones sobre seguridad y reflexiones
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHallazgosForm = () => (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">
          Reportar Condición o Acto Inseguro
        </h3>
        <button
          onClick={handleBackToSelection}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          <span>Volver</span>
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Asunto */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Asunto *
          </label>
          <input
            type="text"
            name="asunto"
            value={reportData.asunto}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            placeholder="Escriba el asunto del hallazgo o condición insegura"
            required
          />
        </div>

        {/* Lugar del Hallazgo */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Lugar del hallazgo (Instalación donde ocurrió el evento) *
          </label>
          <select
            name="lugar_hallazgo"
            value={reportData.lugar_hallazgo}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            required
          >
            <option value="" className="bg-gray-800 text-white">Seleccione una instalación</option>
            <option value="area_perforacion_exploratoria" className="bg-gray-800 text-white">Área de perforación Exploratoria</option>
            <option value="campamentos" className="bg-gray-800 text-white">Campamentos</option>
            <option value="campo_produccion" className="bg-gray-800 text-white">Campo de Producción</option>
            <option value="casinos" className="bg-gray-800 text-white">Casinos</option>
            <option value="oleoductos_poliductos_gasoductos" className="bg-gray-800 text-white">Oleoductos / Poliductos / Gasoductos</option>
            <option value="parqueaderos" className="bg-gray-800 text-white">Parqueaderos</option>
            <option value="plataformas_perforacion" className="bg-gray-800 text-white">Plataformas de Perforación</option>
            <option value="pozos" className="bg-gray-800 text-white">Pozos</option>
            <option value="vias_primarias_secundarias" className="bg-gray-800 text-white">Vías primarias y secundarias</option>
            <option value="epp" className="bg-gray-800 text-white">Elementos de protección personal (EPP)</option>
            <option value="otras" className="bg-gray-800 text-white">Otras</option>
          </select>
        </div>

        {/* Campo adicional para "Otras" */}
        {reportData.lugar_hallazgo === 'otras' && (
          <div>
            <label className="block text-white font-semibold mb-2">
              Especifique el lugar del hallazgo *
            </label>
            <input
              type="text"
              name="lugar_hallazgo_otro"
              value={reportData.lugar_hallazgo_otro}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Escriba el lugar específico del hallazgo"
              required
            />
          </div>
        )}

        {/* Fecha del evento */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Fecha del evento *
          </label>
          <input
            type="date"
            name="fecha_evento"
            value={reportData.fecha_evento}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            required
          />
        </div>

        {/* Tipo de Hallazgo */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Tipo de hallazgo *
          </label>
          <select
            name="tipo_hallazgo"
            value={reportData.tipo_hallazgo}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            required
          >
            <option value="" className="bg-gray-800 text-white">Seleccione el tipo de hallazgo</option>
            <option value="accion_mejoramiento" className="bg-gray-800 text-white">Acción de mejoramiento</option>
            <option value="aspecto_positivo" className="bg-gray-800 text-white">Aspecto positivo</option>
            <option value="condicion_insegura" className="bg-gray-800 text-white">Condición insegura</option>
            <option value="acto_inseguro" className="bg-gray-800 text-white">Acto inseguro</option>
          </select>
        </div>

        {/* Descripción del Hallazgo */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Descripción del hallazgo *
          </label>
          <textarea
            name="descripcion_hallazgo"
            value={reportData.descripcion_hallazgo}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
            placeholder="Describe detalladamente el hallazgo observado..."
            required
          />
        </div>

        {/* Recomendaciones */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Recomendaciones *
          </label>
          <textarea
            name="recomendaciones"
            value={reportData.recomendaciones}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
            placeholder="Escriba las recomendaciones para mejorar la situación..."
            required
          />
        </div>

        {/* Estado de la Condición */}
        <div>
          <label className="block text-white font-semibold mb-2">
            La condición o acto ya fue cerrada o continúa abierta *
          </label>
          <select
            name="estado_condicion"
            value={reportData.estado_condicion}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            required
          >
            <option value="" className="bg-gray-800 text-white">Seleccione el estado</option>
            <option value="abierta" className="bg-gray-800 text-white">Abierta</option>
            <option value="cerrada" className="bg-gray-800 text-white">Cerrada</option>
          </select>
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
  );

  const renderIncidentesForm = () => (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">
          INCIDENTE HSE
        </h3>
        <button
          onClick={handleBackToSelection}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          <span>Volver</span>
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Asunto */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Asunto *
          </label>
          <input
            type="text"
            name="asunto"
            value={reportData.asunto}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            placeholder="Escriba el asunto del incidente"
            required
          />
        </div>

        {/* Fecha del evento */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Fecha del evento *
          </label>
          <input
            type="date"
            name="fecha_evento"
            value={reportData.fecha_evento}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            required
          />
        </div>

        {/* Grado de criticidad del evento */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Grado de criticidad del evento *
          </label>
          <select
            name="grado_criticidad"
            value={reportData.grado_criticidad}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            required
          >
            <option value="" className="bg-gray-800 text-white">Selecciona la respuesta</option>
            <option value="bajo" className="bg-gray-800 text-white">Bajo</option>
            <option value="medio" className="bg-gray-800 text-white">Medio</option>
            <option value="alto" className="bg-gray-800 text-white">Alto</option>
            <option value="critico" className="bg-gray-800 text-white">Crítico</option>
          </select>
        </div>

        {/* Ubicación del Incidente */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Ubicación del Incidente - Instalación donde ocurre el evento *
          </label>
          <input
            type="text"
            name="ubicacion_incidente"
            value={reportData.ubicacion_incidente}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            placeholder="Escriba la ubicación específica del incidente"
            required
          />
        </div>

        {/* Hora del evento */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Hora del evento *
          </label>
          <input
            type="time"
            name="hora_evento"
            value={reportData.hora_evento}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
            required
          />
        </div>

        {/* Tipo de evento - Afectación */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Tipo de evento - Afectación *
          </label>
          <select
            name="tipo_afectacion"
            value={reportData.tipo_afectacion}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            required
          >
            <option value="" className="bg-gray-800 text-white">Seleccione el tipo de afectación</option>
            <option value="personas" className="bg-gray-800 text-white">Personas</option>
            <option value="medio_ambiente" className="bg-gray-800 text-white">Medio Ambiente</option>
            <option value="instalaciones" className="bg-gray-800 text-white">Instalaciones</option>
            <option value="vehiculos" className="bg-gray-800 text-white">Vehículos</option>
            <option value="seguridad_procesos" className="bg-gray-800 text-white">Seguridad de los procesos</option>
            <option value="operaciones" className="bg-gray-800 text-white">Operaciones</option>
          </select>
        </div>

        {/* Descripción del incidente */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Descripción (detalle los eventos y/o sucesos que ocasionaron el incidente) *
          </label>
          <textarea
            name="descripcion_incidente"
            value={reportData.descripcion_incidente}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
            placeholder="Describa detalladamente los eventos que ocasionaron el incidente"
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
            id="evidencia_incidente"
            name="evidencia"
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx"
            className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
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
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
  );

  const renderConversacionesForm = () => (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">
          CONVERSACIONES Y REFLEXIONES HSE
        </h3>
        <button
          onClick={handleBackToSelection}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          <span>Volver</span>
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Crear Conversación/Reflexión HSE */}
        {/* Asunto */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Asunto *
          </label>
          <input
            type="text"
            name="asunto_conversacion"
            value={reportData.asunto_conversacion}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            placeholder="Escriba el asunto de la conversación o reflexión"
            required
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">
            ¿Qué desea reportar? *
          </label>
          <select
            name="tipo_conversacion"
            value={reportData.tipo_conversacion}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            required
          >
            <option value="" className="bg-gray-800 text-white">Seleccione el tipo de reporte</option>
            <option value="reflexion" className="bg-gray-800 text-white">Reflexión</option>
            <option value="conversacion" className="bg-gray-800 text-white">Conversación</option>
          </select>
        </div>

        {/* Fecha del evento */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Fecha del evento *
          </label>
          <input
            type="date"
            name="fecha_evento"
            value={reportData.fecha_evento}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            required
          />
        </div>

        {/* Sitio del evento */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Sitio del evento *
          </label>
          <input
            type="text"
            name="sitio_evento_conversacion"
            value={reportData.sitio_evento_conversacion}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            placeholder="Escriba el sitio específico del evento"
            required
          />
        </div>

        {/* Lugar de hallazgo */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Lugar de hallazgo (Instalación donde ocurre el evento) *
          </label>
          <select
            name="lugar_hallazgo_conversacion"
            value={reportData.lugar_hallazgo_conversacion}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            required
          >
            <option value="" className="bg-gray-800 text-white">Seleccione una instalación</option>
            <option value="area_perforacion_exploratoria" className="bg-gray-800 text-white">Área de perforación Exploratoria</option>
            <option value="campamentos" className="bg-gray-800 text-white">Campamentos</option>
            <option value="campo_produccion" className="bg-gray-800 text-white">Campo de Producción</option>
            <option value="casinos" className="bg-gray-800 text-white">Casinos</option>
            <option value="oleoductos_poliductos_gasoductos" className="bg-gray-800 text-white">Oleoductos / Poliductos / Gasoductos</option>
            <option value="parqueaderos" className="bg-gray-800 text-white">Parqueaderos</option>
            <option value="plataformas_perforacion" className="bg-gray-800 text-white">Plataformas de Perforación</option>
            <option value="pozos" className="bg-gray-800 text-white">Pozos</option>
            <option value="vias_primarias_secundarias" className="bg-gray-800 text-white">Vías primarias secundarias</option>
            <option value="otras" className="bg-gray-800 text-white">Otras</option>
          </select>
        </div>

        {/* Campo adicional para "Otras" */}
        {reportData.lugar_hallazgo_conversacion === 'otras' && (
          <div>
            <label className="block text-white font-semibold mb-2">
              Especifique el lugar del hallazgo *
            </label>
            <input
              type="text"
              name="lugar_hallazgo_conversacion_otro"
              value={reportData.lugar_hallazgo_conversacion_otro}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Escriba el lugar específico del hallazgo"
              required
            />
          </div>
        )}

        {/* Descripción de las situaciones reflexionadas y/o conversadas */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Descripción de las situaciones reflexionadas y/o conversadas *
          </label>
          <textarea
            name="descripcion_conversacion"
            value={reportData.descripcion_conversacion}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
            placeholder="Describa detalladamente las situaciones reflexionadas o conversadas"
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
            id="evidencia_conversacion"
            name="evidencia"
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx"
            className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
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
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
  );

  const renderOtherForms = () => (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">
          Formulario en desarrollo
        </h3>
        <button
          onClick={handleBackToSelection}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          <span>Volver</span>
        </button>
      </div>
      
      <div className="text-center py-12">
        <svg className="w-16 h-16 mx-auto text-white text-opacity-50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
        <p className="text-white text-opacity-70 text-lg mb-2">
          Formulario en desarrollo
        </p>
        <p className="text-white text-opacity-50 text-sm">
          Esta funcionalidad estará disponible próximamente
        </p>
      </div>
    </div>
  );

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
              onClick={() => {
                setActiveTab('report');
                setSelectedReportType(null);
              }}
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

          {/* Content based on active tab and selection */}
          {activeTab === 'report' && (
            <>
              {!selectedReportType && renderReportTypeSelection()}
              {selectedReportType === 'hallazgos' && renderHallazgosForm()}
              {selectedReportType === 'incidentes' && renderIncidentesForm()}
              {selectedReportType === 'conversaciones' && renderConversacionesForm()}
            </>
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

      {/* Success Animation */}
      <SuccessAnimation
        isVisible={showSuccessAnimation}
        onComplete={handleSuccessAnimationComplete}
        message="¡Reporte enviado exitosamente!"
        showConfetti={true}
        size="medium"
        duration={1000}
        fadeOutDuration={2000}
      />
    </div>
  );
};

export default CollaboratorDashboard; 