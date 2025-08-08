<?php
// Limpiar cualquier salida previa
if (ob_get_length()) {
    ob_clean();
}

// Configurar para JSON únicamente - Deshabilitar completamente la salida de errores HTML
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
ini_set('log_errors', 1);
error_reporting(0);

// Configurar manejador de errores personalizado ANTES de incluir archivos
set_error_handler(function($severity, $message, $file, $line) {
    if (ob_get_length()) ob_clean();
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Error interno del servidor',
        'error' => $message,
        'file' => basename($file),
        'line' => $line
    ]);
    exit;
});

// Configurar manejador de excepciones
set_exception_handler(function($exception) {
    if (ob_get_length()) ob_clean();
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Error interno del servidor',
        'error' => $exception->getMessage(),
        'file' => basename($exception->getFile()),
        'line' => $exception->getLine()
    ]);
    exit;
});

require_once __DIR__ . '/middleware/cors.php';
require_once __DIR__ . '/utils/jwt.php';

// Asegurar que siempre devuelva JSON
header('Content-Type: application/json');

// Verificar que los archivos existan antes de incluirlos
if (!file_exists(__DIR__ . '/controllers/employeeController.php')) {
    echo json_encode(['success' => false, 'message' => 'employeeController.php no encontrado']);
    exit;
}

if (!file_exists(__DIR__ . '/controllers/authController.php')) {
    echo json_encode(['success' => false, 'message' => 'authController.php no encontrado']);
    exit;
}

if (!file_exists(__DIR__ . '/controllers/reportController.php')) {
    echo json_encode(['success' => false, 'message' => 'reportController.php no encontrado']);
    exit;
}

// Verificar que la base de datos esté disponible
if (!file_exists(__DIR__ . '/config/db.php')) {
    echo json_encode(['success' => false, 'message' => 'Configuración de base de datos no encontrada']);
    exit;
}

require_once __DIR__ . '/controllers/employeeController.php';
require_once __DIR__ . '/controllers/authController.php';
require_once __DIR__ . '/controllers/reportController.php';

// Iniciar buffer de salida para capturar errores
ob_start();

$method = $_SERVER['REQUEST_METHOD'];
$requestUri = $_SERVER['REQUEST_URI'];

// Extraer el path de la URL correctamente
$path = parse_url($requestUri, PHP_URL_PATH);

// Remover el directorio base del path
$scriptDir = dirname($_SERVER['SCRIPT_NAME']);
if ($scriptDir !== '/') {
    $path = str_replace($scriptDir, '', $path);
}

$path = trim($path, "/");

function handleRequest($method, $path){
    // Limpiar buffer antes de procesar
    if (ob_get_length()) ob_clean();
    
    $path = trim($path, "/");
    
    // Debug temporal
    error_log("Request: $method $path");
    
    // Ruta de login
    if($path === 'api/auth/login' && $method === "POST"){
        try {
            $input = file_get_contents("php://input");
            
            if (empty($input)) {
                http_response_code(400);
                echo json_encode([
                    "success" => false, 
                    "message" => "No se recibieron datos"
                ]);
                return;
            }
            
            $data = json_decode($input, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                http_response_code(400);
                echo json_encode([
                    "success" => false, 
                    "message" => "Datos JSON inválidos: " . json_last_error_msg()
                ]);
                return;
            }
            
            if (!$data || !isset($data['cedula']) || !isset($data['password'])) {
                http_response_code(400);
                echo json_encode([
                    "success" => false, 
                    "message" => "Faltan campos requeridos: cedula y password"
                ]);
                return;
            }
            
            if (empty($data['cedula']) || empty($data['password'])) {
                http_response_code(400);
                echo json_encode([
                    "success" => false, 
                    "message" => "Los campos cedula y password no pueden estar vacíos"
                ]);
                return;
            }
            
            $authController = new AuthController();
            $result = $authController->login($data['cedula'], $data['password']);
            
            if (!is_array($result)) {
                throw new Exception("Respuesta inválida del controlador de autenticación");
            }
            
            if($result['success']){
                http_response_code(200);
            } else {
                http_response_code(401);
            }
            
            echo json_encode($result);
            return;
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false, 
                "message" => "Error interno del servidor",
                "error" => $e->getMessage()
            ]);
            return;
        } catch (Error $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false, 
                "message" => "Error fatal del servidor",
                "error" => $e->getMessage()
            ]);
            return;
        }
    }
    
    // Middleware simple de autenticación para rutas protegidas
    $protectedPaths = [
        'api/reports',
        'api/users',
    ];

    $requiresAuth = false;
    foreach ($protectedPaths as $pp) {
        if ($path === $pp || str_starts_with($path, $pp . '/')) { $requiresAuth = true; break; }
    }

    if ($requiresAuth) {
        try {
            $token = jwt_from_authorization_header();
            if (!$token) {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'No autorizado: falta token']);
                return;
            }
            $claims = jwt_decode($token);
            // Opcional: exponer claims a handlers siguientes
            $GLOBALS['auth_user_id'] = (int)($claims['sub'] ?? 0);
            $GLOBALS['auth_user_role'] = $claims['rol'] ?? null;
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Token inválido: ' . $e->getMessage()]);
            return;
        }
    }

    // Helper para autorización por rol
    $requireRole = function(array $roles) {
        $role = $GLOBALS['auth_user_role'] ?? null;
        if (!$role || !in_array($role, $roles, true)) {
            http_response_code(403);
            echo json_encode(['success'=>false,'message'=>'Prohibido: rol no autorizado']);
            return false;
        }
        return true;
    };

    // Rutas de reportes
    if($path === 'api/reports' && $method === "POST"){
        try {
            $input = file_get_contents("php://input");
            
            if (empty($input)) {
                http_response_code(400);
                echo json_encode([
                    "success" => false, 
                    "message" => "No se recibieron datos"
                ]);
                return;
            }
            
            $data = json_decode($input, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                http_response_code(400);
                echo json_encode([
                    "success" => false, 
                    "message" => "Datos JSON inválidos: " . json_last_error_msg()
                ]);
                return;
            }
            
            // Validar que los datos requeridos estén presentes
            if (!isset($data['tipo_reporte']) || !isset($data['id_usuario'])) {
                http_response_code(400);
                echo json_encode([
                    "success" => false, 
                    "message" => "Faltan campos requeridos: tipo_reporte e id_usuario"
                ]);
                return;
            }
            
            $reportController = new ReportController();
            $result = $reportController->createReport($data);
            
            // Si el reporte se creó exitosamente y hay evidencia, procesarla
            if($result['success'] && isset($data['evidencia']) && !empty($data['evidencia'])){
                $evidenceResult = $reportController->uploadEvidence($result['report_id'], $data['evidencia']);
                if(!$evidenceResult['success']){
                    // Si falla la subida de evidencia, agregar advertencia pero no fallar el reporte
                    $result['evidence_warning'] = $evidenceResult['message'];
                }
            }
            
            if($result['success']){
                http_response_code(201);
            } else {
                http_response_code(400);
            }
            
            echo json_encode($result);
            return;
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false, 
                "message" => "Error interno del servidor",
                "error" => $e->getMessage()
            ]);
            return;
        } catch (Error $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false, 
                "message" => "Error fatal del servidor",
                "error" => $e->getMessage()
            ]);
            return;
        }
    }
    
    if($path === 'api/reports' && $method === "GET"){
        try {
            $reportController = new ReportController();
            
            // Obtener filtros de la URL
            $filters = [];
            if (isset($_GET['tipo_reporte'])) {
                $filters['tipo_reporte'] = $_GET['tipo_reporte'];
            }
            if (isset($_GET['estado'])) {
                $filters['estado'] = $_GET['estado'];
            }
            
            $result = $reportController->getAllReports($filters);
            echo json_encode($result);
            return;
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false, 
                "message" => "Error interno del servidor",
                "error" => $e->getMessage()
            ]);
            return;
        }
    }
    
    if($path === 'api/reports/user' && $method === "GET"){
        try {
            if (!isset($_GET['user_id'])) {
                http_response_code(400);
                echo json_encode([
                    "success" => false, 
                    "message" => "Se requiere user_id"
                ]);
                return;
            }
            
            $reportController = new ReportController();
            $result = $reportController->getReportsByUser($_GET['user_id']);
            echo json_encode($result);
            return;
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false, 
                "message" => "Error interno del servidor",
                "error" => $e->getMessage()
            ]);
            return;
        }
    }
    
    if($path === 'api/reports/stats' && $method === "GET"){
        try {
            $reportController = new ReportController();
            $result = $reportController->getReportStats();
            echo json_encode($result);
            return;
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false, 
                "message" => "Error interno del servidor",
                "error" => $e->getMessage()
            ]);
            return;
        }
    }
    
    // Endpoint para actualizar estado de reportes
    if($path === 'api/reports/status' && $method === "PUT"){
        if (!$requireRole(['soporte','admin'])) { return; }
        try {
            $input = file_get_contents("php://input");
            
            if (empty($input)) {
                http_response_code(400);
                echo json_encode([
                    "success" => false, 
                    "message" => "No se recibieron datos"
                ]);
                return;
            }
            
            $data = json_decode($input, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                http_response_code(400);
                echo json_encode([
                    "success" => false, 
                    "message" => "Datos JSON inválidos: " . json_last_error_msg()
                ]);
                return;
            }
            
            // Validar que los datos requeridos estén presentes
            if (!isset($data['report_id']) || !isset($data['status'])) {
                http_response_code(400);
                echo json_encode([
                    "success" => false, 
                    "message" => "Faltan campos requeridos: report_id y status"
                ]);
                return;
            }
            
            $reportController = new ReportController();
            $result = $reportController->updateReportStatus(
                $data['report_id'], 
                $data['status'], 
                $data['revisor_id'] ?? null, 
                $data['comentarios'] ?? null
            );
            
            if($result['success']){
                http_response_code(200);
            } else {
                http_response_code(400);
            }
            
            echo json_encode($result);
            return;
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false, 
                "message" => "Error interno del servidor",
                "error" => $e->getMessage()
            ]);
            return;
        }
    }

    // Endpoint para subir evidencia multipart
    if (preg_match('/^api\/reports\/(\d+)\/evidencias$/', $path, $m)) {
        if ($method !== 'POST') {
            http_response_code(405);
            echo json_encode(['success'=>false,'message'=>'Método no permitido']);
            return;
        }
        if (!$requireRole(['soporte','admin'])) { return; }
        $reportId = (int)$m[1];
        if (!isset($reportId)) {
            http_response_code(400);
            echo json_encode(['success'=>false,'message'=>'Reporte inválido']);
            return;
        }

        // Validar archivo
        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode(['success'=>false,'message'=>'Archivo no recibido o con error']);
            return;
        }

        $file = $_FILES['file'];
        $tmpPath = $file['tmp_name'];
        $mime = mime_content_type($tmpPath);
        $allowed = ['image/jpeg','image/png','image/gif','application/pdf', 'application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!in_array($mime, $allowed)) {
            http_response_code(400);
            echo json_encode(['success'=>false,'message'=>'Tipo de archivo no permitido']);
            return;
        }
        $size = filesize($tmpPath);
        if ($size === false || $size > 10 * 1024 * 1024) {
            http_response_code(400);
            echo json_encode(['success'=>false,'message'=>'Archivo demasiado grande (max 10MB)']);
            return;
        }

        $ext = pathinfo($file['name'], PATHINFO_EXTENSION) ?: 'bin';
        // Reusar lógica de ReportController vía método base64: construir estructura
        $evidenceData = [
            'data' => base64_encode(file_get_contents($tmpPath)),
            'type' => $mime,
            'extension' => $ext,
            'size' => $size,
        ];
        $controller = new ReportController();
        $result = $controller->uploadEvidence($reportId, $evidenceData);
        http_response_code($result['success'] ? 200 : 400);
        echo json_encode($result);
        return;
    }

    // Endpoint para obtener un reporte específico por ID
    if(preg_match('/^api\/reports\/(\d+)$/', $path, $matches) && $method === "GET"){
        try {
            $reportId = $matches[1];
            
            $reportController = new ReportController();
            $result = $reportController->getReportById($reportId);
            
            if($result['success']){
                http_response_code(200);
            } else {
                http_response_code(404);
            }
            
            echo json_encode($result);
            return;
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false, 
                "message" => "Error interno del servidor",
                "error" => $e->getMessage()
            ]);
            return;
        }
    }

    // Endpoint para actualizar un reporte
    if(preg_match('/^api\/reports\/(\d+)$/', $path, $matches) && $method === "PUT"){
        if (!$requireRole(['soporte','admin'])) { return; }
        try {
            $reportId = $matches[1];
            $input = file_get_contents("php://input");
            
            if (empty($input)) {
                http_response_code(400);
                echo json_encode([
                    "success" => false, 
                    "message" => "No se recibieron datos"
                ]);
                return;
            }
            
            $data = json_decode($input, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                http_response_code(400);
                echo json_encode([
                    "success" => false, 
                    "message" => "Datos JSON inválidos: " . json_last_error_msg()
                ]);
                return;
            }
            
            $reportController = new ReportController();
            $result = $reportController->updateReport($reportId, $data);
            
            if($result['success']){
                http_response_code(200);
            } else {
                http_response_code(400);
            }
            
            echo json_encode($result);
            return;
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false, 
                "message" => "Error interno del servidor",
                "error" => $e->getMessage()
            ]);
            return;
        }
    }

    // Endpoint para eliminar un reporte
    if(preg_match('/^api\/reports\/(\d+)$/', $path, $matches) && $method === "DELETE"){
        if (!$requireRole(['admin'])) { return; }
        try {
            $reportId = $matches[1];
            
            $reportController = new ReportController();
            $result = $reportController->deleteReport($reportId);
            
            if($result['success']){
                http_response_code(200);
            } else {
                http_response_code(400);
            }
            
            echo json_encode($result);
            return;
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false, 
                "message" => "Error interno del servidor",
                "error" => $e->getMessage()
            ]);
            return;
        }
    }

    // Rutas de administración de usuarios
    if($path === 'api/users' && $method === 'GET'){
        if (!$requireRole(['admin'])) { return; }
        try {
            $controller = new EmployeeController();
            $filters = [];
            if(isset($_GET['rol'])) $filters['rol'] = $_GET['rol'];
            if(isset($_GET['activo'])) $filters['activo'] = $_GET['activo'];
            if(isset($_GET['q'])) $filters['q'] = $_GET['q'];
            $result = $controller->getAllUsers($filters);
            echo json_encode($result);
            return;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([ 'success'=>false, 'message'=>'Error al listar usuarios', 'error'=>$e->getMessage() ]);
            return;
        }
    }
    elseif(preg_match('/^api\/users\/(\d+)$/', $path, $m) && $method === 'GET'){
        if (!$requireRole(['admin'])) { return; }
        try {
            $controller = new EmployeeController();
            $result = $controller->getUserById((int)$m[1]);
            echo json_encode($result);
            return;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([ 'success'=>false, 'message'=>'Error al obtener usuario', 'error'=>$e->getMessage() ]);
            return;
        }
    }
    elseif($path === 'api/users' && $method === 'POST'){
        if (!$requireRole(['admin'])) { return; }
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            if(!$data){ http_response_code(400); echo json_encode(['success'=>false,'message'=>'Datos inválidos']); return; }
            $controller = new EmployeeController();
            $result = $controller->createUser($data);
            http_response_code($result['success'] ? 201 : 400);
            echo json_encode($result);
            return;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([ 'success'=>false, 'message'=>'Error al crear usuario', 'error'=>$e->getMessage() ]);
            return;
        }
    }
    elseif(preg_match('/^api\/users\/(\d+)$/', $path, $m) && $method === 'PUT'){
        if (!$requireRole(['admin'])) { return; }
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            if(!$data){ http_response_code(400); echo json_encode(['success'=>false,'message'=>'Datos inválidos']); return; }
            $controller = new EmployeeController();
            $result = $controller->updateUser((int)$m[1], $data);
            http_response_code($result['success'] ? 200 : 400);
            echo json_encode($result);
            return;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([ 'success'=>false, 'message'=>'Error al actualizar usuario', 'error'=>$e->getMessage() ]);
            return;
        }
    }
    elseif(preg_match('/^api\/users\/(\d+)$/', $path, $m) && $method === 'DELETE'){
        if (!$requireRole(['admin'])) { return; }
        try {
            $controller = new EmployeeController();
            $result = $controller->deleteUser((int)$m[1]);
            http_response_code($result['success'] ? 200 : 400);
            echo json_encode($result);
            return;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([ 'success'=>false, 'message'=>'Error al eliminar usuario', 'error'=>$e->getMessage() ]);
            return;
        }
    }
    elseif(preg_match('/^api\/users\/(\d+)\/reset-password$/', $path, $m) && $method === 'POST'){
        if (!$requireRole(['admin'])) { return; }
        try {
    // Descargar evidencia de forma segura
    if (preg_match('/^api\/evidencias\/(\d+)$/', $path, $m) && $method === 'GET') {
        if (!$requireRole(['soporte','admin'])) { return; }
        $evidenceId = (int)$m[1];
        $conn = (new Database())->getConnection();
        $stmt = $conn->prepare('SELECT id_reporte, tipo_archivo, url_archivo FROM evidencias WHERE id = ?');
        if (!$stmt) { http_response_code(500); echo json_encode(['success'=>false,'message'=>'Error interno']); return; }
        $stmt->bind_param('i', $evidenceId);
        $stmt->execute();
        $res = $stmt->get_result();
        $row = $res->fetch_assoc();
        if (!$row) { http_response_code(404); echo json_encode(['success'=>false,'message'=>'Evidencia no encontrada']); return; }
        $filePath = __DIR__ . '/uploads/' . $row['url_archivo'];
        if (!is_file($filePath)) { http_response_code(404); echo json_encode(['success'=>false,'message'=>'Archivo no encontrado']); return; }
        header('Content-Type: ' . $row['tipo_archivo']);
        header('Content-Disposition: attachment; filename="' . basename($row['url_archivo']) . '"');
        header('Content-Length: ' . filesize($filePath));
        readfile($filePath);
        return;
    }
            $controller = new EmployeeController();
            $result = $controller->resetPassword((int)$m[1]);
            http_response_code($result['success'] ? 200 : 400);
            echo json_encode($result);
            return;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([ 'success'=>false, 'message'=>'Error al reiniciar contraseña', 'error'=>$e->getMessage() ]);
            return;
        }
    }
    // Endpoint de prueba para verificar funcionamiento
    elseif($path === 'api/test' && $method === "POST"){
        try {
            $input = file_get_contents("php://input");
            $data = json_decode($input, true);
            
            echo json_encode([
                "success" => true,
                "message" => "Endpoint de prueba funcionando",
                "received_data" => $data,
                "timestamp" => date('Y-m-d H:i:s')
            ]);
            return;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Error en endpoint de prueba",
                "error" => $e->getMessage()
            ]);
            return;
        }
    }

    // Endpoint para obtener estadísticas del dashboard
    elseif($path === 'api/reports/dashboard-stats' && $method === "GET"){
        try {
            $reportController = new ReportController();
            $result = $reportController->getDashboardStats();
            echo json_encode($result);
            return;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false, 
                "message" => "Error interno del servidor",
                "error" => $e->getMessage()
            ]);
            return;
        }
    }
    else{
        http_response_code(404);
        echo json_encode([
            "success" => false, 
            "message" => "Ruta no encontrada",
            "requested_path" => $path,
            "original_uri" => $_SERVER['REQUEST_URI'],
            "method" => $method,
            "script_name" => $_SERVER['SCRIPT_NAME'],
            "script_dir" => dirname($_SERVER['SCRIPT_NAME']),
            "debug_info" => [
                "path_trimmed" => trim($path, "/"),
                "document_root" => $_SERVER['DOCUMENT_ROOT'],
                "current_dir" => __DIR__
            ]
        ]);
    }
}

// Limpiar cualquier salida no deseada antes de procesar
$output = ob_get_clean();
if (!empty($output)) {
    // Si hay salida no deseada, registrarla y devolver error
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "message" => "Error: salida inesperada del servidor",
        "debug_output" => $output
    ]);
    exit;
}

// Iniciar nuevo buffer para la respuesta
ob_start();

try {
    handleRequest($method, $path);
} catch (Exception $e) {
    if (ob_get_length()) ob_clean();
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "message" => "Error del servidor",
        "error" => $e->getMessage()
    ]);
} catch (Error $e) {
    if (ob_get_length()) ob_clean();
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "message" => "Error fatal del servidor",
        "error" => $e->getMessage()
    ]);
}

// Enviar la respuesta
ob_end_flush();
?>