/**
 * Configuración de API para el proyecto HSEQ
 * Maneja URLs base según el entorno (desarrollo vs producción)
 */

// URL base configurable por entorno
const getBaseUrl = () => {
    // Si se define REACT_APP_API_URL, usarla
    if (process.env.REACT_APP_API_URL) {
        return process.env.REACT_APP_API_URL;
    }
    
    // Por defecto usar producción (URL completa con HTTPS)
    return 'https://hseq.meridianltda.com/backend/api';
};

// URL base para uploads (archivos estáticos)
const getUploadsBaseUrl = () => {
    // Si se define REACT_APP_UPLOADS_URL, usarla
    if (process.env.REACT_APP_UPLOADS_URL) {
        return process.env.REACT_APP_UPLOADS_URL;
    }
    
    // Por defecto usar producción (directo a uploads, sin /api)
    return 'https://hseq.meridianltda.com/backend/uploads';
};

// Quita barras finales
const API_BASE = String(getBaseUrl()).replace(/\/+$/, '');
const UPLOADS_BASE = String(getUploadsBaseUrl()).replace(/\/+$/, '');

// Une rutas evitando dobles barras
export const joinUrl = (base, path = '') =>
  `${String(base).replace(/\/+$/, '')}/${String(path).replace(/^\/+/, '')}`;

export const apiBaseUrl = API_BASE;
export const uploadsBaseUrl = UPLOADS_BASE;

/**
 * Construye una URL completa para el API
 * @param {string} path - Ruta relativa del endpoint (sin slash inicial)
 * @returns {string} URL completa
 * 
 * @example
 * buildApi('auth/login') // -> 'https://hseq.meridianltda.com/backend/api/auth/login'
 * buildApi('reports?page=1') // -> 'https://hseq.meridianltda.com/backend/api/reports?page=1'
 */
export const buildApi = (path = '') => joinUrl(API_BASE, path);

/**
 * Construye una URL completa para archivos de uploads (imágenes estáticas)
 * @param {string} fileName - Nombre del archivo (con o sin 'uploads/')
 * @returns {string} URL completa
 * 
 * @example
 * buildUploadsUrl('evidencia_50_1755870460_68a874fc3b4c4.jpg') 
 * // -> 'https://hseq.meridianltda.com/backend/uploads/evidencia_50_1755870460_68a874fc3b4c4.jpg'
 * buildUploadsUrl('uploads/evidencia_50_1755870460_68a874fc3b4c4.jpg')
 * // -> 'https://hseq.meridianltda.com/backend/uploads/evidencia_50_1755870460_68a874fc3b4c4.jpg'
 */
export const buildUploadsUrl = (fileName = '') => {
    const cleanFileName = String(fileName || '').replace(/^uploads\//, '');
    return joinUrl(UPLOADS_BASE, cleanFileName);
};

/**
 * URL base del API (para compatibilidad con código existente)
 * @deprecated Usar buildApi() en su lugar
 */
export const API_BASE_URL = API_BASE;

export default {
    buildApi,
    buildUploadsUrl,
    API_BASE_URL,
    apiBaseUrl,
    uploadsBaseUrl
};
