<?php
class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    public $conn;

    private function connectWithConfig(array $config) {
        $this->host = $config['host'];
        $this->db_name = $config['name'];
        $this->username = $config['user'];
        $this->password = $config['pass'];
        $this->conn = null;
        $conn = @new mysqli($this->host, $this->username, $this->password, $this->db_name);
        if ($conn->connect_error) {
            throw new Exception("Conexión fallida");
        }
        if (!$conn->set_charset('utf8mb4')) {
            throw new Exception('No se pudo establecer charset utf8mb4');
        }
        $conn->query("SET sql_mode='STRICT_ALL_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ZERO_DATE,NO_ZERO_IN_DATE'");
        $this->conn = $conn;
        return $this->conn;
    }

    public function getConnection(){
        // Modo de conexión: 'local', 'host' o 'auto' (intenta host y cae a local)
        $mode = getenv('DB_MODE') ?: 'auto';

        // Config remota (host) vía variables DB_*
        $hostConfig = [
            'host' => getenv('DB_HOST') ?: null,
            'name' => getenv('DB_NAME') ?: null,
            'user' => getenv('DB_USER') ?: null,
            'pass' => getenv('DB_PASS') !== false ? getenv('DB_PASS') : null,
        ];

        // Config local (con valores por defecto típicos de XAMPP)
        $localConfig = [
            'host' => getenv('LOCAL_DB_HOST') ?: 'localhost',
            'name' => getenv('LOCAL_DB_NAME') ?: 'hseq',
            'user' => getenv('LOCAL_DB_USER') ?: 'root',
            'pass' => getenv('LOCAL_DB_PASS') !== false ? getenv('LOCAL_DB_PASS') : '',
        ];

        $hostConfigUsable = !empty($hostConfig['host']) && !empty($hostConfig['name']) && !empty($hostConfig['user']);

        try{
            if ($mode === 'host') {
                return $this->connectWithConfig($hostConfig);
            }
            if ($mode === 'local') {
                return $this->connectWithConfig($localConfig);
            }

            // auto: intenta host primero si está configurado, si falla o no está, cae a local
            if ($hostConfigUsable) {
                try {
                    return $this->connectWithConfig($hostConfig);
                } catch (Exception $e) {
                    // continuar a local
                }
            }
            return $this->connectWithConfig($localConfig);
        } catch (Exception $exception) {
            // Propagar para que el manejador global controle la respuesta (evita filtrar detalles)
            throw $exception;
        }
    }
}

$db = (new Database())->getConnection();