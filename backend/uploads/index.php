<?php
// Incluir el middleware CORS
require_once __DIR__ . '/../middleware/cors.php';

// Obtener el nombre del archivo solicitado
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);

// Extraer el nombre del archivo de la URL
$fileName = basename($path);

// Validar que el archivo existe y es una imagen
$filePath = __DIR__ . '/' . $fileName;

if (!file_exists($filePath)) {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Archivo no encontrado']);
    exit;
}

// Verificar que es una imagen permitida
$allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
$fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

if (!in_array($fileExtension, $allowedExtensions)) {
    http_response_code(403);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Tipo de archivo no permitido']);
    exit;
}

// Determinar el tipo MIME
$mimeTypes = [
    'jpg' => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'png' => 'image/png',
    'gif' => 'image/gif',
    'webp' => 'image/webp',
    'bmp' => 'image/bmp',
    'svg' => 'image/svg+xml'
];

$contentType = $mimeTypes[$fileExtension] ?? 'application/octet-stream';

// Configurar cabeceras para la imagen
header('Content-Type: ' . $contentType);
header('Content-Disposition: inline; filename="' . $fileName . '"');
header('Cache-Control: public, max-age=604800, immutable');
header('Cross-Origin-Resource-Policy: cross-origin');

// Servir el archivo
readfile($filePath);
exit;
?>
