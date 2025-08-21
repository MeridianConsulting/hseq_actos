import React, { useState, useEffect, useRef } from 'react';
import { getUser, getUserName, getUserEmail } from '../utils/auth';

const ApprovalModal = ({ isOpen, onClose, report, onApprove }) => {
  const [formData, setFormData] = useState({
    motivoAprobacion: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      // Focus on textarea when modal opens
      setTimeout(() => textareaRef.current.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setFormData({ motivoAprobacion: '' });
      setError(null);
    }
  }, [isOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      // Escape to close modal
      if (e.key === 'Escape') {
        onClose();
      }
      
      // Ctrl/Cmd + Enter to submit
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, formData.motivoAprobacion]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const generateGmailUrl = (motivoAprobacion) => {
    const user = getUser();
    const userName = getUserName();
    const userEmail = getUserEmail();
    const timestamp = new Date().toLocaleString('es-CO', {
      timeZone: 'America/Bogota',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    // HSEQ team emails
    const hseqEmails = [
      'hseq@meridian.com.co',
      'soportehseqproyectos@meridian.com.co',
      'soportehseq@meridian.com.co',
      'profesionalhseq@meridian.com.co',
      'aprendizhseq@meridian.com.co'
    ];

    // Email subject
    const subject = `Caso ID ${report.id} aprobado por ${userName}`;

    // Email body
    const body = `Buen día equipo HSEQ,

Se notifica la aprobación del caso:
• ID del caso: ${report.id}
• Aprobado por: ${userName} (${userEmail})
• Fecha y hora: ${timestamp}

Motivo de la aprobación:
${motivoAprobacion}

Saludos,
${userName}`;

    // Build Gmail composition URL
    const params = new URLSearchParams({
      view: 'cm',
      fs: '1',
      to: hseqEmails.join(','),
      su: subject,
      body: body
    });

    return `https://mail.google.com/mail/?${params.toString()}`;
  };

  const handleSubmit = async () => {
         if (!formData.motivoAprobacion.trim()) {
       setError('El motivo de la aprobación es obligatorio');
       textareaRef.current?.focus();
       return;
     }

    setIsLoading(true);
    setError(null);

    try {
             // Call the onApprove callback with the form data
       await onApprove(report.id, formData.motivoAprobacion);
       
       // Generate and open Gmail draft
       const gmailUrl = generateGmailUrl(formData.motivoAprobacion);
      window.open(gmailUrl, '_blank');
      
      // Close modal
      onClose();
    } catch (error) {
      setError('Error al procesar la aprobación: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-t-3xl p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Aprobar Reporte
                </h2>
                <p className="text-white text-opacity-60 text-sm">
                  Aprobar caso y notificar al equipo HSEQ
                </p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="w-10 h-10 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full flex items-center justify-center transition-all duration-200"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 rounded-lg" role="alert" aria-live="polite">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p className="text-red-300">{error}</p>
              </div>
            </div>
          )}

          {/* Report Info */}
          <div className="bg-white bg-opacity-5 rounded-2xl p-4 border border-white border-opacity-10">
            <h3 className="text-lg font-semibold text-white mb-3">Información del Reporte</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white text-opacity-60">ID del caso:</span>
                <span className="text-white ml-2 font-medium">#{report.id}</span>
              </div>
              <div>
                <span className="text-white text-opacity-60">Tipo:</span>
                <span className="text-white ml-2 font-medium">{report.tipo_reporte}</span>
              </div>
              <div>
                <span className="text-white text-opacity-60">Asunto:</span>
                <span className="text-white ml-2 font-medium">{report.asunto || report.asunto_conversacion || 'Sin asunto'}</span>
              </div>
              <div>
                <span className="text-white text-opacity-60">Estado actual:</span>
                <span className="text-white ml-2 font-medium">{report.estado}</span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Subject (Read-only) */}
            <div>
              <label className="block text-white font-medium mb-2">
                Asunto del correo
              </label>
                             <input
                 type="text"
                 value={`Caso ID ${report.id} aprobado por ${getUserName()}`}
                 readOnly
                 className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white text-opacity-80 cursor-not-allowed"
               />
            </div>

                         {/* Reason for approval (Required) */}
             <div>
               <label className="block text-white font-medium mb-2">
                 Motivo de la aprobación <span className="text-red-400">*</span>
               </label>
               <textarea
                 ref={textareaRef}
                 name="motivoAprobacion"
                 value={formData.motivoAprobacion}
                 onChange={handleInputChange}
                 placeholder="Explica el motivo por el cual se aprueba este caso..."
                 rows={4}
                 className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                 required
               />
             </div>

            {/* Message Preview */}
            <div>
              <label className="block text-white font-medium mb-2">
                Vista previa del mensaje
              </label>
              <div className="w-full px-4 py-3 bg-white bg-opacity-5 border border-white border-opacity-20 rounded-lg text-white text-opacity-80 min-h-[120px] whitespace-pre-wrap">
                                 {formData.motivoAprobacion ? (
                   <>
                     <div className="text-white text-opacity-60 mb-2">Buen día equipo HSEQ,</div>
                     <div className="text-white text-opacity-60 mb-2">Se notifica la aprobación del caso:</div>
                     <div className="text-white text-opacity-60 mb-1">• ID del caso: {report.id}</div>
                     <div className="text-white text-opacity-60 mb-1">• Aprobado por: {getUserName()} ({getUserEmail()})</div>
                     <div className="text-white text-opacity-60 mb-2">• Fecha y hora: {new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' })}</div>
                     <div className="text-white text-opacity-60 mb-2">Motivo de la aprobación:</div>
                     <div className="text-white">{formData.motivoAprobacion}</div>
                     <div className="text-white text-opacity-60 mt-2">Saludos,</div>
                     <div className="text-white">{getUserName()}</div>
                   </>
                 ) : (
                   <span className="text-white text-opacity-40">El mensaje se generará automáticamente cuando completes el motivo de la aprobación.</span>
                 )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
                             disabled={isLoading || !formData.motivoAprobacion.trim()}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  Enviar y cerrar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalModal;
