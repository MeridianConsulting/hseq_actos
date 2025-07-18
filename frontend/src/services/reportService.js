const API_BASE_URL = 'http://localhost/hseq/backend';

class ReportService {
    /**
     * Crear un nuevo reporte
     */
    static async createReport(reportData) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/reports`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reportData)
            });

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
}

export default ReportService; 