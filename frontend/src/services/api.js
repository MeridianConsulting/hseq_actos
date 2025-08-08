import axios from 'axios';

// Configuración base de axios
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost/hseq/backend';

// Configurar axios con interceptores
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expirado o inválido
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

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
            const response = await api.post('/api/reports', data);
            return response.data;
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

            const response = await api.post(`/api/reports/${reportId}/evidencias`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
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
            if (filters.tipo_reporte) params.append('tipo_reporte', filters.tipo_reporte);
            if (filters.estado) params.append('estado', filters.estado);

            const response = await api.get(`/api/reports?${params.toString()}`);
            return response.data;
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
            const response = await api.get(`/api/reports/user?user_id=${userId}`);
            return response.data;
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
            const response = await api.get(`/api/reports/${reportId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener reporte');
        }
    },

    /**
     * Actualizar estado de un reporte
     * @param {number} reportId - ID del reporte
     * @param {Object} payload - Datos de actualización
     * @returns {Promise<Object>}
     */
    updateReportStatus: async (reportId, payload) => {
        try {
            const response = await api.put(`/api/reports/${reportId}/status`, payload);
            return response.data;
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
            const response = await api.get('/api/reports/stats');
            return response.data;
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
            const response = await api.get(`/api/reports/dashboard-stats${query ? `?${query}` : ''}`);
            return response.data;
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
            const response = await api.get('/api/reports/criticality-stats');
            return response.data;
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
            const response = await api.get('/api/reports/affectation-stats');
            return response.data;
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
            const response = await api.post('/api/auth/login', { cedula, password });
            return response.data;
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
            const response = await api.get('/api/users', { params: filters });
            return response.data;
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
            const response = await api.post('/api/users', data);
            return response.data;
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
            const response = await api.put(`/api/users/${userId}`, data);
            return response.data;
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
            const response = await api.delete(`/api/users/${userId}`);
            return response.data;
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
            const response = await api.post(`/api/users/${userId}/reset-password`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al reiniciar contraseña');
        }
    },
};

export default api; 