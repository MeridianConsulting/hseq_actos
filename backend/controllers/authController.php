<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../utils/jwt.php';

class AuthController {
    private $db;

    public function __construct() {
        $this->db = (new Database())->getConnection();
    }

    /**
     * Inicia sesión con verificación segura y devuelve JWT
     */
    public function login($cedula, $contrasena) {
        try {
            // Throttling básico por IP/usuario para evitar fuerza bruta (persistente en filesystem)
            $clientIp = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
            $key = md5($clientIp . '|' . $cedula);
            $file = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'hseq_login_' . $key . '.json';
            $now = time();
            $bucket = ['count' => 0, 'reset' => $now + 60];
            if (is_file($file)) {
                $raw = @file_get_contents($file);
                if ($raw) {
                    $data = json_decode($raw, true);
                    if (is_array($data) && isset($data['count'], $data['reset'])) {
                        $bucket = $data;
                    }
                }
            }
            if ($now > ($bucket['reset'] ?? 0)) { $bucket = ['count'=>0,'reset'=>$now + 60]; }
            if (($bucket['count'] ?? 0) >= 10) { // máx 10 intentos/minuto
                return ['success'=>false,'message'=>'Demasiados intentos. Inténtalo en 1 minuto'];
            }
            $bucket['count'] = ($bucket['count'] ?? 0) + 1;
            @file_put_contents($file, json_encode($bucket), LOCK_EX);

            $sql = 'SELECT id, nombre, cedula, correo, contrasena, rol, activo FROM usuarios WHERE cedula = ? AND activo = 1';
            $stmt = $this->db->prepare($sql);
            if (!$stmt) {
                throw new Exception("Error al preparar la consulta: " . $this->db->error);
            }
            $stmt->bind_param('s', $cedula);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows === 0) {
                return ['success' => false, 'message' => 'Usuario no encontrado o inactivo'];
            }
            $usuario = $result->fetch_assoc();

            // Política de contraseñas:
            // - En desarrollo: aceptar transición desde texto plano y migrar a hash.
            // - En producción: exigir hash BCRYPT; rechazar credenciales si el campo no es hash.
            $hash = $usuario['contrasena'];
            $isBcrypt = is_string($hash) && str_starts_with($hash, '$2y$');
            $appEnv = strtolower(getenv('APP_ENV') ?: 'development');
            if ($appEnv === 'production' && !$isBcrypt) {
                return ['success' => false, 'message' => 'Credenciales inválidas'];
            }
            $ok = $isBcrypt ? password_verify($contrasena, $hash) : ($hash === $contrasena);
            if (!$ok) {
                return ['success' => false, 'message' => 'Credenciales inválidas'];
            }

            // Si es texto plano, opcionalmente actualizar a hash seguro tras login exitoso (auto-migración)
            if ($appEnv !== 'production' && !$isBcrypt) {
                $newHash = password_hash($contrasena, PASSWORD_BCRYPT);
                $upd = $this->db->prepare('UPDATE usuarios SET contrasena = ? WHERE id = ?');
                if ($upd) {
                    $upd->bind_param('si', $newHash, $usuario['id']);
                    $upd->execute();
                }
            }

            // Emitir JWT
            $token = jwt_encode([
                'sub' => (int)$usuario['id'],
                'rol' => $usuario['rol'],
                'cedula' => $usuario['cedula']
            ], 60 * 60 * 24 * 365 * 10); // 10 años (prácticamente sin expiración)

            unset($usuario['contrasena']);
            return [
                'success' => true,
                'message' => 'Login exitoso',
                'token' => $token,
                'user' => $usuario
            ];
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error en el servidor: ' . $e->getMessage()];
        }
    }
}
?>