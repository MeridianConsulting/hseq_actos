import React, { useEffect } from 'react';

const Notification = ({ 
    type = 'info', 
    message, 
    onClose, 
    duration = 5000,
    show = false 
}) => {
    useEffect(() => {
        if (show && duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            
            return () => clearTimeout(timer);
        }
    }, [show, duration, onClose]);

    if (!show) return null;

    const getNotificationStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-green-500 bg-opacity-20 border-green-400 text-green-200';
            case 'error':
                return 'bg-red-500 bg-opacity-20 border-red-400 text-red-200';
            case 'warning':
                return 'bg-yellow-500 bg-opacity-20 border-yellow-400 text-yellow-200';
            case 'info':
            default:
                return 'bg-blue-500 bg-opacity-20 border-blue-400 text-blue-200';
        }
    };

    return (
        <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 p-4 rounded-lg shadow-lg z-50 ${getNotificationStyles()}`}>
            <p className="text-white text-sm">{message}</p>
        </div>
    );
};

export default Notification; 