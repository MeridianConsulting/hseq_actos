<?php
/**
 * Script de diagnóstico para uploads
 * Verifica archivos, permisos y rutas
 */

// Configuración
$UPLOADS_DIR = __DIR__ . '/uploads/';
$REAL_PATH = '/home/eufbe81hvmyp/public_html/hseq.meridianltda.com/backend/uploads/';

// Headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Función para verificar archivo
function checkFile($fileName) {
    global $UPLOADS_DIR, $REAL_PATH;
    
    $results = [];
    
    // Verificar en directorio local
    $localPath = $UPLOADS_DIR . $fileName;
    $results['local'] = [
        'path' => $localPath,
        'exists' => file_exists($localPath),
        'is_file' => is_file($localPath),
        'readable' => is_readable($localPath),
        'size' => file_exists($localPath) ? filesize($localPath) : null,
        'permissions' => file_exists($localPath) ? substr(sprintf('%o', fileperms($localPath)), -4) : null,
        'owner' => file_exists($localPath) ? posix_getpwuid(fileowner($localPath))['name'] : null,
        'group' => file_exists($localPath) ? posix_getgrgid(filegroup($localPath))['name'] : null,
        'modified' => file_exists($localPath) ? date('Y-m-d H:i:s', filemtime($localPath)) : null
    ];
    
    // Verificar en ruta real del servidor
    $realPath = $REAL_PATH . $fileName;
    $results['real'] = [
        'path' => $realPath,
        'exists' => file_exists($realPath),
        'is_file' => is_file($realPath),
        'readable' => is_readable($realPath),
        'size' => file_exists($realPath) ? filesize($realPath) : null,
        'permissions' => file_exists($realPath) ? substr(sprintf('%o', fileperms($realPath)), -4) : null,
        'owner' => file_exists($realPath) ? posix_getpwuid(fileowner($realPath))['name'] : null,
        'group' => file_exists($realPath) ? posix_getgrgid(filegroup($realPath))['name'] : null,
        'modified' => file_exists($realPath) ? date('Y-m-d H:i:s', filemtime($realPath)) : null
    ];
    
    return $results;
}

// Función para verificar directorio
function checkDirectory($path) {
    return [
        'path' => $path,
        'exists' => is_dir($path),
        'readable' => is_readable($path),
        'writable' => is_writable($path),
        'permissions' => is_dir($path) ? substr(sprintf('%o', fileperms($path)), -4) : null,
        'owner' => is_dir($path) ? posix_getpwuid(fileowner($path))['name'] : null,
        'group' => is_dir($path) ? posix_getgrgid(filegroup($path))['name'] : null,
        'contents' => is_dir($path) ? array_slice(scandir($path), 0, 10) : null // Primeros 10 archivos
    ];
}

// Obtener parámetros
$action = $_GET['action'] ?? 'info';
$fileName = $_GET['file'] ?? '';

// Información del servidor
$serverInfo = [
    'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'N/A',
    'script_name' => $_SERVER['SCRIPT_NAME'] ?? 'N/A',
    'request_uri' => $_SERVER['REQUEST_URI'] ?? 'N/A',
    'http_host' => $_SERVER['HTTP_HOST'] ?? 'N/A',
    'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'N/A',
    'php_version' => PHP_VERSION,
    'current_user' => get_current_user(),
    'current_working_dir' => getcwd()
];

// Respuesta según acción
switch ($action) {
    case 'check_file':
        if (empty($fileName)) {
            http_response_code(400);
            echo json_encode(['error' => 'Parámetro "file" requerido']);
            exit;
        }
        
        $fileInfo = checkFile($fileName);
        echo json_encode([
            'success' => true,
            'file' => $fileName,
            'checks' => $fileInfo,
            'server_info' => $serverInfo
        ]);
        break;
        
    case 'check_directory':
        $dirInfo = [
            'local' => checkDirectory($UPLOADS_DIR),
            'real' => checkDirectory($REAL_PATH)
        ];
        
        echo json_encode([
            'success' => true,
            'directories' => $dirInfo,
            'server_info' => $serverInfo
        ]);
        break;
        
    case 'list_files':
        $files = [];
        if (is_dir($UPLOADS_DIR)) {
            $items = scandir($UPLOADS_DIR);
            foreach ($items as $item) {
                if ($item !== '.' && $item !== '..' && is_file($UPLOADS_DIR . $item)) {
                    $files[] = [
                        'name' => $item,
                        'size' => filesize($UPLOADS_DIR . $item),
                        'modified' => date('Y-m-d H:i:s', filemtime($UPLOADS_DIR . $item)),
                        'permissions' => substr(sprintf('%o', fileperms($UPLOADS_DIR . $item)), -4)
                    ];
                }
            }
        }
        
        echo json_encode([
            'success' => true,
            'files' => $files,
            'count' => count($files),
            'directory' => $UPLOADS_DIR
        ]);
        break;
        
    default:
        // Información general
        echo json_encode([
            'success' => true,
            'message' => 'Script de diagnóstico de uploads',
            'actions' => [
                'check_file' => '?action=check_file&file=nombre_archivo.jpg',
                'check_directory' => '?action=check_directory',
                'list_files' => '?action=list_files'
            ],
            'server_info' => $serverInfo,
            'paths' => [
                'local_uploads_dir' => $UPLOADS_DIR,
                'real_uploads_dir' => $REAL_PATH
            ]
        ]);
}
?>
