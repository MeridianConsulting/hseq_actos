<?php
// CLI: Notificaciones programadas HSEQ
// Uso ejemplos:
//  php tasks/notify.php overdue
//  php tasks/notify.php upcoming --days=5

// Endurecer entorno CLI
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(0);

require_once __DIR__ . '/../utils/env.php';
env_bootstrap();
require_once __DIR__ . '/../utils/jwt.php'; // no usa JWT, pero mantiene consistencia de carga
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../controllers/reportController.php';

if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    echo "Forbidden"; exit(1);
}

function argval(string $name, $default = null) {
    foreach ($GLOBALS['argv'] as $arg) {
        if (strpos($arg, "--$name=") === 0) {
            return substr($arg, strlen($name) + 3);
        }
        if ($arg === "--$name") return true;
    }
    return $default;
}

$action = $argv[1] ?? '';
if ($action === '') {
    fwrite(STDERR, "Uso: php tasks/notify.php [overdue|upcoming] [--days=N]\n");
    exit(2);
}

$controller = new ReportController();
$conn = (new Database())->getConnection();

try {
    if ($action === 'overdue') {
        $sql = "SELECT r.id FROM reportes r WHERE r.estado IN ('pendiente','en_revision') AND DATEDIFF(CURDATE(), DATE(r.creado_en)) > 30";
        $res = $conn->query($sql);
        $count = 0;
        while ($row = $res->fetch_assoc()) {
            $controller->notifyReportEvent((int)$row['id'], 'vencido', []);
            $count++;
        }
        echo "Overdue enviados: $count\n";
        exit(0);
    }
    if ($action === 'upcoming') {
        $days = (int)(argval('days', 5));
        if ($days < 1) $days = 1; if ($days > 30) $days = 30;
        $stmt = $conn->prepare("SELECT r.id FROM reportes r WHERE r.estado IN ('pendiente','en_revision') AND DATEDIFF(CURDATE(), DATE(r.creado_en)) BETWEEN (30 - ?) AND 29");
        $stmt->bind_param('i', $days);
        $stmt->execute();
        $res = $stmt->get_result();
        $count = 0;
        while ($row = $res->fetch_assoc()) {
            $controller->notifyReportEvent((int)$row['id'], 'upcoming', ['days_before' => $days]);
            $count++;
        }
        $stmt->close();
        echo "Upcoming enviados (≤ {$days} días): $count\n";
        exit(0);
    }
    fwrite(STDERR, "Acción desconocida: $action\n");
    exit(2);
} catch (Throwable $e) {
    fwrite(STDERR, "Error: " . $e->getMessage() . "\n");
    exit(1);
}


