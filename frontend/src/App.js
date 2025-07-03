import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './admin/Home';
import Login from './pages/Login';
import { isAuthenticated } from './utils/auth';

// Componente para proteger rutas que requieren autenticación
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

// Componente para redirigir si ya está autenticado
const PublicRoute = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/home" replace /> : children;
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
            {/* Aquí puedes agregar más rutas */}
            {/* Ruta por defecto para rutas no encontradas */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
