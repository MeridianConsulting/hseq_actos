<?php
/**
 * Script de prueba para el sistema de notificaciones
 * Ejecutar desde la línea de comandos: php test_notifications.php
 */

require_once __DIR__ . '/backend/config/db.php';
require_once __DIR__ . '/backend/utils/mailer.php';
require_once __DIR__ . '/backend/controllers/reportController.php';

echo "=== PRUEBA DEL SISTEMA DE NOTIFICACIONES ===\n\n";

// 1. Probar configuración de correo
echo "1. Probando configuración de correo...\n";
putenv('MAIL_TEST_TO=desarrolloit@meridian.com.co');
putenv('MAIL_FROM=no-reply@hseq.local');

$testResult = send_email(
    'test@example.com', 
    '[HSEQ] Prueba de correo', 
    '<p>Este es un correo de prueba del sistema HSEQ.</p>'
);

echo "Resultado: " . ($testResult['success'] ? '✓ Exitoso' : '✗ Falló') . "\n";
echo "Mensaje: " . $testResult['message'] . "\n\n";

// 2. Probar obtención de reportes vencidos
echo "2. Probando obtención de reportes vencidos...\n";
try {
    $conn = (new Database())->getConnection();
    $sql = "SELECT r.*, u.nombre as nombre_usuario, u.correo,
                   DATEDIFF(CURDATE(), DATE(r.creado_en)) as dias_vencido
            FROM reportes r 
            JOIN usuarios u ON r.id_usuario = u.id 
            WHERE r.estado IN ('pendiente','en_revision') 
            AND DATEDIFF(CURDATE(), DATE(r.creado_en)) > 30
            ORDER BY r.creado_en ASC";
    $res = $conn->query($sql);
    $overdue = [];
    while ($row = $res->fetch_assoc()) {
        $overdue[] = $row;
    }
    echo "Reportes vencidos encontrados: " . count($overdue) . "\n";
    foreach ($overdue as $report) {
        echo "  - Reporte #{$report['id']}: {$report['nombre_usuario']} ({$report['dias_vencido']} días)\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
echo "\n";

// 3. Probar notificación de reportes vencidos
echo "3. Probando notificación de reportes vencidos...\n";
try {
    $rc = new ReportController();
    $count = 0;
    foreach ($overdue as $report) {
        try {
            $rc->notifyReportEvent((int)$report['id'], 'vencido', []);
            $count++;
            echo "  ✓ Notificación enviada para reporte #{$report['id']}\n";
        } catch (Exception $e) {
            echo "  ✗ Error en reporte #{$report['id']}: " . $e->getMessage() . "\n";
        }
    }
    echo "Total de notificaciones enviadas: $count\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
echo "\n";

// 4. Verificar tabla de notificaciones
echo "4. Verificando tabla de notificaciones...\n";
try {
    $sql = "SELECT COUNT(*) as total FROM notificaciones";
    $res = $conn->query($sql);
    $total = $res->fetch_assoc()['total'];
    echo "Total de notificaciones registradas: $total\n";
    
    $sql = "SELECT * FROM notificaciones ORDER BY id DESC LIMIT 5";
    $res = $conn->query($sql);
    echo "Últimas 5 notificaciones:\n";
    while ($row = $res->fetch_assoc()) {
        echo "  - ID: {$row['id']}, Reporte: {$row['id_reporte']}, Destinatario: {$row['destinatario']}\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

echo "\n=== PRUEBA COMPLETADA ===\n";
?>
