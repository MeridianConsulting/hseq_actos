<?php
require_once __DIR__ . '/../config/db.php';

// Incluir TCPDF de forma tolerante (evitar fatal si falta include/)
$tcpdfBase = __DIR__ . '/../vendor/tcpdf';
$tcpdfInclude = $tcpdfBase . '/include/tcpdf.php';
$tcpdfBootstrap = $tcpdfBase . '/tcpdf_include.php';
$tcpdfWrapper = $tcpdfBase . '/tcpdf.php';
if (!class_exists('TCPDF')) {
    if (file_exists($tcpdfInclude)) {
        require_once $tcpdfInclude;
    } elseif (file_exists($tcpdfBootstrap)) {
        require_once $tcpdfBootstrap;
    } elseif (file_exists($tcpdfWrapper) && file_exists($tcpdfInclude)) {
        require_once $tcpdfWrapper;
    } else {
        // No cargar nada si no está completo; el método generatePDF validará y devolverá error controlado
    }
}

class PdfController {
    private $conn;
    
    public function __construct() {
        global $db;
        if (!$db) {
            throw new Exception("No se pudo establecer conexión con la base de datos");
        }
        $this->conn = $db;
        
        if ($this->conn->connect_error) {
            throw new Exception("Error de conexión a la base de datos: " . $this->conn->connect_error);
        }
    }
    
    /**
     * Genera y descarga un PDF del reporte con imágenes
     */
    public function downloadReportPDF($reportId) {
        try {
            // Log para debugging
            error_log("Iniciando generación de PDF para reporte ID: $reportId");
            
            // Obtener datos completos del reporte
            $reporte = $this->getReporteCompleto($reportId);
            
            if (!$reporte) {
                error_log("Reporte no encontrado: ID=$reportId");
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Reporte no encontrado'
                ]);
                return;
            }
            
            error_log("Reporte encontrado, generando HTML...");
            
            // Generar HTML para el PDF
            $html = $this->generateReportHTML($reporte);
            
            error_log("HTML generado, procesando PDF...");
            
            // Generar PDF usando TCPDF
            $this->generatePDF($html, $reporte);
            
            error_log("PDF generado exitosamente para reporte ID: $reportId");
            
        } catch (Exception $e) {
            error_log("Error al generar PDF para reporte $reportId: " . $e->getMessage());
            error_log("Stack trace: " . $e->getTraceAsString());
            
            if (ob_get_level()) ob_clean();
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'success' => false,
                'message' => 'Error al generar el PDF',
                'error' => $e->getMessage(),
            ], JSON_UNESCAPED_UNICODE);
        }
    }
    
    /**
     * Obtiene todos los datos del reporte incluyendo evidencias
     */
    private function getReporteCompleto($reportId) {
        try {
            // Obtener datos básicos del reporte
            $stmt = $this->conn->prepare("
                SELECT r.*, u.nombre as nombre_usuario, u.proyecto as proyecto_usuario
                FROM reportes r 
                JOIN usuarios u ON r.id_usuario = u.id 
                WHERE r.id = ?
            ");
            
            if (!$stmt) {
                error_log("Error preparando query de reporte: " . $this->conn->error);
                return null;
            }
            
            $stmt->bind_param('i', $reportId);
            $stmt->execute();
            $reporte = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            
            if (!$reporte) {
                error_log("Reporte no encontrado en BD: ID=$reportId");
                return null;
            }
            
            // Obtener evidencias del reporte (con manejo de errores)
            try {
                $stmt = $this->conn->prepare("
                    SELECT * FROM evidencias 
                    WHERE id_reporte = ? 
                    ORDER BY creado_en ASC
                ");
                
                if ($stmt) {
                    $stmt->bind_param('i', $reportId);
                    $stmt->execute();
                    $evidencias = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
                    $stmt->close();
                    $reporte['evidencias'] = $evidencias;
                    error_log("Evidencias encontradas: " . count($evidencias));
                } else {
                    error_log("Error preparando query de evidencias: " . $this->conn->error);
                    $reporte['evidencias'] = [];
                }
            } catch (Exception $e) {
                error_log("Error obteniendo evidencias: " . $e->getMessage());
                $reporte['evidencias'] = [];
            }
            
            return $reporte;
            
        } catch (Exception $e) {
            error_log("Error en getReporteCompleto: " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Genera HTML para el reporte
     */
    private function generateReportHTML($reporte) {
        $evidencias = $reporte['evidencias'] ?? [];
        
        $html = '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Reporte HSEQ</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 20px; 
                    font-size: 12px;
                    line-height: 1.4;
                }
                .header { 
                    text-align: center; 
                    margin-bottom: 30px; 
                    border-bottom: 3px solid #2c5aa0;
                    padding-bottom: 20px;
                }
                .header h1 { 
                    color: #2c5aa0; 
                    margin: 0; 
                    font-size: 24px;
                }
                .header h2 { 
                    color: #666; 
                    margin: 5px 0 0 0; 
                    font-size: 18px;
                }
                .section { 
                    margin-bottom: 25px; 
                    border: 1px solid #ddd;
                    border-radius: 5px;
                }
                .section h3 { 
                    background-color: #f8f9fa; 
                    padding: 12px; 
                    margin: 0; 
                    border-bottom: 1px solid #ddd;
                    color: #2c5aa0;
                    font-size: 14px;
                }
                .section-content { 
                    padding: 15px; 
                }
                .info-row {
                    margin-bottom: 8px;
                    display: flex;
                }
                .info-label {
                    font-weight: bold;
                    width: 200px;
                    color: #333;
                }
                .info-value {
                    flex: 1;
                    color: #666;
                }
                .evidencias-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                    margin-top: 15px;
                }
                .evidencia-item {
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    overflow: hidden;
                }
                .evidencia-imagen {
                    width: 100%;
                    max-height: 150px;
                    object-fit: cover;
                    border-bottom: 1px solid #ddd;
                }
                .evidencia-info {
                    padding: 10px;
                    font-size: 11px;
                }
                .estado-badge {
                    display: inline-block;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 10px;
                    font-weight: bold;
                    text-transform: uppercase;
                }
                .estado-pendiente { background-color: #fff3cd; color: #856404; }
                .estado-en_revision { background-color: #cce5ff; color: #004085; }
                .estado-aprobado { background-color: #d4edda; color: #155724; }
                .estado-rechazado { background-color: #f8d7da; color: #721c24; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>REPORTE HSEQ</h1>
                <h2>MERIDIAN CONSULTING LTDA</h2>
            </div>

            <div class="section">
                <h3>INFORMACIÓN GENERAL</h3>
                <div class="section-content">
                    <div class="info-row">
                        <span class="info-label">ID del Reporte:</span>
                        <span class="info-value">' . htmlspecialchars($reporte['id']) . '</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Tipo de Reporte:</span>
                        <span class="info-value">' . $this->getEventTypeLabel($reporte['tipo_reporte']) . '</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Estado:</span>
                        <span class="info-value">
                            <span class="estado-badge estado-' . $reporte['estado'] . '">
                                ' . $this->getStatusLabel($reporte['estado']) . '
                            </span>
                        </span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Usuario:</span>
                        <span class="info-value">' . htmlspecialchars($reporte['nombre_usuario']) . '</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Proyecto:</span>
                        <span class="info-value">' . htmlspecialchars($reporte['proyecto_usuario'] ?? 'No asignado') . '</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Fecha del Evento:</span>
                        <span class="info-value">' . $this->formatDate($reporte['fecha_evento']) . '</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Hora del Evento:</span>
                        <span class="info-value">' . htmlspecialchars($reporte['hora_evento'] ?? '') . '</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Fecha de Creación:</span>
                        <span class="info-value">' . $this->formatDate($reporte['creado_en']) . '</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Asunto:</span>
                        <span class="info-value">' . htmlspecialchars($reporte['asunto'] ?? $reporte['asunto_conversacion'] ?? '') . '</span>
                    </div>
                </div>
            </div>';

        // Información específica según tipo
        $html .= $this->generateSpecificInfoHTML($reporte);
        
        // Información de revisión
        if ($reporte['fecha_revision'] || $reporte['comentarios_revision']) {
            $html .= '
            <div class="section">
                <h3>INFORMACIÓN DE REVISIÓN</h3>
                <div class="section-content">';
            
            if ($reporte['fecha_revision']) {
                $html .= '
                <div class="info-row">
                    <span class="info-label">Fecha de Revisión:</span>
                    <span class="info-value">' . $this->formatDate($reporte['fecha_revision']) . '</span>
                </div>';
            }
            
            if ($reporte['comentarios_revision']) {
                $html .= '
                <div class="info-row">
                    <span class="info-label">Comentarios:</span>
                    <span class="info-value">' . htmlspecialchars($reporte['comentarios_revision']) . '</span>
                </div>';
            }
            
            $html .= '</div></div>';
        }

        // Evidencias
        if (!empty($evidencias)) {
            $html .= '
            <div class="section">
                <h3>EVIDENCIAS ADJUNTAS</h3>
                <div class="section-content">
                    <div class="evidencias-grid">';
            
            foreach ($evidencias as $evidencia) {
                $html .= $this->generateEvidenciaHTML($evidencia);
            }
            
            $html .= '</div></div></div>';
        }

        // Información adicional
        $html .= '
            <div class="section">
                <h3>INFORMACIÓN ADICIONAL</h3>
                <div class="section-content">
                    <div class="info-row">
                        <span class="info-label">Sistema Generador:</span>
                        <span class="info-value">Sistema HSEQ - Meridian Colombia</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Fecha de Generación:</span>
                        <span class="info-value">' . date('d/m/Y H:i:s') . '</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Usuario Generador:</span>
                        <span class="info-value">' . htmlspecialchars($reporte['nombre_usuario']) . '</span>
                    </div>
                </div>
            </div>
        </body>
        </html>';

        return $html;
    }
    
    /**
     * Genera HTML para información específica según tipo de reporte
     */
    private function generateSpecificInfoHTML($reporte) {
        $html = '<div class="section">
            <h3>DETALLES DEL REPORTE</h3>
            <div class="section-content">';
        
        switch ($reporte['tipo_reporte']) {
            case 'hallazgos':
                $html .= '
                <div class="info-row">
                    <span class="info-label">Lugar del Hallazgo:</span>
                    <span class="info-value">' . htmlspecialchars($reporte['lugar_hallazgo'] ?? $reporte['lugar_hallazgo_otro'] ?? '') . '</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Tipo de Hallazgo:</span>
                    <span class="info-value">' . htmlspecialchars($reporte['tipo_hallazgo'] ?? '') . '</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Estado de la Condición:</span>
                    <span class="info-value">' . htmlspecialchars($reporte['estado_condicion'] ?? '') . '</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Descripción:</span>
                    <span class="info-value">' . htmlspecialchars($reporte['descripcion_hallazgo'] ?? '') . '</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Recomendaciones:</span>
                    <span class="info-value">' . htmlspecialchars($reporte['recomendaciones'] ?? '') . '</span>
                </div>';
                break;
                
            case 'incidentes':
                $html .= '
                <div class="info-row">
                    <span class="info-label">Ubicación:</span>
                    <span class="info-value">' . htmlspecialchars($reporte['ubicacion_incidente'] ?? '') . '</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Grado de Criticidad:</span>
                    <span class="info-value">' . htmlspecialchars($reporte['grado_criticidad'] ?? '') . '</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Tipo de Afectación:</span>
                    <span class="info-value">' . htmlspecialchars($reporte['tipo_afectacion'] ?? '') . '</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Descripción:</span>
                    <span class="info-value">' . htmlspecialchars($reporte['descripcion_incidente'] ?? '') . '</span>
                </div>';
                break;
                
            case 'conversaciones':
                $html .= '
                <div class="info-row">
                    <span class="info-label">Tipo de Conversación:</span>
                    <span class="info-value">' . htmlspecialchars($reporte['tipo_conversacion'] ?? '') . '</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Sitio del Evento:</span>
                    <span class="info-value">' . htmlspecialchars($reporte['sitio_evento_conversacion'] ?? '') . '</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Lugar del Hallazgo:</span>
                    <span class="info-value">' . htmlspecialchars($reporte['lugar_hallazgo_conversacion'] ?? $reporte['lugar_hallazgo_conversacion_otro'] ?? '') . '</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Descripción:</span>
                    <span class="info-value">' . htmlspecialchars($reporte['descripcion_conversacion'] ?? '') . '</span>
                </div>';
                break;
        }
        
        $html .= '</div></div>';
        return $html;
    }
    
    /**
     * Genera HTML para una evidencia individual (SIN imágenes para evitar errores)
     */
    private function generateEvidenciaHTML($evidencia) {
        $fileName = basename($evidencia['url_archivo'] ?? 'archivo');
        $fileType = $evidencia['tipo_archivo'] ?? 'desconocido';
        
        // Simplificado: Solo mostrar información de la evidencia sin intentar incrustar imágenes
        $html = '<div class="evidencia-item" style="border: 1px solid #ddd; border-radius: 5px; padding: 10px; margin-bottom: 10px;">';
        
        // Icono placeholder
        $html .= '<div class="evidencia-info">';
        $html .= '<div style="margin-bottom: 5px;"><strong>📎 Evidencia Adjunta</strong></div>';
        $html .= '<div style="margin-bottom: 3px;"><strong>Archivo:</strong> ' . htmlspecialchars($fileName) . '</div>';
        $html .= '<div style="margin-bottom: 3px;"><strong>Tipo:</strong> ' . htmlspecialchars($fileType) . '</div>';
        $html .= '<div><strong>Fecha:</strong> ' . $this->formatDate($evidencia['creado_en']) . '</div>';
        $html .= '<div style="margin-top: 5px; color: #666; font-size: 11px;"><em>Nota: Las imágenes están disponibles en el sistema web</em></div>';
        $html .= '</div>';
        $html .= '</div>';
        
        return $html;
    }
    
    /**
     * Genera PDF usando TCPDF
     */
    private function generatePDF($html, $reporte) {
        try {
            error_log("Verificando disponibilidad de TCPDF...");
            
            // Verificar si TCPDF está disponible
            if (!class_exists('TCPDF')) {
                error_log("TCPDF no está disponible - intentando cargar...");
                
                // Intentar cargar TCPDF manualmente
                $tcpdfPath = __DIR__ . '/../vendor/tcpdf/tcpdf.php';
                if (file_exists($tcpdfPath)) {
                    require_once $tcpdfPath;
                    error_log("TCPDF cargado manualmente desde: $tcpdfPath");
                } else {
                    throw new Exception("TCPDF no está disponible. Ruta esperada: $tcpdfPath");
                }
            } else {
                error_log("TCPDF está disponible");
            }
            
            // Limpiar buffer de salida
            error_log("Limpiando buffer de salida...");
            if (ini_get('zlib.output_compression')) {
                @ini_set('zlib.output_compression', 'Off');
            }
            while (ob_get_level() > 0) {
                @ob_end_clean();
            }
            
            error_log("Creando instancia de TCPDF...");
            // Crear instancia de TCPDF
            $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
            
            error_log("Configurando documento PDF...");
            // Configurar documento
            $pdf->SetCreator('Sistema HSEQ Meridian');
            $pdf->SetAuthor('Meridian Consulting LTDA');
            $pdf->SetTitle('Reporte HSEQ #' . $reporte['id']);
            $pdf->SetSubject('Reporte de Seguridad, Salud Ocupacional y Medio Ambiente');
            
            // Configurar márgenes
            $pdf->SetMargins(15, 15, 15);
            $pdf->SetHeaderMargin(5);
            $pdf->SetFooterMargin(10);
            
            // Configurar auto page breaks
            $pdf->SetAutoPageBreak(TRUE, 25);
            
            // Desactivar header y footer por defecto
            $pdf->setPrintHeader(false);
            $pdf->setPrintFooter(false);
            
            // Agregar página
            error_log("Agregando página al PDF...");
            $pdf->AddPage();
            
            // Escribir HTML (con manejo de errores)
            error_log("Escribiendo HTML en PDF...");
            try {
                $pdf->writeHTML($html, true, false, true, false, '');
            } catch (Exception $htmlError) {
                // Si hay error con HTML complejo, intentar versión simplificada
                error_log("Error al procesar HTML: " . $htmlError->getMessage());
                $htmlSimple = '<h1>Reporte HSEQ #' . $reporte['id'] . '</h1>';
                $htmlSimple .= '<p>ID: ' . $reporte['id'] . '</p>';
                $htmlSimple .= '<p>Tipo: ' . ($reporte['tipo_reporte'] ?? 'N/A') . '</p>';
                $htmlSimple .= '<p>Usuario: ' . ($reporte['nombre_usuario'] ?? 'N/A') . '</p>';
                $pdf->writeHTML($htmlSimple, true, false, true, false, '');
            }
            
            // Generar nombre del archivo
            $safeName = preg_replace('/[^a-z0-9_.-]/i', '_', $reporte['asunto'] ?? $reporte['asunto_conversacion'] ?? 'reporte');
            $fileName = 'reporte_hseq_' . $reporte['id'] . '_' . $safeName . '.pdf';
            
            error_log("Generando salida del PDF: $fileName");
            // Salida del PDF (descarga)
            $pdf->Output($fileName, 'D');
            
            error_log("PDF generado y enviado exitosamente");
            
        } catch (Exception $e) {
            // Registrar error detallado
            error_log("ERROR FATAL al generar PDF: " . $e->getMessage());
            error_log("Archivo: " . $e->getFile() . " Línea: " . $e->getLine());
            error_log("Stack trace: " . $e->getTraceAsString());
            
            // Devolver error al cliente
            if (ob_get_level()) ob_clean();
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'success' => false,
                'message' => 'Error al generar el PDF',
                'error' => $e->getMessage(),
                'file' => basename($e->getFile()),
                'line' => $e->getLine()
            ]);
        }
    }
    
    /**
     * Obtiene etiqueta del tipo de evento
     */
    private function getEventTypeLabel($type) {
        $labels = [
            'hallazgos' => 'Hallazgos y Condiciones',
            'incidentes' => 'Incidentes HSE',
            'conversaciones' => 'Conversaciones y Reflexiones'
        ];
        return $labels[$type] ?? $type;
    }
    
    /**
     * Obtiene etiqueta del estado
     */
    private function getStatusLabel($status) {
        $labels = [
            'pendiente' => 'Pendiente de Revisión',
            'en_revision' => 'En Revisión',
            'aprobado' => 'Aprobado',
            'rechazado' => 'Rechazado'
        ];
        return $labels[$status] ?? $status;
    }
    
    /**
     * Formatea fecha
     */
    private function formatDate($dateString) {
        if (!$dateString) return 'No especificado';
        return date('d/m/Y H:i', strtotime($dateString));
    }
}
?>
