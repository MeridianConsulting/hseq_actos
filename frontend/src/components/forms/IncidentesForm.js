import React from 'react';
import { 
  TextInput, 
  DateInput, 
  TimeInput, 
  SelectInput, 
  TextAreaInput, 
  FileInput, 
  SubmitButton 
} from './FormInputs';
import { 
  gradosCriticidad, 
  tiposAfectacion 
} from '../../config/formOptions';

const IncidentesForm = ({ 
  reportData, 
  onInputChange, 
  onFileChange, 
  onSubmit, 
  isLoading, 
  onBack 
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white">INCIDENTE HSE</h3>
          <p className="text-white text-opacity-80 text-sm mt-1">Registra incidentes para su análisis y mejora continua</p>
        </div>
        <button
          onClick={onBack}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2 shadow"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          <span>Volver</span>
        </button>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-6">
        <TextInput
          name="asunto"
          value={reportData.asunto}
          onChange={onInputChange}
          label="Asunto"
          placeholder="Escriba el asunto del incidente"
          required
        />

        <DateInput
          name="fecha_evento"
          value={reportData.fecha_evento}
          onChange={onInputChange}
          label="Fecha del evento"
          required
          maxToday
        />

        <SelectInput
          name="grado_criticidad"
          value={reportData.grado_criticidad}
          onChange={onInputChange}
          label="Grado de criticidad del evento"
          options={gradosCriticidad}
          placeholder="Selecciona la respuesta"
          helper="Evalúa la severidad para priorizar acciones"
          required
        />

        <TextInput
          name="ubicacion_incidente"
          value={reportData.ubicacion_incidente}
          onChange={onInputChange}
          label="Ubicación del Incidente - Instalación donde ocurre el evento"
          placeholder="Escriba la ubicación específica del incidente"
          helper="Indica instalación, área y punto específico"
          required
        />

        <TimeInput
          name="hora_evento"
          value={reportData.hora_evento}
          onChange={onInputChange}
          label="Hora del evento"
          helper="Hora aproximada del suceso"
          required
        />

        <SelectInput
          name="tipo_afectacion"
          value={reportData.tipo_afectacion}
          onChange={onInputChange}
          label="Tipo de evento - Afectación"
          options={tiposAfectacion}
          placeholder="Seleccione el tipo de afectación"
          helper="Selecciona la categoría que mejor describe el evento"
          required
        />

        <TextAreaInput
          name="descripcion_incidente"
          value={reportData.descripcion_incidente}
          onChange={onInputChange}
          label="Descripción (detalle los eventos y/o sucesos que ocasionaron el incidente)"
          placeholder="Describa detalladamente los eventos que ocasionaron el incidente"
          helper="Incluye causas aparentes, condiciones y actos relacionados"
          required
        />

        <FileInput
          id="evidencia_incidente"
          name="evidencia"
          onChange={onFileChange}
          label="Evidencia (Opcional)"
          buttonColor="red"
          helper="Adjunta fotos o documentos relevantes (opcional)"
        />

        <div className="flex justify-end">
          <SubmitButton 
            isLoading={isLoading} 
            text="Enviar Reporte" 
            color="red"
            icon="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </div>
      </form>
    </div>
  );
};

export default IncidentesForm; 