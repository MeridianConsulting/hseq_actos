import React, { useState, useEffect } from 'react';
import ReportService from '../services/reportService';
import { evidenceService, API_BASE_URL } from '../services/api';
import jsPDF from 'jspdf';

const ReportDetailsModal = ({ isOpen, onClose, reportId }) => {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [evidenceUrls, setEvidenceUrls] = useState({}); // { [id]: { url, contentType } }

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
    const entries = await Promise.all(
      evidencias.map(async (ev) => {
        try {
          const { blob, contentType } = await evidenceService.getEvidenceBlob(ev.id);
          const previewable = (contentType || '').startsWith('image/') || (contentType || '').startsWith('video/') || contentType === 'application/pdf';
          if (!previewable) return null;
          const objectUrl = URL.createObjectURL(blob);
          return [ev.id, { url: objectUrl, contentType }];
        } catch (_) {
          return null;
        }
      })
    );
    const mapped = {};
    entries.forEach((pair) => { if (pair) mapped[pair[0]] = pair[1]; });
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

  const handleOpenEvidence = async (evidence) => {
    try {
      const { blob, contentType, fileName } = await evidenceService.getEvidenceBlob(evidence.id);
      const objectUrl = URL.createObjectURL(blob);
      if (contentType.startsWith('image/') || contentType === 'application/pdf' || contentType.startsWith('video/')) {
        try {
          const viewer = window.open('', '_blank', 'noopener,noreferrer');
          if (viewer) {
            const safeTitle = (fileName || evidence.url_archivo || 'evidencia').replace(/[^a-z0-9_.-]/gi, '_');
            const isImg = contentType.startsWith('image/');
            const isVid = contentType.startsWith('video/');
            const isPdf = contentType === 'application/pdf';
            const html = `<!doctype html><html><head><meta charset="utf-8"><title>${safeTitle}</title></head>
              <body style="margin:0;background:#000;display:flex;align-items:center;justify-content:center;height:100vh;">
                ${isImg ? `<img src="${objectUrl}" style="max-width:100%;max-height:100%;object-fit:contain;" />` : ''}
                ${isVid ? `<video src="${objectUrl}" style="width:100%;height:100%;object-fit:contain;background:#000;" controls autoplay></video>` : ''}
                ${isPdf ? `<embed src="${objectUrl}" type="application/pdf" style="width:100%;height:100%;" />` : ''}
              </body></html>`;
            viewer.document.open();
            viewer.document.write(html);
            viewer.document.close();
            viewer.addEventListener('beforeunload', () => { try { URL.revokeObjectURL(objectUrl); } catch(_){} });
          } else {
            const a = document.createElement('a');
            a.href = objectUrl;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
          }
        } catch (_) {
          setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
        }
      } else {
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = fileName || evidence.url_archivo || 'evidencia';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
      }
    } catch (err) {
      alert('No se pudo abrir la evidencia: ' + (err.message || 'Error desconocido'));
    }
  };

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
                    src={`${API_BASE_URL}/api/evidencias/${evidencia.id}?token=${encodeURIComponent(localStorage.getItem('token') || '')}`}
                    alt={`Evidencia ${index + 1}`}
                    className="w-full h-full object-contain rounded-t-xl"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
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
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleOpenEvidence(evidencia)}
                      className="text-white bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded text-xs transition-colors"
                    >
                      Ver
                    </button>
                    <button 
                      onClick={() => handleDownloadReportAsPdf(evidencia)}
                      className="text-white bg-emerald-700 hover:bg-emerald-600 px-3 py-1.5 rounded text-xs transition-colors"
                    >
                      PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Descargar información del reporte e incrustar la primera imagen disponible
  const handleDownloadReportInfoPdf = async () => {
    try {
      if (!report) return;
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const margin = 40;
      let y = margin;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const writeLine = (text, opts = {}) => {
        const maxWidth = 515; // 595 - 2*40
        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach((line) => { doc.text(line, margin, y, opts); y += 16; });
      };

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

      const addField = (label, value) => {
        if (!value) return;
        writeLine(`${label}: ${value}`);
      };

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
      writeLine('Evidencias (nombres)');
      doc.setFont('helvetica', 'normal');
      if (Array.isArray(report.evidencias) && report.evidencias.length > 0) {
        report.evidencias.forEach((ev, idx) => {
          writeLine(`${idx + 1}. ${ev.url_archivo || '(sin nombre)'} • ${ev.tipo_archivo || ''}`);
        });
      } else {
        writeLine('No hay evidencias adjuntas');
      }

      // Intentar incrustar todas las evidencias que sean imágenes (jpeg/png/webp/gif)
      if (Array.isArray(report.evidencias) && report.evidencias.length > 0) {
        const imageEvidencias = report.evidencias.filter(ev => {
          const t = (ev.tipo_archivo || '').toLowerCase();
          const n = (ev.url_archivo || '').toLowerCase();
          return t.startsWith('image/') || /\.(jpe?g|png|gif|webp)$/i.test(n);
        });

        if (imageEvidencias.length > 0) {
          doc.setFont('helvetica', 'bold');
          writeLine('Evidencias (imágenes)');
          doc.setFont('helvetica', 'normal');
          
          for (let i = 0; i < Math.min(imageEvidencias.length, 5); i++) { // Máximo 5 imágenes para evitar PDFs muy grandes
            const evidencia = imageEvidencias[i];
            try {
              const { blob, contentType } = await evidenceService.getEvidenceBlob(evidencia.id);
              const blobToDataUrl = (b) => new Promise((resolve, reject) => {
                try {
                  const fr = new FileReader();
                  fr.onerror = () => reject(new Error('No se pudo leer la evidencia'));
                  fr.onload = () => resolve(fr.result);
                  fr.readAsDataURL(b);
                } catch (e) { reject(e); }
              });
              
              let dataUrl = await blobToDataUrl(blob);
              let imageFormat = (contentType && contentType.includes('png')) ? 'PNG' : 'JPEG';
              if (!contentType || (!contentType.includes('jpeg') && !contentType.includes('png'))) {
                // Convertir formatos no soportados nativamente (ej. webp) a JPEG
                const imgTmp = new Image();
                await new Promise((r) => { imgTmp.onload = r; imgTmp.src = dataUrl; });
                const canvas = document.createElement('canvas');
                canvas.width = imgTmp.width;
                canvas.height = imgTmp.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(imgTmp, 0, 0);
                dataUrl = canvas.toDataURL('image/jpeg', 0.92);
                imageFormat = 'JPEG';
              }

              // Añadir salto si no hay espacio razonable
              y += 12;
              if (y + 150 > pageHeight - margin) {
                doc.addPage();
                y = margin;
              }

              // Calcular tamaño manteniendo proporción
              const probe = new Image();
              await new Promise((r) => { probe.onload = r; probe.src = dataUrl; });
              const maxW = pageWidth - margin * 2;
              const maxH = Math.min(300, pageHeight - margin - y - 50); // Máximo 300pt de altura por imagen
              const scale = Math.min(maxW / probe.width, maxH / probe.height, 1);
              const drawW = Math.max(50, probe.width * scale);
              const drawH = Math.max(50, probe.height * scale);

              // Título de la imagen
              doc.setFont('helvetica', 'bold');
              doc.setFontSize(10);
              writeLine(`Imagen ${i + 1}: ${evidencia.url_archivo || 'Sin nombre'}`);
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(11);
              
              doc.addImage(dataUrl, imageFormat, margin, y + 6, drawW, drawH);
              y += drawH + 20;
              
            } catch (_) {
              // Si falla una imagen, continuar con la siguiente
              writeLine(`Imagen ${i + 1}: Error al cargar - ${evidencia.url_archivo || 'Sin nombre'}`);
              y += 16;
            }
          }
          
          if (imageEvidencias.length > 5) {
            writeLine(`... y ${imageEvidencias.length - 5} imágenes más`);
          }
        }
      }

      const safeName = String(report.asunto || report.asunto_conversacion || 'reporte')
        .replace(/[^a-z0-9_.-]/gi, '_');
      const pdfBlob = doc.output('blob');
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_${report.id || ''}_${safeName}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => window.URL.revokeObjectURL(url), 5000);
    } catch (e) {
      alert('No se pudo descargar el PDF del reporte');
    }
  };

  const handleDownloadReportAsPdf = async (evidence) => {
    try {
      const { blob, contentType, fileName } = await evidenceService.getEvidenceBlob(evidence.id);
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });

      // Encabezado
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Reporte HSEQ', 40, 40);

      // Metadatos
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      const meta = [
        `ID: ${report?.id ?? ''}`,
        `Tipo: ${report?.tipo_reporte ?? ''}`,
        `Usuario: ${report?.nombre_usuario ?? ''}`,
        `Estado: ${report?.estado ?? ''}`,
        `Fecha evento: ${report?.fecha_evento ?? ''} ${report?.hora_evento ?? ''}`,
        `Título: ${report?.asunto || report?.asunto_conversacion || ''}`,
      ];
      let y = 65;
      meta.forEach((line) => { doc.text(line, 40, y); y += 16; });

      const margin = 40;
      const maxWidth = 515; // ancho útil en A4 a 72 dpi (595 total - márgenes)

      // Utilidad: blob -> dataURL
      const blobToDataUrl = (b) => new Promise((resolve, reject) => {
        try {
          const fr = new FileReader();
          fr.onerror = () => reject(new Error('No se pudo leer la evidencia'));
          fr.onload = () => resolve(fr.result);
          fr.readAsDataURL(b);
        } catch (e) { reject(e); }
      });

      try {
        if (contentType.startsWith('image/')) {
          let dataUrl = await blobToDataUrl(blob);
          let imageFormat = contentType.includes('png') ? 'PNG' : 'JPEG';
          if (!contentType.includes('jpeg') && !contentType.includes('png')) {
            const imgTmp = new Image();
            await new Promise((r) => { imgTmp.onload = r; imgTmp.src = dataUrl; });
            const canvas = document.createElement('canvas');
            canvas.width = imgTmp.width;
            canvas.height = imgTmp.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(imgTmp, 0, 0);
            dataUrl = canvas.toDataURL('image/jpeg', 0.92);
            imageFormat = 'JPEG';
          }

          const img = new Image();
          await new Promise((resolve) => { img.onload = resolve; img.src = dataUrl; });
          const scale = Math.min(maxWidth / img.width, 700 / img.height);
          const w = Math.min(maxWidth, img.width * scale);
          const h = img.height * (w / img.width);
          doc.addImage(dataUrl, imageFormat, margin, y + 10, w, h);
        } else if (contentType === 'application/pdf') {
          doc.text('Evidencia (PDF) adjunta por separado.', margin, y + 20);
        } else if (contentType.startsWith('video/')) {
          doc.text('Evidencia de video: no previsualizable en PDF. Se adjunta nombre de archivo.', margin, y + 20);
        } else {
          doc.text('Evidencia no soportada para incrustar en PDF.', margin, y + 20);
        }
      } catch (_) {
        doc.text('No se pudo incrustar la evidencia en el PDF.', margin, y + 20);
      }

      const safeName = (fileName || evidence.url_archivo || 'evidencia').replace(/[^a-z0-9_.-]/gi, '_');
      // Forzar descarga explícitamente usando blob del PDF (más compatible)
      const pdfBlob = doc.output('blob');
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_${report?.id || ''}_${safeName}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => window.URL.revokeObjectURL(url), 5000);
    } catch (err) {
      alert('No se pudo generar el PDF: ' + (err.message || 'Error desconocido'));
    }
  };

  // Descargar todas las evidencias como ZIP
  const handleDownloadAllEvidence = async () => {
    if (!report?.evidencias || report.evidencias.length === 0) {
      alert('No hay evidencias para descargar');
      return;
    }

    try {
      // Importar JSZip dinámicamente
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Crear carpeta para el reporte
      const reportFolder = zip.folder(`reporte_${report.id}`);

      // Agregar archivo de información del reporte
      const reportInfo = {
        id: report.id,
        tipo_reporte: report.tipo_reporte,
        asunto: report.asunto || report.asunto_conversacion,
        estado: report.estado,
        nombre_usuario: report.nombre_usuario,
        fecha_evento: report.fecha_evento,
        hora_evento: report.hora_evento,
        creado_en: report.creado_en,
        descripcion: getDescriptionText(report)
      };

      reportFolder.file('informacion_reporte.json', JSON.stringify(reportInfo, null, 2));

      // Descargar y agregar cada evidencia
      for (let i = 0; i < report.evidencias.length; i++) {
        const evidencia = report.evidencias[i];
        try {
          const { blob, fileName } = await evidenceService.getEvidenceBlob(evidencia.id);
          const safeFileName = (fileName || evidencia.url_archivo || `evidencia_${i + 1}`).replace(/[^a-z0-9_.-]/gi, '_');
          reportFolder.file(safeFileName, blob);
        } catch (error) {
          console.error(`Error al descargar evidencia ${i + 1}:`, error);
          // Continuar con las siguientes evidencias
        }
      }

      // Generar y descargar el ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_${report.id}_evidencias.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (error) {
      alert('Error al crear el archivo ZIP: ' + error.message);
    }
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
                    {report?.evidencias && report.evidencias.length > 0 && (
                      <button 
                        onClick={handleDownloadAllEvidence} 
                        className="text-white bg-purple-600 hover:bg-purple-500 px-3 py-2 rounded text-sm transition-colors"
                      >
                        Descargar Todas (ZIP)
                      </button>
                    )}
                    <button 
                      onClick={() => handleDownloadReportInfoPdf()} 
                      className="text-white bg-emerald-700 hover:bg-emerald-600 px-3 py-2 rounded text-sm transition-colors"
                    >
                      Descargar Reporte (PDF)
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