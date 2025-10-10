import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../utils/auth';
import Header from '../components/Header';
import SuccessAnimation from '../components/SuccessAnimation';
import ReportService from '../services/reportService';
import ReportTypeSelector from '../components/forms/ReportTypeSelector';
import HallazgosForm from '../components/forms/HallazgosForm';
import IncidentesForm from '../components/forms/IncidentesForm';
import ConversacionesForm from '../components/forms/ConversacionesForm';
import PQRForm from '../components/forms/PQRForm';
import '../assets/css/styles.css';

const CreateReport = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
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
    
    // Campos específicos para PQR
    telefono_contacto: '',
    correo_contacto: '',
    tipo_pqr: '',
    descripcion_pqr: '',
    
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
          
          // Campos específicos para PQR
          telefono_contacto: '',
          correo_contacto: '',
          tipo_pqr: '',
          descripcion_pqr: '',
          
          // Campo para evidencia
          evidencia: null
        });
        
        // Reset file inputs
        const fileInput = document.getElementById('evidencia');
        const fileInputIncidente = document.getElementById('evidencia_incidente');
        const fileInputConversacion = document.getElementById('evidencia_conversacion');
        const fileInputPqr = document.getElementById('evidencia_pqr');
        if (fileInput) fileInput.value = '';
        if (fileInputIncidente) fileInputIncidente.value = '';
        if (fileInputConversacion) fileInputConversacion.value = '';
        if (fileInputPqr) fileInputPqr.value = '';
        
        setSelectedReportType(null);
      } else {
        throw new Error(result.message || 'Error al enviar el reporte');
      }
      
    } catch (error) {
      console.error('Error al crear reporte:', error);
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

  const handleReportTypeSelection = (type) => {
    setSelectedReportType(type);
  };

  const handleBackToSelection = () => {
    setSelectedReportType(null);
  };

  const handleGoBack = () => {
    navigate(-1);
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
      case 'pqr':
        return (
          <PQRForm
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
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
          {/* Header Section */}
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--color-secondary)' }}>
                Crear Nuevo Reporte
              </h1>
              <p className="text-sm" style={{ color: 'rgba(252, 247, 255, 0.75)' }}>
                Reporta condiciones y actos inseguros para mantener nuestro ambiente de trabajo seguro
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Back Button */}
              <button
                onClick={handleGoBack}
                className="group relative font-semibold py-2 px-4 rounded-xl transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: 'rgba(252, 247, 255, 0.15)',
                  color: 'var(--color-secondary)',
                  border: '1px solid rgba(252, 247, 255, 0.3)'
                }}
              >
                <span className="relative flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Volver</span>
                </span>
              </button>
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

export default CreateReport;
