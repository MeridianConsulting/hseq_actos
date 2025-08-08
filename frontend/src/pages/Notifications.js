import React from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getUser } from '../utils/auth';
import NotificationManager from '../components/NotificationManager';

const Notifications = () => {
    const navigate = useNavigate();

    // Verificar autenticación
    if (!isAuthenticated()) {
        navigate('/login');
        return null;
    }

    // Verificar permisos (solo admin y soporte)
    const user = getUser();
    if (user && !['admin', 'soporte'].includes(user.rol)) {
        navigate('/dashboard');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <NotificationManager />
                </div>
            </div>
        </div>
    );
};

export default Notifications;
