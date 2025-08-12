<?php
class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    public $conn;

    public function getConnection(){
        // Permitir configuración vía .env
        $this->host = getenv('DB_HOST') ?: 'localhost';
        $this->db_name = getenv('DB_NAME') ?: 'hseq';
        $this->username = getenv('DB_USER') ?: 'root';
        $this->password = getenv('DB_PASS') ?: '';
        $this->conn = null;
        try{
            $this->conn = new mysqli($this->host, $this->username, $this->password, $this->db_name);
            if ($this->conn->connect_error) {
                throw new Exception("Conexión fallida");
            }
        } catch (Exception $exception) {
            // Propagar para que el manejador global controle la respuesta (evita filtrar detalles)
            throw $exception;
        }
        return $this->conn;
    }
}

$db = (new Database())->getConnection();