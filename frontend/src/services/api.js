// Cliente HTTP único usando axios
import http from './http';
import { apiBaseUrl } from '../config/api';

// Función helper para manejar respuestas de axios
const handleResponse = (response) => response.data;

// Función helper para manejar errores
const handleError = (error) => {
    throw new Error(error.response?.data?.message || 'Error de red');
};

const api = {
    get: (path, opts = {}) => http.get(path, opts).then(handleResponse).catch(handleError),
    post: (path, data, opts = {}) => http.post(path, data, opts).then(handleResponse).catch(handleError),
    put: (path, data, opts = {}) => http.put(path, data, opts).then(handleResponse).catch(handleError),
    delete: (path, opts = {}) => http.delete(path, opts).then(handleResponse).catch(handleError),
};

/**
 * Servicios para reportes
 */
export const reportService = {
    /**
     * Crear un nuevo reporte
     * @param {Object} data - Datos del reporte
     * @returns {Promise<Object>}
     */
    createReport: async (data) => {
        try {
            const response = await api.post('reports', data);
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al crear reporte');
        }
    },

    /**
     * Subir evidencia para un reporte
     * @param {number} reportId - ID del reporte
     * @param {File} file - Archivo a subir
     * @returns {Promise<Object>}
     */
    uploadEvidence: async (reportId, file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post(`reports/${reportId}/evidencias`, formData);
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al subir evidencia');
        }
    },

    /**
     * Obtener reportes con filtros opcionales
     * @param {Object} filters - Filtros opcionales
     * @returns {Promise<Object>}
     */
    fetchReports: async (filters = {}) => {
        try {
            const params = new URLSearchParams();
            const allowed = ['tipo_reporte','estado','user_id','grado_criticidad','tipo_afectacion','proyecto','date_from','date_to','q','sort_by','sort_dir','page','per_page'];
            Object.entries(filters).forEach(([k, v]) => {
                if (v !== undefined && v !== null && v !== '' && allowed.includes(k)) {
                    params.append(k, v);
                }
            });
            const qs = params.toString();
            const response = await api.get(`reports${qs ? `?${qs}` : ''}`);
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener reportes');
        }
    },

    /**
     * Obtener reportes de un usuario específico
     * @param {number} userId - ID del usuario
     * @returns {Promise<Object>}
     */
    fetchReportsByUser: async (userId) => {
        try {
            const response = await api.get(`reports/user?user_id=${userId}`);
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener reportes del usuario');
        }
    },

    /**
     * Obtener un reporte específico por ID
     * @param {number} reportId - ID del reporte
     * @returns {Promise<Object>}
     */
    fetchReportById: async (reportId) => {
        try {
            const response = await api.get(`reports/${reportId}`);
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener reporte');
        }
    },

    /**
     * Actualizar estado de un reporte
     * @param {Object} payload - Datos de actualización
     * @returns {Promise<Object>}
     */
    updateReportStatus: async (payload) => {
        try {
            const response = await api.put(`reports/status`, payload);
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al actualizar estado del reporte');
        }
    },

    /**
     * Obtener estadísticas de reportes
     * @returns {Promise<Object>}
     */
    fetchReportStats: async () => {
        try {
            const response = await api.get('reports/stats');
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
        }
    },

    /**
     * Obtener estadísticas del dashboard
     * @returns {Promise<Object>}
     */
    fetchDashboardStats: async (period) => {
        try {
            const params = new URLSearchParams();
            if (period) params.append('period', period);
            const query = params.toString();
            const url = `reports/dashboard-stats${query ? `?${query}` : ''}`;
            const response = await api.get(url);
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener estadísticas del dashboard');
        }
    },

    /**
     * Obtener estadísticas por criticidad
     * @returns {Promise<Object>}
     */
    fetchCriticalityStats: async () => {
        try {
            const response = await api.get('reports/criticality-stats');
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener estadísticas por criticidad');
        }
    },

    /**
     * Obtener estadísticas por afectación
     * @returns {Promise<Object>}
     */
    fetchAffectationStats: async () => {
        try {
            const response = await api.get('reports/affectation-stats');
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener estadísticas por afectación');
        }
    }
};

/**
 * Servicios de autenticación
 */
export const authService = {
    /**
     * Iniciar sesión
     * @param {string} cedula - Cédula del usuario
     * @param {string} password - Contraseña
     * @returns {Promise<Object>}
     */
    login: async (cedula, password) => {
        try {
            const response = await api.post('auth/login', { cedula, password });
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
        }
    },

    /**
     * Cerrar sesión
     */
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

/**
 * Servicios para administración de usuarios
 */
export const userService = {
    /**
     * Listar usuarios
     * @param {Object} filters
     * @returns {Promise<Object>}
     */
    fetchUsers: async (filters = {}) => {
        try {
            const response = await api.get('users', { params: filters });
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener usuarios');
        }
    },

    /**
     * Crear usuario
     * @param {Object} data
     * @returns {Promise<Object>}
     */
    createUser: async (data) => {
        try {
            const response = await api.post('users', data);
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al crear usuario');
        }
    },

    /**
     * Actualizar usuario
     * @param {number|string} userId
     * @param {Object} data
     * @returns {Promise<Object>}
     */
    updateUser: async (userId, data) => {
        try {
            const response = await api.put(`users/${userId}`, data);
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al actualizar usuario');
        }
    },

    /**
     * Eliminar usuario
     * @param {number|string} userId
     * @returns {Promise<Object>}
     */
    deleteUser: async (userId) => {
        try {
            const response = await api.delete(`users/${userId}`);
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al eliminar usuario');
        }
    },

    /**
     * Reiniciar contraseña de un usuario
     * @param {number|string} userId
     * @returns {Promise<Object>}
     */
    resetPassword: async (userId) => {
        try {
            const response = await api.post(`users/${userId}/reset-password`);
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al reiniciar contraseña');
        }
    }
};



/**
 * Servicios de evidencias (descarga segura)
 */
export const evidenceService = {
    /**
     * Descargar evidencia como Blob (requiere permisos de soporte/admin en backend)
     * @param {number|string} evidenceId
     * @returns {Promise<{ blob: Blob, contentType: string, fileName?: string }>} 
     */
    getEvidenceBlob: (() => {
        const cache = new Map(); // evidenceId -> { blob, contentType, fileName, ts }
        const ttlMs = 5 * 60 * 1000;
        return async (evidenceId) => {
            const now = Date.now();
            const cached = cache.get(evidenceId);
            if (cached && (now - cached.ts) < ttlMs) {
                return { blob: cached.blob, contentType: cached.contentType, fileName: cached.fileName };
            }
            try {
                const token = localStorage.getItem('token');
                const q = token ? `?token=${encodeURIComponent(token)}` : '';
                const response = await http.get(`evidencias/${evidenceId}${q}`, { responseType: 'blob' });
                const disp = response.headers.get('content-disposition') || '';
                let fileName;
                const match = /filename="?([^";]+)"?/i.exec(disp);
                if (match && match[1]) fileName = match[1];
                let contentType = response.headers.get('content-type') || 'application/octet-stream';
                const isUseful = contentType === 'application/pdf' || contentType.startsWith('image/') || contentType.startsWith('video/');
                if (!isUseful) {
                    const ext = (fileName || '').split('.').pop()?.toLowerCase();
                    const map = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp', pdf: 'application/pdf', mp4: 'video/mp4', webm: 'video/webm', ogg: 'video/ogg', mov: 'video/quicktime' };
                    if (ext && map[ext]) {
                        contentType = map[ext];
                    }
                }
                const blob = (contentType && contentType !== 'application/octet-stream')
                    ? new Blob([response.data], { type: contentType })
                    : response.data;
                const value = { blob, contentType, fileName, ts: now };
                cache.set(evidenceId, value);
                return { blob, contentType, fileName };
            } catch (error) {
                throw new Error(error.response?.data?.message || 'No se pudo descargar la evidencia');
            }
        };
    })(),

    // Construye URL pública directa a imagen en /uploads (para vistas rápidas sin auth)
    getPublicImageUrl: (fileName) => `${apiBaseUrl}/uploads/${encodeURIComponent(fileName || '')}`,
};

export default api; 