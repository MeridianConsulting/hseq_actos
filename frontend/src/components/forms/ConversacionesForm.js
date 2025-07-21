import React from 'react';
import { 
  TextInput, 
  DateInput, 
  SelectInput, 
  TextAreaInput, 
  FileInput, 
  SubmitButton 
} from './FormInputs';
import { 
  instalaciones, 
  tiposConversacion 
} from '../../config/formOptions';

const ConversacionesForm = ({ 
  reportData, 
  onInputChange, 
  onFileChange, 
  onSubmit, 
  isLoading, 
  onBack 
}) => {
  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">
          CONVERSACIONES Y REFLEXIONES HSE
        </h3>
        <button
          onClick={onBack}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          <span>Volver</span>
        </button>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-6">
        <TextInput
          name="asunto_conversacion"
          value={reportData.asunto_conversacion}
          onChange={onInputChange}
          label="Asunto"
          placeholder="Escriba el asunto de la conversación o reflexión"
          required
        />

        <SelectInput
          name="tipo_conversacion"
          value={reportData.tipo_conversacion}
          onChange={onInputChange}
          label="¿Qué desea reportar?"
          options={tiposConversacion}
          placeholder="Seleccione el tipo de reporte"
          required
        />

        <DateInput
          name="fecha_evento"
          value={reportData.fecha_evento}
          onChange={onInputChange}
          label="Fecha del evento"
          required
        />

        <TextInput
          name="sitio_evento_conversacion"
          value={reportData.sitio_evento_conversacion}
          onChange={onInputChange}
          label="Sitio del evento"
          placeholder="Escriba el sitio específico del evento"
          required
        />

        <SelectInput
          name="lugar_hallazgo_conversacion"
          value={reportData.lugar_hallazgo_conversacion}
          onChange={onInputChange}
          label="Lugar de hallazgo (Instalación donde ocurre el evento)"
          options={instalaciones}
          placeholder="Seleccione una instalación"
          required
        />

        {reportData.lugar_hallazgo_conversacion === 'otras' && (
          <TextInput
            name="lugar_hallazgo_conversacion_otro"
            value={reportData.lugar_hallazgo_conversacion_otro}
            onChange={onInputChange}
            label="Especifique el lugar del hallazgo"
            placeholder="Escriba el lugar específico del hallazgo"
            required
          />
        )}

        <TextAreaInput
          name="descripcion_conversacion"
          value={reportData.descripcion_conversacion}
          onChange={onInputChange}
          label="Descripción de las situaciones reflexionadas y/o conversadas"
          placeholder="Describa detalladamente las situaciones reflexionadas o conversadas"
          required
        />

        <FileInput
          id="evidencia_conversacion"
          name="evidencia"
          onChange={onFileChange}
          label="Evidencia (Opcional)"
          buttonColor="green"
        />

        <div className="flex justify-end">
          <SubmitButton 
            isLoading={isLoading} 
            text="Enviar Reporte" 
            color="green"
            icon="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </div>
      </form>
    </div>
  );
};

export default ConversacionesForm; 