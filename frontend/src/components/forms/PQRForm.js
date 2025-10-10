import React from 'react';
import { 
  TextInput, 
  EmailInput,
  TelInput,
  RadioInput,
  TextAreaInput, 
  FileInput, 
  SubmitButton 
} from './FormInputs';

const tiposRequerimiento = [
  { value: 'peticion', label: 'Petición' },
  { value: 'queja', label: 'Queja' },
  { value: 'reclamo', label: 'Reclamo' },
  { value: 'inquietud', label: 'Inquietud' }
];

const PQRForm = ({ 
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
          <h3 className="text-2xl font-bold text-white">PQR – Peticiones, Quejas y Reclamos</h3>
          <p className="text-white text-opacity-80 text-sm mt-1">Presenta tu solicitud de manera formal y estructurada</p>
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
          placeholder="Escriba el asunto de su PQR"
          helper="Resume brevemente el motivo de tu solicitud"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TelInput
            name="telefono_contacto"
            value={reportData.telefono_contacto}
            onChange={onInputChange}
            label="Número telefónico"
            placeholder="Ej: 3001234567"
            helper="Número de contacto para seguimiento"
            required
          />

          <EmailInput
            name="correo_contacto"
            value={reportData.correo_contacto}
            onChange={onInputChange}
            label="Correo electrónico"
            placeholder="ejemplo@correo.com"
            helper="Correo de contacto para respuestas"
            required
          />
        </div>

        <RadioInput
          name="tipo_pqr"
          value={reportData.tipo_pqr}
          onChange={onInputChange}
          label="Tipo de requerimiento"
          options={tiposRequerimiento}
          helper="Selecciona el tipo de solicitud que deseas presentar"
          required
        />

        <TextAreaInput
          name="descripcion_pqr"
          value={reportData.descripcion_pqr}
          onChange={onInputChange}
          label="Descripción detallada"
          placeholder="Describe detalladamente tu solicitud, queja, reclamo o inquietud..."
          rows={6}
          helper="Proporciona toda la información relevante para una mejor atención (mínimo 20 caracteres)"
          required
        />

        <FileInput
          id="evidencia_pqr"
          name="evidencia"
          onChange={onFileChange}
          label="Evidencia (Opcional)"
          accept="image/*,.pdf"
          buttonColor="blue"
          helper="Adjunta documentos o imágenes que respalden tu solicitud"
        />

        <div className="flex items-center space-x-4 pt-4">
          <SubmitButton
            isLoading={isLoading}
            text="Enviar PQR"
            color="blue"
            icon="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </div>
      </form>
    </div>
  );
};

export default PQRForm;

