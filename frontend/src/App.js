import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './admin/Home';
import Dashboard from './admin/Dashboard';
import Login from './pages/Login';
import CollaboratorDashboard from './pages/CollaboratorDashboard';
import SupportDashboard from './pages/SupportDashboard';
import CoordinatorDashboard from './pages/CoordinatorDashboard';
import { isAuthenticated, getUser, getRoleRoute } from './utils/auth';

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
    return <Navigate to="/home" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
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
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
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
            <Route 
              path="/coordinator" 
              element={
                <ProtectedRoute>
                  <CoordinatorDashboard />
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
