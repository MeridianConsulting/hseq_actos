<?php
require_once __DIR__ . '/../config/db.php';

class EmployeeController {
    private $db;

    public function __construct() {
        $this->db = (new Database())->getConnection();
    }

    /**
     * Listar usuarios con filtros opcionales
     * @param array $filters
     * @return array
     */
    public function getAllUsers(array $filters = []) : array {
        $where = [];
        $params = [];
        $types = '';

        if (isset($filters['rol']) && $filters['rol'] !== '') {
            $where[] = 'rol = ?';
            $params[] = $filters['rol'];
            $types .= 's';
        }

        if (isset($filters['activo']) && $filters['activo'] !== '') {
            $where[] = 'activo = ?';
            $params[] = (int)$filters['activo'];
            $types .= 'i';
        }

        if (isset($filters['q']) && $filters['q'] !== '') {
            $q = '%' . $filters['q'] . '%';
            $where[] = '(nombre LIKE ? OR correo LIKE ? OR cedula LIKE ?)';
            $params[] = $q; $params[] = $q; $params[] = $q;
            $types .= 'sss';
        }

        $sql = 'SELECT id, nombre, correo, cedula, rol, activo, creado_en FROM usuarios';
        if (!empty($where)) {
            $sql .= ' WHERE ' . implode(' AND ', $where);
        }
        $sql .= ' ORDER BY id DESC';

        $stmt = $this->db->prepare($sql);
        if (!$stmt) {
            throw new Exception('Error al preparar la consulta: ' . $this->db->error);
        }

        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }

        $stmt->execute();
        $result = $stmt->get_result();
        $rows = [];
        while ($row = $result->fetch_assoc()) {
            $row['estado'] = (int)$row['activo'] === 1 ? 'activo' : 'inactivo';
            unset($row['activo']);
            $rows[] = $row;
        }

        return [ 'success' => true, 'data' => $rows ];
    }

    /** Obtener usuario por ID */
    public function getUserById(int $id) : array {
        $sql = 'SELECT id, nombre, correo, cedula, rol, activo, creado_en FROM usuarios WHERE id = ?';
        $stmt = $this->db->prepare($sql);
        if (!$stmt) {
            throw new Exception('Error al preparar la consulta: ' . $this->db->error);
        }
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $res = $stmt->get_result();
        if ($row = $res->fetch_assoc()) {
            $row['estado'] = (int)$row['activo'] === 1 ? 'activo' : 'inactivo';
            unset($row['activo']);
            return [ 'success' => true, 'data' => $row ];
        }
        return [ 'success' => false, 'message' => 'Usuario no encontrado' ];
    }

    /** Crear usuario */
    public function createUser(array $data) : array {
        $required = ['nombre','correo','cedula','rol','estado'];
        foreach ($required as $key) {
            if (!isset($data[$key]) || $data[$key] === '') {
                return [ 'success' => false, 'message' => 'Campo requerido faltante: ' . $key ];
            }
        }

        $activo = strtolower($data['estado']) === 'inactivo' ? 0 : 1;
        $contrasena = isset($data['contrasena']) && $data['contrasena'] !== '' ? $data['contrasena'] : $data['cedula'];

        $sql = 'INSERT INTO usuarios (nombre, cedula, correo, contrasena, rol, activo, creado_en) VALUES (?, ?, ?, ?, ?, ?, NOW())';
        $stmt = $this->db->prepare($sql);
        if (!$stmt) {
            throw new Exception('Error al preparar la consulta: ' . $this->db->error);
        }
        $stmt->bind_param('sssssi', $data['nombre'], $data['cedula'], $data['correo'], $contrasena, $data['rol'], $activo);
        if (!$stmt->execute()) {
            throw new Exception('Error al crear usuario: ' . $stmt->error);
        }

        return [ 'success' => true, 'message' => 'Usuario creado', 'user_id' => $stmt->insert_id ];
    }

    /** Actualizar usuario */
    public function updateUser(int $id, array $data) : array {
        // Permitir actualizar nombre, correo, cedula, rol, estado
        $fields = [];
        $params = [];
        $types = '';

        if (isset($data['nombre'])) { $fields[] = 'nombre = ?'; $params[] = $data['nombre']; $types .= 's'; }
        if (isset($data['correo'])) { $fields[] = 'correo = ?'; $params[] = $data['correo']; $types .= 's'; }
        if (isset($data['cedula'])) { $fields[] = 'cedula = ?'; $params[] = $data['cedula']; $types .= 's'; }
        if (isset($data['rol'])) { $fields[] = 'rol = ?'; $params[] = $data['rol']; $types .= 's'; }
        if (isset($data['estado'])) { $fields[] = 'activo = ?'; $params[] = strtolower($data['estado']) === 'inactivo' ? 0 : 1; $types .= 'i'; }

        if (empty($fields)) {
            return [ 'success' => false, 'message' => 'Sin cambios para actualizar' ];
        }

        $sql = 'UPDATE usuarios SET ' . implode(', ', $fields) . ' WHERE id = ?';
        $params[] = $id; $types .= 'i';
        $stmt = $this->db->prepare($sql);
        if (!$stmt) {
            throw new Exception('Error al preparar la consulta: ' . $this->db->error);
        }
        $stmt->bind_param($types, ...$params);
        if (!$stmt->execute()) {
            throw new Exception('Error al actualizar usuario: ' . $stmt->error);
        }

        return [ 'success' => true, 'message' => 'Usuario actualizado' ];
    }

    /** Eliminar usuario */
    public function deleteUser(int $id) : array {
        $sql = 'DELETE FROM usuarios WHERE id = ?';
        $stmt = $this->db->prepare($sql);
        if (!$stmt) {
            throw new Exception('Error al preparar la consulta: ' . $this->db->error);
        }
        $stmt->bind_param('i', $id);
        if (!$stmt->execute()) {
            throw new Exception('Error al eliminar usuario: ' . $stmt->error);
        }
        return [ 'success' => true, 'message' => 'Usuario eliminado' ];
    }

    /** Reiniciar contraseña a la cédula o a un valor por defecto */
    public function resetPassword(int $id) : array {
        // Obtener cedula
        $get = $this->db->prepare('SELECT cedula FROM usuarios WHERE id = ?');
        if (!$get) throw new Exception('Error al preparar consulta: ' . $this->db->error);
        $get->bind_param('i', $id);
        $get->execute();
        $res = $get->get_result();
        if (!$row = $res->fetch_assoc()) return [ 'success' => false, 'message' => 'Usuario no encontrado' ];
        $newPassword = $row['cedula'] ?: '123456';

        $upd = $this->db->prepare('UPDATE usuarios SET contrasena = ? WHERE id = ?');
        if (!$upd) throw new Exception('Error al preparar actualización: ' . $this->db->error);
        $upd->bind_param('si', $newPassword, $id);
        if (!$upd->execute()) {
            throw new Exception('Error al reiniciar contraseña: ' . $upd->error);
        }
        return [ 'success' => true, 'message' => 'Contraseña reiniciada' ];
    }
}
