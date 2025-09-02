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
    $debug = strtolower(getenv('APP_DEBUG') ?: 'false') === 'true';
    $resp = [ 'success' => false, 'message' => 'Error interno del servidor' ];
    if ($debug) {
        $resp['error'] = $message; $resp['file'] = basename($file); $resp['line'] = $line;
    }
    echo json_encode($resp);
    exit;
});

// Configurar manejador de excepciones
set_exception_handler(function($exception) {
    if (ob_get_length()) ob_clean();
    header('Content-Type: application/json');
    http_response_code(500);
    $debug = strtolower(getenv('APP_DEBUG') ?: 'false') === 'true';
    $resp = [ 'success' => false, 'message' => 'Error interno del servidor' ];
    if ($debug) {
        $resp['error'] = $exception->getMessage();
        $resp['file'] = basename($exception->getFile());
        $resp['line'] = $exception->getLine();
    }
    echo json_encode($resp);
    exit;
});

// Cargar variables de entorno desde .env
require_once __DIR__ . '/utils/env.php';
if (function_exists('env_bootstrap')) { env_bootstrap(); }

require_once __DIR__ . '/middleware/cors.php';
require_once __DIR__ . '/utils/jwt.php';
require_once __DIR__ . '/config/db.php';

// Asegurar que siempre devuelva JSON
header('Content-Type: application/json');
// Deshabilitar cache por defecto para respuestas sensibles
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

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
$path = isset($_GET['path']) ? trim($_GET['path'], '/') : '';

function handleRequest($method, $path){
    // Limpiar buffer antes de procesar
    if (ob_get_length()) ob_clean();
    
    $path = trim($path, "/");
    
    // (log interno deshabilitado en producción)
    
    // Ruta de login
    if($path === 'auth/login' && $method === "POST"){
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
        'reports',
        'users',
    ];

    $requiresAuth = false;
    foreach ($protectedPaths as $pp) {
        if ($path === $pp || str_starts_with($path, $pp . '/')) { $requiresAuth = true; break; }
    }

    // Excepciones públicas (no requieren token) para GET
    if ($requiresAuth && $method === 'GET') {
        if (
            $path === 'reports' ||
            preg_match('/^reports\\/(\\d+)$/', $path) ||
            $path === 'reports/stats' ||
            $path === 'reports/dashboard-stats' ||
            $path === 'images' ||
            preg_match('/^evidencias\\/(\\d+)$/', $path)
        ) {
            $requiresAuth = false;
        }
    }

    // Descargar evidencia de forma segura (ruta independiente)
    if (preg_match('/^(?:api\/)?evidencias\/(\d+)$/', $path, $m) && $method === 'GET') {
        $evidenceId = (int)$m[1];
        $conn = (new Database())->getConnection();
        $stmt = $conn->prepare('SELECT id_reporte, tipo_archivo, url_archivo FROM evidencias WHERE id = ?');
        if (!$stmt) { http_response_code(500); echo json_encode(['success'=>false,'message'=>'Error interno']); return; }
        $stmt->bind_param('i', $evidenceId);
        $stmt->execute();
        $res = $stmt->get_result();
        $row = $res->fetch_assoc();
        if (!$row) { http_response_code(404); echo json_encode(['success'=>false,'message'=>'Evidencia no encontrada']); return; }

        // Si es imagen, no requerir token. Para otros tipos, exigirlo.
        $fileName = trim((string)$row['url_archivo']);
        $isImageType = false;
        $t = strtolower((string)($row['tipo_archivo'] ?? ''));
        if (str_starts_with($t, 'image/')) { $isImageType = true; }
        if (!$isImageType) {
            $ext = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
            if (in_array($ext, ['jpg','jpeg','png','gif','webp'], true)) { $isImageType = true; }
        }
        if (!$isImageType) {
            try {
                $token = jwt_from_authorization_header();
                if (!$token) { $token = $_GET['token'] ?? ''; }
                if (!$token) { http_response_code(401); echo json_encode(['success'=>false,'message'=>'No autorizado: falta token']); return; }
                $claims = jwt_decode($token);
                $role = $claims['rol'] ?? null;
                if (!$role || !in_array($role, ['soporte','admin'], true)) {
                    http_response_code(403);
                    echo json_encode(['success'=>false,'message'=>'Prohibido: rol no autorizado']);
                    return;
                }
            } catch (Exception $e) {
                http_response_code(401);
                echo json_encode(['success'=>false,'message'=>'Token inválido: ' . $e->getMessage()]);
                return;
            }
        }

        $filePath = __DIR__ . '/uploads/' . $fileName;
        if (!is_file($filePath)) {
            // Fallback: buscar por nombre base ignorando la extensión (p.ej. BD .png pero en disco .jpg)
            $base = pathinfo($fileName, PATHINFO_FILENAME);
            if ($base) {
                $candidates = glob(__DIR__ . '/uploads/' . $base . '.*');
                if (!empty($candidates)) {
                    $filePath = $candidates[0];
                }
            }
        }
        if (!is_file($filePath)) {
            http_response_code(404);
            $debug = strtolower(getenv('APP_DEBUG') ?: 'false') === 'true';
            $resp = ['success'=>false,'message'=>'Archivo no encontrado'];
            if ($debug) { $resp['expected'] = $fileName; $resp['resolved_path'] = $filePath; }
            echo json_encode($resp);
            return;
        }

        // Preparar cabeceras para contenido binario y soportar Range para streaming
        $size = filesize($filePath);
        // Determinar Content-Type de forma robusta (BD -> finfo -> extensión -> octet-stream)
        $contentType = $row['tipo_archivo'] ?? '';
        if (!$contentType) {
            $detected = function_exists('mime_content_type') ? @mime_content_type($filePath) : '';
            if ($detected) { $contentType = $detected; }
        }
        if (!$contentType || $contentType === 'application/octet-stream') {
            $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
            $map = [
                'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png', 'gif' => 'image/gif', 'webp' => 'image/webp',
                'pdf' => 'application/pdf',
                'mp4' => 'video/mp4', 'webm' => 'video/webm', 'ogg' => 'video/ogg', 'mov' => 'video/quicktime', 'qt' => 'video/quicktime',
                'doc' => 'application/msword', 'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];
            if (isset($map[$ext])) { $contentType = $map[$ext]; }
        }
        if (!$contentType) { $contentType = 'application/octet-stream'; }
        if (ob_get_length()) { ob_clean(); }
        // Limpiar cabeceras que interfieren con contenido binario
        foreach (['Content-Type','Content-Security-Policy','X-Frame-Options','Cache-Control','Pragma'] as $h) { @header_remove($h); }
        // Establecer cabeceras correctas para entrega binaria
        header('Content-Type: ' . $contentType);
        header('Content-Disposition: inline; filename="' . basename($row['url_archivo']) . '"');
        header('Cache-Control: private, max-age=86400');
        header('Content-Length: ' . $size);
        // Entrega simple del archivo (sin rangos) para evitar problemas en local
        $ok = @readfile($filePath);
        if ($ok === false) { http_response_code(500); echo json_encode(['success'=>false,'message'=>'Error al leer archivo']); }
        exit;
    }

    if ($requiresAuth) {
        try {
            $token = jwt_from_authorization_header();
            // Permitir token vía query param como fallback para pruebas y vistas directas
            if (!$token) { $token = $_GET['token'] ?? ''; }
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
    if($path === 'reports' && $method === "POST"){
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
                try {
                    $evidenceResult = $reportController->uploadEvidence($result['report_id'], $data['evidencia']);
                    if(!$evidenceResult['success']){
                        $result['evidence_warning'] = $evidenceResult['message'];
                    }
                } catch (Exception $e) {
                    $result['evidence_warning'] = 'Error al procesar evidencia: ' . $e->getMessage();
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
    
    if($path === 'reports' && $method === "GET"){
        try {
            $reportController = new ReportController();
            
            // Obtener filtros de la URL
            $filters = [];
            foreach ([
                'tipo_reporte','estado','user_id','grado_criticidad','tipo_afectacion','proyecto',
                'date_from','date_to','q','sort_by','sort_dir','page','per_page'
            ] as $key) {
                if (isset($_GET[$key]) && $_GET[$key] !== '') {
                    $filters[$key] = $_GET[$key];
                }
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
    
    if($path === 'reports/user' && $method === "GET"){
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
    
    if($path === 'reports/stats' && $method === "GET"){
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
    if($path === 'reports/status' && $method === "PUT"){
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

    // Endpoint para obtener reportes vencidos (>30 días)
    if($path === 'reports/overdue' && $method === 'GET'){
        try {
            if (!$requireRole(['soporte','admin'])) { return; }
            
            $conn = (new Database())->getConnection();
            $sql = "SELECT r.*, u.nombre as nombre_usuario, u.correo,
                           DATEDIFF(CURDATE(), DATE(r.creado_en)) as dias_vencido
                    FROM reportes r 
                    JOIN usuarios u ON r.id_usuario = u.id 
                    WHERE r.estado IN ('pendiente','en_revision') 
                    AND DATEDIFF(CURDATE(), DATE(r.creado_en)) > 30
                    ORDER BY r.creado_en ASC";
            $res = $conn->query($sql);
            $overdue = [];
            while ($row = $res->fetch_assoc()) {
                $overdue[] = $row;
            }
            echo json_encode(['success'=>true,'overdue'=>$overdue]);
            return;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success'=>false,'message'=>'Error al obtener reportes vencidos','error'=>$e->getMessage()]);
            return;
        }
    }

    // Endpoint para obtener reportes próximos a vencer (por defecto: a 5 días de vencer)
    if($path === 'reports/upcoming' && $method === 'GET'){
        try {
            if (!$requireRole(['soporte','admin'])) { return; }

            $daysBefore = isset($_GET['days_before']) ? (int)$_GET['days_before'] : 5; // días antes del límite de 30
            if ($daysBefore < 1) { $daysBefore = 1; }
            if ($daysBefore > 30) { $daysBefore = 30; }

            // Regla: reportes en estado abierto (pendiente o en_revision) cuyo tiempo desde creación
            // esté entre (30 - daysBefore) y 29 días inclusive.
            $conn = (new Database())->getConnection();
            $stmt = $conn->prepare("SELECT r.*, u.nombre as nombre_usuario, u.correo,
                            DATEDIFF(CURDATE(), DATE(r.creado_en)) as dias_transcurridos,
                            (30 - DATEDIFF(CURDATE(), DATE(r.creado_en))) as dias_para_vencer
                        FROM reportes r 
                        JOIN usuarios u ON r.id_usuario = u.id 
                        WHERE r.estado IN ('pendiente','en_revision') 
                        AND DATEDIFF(CURDATE(), DATE(r.creado_en)) BETWEEN (30 - ?) AND 29
                        ORDER BY dias_para_vencer ASC, r.creado_en ASC");
            if (!$stmt) { throw new Exception('Error preparando consulta'); }
            $stmt->bind_param('i', $daysBefore);
            $stmt->execute();
            $res = $stmt->get_result();
            $upcoming = [];
            while ($row = $res->fetch_assoc()) { $upcoming[] = $row; }
            $stmt->close();

            echo json_encode(['success'=>true,'upcoming'=>$upcoming,'days_before'=>$daysBefore]);
            return;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success'=>false,'message'=>'Error al obtener próximos a vencer','error'=>$e->getMessage()]);
            return;
        }
    }

    // Endpoint para probar envío de correos
    if($path === 'test-email' && $method === 'POST'){
        try {
            if (!$requireRole(['admin'])) { return; }
            
            $data = json_decode(file_get_contents('php://input'), true);
            if (!isset($data['to']) || !isset($data['subject']) || !isset($data['body'])) {
                http_response_code(400);
                echo json_encode(['success'=>false,'message'=>'Faltan campos: to, subject, body']);
                return;
            }
            
            // No forzar override aquí; usar .env MAIL_TEST_TO en su lugar
            
            $result = send_email($data['to'], $data['subject'], $data['body']);
            echo json_encode($result);
            return;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success'=>false,'message'=>'Error al enviar correo de prueba','error'=>$e->getMessage()]);
            return;
        }
    }

    // Endpoint para notificar reportes vencidos (>30 días sin cerrar)
    if($path === 'reports/notify-overdue' && $method === 'POST'){
        try {
            // solo soporte/admin
            if (!isset($GLOBALS['auth_user_role']) || !in_array($GLOBALS['auth_user_role'], ['soporte','admin'], true)) {
                http_response_code(403);
                echo json_encode(['success'=>false,'message'=>'Prohibido']);
                return;
            }
            
            // No forzar override aquí; usar .env MAIL_TEST_TO en su lugar
            
            $conn = (new Database())->getConnection();
            $sql = "SELECT r.id FROM reportes r WHERE r.estado IN ('pendiente','en_revision') AND DATEDIFF(CURDATE(), DATE(r.creado_en)) > 30";
            $res = $conn->query($sql);
            $rc = new ReportController();
            $count = 0;
            $results = [];
            while ($row = $res->fetch_assoc()) {
                try {
                    $rc->notifyReportEvent((int)$row['id'], 'vencido', []);
                    $count++;
                    $results[] = ['id' => $row['id'], 'status' => 'sent'];
                } catch (Exception $e) {
                    $results[] = ['id' => $row['id'], 'status' => 'error', 'error' => $e->getMessage()];
                }
            }
            echo json_encode(['success'=>true,'processed'=>$count,'results'=>$results]);
            return;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success'=>false,'message'=>'Error al notificar vencidos','error'=>$e->getMessage()]);
            return;
        }
    }

    // Endpoint para notificar por correo a todos los miembros HSEQ (soporte y admin)
    // sobre reportes próximos a vencer. Permite recibir HTML ya renderizado (por ejemplo
    // desde una plantilla React Email renderizada por Node) y asunto personalizado.
    if($path === 'reports/notify-upcoming' && $method === 'POST'){
        try {
            if (!isset($GLOBALS['auth_user_role']) || !in_array($GLOBALS['auth_user_role'], ['soporte','admin'], true)) {
                http_response_code(403);
                echo json_encode(['success'=>false,'message'=>'Prohibido']);
                return;
            }

            $payload = json_decode(file_get_contents('php://input'), true) ?? [];
            $daysBefore = isset($payload['days_before']) ? (int)$payload['days_before'] : 5;
            if ($daysBefore < 1) { $daysBefore = 1; }
            if ($daysBefore > 30) { $daysBefore = 30; }

            $subject = isset($payload['subject']) && $payload['subject'] !== ''
                ? $payload['subject']
                : "[HSEQ] Reportes próximos a vencer (≤ {$daysBefore} días)";
            $html = $payload['html'] ?? null;

            $conn = (new Database())->getConnection();

            // Obtener destinatarios HSEQ (soporte y admin activos)
            $destStmt = $conn->prepare("SELECT correo FROM usuarios WHERE activo = 1 AND rol IN ('soporte','admin')");
            if (!$destStmt) { throw new Exception('Error al preparar destinatarios'); }
            $destStmt->execute();
            $destRes = $destStmt->get_result();
            $recipients = [];
            while ($r = $destRes->fetch_assoc()) { if (!empty($r['correo'])) $recipients[] = $r['correo']; }
            $destStmt->close();

            if (empty($recipients)) {
                echo json_encode(['success'=>false,'message'=>'No hay destinatarios HSEQ activos']);
                return;
            }

            // Si no nos pasaron HTML, construir un HTML básico como respaldo
            if ($html === null) {
                $stmt = $conn->prepare("SELECT r.id, r.tipo_reporte, r.asunto, r.asunto_conversacion, r.estado, r.creado_en, u.nombre as nombre_usuario,
                            DATEDIFF(CURDATE(), DATE(r.creado_en)) as dias_transcurridos,
                            (30 - DATEDIFF(CURDATE(), DATE(r.creado_en))) as dias_para_vencer
                        FROM reportes r 
                        JOIN usuarios u ON r.id_usuario = u.id 
                        WHERE r.estado IN ('pendiente','en_revision') 
                        AND DATEDIFF(CURDATE(), DATE(r.creado_en)) BETWEEN (30 - ?) AND 29
                        ORDER BY dias_para_vencer ASC, r.creado_en ASC");
                if (!$stmt) { throw new Exception('Error preparando consulta'); }
                $stmt->bind_param('i', $daysBefore);
                $stmt->execute();
                $res = $stmt->get_result();
                $rows = [];
                while ($row = $res->fetch_assoc()) { $rows[] = $row; }
                $stmt->close();

                $htmlRows = '';
                foreach ($rows as $row) {
                    $titulo = htmlspecialchars($row['asunto'] ?: ($row['asunto_conversacion'] ?: '(sin asunto)'));
                    $htmlRows .= '<tr>'
                        . '<td style="padding:8px;border:1px solid #eee;">#' . (int)$row['id'] . '</td>'
                        . '<td style="padding:8px;border:1px solid #eee;">' . htmlspecialchars($row['tipo_reporte']) . '</td>'
                        . '<td style="padding:8px;border:1px solid #eee;">' . $titulo . '</td>'
                        . '<td style="padding:8px;border:1px solid #eee;">' . htmlspecialchars($row['nombre_usuario']) . '</td>'
                        . '<td style="padding:8px;border:1px solid #eee;">' . (int)$row['dias_para_vencer'] . ' días</td>'
                        . '<td style="padding:8px;border:1px solid #eee;">' . htmlspecialchars($row['estado']) . '</td>'
                        . '</tr>';
                }
                $html = '<div style="font-family:Arial,Helvetica,sans-serif;">'
                    . '<h2 style="color:#111;">Reportes próximos a vencer (≤ ' . (int)$daysBefore . ' días)</h2>'
                    . '<p>Resumen automático generado por HSEQ.</p>'
                    . '<table style="border-collapse:collapse;width:100%;font-size:14px;">'
                    . '<thead><tr>'
                    . '<th style="padding:8px;border:1px solid #eee;text-align:left;">ID</th>'
                    . '<th style="padding:8px;border:1px solid #eee;text-align:left;">Tipo</th>'
                    . '<th style="padding:8px;border:1px solid #eee;text-align:left;">Título</th>'
                    . '<th style="padding:8px;border:1px solid #eee;text-align:left;">Usuario</th>'
                    . '<th style="padding:8px;border:1px solid #eee;text-align:left;">Vence en</th>'
                    . '<th style="padding:8px;border:1px solid #eee;text-align:left;">Estado</th>'
                    . '</tr></thead>'
                    . '<tbody>' . $htmlRows . '</tbody>'
                    . '</table>'
                    . '<hr/><p style="color:#666;">Este es un mensaje automático. No responder.</p>'
                    . '</div>';
            }

            // Enviar a cada destinatario (respeta MAIL_TEST_TO si está configurado)
            $sent = 0; $details = [];
            foreach ($recipients as $to) {
                $r = send_email($to, $subject, $html);
                $details[] = ['to'=>$to,'success'=>$r['success'] ?? false,'message'=>$r['message'] ?? ''];
                if (!empty($r['success'])) { $sent++; }
            }

            echo json_encode(['success'=>true,'sent'=>$sent,'recipients'=>count($recipients),'details'=>$details]);
            return;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success'=>false,'message'=>'Error al notificar próximos a vencer','error'=>$e->getMessage()]);
            return;
        }
    }

    // Endpoint para subir evidencia multipart
    if (preg_match('/^(?:api\/)?reports\/(\d+)\/evidencias$/', $path, $m)) {
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
        // Tipos permitidos: imágenes, PDF, Word y videos comunes
        $allowed = [
            'image/jpeg','image/png','image/gif',
            'application/pdf',
            'application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'video/mp4','video/webm','video/ogg','video/quicktime'
        ];
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

    // Endpoint público para listar imágenes (solo metadatos y URLs públicas)
    if ($path === 'images' && $method === 'GET') {
        try {
            $conn = (new Database())->getConnection();
            // Permitir filtros simples opcionales
            $reportId = isset($_GET['report_id']) ? (int)$_GET['report_id'] : null;
            $limit = isset($_GET['limit']) ? max(1, min(200, (int)$_GET['limit'])) : 100;
            $offset = isset($_GET['offset']) ? max(0, (int)$_GET['offset']) : 0;

            $where = "WHERE (tipo_archivo LIKE 'image/%' OR url_archivo REGEXP '\\.(jpg|jpeg|png|gif|webp)$')";
            $types = '';
            $params = [];
            if ($reportId) {
                $where .= ' AND id_reporte = ?';
                $types .= 'i';
                $params[] = $reportId;
            }

            $sql = "SELECT id, id_reporte, tipo_archivo, url_archivo, creado_en FROM evidencias $where ORDER BY creado_en DESC LIMIT ? OFFSET ?";
            $stmt = $conn->prepare($sql);
            if (!$stmt) { throw new Exception('Error preparando consulta'); }
            // bind dinámico
            if ($types) {
                $types .= 'ii';
                $params[] = $limit;
                $params[] = $offset;
                $stmt->bind_param($types, ...$params);
            } else {
                $stmt->bind_param('ii', $limit, $offset);
            }
            $stmt->execute();
            $res = $stmt->get_result();
            $rows = [];
            while ($row = $res->fetch_assoc()) {
                $fileName = $row['url_archivo'];
                // Construir URL pública absoluta hacia /uploads
                $scheme = 'http';
                if ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')) {
                    $scheme = 'https';
                }
                $basePath = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\');
                $publicUrl = $scheme . '://' . $_SERVER['HTTP_HOST'] . $basePath . '/uploads/' . $fileName;
                $rows[] = [
                    'id' => (int)$row['id'],
                    'report_id' => (int)$row['id_reporte'],
                    'content_type' => $row['tipo_archivo'],
                    'file_name' => $fileName,
                    'created_at' => $row['creado_en'],
                    'url' => $publicUrl,
                ];
            }
            $stmt->close();

            http_response_code(200);
            echo json_encode(['success' => true, 'images' => $rows]);
            return;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success'=>false,'message'=>'Error al listar imágenes','error'=>$e->getMessage()]);
            return;
        }
    }

    // Endpoint para obtener un reporte específico por ID
    if(preg_match('/^(?:api\/)?reports\/(\d+)$/', $path, $matches) && $method === "GET"){
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
    if(preg_match('/^(?:api\/)?reports\/(\d+)$/', $path, $matches) && $method === "PUT"){
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
    if(preg_match('/^(?:api\/)?reports\/(\d+)$/', $path, $matches) && $method === "DELETE"){
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
        if (!$requireRole(['admin', 'soporte'])) { return; }
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
    elseif($path === 'test' && $method === "POST"){
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

    // Endpoint de debug para verificar archivos en uploads
    elseif($path === 'debug/uploads' && $method === "GET"){
        try {
            $uploadDir = __DIR__ . '/uploads/';
            $files = [];
            
            if (is_dir($uploadDir)) {
                $fileList = scandir($uploadDir);
                foreach ($fileList as $file) {
                    if ($file !== '.' && $file !== '..') {
                        $filePath = $uploadDir . $file;
                        $files[] = [
                            'name' => $file,
                            'size' => filesize($filePath),
                            'modified' => date('Y-m-d H:i:s', filemtime($filePath)),
                            'path' => $filePath
                        ];
                    }
                }
            }
            
            echo json_encode([
                'success' => true,
                'upload_dir' => $uploadDir,
                'dir_exists' => is_dir($uploadDir),
                'files' => $files,
                'total_files' => count($files)
            ]);
            return;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error al listar archivos',
                'error' => $e->getMessage()
            ]);
            return;
        }
    }
    // Endpoint para obtener estadísticas del dashboard
    elseif($path === 'reports/dashboard-stats' && $method === "GET"){
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
    // Endpoint para servir archivos de uploads
    elseif(preg_match('/^(?:api\/)?uploads\/(.+)$/', $path, $matches) && $method === "GET"){
        try {
            $fileName = $matches[1];
            
            // Validar nombre de archivo para evitar directory traversal
            if (strpos($fileName, '..') !== false || strpos($fileName, '/') !== false) {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Nombre de archivo inválido"
                ]);
                return;
            }
            
            // Asegurar que el directorio de uploads existe
            $uploadDir = __DIR__ . '/uploads/';
            if (!is_dir($uploadDir)) {
                if (!@mkdir($uploadDir, 0755, true)) {
                    http_response_code(500);
                    echo json_encode([
                        "success" => false,
                        "message" => "Error: No se pudo crear el directorio de uploads",
                        "upload_dir" => $uploadDir
                    ]);
                    return;
                }
            }
            
            $filePath = $uploadDir . $fileName;
            
            if (!file_exists($filePath)) {
                http_response_code(404);
                echo json_encode([
                    "success" => false,
                    "message" => "Archivo no encontrado",
                    "file_path" => $filePath
                ]);
                return;
            }
            
            // Determinar el tipo MIME basado en la extensión
            $extension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
            $mimeTypes = [
                'jpg' => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'gif' => 'image/gif',
                'pdf' => 'application/pdf',
                'doc' => 'application/msword',
                'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];
            
            $contentType = $mimeTypes[$extension] ?? 'application/octet-stream';
            
            // Servir el archivo
            header('Content-Type: ' . $contentType);
            header('Content-Length: ' . filesize($filePath));
            header('Cache-Control: public, max-age=31536000'); // Cache por 1 año
            readfile($filePath);
            return;
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Error al servir archivo",
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