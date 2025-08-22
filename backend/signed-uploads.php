<?php
/**
 * Servidor de archivos con URLs firmadas
 * Permite acceso temporal a archivos con autenticación HMAC
 */

// Configuración
$SECRET_KEY = 'tu_clave_secreta_muy_larga_y_compleja_aqui_2024'; // CAMBIAR EN PRODUCCIÓN
$UPLOADS_DIR = __DIR__ . '/uploads/';
$DEFAULT_TTL = 600; // 10 minutos en segundos

// Headers CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 86400');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Validar parámetros requeridos
$file = $_GET['f'] ?? '';
$exp = $_GET['exp'] ?? '';
$sig = $_GET['sig'] ?? '';

if (empty($file) || empty($exp) || empty($sig)) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Parámetros requeridos: f (archivo), exp (expiración), sig (firma)'
    ]);
    exit;
}

// Validar expiración
$expiration = (int)$exp;
$now = time();

if ($expiration < $now) {
    http_response_code(401);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'URL expirada',
        'expired_at' => date('Y-m-d H:i:s', $expiration),
        'current_time' => date('Y-m-d H:i:s', $now)
    ]);
    exit;
}

// Validar firma HMAC
$expectedSignature = hash_hmac('sha256', $file . '|' . $exp, $SECRET_KEY);

if (!hash_equals($expectedSignature, $sig)) {
    http_response_code(401);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Firma inválida'
    ]);
    exit;
}

// Sanitizar nombre de archivo
$fileName = basename($file);
$filePath = $UPLOADS_DIR . $fileName;

// Validar que el archivo existe y está dentro del directorio permitido
if (!file_exists($filePath) || !is_file($filePath)) {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Archivo no encontrado',
        'file' => $fileName
    ]);
    exit;
}

// Validar que el archivo está dentro del directorio de uploads
$realPath = realpath($filePath);
$uploadsRealPath = realpath($UPLOADS_DIR);

if (!$realPath || strpos($realPath, $uploadsRealPath) !== 0) {
    http_response_code(403);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Acceso denegado'
    ]);
    exit;
}

// Determinar tipo MIME
$extension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
$mimeTypes = [
    'jpg' => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'png' => 'image/png',
    'gif' => 'image/gif',
    'webp' => 'image/webp',
    'bmp' => 'image/bmp',
    'svg' => 'image/svg+xml',
    'pdf' => 'application/pdf'
];

$contentType = $mimeTypes[$extension] ?? 'application/octet-stream';

// Configurar headers
header('Content-Type: ' . $contentType);
header('Content-Disposition: inline; filename="' . $fileName . '"');
header('Content-Length: ' . filesize($filePath));
header('Cache-Control: public, max-age=300'); // 5 minutos de cache
header('Expires: ' . gmdate('D, d M Y H:i:s \G\M\T', time() + 300));
header('Last-Modified: ' . gmdate('D, d M Y H:i:s \G\M\T', filemtime($filePath)));

// Servir archivo
readfile($filePath);
exit;
?>
