<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../utils/mailer.php';

class ReportController {
    private $conn;
    
    // Constantes para validación de ENUMs
    private const TIPOS_REPORTE_VALIDOS = ['hallazgos', 'incidentes', 'conversaciones'];
    private const ESTADOS_VALIDOS = ['pendiente', 'en_revision', 'aprobado', 'rechazado'];
    private const TIPOS_HALLAZGO_VALIDOS = ['accion_mejoramiento', 'aspecto_positivo', 'condicion_insegura', 'acto_inseguro'];
    private const ESTADOS_CONDICION_VALIDOS = ['abierta', 'cerrada'];
    private const GRADOS_CRITICIDAD_VALIDOS = ['bajo', 'medio', 'alto', 'critico'];
    private const TIPOS_AFECTACION_VALIDOS = ['personas', 'medio_ambiente', 'instalaciones', 'vehiculos', 'seguridad_procesos', 'operaciones'];
    private const TIPOS_CONVERSACION_VALIDOS = ['reflexion', 'conversacion'];
    
    public function __construct() {
        global $db;
        if (!$db) {
            throw new Exception("No se pudo establecer conexión con la base de datos");
        }
        $this->conn = $db;
        
        // Verificar que la conexión esté activa
        if ($this->conn->connect_error) {
            throw new Exception("Error de conexión a la base de datos: " . $this->conn->connect_error);
        }
    }
    
    /**
     * Validar campos ENUM según el tipo de reporte
     */
    private function validateEnumFields($data, $tipoReporte) {
        $errors = [];
        
        // Validar tipo de reporte
        if (!in_array($data['tipo_reporte'], self::TIPOS_REPORTE_VALIDOS)) {
            $errors[] = "Tipo de reporte inválido. Valores permitidos: " . implode(', ', self::TIPOS_REPORTE_VALIDOS);
        }
        
        // Validar campos específicos según tipo de reporte
        switch ($tipoReporte) {
            case 'hallazgos':
                if (isset($data['tipo_hallazgo']) && !in_array($data['tipo_hallazgo'], self::TIPOS_HALLAZGO_VALIDOS)) {
                    $errors[] = "Tipo de hallazgo inválido. Valores permitidos: " . implode(', ', self::TIPOS_HALLAZGO_VALIDOS);
                }
                if (isset($data['estado_condicion']) && !in_array($data['estado_condicion'], self::ESTADOS_CONDICION_VALIDOS)) {
                    $errors[] = "Estado de condición inválido. Valores permitidos: " . implode(', ', self::ESTADOS_CONDICION_VALIDOS);
                }
                break;
                
            case 'incidentes':
                if (isset($data['grado_criticidad']) && !in_array($data['grado_criticidad'], self::GRADOS_CRITICIDAD_VALIDOS)) {
                    $errors[] = "Grado de criticidad inválido. Valores permitidos: " . implode(', ', self::GRADOS_CRITICIDAD_VALIDOS);
                }
                if (isset($data['tipo_afectacion']) && !in_array($data['tipo_afectacion'], self::TIPOS_AFECTACION_VALIDOS)) {
                    $errors[] = "Tipo de afectación inválido. Valores permitidos: " . implode(', ', self::TIPOS_AFECTACION_VALIDOS);
                }
                break;
                
            case 'conversaciones':
                if (isset($data['tipo_conversacion']) && !in_array($data['tipo_conversacion'], self::TIPOS_CONVERSACION_VALIDOS)) {
                    $errors[] = "Tipo de conversación inválido. Valores permitidos: " . implode(', ', self::TIPOS_CONVERSACION_VALIDOS);
                }
                break;
        }
        
        return $errors;
    }
    
    /**
     * Sanitizar datos de entrada
     */
    private function sanitizeInput($data) {
        $sanitized = [];
        foreach ($data as $key => $value) {
            if (is_string($value)) {
                $sanitized[$key] = htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
            } else {
                $sanitized[$key] = $value;
            }
        }
        return $sanitized;
    }
    
    /**
     * Crear un nuevo reporte
     */
    public function createReport($data) {
        try {
            // Limpieza de logs visibles: no registrar datos del usuario en producción
            
            // Verificar conexión a la base de datos
            if (!$this->conn || $this->conn->connect_error) {
                throw new Exception("Error de conexión a la base de datos");
            }
            
            // Sanitizar datos de entrada
            $data = $this->sanitizeInput($data);
            
            // Validar datos requeridos
            if (!isset($data['tipo_reporte']) || !isset($data['id_usuario'])) {
                return [
                    'success' => false,
                    'message' => 'Faltan campos requeridos: tipo_reporte e id_usuario'
                ];
            }
            
            // Validar campos ENUM
            $enumErrors = $this->validateEnumFields($data, $data['tipo_reporte']);
            if (!empty($enumErrors)) {
                return [
                    'success' => false,
                    'message' => 'Errores de validación: ' . implode(', ', $enumErrors)
                ];
            }
            
            // Validar campos específicos según tipo de reporte
            $validationErrors = $this->validateReportFields($data, $data['tipo_reporte']);
            if (!empty($validationErrors)) {
                return [
                    'success' => false,
                    'message' => 'Errores de validación: ' . implode(', ', $validationErrors)
                ];
            }
            
            // Preparar la consulta SQL base
            $sql = "INSERT INTO reportes (
                id_usuario, 
                tipo_reporte, 
                asunto, 
                descripcion_general,
                fecha_evento,
                lugar_hallazgo,
                lugar_hallazgo_otro,
                tipo_hallazgo,
                descripcion_hallazgo,
                recomendaciones,
                estado_condicion,
                grado_criticidad,
                ubicacion_incidente,
                hora_evento,
                tipo_afectacion,
                descripcion_incidente,
                tipo_conversacion,
                sitio_evento_conversacion,
                lugar_hallazgo_conversacion,
                lugar_hallazgo_conversacion_otro,
                descripcion_conversacion,
                asunto_conversacion
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = $this->conn->prepare($sql);
            
            if (!$stmt) {
                throw new Exception("Error preparando la consulta: " . $this->conn->error);
            }
            
            // Extraer valores a variables para bind_param (SOLUCIÓN AL PROBLEMA)
            $id_usuario = $data['id_usuario'];
            $tipo_reporte = $data['tipo_reporte'];
            $asunto = $data['asunto'] ?? $data['asunto_conversacion'] ?? null;
            $descripcion_general = $data['descripcion_general'] ?? null;
            $fecha_evento = $data['fecha_evento'] ?? null;
            $lugar_hallazgo = $data['lugar_hallazgo'] ?? null;
            $lugar_hallazgo_otro = $data['lugar_hallazgo_otro'] ?? null;
            $tipo_hallazgo = $data['tipo_hallazgo'] ?? null;
            $descripcion_hallazgo = $data['descripcion_hallazgo'] ?? null;
            $recomendaciones = $data['recomendaciones'] ?? null;
            $estado_condicion = $data['estado_condicion'] ?? null;
            $grado_criticidad = $data['grado_criticidad'] ?? null;
            $ubicacion_incidente = $data['ubicacion_incidente'] ?? null;
            $hora_evento = $data['hora_evento'] ?? null;
            $tipo_afectacion = $data['tipo_afectacion'] ?? null;
            $descripcion_incidente = $data['descripcion_incidente'] ?? null;
            $tipo_conversacion = $data['tipo_conversacion'] ?? null;
            $sitio_evento_conversacion = $data['sitio_evento_conversacion'] ?? null;
            $lugar_hallazgo_conversacion = $data['lugar_hallazgo_conversacion'] ?? null;
            $lugar_hallazgo_conversacion_otro = $data['lugar_hallazgo_conversacion_otro'] ?? null;
            $descripcion_conversacion = $data['descripcion_conversacion'] ?? null;
            $asunto_conversacion = $data['asunto_conversacion'] ?? null;
            
            // Bind de parámetros usando variables (no expresiones de array)
            $stmt->bind_param("isssssssssssssssssssss",
                $id_usuario,
                $tipo_reporte,
                $asunto,
                $descripcion_general,
                $fecha_evento,
                $lugar_hallazgo,
                $lugar_hallazgo_otro,
                $tipo_hallazgo,
                $descripcion_hallazgo,
                $recomendaciones,
                $estado_condicion,
                $grado_criticidad,
                $ubicacion_incidente,
                $hora_evento,
                $tipo_afectacion,
                $descripcion_incidente,
                $tipo_conversacion,
                $sitio_evento_conversacion,
                $lugar_hallazgo_conversacion,
                $lugar_hallazgo_conversacion_otro,
                $descripcion_conversacion,
                $asunto_conversacion
            );
            
            // Ejecutar la consulta
            if (!$stmt->execute()) {
                throw new Exception("Error ejecutando la consulta: " . $stmt->error);
            }
            
            $reportId = $this->conn->insert_id;
            
            $stmt->close();

            // Notificar creación de reporte (no bloquear si mail falla)
            try { $this->notifyReportEvent($reportId, 'creacion', $data); } catch (Exception $e) { /* silencioso */ }

            return [
                'success' => true,
                'message' => 'Reporte creado exitosamente',
                'report_id' => $reportId
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al crear el reporte: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Validar campos específicos según tipo de reporte
     */
    private function validateReportFields($data, $tipoReporte) {
        $errors = [];
        
        // Validar fecha_evento (formato YYYY-MM-DD)
        if (isset($data['fecha_evento']) && !empty($data['fecha_evento'])) {
            if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $data['fecha_evento'])) {
                $errors[] = "Formato de fecha inválido. Use YYYY-MM-DD";
            }
        }
        
        // Validar hora_evento (formato HH:MM:SS)
        if (isset($data['hora_evento']) && !empty($data['hora_evento'])) {
            if (!preg_match('/^\d{2}:\d{2}:\d{2}$/', $data['hora_evento'])) {
                $errors[] = "Formato de hora inválido. Use HH:MM:SS";
            }
        }
        
        // Validar campos específicos según tipo
        switch ($tipoReporte) {
            case 'hallazgos':
                if (empty($data['asunto'])) {
                    $errors[] = "El campo 'asunto' es requerido para hallazgos";
                }
                if (empty($data['lugar_hallazgo'])) {
                    $errors[] = "El campo 'lugar_hallazgo' es requerido para hallazgos";
                }
                if (empty($data['tipo_hallazgo'])) {
                    $errors[] = "El campo 'tipo_hallazgo' es requerido para hallazgos";
                }
                if (empty($data['descripcion_hallazgo'])) {
                    $errors[] = "El campo 'descripcion_hallazgo' es requerido para hallazgos";
                }
                if (empty($data['estado_condicion'])) {
                    $errors[] = "El campo 'estado_condicion' es requerido para hallazgos";
                }
                break;
                
            case 'incidentes':
                if (empty($data['asunto'])) {
                    $errors[] = "El campo 'asunto' es requerido para incidentes";
                }
                if (empty($data['grado_criticidad'])) {
                    $errors[] = "El campo 'grado_criticidad' es requerido para incidentes";
                }
                if (empty($data['ubicacion_incidente'])) {
                    $errors[] = "El campo 'ubicacion_incidente' es requerido para incidentes";
                }
                if (empty($data['tipo_afectacion'])) {
                    $errors[] = "El campo 'tipo_afectacion' es requerido para incidentes";
                }
                if (empty($data['descripcion_incidente'])) {
                    $errors[] = "El campo 'descripcion_incidente' es requerido para incidentes";
                }
                break;
                
            case 'conversaciones':
                if (empty($data['asunto_conversacion'])) {
                    $errors[] = "El campo 'asunto_conversacion' es requerido para conversaciones";
                }
                if (empty($data['tipo_conversacion'])) {
                    $errors[] = "El campo 'tipo_conversacion' es requerido para conversaciones";
                }
                if (empty($data['sitio_evento_conversacion'])) {
                    $errors[] = "El campo 'sitio_evento_conversacion' es requerido para conversaciones";
                }
                if (empty($data['descripcion_conversacion'])) {
                    $errors[] = "El campo 'descripcion_conversacion' es requerido para conversaciones";
                }
                break;
        }
        
        return $errors;
    }
    
    /**
     * Subir evidencia para un reporte
     */
    public function uploadEvidence($reportId, $evidenceData) {
        try {
            // Validar existencia del reporte
            $sql = "SELECT id FROM reportes WHERE id = ?";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("i", $reportId);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows === 0) {
                return [ 'success' => false, 'message' => 'Reporte no encontrado' ];
            }
            $stmt->close();

            // Validar estructura de datos
            if (!isset($evidenceData['data']) || !isset($evidenceData['type']) || !isset($evidenceData['extension'])) {
                return [ 'success' => false, 'message' => 'Datos de evidencia incompletos' ];
            }

            // Decodificar base64 de manera segura
            $fileData = base64_decode($evidenceData['data'], true);
            if ($fileData === false) {
                return [ 'success' => false, 'message' => 'Error al decodificar datos base64' ];
            }

            // Detectar MIME real a partir del contenido (con fallback si fileinfo no está disponible)
            $detectedType = '';
            if (class_exists('finfo')) {
                try {
                    $fi = new finfo(FILEINFO_MIME_TYPE);
                    $detectedType = $fi->buffer($fileData) ?: '';
                } catch (Throwable $e) {
                    $detectedType = '';
                }
            }

            // Listas de tipos permitidos
            $allowedTypes = [
                'image/jpeg','image/png','image/gif','image/webp',
                'application/pdf',
                'application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];
            if (!in_array($detectedType, $allowedTypes, true)) {
                // Intentar usar el tipo declarado si es permitido
                if (in_array($evidenceData['type'], $allowedTypes, true)) {
                    $detectedType = $evidenceData['type'];
                } else {
                    // Detectar si es imagen por contenido aunque no tengamos MIME
                    if (function_exists('getimagesizefromstring')) {
                        $imgInfo = @getimagesizefromstring($fileData);
                        if (is_array($imgInfo)) {
                            $detectedType = 'image/jpeg';
                        }
                    }
                }
            }
            if (!in_array($detectedType, $allowedTypes, true)) {
                return [ 'success' => false, 'message' => 'Tipo de archivo no permitido' ];
            }

            // Validar tamaño (si viene proveído)
            $maxSize = 10 * 1024 * 1024; // 10 MB
            if (isset($evidenceData['size']) && (int)$evidenceData['size'] > $maxSize) {
                return [ 'success' => false, 'message' => 'El archivo es demasiado grande. Máximo 10MB' ];
            }

            // Asegurar directorio de subida
            $uploadDir = __DIR__ . '/../uploads/';
            if (!is_dir($uploadDir)) { @mkdir($uploadDir, 0755, true); }

            // Determinar si es imagen y aplicar compresión/redimensionado
            $isImage = str_starts_with($detectedType, 'image/');
            $targetExtension = strtolower($evidenceData['extension'] ?: 'bin');

            $finalBinary = $fileData;
            $finalMime = $detectedType ?: $evidenceData['type'];

            if ($isImage) {
                // Cargar imagen desde binario (GD)
                $img = function_exists('imagecreatefromstring') ? @imagecreatefromstring($fileData) : false;
                if ($img !== false) {
                    $origW = imagesx($img);
                    $origH = imagesy($img);
                    $maxDim = 1920; // límite de dimensión
                    $scale = 1.0;
                    if ($origW > $maxDim || $origH > $maxDim) {
                        $scale = min($maxDim / max(1,$origW), $maxDim / max(1,$origH));
                    }
                    $newW = (int)floor($origW * $scale);
                    $newH = (int)floor($origH * $scale);
                    if ($newW < 1) { $newW = $origW; }
                    if ($newH < 1) { $newH = $origH; }

                    $dst = function_exists('imagecreatetruecolor') ? imagecreatetruecolor($newW, $newH) : null;
                    if ($dst) {
                    // Fondo blanco para preservar transparencia al convertir a JPEG
                        $white = imagecolorallocate($dst, 255, 255, 255);
                        imagefill($dst, 0, 0, $white);
                        imagecopyresampled($dst, $img, 0, 0, 0, 0, $newW, $newH, $origW, $origH);

                    // Exportar como JPEG con calidad 85
                        ob_start();
                        if (function_exists('imagejpeg')) {
                            imagejpeg($dst, null, 85);
                        }
                        $compressed = ob_get_clean();
                        imagedestroy($dst);
                        imagedestroy($img);
                        if ($compressed !== false && strlen($compressed) > 0) {
                            $finalBinary = $compressed;
                            $finalMime = 'image/jpeg';
                            $targetExtension = 'jpg';
                        }
                    } else {
                        // Si no hay GD, mantener original
                        imagedestroy($img);
                    }
                }
            }

            // Nombre final de archivo
            $fileName = 'evidencia_' . $reportId . '_' . time() . '_' . uniqid() . '.' . $targetExtension;
            $uploadPath = $uploadDir . $fileName;

            // Escribir a disco
            if (file_put_contents($uploadPath, $finalBinary) === false) {
                return [ 'success' => false, 'message' => 'Error al guardar el archivo' ];
            }

            // Guardar referencia en BD
            $sql = "INSERT INTO evidencias (id_reporte, tipo_archivo, url_archivo) VALUES (?, ?, ?)";
            $stmt = $this->conn->prepare($sql);
            $tipoParaGuardar = $finalMime ?: $evidenceData['type'];
            $stmt->bind_param("iss", $reportId, $tipoParaGuardar, $fileName);
            if (!$stmt->execute()) {
                @unlink($uploadPath);
                throw new Exception("Error guardando referencia en base de datos: " . $stmt->error);
            }
            $evidenceId = $this->conn->insert_id;
            $stmt->close();

            // Limpieza de memoria
            unset($fileData, $finalBinary);
            if (function_exists('gc_collect_cycles')) { gc_collect_cycles(); }

            return [
                'success' => true,
                'message' => 'Evidencia subida exitosamente',
                'evidence_id' => $evidenceId,
                'file_name' => $fileName
            ];

        } catch (Exception $e) {
            return [ 'success' => false, 'message' => 'Error al subir evidencia: ' . $e->getMessage() ];
        }
    }
    
    /**
     * Obtener mensaje de error de subida de archivo
     */
    private function getUploadErrorMessage($errorCode) {
        switch ($errorCode) {
            case UPLOAD_ERR_INI_SIZE:
                return 'El archivo excede el tamaño máximo permitido por el servidor';
            case UPLOAD_ERR_FORM_SIZE:
                return 'El archivo excede el tamaño máximo permitido por el formulario';
            case UPLOAD_ERR_PARTIAL:
                return 'El archivo se subió parcialmente';
            case UPLOAD_ERR_NO_FILE:
                return 'No se subió ningún archivo';
            case UPLOAD_ERR_NO_TMP_DIR:
                return 'Falta la carpeta temporal';
            case UPLOAD_ERR_CANT_WRITE:
                return 'Error al escribir el archivo en disco';
            case UPLOAD_ERR_EXTENSION:
                return 'Una extensión de PHP detuvo la subida del archivo';
            default:
                return 'Error desconocido al subir archivo';
        }
    }
    
    /**
     * Obtener reportes por usuario
     */
    public function getReportsByUser($userId) {
        try {
            $sql = "SELECT r.*, u.nombre as nombre_usuario, u.Proyecto as proyecto_usuario 
                    FROM reportes r 
                    JOIN usuarios u ON r.id_usuario = u.id 
                    WHERE r.id_usuario = ? 
                    ORDER BY r.creado_en DESC";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("i", $userId);
            $stmt->execute();
            
            $result = $stmt->get_result();
            $reports = [];
            
            while ($row = $result->fetch_assoc()) {
                $reports[] = $row;
            }
            
            $stmt->close();
            
            return [
                'success' => true,
                'reports' => $reports
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al obtener reportes: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Obtener todos los reportes (para coordinadores y admin)
     */
    public function getAllReports($filters = []) {
        try {
            // Base query
            $baseSql = "FROM reportes r JOIN usuarios u ON r.id_usuario = u.id";
            $whereConditions = [];
            $params = [];
            $types = "";

            // Filtros exactos
            if (!empty($filters['tipo_reporte'])) {
                $whereConditions[] = "r.tipo_reporte = ?";
                $params[] = $filters['tipo_reporte'];
                $types .= "s";
            }
            if (!empty($filters['estado'])) {
                $whereConditions[] = "r.estado = ?";
                $params[] = $filters['estado'];
                $types .= "s";
            }
            if (!empty($filters['user_id'])) {
                $whereConditions[] = "r.id_usuario = ?";
                $params[] = (int)$filters['user_id'];
                $types .= "i";
            }
            if (!empty($filters['grado_criticidad'])) {
                $whereConditions[] = "r.grado_criticidad = ?";
                $params[] = $filters['grado_criticidad'];
                $types .= "s";
            }
            if (!empty($filters['tipo_afectacion'])) {
                $whereConditions[] = "r.tipo_afectacion = ?";
                $params[] = $filters['tipo_afectacion'];
                $types .= "s";
            }

            // Filtros por fecha (usamos creado_en)
            if (!empty($filters['date_from'])) {
                $whereConditions[] = "DATE(r.creado_en) >= ?";
                $params[] = $filters['date_from'];
                $types .= "s";
            }
            if (!empty($filters['date_to'])) {
                $whereConditions[] = "DATE(r.creado_en) <= ?";
                $params[] = $filters['date_to'];
                $types .= "s";
            }

            // Búsqueda libre (q)
            if (!empty($filters['q'])) {
                $q = '%' . $filters['q'] . '%';
                $whereConditions[] = "(r.asunto LIKE ? OR r.descripcion_general LIKE ? OR r.descripcion_incidente LIKE ? OR r.descripcion_hallazgo LIKE ? OR r.asunto_conversacion LIKE ?)";
                array_push($params, $q, $q, $q, $q, $q);
                $types .= "sssss";
            }

            $whereSql = '';
            if (!empty($whereConditions)) {
                $whereSql = ' WHERE ' . implode(' AND ', $whereConditions);
            }

            // Ordenamiento seguro
            $allowedSortBy = ['creado_en','fecha_evento','grado_criticidad','estado'];
            $sortByRequested = $filters['sort_by'] ?? 'creado_en';
            $sortBy = in_array($sortByRequested, $allowedSortBy, true) ? $sortByRequested : 'creado_en';
            $sortDir = strtolower($filters['sort_dir'] ?? 'desc');
            $sortDir = $sortDir === 'asc' ? 'ASC' : 'DESC';

            // Paginación
            $page = max(1, (int)($filters['page'] ?? 1));
            $perPage = (int)($filters['per_page'] ?? 10);
            if ($perPage <= 0) $perPage = 10;
            if ($perPage > 100) $perPage = 100;
            $offset = ($page - 1) * $perPage;

            // Total de registros
            $countSql = "SELECT COUNT(*) as total " . $baseSql . $whereSql;
            $countStmt = $this->conn->prepare($countSql);
            if (!empty($params)) {
                $countStmt->bind_param($types, ...$params);
            }
            $countStmt->execute();
            $countRes = $countStmt->get_result()->fetch_assoc();
            $total = (int)($countRes['total'] ?? 0);
            $countStmt->close();

            // Query principal
            // Inyectar LIMIT/OFFSET de forma segura (valores casteados arriba)
            $selectSql = "SELECT r.*, u.nombre as nombre_usuario, u.Proyecto as proyecto_usuario " . $baseSql . $whereSql . " ORDER BY r.$sortBy $sortDir LIMIT $perPage OFFSET $offset";
            $stmt = $this->conn->prepare($selectSql);

            if ($stmt === false) {
                throw new Exception('Error preparando consulta de listados: ' . $this->conn->error);
            }

            if (!empty($params)) {
                $stmt->bind_param($types, ...$params);
            }

            $stmt->execute();
            $result = $stmt->get_result();
            $reports = [];

            while ($row = $result->fetch_assoc()) {
                $reports[] = $row;
            }

            $stmt->close();

            return [
                'success' => true,
                'reports' => $reports,
                'meta' => [
                    'page' => $page,
                    'per_page' => $perPage,
                    'total' => $total,
                    'total_pages' => $perPage > 0 ? (int)ceil($total / $perPage) : 1,
                    'sort_by' => $sortBy,
                    'sort_dir' => strtolower($sortDir)
                ]
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al obtener reportes: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Obtener un reporte específico por ID
     */
    public function getReportById($reportId) {
        try {
            $sql = "SELECT r.*, u.nombre as nombre_usuario, u.Proyecto as proyecto_usuario 
                    FROM reportes r 
                    JOIN usuarios u ON r.id_usuario = u.id 
                    WHERE r.id = ?";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("i", $reportId);
            $stmt->execute();
            
            $result = $stmt->get_result();
            $report = $result->fetch_assoc();
            
            if (!$report) {
                return [
                    'success' => false,
                    'message' => 'Reporte no encontrado'
                ];
            }
            
            // Obtener evidencias asociadas
            $sqlEvidencias = "SELECT * FROM evidencias WHERE id_reporte = ?";
            $stmtEvidencias = $this->conn->prepare($sqlEvidencias);
            $stmtEvidencias->bind_param("i", $reportId);
            $stmtEvidencias->execute();
            
            $resultEvidencias = $stmtEvidencias->get_result();
            $evidencias = [];
            
            while ($row = $resultEvidencias->fetch_assoc()) {
                $evidencias[] = $row;
            }
            
            $report['evidencias'] = $evidencias;
            
            $stmt->close();
            $stmtEvidencias->close();
            
            return [
                'success' => true,
                'report' => $report
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al obtener reporte: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Actualizar estado de un reporte
     */
    public function updateReportStatus($reportId, $status, $revisorId = null, $comentarios = null) {
        try {
            // Validar estado
            if (!in_array($status, self::ESTADOS_VALIDOS)) {
                return [
                    'success' => false,
                    'message' => 'Estado inválido. Valores permitidos: ' . implode(', ', self::ESTADOS_VALIDOS)
                ];
            }
            
            $sql = "UPDATE reportes SET 
                    estado = ?, 
                    revisado_por = ?, 
                    comentarios_revision = ?,
                    fecha_revision = CURRENT_TIMESTAMP
                    WHERE id = ?";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("sisi", $status, $revisorId, $comentarios, $reportId);
            
            if (!$stmt->execute()) {
                throw new Exception("Error actualizando reporte: " . $stmt->error);
            }
            
            if ($stmt->affected_rows === 0) {
                return [
                    'success' => false,
                    'message' => 'Reporte no encontrado'
                ];
            }
            
            $stmt->close();

            // Notificar cambio de estado
            $this->notifyReportEvent($reportId, 'estado', [
                'nuevo_estado' => $status,
                'revisor_id' => $revisorId,
                'comentarios' => $comentarios
            ]);

            return [
                'success' => true,
                'message' => 'Estado del reporte actualizado exitosamente'
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al actualizar reporte: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Obtener estadísticas de reportes
     */
    public function getReportStats() {
        try {
            $sql = "SELECT 
                        tipo_reporte,
                        estado,
                        COUNT(*) as cantidad
                    FROM reportes 
                    GROUP BY tipo_reporte, estado";
            
            $result = $this->conn->query($sql);
            $stats = [];
            
            while ($row = $result->fetch_assoc()) {
                $stats[] = $row;
            }
            
            return [
                'success' => true,
                'stats' => $stats
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al obtener estadísticas: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Actualizar un reporte existente
     */
    public function updateReport($reportId, $data) {
        try {
            // Evitar logs de payload en producción
            
            // Verificar conexión a la base de datos
            if (!$this->conn || $this->conn->connect_error) {
                throw new Exception("Error de conexión a la base de datos");
            }
            
            // Verificar que el reporte existe y está pendiente, y obtener su tipo
            $sqlCheck = "SELECT id, estado, tipo_reporte FROM reportes WHERE id = ?";
            $stmtCheck = $this->conn->prepare($sqlCheck);
            $stmtCheck->bind_param("i", $reportId);
            $stmtCheck->execute();
            $resultCheck = $stmtCheck->get_result();
            
            if ($resultCheck->num_rows === 0) {
                return [
                    'success' => false,
                    'message' => 'Reporte no encontrado'
                ];
            }
            
            $report = $resultCheck->fetch_assoc();
            if ($report['estado'] !== 'pendiente') {
                return [
                    'success' => false,
                    'message' => 'Solo se pueden editar reportes pendientes'
                ];
            }
            
            $tipoReporte = $report['tipo_reporte'];
            $stmtCheck->close();
            
            // Sanitizar datos de entrada
            $data = $this->sanitizeInput($data);
            
            // Agregar el tipo de reporte a los datos para validación
            $data['tipo_reporte'] = $tipoReporte;
            
            // Validar campos ENUM
            $enumErrors = $this->validateEnumFields($data, $tipoReporte);
            if (!empty($enumErrors)) {
                return [
                    'success' => false,
                    'message' => 'Errores de validación: ' . implode(', ', $enumErrors)
                ];
            }
            
            // Validar campos específicos según tipo de reporte
            $validationErrors = $this->validateReportFields($data, $tipoReporte);
            if (!empty($validationErrors)) {
                return [
                    'success' => false,
                    'message' => 'Errores de validación: ' . implode(', ', $validationErrors)
                ];
            }
            
            // Preparar la consulta SQL de actualización
            $sql = "UPDATE reportes SET 
                    asunto = ?, 
                    descripcion_general = ?,
                    fecha_evento = ?,
                    lugar_hallazgo = ?,
                    lugar_hallazgo_otro = ?,
                    tipo_hallazgo = ?,
                    descripcion_hallazgo = ?,
                    recomendaciones = ?,
                    estado_condicion = ?,
                    grado_criticidad = ?,
                    ubicacion_incidente = ?,
                    hora_evento = ?,
                    tipo_afectacion = ?,
                    descripcion_incidente = ?,
                    tipo_conversacion = ?,
                    sitio_evento_conversacion = ?,
                    lugar_hallazgo_conversacion = ?,
                    lugar_hallazgo_conversacion_otro = ?,
                    descripcion_conversacion = ?,
                    asunto_conversacion = ?,
                    actualizado_en = CURRENT_TIMESTAMP
                    WHERE id = ?";
            
            $stmt = $this->conn->prepare($sql);
            
            if (!$stmt) {
                throw new Exception("Error preparando la consulta: " . $this->conn->error);
            }
            
            // Extraer valores a variables para bind_param
            $asunto = $data['asunto'] ?? $data['asunto_conversacion'] ?? null;
            $descripcion_general = $data['descripcion_general'] ?? null;
            $fecha_evento = $data['fecha_evento'] ?? null;
            $lugar_hallazgo = $data['lugar_hallazgo'] ?? null;
            $lugar_hallazgo_otro = $data['lugar_hallazgo_otro'] ?? null;
            $tipo_hallazgo = $data['tipo_hallazgo'] ?? null;
            $descripcion_hallazgo = $data['descripcion_hallazgo'] ?? null;
            $recomendaciones = $data['recomendaciones'] ?? null;
            $estado_condicion = $data['estado_condicion'] ?? null;
            $grado_criticidad = $data['grado_criticidad'] ?? null;
            $ubicacion_incidente = $data['ubicacion_incidente'] ?? null;
            $hora_evento = $data['hora_evento'] ?? null;
            $tipo_afectacion = $data['tipo_afectacion'] ?? null;
            $descripcion_incidente = $data['descripcion_incidente'] ?? null;
            $tipo_conversacion = $data['tipo_conversacion'] ?? null;
            $sitio_evento_conversacion = $data['sitio_evento_conversacion'] ?? null;
            $lugar_hallazgo_conversacion = $data['lugar_hallazgo_conversacion'] ?? null;
            $lugar_hallazgo_conversacion_otro = $data['lugar_hallazgo_conversacion_otro'] ?? null;
            $descripcion_conversacion = $data['descripcion_conversacion'] ?? null;
            $asunto_conversacion = $data['asunto_conversacion'] ?? null;
            
            // Bind de parámetros
            $stmt->bind_param("ssssssssssssssssssssi",
                $asunto,
                $descripcion_general,
                $fecha_evento,
                $lugar_hallazgo,
                $lugar_hallazgo_otro,
                $tipo_hallazgo,
                $descripcion_hallazgo,
                $recomendaciones,
                $estado_condicion,
                $grado_criticidad,
                $ubicacion_incidente,
                $hora_evento,
                $tipo_afectacion,
                $descripcion_incidente,
                $tipo_conversacion,
                $sitio_evento_conversacion,
                $lugar_hallazgo_conversacion,
                $lugar_hallazgo_conversacion_otro,
                $descripcion_conversacion,
                $asunto_conversacion,
                $reportId
            );
            
            // Ejecutar la consulta
            if (!$stmt->execute()) {
                throw new Exception("Error ejecutando la consulta: " . $stmt->error);
            }
            
            if ($stmt->affected_rows === 0) {
                return [
                    'success' => false,
                    'message' => 'No se realizaron cambios en el reporte'
                ];
            }
            
            $stmt->close();
            
            return [
                'success' => true,
                'message' => 'Reporte actualizado exitosamente'
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al actualizar el reporte: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Eliminar un reporte
     */
    public function deleteReport($reportId) {
        try {
            // Verificar que el reporte existe y está pendiente
            $sqlCheck = "SELECT id, estado FROM reportes WHERE id = ?";
            $stmtCheck = $this->conn->prepare($sqlCheck);
            $stmtCheck->bind_param("i", $reportId);
            $stmtCheck->execute();
            $resultCheck = $stmtCheck->get_result();
            
            if ($resultCheck->num_rows === 0) {
                return [
                    'success' => false,
                    'message' => 'Reporte no encontrado'
                ];
            }
            
            $report = $resultCheck->fetch_assoc();
            if ($report['estado'] !== 'pendiente') {
                return [
                    'success' => false,
                    'message' => 'Solo se pueden eliminar reportes pendientes'
                ];
            }
            
            $stmtCheck->close();
            
            // Eliminar evidencias asociadas primero
            $sqlEvidencias = "DELETE FROM evidencias WHERE id_reporte = ?";
            $stmtEvidencias = $this->conn->prepare($sqlEvidencias);
            $stmtEvidencias->bind_param("i", $reportId);
            $stmtEvidencias->execute();
            $stmtEvidencias->close();
            
            // Eliminar el reporte
            $sql = "DELETE FROM reportes WHERE id = ?";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("i", $reportId);
            
            if (!$stmt->execute()) {
                throw new Exception("Error eliminando reporte: " . $stmt->error);
            }
            
            if ($stmt->affected_rows === 0) {
                return [
                    'success' => false,
                    'message' => 'No se pudo eliminar el reporte'
                ];
            }
            
            $stmt->close();
            
            return [
                'success' => true,
                'message' => 'Reporte eliminado exitosamente'
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al eliminar el reporte: ' . $e->getMessage()
            ];
        }
    }

    public function getDashboardStats() {
        try {
            // 1. Incidentes por mes (últimos 6 meses) con formato mejorado
            $sqlIncidentesPorMes = "
                SELECT 
                    DATE_FORMAT(fecha_evento, '%Y-%m') as mes,
                    DATE_FORMAT(fecha_evento, '%b') as mes_corto,
                    COUNT(CASE WHEN tipo_reporte = 'incidentes' THEN 1 END) as incidentes,
                    COUNT(CASE WHEN tipo_reporte = 'hallazgos' THEN 1 END) as hallazgos,
                    COUNT(CASE WHEN tipo_reporte = 'conversaciones' THEN 1 END) as conversaciones,
                    COUNT(*) as total_reportes
                FROM reportes 
                WHERE fecha_evento >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
                GROUP BY DATE_FORMAT(fecha_evento, '%Y-%m'), DATE_FORMAT(fecha_evento, '%b')
                ORDER BY mes ASC
            ";
            $resultIncidentesPorMes = $this->conn->query($sqlIncidentesPorMes);
            $incidentesPorMes = [];
            while ($row = $resultIncidentesPorMes->fetch_assoc()) {
                $incidentesPorMes[] = $row;
            }

            // 2. Distribución por tipo de incidente con colores
            $sqlDistribucionTipo = "
                SELECT 
                    tipo_reporte,
                    COUNT(*) as cantidad,
                    ROUND((COUNT(*) * 100.0) / (SELECT COUNT(*) FROM reportes), 2) as porcentaje
                FROM reportes 
                GROUP BY tipo_reporte
                ORDER BY cantidad DESC
            ";
            $resultDistribucionTipo = $this->conn->query($sqlDistribucionTipo);
            $distribucionTipo = [];
            $colores = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];
            $i = 0;
            while ($row = $resultDistribucionTipo->fetch_assoc()) {
                $row['color'] = $colores[$i % count($colores)];
                $distribucionTipo[] = $row;
                $i++;
            }

            // 3. Tendencias mensuales para gráfico de líneas
            $sqlTendencias = "
                SELECT 
                    DATE_FORMAT(fecha_evento, '%Y-%m') as mes,
                    DATE_FORMAT(fecha_evento, '%b') as mes_corto,
                    COUNT(CASE WHEN tipo_reporte = 'incidentes' THEN 1 END) as incidentes,
                    COUNT(CASE WHEN tipo_reporte = 'hallazgos' THEN 1 END) as hallazgos,
                    COUNT(CASE WHEN tipo_reporte = 'conversaciones' THEN 1 END) as conversaciones
                FROM reportes 
                WHERE fecha_evento >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
                GROUP BY DATE_FORMAT(fecha_evento, '%Y-%m'), DATE_FORMAT(fecha_evento, '%b')
                ORDER BY mes ASC
            ";
            $resultTendencias = $this->conn->query($sqlTendencias);
            $tendencias = [];
            while ($row = $resultTendencias->fetch_assoc()) {
                $tendencias[] = $row;
            }

            // 4. KPIs principales mejorados
            $sqlKPIs = "
                SELECT 
                    COUNT(*) as total_reportes,
                    COUNT(CASE WHEN tipo_reporte = 'incidentes' THEN 1 END) as total_incidentes,
                    COUNT(CASE WHEN tipo_reporte = 'hallazgos' THEN 1 END) as total_hallazgos,
                    COUNT(CASE WHEN tipo_reporte = 'conversaciones' THEN 1 END) as total_conversaciones,
                    COUNT(CASE WHEN estado = 'pendiente' THEN 1 END) as pendientes,
                    COUNT(CASE WHEN estado = 'aprobado' THEN 1 END) as aprobados,
                    COUNT(CASE WHEN estado = 'rechazado' THEN 1 END) as rechazados,
                    COUNT(CASE WHEN estado = 'en_revision' THEN 1 END) as en_revision,
                    ROUND((COUNT(CASE WHEN estado = 'aprobado' THEN 1 END) * 100.0) / COUNT(*), 2) as tasa_aprobacion
                FROM reportes
            ";
            $resultKPIs = $this->conn->query($sqlKPIs);
            $kpis = $resultKPIs->fetch_assoc();

            // 5. Días sin accidentes (último incidente)
            $sqlUltimoIncidente = "
                SELECT 
                    COALESCE(DATEDIFF(CURDATE(), MAX(fecha_evento)), 0) as dias_sin_accidentes,
                    MAX(fecha_evento) as ultimo_incidente
                FROM reportes 
                WHERE tipo_reporte = 'incidentes'
            ";
            $resultUltimoIncidente = $this->conn->query($sqlUltimoIncidente);
            $ultimoIncidente = $resultUltimoIncidente->fetch_assoc();

            // 6. Métricas de seguridad (simuladas basadas en datos reales)
            $sqlMetricasSeguridad = "
                SELECT 
                    ROUND((COUNT(CASE WHEN estado = 'aprobado' THEN 1 END) * 100.0) / COUNT(*), 0) as cumplimiento_epp,
                    ROUND((COUNT(CASE WHEN tipo_reporte = 'hallazgos' THEN 1 END) * 100.0) / COUNT(*), 0) as inspecciones,
                    ROUND((COUNT(CASE WHEN tipo_reporte = 'conversaciones' THEN 1 END) * 100.0) / COUNT(*), 0) as capacitacion,
                    ROUND((COUNT(CASE WHEN estado != 'rechazado' THEN 1 END) * 100.0) / COUNT(*), 0) as documentacion,
                    ROUND((COUNT(CASE WHEN estado = 'en_revision' THEN 1 END) * 100.0) / COUNT(*), 0) as procedimientos,
                    ROUND((COUNT(CASE WHEN estado = 'aprobado' THEN 1 END) * 100.0) / COUNT(*), 0) as auditorias
                FROM reportes
            ";
            $resultMetricasSeguridad = $this->conn->query($sqlMetricasSeguridad);
            $metricasSeguridad = $resultMetricasSeguridad->fetch_assoc();

            // 7. Estadísticas por criticidad (si existe el campo)
            $sqlCriticidad = "
                SELECT 
                    COALESCE(grado_criticidad, 'No especificada') as criticidad,
                    COUNT(*) as cantidad
                FROM reportes 
                GROUP BY grado_criticidad
                ORDER BY cantidad DESC
            ";
            $resultCriticidad = $this->conn->query($sqlCriticidad);
            $criticidad = [];
            while ($row = $resultCriticidad->fetch_assoc()) {
                $criticidad[] = $row;
            }

            return [
                'success' => true,
                'data' => [
                    'incidentesPorMes' => $incidentesPorMes,
                    'distribucionTipo' => $distribucionTipo,
                    'tendencias' => $tendencias,
                    'kpis' => $kpis,
                    'diasSinAccidentes' => $ultimoIncidente['dias_sin_accidentes'] ?? 0,
                    'ultimoIncidente' => $ultimoIncidente['ultimo_incidente'] ?? null,
                    'metricasSeguridad' => $metricasSeguridad,
                    'criticidad' => $criticidad
                ]
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al obtener estadísticas del dashboard: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Enviar notificación por correo y registrar en tabla notificaciones
     */
    public function notifyReportEvent(int $reportId, string $tipo, array $extra = []) : void {
        try {
            // Obtener datos del reporte y usuario
            $sql = "SELECT r.id, r.tipo_reporte, r.asunto, r.asunto_conversacion, r.creado_en, r.estado, u.nombre, u.correo 
                    FROM reportes r JOIN usuarios u ON r.id_usuario = u.id WHERE r.id = ?";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param('i', $reportId);
            $stmt->execute();
            $res = $stmt->get_result();
            $rep = $res->fetch_assoc();
            $stmt->close();
            if (!$rep) return;

            $destinatario = $rep['correo'] ?: 'desarrolloit@meridian.com.co';
            // En pruebas, forzar destinatario
            $testTo = getenv('MAIL_TEST_TO');
            if (!$testTo) { $testTo = 'desarrolloit@meridian.com.co'; }

            $titulo = $rep['asunto'] ?: ($rep['asunto_conversacion'] ?: '(sin asunto)');
            $subject = '';
            $body = '';
            if ($tipo === 'creacion') {
                $subject = "[HSEQ] Nuevo reporte #{$rep['id']} - {$rep['tipo_reporte']}";
                $body = "<p>Hola {$rep['nombre']},</p>
                         <p>Se ha creado tu reporte <strong>#{$rep['id']}</strong> de tipo <strong>{$rep['tipo_reporte']}</strong>.</p>
                         <p>Título: <strong>{$this->e($titulo)}</strong></p>
                         <p>Estado actual: <strong>{$rep['estado']}</strong></p>
                         <p>Fecha de creación: {$rep['creado_en']}</p>";
            } else if ($tipo === 'estado') {
                $estado = $this->e($extra['nuevo_estado'] ?? '');
                $subject = "[HSEQ] Estado actualizado reporte #{$rep['id']} → {$estado}";
                $body = "<p>Hola {$rep['nombre']},</p>
                         <p>El estado de tu reporte <strong>#{$rep['id']}</strong> ha cambiado a <strong>{$estado}</strong>.</p>
                         <p>Título: <strong>{$this->e($titulo)}</strong></p>";
                if (!empty($extra['comentarios'])) {
                    $body .= "<p>Comentarios de revisión: {$this->e($extra['comentarios'])}</p>";
                }
            } else if ($tipo === 'vencido') {
                $subject = "[HSEQ] Recordatorio: reporte #{$rep['id']} supera 30 días";
                $body = "<p>Hola {$rep['nombre']},</p>
                         <p>Tu reporte <strong>#{$rep['id']}</strong> continúa en estado <strong>{$rep['estado']}</strong> y han pasado más de 30 días desde su creación ({$rep['creado_en']}).</p>
                         <p>Por favor, realiza seguimiento o contacta a soporte.</p>";
            }
            $body .= "<hr/><p>Este es un mensaje automático. No responder.</p>";

            // Enviar correo (forzado a test durante pruebas)
            $sendTo = $testTo ?: $destinatario;
            $sendResult = send_email($sendTo, $subject, $body);

            // Registrar en notificaciones
            $sqlN = 'INSERT INTO notificaciones (id_reporte, destinatario, medio) VALUES (?, ?, "correo")';
            $stmtN = $this->conn->prepare($sqlN);
            if ($stmtN) {
                $stmtN->bind_param('is', $reportId, $sendTo);
                $stmtN->execute();
                $stmtN->close();
            }
        } catch (Exception $e) {
            // Silencioso, no romper flujo del reporte
        }
    }

    private function e(string $s): string {
        return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
    }
}
?> 