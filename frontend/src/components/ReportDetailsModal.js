import React, { useState, useEffect } from 'react';
import ReportService from '../services/reportService';
import { evidenceService, API_BASE_URL } from '../services/api';
import { jsPDF } from 'jspdf';


const ReportDetailsModal = ({ isOpen, onClose, reportId }) => {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [evidenceUrls, setEvidenceUrls] = useState({}); // { [id]: { url, contentType } }
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const loadReportDetails = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await ReportService.getReportById(reportId);
      if (result.success) {
        setReport(result.report);
        // Prefetch blobs para evidencias visualizables (imágenes, videos, pdf)
        if (Array.isArray(result.report?.evidencias) && result.report.evidencias.length > 0) {
          prefetchEvidenceBlobs(result.report.evidencias);
        }
      } else {
        setError(result.message);
      }
    } catch (error) {
      //
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && reportId) {
      loadReportDetails();
    }
  }, [isOpen, reportId]);

  // Cargar blobs de evidencias y crear URLs temporales con autorización
  const prefetchEvidenceBlobs = async (evidencias) => {
    if (!Array.isArray(evidencias) || evidencias.length === 0) {
      console.log('No hay evidencias para precargar');
      return;
    }

    console.log(`Precargando ${evidencias.length} evidencias...`);
    
    const entries = await Promise.all(
      evidencias.map(async (ev) => {
        try {
          console.log(`Precargando evidencia ${ev.id}: ${ev.url_archivo}`);
          const { blob, contentType } = await evidenceService.getEvidenceBlob(ev.id);
          const previewable = (contentType || '').startsWith('image/') || (contentType || '').startsWith('video/') || contentType === 'application/pdf';
          if (!previewable) {
            console.log(`Evidencia ${ev.id} no es previewable (${contentType})`);
            return null;
          }
          const objectUrl = URL.createObjectURL(blob);
          console.log(`Evidencia ${ev.id} precargada exitosamente`);
          return [ev.id, { url: objectUrl, contentType, blob }];
        } catch (error) {
          console.error(`Error precargando evidencia ${ev.id}:`, error);
          return null;
        }
      })
    );
    
    const mapped = {};
    entries.forEach((pair) => { if (pair) mapped[pair[0]] = pair[1]; });
    
    console.log(`Evidencias precargadas exitosamente: ${Object.keys(mapped).length}/${evidencias.length}`);
    console.log('Detalles de evidencias precargadas:', mapped);
    setEvidenceUrls((prev) => ({ ...prev, ...mapped }));
  };

  // Limpiar URLs de Blob al cerrar
  useEffect(() => {
    if (!isOpen) return;
    return () => {
      Object.values(evidenceUrls).forEach((v) => { try { URL.revokeObjectURL(v.url); } catch (_) {} });
      setEvidenceUrls({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

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

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pendiente':
        return 'Pendiente de Revisión';
      case 'en_revision':
        return 'En Revisión';
      case 'aprobado':
        return 'Aprobado';
      case 'rechazado':
        return 'Rechazado';
      default:
        return status;
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

  const getDescriptionText = (report) => {
    // Obtener la descripción según el tipo de reporte
    switch (report.tipo_reporte) {
      case 'hallazgos':
        return report.descripcion_hallazgo || report.asunto || 'Sin descripción';
      case 'incidentes':
        return report.descripcion_incidente || report.asunto || 'Sin descripción';
      case 'conversaciones':
        return report.descripcion_conversacion || report.asunto_conversacion || 'Sin descripción';
      default:
        return report.asunto || 'Sin descripción';
    }
  };

  // Función para verificar si una imagen está disponible
  const isImageAvailable = async (imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        resolve(false);
      }, 3000);
      
      img.onload = () => {
        clearTimeout(timeout);
        resolve(true);
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        resolve(false);
      };
      
      img.src = imageUrl;
    });
  };

  // Función para verificar si un blob está disponible y válido
  const isBlobValid = (blobInfo) => {
    if (!blobInfo || !blobInfo.url || !blobInfo.blob) {
      return false;
    }
    
    // Verificar que el blob tenga contenido
    if (blobInfo.blob.size === 0) {
      return false;
    }
    
    // Verificar que sea una imagen
    const contentType = blobInfo.contentType || '';
    if (!contentType.startsWith('image/')) {
      return false;
    }
    
    return true;
  };

  const formatFieldValue = (field, value) => {
    if (!value) return 'No especificado';
    
    switch (field) {
      case 'fecha_evento':
        return new Date(value).toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      case 'hora_evento':
        return value;
      case 'creado_en':
      case 'actualizado_en':
      case 'fecha_revision':
        return new Date(value).toLocaleString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      default:
        return value;
    }
  };

  const renderField = (label, value, fieldName = null, icon = null) => {
    if (!value && value !== 0) return null;
    
    return (
      <div className="flex items-start space-x-3 p-4 bg-white bg-opacity-5 rounded-lg">
        {icon && (
          <div className="flex-shrink-0 mt-1">
            <div className="w-5 h-5 text-blue-400">
              {icon}
            </div>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <dt className="text-sm font-medium text-white text-opacity-70 mb-1">
            {label}
          </dt>
          <dd className="text-white leading-relaxed">
            {formatFieldValue(fieldName, value)}
          </dd>
        </div>
      </div>
    );
  };

  
  const handleDownloadFullReportPdf = async () => {
    try {
      if (!report) return;
      
      setIsDownloadingPdf(true);
      // Señal visual/log para verificar click
      // eslint-disable-next-line no-console
      console.log('Descargando PDF de reporte', report.id);
      
      // Precargar evidencias si no están cargadas
      if (Array.isArray(report.evidencias) && report.evidencias.length > 0) {
        console.log('Precargando evidencias para PDF...');
        await prefetchEvidenceBlobs(report.evidencias);
        // Esperar un poco para que los blobs se procesen
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      console.log('Documento PDF creado:', doc);
      
      const margin = 40;
      let y = margin;
      const pageWidth = typeof doc.getPageWidth === 'function' ? doc.getPageWidth() : (doc.internal?.pageSize?.getWidth ? doc.internal.pageSize.getWidth() : doc.internal.pageSize.width);
      const pageHeight = typeof doc.getPageHeight === 'function' ? doc.getPageHeight() : (doc.internal?.pageSize?.getHeight ? doc.internal.pageSize.getHeight() : doc.internal.pageSize.height);
      
      console.log('Dimensiones de página:', { pageWidth, pageHeight });

      const writeLine = (text) => {
        try {
          const maxWidth = pageWidth - margin * 2;
          const sourceText = (text === undefined || text === null) ? '' : String(text);
          const lines = doc.splitTextToSize(sourceText, maxWidth);
          lines.forEach((line) => { 
            doc.text(line, margin, y); 
            y += 16; 
          });
        } catch (textError) {
          console.error('Error escribiendo texto en PDF:', textError, 'Texto:', text);
          // Fallback: escribir texto simple
          doc.text(String(text || ''), margin, y);
          y += 16;
        }
      };

      // Crear contenido básico del PDF
      console.log('Iniciando generación de contenido PDF');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      writeLine('Reporte HSEQ');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      const meta = [
        `ID: ${report.id ?? ''}`,
        `Tipo: ${getEventTypeLabel(report.tipo_reporte)}`,
        `Usuario: ${report.nombre_usuario ?? ''}`,
        `Estado: ${getStatusLabel(report.estado ?? '')}`,
        `Fecha evento: ${report.fecha_evento ?? ''} ${report.hora_evento ?? ''}`,
        `Creado: ${report.creado_en ?? ''}`,
      ];
      meta.forEach((line) => writeLine(line));
      y += 8;

      doc.setFont('helvetica', 'bold');
      writeLine('Detalle');
      doc.setFont('helvetica', 'normal');

      const addField = (label, value) => { if (value) writeLine(`${label}: ${value}`); };

      if (report.tipo_reporte === 'hallazgos') {
        addField('Lugar del Hallazgo', report.lugar_hallazgo || report.lugar_hallazgo_otro);
        addField('Tipo de Hallazgo', report.tipo_hallazgo);
        addField('Estado de la Condición', report.estado_condicion);
        addField('Descripción', report.descripcion_hallazgo);
        addField('Recomendaciones', report.recomendaciones);
      } else if (report.tipo_reporte === 'incidentes') {
        addField('Ubicación', report.ubicacion_incidente);
        addField('Grado de Criticidad', report.grado_criticidad);
        addField('Tipo de Afectación', report.tipo_afectacion);
        addField('Descripción', report.descripcion_incidente);
      } else if (report.tipo_reporte === 'conversaciones') {
        addField('Tipo de Conversación', report.tipo_conversacion);
        addField('Sitio del Evento', report.sitio_evento_conversacion);
        addField('Lugar del Hallazgo', report.lugar_hallazgo_conversacion || report.lugar_hallazgo_conversacion_otro);
        addField('Descripción', report.descripcion_conversacion);
      }

             y += 8;
       doc.setFont('helvetica', 'bold');
       writeLine('Evidencias');
       doc.setFont('helvetica', 'normal');

       if (Array.isArray(report.evidencias) && report.evidencias.length > 0) {
         // Primero listar todas las evidencias
         report.evidencias.forEach((evidencia, index) => {
           writeLine(`Evidencia ${index + 1}: ${evidencia.url_archivo || 'Sin nombre'} (${evidencia.tipo_archivo || 'Tipo desconocido'})`);
         });

         // Luego agregar las imágenes que ya están cargadas
         const imageEvidencias = report.evidencias.filter((ev) => {
           const t = (ev.tipo_archivo || '').toLowerCase();
           const n = (ev.url_archivo || '').toLowerCase();
           return t.startsWith('image/') || /\\.(jpe?g|png|gif|webp)$/i.test(n);
         });

         if (imageEvidencias.length > 0) {
           y += 16;
           doc.setFont('helvetica', 'bold');
           writeLine('Imágenes de Evidencias:');
           doc.setFont('helvetica', 'normal');

                       for (let i = 0; i < imageEvidencias.length; i++) {
              const evidencia = imageEvidencias[i];
              try {
                console.log(`Procesando imagen ${i + 1}: ${evidencia.url_archivo}`);
                
                // Verificar si hay espacio suficiente en la página
                if (y > pageHeight - 200) {
                  doc.addPage();
                  y = margin;
                }
                
                // Agregar título de la imagen
                writeLine(`Imagen ${i + 1}: ${evidencia.url_archivo || 'Sin nombre'}`);
                y += 8;
                
                // Intentar cargar la imagen usando múltiples métodos
                let imageLoaded = false;
                
                                                  // Método 1: Usar el blob existente en evidenceUrls
                 const blobInfo = evidenceUrls[evidencia.id];
                 console.log(`Blob info para imagen ${i + 1}:`, blobInfo);
                 console.log(`¿Es blob válido?`, isBlobValid(blobInfo));
                 
                 if (isBlobValid(blobInfo)) {
                   console.log(`Intentando usar blob directamente con base64 para imagen ${i + 1}`);
                   
                                       try {
                      await new Promise((resolve) => {
                        const timeout = setTimeout(() => {
                          console.log(`Timeout procesando blob para imagen ${i + 1}`);
                          resolve();
                        }, 8000);
                        
                        // Convertir blob a base64 directamente
                        const reader = new FileReader();
                                               reader.onload = () => {
                          try {
                            const base64 = reader.result.split(',')[1];
                            console.log(`Base64 generado para imagen ${i + 1}, longitud:`, base64.length);
                            
                            // Usar dimensiones fijas para asegurar que la imagen sea visible
                            const maxWidth = pageWidth - margin * 2;
                            const maxHeight = 400; // Aumentar altura máxima
                            
                            // Dimensiones por defecto más grandes
                            let imgWidth = 500;
                            let imgHeight = 400;
                            
                            // Escalar proporcionalmente si es necesario
                            if (imgWidth > maxWidth) {
                              const ratio = maxWidth / imgWidth;
                              imgWidth = maxWidth;
                              imgHeight = imgHeight * ratio;
                            }
                            
                            if (imgHeight > maxHeight) {
                              const ratio = maxHeight / imgHeight;
                              imgHeight = maxHeight;
                              imgWidth = imgWidth * ratio;
                            }
                            
                            console.log(`Dimensiones finales de imagen ${i + 1}:`, { width: imgWidth, height: imgHeight });
                            
                            // Agregar la imagen al PDF usando base64
                            doc.addImage(base64, 'JPEG', margin, y, imgWidth, imgHeight);
                            y += imgHeight + 16;
                            
                            console.log(`Imagen ${i + 1} agregada al PDF exitosamente usando blob directo`);
                            imageLoaded = true;
                            clearTimeout(timeout);
                            resolve();
                          } catch (base64Error) {
                            console.error(`Error procesando base64 para imagen ${i + 1}:`, base64Error);
                            clearTimeout(timeout);
                            resolve();
                          }
                        };
                       
                                               reader.onerror = () => {
                          console.error(`Error leyendo blob para imagen ${i + 1}`);
                          clearTimeout(timeout);
                          resolve();
                        };
                       
                       reader.readAsDataURL(blobInfo.blob);
                     });
                   } catch (blobError) {
                     console.error(`Error procesando blob para imagen ${i + 1}:`, blobError);
                   }
                 }
                
                
                 
                 // Método 2: Si el blob falló, intentar cargar desde el servidor
                 console.log(`¿Intentar método 2? imageLoaded=${imageLoaded}`);
                 if (!imageLoaded) {
                   console.log(`Intentando cargar imagen ${i + 1} directamente desde servidor`);
                  
                  try {
                    await new Promise((resolve) => {
                      const img = new Image();
                      const timeout = setTimeout(() => {
                        console.log(`Timeout cargando imagen ${i + 1} desde servidor`);
                        writeLine(`No se pudo cargar imagen: ${evidencia.url_archivo}`);
                        resolve();
                      }, 10000);
                      
                      img.onload = () => {
                        clearTimeout(timeout);
                        try {
                          // Calcular dimensiones para que quepa en la página
                          const maxWidth = pageWidth - margin * 2;
                          const maxHeight = 300;
                          
                          let imgWidth = img.width;
                          let imgHeight = img.height;
                          
                          // Escalar proporcionalmente
                          if (imgWidth > maxWidth) {
                            const ratio = maxWidth / imgWidth;
                            imgWidth = maxWidth;
                            imgHeight = imgHeight * ratio;
                          }
                          
                          if (imgHeight > maxHeight) {
                            const ratio = maxHeight / imgHeight;
                            imgHeight = maxHeight;
                            imgWidth = imgWidth * ratio;
                          }
                          
                          // Agregar la imagen al PDF
                          doc.addImage(img, 'JPEG', margin, y, imgWidth, imgHeight);
                          y += imgHeight + 16;
                          
                          console.log(`Imagen ${i + 1} agregada al PDF exitosamente desde servidor`);
                          imageLoaded = true;
                          resolve();
                        } catch (imgError) {
                          console.error(`Error agregando imagen ${i + 1} desde servidor:`, imgError);
                          writeLine(`Error al procesar imagen: ${evidencia.url_archivo}`);
                          resolve();
                        }
                      };
                      
                                             img.onerror = (error) => {
                         clearTimeout(timeout);
                         console.error(`Error cargando imagen ${i + 1} desde servidor: ${evidencia.url_archivo}`, error);
                         writeLine(`No se pudo cargar imagen: ${evidencia.url_archivo} (Error de red)`);
                         resolve();
                       };
                      
                                             // Usar el endpoint autenticado en lugar de la URL directa para evitar CORS
                       const token = localStorage.getItem('token');
                       const imageUrl = `${API_BASE_URL}/api/evidencias/${evidencia.id}${token ? `?token=${encodeURIComponent(token)}` : ''}`;
                       img.src = imageUrl;
                    });
                  } catch (serverError) {
                    console.error(`Error procesando imagen ${i + 1} desde servidor:`, serverError);
                    writeLine(`Error al cargar imagen: ${evidencia.url_archivo}`);
                  }
                }
                
                // Si ningún método funcionó, agregar mensaje de error
                if (!imageLoaded) {
                  writeLine(`No se pudo cargar la imagen: ${evidencia.url_archivo}`);
                }
                
              } catch (imageError) {
                console.error(`Error procesando imagen ${i + 1}:`, imageError);
                writeLine(`Error al procesar imagen: ${evidencia.url_archivo}`);
              }
            }
         }
       } else {
         writeLine('No hay evidencias adjuntas');
       }
      
      console.log('Contenido PDF generado exitosamente');

      const safeName = String(report.asunto || report.asunto_conversacion || 'reporte').replace(/[^a-z0-9_.-]/gi, '_');
      const fileName = `reporte_${report.id || ''}_${safeName}.pdf`;
      
             console.log('Intentando guardar PDF con nombre:', fileName);
       
       // Método 1: Intentar descarga directa primero
       try {
         console.log('Intentando descarga directa...');
         doc.save(fileName);
         console.log('PDF descargado exitosamente usando método directo');
         // Mostrar mensaje de éxito al usuario
         alert('PDF generado y descargado exitosamente');
         return;
       } catch (directError) {
         console.log('Método directo falló, intentando blob...', directError);
       }
       
       // Método 2: Usar blob con descarga manual
       try {
         const blob = doc.output('blob');
         console.log('Blob generado:', blob);
         console.log('Tamaño del blob:', blob.size, 'bytes');
         console.log('Tipo del blob:', blob.type);
         
         if (!blob || blob.size === 0) {
           throw new Error('El blob generado está vacío');
         }
         
         // Crear URL del blob
         const url = URL.createObjectURL(blob);
         console.log('URL del blob creada:', url);
         
         // Crear elemento de descarga
         const a = document.createElement('a');
         a.href = url;
         a.download = fileName;
         a.style.display = 'none';
         
         // Agregar al DOM y hacer click
         document.body.appendChild(a);
         console.log('Elemento de descarga agregado al DOM');
         
         // Simular click
         a.click();
         console.log('Click simulado en elemento de descarga');
         
         // Limpiar
         setTimeout(() => {
           try {
             document.body.removeChild(a);
             URL.revokeObjectURL(url);
             console.log('Elemento de descarga removido y URL liberada');
           } catch (cleanupError) {
             console.log('Error en limpieza:', cleanupError);
           }
         }, 1000);
         
         console.log('PDF descargado exitosamente usando blob');
         // Mostrar mensaje de éxito al usuario
         alert('PDF generado y descargado exitosamente');
         return;
       } catch (blobError) {
         console.error('Error en descarga con blob:', blobError);
         
         // Método 3: Abrir en nueva ventana
         try {
           const dataUrl = doc.output('dataurlstring');
           console.log('Generando data URL para window.open');
           const newWindow = window.open(dataUrl, '_blank');
           if (newWindow) {
             console.log('PDF abierto en nueva ventana');
           } else {
             throw new Error('Popup bloqueado');
           }
         } catch (dataUrlError) {
           console.error('Error con data URL:', dataUrlError);
           
           // Método 4: Mostrar mensaje al usuario
           alert('No se pudo descargar el PDF automáticamente. Por favor:\n\n1. Habilita las descargas automáticas en tu navegador\n2. Desactiva el bloqueador de popups\n3. Intenta nuevamente');
         }
       }
    } catch (e) {
      console.error('Error general en descarga de PDF:', e);
      alert('No se pudo descargar el PDF del reporte: ' + e.message);
    } finally {
      // Limpiar cualquier recurso temporal
      console.log('Finalizando proceso de descarga de PDF');
      setIsDownloadingPdf(false);
    }
  };


  const buildPublicImageUrl = (fileName) => `${API_BASE_URL}/uploads/${encodeURIComponent(fileName || '')}`;

  const renderEvidence = (evidencias) => {
    if (!evidencias || evidencias.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white text-opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <p className="text-white text-opacity-50 text-lg">No hay evidencias adjuntas</p>
          <p className="text-white text-opacity-30 text-sm mt-2">Este reporte no incluye archivos multimedia</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {evidencias.map((evidencia, index) => {
          const blobInfo = evidenceUrls[evidencia.id];
          const type = (blobInfo && blobInfo.contentType) || evidencia.tipo_archivo || '';
          const isImage = type.startsWith('image/');
          const isVideo = type.startsWith('video/');
          const isPdf = type === 'application/pdf';
          return (
            <div key={evidencia.id} className="group relative bg-white bg-opacity-5 rounded-xl hover:bg-opacity-10 transition-all duration-300">
              <div className="flex items-center justify-center w-full h-56" style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}>
                {isImage ? (
                  <img
                    src={buildPublicImageUrl(evidencia.url_archivo)}
                    alt={`Evidencia ${index + 1}`}
                    className="w-full h-full object-contain rounded-t-xl"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback al endpoint autenticado si la imagen pública falla
                      const token = localStorage.getItem('token') || '';
                      const fallback = `${API_BASE_URL}/api/evidencias/${evidencia.id}?token=${encodeURIComponent(token)}`;
                      if (!e.target.dataset.fallback) {
                        e.target.dataset.fallback = '1';
                        e.target.src = fallback;
                      } else {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }
                    }}
                  />
                ) : isVideo ? (
                  <video 
                    src={`${API_BASE_URL}/api/evidencias/${evidencia.id}?token=${encodeURIComponent(localStorage.getItem('token') || '')}`}
                    className="w-full h-full object-contain rounded-t-xl"
                    controls
                    preload="metadata"
                  />
                ) : isPdf ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-16 h-16 mx-auto text-white text-opacity-50 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      <p className="text-white text-opacity-70 text-sm">PDF</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-16 h-16 mx-auto text-white text-opacity-50 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      <p className="text-white text-opacity-70 text-sm">Archivo</p>
                    </div>
                  </div>
                )}
                {/* Fallback para errores de imagen */}
                <div className="w-full h-full flex items-center justify-center" style={{display: 'none'}}>
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto text-white text-opacity-50 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <p className="text-white text-opacity-70 text-sm">Error al cargar</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Evidencia {index + 1}</p>
                    <p className="text-white text-opacity-50 text-sm">
                      {new Date(evidencia.creado_en).toLocaleDateString('es-ES', {
                        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                    <p className="text-white text-opacity-40 text-xs mt-1">
                      {evidencia.url_archivo || 'Sin nombre'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  

  

  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-gray-800 rounded-t-3xl p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {report && (
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStatusColor(report.estado)}`}>
                  {getEventTypeIcon(report.tipo_reporte)}
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Detalles del Reporte
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
          {isLoading ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-6">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
              </div>
              <p className="text-white text-opacity-70 text-lg">Cargando detalles del reporte...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-6 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <p className="text-red-300 text-lg mb-2">Error al cargar el reporte</p>
              <p className="text-white text-opacity-50">{error}</p>
            </div>
          ) : report ? (
            <div className="space-y-8">
              {/* Estado y Asunto */}
              <div className="bg-gradient-to-r from-blue-500 bg-opacity-10 to-purple-500 bg-opacity-10 rounded-2xl p-6 border border-blue-500 border-opacity-20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold text-white ${getStatusColor(report.estado)}`}>
                      {getStatusLabel(report.estado)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-opacity-60 text-sm">Reportado por</p>
                    <p className="text-white font-semibold">{report.nombre_usuario}</p>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {report.asunto || report.asunto_conversacion || 'Sin asunto'}
                </h3>
                <p className="text-white text-opacity-80">
                  {formatFieldValue('fecha_evento', report.fecha_evento)}
                  {report.hora_evento && ` • ${report.hora_evento}`}
                </p>
              </div>

              {/* Información Específica según Tipo */}
              <div className="bg-white bg-opacity-5 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Información del Evento
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.tipo_reporte === 'hallazgos' && (
                    <>
                      {renderField('Lugar del Hallazgo', report.lugar_hallazgo || report.lugar_hallazgo_otro, null, 
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                      )}
                      {renderField('Tipo de Hallazgo', report.tipo_hallazgo, null,
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      )}
                      {renderField('Estado de la Condición', report.estado_condicion, null,
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      )}
                      {renderField('Descripción', report.descripcion_hallazgo, null,
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                      )}
                      {renderField('Recomendaciones', report.recomendaciones, null,
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                        </svg>
                      )}
                    </>
                  )}
                  
                  {report.tipo_reporte === 'incidentes' && (
                    <>
                      {renderField('Ubicación', report.ubicacion_incidente, null,
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                      )}
                      {renderField('Grado de Criticidad', report.grado_criticidad, null,
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                        </svg>
                      )}
                      {renderField('Tipo de Afectación', report.tipo_afectacion, null,
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                      )}
                      {renderField('Descripción', report.descripcion_incidente, null,
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                      )}
                    </>
                  )}
                  
                  {report.tipo_reporte === 'conversaciones' && (
                    <>
                      {renderField('Tipo de Conversación', report.tipo_conversacion, null,
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                        </svg>
                      )}
                      {renderField('Sitio del Evento', report.sitio_evento_conversacion, null,
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                      )}
                      {renderField('Lugar del Hallazgo', report.lugar_hallazgo_conversacion || report.lugar_hallazgo_conversacion_otro, null,
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                      )}
                      {renderField('Descripción', report.descripcion_conversacion, null,
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                        </svg>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Información de Revisión */}
              {(report.fecha_revision || report.comentarios_revision) && (
                <div className="bg-white bg-opacity-5 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Información de Revisión
                  </h3>
                  <div className="space-y-4">
                    {renderField('Fecha de Revisión', report.fecha_revision, 'fecha_revision',
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    )}
                    {renderField('Comentarios', report.comentarios_revision, null,
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                      </svg>
                    )}
                  </div>
                </div>
              )}

              {/* Evidencias */}
              <div className="bg-white bg-opacity-5 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <svg className="w-6 h-6 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    Evidencias Adjuntas
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button type="button"
                      onClick={handleDownloadFullReportPdf}
                      disabled={isDownloadingPdf}
                      className={`text-white px-3 py-2 rounded text-sm transition-colors flex items-center space-x-2 ${
                        isDownloadingPdf 
                          ? 'bg-gray-600 cursor-not-allowed' 
                          : 'bg-emerald-700 hover:bg-emerald-600'
                      }`}
                      id={`btn-download-report-${report?.id ?? ''}`}
                    >
                      {isDownloadingPdf ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generando PDF...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                          Descargar Reporte (PDF)
                        </>
                      )}
                    </button>
                  </div>
                </div>
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