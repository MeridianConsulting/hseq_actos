<?php
// Limpiar cualquier salida previa
if (ob_get_length()) ob_clean();

// Configurar las cabeceras CORS
$requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Lista de orígenes permitidos
$allowedOrigins = [
    'http://localhost:3000',
    'https://hseq.meridianltda.com',
    'http://hseq.meridianltda.com'
];

// Verificar si el origen de la petición está permitido
if ($requestOrigin && in_array($requestOrigin, $allowedOrigins)) {
    header('Access-Control-Allow-Origin: ' . $requestOrigin);
} else {
    // Si no hay origen o no está en la lista, permitir el dominio de producción por defecto
    header('Access-Control-Allow-Origin: https://hseq.meridianltda.com');
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Expose-Headers: Content-Disposition, Content-Type');

// Cabeceras de seguridad para todas las respuestas de la API
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: strict-origin-when-cross-origin');
header("Permissions-Policy: geolocation=(), microphone=(), camera=(), usb=(), payment=()");

// CSP ajustada para permitir recursos necesarios del frontend
// Siempre permitir Font Awesome y otros recursos CDN
header("Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; font-src 'self' https://cdnjs.cloudflare.com; frame-ancestors 'none'; base-uri 'none'; form-action 'none'");

// Evitar cachear respuestas sensibles por defecto
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

// Si es una solicitud OPTIONS, terminar aquí
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>
