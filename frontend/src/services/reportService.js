// Importar cliente HTTP
import http from './http';

class ReportService {
    /**
     * Validar y formatear datos antes de enviar
     */
    static validateAndFormatData(data) {
        const formattedData = { ...data };
        
        // Validar y formatear fecha
        if (formattedData.fecha_evento) {
            // Asegurar formato YYYY-MM-DD
            const date = new Date(formattedData.fecha_evento);
            if (isNaN(date.getTime())) {
                throw new Error('Formato de fecha inválido');
            }
            formattedData.fecha_evento = date.toISOString().split('T')[0];
        }
        
        // Validar y formatear hora
        if (formattedData.hora_evento) {
            // Asegurar formato HH:MM:SS
            if (!/^\d{2}:\d{2}(:\d{2})?$/.test(formattedData.hora_evento)) {
                throw new Error('Formato de hora inválido');
            }
            // Agregar segundos si no están presentes
            if (formattedData.hora_evento.length === 5) {
                formattedData.hora_evento += ':00';
            }
        }
        
        // Validar campos requeridos según tipo de reporte
        switch (formattedData.tipo_reporte) {
            case 'incidentes':
                if (!formattedData.asunto) throw new Error('El asunto es requerido');
                if (!formattedData.grado_criticidad) throw new Error('El grado de criticidad es requerido');
                if (!formattedData.ubicacion_incidente) throw new Error('La ubicación del incidente es requerida');
                if (!formattedData.tipo_afectacion) throw new Error('El tipo de afectación es requerido');
                if (!formattedData.descripcion_incidente) throw new Error('La descripción del incidente es requerida');
                break;
            case 'hallazgos':
                if (!formattedData.asunto) throw new Error('El asunto es requerido');
                if (!formattedData.lugar_hallazgo) throw new Error('El lugar del hallazgo es requerido');
                if (!formattedData.tipo_hallazgo) throw new Error('El tipo de hallazgo es requerido');
                if (!formattedData.descripcion_hallazgo) throw new Error('La descripción del hallazgo es requerida');
                if (!formattedData.estado_condicion) throw new Error('El estado de la condición es requerido');
                break;
            case 'conversaciones':
                if (!formattedData.asunto_conversacion) throw new Error('El asunto de la conversación es requerido');
                if (!formattedData.tipo_conversacion) throw new Error('El tipo de conversación es requerido');
                if (!formattedData.sitio_evento_conversacion) throw new Error('El sitio del evento es requerido');
                if (!formattedData.descripcion_conversacion) throw new Error('La descripción de la conversación es requerida');
                break;
        }
        
        return formattedData;
    }

    /**
     * Crear un nuevo reporte
     */
    static async createReport(reportData) {
        try {
            // Validar y formatear datos
            const formattedData = this.validateAndFormatData(reportData);
            
            //
            
            const response = await http.post('reports', formattedData);
            return response.data; // Devolver solo los datos, no todo el objeto response
        } catch (error) {
            //
            throw error;
        }
    }

    /**
     * Obtener todos los reportes (para coordinadores y admin)
     */
    static async getAllReports(filters = {}) {
        try {
            const params = new URLSearchParams();
            const allowed = ['tipo_reporte','estado','user_id','grado_criticidad','tipo_afectacion','proyecto','date_from','date_to','q','sort_by','sort_dir','page','per_page'];
            Object.entries(filters).forEach(([k, v]) => {
                if (v !== undefined && v !== null && v !== '' && allowed.includes(k)) {
                    params.append(k, v);
                }
            });
            const qs = params.toString();
            const response = await http.get(`reports${qs ? `?${qs}` : ''}`);
            return response.data; // Devolver solo los datos, no todo el objeto response
        } catch (error) {
            //
            throw error;
        }
    }

    /**
     * Obtener reportes por usuario
     */
    static async getReportsByUser(userId) {
        try {
            const response = await http.get(`reports/user?user_id=${userId}`);
            return response.data; // Devolver solo los datos, no todo el objeto response
        } catch (error) {
            //
            throw error;
        }
    }

    /**
     * Obtener estadísticas de reportes
     */
    static async getReportStats() {
        try {
            const response = await http.get('reports/stats');
            return response.data; // Devolver solo los datos, no todo el objeto response
        } catch (error) {
            //
            throw error;
        }
    }

    /**
     * Preparar datos del formulario para envío
     */
    static prepareReportData(formData, tipoReporte, userId) {
        const baseData = {
            id_usuario: userId,
            tipo_reporte: tipoReporte,
            asunto: formData.asunto || formData.asunto_conversacion,
            fecha_evento: formData.fecha_evento
        };

        // Agregar campos específicos según el tipo de reporte
        switch (tipoReporte) {
            case 'hallazgos':
                return {
                    ...baseData,
                    lugar_hallazgo: formData.lugar_hallazgo,
                    lugar_hallazgo_otro: formData.lugar_hallazgo_otro,
                    tipo_hallazgo: formData.tipo_hallazgo,
                    descripcion_hallazgo: formData.descripcion_hallazgo,
                    recomendaciones: formData.recomendaciones,
                    estado_condicion: formData.estado_condicion
                };
            
            case 'incidentes':
                return {
                    ...baseData,
                    grado_criticidad: formData.grado_criticidad,
                    ubicacion_incidente: formData.ubicacion_incidente,
                    hora_evento: formData.hora_evento,
                    tipo_afectacion: formData.tipo_afectacion,
                    descripcion_incidente: formData.descripcion_incidente
                };
            
            case 'conversaciones':
                return {
                    ...baseData,
                    tipo_conversacion: formData.tipo_conversacion,
                    sitio_evento_conversacion: formData.sitio_evento_conversacion,
                    lugar_hallazgo_conversacion: formData.lugar_hallazgo_conversacion,
                    lugar_hallazgo_conversacion_otro: formData.lugar_hallazgo_conversacion_otro,
                    descripcion_conversacion: formData.descripcion_conversacion,
                    asunto_conversacion: formData.asunto_conversacion
                };
            
            default:
                throw new Error('Tipo de reporte no válido');
        }
    }

    /**
     * Procesar archivo de evidencia
     */
    static async processEvidence(file) {
        if (!file) return null;

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = () => {
                const base64Data = reader.result.split(',')[1]; // Remover el prefijo data:image/...;base64,
                const extension = file.name.split('.').pop();
                
                resolve({
                    data: base64Data,
                    type: file.type,
                    extension: extension,
                    name: file.name,
                    size: file.size
                });
            };
            
            reader.onerror = () => {
                reject(new Error('Error al procesar el archivo'));
            };
            
            reader.readAsDataURL(file);
        });
    }

    /**
     * Actualizar estado de un reporte
     */
    static async updateReportStatus(reportId, status, revisorId = null, comentarios = null) {
        try {
            const response = await http.put('reports/status', {
                report_id: reportId,
                status: status,
                revisor_id: revisorId,
                comentarios: comentarios
            });
            return response.data; // Devolver solo los datos, no todo el objeto response
        } catch (error) {
            //
            throw error;
        }
    }

    /**
     * Obtener un reporte específico por ID
     */
    static async getReportById(reportId) {
        try {
            const response = await http.get(`reports/${reportId}`);
            return response.data; // Devolver solo los datos, no todo el objeto response
        } catch (error) {
            console.error('Error en getReportById:', error);
            throw error;
        }
    }

    /**
     * Actualizar un reporte existente
     */
    static async updateReport(reportId, reportData) {
        try {
            // Validar y formatear datos
            const formattedData = this.validateAndFormatData(reportData);
            
            //
            
            const response = await http.put(`reports/${reportId}`, formattedData);
            return response.data; // Devolver solo los datos, no todo el objeto response
        } catch (error) {
            //
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Error de conexión con el servidor');
            }
            throw error;
        }
    }

    /**
     * Eliminar un reporte
     */
    static async deleteReport(reportId) {
        try {
            const response = await http.delete(`reports/${reportId}`);
            return response.data; // Devolver solo los datos, no todo el objeto response
        } catch (error) {
            //
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Error de conexión con el servidor');
            }
            throw error;
        }
    }
}

export default ReportService; 