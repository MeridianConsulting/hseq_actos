import React, { useState, useEffect } from 'react';
import ReportService from '../../services/reportService';
import SuccessAnimation from '../SuccessAnimation';

const EditReportModal = ({ isOpen, onClose, report, onSuccess }) => {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

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
    }
  }, [isOpen, report]);

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

  const renderFormFields = () => {
    switch (report?.tipo_reporte) {
      case 'hallazgos':
        return (
          <>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Asunto *
              </label>
              <input
                type="text"
                name="asunto"
                value={formData.asunto || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe brevemente el hallazgo"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Fecha del Evento *
              </label>
              <input
                type="date"
                name="fecha_evento"
                value={formData.fecha_evento || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Lugar del Hallazgo *
              </label>
              <select
                name="lugar_hallazgo"
                value={formData.lugar_hallazgo || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecciona un lugar</option>
                <option value="oficina">Oficina</option>
                <option value="taller">Taller</option>
                <option value="campo">Campo</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            {formData.lugar_hallazgo === 'otro' && (
              <div className="mb-4">
                <label className="block text-white text-sm font-medium mb-2">
                  Especificar Lugar
                </label>
                <input
                  type="text"
                  name="lugar_hallazgo_otro"
                  value={formData.lugar_hallazgo_otro || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Especifica el lugar del hallazgo"
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Tipo de Hallazgo *
              </label>
              <select
                name="tipo_hallazgo"
                value={formData.tipo_hallazgo || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecciona el tipo</option>
                <option value="condicion_insegura">Condición Insegura</option>
                <option value="acto_inseguro">Acto Inseguro</option>
                <option value="subestandar">Subestándar</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Estado de la Condición *
              </label>
              <select
                name="estado_condicion"
                value={formData.estado_condicion || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecciona el estado</option>
                <option value="abierto">Abierto</option>
                <option value="en_proceso">En Proceso</option>
                <option value="cerrado">Cerrado</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Descripción del Hallazgo *
              </label>
              <textarea
                name="descripcion_hallazgo"
                value={formData.descripcion_hallazgo || ''}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe detalladamente el hallazgo encontrado"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Recomendaciones
              </label>
              <textarea
                name="recomendaciones"
                value={formData.recomendaciones || ''}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Sugiere acciones para corregir el hallazgo"
              />
            </div>
          </>
        );

      case 'incidentes':
        return (
          <>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Asunto *
              </label>
              <input
                type="text"
                name="asunto"
                value={formData.asunto || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe brevemente el incidente"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Fecha del Evento *
              </label>
              <input
                type="date"
                name="fecha_evento"
                value={formData.fecha_evento || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Hora del Evento
              </label>
              <input
                type="time"
                name="hora_evento"
                value={formData.hora_evento || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Ubicación del Incidente *
              </label>
              <input
                type="text"
                name="ubicacion_incidente"
                value={formData.ubicacion_incidente || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Especifica la ubicación exacta"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Grado de Criticidad *
              </label>
              <select
                name="grado_criticidad"
                value={formData.grado_criticidad || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecciona el grado</option>
                <option value="bajo">Bajo</option>
                <option value="medio">Medio</option>
                <option value="alto">Alto</option>
                <option value="critico">Crítico</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Tipo de Afectación *
              </label>
              <select
                name="tipo_afectacion"
                value={formData.tipo_afectacion || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecciona el tipo</option>
                <option value="personas">Personas</option>
                <option value="equipos">Equipos</option>
                <option value="medio_ambiente">Medio Ambiente</option>
                <option value="proceso">Proceso</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Descripción del Incidente *
              </label>
              <textarea
                name="descripcion_incidente"
                value={formData.descripcion_incidente || ''}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe detalladamente lo que sucedió"
                required
              />
            </div>
          </>
        );

      case 'conversaciones':
        return (
          <>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Asunto de la Conversación *
              </label>
              <input
                type="text"
                name="asunto_conversacion"
                value={formData.asunto_conversacion || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Título de la conversación"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Fecha del Evento *
              </label>
              <input
                type="date"
                name="fecha_evento"
                value={formData.fecha_evento || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Tipo de Conversación *
              </label>
              <select
                name="tipo_conversacion"
                value={formData.tipo_conversacion || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecciona el tipo</option>
                <option value="reflexion">Reflexión HSE</option>
                <option value="observacion">Observación de Comportamiento</option>
                <option value="capacitacion">Capacitación</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Sitio del Evento *
              </label>
              <input
                type="text"
                name="sitio_evento_conversacion"
                value={formData.sitio_evento_conversacion || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ubicación donde se realizó la conversación"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Lugar del Hallazgo (si aplica)
              </label>
              <select
                name="lugar_hallazgo_conversacion"
                value={formData.lugar_hallazgo_conversacion || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona un lugar</option>
                <option value="oficina">Oficina</option>
                <option value="taller">Taller</option>
                <option value="campo">Campo</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            {formData.lugar_hallazgo_conversacion === 'otro' && (
              <div className="mb-4">
                <label className="block text-white text-sm font-medium mb-2">
                  Especificar Lugar
                </label>
                <input
                  type="text"
                  name="lugar_hallazgo_conversacion_otro"
                  value={formData.lugar_hallazgo_conversacion_otro || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Especifica el lugar"
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Descripción de la Conversación *
              </label>
              <textarea
                name="descripcion_conversacion"
                value={formData.descripcion_conversacion || ''}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe el contenido y resultado de la conversación"
                required
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-gray-800 rounded-t-3xl p-6 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Editar Reporte
                </h2>
                <p className="text-white text-opacity-60 text-sm mt-1">
                  {report?.tipo_reporte === 'hallazgos' && 'Hallazgos y Condiciones'}
                  {report?.tipo_reporte === 'incidentes' && 'Incidentes HSE'}
                  {report?.tipo_reporte === 'conversaciones' && 'Conversaciones y Reflexiones'}
                </p>
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
              <div className="mb-6 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-4">
                <p className="text-red-300">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {renderFormFields()}

              <div className="mb-6">
                <label className="block text-white text-sm font-medium mb-2">
                  Nueva Evidencia (opcional)
                </label>
                <input
                  type="file"
                  name="evidencia"
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx"
                  className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-white text-opacity-50 text-xs mt-1">
                  Solo se pueden editar reportes pendientes. Formatos permitidos: imágenes, PDF, Word.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Actualizando...
                    </>
                  ) : (
                    'Actualizar Reporte'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Animation */}
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