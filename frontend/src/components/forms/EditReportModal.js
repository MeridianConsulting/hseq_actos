import React, { useState, useEffect, useRef } from 'react';
import ReportService from '../../services/reportService';
import SuccessAnimation from '../SuccessAnimation';

const EditReportModal = ({ isOpen, onClose, report, onSuccess }) => {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && report) {
      // Inicializar el formulario con los datos del reporte
      setFormData({
        asunto: report.asunto || '',
        fecha_evento: report.fecha_evento || '',
        
        // Campos específicos para Hallazgos
        lugar_hallazgo: report.lugar_hallazgo || '',
        lugar_hallazgo_otro: report.lugar_hallazgo_otro || '',
        tipo_hallazgo: report.tipo_hallazgo || '',
        descripcion_hallazgo: report.descripcion_hallazgo || '',
        recomendaciones: report.recomendaciones || '',
        estado_condicion: report.estado_condicion || '',
        
        // Campos específicos para Incidentes
        grado_criticidad: report.grado_criticidad || '',
        ubicacion_incidente: report.ubicacion_incidente || '',
        hora_evento: report.hora_evento || '',
        tipo_afectacion: report.tipo_afectacion || '',
        descripcion_incidente: report.descripcion_incidente || '',
        
        // Campos específicos para Conversaciones
        tipo_conversacion: report.tipo_conversacion || '',
        sitio_evento_conversacion: report.sitio_evento_conversacion || '',
        lugar_hallazgo_conversacion: report.lugar_hallazgo_conversacion || '',
        lugar_hallazgo_conversacion_otro: report.lugar_hallazgo_conversacion_otro || '',
        descripcion_conversacion: report.descripcion_conversacion || '',
        asunto_conversacion: report.asunto_conversacion || '',
        
        // Evidencia
        evidencia: null
      });
      setError(null);
      
      // Enfocar el primer campo después de que el modal se abra
      setTimeout(() => {
        if (firstInputRef.current) {
          firstInputRef.current.focus();
        }
      }, 300);
    }
  }, [isOpen, report]);

  // Manejar tecla ESC y trap focus
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      evidencia: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Procesar evidencia si existe
      let evidencia = null;
      if (formData.evidencia) {
        evidencia = await ReportService.processEvidence(formData.evidencia);
      }

      // Preparar datos del reporte
      const reportDataToSend = ReportService.prepareReportData(
        formData, 
        report.tipo_reporte, 
        report.id_usuario
      );

      // Agregar evidencia si existe
      if (evidencia) {
        reportDataToSend.evidencia = evidencia;
      }

      // Actualizar reporte
      const result = await ReportService.updateReport(report.id, reportDataToSend);
      
      if (result.success) {
        setShowSuccessAnimation(true);
        setTimeout(() => {
          setShowSuccessAnimation(false);
          onSuccess();
          onClose();
        }, 2000);
      } else {
        throw new Error(result.message || 'Error al actualizar el reporte');
      }
      
    } catch (error) {
      console.error('Error al actualizar el reporte:', error);
      setError('Error al actualizar el reporte: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getEventTypeLabel = (type) => {
    const labels = {
      'hallazgos': 'Hallazgos y Condiciones',
      'incidentes': 'Incidentes HSE',
      'conversaciones': 'Conversaciones y Reflexiones'
    };
    return labels[type] || type;
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'hallazgos':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        );
      case 'incidentes':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
        );
      case 'conversaciones':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const renderFormFields = () => {
    switch (report?.tipo_reporte) {
      case 'hallazgos':
        return (
          <div className="space-y-6">
            <div className="bg-white bg-opacity-5 rounded-xl p-6 border border-white border-opacity-10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Información General
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="asunto" className="block text-sm font-medium text-white text-opacity-80 mb-2">
                    Asunto *
                  </label>
                  <input
                    ref={firstInputRef}
                    id="asunto"
                    type="text"
                    name="asunto"
                    value={formData.asunto || ''}
                    onChange={handleInputChange}
                    placeholder="Describe brevemente el hallazgo"
                    required
                    autoComplete="off"
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="fecha_evento" className="block text-sm font-medium text-white text-opacity-80 mb-2">
                    Fecha del Evento *
                  </label>
                  <input
                    id="fecha_evento"
                    type="date"
                    name="fecha_evento"
                    value={formData.fecha_evento || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-5 rounded-xl p-6 border border-white border-opacity-10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Ubicación y Tipo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="lugar_hallazgo" className="block text-sm font-medium text-white text-opacity-80 mb-2">
                    Lugar del Hallazgo *
                  </label>
                  <select
                    id="lugar_hallazgo"
                    name="lugar_hallazgo"
                    value={formData.lugar_hallazgo || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Selecciona un lugar</option>
                    <option value="oficina">Oficina</option>
                    <option value="taller">Taller</option>
                    <option value="campo">Campo</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                {formData.lugar_hallazgo === 'otro' && (
                  <div>
                    <label htmlFor="lugar_hallazgo_otro" className="block text-sm font-medium text-white text-opacity-80 mb-2">
                      Especificar Lugar
                    </label>
                    <input
                      id="lugar_hallazgo_otro"
                      type="text"
                      name="lugar_hallazgo_otro"
                      value={formData.lugar_hallazgo_otro || ''}
                      onChange={handleInputChange}
                      placeholder="Especifica el lugar del hallazgo"
                      className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="tipo_hallazgo" className="block text-sm font-medium text-white text-opacity-80 mb-2">
                    Tipo de Hallazgo *
                  </label>
                  <select
                    id="tipo_hallazgo"
                    name="tipo_hallazgo"
                    value={formData.tipo_hallazgo || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Selecciona el tipo</option>
                    <option value="accion_mejoramiento">Acción de mejoramiento</option>
                    <option value="aspecto_positivo">Aspecto positivo</option>
                    <option value="condicion_insegura">Condición insegura</option>
                    <option value="acto_inseguro">Acto inseguro</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="estado_condicion" className="block text-sm font-medium text-white text-opacity-80 mb-2">
                    Estado de la condición *
                  </label>
                  <select
                    id="estado_condicion"
                    name="estado_condicion"
                    value={formData.estado_condicion || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Selecciona el estado</option>
                    <option value="abierta">Abierta</option>
                    <option value="cerrada">Cerrada</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-5 rounded-xl p-6 border border-white border-opacity-10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Descripción y Recomendaciones
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="descripcion_hallazgo" className="block text-sm font-medium text-white text-opacity-80 mb-2">
                    Descripción del Hallazgo *
                  </label>
                  <textarea
                    id="descripcion_hallazgo"
                    name="descripcion_hallazgo"
                    value={formData.descripcion_hallazgo || ''}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Describe detalladamente el hallazgo encontrado"
                    required
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>

                <div>
                  <label htmlFor="recomendaciones" className="block text-sm font-medium text-white text-opacity-80 mb-2">
                    Recomendaciones
                  </label>
                  <textarea
                    id="recomendaciones"
                    name="recomendaciones"
                    value={formData.recomendaciones || ''}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Sugiere acciones para corregir el hallazgo"
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'incidentes':
        return (
          <div className="space-y-6">
            <div className="bg-white bg-opacity-5 rounded-xl p-6 border border-white border-opacity-10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
                Información del Incidente
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="asunto-incidente" className="block text-sm font-medium text-white text-opacity-80 mb-2">
                    Asunto *
                  </label>
                  <input
                    ref={firstInputRef}
                    id="asunto-incidente"
                    type="text"
                    name="asunto"
                    value={formData.asunto || ''}
                    onChange={handleInputChange}
                    placeholder="Describe brevemente el incidente"
                    required
                    autoComplete="off"
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="fecha_evento_incidente" className="block text-sm font-medium text-white text-opacity-80 mb-2">
                    Fecha del Evento *
                  </label>
                  <input
                    id="fecha_evento_incidente"
                    type="date"
                    name="fecha_evento"
                    value={formData.fecha_evento || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="hora_evento" className="block text-sm font-medium text-white text-opacity-80 mb-2">
                    Hora del Evento
                  </label>
                  <input
                    id="hora_evento"
                    type="time"
                    name="hora_evento"
                    value={formData.hora_evento || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="ubicacion_incidente" className="block text-sm font-medium text-white text-opacity-80 mb-2">
                    Ubicación del Incidente *
                  </label>
                  <input
                    id="ubicacion_incidente"
                    type="text"
                    name="ubicacion_incidente"
                    value={formData.ubicacion_incidente || ''}
                    onChange={handleInputChange}
                    placeholder="Especifica la ubicación exacta"
                    required
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="grado_criticidad" className="block text-sm font-medium text-white text-opacity-80 mb-2">
                    Grado de Criticidad *
                  </label>
                  <select
                    id="grado_criticidad"
                    name="grado_criticidad"
                    value={formData.grado_criticidad || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Selecciona el grado</option>
                    <option value="bajo">Bajo</option>
                    <option value="medio">Medio</option>
                    <option value="alto">Alto</option>
                    <option value="critico">Crítico</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="tipo_afectacion" className="block text-sm font-medium text-white text-opacity-80 mb-2">
                    Tipo de Afectación *
                  </label>
                  <select
                    id="tipo_afectacion"
                    name="tipo_afectacion"
                    value={formData.tipo_afectacion || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Selecciona el tipo</option>
                    <option value="personas">Personas</option>
                    <option value="equipos">Equipos</option>
                    <option value="medio_ambiente">Medio Ambiente</option>
                    <option value="proceso">Proceso</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-5 rounded-xl p-6 border border-white border-opacity-10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Descripción del Incidente
              </h3>
              <div>
                <label htmlFor="descripcion_incidente" className="block text-sm font-medium text-white text-opacity-80 mb-2">
                  Descripción del Incidente *
                </label>
                <textarea
                  id="descripcion_incidente"
                  name="descripcion_incidente"
                  value={formData.descripcion_incidente || ''}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Describe detalladamente lo que sucedió"
                  required
                  className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>
            </div>
          </div>
        );

      case 'conversaciones':
        return (
          <div className="space-y-6">
            <div className="bg-white bg-opacity-5 rounded-xl p-6 border border-white border-opacity-10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                Información de la Conversación
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="asunto-conversacion" className="block text-sm font-medium text-white text-opacity-80 mb-2">
                    Asunto de la Conversación *
                  </label>
                  <input
                    ref={firstInputRef}
                    id="asunto-conversacion"
                    type="text"
                    name="asunto_conversacion"
                    value={formData.asunto_conversacion || ''}
                    onChange={handleInputChange}
                    placeholder="Título de la conversación"
                    required
                    autoComplete="off"
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="fecha_evento_conversacion" className="block text-sm font-medium text-white text-opacity-80 mb-2">
                    Fecha del Evento *
                  </label>
                  <input
                    id="fecha_evento_conversacion"
                    type="date"
                    name="fecha_evento"
                    value={formData.fecha_evento || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="tipo_conversacion" className="block text-sm font-medium text-white text-opacity-80 mb-2">
                    Tipo de Conversación *
                  </label>
                  <select
                    id="tipo_conversacion"
                    name="tipo_conversacion"
                    value={formData.tipo_conversacion || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Selecciona el tipo</option>
                    <option value="reflexion">Reflexión HSE</option>
                    <option value="observacion">Observación de Comportamiento</option>
                    <option value="capacitacion">Capacitación</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="sitio_evento_conversacion" className="block text-sm font-medium text-white text-opacity-80 mb-2">
                    Sitio del Evento *
                  </label>
                  <input
                    id="sitio_evento_conversacion"
                    type="text"
                    name="sitio_evento_conversacion"
                    value={formData.sitio_evento_conversacion || ''}
                    onChange={handleInputChange}
                    placeholder="Ubicación donde se realizó la conversación"
                    required
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="lugar_hallazgo_conversacion" className="block text-sm font-medium text-white text-opacity-80 mb-2">
                    Lugar del Hallazgo (si aplica)
                  </label>
                  <select
                    id="lugar_hallazgo_conversacion"
                    name="lugar_hallazgo_conversacion"
                    value={formData.lugar_hallazgo_conversacion || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Selecciona un lugar</option>
                    <option value="oficina">Oficina</option>
                    <option value="taller">Taller</option>
                    <option value="campo">Campo</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                {formData.lugar_hallazgo_conversacion === 'otro' && (
                  <div>
                    <label htmlFor="lugar_hallazgo_conversacion_otro" className="block text-sm font-medium text-white text-opacity-80 mb-2">
                      Especificar Lugar
                    </label>
                    <input
                      id="lugar_hallazgo_conversacion_otro"
                      type="text"
                      name="lugar_hallazgo_conversacion_otro"
                      value={formData.lugar_hallazgo_conversacion_otro || ''}
                      onChange={handleInputChange}
                      placeholder="Especifica el lugar"
                      className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white bg-opacity-5 rounded-xl p-6 border border-white border-opacity-10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                Descripción de la Conversación
              </h3>
              <div>
                <label htmlFor="descripcion_conversacion" className="block text-sm font-medium text-white text-opacity-80 mb-2">
                  Descripción de la Conversación *
                </label>
                <textarea
                  id="descripcion_conversacion"
                  name="descripcion_conversacion"
                  value={formData.descripcion_conversacion || ''}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Describe el contenido y resultado de la conversación"
                  required
                  className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-gray-800 rounded-t-3xl p-6 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                {report && (
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-500">
                    {getEventTypeIcon(report.tipo_reporte)}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Editar Reporte
                  </h2>
                  {report && (
                    <p className="text-white text-opacity-60 text-sm">
                      {getEventTypeLabel(report.tipo_reporte)}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full flex items-center justify-center transition-all duration-200"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 rounded-lg" role="alert" aria-live="polite">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <p className="text-red-300">{error}</p>
                </div>
              </div>
            )}

            <form id="edit-report-form" onSubmit={handleSubmit} className="space-y-6">
              {renderFormFields()}

              {/* Evidencia */}
              <div className="bg-white bg-opacity-5 rounded-2xl p-6 border border-white border-opacity-10">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  Nueva Evidencia (opcional)
                </h3>
                <div>
                  <label htmlFor="evidencia" className="block text-sm font-medium text-white text-opacity-80 mb-2">
                    Archivo de Evidencia
                  </label>
                  <input
                    id="evidencia"
                    type="file"
                    name="evidencia"
                    onChange={handleFileChange}
                    accept="image/*,.pdf,.doc,.docx"
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <p className="mt-2 text-sm text-white text-opacity-60">
                    Solo se pueden editar reportes pendientes. Formatos permitidos: imágenes, PDF, Word.
                  </p>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  form="edit-report-form"
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  aria-describedby={isLoading ? "loading-description" : undefined}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" aria-hidden="true"></div>
                      <span id="loading-description">Actualizando...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      <span>Actualizar Reporte</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <SuccessAnimation
        isVisible={showSuccessAnimation}
        onComplete={() => setShowSuccessAnimation(false)}
        message="¡Reporte actualizado exitosamente!"
        showConfetti={true}
        size="medium"
        duration={1000}
        fadeOutDuration={2000}
      />
    </>
  );
};

export default EditReportModal; 