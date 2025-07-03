<?php
require_once __DIR__ . '/../config/db.php';

class AuthController {
    private $db;

    public function __construct() {
        $this->db = (new Database())->getConnection();
    }

    public function login($cedula, $contrasena) {
        try {
            // Buscar usuario por cédula
            $sql = 'SELECT id, nombre, cedula, correo, contrasena, rol, activo FROM usuarios WHERE cedula = ? AND activo = 1';
            $stmt = $this->db->prepare($sql);
            
            if (!$stmt) {
                throw new Exception("Error al preparar la consulta: " . $this->db->error);
            }
            
            $stmt->bind_param('s', $cedula);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows === 0) {
                return [
                    'success' => false, 
                    'message' => 'Usuario no encontrado o inactivo'
                ];
            }
            
            $usuario = $result->fetch_assoc();
            
            // Verificar contraseña (asumiendo que está en texto plano por ahora)
            // En producción deberías usar password_hash() y password_verify()
            if ($usuario['contrasena'] === $contrasena) {
                // Login exitoso - no devolver la contraseña
                unset($usuario['contrasena']);
                
                return [
                    'success' => true,
                    'message' => 'Login exitoso',
                    'user' => $usuario
                ];
            } else {
                return [
                    'success' => false, 
                    'message' => 'Contraseña incorrecta'
                ];
            }
            
        } catch (Exception $e) {
            return [
                'success' => false, 
                'message' => 'Error en el servidor: ' . $e->getMessage()
            ];
        }
    }
}
?>