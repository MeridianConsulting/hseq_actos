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
    
    // Rutas existentes de empleados
    if($path === 'api/employees' && $method === "GET"){
        $controller = new EmployeeController();
        $result = $controller->getAllEmployees();
        echo json_encode($result);
    }
    elseif($path === 'api/employees/{id}' && $method === "GET"){
        $controller = new EmployeeController();
        $result = $controller->getEmployeeById($_GET['id']);
        echo json_encode($result);
    }
    elseif($path === 'api/employees' && $method === "POST"){
        $data = json_decode(file_get_contents("php://input"), true);
        if(!$data){
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Datos inválidos"]);
            return;
        }
    }elseif($path === 'api/employees/{id}' && $method === "DELETE"){
        $controller = new EmployeeController();
        $result = $controller->deleteEmployee($_GET['id']);
        echo json_encode($result);
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