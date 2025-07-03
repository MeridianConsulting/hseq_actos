<?php
// Deshabilitar errores HTML completamente
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
ini_set('log_errors', 1);
error_reporting(0);

// Limpiar cualquier salida previa
if (ob_get_length()) {
    ob_clean();
}

// Headers CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

// Manejar preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Solo permitir POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false, 
        'message' => 'Método no permitido. Solo POST.'
    ]);
    exit();
}

try {
    // Incluir controlador de autenticación
    require_once __DIR__ . '/config/db.php';
    require_once __DIR__ . '/controllers/authController.php';
    
    // Obtener datos del request
    $input = file_get_contents("php://input");
    
    if (empty($input)) {
        http_response_code(400);
        echo json_encode([
            "success" => false, 
            "message" => "No se recibieron datos"
        ]);
        exit();
    }
    
    $data = json_decode($input, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode([
            "success" => false, 
            "message" => "Datos JSON inválidos: " . json_last_error_msg()
        ]);
        exit();
    }
    
    if (!$data || !isset($data['cedula']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode([
            "success" => false, 
            "message" => "Faltan campos requeridos: cedula y password"
        ]);
        exit();
    }
    
    if (empty($data['cedula']) || empty($data['password'])) {
        http_response_code(400);
        echo json_encode([
            "success" => false, 
            "message" => "Los campos cedula y password no pueden estar vacíos"
        ]);
        exit();
    }
    
    // Crear instancia del controlador y realizar login
    $authController = new AuthController();
    $result = $authController->login($data['cedula'], $data['password']);
    
    if (!is_array($result)) {
        throw new Exception("Respuesta inválida del controlador de autenticación");
    }
    
    // Responder según el resultado
    if($result['success']){
        http_response_code(200);
    } else {
        http_response_code(401);
    }
    
    echo json_encode($result);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "message" => "Error interno del servidor",
        "error" => $e->getMessage()
    ]);
} catch (Error $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "message" => "Error fatal del servidor",
        "error" => $e->getMessage()
    ]);
}
?> 