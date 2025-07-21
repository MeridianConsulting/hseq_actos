// Cambia la URL base para usar la ruta correcta
const API_BASE_URL = 'http://localhost/hseq/backend';

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
            
            console.log('Enviando datos al servidor:', formattedData);
            
            const response = await fetch(`${API_BASE_URL}/api/reports`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedData)
            });

            // Verificar si la respuesta es JSON válido
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                // Si no es JSON, obtener el texto de la respuesta para debug
                const textResponse = await response.text();
                console.error('Respuesta no JSON del servidor:', textResponse);
                throw new Error('El servidor devolvió una respuesta no válida. Verifique la consola para más detalles.');
            }

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error al crear el reporte');
            }
            
            return data;
        } catch (error) {
            console.error('Error en createReport:', error);
            throw error;
        }
    }

    /**
     * Obtener todos los reportes (para coordinadores y admin)
     */
    static async getAllReports(filters = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (filters.tipo_reporte) queryParams.append('tipo_reporte', filters.tipo_reporte);
            if (filters.estado) queryParams.append('estado', filters.estado);

            const url = `${API_BASE_URL}/api/reports${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error al obtener reportes');
            }
            
            return data;
        } catch (error) {
            console.error('Error en getAllReports:', error);
            throw error;
        }
    }

    /**
     * Obtener reportes por usuario
     */
    static async getReportsByUser(userId) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/reports/user?user_id=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error al obtener reportes del usuario');
            }
            
            return data;
        } catch (error) {
            console.error('Error en getReportsByUser:', error);
            throw error;
        }
    }

    /**
     * Obtener estadísticas de reportes
     */
    static async getReportStats() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/reports/stats`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error al obtener estadísticas');
            }
            
            return data;
        } catch (error) {
            console.error('Error en getReportStats:', error);
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
            const response = await fetch(`${API_BASE_URL}/api/reports/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    report_id: reportId,
                    status: status,
                    revisor_id: revisorId,
                    comentarios: comentarios
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error al actualizar estado del reporte');
            }
            
            return data;
        } catch (error) {
            console.error('Error en updateReportStatus:', error);
            throw error;
        }
    }
}

export default ReportService; 