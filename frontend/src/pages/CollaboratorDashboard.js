import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../utils/auth';
import SuccessAnimation from '../components/SuccessAnimation';
import ReportService from '../services/reportService';
import ReportTypeSelector from '../components/forms/ReportTypeSelector';
import HallazgosForm from '../components/forms/HallazgosForm';
import IncidentesForm from '../components/forms/IncidentesForm';
import ConversacionesForm from '../components/forms/ConversacionesForm';
import '../assets/css/styles.css';

const CollaboratorDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  // Vista simplificada: solo creación de reportes
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
        
        //
      } else {
        throw new Error(result.message || 'Error al enviar el reporte');
      }
      
    } catch (error) {
      //
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

  const renderForm = () => {
    switch (selectedReportType) {
      case 'hallazgos':
        return (
          <HallazgosForm
            reportData={reportData}
            onInputChange={handleInputChange}
            onFileChange={handleFileChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            onBack={handleBackToSelection}
          />
        );
      case 'incidentes':
        return (
          <IncidentesForm
            reportData={reportData}
            onInputChange={handleInputChange}
            onFileChange={handleFileChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            onBack={handleBackToSelection}
          />
        );
      case 'conversaciones':
        return (
          <ConversacionesForm
            reportData={reportData}
            onInputChange={handleInputChange}
            onFileChange={handleFileChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            onBack={handleBackToSelection}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen" style={{
      background: `linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 35%, var(--color-tertiary-dark) 100%)`
    }}>
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">Panel de Colaborador</h1>
              {user && (
                <span className="ml-4 text-sm bg-white/10 px-3 py-1 rounded-full text-gray-200 border border-gray-600">
                  {user.nombre}
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
          {/* Welcome Card */}
          <div className="bg-white bg-opacity-5 backdrop-blur-md rounded-3xl p-8 mb-8 shadow-2xl border border-white/10">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">¡Bienvenido{user?.nombre ? `, ${user.nombre}` : ''}!</h2>
              <p className="text-white text-opacity-90 text-lg">
                Reporta condiciones y actos inseguros para mantener nuestro ambiente de trabajo seguro
              </p>
              <div className="mt-4 flex justify-center gap-4 text-xs text-white/80">
                <span className="bg-white/10 px-3 py-1 rounded-full border border-white/10">Rápido</span>
                <span className="bg-white/10 px-3 py-1 rounded-full border border-white/10">Seguro</span>
                <span className="bg-white/10 px-3 py-1 rounded-full border border-white/10">Eficiente</span>
              </div>
            </div>
          </div>

          {/* Selección o formulario */}
          {!selectedReportType && (
            <ReportTypeSelector onSelect={handleReportTypeSelection} />
          )}
          {selectedReportType && renderForm()}
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