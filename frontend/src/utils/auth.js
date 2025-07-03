// Utilidades para manejo de autenticación

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
  const fromLocal = localStorage.getItem('isLoggedIn');
  const fromSession = sessionStorage.getItem('isLoggedIn');
  return fromLocal === 'true' || fromSession === 'true';
};

// Obtener datos del usuario
export const getUser = () => {
  const fromLocal = localStorage.getItem('user');
  const fromSession = sessionStorage.getItem('user');
  
  if (fromLocal) {
    try {
      return JSON.parse(fromLocal);
    } catch (error) {
      return null;
    }
  }
  
  if (fromSession) {
    try {
      return JSON.parse(fromSession);
    } catch (error) {
      return null;
    }
  }
  
  return null;
};

// Cerrar sesión
export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('isLoggedIn');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('isLoggedIn');
  
  // Redirigir al login
  window.location.href = '/';
};

// Verificar rol del usuario
export const hasRole = (role) => {
  const user = getUser();
  return user && user.rol === role;
};

// Verificar si es admin
export const isAdmin = () => {
  return hasRole('admin');
};

// Verificar si es coordinador
export const isCoordinator = () => {
  return hasRole('coordinador');
};

// Verificar si es soporte
export const isSupport = () => {
  return hasRole('soporte');
};

// Verificar si es colaborador
export const isCollaborator = () => {
  return hasRole('colaborador');
};

// Obtener nombre del usuario
export const getUserName = () => {
  const user = getUser();
  return user ? user.nombre : null;
};

// Obtener cédula del usuario
export const getUserCedula = () => {
  const user = getUser();
  return user ? user.cedula : null;
};

// Obtener correo del usuario
export const getUserEmail = () => {
  const user = getUser();
  return user ? user.correo : null;
}; 