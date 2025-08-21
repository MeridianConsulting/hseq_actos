import axios from 'axios';
import { apiBaseUrl } from '../config/api';

const http = axios.create({
  baseURL: apiBaseUrl, // p.ej. '/backend/api'
  withCredentials: false,
});

// Interceptor para manejar errores de autenticación
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default http;
