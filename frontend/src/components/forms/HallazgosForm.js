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
  tiposHallazgo, 
  estadosCondicion 
} from '../../config/formOptions';

const HallazgosForm = ({ 
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
          <h3 className="text-2xl font-bold text-white">Reportar Condición o Acto Inseguro</h3>
          <p className="text-white text-opacity-80 text-sm mt-1">Identifica y reporta hallazgos para mejorar la seguridad</p>
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
          placeholder="Escriba el asunto del hallazgo o condición insegura"
          required
        />

        <SelectInput
          name="lugar_hallazgo"
          value={reportData.lugar_hallazgo}
          onChange={onInputChange}
          label="Lugar del hallazgo (Instalación donde ocurrió el evento)"
          options={instalaciones}
          placeholder="Seleccione una instalación"
          helper="Selecciona la instalación donde fue identificado el hallazgo"
          required
        />

        {reportData.lugar_hallazgo === 'otras' && (
          <TextInput
            name="lugar_hallazgo_otro"
            value={reportData.lugar_hallazgo_otro}
            onChange={onInputChange}
            label="Especifique el lugar del hallazgo"
            placeholder="Escriba el lugar específico del hallazgo"
            required
          />
        )}

        <DateInput
          name="fecha_evento"
          value={reportData.fecha_evento}
          onChange={onInputChange}
          label="Fecha del evento"
          helper="Indica la fecha en que observaste el hallazgo"
          required
        />

        <SelectInput
          name="tipo_hallazgo"
          value={reportData.tipo_hallazgo}
          onChange={onInputChange}
          label="Tipo de hallazgo"
          options={tiposHallazgo}
          placeholder="Seleccione el tipo de hallazgo"
          helper="Clasifica el hallazgo para priorizar su atención"
          required
        />

        <TextAreaInput
          name="descripcion_hallazgo"
          value={reportData.descripcion_hallazgo}
          onChange={onInputChange}
          label="Descripción del hallazgo"
          placeholder="Describe detalladamente el hallazgo observado..."
          helper="Incluye quién, dónde, cuándo y posibles riesgos asociados"
          required
        />

        <TextAreaInput
          name="recomendaciones"
          value={reportData.recomendaciones}
          onChange={onInputChange}
          label="Acciones a implementar"
          placeholder="Describa la(s) acción(es) a implementar para evitar que el hallazgo se vuelva a presentar"
          helper="Propón acciones concretas, responsables y tiempos estimados"
          required
        />

        <SelectInput
          name="estado_condicion"
          value={reportData.estado_condicion}
          onChange={onInputChange}
          label="La condición o acto ya fue cerrada o continúa abierta"
          options={estadosCondicion}
          placeholder="Seleccione el estado"
          helper="Indica si ya se tomaron acciones para cerrar el hallazgo"
          required
        />

        <FileInput
          id="evidencia"
          name="evidencia"
          onChange={onFileChange}
          label="Evidencia (Opcional)"
          buttonColor="blue"
          helper="Adjunta imágenes o documentos que respalden el hallazgo"
        />

        <div className="flex justify-end">
          <SubmitButton 
            isLoading={isLoading} 
            text="Enviar Reporte" 
            color="yellow"
            icon="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </div>
      </form>
    </div>
  );
};

export default HallazgosForm; 