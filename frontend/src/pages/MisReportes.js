import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, isAdmin, isSupport, getRoleRoute } from '../utils/auth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CollaboratorReportHistory from '../components/dashboard/CollaboratorReportHistory';
import '../assets/css/styles.css';

/**
 * Vista "Mis Reportes": lista simple de reportes creados por el usuario (igual que colaborador).
 * Ruta: /dashboard/mis-reportes (admin y soporte).
 */
const MisReportes = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = getUser();
    if (userData) {
      setUser(userData);
    } else {
      navigate('/', { replace: true });
      return;
    }
    if (!isAdmin() && !isSupport()) {
      navigate(getRoleRoute(userData.rol) || '/dashboard', { replace: true });
    }
  }, [navigate]);

  if (!user) {
    return null;
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 35%, var(--color-tertiary-dark) 100%)',
      }}
    >
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-24 md:pt-28 transition-all duration-500" style={{ maxWidth: '1280px' }}>
          <CollaboratorReportHistory />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MisReportes;
