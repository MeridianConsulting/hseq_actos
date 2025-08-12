<?php
// Limpiar cualquier salida previa
if (ob_get_length()) ob_clean();

// Configurar las cabeceras CORS - SOLO UNA VEZ
// Permitir definir orígenes permitidos desde .env, separados por comas
$allowed = getenv('CORS_ALLOWED_ORIGINS') ?: 'http://localhost:3000';
$origins = array_map('trim', explode(',', $allowed));
$requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($requestOrigin && in_array($requestOrigin, $origins, true)) {
    header('Access-Control-Allow-Origin: ' . $requestOrigin);
} else if (count($origins) === 1) {
    header('Access-Control-Allow-Origin: ' . $origins[0]);
}
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
// Solo permitir credenciales si se especifica un origen explícito
if (!empty($requestOrigin) && $requestOrigin !== '*') {
    header('Access-Control-Allow-Credentials: true');
}

// Si es una solicitud OPTIONS, terminar aquí
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>
