import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../utils/auth';
import Header from '../components/Header';
import ReportsTable from '../components/ReportsTable';
import '../assets/css/styles.css';

const SupportDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const userData = getUser();
    if (userData) {
      setUser(userData);
    }
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen" style={{
      background: `linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 35%, var(--color-tertiary-dark) 100%)`
    }}>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Welcome Card */}
          <div className="bg-gray-900/80 backdrop-blur-md rounded-3xl p-8 mb-8 shadow-2xl border border-gray-700">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4 drop-shadow">
                ¡Bienvenid@, {user?.nombre}!
              </h2>
              <p className="text-gray-200 text-lg">
                Gestiona y revisa los reportes de seguridad para mantener un ambiente de trabajo seguro
              </p>
            </div>
          </div>

          {/* Reports Table Component */}
          <ReportsTable 
            user={user}
            showStatusActions={true}
            title="Reportes de Soporte"
            useDarkTheme={true}
          />
        </div>
      </main>
    </div>
  );
};

export default SupportDashboard; 