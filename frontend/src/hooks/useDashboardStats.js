import { useState, useEffect, useCallback, useRef } from 'react';
import { reportService } from '../services/api';

export const useDashboardStats = (period, filters = {}) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const filtersRef = useRef(filters);

  // Actualizar la referencia cuando cambien los filtros
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const currentFilters = filtersRef.current;
      const response = await reportService.fetchDashboardStats(period, currentFilters);
      
      if (response.success) {
        setStats(response.data);
        console.log('Dashboard stats loaded:', response.data);
      } else {
        setError(response.message || 'Error al cargar estadísticas');
      }
    } catch (err) {
      setError(err.message || 'Error al cargar estadísticas');
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  }, [period]);
  
  // Efecto para recargar cuando cambien el período o los filtros
  useEffect(() => {
    fetchStats();
  }, [period, filters, fetchStats]);

  const refreshStats = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refreshStats
  };
}; 