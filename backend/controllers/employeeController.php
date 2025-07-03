<?php
require_once __DIR__ . '/../config/db.php';

class EmployeeController {
    private $db;

    public function __construct() {
        $this->db = (new Database())->getConnection();
    }

    public function getAllEmployees(){
        $sql= 'SELECT id'
    }
}
