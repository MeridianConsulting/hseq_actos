import React, { useState, useEffect } from 'react';
import ReportService from '../services/reportService';
import { evidenceService } from '../services/api';
import { buildApi, buildUploadsUrl } from '../config/api';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { Document, Page, Text, View, StyleSheet, pdf, Image } from '@react-pdf/renderer';

// ===================== Estilos PDF =====================
const pdfStyles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontSize: 12,
  },
  header: {
    textAlign: 'center',
    marginBottom: 30,
    borderBottom: '2px solid #2e5bb8',
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e5bb8',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
    border: '1px solid #ddd',
    borderRadius: 5,
  },
  sectionHeader: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    fontSize: 14,
    fontWeight: 'bold',
    borderBottom: '1px solid #ddd',
  },
  sectionContent: {
    padding: 15,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    borderBottom: '1px solid #eee',
    paddingBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    width: '40%',
    color: '#333',
  },
  value: {
    width: '60%',
    color: '#666',
  },
  evidenceSection: {
    marginTop: 20,
  },
  evidenceItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  evidenceImage: {
    width: '100%',
    maxWidth: 400,
    height: 'auto',
    marginTop: 10,
    marginBottom: 10,
  },
  evidenceName: {
    fontSize: 11,
    color: '#666',
    marginBottom: 5,
  },
  noImageText: {
    fontSize: 10,
    color: '#999',
    fontStyle: 'italic',
  },
});

// ===================== Componente PDF =====================
const HseqReportDocument = ({ report, evidencias = [] }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.header}>
        <Text style={pdfStyles.title}>REPORTE HSEQ DETALLADO</Text>
        <Text style={pdfStyles.subtitle}>MERIDIAN CONSULTING LTDA</Text>
      </View>

      <View style={pdfStyles.section}>
        <View style={pdfStyles.sectionHeader}>
          <Text>INFORMACIÓN GENERAL</Text>
        </View>
        <View style={pdfStyles.sectionContent}>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>ID del Reporte:</Text>
            <Text style={pdfStyles.value}>{report.id || 'N/A'}</Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Tipo de Reporte:</Text>
            <Text style={pdfStyles.value}>{report.tipo_reporte || 'N/A'}</Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Usuario:</Text>
            <Text style={pdfStyles.value}>{report.nombre_usuario || 'N/A'}</Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Proyecto:</Text>
            <Text style={pdfStyles.value}>{report.proyecto_usuario || 'No asignado'}</Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Estado:</Text>
            <Text style={pdfStyles.value}>{report.estado || 'N/A'}</Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Fecha del Evento:</Text>
            <Text style={pdfStyles.value}>{report.fecha_evento || 'N/A'} {report.hora_evento || ''}</Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Fecha de Creación:</Text>
            <Text style={pdfStyles.value}>{report.creado_en || 'N/A'}</Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Asunto:</Text>
            <Text style={pdfStyles.value}>{report.asunto || report.asunto_conversacion || 'N/A'}</Text>
          </View>
        </View>
      </View>

      <View style={pdfStyles.section}>
        <View style={pdfStyles.sectionHeader}>
          <Text>DETALLES DEL REPORTE</Text>
        </View>
        <View style={pdfStyles.sectionContent}>
          {report.tipo_reporte === 'hallazgos' && (
            <>
              {report.lugar_hallazgo && (
                <View style={pdfStyles.row}>
                  <Text style={pdfStyles.label}>Lugar del Hallazgo:</Text>
                  <Text style={pdfStyles.value}>{report.lugar_hallazgo}</Text>
                </View>
              )}
              {report.tipo_hallazgo && (
                <View style={pdfStyles.row}>
                  <Text style={pdfStyles.label}>Tipo de Hallazgo:</Text>
                  <Text style={pdfStyles.value}>{report.tipo_hallazgo}</Text>
                </View>
              )}
              {report.estado_condicion && (
                <View style={pdfStyles.row}>
                  <Text style={pdfStyles.label}>Estado de la Condición:</Text>
                  <Text style={pdfStyles.value}>{report.estado_condicion}</Text>
                </View>
              )}
              {report.descripcion_hallazgo && (
                <View style={pdfStyles.row}>
                  <Text style={pdfStyles.label}>Descripción:</Text>
                  <Text style={pdfStyles.value}>{report.descripcion_hallazgo}</Text>
                </View>
              )}
              {report.recomendaciones && (
                <View style={pdfStyles.row}>
                  <Text style={pdfStyles.label}>Recomendaciones:</Text>
                  <Text style={pdfStyles.value}>{report.recomendaciones}</Text>
                </View>
              )}
            </>
          )}
          {report.tipo_reporte === 'incidentes' && (
            <>
              {report.ubicacion_incidente && (
                <View style={pdfStyles.row}>
                  <Text style={pdfStyles.label}>Ubicación:</Text>
                  <Text style={pdfStyles.value}>{report.ubicacion_incidente}</Text>
                </View>
              )}
              {report.grado_criticidad && (
                <View style={pdfStyles.row}>
                  <Text style={pdfStyles.label}>Grado de Criticidad:</Text>
                  <Text style={pdfStyles.value}>{report.grado_criticidad}</Text>
                </View>
              )}
              {report.tipo_afectacion && (
                <View style={pdfStyles.row}>
                  <Text style={pdfStyles.label}>Tipo de Afectación:</Text>
                  <Text style={pdfStyles.value}>{report.tipo_afectacion}</Text>
                </View>
              )}
              {report.descripcion_incidente && (
                <View style={pdfStyles.row}>
                  <Text style={pdfStyles.label}>Descripción:</Text>
                  <Text style={pdfStyles.value}>{report.descripcion_incidente}</Text>
                </View>
              )}
            </>
          )}
          {report.tipo_reporte === 'conversaciones' && (
            <>
              {report.tipo_conversacion && (
                <View style={pdfStyles.row}>
                  <Text style={pdfStyles.label}>Tipo de Conversación:</Text>
                  <Text style={pdfStyles.value}>{report.tipo_conversacion}</Text>
                </View>
              )}
              {report.sitio_evento_conversacion && (
                <View style={pdfStyles.row}>
                  <Text style={pdfStyles.label}>Sitio del Evento:</Text>
                  <Text style={pdfStyles.value}>{report.sitio_evento_conversacion}</Text>
                </View>
              )}
              {report.descripcion_conversacion && (
                <View style={pdfStyles.row}>
                  <Text style={pdfStyles.label}>Descripción:</Text>
                  <Text style={pdfStyles.value}>{report.descripcion_conversacion}</Text>
                </View>
              )}
            </>
          )}
          {report.tipo_reporte === 'pqr' && (
            <>
              {report.tipo_pqr && (
                <View style={pdfStyles.row}>
                  <Text style={pdfStyles.label}>Tipo de PQR:</Text>
                  <Text style={pdfStyles.value}>{report.tipo_pqr}</Text>
                </View>
              )}
              {report.telefono_contacto && (
                <View style={pdfStyles.row}>
                  <Text style={pdfStyles.label}>Teléfono de Contacto:</Text>
                  <Text style={pdfStyles.value}>{report.telefono_contacto}</Text>
                </View>
              )}
              {report.correo_contacto && (
                <View style={pdfStyles.row}>
                  <Text style={pdfStyles.label}>Correo de Contacto:</Text>
                  <Text style={pdfStyles.value}>{report.correo_contacto}</Text>
                </View>
              )}
              {report.descripcion_hallazgo && (
                <View style={pdfStyles.row}>
                  <Text style={pdfStyles.label}>Descripción:</Text>
                  <Text style={pdfStyles.value}>{report.descripcion_hallazgo}</Text>
                </View>
              )}
            </>
          )}
        </View>
      </View>

      {evidencias && evidencias.length > 0 && (
        <View style={pdfStyles.section}>
          <View style={pdfStyles.sectionHeader}>
            <Text>EVIDENCIAS ({evidencias.length})</Text>
          </View>
          <View style={pdfStyles.sectionContent}>
            {evidencias.map((evidencia, index) => (
              <View key={index} style={pdfStyles.evidenceItem}>
                <Text style={pdfStyles.evidenceName}>
                  Evidencia {index + 1}: {evidencia.nombre_archivo || 'Sin nombre'}
                </Text>
                {evidencia.imageDataUrl ? (
                  <Image 
                    src={evidencia.imageDataUrl} 
                    style={pdfStyles.evidenceImage}
                  />
                ) : (
                  <Text style={pdfStyles.noImageText}>
                    [Imagen no disponible]
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={pdfStyles.section}>
        <View style={pdfStyles.sectionHeader}>
          <Text>INFORMACIÓN ADICIONAL</Text>
        </View>
        <View style={pdfStyles.sectionContent}>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Sistema Generador:</Text>
            <Text style={pdfStyles.value}>Sistema HSEQ - Meridian Colombia</Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Fecha de Generación:</Text>
            <Text style={pdfStyles.value}>{new Date().toLocaleString('es-ES')}</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

// Valida si un blob es realmente una imagen (evita HTML/401)
const isProbablyImageBlob = async (blob) => {
  try {
    const buf = await blob.slice(0, 12).arrayBuffer();
    const b = new Uint8Array(buf);
    // JPEG
    if (b[0]===0xFF && b[1]===0xD8 && b[2]===0xFF) return true;
    // PNG
    if (b[0]===0x89 && b[1]===0x50 && b[2]===0x4E && b[3]===0x47) return true;
    // GIF
    if (b[0]===0x47 && b[1]===0x49 && b[2]===0x46) return true;
    // WEBP (RIFF....WEBP)
    if (b[0]===0x52 && b[1]===0x49 && b[2]===0x46 && b[3]===0x46 && b[8]===0x57 && b[9]===0x45 && b[10]===0x42 && b[11]===0x50) return true;
  } catch {}
  return false;
};

// Mapea extensión -> mime de imagen
const extToMime = (name='') => {
  const ext = String(name).toLowerCase().split('.').pop();
  const map = { jpg:'image/jpeg', jpeg:'image/jpeg', png:'image/png', gif:'image/gif', webp:'image/webp', bmp:'image/bmp' };
  return map[ext] || '';
};

// Si el blob no declara image/*, fuerzo el tipo según la extensión del archivo
const coerceImageBlobType = (blob, evObj) => {
  const mime = (blob?.type || '').toLowerCase();
  if (mime.startsWith('image/')) return blob;
  const forced = extToMime(evObj?.url_archivo || '');
  return forced ? new Blob([blob], { type: forced }) : blob;
};

// Endpoint API autenticado (misma app) para esquivar CORS del público
const fetchApiImageBlob = async (id) => {
  const token = localStorage.getItem('token') || '';

  // 1) Authorization header
  let resp = await fetch(buildApi(`evidencias/${id}`), {
    method: 'GET',
    headers: { 'Accept': 'image/*', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
    credentials: 'include',
  });
  if (resp.ok) return await resp.blob();

  // 2) Fallback con ?token=
  resp = await fetch(buildApi(`evidencias/${id}?token=${encodeURIComponent(token)}`), {
    method: 'GET',
    headers: { 'Accept': 'image/*' },
    credentials: 'include',
  });
  if (!resp.ok) throw new Error(`API HTTP ${resp.status}`);
  return await resp.blob();
};

// Convierte un Blob de imagen (png/jpg/webp/gif, etc.) a JPEG DataURL y devuelve tamaño real reescalado
const rasterizeBlobToJPEG = async (blob, maxW = 1024, maxH = 768, quality = 0.9) => {
  // 1) Intentar con ImageBitmap (rápido y sin CORS para blobs propios)
  const draw = async (source, naturalW, naturalH) => {
    const ratio = Math.min(maxW / naturalW, maxH / naturalH, 1);
    const w = Math.max(1, Math.round(naturalW * ratio));
    const h = Math.max(1, Math.round(naturalH * ratio));
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d', { alpha: false });
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, w, h);
    ctx.drawImage(source, 0, 0, w, h);
    const dataUrl = canvas.toDataURL('image/jpeg', quality);
    return { dataUrl, width: w, height: h };
  };

  try {
    const bmp = await createImageBitmap(blob);
    const out = await draw(bmp, bmp.width, bmp.height);
    bmp.close?.();
    return out;
  } catch {
    // 2) Fallback con <img>
    const url = URL.createObjectURL(blob);
    try {
      const img = await new Promise((res, rej) => {
        const _img = new Image();
        _img.onload = () => res(_img);
        _img.onerror = rej;
        _img.src = url;
      });
      const out = await draw(img, img.naturalWidth || img.width, img.naturalHeight || img.height);
      URL.revokeObjectURL(url);
      return out;
    } catch (e) {
      URL.revokeObjectURL(url);
      throw e;
    }
  }
};

// Obtiene blob de evidencia (usa el cache de evidenceUrls si existe)
const getEvidenceBlob = async (evidenciaId, evidenceUrls, evidenceService, evObj) => {
  const cached = evidenceUrls?.[evidenciaId];
  if (cached?.blob) {
    if (await isProbablyImageBlob(cached.blob)) {
      return { blob: cached.blob, contentType: cached.contentType || '' };
    }
    // blob malo en caché → ignorar y seguir
  }

  // 1) Intento URL pública (ya sabemos que funciona)
  try {
    const url = resolveEvidenceUrl(evObj);
    const resp = await fetch(url, { method: 'GET', headers: { 'Accept': 'image/*' }, mode: 'cors' });
    if (resp.ok) {
      let pubBlob = await resp.blob();
      pubBlob = coerceImageBlobType(pubBlob, evObj);
      if (await isProbablyImageBlob(pubBlob)) {
        return { blob: pubBlob, contentType: pubBlob.type || '' };
      }
    }
  } catch (_) {}

  // 2) Intento service
  try {
    const { blob, contentType } = await evidenceService.getEvidenceBlob(evidenciaId);
    let out = coerceImageBlobType(blob, evObj);
    if (!(await isProbablyImageBlob(out))) {
      out = coerceImageBlobType(await fetchApiImageBlob(evidenciaId), evObj);
    }
    if (!(await isProbablyImageBlob(out))) throw new Error('not-image');
    return { blob: out, contentType: out.type || contentType || '' };
  } catch (e1) {
    // 3) Intento API directo
    try {
      let apiBlob = coerceImageBlobType(await fetchApiImageBlob(evidenciaId), evObj);
      if (!(await isProbablyImageBlob(apiBlob))) throw new Error('not-image');
      return { blob: apiBlob, contentType: apiBlob.type || '' };
    } catch (e2) {
      // 4) Último recurso: URL público sin validación
      const url = resolveEvidenceUrl(evObj);
      const resp = await fetch(url, { method: 'GET', headers: { 'Accept': 'image/*' } });
      if (!resp.ok) throw new Error(`Public HTTP ${resp.status}`);
      const pubBlob = coerceImageBlobType(await resp.blob(), evObj);
      return { blob: pubBlob, contentType: pubBlob.type || '' };
    }
  }
};

// Azúcar: devuelve {dataUrl,width,height} listo para PDF/Excel (fuerza JPEG)
const getImageForExport = async (evidencia, { maxW = 1100, maxH = 700 } = {}, deps) => {
  const { evidenceUrls, evidenceService } = deps;
  const { blob } = await getEvidenceBlob(evidencia.id, evidenceUrls, evidenceService, evidencia);
  return rasterizeBlobToJPEG(blob, maxW, maxH);
};

// Utilidad para ExcelJS: extraer la parte base64 de un dataURL
const dataUrlToBase64 = (dataUrl) => dataUrl.split(',')[1] || '';

// Devuelve URL absoluta válida sin doble-prefijo
const resolveEvidenceUrl = (ev) => {
  const raw = String(ev?.url_archivo || '').trim();
  if (/^https?:\/\//i.test(raw)) return raw;            // ya es absoluta
  return buildUploadsUrl(raw);
};

// Detecta si la evidencia es imagen usando (1) cache de blobs, (2) tipo declarado, (3) extensión
const isImageEvidence = (ev, evidenceUrls) => {
  const ct = (evidenceUrls?.[ev.id]?.contentType || ev.tipo_archivo || '').toLowerCase();
  const name = String(ev.url_archivo || '').toLowerCase();
  return ct.startsWith('image/') || /\.(jpe?g|png|gif|webp|bmp)$/.test(name); // OJO: \. no \\.
};

// buildPublicImageUrl robusto (respeta absolutas)
const buildPublicImageUrl = (fileNameOrUrl) => {
  const s = String(fileNameOrUrl || '').trim();
  if (/^https?:\/\//i.test(s)) return s;
  return buildUploadsUrl(s);
};

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
           let out = coerceImageBlobType(blob, ev);
           const ct = (contentType || out.type || '').toLowerCase();
           const previewable = ct.startsWith('image/') || ct.startsWith('video/') || ct === 'application/pdf';
          if (!previewable) {
            return null;
          }
           const objectUrl = URL.createObjectURL(out);
          
           return [ev.id, { url: objectUrl, contentType: out.type || contentType, blob: out }];
        } catch (error) {
          
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
      <div className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 bg-white bg-opacity-5 rounded-lg">
        {icon && (
          <div className="flex-shrink-0 mt-1">
            <div className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400">
              {icon}
            </div>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <dt className="text-xs sm:text-sm font-medium text-white text-opacity-70 mb-1">
            {label}
          </dt>
          <dd className="text-white leading-relaxed text-sm sm:text-base">
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
      
      console.log('Iniciando generación de Excel con evidencias:', report.evidencias);
      
      // Importar ExcelJS dinámicamente
      const ExcelJSModule = await import('exceljs');
      const ExcelJS = ExcelJSModule.default || ExcelJSModule;
      
      // Crear un nuevo libro de trabajo
      const workbook = new ExcelJS.Workbook();
      
      // Crear la hoja de trabajo
      const worksheet = workbook.addWorksheet('Reporte Detallado');
      
      // Configurar estilos mejorados
      const titleStyle = {
        font: { bold: true, size: 18, color: { argb: 'FF2E5BBA' } },
        alignment: { horizontal: 'center', vertical: 'middle' },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F8FF' } }
      };
      
      const headerStyle = {
        font: { bold: true, size: 12, color: { argb: 'FFFFFFFF' } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2E5BBA' } },
        border: {
          top: { style: 'thin', color: { argb: 'FF1E3A8A' } },
          left: { style: 'thin', color: { argb: 'FF1E3A8A' } },
          bottom: { style: 'thin', color: { argb: 'FF1E3A8A' } },
          right: { style: 'thin', color: { argb: 'FF1E3A8A' } }
        },
        alignment: { vertical: 'middle' }
      };
      
      const cellStyle = {
        border: {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
        },
        alignment: { vertical: 'middle' }
      };
      
      const sectionHeaderStyle = {
        font: { bold: true, size: 14, color: { argb: 'FF2E5BBA' } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } },
        border: {
          top: { style: 'thin', color: { argb: 'FF2E5BBA' } },
          left: { style: 'thin', color: { argb: 'FF2E5BBA' } },
          bottom: { style: 'thin', color: { argb: 'FF2E5BBA' } },
          right: { style: 'thin', color: { argb: 'FF2E5BBA' } }
        },
        alignment: { vertical: 'middle' }
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
      infoHeader.style = sectionHeaderStyle;
      
      // Datos generales
      const generalData = [
        ['ID del Reporte', report.id || ''],
        ['Tipo de Reporte', getEventTypeLabel(report.tipo_reporte) || ''],
        ['Estado', getStatusLabel(report.estado) || ''],
        ['Usuario', report.nombre_usuario || ''],
        ['Proyecto', report.proyecto_usuario || 'No asignado'],
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
        specificHeader.style = sectionHeaderStyle;
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
        reviewHeader.style = sectionHeaderStyle;
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
      
      // SECCIÓN DE EVIDENCIAS CON IMÁGENES
      if (report.evidencias && report.evidencias.length > 0) {
        currentRow += 2;
        worksheet.mergeCells(`A${currentRow}:D${currentRow}`);
        const evidenceHeader = worksheet.getCell(`A${currentRow}`);
        evidenceHeader.value = `EVIDENCIAS (${report.evidencias.length})`;
        evidenceHeader.style = sectionHeaderStyle;
        currentRow++;
        
        console.log(`Procesando ${report.evidencias.length} evidencias para Excel...`);
        
        for (let index = 0; index < report.evidencias.length; index++) {
          const evidencia = report.evidencias[index];
          console.log('Procesando evidencia:', evidencia);
          
          // Verificar si es una imagen por tipo o extensión
          const esImagen = (evidencia.tipo_archivo && evidencia.tipo_archivo.startsWith('image/')) ||
                          /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(evidencia.url_archivo || evidencia.nombre_archivo || '');
          
          console.log('¿Es imagen?:', esImagen, 'Tipo:', evidencia.tipo_archivo);
          
          if (esImagen) {
            try {
              let imageDataUrl = null;
              
              // Estrategia 1: Usar el blob cache si está disponible
              const cached = evidenceUrls[evidencia.id];
              if (cached && cached.blob) {
                console.log('Usando blob del cache para evidencia', evidencia.id);
                
                if (await isProbablyImageBlob(cached.blob)) {
                  const reader = new FileReader();
                  imageDataUrl = await new Promise((resolve, reject) => {
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(cached.blob);
                  });
                  console.log('Imagen cargada desde cache para Excel:', evidencia.id);
                }
              }
              
              // Estrategia 2: Intentar cargar desde el servidor
              if (!imageDataUrl) {
                console.log('Cargando imagen desde servidor para evidencia', evidencia.id);
                try {
                  const { blob } = await getEvidenceBlob(
                    evidencia.id, 
                    evidenceUrls, 
                    evidenceService, 
                    evidencia
                  );
                  
                  if (blob && await isProbablyImageBlob(blob)) {
                    const reader = new FileReader();
                    imageDataUrl = await new Promise((resolve, reject) => {
                      reader.onloadend = () => resolve(reader.result);
                      reader.onerror = reject;
                      reader.readAsDataURL(blob);
                    });
                    console.log('Imagen cargada desde servidor para Excel:', evidencia.id);
                  }
                } catch (loadError) {
                  console.warn('Error al cargar imagen desde servidor:', loadError);
                }
              }
              
              // Estrategia 3: Intentar cargar directamente desde URL pública (con manejo de CORS)
              if (!imageDataUrl && evidencia.url_archivo) {
                console.log('Intentando cargar desde URL pública:', evidencia.url_archivo);
                try {
                  const publicUrl = buildUploadsUrl(evidencia.url_archivo);
                  const response = await fetch(publicUrl, {
                    mode: 'cors',
                    credentials: 'include',
                    headers: {
                      'Accept': 'image/*'
                    }
                  });
                  if (response.ok) {
                    const blob = await response.blob();
                    if (await isProbablyImageBlob(blob)) {
                      const reader = new FileReader();
                      imageDataUrl = await new Promise((resolve, reject) => {
                        reader.onloadend = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                      });
                      console.log('Imagen cargada desde URL pública para Excel:', evidencia.id);
                    }
                  }
                } catch (urlError) {
                  console.warn('Error al cargar desde URL pública (CORS bloqueado):', urlError.message);
                  // Intentar última estrategia: API autenticada
                  try {
                    const token = localStorage.getItem('token') || '';
                    const apiUrl = buildApi(`evidencias/${evidencia.id}`);
                    const apiResponse = await fetch(apiUrl, {
                      method: 'GET',
                      headers: {
                        'Accept': 'image/*',
                        'Authorization': `Bearer ${token}`
                      },
                      credentials: 'include'
                    });
                    if (apiResponse.ok) {
                      const apiBlob = await apiResponse.blob();
                      if (await isProbablyImageBlob(apiBlob)) {
                        const reader = new FileReader();
                        imageDataUrl = await new Promise((resolve, reject) => {
                          reader.onloadend = () => resolve(reader.result);
                          reader.onerror = reject;
                          reader.readAsDataURL(apiBlob);
                        });
                        console.log('Imagen cargada desde API autenticada para Excel:', evidencia.id);
                      }
                    }
                  } catch (apiError) {
                    console.warn('Error al cargar desde API autenticada:', apiError.message);
                  }
                }
              }
              
              if (imageDataUrl) {
                // Añadir imagen al Excel
                const imageId = workbook.addImage({
                  base64: dataUrlToBase64(imageDataUrl),
                  extension: evidencia.url_archivo?.split('.').pop()?.toLowerCase() || 'jpeg',
                });
                
                // Crear fila con información de la evidencia
                worksheet.getCell(`A${currentRow}`).value = `Evidencia ${index + 1}`;
                worksheet.getCell(`A${currentRow}`).style = headerStyle;
                worksheet.getCell(`B${currentRow}`).value = evidencia.nombre_archivo || evidencia.url_archivo || 'Sin nombre';
                worksheet.getCell(`B${currentRow}`).style = cellStyle;
                worksheet.mergeCells(`B${currentRow}:D${currentRow}`);
                currentRow++;
                
                // Ajustar altura de la fila para la imagen (más grande para mejor visualización)
                const imageRow = currentRow;
                worksheet.getRow(imageRow).height = 200; // Altura en píxeles
                
                // Insertar la imagen
                worksheet.addImage(imageId, {
                  tl: { col: 0.5, row: imageRow - 0.8 }, // Top-left position
                  br: { col: 3.5, row: imageRow + 0.2 }, // Bottom-right position
                  editAs: 'oneCell'
                });
                
                currentRow++;
                console.log('✓ Imagen agregada al Excel:', evidencia.id);
              } else {
                // Si no se pudo cargar la imagen, solo mostrar información
                worksheet.getCell(`A${currentRow}`).value = `Evidencia ${index + 1}`;
                worksheet.getCell(`A${currentRow}`).style = headerStyle;
                worksheet.getCell(`B${currentRow}`).value = `${evidencia.nombre_archivo || evidencia.url_archivo || 'Sin nombre'} (Imagen no disponible)`;
                worksheet.getCell(`B${currentRow}`).style = cellStyle;
                worksheet.mergeCells(`B${currentRow}:D${currentRow}`);
                currentRow++;
                console.warn('✗ Imagen no disponible para Excel:', evidencia.id);
              }
            } catch (error) {
              console.error(`Error al procesar imagen ${evidencia.id} para Excel:`, error);
              // Agregar fila con error
              worksheet.getCell(`A${currentRow}`).value = `Evidencia ${index + 1}`;
              worksheet.getCell(`A${currentRow}`).style = headerStyle;
              worksheet.getCell(`B${currentRow}`).value = `${evidencia.nombre_archivo || 'Sin nombre'} (Error al cargar)`;
              worksheet.getCell(`B${currentRow}`).style = cellStyle;
              worksheet.mergeCells(`B${currentRow}:D${currentRow}`);
              currentRow++;
            }
          } else {
            // No es imagen, solo mostrar información del archivo
            worksheet.getCell(`A${currentRow}`).value = `Evidencia ${index + 1}`;
            worksheet.getCell(`A${currentRow}`).style = headerStyle;
            worksheet.getCell(`B${currentRow}`).value = evidencia.nombre_archivo || evidencia.url_archivo || 'Sin nombre';
            worksheet.getCell(`B${currentRow}`).style = cellStyle;
            worksheet.mergeCells(`B${currentRow}:D${currentRow}`);
            currentRow++;
          }
        }
      }
      
      // Información adicional del reporte
      currentRow += 2;
      worksheet.mergeCells(`A${currentRow}:D${currentRow}`);
      const additionalHeader = worksheet.getCell(`A${currentRow}`);
      additionalHeader.value = 'INFORMACIÓN ADICIONAL';
      additionalHeader.style = sectionHeaderStyle;
      currentRow++;
      
      // Agregar información adicional relevante
      const additionalData = [
        ['Sistema Generador', 'Sistema HSEQ - Meridian Colombia'],
        ['Fecha de Generación', new Date().toLocaleString('es-ES')],
        ['Usuario Generador', report.nombre_usuario || 'No especificado'],
        ['Estado del Reporte', getStatusLabel(report.estado) || 'No especificado']
      ];
      
      additionalData.forEach(([label, value]) => {
        worksheet.getCell(`A${currentRow}`).value = label;
        worksheet.getCell(`A${currentRow}`).style = headerStyle;
        worksheet.getCell(`B${currentRow}`).value = value;
        worksheet.getCell(`B${currentRow}`).style = cellStyle;
        worksheet.mergeCells(`B${currentRow}:D${currentRow}`);
        currentRow++;
      });
      
      // Ajustar ancho de columnas
      worksheet.getColumn('A').width = 30;
      worksheet.getColumn('B').width = 50;
      worksheet.getColumn('C').width = 25;
      worksheet.getColumn('D').width = 30;
      
      // Generar el nombre del archivo
      const safeName = String(report.asunto || report.asunto_conversacion || 'reporte').replace(/[^a-z0-9_.-]/gi, '_');
      const fileName = `reporte_${report.id || ''}_${safeName}.xlsx`;
      
      console.log('Generando archivo Excel con imágenes...');
      
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
      
      const numImagenesIncluidas = report.evidencias?.filter(e => {
        const esImagen = (e.tipo_archivo && e.tipo_archivo.startsWith('image/')) ||
                        /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(e.url_archivo || e.nombre_archivo || '');
        return esImagen;
      }).length || 0;
      
      alert(`Reporte Excel generado exitosamente con ${numImagenesIncluidas} imagen(es) incluida(s).`);
      
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
      
      console.log('Iniciando generación de PDF con evidencias:', report.evidencias);
      
      // Generar nombre de archivo
      const safeName = String(report.asunto || report.asunto_conversacion || 'reporte').replace(/[^a-z0-9_.-]/gi, '_');
      const fileName = `reporte_hseq_${report.id || ''}_${safeName}.pdf`;
      
      // Convertir las evidencias (imágenes) a base64 para incluir en el PDF
      const evidenciasConImagenes = [];
      
      if (report.evidencias && report.evidencias.length > 0) {
        console.log(`Procesando ${report.evidencias.length} evidencias...`);
        
        for (const evidencia of report.evidencias) {
          console.log('Procesando evidencia:', evidencia);
          
          // Verificar si es una imagen por tipo o extensión
          const esImagen = (evidencia.tipo_archivo && evidencia.tipo_archivo.startsWith('image/')) ||
                          /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(evidencia.url_archivo || evidencia.nombre_archivo || '');
          
          console.log('¿Es imagen?:', esImagen, 'Tipo:', evidencia.tipo_archivo);
          
          if (esImagen) {
            try {
              let imageDataUrl = null;
              
              // Estrategia 1: Usar el blob cache si está disponible
              const cached = evidenceUrls[evidencia.id];
              if (cached && cached.blob) {
                console.log('Usando blob del cache para evidencia', evidencia.id);
                
                if (await isProbablyImageBlob(cached.blob)) {
                  const reader = new FileReader();
                  imageDataUrl = await new Promise((resolve, reject) => {
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(cached.blob);
                  });
                  console.log('Imagen cargada desde cache:', evidencia.id);
                }
              }
              
              // Estrategia 2: Intentar cargar desde el servidor
              if (!imageDataUrl) {
                console.log('Cargando imagen desde servidor para evidencia', evidencia.id);
                try {
                  const blob = await getEvidenceBlob(
                    evidencia.id, 
                    evidenceUrls, 
                    evidenceService, 
                    evidencia
                  );
                  
                  if (blob && await isProbablyImageBlob(blob)) {
                    const reader = new FileReader();
                    imageDataUrl = await new Promise((resolve, reject) => {
                      reader.onloadend = () => resolve(reader.result);
                      reader.onerror = reject;
                      reader.readAsDataURL(blob);
                    });
                    console.log('Imagen cargada desde servidor:', evidencia.id);
                  }
                } catch (loadError) {
                  console.warn('Error al cargar imagen desde servidor:', loadError);
                }
              }
              
              // Estrategia 3: Intentar cargar directamente desde URL pública
              if (!imageDataUrl && evidencia.url_archivo) {
                console.log('Intentando cargar desde URL pública:', evidencia.url_archivo);
                try {
                  const publicUrl = buildUploadsUrl(evidencia.url_archivo);
                  const response = await fetch(publicUrl);
                  if (response.ok) {
                    const blob = await response.blob();
                    if (await isProbablyImageBlob(blob)) {
                      const reader = new FileReader();
                      imageDataUrl = await new Promise((resolve, reject) => {
                        reader.onloadend = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                      });
                      console.log('Imagen cargada desde URL pública:', evidencia.id);
                    }
                  }
                } catch (urlError) {
                  console.warn('Error al cargar desde URL pública:', urlError);
                }
              }
              
              if (imageDataUrl) {
                evidenciasConImagenes.push({
                  ...evidencia,
                  imageDataUrl: imageDataUrl,
                });
                console.log('✓ Imagen agregada al PDF:', evidencia.id);
              } else {
                evidenciasConImagenes.push({
                  ...evidencia,
                  imageDataUrl: null,
                });
                console.warn('✗ Imagen no disponible:', evidencia.id);
              }
            } catch (error) {
              console.error(`Error al procesar imagen ${evidencia.id}:`, error);
              evidenciasConImagenes.push({
                ...evidencia,
                imageDataUrl: null,
              });
            }
          }
        }
      }
      
      console.log(`Generando PDF con ${evidenciasConImagenes.length} imágenes procesadas`);
      
      // Generar el PDF usando @react-pdf/renderer
      const blob = await pdf(
        <HseqReportDocument 
          report={report} 
          evidencias={evidenciasConImagenes}
        />
      ).toBlob();
      
      console.log('PDF generado, tamaño:', blob.size, 'bytes');
      
      // Descargar el PDF
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      
      // Limpiar
      setTimeout(() => {
        try {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } catch (cleanupError) {
          console.error('Error al limpiar recursos:', cleanupError);
        }
      }, 1000);
      
      const numImagenesIncluidas = evidenciasConImagenes.filter(e => e.imageDataUrl).length;
      alert(`PDF generado exitosamente con ${numImagenesIncluidas} de ${evidenciasConImagenes.length} imágenes`);
      
    } catch (e) {
      console.error('Error al generar el PDF:', e);
      alert('No se pudo generar el PDF del reporte: ' + e.message);
    } finally {
      setIsDownloadingPdf(false);
    }
  };
  
  // BACKUP: Función original de generación de PDF en el cliente (mantener por si se necesita)
  const handleDownloadFullReportPdf_OLD_CLIENT_SIDE = async () => {
    try {
      if (!report) return;
      
      setIsDownloadingPdf(true);
      // Señal visual/log para verificar click
      // eslint-disable-next-line no-console
      
      
      
      
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
            y += 18; 
          });
        } catch (textError) {
          
          // Fallback: escribir texto simple
          doc.text(String(text || ''), margin, y);
          y += 18;
        }
      };

      // Crear contenido básico del PDF
      
      // Título principal
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(46, 91, 186); // Azul corporativo
      writeLine('REPORTE HSEQ DETALLADO');
      y += 8;
      
      // Línea decorativa
      doc.setDrawColor(46, 91, 186);
      doc.line(margin, y, pageWidth - margin, y);
      y += 16;
      
      // Información general
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(45, 55, 72); // Gris oscuro
      writeLine('INFORMACIÓN GENERAL');
      y += 8;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(26, 32, 44); // Negro
      const meta = [
        `ID del Reporte: ${report.id ?? ''}`,
        `Tipo de Reporte: ${getEventTypeLabel(report.tipo_reporte)}`,
        `Usuario: ${report.nombre_usuario ?? ''}`,
        `Proyecto: ${report.proyecto_usuario ?? 'No asignado'}`,
        `Estado: ${getStatusLabel(report.estado ?? '')}`,
        `Fecha del Evento: ${report.fecha_evento ?? ''} ${report.hora_evento ?? ''}`,
        `Fecha de Creación: ${report.creado_en ?? ''}`,
        `Asunto: ${report.asunto || report.asunto_conversacion || ''}`,
      ];
      meta.forEach((line) => writeLine(line));
      y += 16;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(45, 55, 72);
      writeLine('DETALLES DEL REPORTE');
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(26, 32, 44);

      const addField = (label, value) => { 
        if (value) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          writeLine(`${label}:`);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          writeLine(`  ${value}`);
          y += 4;
        }
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

             y += 16;
       doc.setFont('helvetica', 'bold');
       doc.setFontSize(12);
       writeLine('Información Adicional');
       doc.setFont('helvetica', 'normal');
       doc.setFontSize(10);
       y += 8;
       
       writeLine(`Sistema Generador: Sistema HSEQ - Meridian Colombia`);
       writeLine(`Fecha de Generación: ${new Date().toLocaleString('es-ES')}`);
       writeLine(`Usuario Generador: ${report.nombre_usuario || 'No especificado'}`);
       writeLine(`Estado del Reporte: ${getStatusLabel(report.estado) || 'No especificado'}`);
       
       y += 16;
       doc.setFont('helvetica', 'bold');
       doc.setFontSize(10);
       writeLine('Nota: Este reporte fue generado automáticamente por el Sistema HSEQ.');
       doc.setFont('helvetica', 'normal');
       doc.setFontSize(8);
       writeLine('Meridian Colombia - Sistema de Gestión de Seguridad, Salud Ocupacional y Medio Ambiente');
      
      

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

     const buildPublicImageUrl = (fileNameOrUrl) => {
       const s = String(fileNameOrUrl || '').trim();
       if (/^https?:\/\//i.test(s)) return s;
       return buildUploadsUrl(s);
     };

               // Función para descargar una imagen individual
    const handleDownloadImage = async (evidencia) => {
      try {
        // Usar la misma URL directa que funciona para la visualización
        const imageUrl = buildPublicImageUrl(evidencia.url_archivo);
        const response = await fetch(imageUrl, {
          method: 'GET',
          headers: { 
            'Accept': 'image/*'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        // Obtener el blob con el tipo correcto
        const blob = await response.blob();
        
        // Verificar que el blob tenga contenido
        if (!blob || blob.size === 0) {
          throw new Error('La imagen descargada está vacía');
        }
        
        // Determinar la extensión correcta del archivo
        let fileName = evidencia.url_archivo || `evidencia_${evidencia.id}`;
        const contentType = blob.type || evidencia.tipo_archivo || '';
        
        // Asegurar que tenga extensión correcta
        if (!fileName.includes('.')) {
          if (contentType.includes('png')) {
            fileName += '.png';
          } else if (contentType.includes('gif')) {
            fileName += '.gif';
          } else if (contentType.includes('webp')) {
            fileName += '.webp';
          } else if (contentType.includes('jpeg') || contentType.includes('jpg')) {
            fileName += '.jpg';
          } else {
            // Por defecto, usar la extensión del nombre original
            const originalExt = evidencia.url_archivo ? evidencia.url_archivo.split('.').pop() : 'jpg';
            fileName += '.' + originalExt;
          }
        }
        
        // Crear un nuevo blob con el tipo MIME correcto
        const correctBlob = new Blob([blob], { type: contentType });
        
        // Crear URL del blob y descargar
        const url = URL.createObjectURL(correctBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        
        // Simular click
        a.click();
        
        // Limpiar después de un tiempo
        setTimeout(() => {
          try {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          } catch (cleanupError) {
            // Error en limpieza, ignorar
          }
        }, 2000);
        
        // Mostrar mensaje de éxito
        alert('Imagen descargada exitosamente: ' + fileName);
        
      } catch (error) {
        console.error('Error descargando imagen:', error);
        alert('Error al descargar la imagen: ' + error.message);
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {evidencias.map((evidencia, index) => {
          const blobInfo = evidenceUrls[evidencia.id];
          const type = (blobInfo && blobInfo.contentType) || evidencia.tipo_archivo || '';
          const isImage = type.startsWith('image/');
          const isVideo = type.startsWith('video/');
          const isPdf = type === 'application/pdf';
          return (
            <div key={evidencia.id} className="group relative bg-white bg-opacity-5 rounded-xl hover:bg-opacity-10 transition-all duration-300">
              <div className="flex items-center justify-center w-full h-48 sm:h-56" style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}>
                                 {isImage ? (
                   <div className="relative w-full h-full group">
                     <img
                       src={buildPublicImageUrl(evidencia.url_archivo)}
                       alt={`Evidencia ${index + 1}`}
                       className="w-full h-full object-contain rounded-t-xl"
                       loading="lazy"
                       onError={(e) => {
                         // Fallback al endpoint autenticado si la imagen pública falla
                         const token = localStorage.getItem('token') || '';
                         const fallback = buildApi(`evidencias/${evidencia.id}?token=${encodeURIComponent(token)}`);
                         if (!e.target.dataset.fallback) {
                           e.target.dataset.fallback = '1';
                           e.target.src = fallback;
                         } else {
                           e.target.style.display = 'none';
                           e.target.nextSibling.style.display = 'flex';
                         }
                       }}
                     />
                                           {/* Botón para abrir en nueva pestaña que aparece al hacer hover */}
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-t-xl">
                        <button
                          onClick={() => window.open(buildPublicImageUrl(evidencia.url_archivo), '_blank')}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                          title="Abrir imagen en nueva pestaña"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                          </svg>
                          <span className="text-sm font-medium">Abrir</span>
                        </button>
                      </div>
                   </div>
                ) : isVideo ? (
                  <video 
                    src={buildApi(`evidencias/${evidencia.id}?token=${encodeURIComponent(localStorage.getItem('token') || '')}`)}
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
              <div className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                  <div>
                    <p className="text-white font-medium text-sm sm:text-base">Evidencia {index + 1}</p>
                    <p className="text-white text-opacity-50 text-xs sm:text-sm">
                      {new Date(evidencia.creado_en).toLocaleDateString('es-ES', {
                        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                    <p className="text-white text-opacity-40 text-xs mt-1">
                      {evidencia.url_archivo || 'Sin nombre'}
                    </p>
                  </div>
                                     <div className="flex items-center space-x-2">
                                           {isImage && (
                        <>
                          <button
                            onClick={() => window.open(buildPublicImageUrl(evidencia.url_archivo), '_blank')}
                            className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs flex items-center space-x-1 transition-colors duration-200"
                            title="Abrir imagen en nueva pestaña"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                            </svg>
                            <span>Abrir</span>
                          </button>
                          <button
                            onClick={() => handleDownloadImage(evidencia)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs flex items-center space-x-1 transition-colors duration-200"
                            title="Descargar imagen"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            <span>Descargar</span>
                          </button>
                        </>
                      )}
                   </div>
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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm">
      <div className="report-details-modal bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl sm:rounded-3xl max-w-5xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-gray-800 rounded-t-2xl sm:rounded-t-3xl p-4 sm:p-6 border-b border-gray-700">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              {report && (
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${getStatusColor(report.estado)}`}>
                  {getEventTypeIcon(report.tipo_reporte)}
                </div>
              )}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Detalles del Reporte
                </h2>
                {report && (
                  <p className="text-white text-opacity-60 text-xs sm:text-sm">
                    {getEventTypeLabel(report.tipo_reporte)}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full flex items-center justify-center transition-all duration-200 self-end sm:self-auto"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
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
            <div className="space-y-6 sm:space-y-8">
              {/* Estado y Asunto */}
              <div className="bg-gradient-to-r from-blue-500 bg-opacity-10 to-purple-500 bg-opacity-10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-500 border-opacity-20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold text-white ${getStatusColor(report.estado)}`}>
                      {getStatusLabel(report.estado)}
                    </span>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-white text-opacity-60 text-xs sm:text-sm">Reportado por</p>
                    <p className="text-white font-semibold text-sm sm:text-base">{report.nombre_usuario}</p>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  {report.asunto || report.asunto_conversacion || 'Sin asunto'}
                </h3>
                <p className="text-white text-opacity-80 text-sm sm:text-base">
                  {formatFieldValue('fecha_evento', report.fecha_evento)}
                  {report.hora_evento && ` • ${report.hora_evento}`}
                </p>
              </div>

              {/* Información Específica según Tipo */}
              <div className="bg-white bg-opacity-5 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Información del Evento
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
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
                  
                  {report.tipo_reporte === 'pqr' && (
                    <>
                      {renderField('Tipo de PQR', report.tipo_pqr, null,
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                      )}
                      {renderField('Teléfono de Contacto', report.telefono_contacto, null,
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                        </svg>
                      )}
                      {renderField('Correo de Contacto', report.correo_contacto, null,
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                      )}
                      {renderField('Descripción', report.descripcion_hallazgo, null,
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Información de Revisión */}
              {(report.fecha_revision || report.comentarios_revision) && (
                <div className="bg-white bg-opacity-5 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Información de Revisión
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
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
              <div className="bg-white bg-opacity-5 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-white flex items-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    Evidencias Adjuntas
                  </h3>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:space-x-2">
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
