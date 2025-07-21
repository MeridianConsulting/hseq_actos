import React, { useState, useEffect } from 'react';
import ReportService from '../services/reportService';

const ReportDetailsModal = ({ isOpen, onClose, reportId }) => {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && reportId) {
      loadReportDetails();
    }
  }, [isOpen, reportId]);

  const loadReportDetails = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await ReportService.getReportById(reportId);
      if (result.success) {
        setReport(result.report);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error al cargar detalles del reporte:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendiente':
        return 'bg-yellow-500';
      case 'en_revision':
        return 'bg-blue-500';
      case 'aprobado':
        return 'bg-green-500';
      case 'rechazado':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getEventTypeLabel = (type) => {
    const labels = {
      'hallazgos': 'Hallazgos',
      'incidentes': 'Incidentes',
      'conversaciones': 'Conversaciones'
    };
    return labels[type] || type;
  };

  const getFieldLabel = (field) => {
    const labels = {
      'tipo_hallazgo': 'Tipo de Hallazgo',
      'estado_condicion': 'Estado de la Condición',
      'grado_criticidad': 'Grado de Criticidad',
      'tipo_afectacion': 'Tipo de Afectación',
      'tipo_conversacion': 'Tipo de Conversación',
      'lugar_hallazgo': 'Lugar del Hallazgo',
      'ubicacion_incidente': 'Ubicación del Incidente',
      'sitio_evento_conversacion': 'Sitio del Evento',
      'descripcion_hallazgo': 'Descripción del Hallazgo',
      'descripcion_incidente': 'Descripción del Incidente',
      'descripcion_conversacion': 'Descripción de la Conversación',
      'recomendaciones': 'Recomendaciones',
      'asunto_conversacion': 'Asunto de la Conversación'
    };
    return labels[field] || field;
  };

  const formatFieldValue = (field, value) => {
    if (!value) return 'No especificado';
    
    // Formatear valores específicos
    switch (field) {
      case 'fecha_evento':
        return new Date(value).toLocaleDateString('es-ES');
      case 'hora_evento':
        return value;
      case 'creado_en':
      case 'actualizado_en':
      case 'fecha_revision':
        return new Date(value).toLocaleString('es-ES');
      default:
        return value;
    }
  };

  const renderField = (label, value, fieldName = null) => {
    if (!value && value !== 0) return null;
    
    return (
      <div className="mb-4">
        <dt className="text-sm font-medium text-white text-opacity-70 mb-1">
          {label}
        </dt>
        <dd className="text-white">
          {formatFieldValue(fieldName, value)}
        </dd>
      </div>
    );
  };

  const renderEvidence = (evidencias) => {
    if (!evidencias || evidencias.length === 0) {
      return (
        <div className="text-center py-8">
          <svg className="w-12 h-12 mx-auto text-white text-opacity-30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <p className="text-white text-opacity-50">No hay evidencias adjuntas</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {evidencias.map((evidencia, index) => (
          <div key={evidencia.id} className="bg-white bg-opacity-5 rounded-lg p-4">
            <div className="aspect-w-16 aspect-h-9 mb-3">
              <img
                src={`http://localhost/hseq/backend/uploads/${evidencia.url_archivo}`}
                alt={`Evidencia ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik01MCAxMDBDNTAgNzIuODM2IDcyLjgzNiA1MCAxMDAgNTBDMTI3LjE2NCA1MCAxNTAgNzIuODM2IDE1MCAxMDBDMTUwIDEyNy4xNjQgMTI3LjE2NCAxNTAgMTAwIDE1MEM3Mi44MzYgMTUwIDUwIDEyNy4xNjQgNTAgMTAwWiIgZmlsbD0iIzZCNzM4MCIvPgo8cGF0aCBkPSJNMTI1IDEwMEMxMjUgODkuNTQ4IDExNi40NTIgODEgMTA2IDgxQzk1LjU0NzkgODEgODcgODkuNTQ3OSA4NyAxMDBDOCA5NS41NDc5IDg3IDEwNC40NTIgODcgMTE1Qzg3IDEyNS40NTIgOTUuNTQ3OSAxMzQgMTA2IDEzNEMxMTYuNDUyIDEzNCAxMjUgMTI1LjQ1MiAxMjUgMTE1QzEyNSAxMDQuNDUyIDEyNSAxMDAgMTI1IDEwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                }}
              />
            </div>
            <div className="text-center">
              <p className="text-white text-sm">
                Evidencia {index + 1}
              </p>
              <p className="text-white text-opacity-50 text-xs">
                {new Date(evidencia.creado_en).toLocaleString('es-ES')}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 rounded-t-3xl p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              Detalles del Reporte
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="text-white text-opacity-70 mt-4">Cargando detalles...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-4">
                <p className="text-red-300">{error}</p>
              </div>
            </div>
          ) : report ? (
            <div className="space-y-6">
              {/* Información General */}
              <div className="bg-white bg-opacity-5 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Información General</h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField('ID del Reporte', report.id)}
                  {renderField('Tipo de Reporte', getEventTypeLabel(report.tipo_reporte))}
                  {renderField('Estado', report.estado, 'estado')}
                  {renderField('Asunto', report.asunto || report.asunto_conversacion)}
                  {renderField('Fecha del Evento', report.fecha_evento, 'fecha_evento')}
                  {renderField('Hora del Evento', report.hora_evento, 'hora_evento')}
                  {renderField('Reportado por', report.nombre_usuario)}
                  {renderField('Fecha de Creación', report.creado_en, 'creado_en')}
                  {renderField('Última Actualización', report.actualizado_en, 'actualizado_en')}
                  {report.fecha_revision && renderField('Fecha de Revisión', report.fecha_revision, 'fecha_revision')}
                  {report.comentarios_revision && renderField('Comentarios de Revisión', report.comentarios_revision)}
                </dl>
              </div>

              {/* Información Específica según Tipo */}
              <div className="bg-white bg-opacity-5 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  Información Específica - {getEventTypeLabel(report.tipo_reporte)}
                </h3>
                <dl className="space-y-4">
                  {report.tipo_reporte === 'hallazgos' && (
                    <>
                      {renderField('Lugar del Hallazgo', report.lugar_hallazgo || report.lugar_hallazgo_otro)}
                      {renderField('Tipo de Hallazgo', report.tipo_hallazgo)}
                      {renderField('Descripción del Hallazgo', report.descripcion_hallazgo)}
                      {renderField('Estado de la Condición', report.estado_condicion)}
                      {renderField('Recomendaciones', report.recomendaciones)}
                    </>
                  )}
                  
                  {report.tipo_reporte === 'incidentes' && (
                    <>
                      {renderField('Ubicación del Incidente', report.ubicacion_incidente)}
                      {renderField('Grado de Criticidad', report.grado_criticidad)}
                      {renderField('Tipo de Afectación', report.tipo_afectacion)}
                      {renderField('Descripción del Incidente', report.descripcion_incidente)}
                    </>
                  )}
                  
                  {report.tipo_reporte === 'conversaciones' && (
                    <>
                      {renderField('Tipo de Conversación', report.tipo_conversacion)}
                      {renderField('Sitio del Evento', report.sitio_evento_conversacion)}
                      {renderField('Lugar del Hallazgo', report.lugar_hallazgo_conversacion || report.lugar_hallazgo_conversacion_otro)}
                      {renderField('Descripción de la Conversación', report.descripcion_conversacion)}
                    </>
                  )}
                </dl>
              </div>

              {/* Evidencias */}
              <div className="bg-white bg-opacity-5 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Evidencias</h3>
                {renderEvidence(report.evidencias)}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsModal; 