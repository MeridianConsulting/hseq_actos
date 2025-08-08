import React from 'react';

// Componente para inputs de texto
export const TextInput = ({ 
  name, 
  value, 
  onChange, 
  label, 
  placeholder, 
  required = false,
  className = "",
  helper
}) => (
  <div>
    <label className="block text-white text-opacity-90 font-semibold mb-2">
      {label} {required && '*'}
    </label>
    {helper && <p className="text-white text-opacity-70 text-xs mb-2">{helper}</p>}
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 bg-gray-900/60 border border-white/10 rounded-xl text-white placeholder-gray-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 hover:border-white/20 ${className}`}
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
  required = false,
  helper
}) => (
  <div>
    <label className="block text-white text-opacity-90 font-semibold mb-2">
      {label} {required && '*'}
    </label>
    {helper && <p className="text-white text-opacity-70 text-xs mb-2">{helper}</p>}
    <input
      type="date"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 bg-gray-900/60 border border-white/10 rounded-xl text-white placeholder-gray-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 hover:border-white/20 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
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
  required = false,
  helper
}) => (
  <div>
    <label className="block text-white text-opacity-90 font-semibold mb-2">
      {label} {required && '*'}
    </label>
    {helper && <p className="text-white text-opacity-70 text-xs mb-2">{helper}</p>}
    <input
      type="time"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 bg-gray-900/60 border border-white/10 rounded-xl text-white placeholder-gray-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 hover:border-white/20 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
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
  required = false,
  helper
}) => (
  <div>
    <label className="block text-white text-opacity-90 font-semibold mb-2">
      {label} {required && '*'}
    </label>
    {helper && <p className="text-white text-opacity-70 text-xs mb-2">{helper}</p>}
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      className="w-full px-4 py-3 bg-gray-900/60 border border-white/10 rounded-xl text-white placeholder-gray-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 hover:border-white/20 resize-none"
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
  required = false,
  helper
}) => (
  <div>
    <label className="block text-white text-opacity-90 font-semibold mb-2">
      {label} {required && '*'}
    </label>
    {helper && <p className="text-white text-opacity-70 text-xs mb-2">{helper}</p>}
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 bg-gray-900/60 border border-white/10 rounded-xl text-white placeholder-gray-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 hover:border-white/20"
      required={required}
    >
      <option value="" className="bg-gray-900 text-white">{placeholder}</option>
      {options.map(option => (
        <option key={option.value} value={option.value} className="bg-gray-900 text-white">
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
  required = false,
  helper
}) => (
  <div>
    <label className="block text-white text-opacity-90 font-semibold mb-2">
      {label} {required && '*'}
    </label>
    {helper && <p className="text-white text-opacity-70 text-xs mb-2">{helper}</p>}
    {(() => {
      const fileColorMap = {
        blue: 'file:bg-blue-600 hover:file:bg-blue-700',
        red: 'file:bg-red-600 hover:file:bg-red-700',
        green: 'file:bg-green-600 hover:file:bg-green-700',
        yellow: 'file:bg-yellow-500 hover:file:bg-yellow-600',
        gray: 'file:bg-gray-700 hover:file:bg-gray-800'
      };
      const fileColorClasses = fileColorMap[buttonColor] || fileColorMap.gray;
      return (
        <input
          type="file"
          id={id}
          name={name}
          onChange={onChange}
          accept={accept}
          className={`w-full px-4 py-3 bg-gray-900/60 border border-white/10 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${fileColorClasses}`}
          required={required}
        />
      );
    })()}
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
    className={`bg-${color}-500 hover:bg-${color}-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg hover:shadow-xl focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent`}
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