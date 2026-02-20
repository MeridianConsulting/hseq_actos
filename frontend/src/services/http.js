import axios from 'axios';
import { apiBaseUrl } from '../config/api';

const http = axios.create({
  baseURL: apiBaseUrl, // p.ej. '/backend/api'
  withCredentials: false,
  timeout: 30000, // 30s por defecto; descargas usan timeout mayor en la petición
});

// Interceptor para agregar token de autenticación a todas las peticiones
http.interceptors.request.use(
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

// Interceptor para manejar errores de autenticación
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o problema de autenticación
      // Solo redirigir si no estamos ya en la página de login
      if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
        // Limpiar todo
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('isLoggedIn');
        
        // Mostrar mensaje al usuario
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default http;
