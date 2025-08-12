import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/api';

const NotificationManager = () => {
    const [overdueReports, setOverdueReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notificationResult, setNotificationResult] = useState(null);
    const [testEmailData, setTestEmailData] = useState({
        to: 'desarrolloit@meridian.com.co',
        subject: 'Prueba de correo HSEQ',
        body: '<p>Este es un correo de prueba del sistema HSEQ.</p>'
    });
    const [testResult, setTestResult] = useState(null);

    useEffect(() => {
        loadOverdueReports();
    }, []);

    const loadOverdueReports = async () => {
        try {
            setLoading(true);
            const result = await notificationService.getOverdueReports();
            if (result.success) {
                setOverdueReports(result.overdue || []);
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const handleNotifyOverdue = async () => {
        try {
            setLoading(true);
            setNotificationResult(null);
            
            const result = await notificationService.notifyOverdueReports();
            setNotificationResult(result);
            
            if (result.success) {
                // Recargar reportes vencidos
                await loadOverdueReports();
            }
        } catch (error) {
            setNotificationResult({
                success: false,
                message: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleTestEmail = async () => {
        try {
            setLoading(true);
            setTestResult(null);
            
            const result = await notificationService.testEmail(testEmailData);
            setTestResult(result);
        } catch (error) {
            setTestResult({
                success: false,
                message: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestión de Notificaciones</h1>
            
            {/* Sección de Prueba de Correo */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Prueba de Correo</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Destinatario
                        </label>
                        <input
                            type="email"
                            value={testEmailData.to}
                            onChange={(e) => setTestEmailData({...testEmailData, to: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Asunto
                        </label>
                        <input
                            type="text"
                            value={testEmailData.subject}
                            onChange={(e) => setTestEmailData({...testEmailData, subject: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={handleTestEmail}
                            disabled={loading}
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Enviando...' : 'Enviar Prueba'}
                        </button>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contenido (HTML)
                    </label>
                    <textarea
                        value={testEmailData.body}
                        onChange={(e) => setTestEmailData({...testEmailData, body: e.target.value})}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                
                {testResult && (
                    <div className={`mt-4 p-4 rounded-md ${
                        testResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                    }`}>
                        <p className="font-medium">
                            {testResult.success ? '✓ Correo enviado exitosamente' : '✗ Error al enviar correo'}
                        </p>
                        <p className="text-sm mt-1">{testResult.message}</p>
                    </div>
                )}
            </div>

            {/* Sección de Reportes Vencidos */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Reportes Vencidos ({overdueReports.length})
                    </h2>
                    <button
                        onClick={handleNotifyOverdue}
                        disabled={loading || overdueReports.length === 0}
                        className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50"
                    >
                        {loading ? 'Enviando...' : 'Notificar Todos'}
                    </button>
                </div>

                {notificationResult && (
                    <div className={`mb-4 p-4 rounded-md ${
                        notificationResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                    }`}>
                        <p className="font-medium">
                            {notificationResult.success 
                                ? `✓ Notificaciones enviadas: ${notificationResult.processed}` 
                                : '✗ Error al enviar notificaciones'
                            }
                        </p>
                        <p className="text-sm mt-1">{notificationResult.message}</p>
                        {notificationResult.results && (
                            <div className="mt-2 text-xs">
                                <p>Detalles:</p>
                                <ul className="list-disc list-inside">
                                    {notificationResult.results.map((result, index) => (
                                        <li key={index}>
                                            Reporte #{result.id}: {result.status}
                                            {result.error && ` - ${result.error}`}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {loading && overdueReports.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Cargando reportes vencidos...</p>
                    </div>
                ) : overdueReports.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-600">No hay reportes vencidos (>30 días)</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Usuario
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tipo
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Creado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Días Vencido
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {overdueReports.map((report) => (
                                    <tr key={report.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{report.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {report.nombre_usuario}
                                            <br />
                                            <span className="text-xs text-gray-500">{report.correo}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                report.tipo_reporte === 'incidentes' ? 'bg-red-100 text-red-800' :
                                                report.tipo_reporte === 'hallazgos' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-blue-100 text-blue-800'
                                            }`}>
                                                {report.tipo_reporte}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                report.estado === 'pendiente' ? 'bg-gray-100 text-gray-800' :
                                                report.estado === 'en_revision' ? 'bg-blue-100 text-blue-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                                {report.estado}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatDate(report.creado_en)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                                {report.dias_vencido} días
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationManager;
