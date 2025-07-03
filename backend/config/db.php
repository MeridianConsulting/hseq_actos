<?php
class Database {
    private $host = "localhost";
    private $db_name = "hseq";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection(){
        $this->conn = null;
        try{
            $this->conn = new mysqli($this->host, $this->username, $this->password, $this->db_name);
            if ($this->conn->connect_error) {
                throw new Exception("Conexión fallida: " . $this->conn->connect_error);
            }
        } catch (Exception $exception) {
            die("Error: " . $exception->getMessage());
        }
        return $this->conn;
    }
}

$db = (new Database())->getConnection();