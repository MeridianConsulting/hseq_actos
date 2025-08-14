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
// Exponer cabeceras útiles para el frontend (p.ej., Content-Disposition al descargar blobs)
header('Access-Control-Expose-Headers: Content-Disposition, Content-Type');
// Solo permitir credenciales si se especifica un origen explícito
if (!empty($requestOrigin) && $requestOrigin !== '*') {
    header('Access-Control-Allow-Credentials: true');
}

// Cabeceras de seguridad para todas las respuestas de la API (solo JSON)
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: strict-origin-when-cross-origin');
// Política de permisos mínima
header("Permissions-Policy: geolocation=(), microphone=(), camera=(), usb=(), payment=()");
// CSP muy estricta para API (no entrega HTML ejecutable)
// No aplicar CSP estricta a la ruta de evidencias (contenido binario)
if (!preg_match('#^/hseq/backend/api/evidencias/#', $_SERVER['REQUEST_URI'] ?? '')) {
    header("Content-Security-Policy: default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'");
}
// Evitar cachear respuestas sensibles por defecto
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

// Si es una solicitud OPTIONS, terminar aquí
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>
