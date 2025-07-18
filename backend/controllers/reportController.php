<?php
require_once __DIR__ . '/../config/db.php';

class ReportController {
    private $conn;
    
    public function __construct() {
        global $db;
        $this->conn = $db;
    }
    
    /**
     * Crear un nuevo reporte
     */
    public function createReport($data) {
        try {
            // Validar datos requeridos
            if (!isset($data['tipo_reporte']) || !isset($data['id_usuario'])) {
                return [
                    'success' => false,
                    'message' => 'Faltan campos requeridos: tipo_reporte e id_usuario'
                ];
            }
            
            // Validar tipo de reporte
            $tiposValidos = ['hallazgos', 'incidentes', 'conversaciones'];
            if (!in_array($data['tipo_reporte'], $tiposValidos)) {
                return [
                    'success' => false,
                    'message' => 'Tipo de reporte inválido'
                ];
            }
            
            // Preparar la consulta SQL base
            $sql = "INSERT INTO reportes (
                id_usuario, 
                tipo_reporte, 
                asunto, 
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
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = $this->conn->prepare($sql);
            
            if (!$stmt) {
                throw new Exception("Error preparando la consulta: " . $this->conn->error);
            }
            
            // Bind de parámetros
            $stmt->bind_param("issssssssssssssssssss",
                $data['id_usuario'],
                $data['tipo_reporte'],
                $data['asunto'] ?? null,
                $data['fecha_evento'] ?? null,
                $data['lugar_hallazgo'] ?? null,
                $data['lugar_hallazgo_otro'] ?? null,
                $data['tipo_hallazgo'] ?? null,
                $data['descripcion_hallazgo'] ?? null,
                $data['recomendaciones'] ?? null,
                $data['estado_condicion'] ?? null,
                $data['grado_criticidad'] ?? null,
                $data['ubicacion_incidente'] ?? null,
                $data['hora_evento'] ?? null,
                $data['tipo_afectacion'] ?? null,
                $data['descripcion_incidente'] ?? null,
                $data['tipo_conversacion'] ?? null,
                $data['sitio_evento_conversacion'] ?? null,
                $data['lugar_hallazgo_conversacion'] ?? null,
                $data['lugar_hallazgo_conversacion_otro'] ?? null,
                $data['descripcion_conversacion'] ?? null,
                $data['asunto_conversacion'] ?? null
            );
            
            // Ejecutar la consulta
            if (!$stmt->execute()) {
                throw new Exception("Error ejecutando la consulta: " . $stmt->error);
            }
            
            $reportId = $this->conn->insert_id;
            
            // Procesar evidencia si existe
            if (isset($data['evidencia']) && !empty($data['evidencia'])) {
                $this->saveEvidence($reportId, $data['evidencia']);
            }
            
            $stmt->close();
            
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
     * Guardar evidencia del reporte
     */
    private function saveEvidence($reportId, $evidenceData) {
        try {
            // Decodificar datos base64 si es necesario
            $fileData = $evidenceData;
            if (isset($evidenceData['data'])) {
                $fileData = base64_decode($evidenceData['data']);
            }
            
            // Generar nombre único para el archivo
            $fileName = 'evidencia_' . $reportId . '_' . time() . '.' . ($evidenceData['extension'] ?? 'jpg');
            $uploadPath = __DIR__ . '/../uploads/' . $fileName;
            
            // Crear directorio si no existe
            if (!is_dir(__DIR__ . '/../uploads/')) {
                mkdir(__DIR__ . '/../uploads/', 0777, true);
            }
            
            // Guardar archivo
            if (file_put_contents($uploadPath, $fileData)) {
                // Guardar referencia en base de datos
                $sql = "INSERT INTO evidencias (id_reporte, tipo_archivo, url_archivo) VALUES (?, ?, ?)";
                $stmt = $this->conn->prepare($sql);
                $stmt->bind_param("iss", $reportId, $evidenceData['type'] ?? 'image', $fileName);
                $stmt->execute();
                $stmt->close();
            }
            
        } catch (Exception $e) {
            // Log del error pero no fallar el reporte completo
            error_log("Error guardando evidencia: " . $e->getMessage());
        }
    }
    
    /**
     * Obtener reportes por usuario
     */
    public function getReportsByUser($userId) {
        try {
            $sql = "SELECT * FROM reportes WHERE id_usuario = ? ORDER BY creado_en DESC";
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
            $sql = "SELECT r.*, u.nombre as nombre_usuario 
                    FROM reportes r 
                    JOIN usuarios u ON r.id_usuario = u.id";
            
            $whereConditions = [];
            $params = [];
            $types = "";
            
            // Aplicar filtros
            if (isset($filters['tipo_reporte'])) {
                $whereConditions[] = "r.tipo_reporte = ?";
                $params[] = $filters['tipo_reporte'];
                $types .= "s";
            }
            
            if (isset($filters['estado'])) {
                $whereConditions[] = "r.estado = ?";
                $params[] = $filters['estado'];
                $types .= "s";
            }
            
            if (!empty($whereConditions)) {
                $sql .= " WHERE " . implode(" AND ", $whereConditions);
            }
            
            $sql .= " ORDER BY r.creado_en DESC";
            
            $stmt = $this->conn->prepare($sql);
            
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
     * Obtener un reporte específico por ID
     */
    public function getReportById($reportId) {
        try {
            $sql = "SELECT r.*, u.nombre as nombre_usuario 
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
            
            $stmt->close();
            
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
}
?> 