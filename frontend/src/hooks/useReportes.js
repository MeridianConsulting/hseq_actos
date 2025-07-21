import { useState, useCallback } from 'react';
import { reportService } from '../services/api';

/**
 * Hook personalizado para manejar operaciones de reportes
 */
export const useReportes = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    /**
     * Crear un nuevo reporte
     */
    const createReport = useCallback(async (reportData) => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const result = await reportService.createReport(reportData);
            setSuccess('Reporte creado exitosamente');
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Subir evidencia para un reporte
     */
    const uploadEvidence = useCallback(async (reportId, file) => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const result = await reportService.uploadEvidence(reportId, file);
            setSuccess('Evidencia subida exitosamente');
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Obtener reportes con filtros
     */
    const fetchReports = useCallback(async (filters = {}) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await reportService.fetchReports(filters);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Obtener reportes de un usuario
     */
    const fetchReportsByUser = useCallback(async (userId) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await reportService.fetchReportsByUser(userId);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Actualizar estado de un reporte
     */
    const updateReportStatus = useCallback(async (reportId, payload) => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const result = await reportService.updateReportStatus(reportId, payload);
            setSuccess('Estado actualizado exitosamente');
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Obtener estadísticas
     */
    const fetchReportStats = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await reportService.fetchReportStats();
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Limpiar mensajes
     */
    const clearMessages = useCallback(() => {
        setError(null);
        setSuccess(null);
    }, []);

    return {
        // Estados
        isLoading,
        error,
        success,
        
        // Métodos
        createReport,
        uploadEvidence,
        fetchReports,
        fetchReportsByUser,
        updateReportStatus,
        fetchReportStats,
        clearMessages
    };
}; 