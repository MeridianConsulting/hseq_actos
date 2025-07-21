import React from 'react';

// Componente para inputs de texto
export const TextInput = ({ 
  name, 
  value, 
  onChange, 
  label, 
  placeholder, 
  required = false,
  className = ""
}) => (
  <div>
    <label className="block text-white font-semibold mb-2">
      {label} {required && '*'}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${className}`}
      placeholder={placeholder}
      required={required}
    />
  </div>
);

// Componente para inputs de fecha
export const DateInput = ({ 
  name, 
  value, 
  onChange, 
  label, 
  required = false 
}) => (
  <div>
    <label className="block text-white font-semibold mb-2">
      {label} {required && '*'}
    </label>
    <input
      type="date"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
      required={required}
    />
  </div>
);

// Componente para inputs de hora
export const TimeInput = ({ 
  name, 
  value, 
  onChange, 
  label, 
  required = false 
}) => (
  <div>
    <label className="block text-white font-semibold mb-2">
      {label} {required && '*'}
    </label>
    <input
      type="time"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
      required={required}
    />
  </div>
);

// Componente para textareas
export const TextAreaInput = ({ 
  name, 
  value, 
  onChange, 
  label, 
  placeholder, 
  rows = 4, 
  required = false 
}) => (
  <div>
    <label className="block text-white font-semibold mb-2">
      {label} {required && '*'}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
      placeholder={placeholder}
      required={required}
    />
  </div>
);

// Componente para selects
export const SelectInput = ({ 
  name, 
  value, 
  onChange, 
  label, 
  options, 
  placeholder, 
  required = false 
}) => (
  <div>
    <label className="block text-white font-semibold mb-2">
      {label} {required && '*'}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
      required={required}
    >
      <option value="" className="bg-gray-800 text-white">{placeholder}</option>
      {options.map(option => (
        <option key={option.value} value={option.value} className="bg-gray-800 text-white">
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

// Componente para inputs de archivo
export const FileInput = ({ 
  id, 
  name, 
  onChange, 
  label, 
  accept = "image/*,.pdf,.doc,.docx",
  buttonColor = "blue",
  required = false 
}) => (
  <div>
    <label className="block text-white font-semibold mb-2">
      {label} {required && '*'}
    </label>
    <input
      type="file"
      id={id}
      name={name}
      onChange={onChange}
      accept={accept}
      className={`w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-${buttonColor}-600 file:text-white hover:file:bg-${buttonColor}-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent`}
      required={required}
    />
    <p className="text-gray-300 text-sm mt-2">
      Formatos permitidos: JPG, PNG, PDF, DOC, DOCX (máx. 10MB)
    </p>
  </div>
);

// Componente para botones de envío
export const SubmitButton = ({ 
  isLoading, 
  text = "Enviar Reporte", 
  color = "blue",
  icon = "M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
}) => (
  <button
    type="submit"
    disabled={isLoading}
    className={`bg-${color}-500 hover:bg-${color}-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2`}
  >
    {isLoading ? (
      <>
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        <span>Enviando...</span>
      </>
    ) : (
      <>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon}/>
        </svg>
        <span>{text}</span>
      </>
    )}
  </button>
); 