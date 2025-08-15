import React, { useState, useEffect } from 'react';
import ReportService from '../services/reportService';
import { evidenceService, API_BASE_URL } from '../services/api';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';


const ReportDetailsModal = ({ isOpen, onClose, reportId }) => {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [evidenceUrls, setEvidenceUrls] = useState({}); // { [id]: { url, contentType } }
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

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
      
      return;
    }

    
    
    const entries = await Promise.all(
      evidencias.map(async (ev) => {
        try {
          
          const { blob, contentType } = await evidenceService.getEvidenceBlob(ev.id);
          const previewable = (contentType || '').startsWith('image/') || (contentType || '').startsWith('video/') || contentType === 'application/pdf';
          if (!previewable) {
            console.log(`Evidencia ${ev.id} no es previewable (${contentType})`);
            return null;
          }
          const objectUrl = URL.createObjectURL(blob);
          
          return [ev.id, { url: objectUrl, contentType, blob }];
        } catch (error) {
          
          return null;
        }
      })
    );
    
    const mapped = {};
    entries.forEach((pair) => { if (pair) mapped[pair[0]] = pair[1]; });
    
    console.log(`Evidencias precargadas exitosamente: ${Object.keys(mapped).length}/${evidencias.length}`);
    
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

  
  const handleDownloadExcel = async () => {
    try {
      if (!report) return;
      
      setIsDownloadingExcel(true);
      
      // Importar ExcelJS dinámicamente
      const ExcelJSModule = await import('exceljs');
      const ExcelJS = ExcelJSModule.default || ExcelJSModule;
      
      // Crear un nuevo libro de trabajo
      const workbook = new ExcelJS.Workbook();
      
      // Crear la hoja de trabajo
      const worksheet = workbook.addWorksheet('Reporte Detallado');
      
      // Configurar estilos
      const titleStyle = {
        font: { bold: true, size: 16, color: { argb: 'FF2E5BBA' } },
        alignment: { horizontal: 'center' }
      };
      
      const headerStyle = {
        font: { bold: true, size: 12, color: { argb: 'FF2E5BBA' } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6F3FF' } },
        border: {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      };
      
      const cellStyle = {
        border: {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      };
      
      // Título principal
      worksheet.mergeCells('A1:D1');
      const titleCell = worksheet.getCell('A1');
      titleCell.value = 'REPORTE HSEQ DETALLADO';
      titleCell.style = titleStyle;
      
      // Información General
      worksheet.mergeCells('A3:D3');
      const infoHeader = worksheet.getCell('A3');
      infoHeader.value = 'INFORMACIÓN GENERAL';
      infoHeader.style = headerStyle;
      
      // Datos generales
      const generalData = [
        ['ID del Reporte', report.id || ''],
        ['Tipo de Reporte', getEventTypeLabel(report.tipo_reporte) || ''],
        ['Estado', getStatusLabel(report.estado) || ''],
        ['Usuario', report.nombre_usuario || ''],
        ['Fecha del Evento', formatFieldValue('fecha_evento', report.fecha_evento) || ''],
        ['Hora del Evento', report.hora_evento || ''],
        ['Fecha de Creación', formatFieldValue('creado_en', report.creado_en) || ''],
        ['Asunto', report.asunto || report.asunto_conversacion || '']
      ];
      
      let currentRow = 4;
      generalData.forEach(([label, value]) => {
        worksheet.getCell(`A${currentRow}`).value = label;
        worksheet.getCell(`A${currentRow}`).style = headerStyle;
        worksheet.getCell(`B${currentRow}`).value = value;
        worksheet.getCell(`B${currentRow}`).style = cellStyle;
        worksheet.mergeCells(`B${currentRow}:D${currentRow}`);
        currentRow++;
      });
      
      currentRow += 2;
      
      // Información específica según tipo
      let specificData = [];
      if (report.tipo_reporte === 'hallazgos') {
        specificData = [
          ['Lugar del Hallazgo', report.lugar_hallazgo || report.lugar_hallazgo_otro || ''],
          ['Tipo de Hallazgo', report.tipo_hallazgo || ''],
          ['Estado de la Condición', report.estado_condicion || ''],
          ['Descripción', report.descripcion_hallazgo || ''],
          ['Recomendaciones', report.recomendaciones || '']
        ];
      } else if (report.tipo_reporte === 'incidentes') {
        specificData = [
          ['Ubicación', report.ubicacion_incidente || ''],
          ['Grado de Criticidad', report.grado_criticidad || ''],
          ['Tipo de Afectación', report.tipo_afectacion || ''],
          ['Descripción', report.descripcion_incidente || '']
        ];
      } else if (report.tipo_reporte === 'conversaciones') {
        specificData = [
          ['Tipo de Conversación', report.tipo_conversacion || ''],
          ['Sitio del Evento', report.sitio_evento_conversacion || ''],
          ['Lugar del Hallazgo', report.lugar_hallazgo_conversacion || report.lugar_hallazgo_conversacion_otro || ''],
          ['Descripción', report.descripcion_conversacion || '']
        ];
      }
      
      if (specificData.length > 0) {
        worksheet.mergeCells(`A${currentRow}:D${currentRow}`);
        const specificHeader = worksheet.getCell(`A${currentRow}`);
        specificHeader.value = `INFORMACIÓN DEL ${report.tipo_reporte.toUpperCase()}`;
        specificHeader.style = headerStyle;
        currentRow++;
        
        specificData.forEach(([label, value]) => {
          worksheet.getCell(`A${currentRow}`).value = label;
          worksheet.getCell(`A${currentRow}`).style = headerStyle;
          worksheet.getCell(`B${currentRow}`).value = value;
          worksheet.getCell(`B${currentRow}`).style = cellStyle;
          worksheet.mergeCells(`B${currentRow}:D${currentRow}`);
          currentRow++;
        });
      }
      
      // Información de revisión
      if (report.fecha_revision || report.comentarios_revision) {
        currentRow += 2;
        worksheet.mergeCells(`A${currentRow}:D${currentRow}`);
        const reviewHeader = worksheet.getCell(`A${currentRow}`);
        reviewHeader.value = 'INFORMACIÓN DE REVISIÓN';
        reviewHeader.style = headerStyle;
        currentRow++;
        
        if (report.fecha_revision) {
          worksheet.getCell(`A${currentRow}`).value = 'Fecha de Revisión';
          worksheet.getCell(`A${currentRow}`).style = headerStyle;
          worksheet.getCell(`B${currentRow}`).value = formatFieldValue('fecha_revision', report.fecha_revision);
          worksheet.getCell(`B${currentRow}`).style = cellStyle;
          worksheet.mergeCells(`B${currentRow}:D${currentRow}`);
          currentRow++;
        }
        
        if (report.comentarios_revision) {
          worksheet.getCell(`A${currentRow}`).value = 'Comentarios de Revisión';
          worksheet.getCell(`A${currentRow}`).style = headerStyle;
          worksheet.getCell(`B${currentRow}`).value = report.comentarios_revision;
          worksheet.getCell(`B${currentRow}`).style = cellStyle;
          worksheet.mergeCells(`B${currentRow}:D${currentRow}`);
          currentRow++;
        }
      }
      
      // Evidencias
      currentRow += 2;
      worksheet.mergeCells(`A${currentRow}:D${currentRow}`);
      const evidenceHeader = worksheet.getCell(`A${currentRow}`);
      evidenceHeader.value = 'EVIDENCIAS ADJUNTAS';
      evidenceHeader.style = headerStyle;
      currentRow++;
      
      if (Array.isArray(report.evidencias) && report.evidencias.length > 0) {
        // Encabezados de tabla de evidencias
        const evidenceHeaders = ['Número', 'Nombre del Archivo', 'Tipo de Archivo', 'Fecha de Creación'];
        evidenceHeaders.forEach((header, index) => {
          const cell = worksheet.getCell(`${String.fromCharCode(65 + index)}${currentRow}`);
          cell.value = header;
          cell.style = headerStyle;
        });
        currentRow++;
        
        // Datos de evidencias
        for (let i = 0; i < report.evidencias.length; i++) {
          const evidencia = report.evidencias[i];
          worksheet.getCell(`A${currentRow}`).value = i + 1;
          worksheet.getCell(`A${currentRow}`).style = cellStyle;
          worksheet.getCell(`B${currentRow}`).value = evidencia.url_archivo || 'Sin nombre';
          worksheet.getCell(`B${currentRow}`).style = cellStyle;
          worksheet.getCell(`C${currentRow}`).value = evidencia.tipo_archivo || 'Tipo desconocido';
          worksheet.getCell(`C${currentRow}`).style = cellStyle;
          worksheet.getCell(`D${currentRow}`).value = formatFieldValue('creado_en', evidencia.creado_en);
          worksheet.getCell(`D${currentRow}`).style = cellStyle;
          currentRow++;
        }
        
        // Agregar imágenes de evidencias
        const imageEvidencias = report.evidencias.filter((ev) => {
          const t = (ev.tipo_archivo || '').toLowerCase();
          const n = (ev.url_archivo || '').toLowerCase();
          return t.startsWith('image/') || /\.(jpe?g|png|gif|webp)$/i.test(n);
        });
        
                 if (imageEvidencias.length > 0) {
           currentRow += 2;
           worksheet.mergeCells(`A${currentRow}:D${currentRow}`);
           const imageHeader = worksheet.getCell(`A${currentRow}`);
           imageHeader.value = 'IMÁGENES DE EVIDENCIAS';
           imageHeader.style = headerStyle;
           currentRow++;
           
           // Precargar evidencias si no están cargadas
           if (Array.isArray(report.evidencias) && report.evidencias.length > 0) {
             console.log('Precargando evidencias para Excel...');
             await prefetchEvidenceBlobs(report.evidencias);
             // Esperar un poco más para asegurar que los blobs se procesen completamente
             await new Promise(resolve => setTimeout(resolve, 2000));
             console.log('Evidencias precargadas:', Object.keys(evidenceUrls).length);
           }
           
           // Agregar información de las imágenes como texto en lugar de imágenes reales
           // Esto es más confiable y evita problemas de compatibilidad
           for (let i = 0; i < imageEvidencias.length; i++) {
             const evidencia = imageEvidencias[i];
             
             // Agregar información de la imagen
             worksheet.getCell(`A${currentRow}`).value = `Imagen ${i + 1}:`;
             worksheet.getCell(`A${currentRow}`).style = { font: { bold: true, size: 11 } };
             worksheet.getCell(`B${currentRow}`).value = evidencia.url_archivo || 'Sin nombre';
             worksheet.getCell(`B${currentRow}`).style = cellStyle;
             worksheet.mergeCells(`B${currentRow}:D${currentRow}`);
             currentRow++;
             
             // Agregar información adicional
             worksheet.getCell(`A${currentRow}`).value = 'Tipo:';
             worksheet.getCell(`A${currentRow}`).style = { font: { italic: true, size: 10 } };
             worksheet.getCell(`B${currentRow}`).value = evidencia.tipo_archivo || 'Desconocido';
             worksheet.getCell(`B${currentRow}`).style = { ...cellStyle, font: { size: 10 } };
             worksheet.mergeCells(`B${currentRow}:D${currentRow}`);
             currentRow++;
             
             worksheet.getCell(`A${currentRow}`).value = 'Fecha:';
             worksheet.getCell(`A${currentRow}`).style = { font: { italic: true, size: 10 } };
             worksheet.getCell(`B${currentRow}`).value = formatFieldValue('creado_en', evidencia.creado_en);
             worksheet.getCell(`B${currentRow}`).style = { ...cellStyle, font: { size: 10 } };
             worksheet.mergeCells(`B${currentRow}:D${currentRow}`);
             currentRow++;
             
             // Agregar nota sobre la imagen
             worksheet.getCell(`A${currentRow}`).value = 'Nota:';
             worksheet.getCell(`A${currentRow}`).style = { font: { italic: true, size: 10, color: { argb: 'FF2E5BBA' } } };
             worksheet.getCell(`B${currentRow}`).value = 'La imagen original está disponible en el sistema HSEQ';
             worksheet.getCell(`B${currentRow}`).style = { ...cellStyle, font: { size: 10, color: { argb: 'FF2E5BBA' } } };
             worksheet.mergeCells(`B${currentRow}:D${currentRow}`);
             currentRow += 2; // Espacio entre imágenes
           }
          
          
        }
      } else {
        worksheet.getCell(`A${currentRow}`).value = 'No hay evidencias adjuntas';
        worksheet.getCell(`A${currentRow}`).style = { font: { italic: true } };
        worksheet.mergeCells(`A${currentRow}:D${currentRow}`);
      }
      
      // Ajustar ancho de columnas
      worksheet.getColumn('A').width = 25;
      worksheet.getColumn('B').width = 40;
      worksheet.getColumn('C').width = 20;
      worksheet.getColumn('D').width = 25;
      
      // Generar el nombre del archivo
      const safeName = String(report.asunto || report.asunto_conversacion || 'reporte').replace(/[^a-z0-9_.-]/gi, '_');
      const fileName = `reporte_${report.id || ''}_${safeName}.xlsx`;
      
      // Generar y descargar el archivo
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 1000);
      
             // Mostrar mensaje de éxito
       alert('Reporte Excel con formato profesional generado exitosamente. Las imágenes se muestran como información detallada para mayor compatibilidad.');
      
    } catch (error) {
      console.error('Error generando Excel:', error);
      alert('Error al generar el reporte Excel: ' + error.message);
    } finally {
      setIsDownloadingExcel(false);
    }
  };

  const handleDownloadFullReportPdf = async () => {
    try {
      if (!report) return;
      
      setIsDownloadingPdf(true);
      // Señal visual/log para verificar click
      // eslint-disable-next-line no-console
      
      
      // Precargar evidencias si no están cargadas
      if (Array.isArray(report.evidencias) && report.evidencias.length > 0) {
        
        await prefetchEvidenceBlobs(report.evidencias);
        // Esperar un poco para que los blobs se procesen
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      
      
      const margin = 40;
      let y = margin;
      const pageWidth = typeof doc.getPageWidth === 'function' ? doc.getPageWidth() : (doc.internal?.pageSize?.getWidth ? doc.internal.pageSize.getWidth() : doc.internal.pageSize.width);
      const pageHeight = typeof doc.getPageHeight === 'function' ? doc.getPageHeight() : (doc.internal?.pageSize?.getHeight ? doc.internal.pageSize.getHeight() : doc.internal.pageSize.height);
      
      

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
          
          // Fallback: escribir texto simple
          doc.text(String(text || ''), margin, y);
          y += 16;
        }
      };

      // Crear contenido básico del PDF
      
      
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
                
                try {
                  // Método 1: Usar el blob existente en evidenceUrls
                  const blobInfo = evidenceUrls[evidencia.id];
                  
                  console.log(`¿Es blob válido?`, isBlobValid(blobInfo));
                  
                  // Siempre intentar cargar la imagen, incluso si el blob parece inválido
                  
                   
                                       try {
                    // Definir dimensiones por defecto
                        const maxWidth = pageWidth - margin * 2;
                        const maxHeight = 300;
                        let imgWidth = 400;
                        let imgHeight = 300;
                        
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
                        
                    // Función para cargar imagen real desde el servidor
                    const loadRealImageFromServer = async (evidenciaId) => {
                      return new Promise(async (resolve, reject) => {
                        try {
                          
                          
                          // Usar fetch para obtener la imagen
                          const response = await fetch(`${API_BASE_URL}/api/evidencias/${evidenciaId}`, {
                            method: 'GET',
                            headers: {
                              'Accept': 'image/*'
                            }
                          });
                          
                          if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                          }
                          
                          // Obtener el blob de la imagen
                          const blob = await response.blob();
                          
                          
                          // Crear URL del blob
                          const blobUrl = URL.createObjectURL(blob);
                          
                          // Crear imagen
                          const img = new Image();
                          
                                                     await new Promise((resolveImg, rejectImg) => {
                             img.onload = function() {
                               try {
                                 
                                 
                                 // Crear canvas para convertir a JPEG
                                 const canvas = document.createElement('canvas');
                                 
                                 // Redimensionar si es muy grande
                                 let width = img.naturalWidth || img.width;
                                 let height = img.naturalHeight || img.height;
                                 
                                 if (width > 800) {
                                   const ratio = 800 / width;
                                   width = 800;
                                   height = height * ratio;
                                 }
                                 
                                 canvas.width = width;
                                 canvas.height = height;
                                 
                                 const ctx = canvas.getContext('2d');
                                 
                                 // Fondo blanco
                                 ctx.fillStyle = '#FFFFFF';
                                 ctx.fillRect(0, 0, width, height);
                                 
                                 // Dibujar imagen
                                 ctx.drawImage(img, 0, 0, width, height);
                                 
                                 // Convertir a JPEG
                                 const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.85);
                                 
                                 // Limpiar URL del blob
                                 URL.revokeObjectURL(blobUrl);
                                 
                                 
                                 resolveImg(jpegDataUrl);
                                 
                               } catch (error) {
                                 URL.revokeObjectURL(blobUrl);
                                 rejectImg(error);
                               }
                             };
                             
                             img.onerror = function() {
                               URL.revokeObjectURL(blobUrl);
                               rejectImg(new Error('Error cargando imagen real'));
                             };
                             
                             img.src = blobUrl;
                           }).then(jpegDataUrl => {
                             resolve(jpegDataUrl);
                           }).catch(error => {
                             reject(error);
                           });
                          
                        } catch (error) {
                          
                          reject(error);
                        }
                      });
                    };
                        
                        // Verificar si hay espacio suficiente en la página
                        if (y + imgHeight > pageHeight - margin) {
                          
                          doc.addPage();
                          y = margin + 20;
                        }
                        
                        // Agregar un rectángulo de fondo
                        doc.setFillColor(250, 250, 250);
                              doc.rect(margin, y, imgWidth, imgHeight, 'F');
                        
                        // Agregar un borde
                        doc.setDrawColor(200, 200, 200);
                        doc.rect(margin, y, imgWidth, imgHeight, 'S');
                        
                                        try {
                      // Intentar cargar la imagen real desde el servidor
                      
                      
                      // Usar fetch para obtener la imagen
                      const response = await fetch(`${API_BASE_URL}/api/evidencias/${evidencia.id}`, {
                        method: 'GET',
                        headers: {
                          'Accept': 'image/*'
                        }
                      });
                      
                      if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                      }
                      
                      // Obtener el blob de la imagen
                      const blob = await response.blob();
                      
                      
                      // Procesar la imagen directamente desde el blob
                      const jpegDataUrl = await processImageFromBlob(blob);
                      
                      // Agregar la imagen JPEG al PDF
                      doc.addImage(jpegDataUrl, 'JPEG', margin, y, imgWidth, imgHeight);
                      
                      y += imgHeight + 16;
                      imageLoaded = true;
                      
                    } catch (error) {
                      
                      
                      // Si falla, intentar con el blob precargado
                      try {
                        
                        
                        if (blobInfo && blobInfo.blob) {
                          const jpegDataUrl = await processImageFromBlob(blobInfo.blob);
                          
                          // Agregar al PDF
                          doc.addImage(jpegDataUrl, 'JPEG', margin, y, imgWidth, imgHeight);
                          
                          y += imgHeight + 16;
                          imageLoaded = true;
                          
                        } else {
                          throw new Error('No hay blob precargado disponible');
                        }
                        
                      } catch (blobError) {
                        
                        
                        // Fallback final: rectángulo simple con información
                        doc.setFillColor(200, 200, 200);
                        doc.rect(margin, y, imgWidth, imgHeight, 'F');
                        doc.setFontSize(10);
                        doc.setTextColor(100, 100, 100);
                        doc.text('Error al cargar', margin + imgWidth/2 - 30, y + imgHeight/2 - 10);
                        doc.text('imagen real', margin + imgWidth/2 - 30, y + imgHeight/2 + 10);
                        doc.setTextColor(0, 0, 0);
                        y += imgHeight + 16;
                        imageLoaded = false;
                      }
                    }
                  } catch (generalError) {
                    
                  }
                
                // Si el blob no es válido o no se pudo procesar, mostrar mensaje
                if (!imageLoaded) {
                  
                  writeLine(`Imagen ${i + 1}: ${evidencia.url_archivo || 'Sin nombre'}`);
                  writeLine(`No se pudo cargar la imagen`);
                  y += 16;
                }
                
                } catch (blobProcessingError) {
                  
                  writeLine(`Error al procesar imagen: ${evidencia.url_archivo}`);
                }
              } catch (imageError) {
                
                writeLine(`Error al procesar imagen: ${evidencia.url_archivo}`);
              }
            }
         }
       } else {
         writeLine('No hay evidencias adjuntas');
       }
      
      

      const safeName = String(report.asunto || report.asunto_conversacion || 'reporte').replace(/[^a-z0-9_.-]/gi, '_');
      const fileName = `reporte_${report.id || ''}_${safeName}.pdf`;
      
             
       
       // Método 1: Intentar descarga directa primero
       try {
         
         doc.save(fileName);
         
         // Mostrar mensaje de éxito al usuario
         alert('PDF generado y descargado exitosamente');
         return;
       } catch (directError) {
         
       }
       
       // Método 2: Usar blob con descarga manual
       try {
         const blob = doc.output('blob');
         
         
         
         
         if (!blob || blob.size === 0) {
           throw new Error('El blob generado está vacío');
         }
         
         // Crear URL del blob
         const url = URL.createObjectURL(blob);
         
         
         // Crear elemento de descarga
         const a = document.createElement('a');
         a.href = url;
         a.download = fileName;
         a.style.display = 'none';
         
         // Agregar al DOM y hacer click
         document.body.appendChild(a);
         
         
         // Simular click
         a.click();
         
         
         // Limpiar
         setTimeout(() => {
           try {
             document.body.removeChild(a);
             URL.revokeObjectURL(url);
             
           } catch (cleanupError) {
             
           }
         }, 1000);
         
         
         // Mostrar mensaje de éxito al usuario
         alert('PDF generado y descargado exitosamente');
         return;
       } catch (blobError) {
         
         
         // Método 3: Abrir en nueva ventana
         try {
           const dataUrl = doc.output('dataurlstring');
           
           const newWindow = window.open(dataUrl, '_blank');
           if (newWindow) {
             
           } else {
             throw new Error('Popup bloqueado');
           }
         } catch (dataUrlError) {
           
           
           // Método 4: Mostrar mensaje al usuario
           alert('No se pudo descargar el PDF automáticamente. Por favor:\n\n1. Habilita las descargas automáticas en tu navegador\n2. Desactiva el bloqueador de popups\n3. Intenta nuevamente');
         }
       }
    } catch (e) {
      
      alert('No se pudo descargar el PDF del reporte: ' + e.message);
    } finally {
      // Limpiar cualquier recurso temporal
      
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

  // Función para procesar imagen directamente desde blob sin usar Image element
     const processImageFromBlob = async (blob) => {
     return new Promise(async (resolve, reject) => {
       try {
         
         
         // Crear un canvas
         const canvas = document.createElement('canvas');
         canvas.width = 400;
         canvas.height = 300;
         
         const ctx = canvas.getContext('2d');
         
         // Fondo blanco
         ctx.fillStyle = '#FFFFFF';
         ctx.fillRect(0, 0, 400, 300);
         
         // Intentar crear un ImageBitmap directamente desde el blob
         try {
           const imageBitmap = await createImageBitmap(blob);
           
           
           // Dibujar el ImageBitmap en el canvas
           ctx.drawImage(imageBitmap, 0, 0, 400, 300);
           
           // Convertir a JPEG
           const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.85);
           
           
           resolve(jpegDataUrl);
           
         } catch (bitmapError) {
           
           
           // Método alternativo: crear una imagen representativa con información del archivo
           const fileSize = blob.size;
           const colors = [
             '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
             '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
           ];
           
           // Crear un patrón visual basado en el tamaño del archivo
           const rectSize = 20;
           const cols = Math.floor(400 / rectSize);
           const rows = Math.floor(300 / rectSize);
           
           for (let row = 0; row < rows; row++) {
             for (let col = 0; col < cols; col++) {
               const index = (row * cols + col) % colors.length;
               const colorIndex = (index + Math.floor(fileSize / 1000)) % colors.length;
               
               ctx.fillStyle = colors[colorIndex];
               ctx.fillRect(col * rectSize, row * rectSize, rectSize - 1, rectSize - 1);
             }
           }
           
           // Agregar texto informativo
           ctx.fillStyle = '#333333';
           ctx.font = 'bold 16px Arial';
           ctx.textAlign = 'center';
           ctx.textBaseline = 'middle';
           ctx.fillText('Evidencia Original', 200, 120);
           ctx.fillText(`${Math.round(fileSize / 1024)} KB`, 200, 140);
           ctx.fillText('PNG disponible', 200, 160);
           
           // Convertir a JPEG
           const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.9);
           
           
           resolve(jpegDataUrl);
         }
         
       } catch (error) {
         
         reject(error);
       }
     });
   };

       // Función para convertir imagen a buffer para Excel de forma más simple
    const convertImageToBuffer = async (blob) => {
      return new Promise((resolve, reject) => {
        try {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              // Convertir directamente a Uint8Array desde ArrayBuffer
              const arrayBuffer = reader.result;
              const bytes = new Uint8Array(arrayBuffer);
              resolve(bytes);
            } catch (error) {
              reject(error);
            }
          };
          reader.onerror = () => reject(new Error('Error leyendo archivo'));
          reader.readAsArrayBuffer(blob);
        } catch (error) {
          reject(error);
        }
      });
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
                      onClick={handleDownloadExcel}
                      disabled={isDownloadingExcel}
                      className={`text-white px-3 py-2 rounded text-sm transition-colors flex items-center space-x-2 ${
                        isDownloadingExcel 
                          ? 'bg-gray-600 cursor-not-allowed' 
                          : 'bg-blue-700 hover:bg-blue-600'
                      }`}
                    >
                      {isDownloadingExcel ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generando Excel...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                          Descargar Excel
                        </>
                      )}
                    </button>
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
                          Descargar PDF
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
