<?php
require_once __DIR__ . '/../config/db.php';

class EmployeeController {
    private $db;

    public function __construct() {
        $this->db = (new Database())->getConnection();
    }

    public function getAllEmployees(){
        $sql= 'SELECT id, nombre, correo, rol, activo, creado_en FROM usuarios ORDER BY id DESC';
        $stmt = $this->db->prepare($sql);
        if (!$stmt) {
            throw new Exception("Error al preparar la consulta: " . $this->db->error);
        }
        $stmt->execute();
        return $stmt->get_result();
    }

    
    public function getEmployeeById($id){
        $sql= 'SELECT id, nombre, correo, rol, activo, creado_en FROM usuarios WHERE id = ?';
        $stmt = $this->db->prepare($sql);
        if (!$stmt) {
            throw new Exception("Error al preparar la consulta: " . $this->db->error);
        }
        $stmt->bind_param('i', $id);
    }

    public function createEmployee($data){
        $sql = 'INSERT INTO usuarios (nombre, correo, rol, activo, creado_en) VALUES (?, ?, ?, ?, NOW())';
        $stmt = $this->db->prepare($sql);
        if (!$stmt) {
            throw new Exception("Error al preparar la consulta: " . $this->db->error);
        }
        $stmt->bind_param('sssi', $data['nombre'], $data['correo'], $data['rol'], $data['activo']);
        $stmt->execute();
        return $stmt->affected_rows;
    }
    public function deleteEmployee($id){
        $sql = 'DELETE FROM usuarios WHERE id = ?';
        $stmt = $this->db->prepare($sql);
        if (!$stmt) {
            throw new Exception("Error al preparar la consulta: " . $this->db->error);
        }
        $stmt->bind_param('i', $id);
    }
}
