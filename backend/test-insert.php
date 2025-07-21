<?php
header('Content-Type: application/json');

try {
    require_once __DIR__ . '/config/db.php';
    require_once __DIR__ . '/controllers/reportController.php';
    
    // Datos de prueba
    $testData = [
        'id_usuario' => 2,
        'tipo_reporte' => 'incidentes',
        'asunto' => 'Test de inserción',
        'fecha_evento' => '2025-07-21',
        'grado_criticidad' => 'medio',
        'ubicacion_incidente' => 'Oficina principal',
        'hora_evento' => '14:30:00',
        'tipo_afectacion' => 'personas',
        'descripcion_incidente' => 'Descripción de prueba para verificar la inserción'
    ];
    
    $controller = new ReportController();
    $result = $controller->createReport($testData);
    
    echo json_encode([
        'success' => true,
        'test_result' => $result,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
}
?> 