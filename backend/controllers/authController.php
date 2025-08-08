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

            // Soporta transición: si la contraseña está sin hash (igual a cédula en dump), aceptar temporalmente,
            // y recomendar migración. Si ya está hasheada (prefijo $2y$), usar password_verify.
            $hash = $usuario['contrasena'];
            $isBcrypt = is_string($hash) && str_starts_with($hash, '$2y$');
            $ok = $isBcrypt ? password_verify($contrasena, $hash) : ($hash === $contrasena);
            if (!$ok) {
                return ['success' => false, 'message' => 'Credenciales inválidas'];
            }

            // Si es texto plano, opcionalmente actualizar a hash seguro tras login exitoso (auto-migración)
            if (!$isBcrypt) {
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
            ], 60 * 60 * 8); // 8 horas

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