import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Home from './admin/Home'; // Ya no se usa
import Dashboard from './admin/Dashboard';
import UsersAdmin from './admin/UsersAdmin';
import Login from './pages/Login';
import CollaboratorDashboard from './pages/CollaboratorDashboard';
import SupportDashboard from './pages/SupportDashboard';

import { isAuthenticated, getUser, getRoleRoute } from './utils/auth';
import SEO from './components/SEO';

// Componente para proteger rutas que requieren autenticación
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

// Componente para redirigir si ya está autenticado
const PublicRoute = ({ children }) => {
  if (isAuthenticated()) {
    const user = getUser();
    if (user && user.rol) {
      const targetRoute = getRoleRoute(user.rol);
      return <Navigate to={targetRoute} replace />;
    }
    // Si no hay rol, redirigir a dashboard por defecto
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <SEO title="Meridian HSEQ | Reportes y Gestión" />
        <header className="App-header">
          {/* Aquí puedes agregar tu navegación/header */}
        </header>
        
        <main>
          <Routes>
            <Route 
              path="/" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            {/* Eliminar la ruta /home para admin, solo dashboard */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/collaborator" 
              element={
                <ProtectedRoute>
                  <CollaboratorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/support" 
              element={
                <ProtectedRoute>
                  <SupportDashboard />
                </ProtectedRoute>
              } 
            />
            {/* Vista de coordinador removida */}
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute>
                  <UsersAdmin />
                </ProtectedRoute>
              } 
            />

            {/* Ruta por defecto para rutas no encontradas */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
