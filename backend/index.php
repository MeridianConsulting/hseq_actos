<?php

require_once __DIR__ . '/middleware/cors.php';

header('Content-Type: application/json');

require_once __DIR__ . '/controllers/employeeController.php';

error_reporting(E_ALL);
ini_set('display_errors', 0);

define('BASE_PATH', '/hseq/backend');

$method = $_SERVER['REQUEST_METHOD'];
$path = trim(str_replace(BASE_PATH, '', parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH)), "/");

error_log("Method: $method, Path: $path");

function handleRequest($method, $path){
    $path = trim($path, "/");
    $controller = null;

    if($path === 'api/employees' && $method === "GET"){
        $controller = new EmployeeController();
        $result = $controller->getAllEmployees();
        echo json_encode($result);
    }
    elseif($path === 'api/employees/{id}' && $method === "GET"){
        $controller = new EmployeeController();
        $result = $controller->getEmployeeById($_GET['id']);
        echo json_encode($result);
    }
    elseif($path === 'api/employees' && $method === "POST"){
        $data = json_decode(file_get_contents("php://input"), true);
        if(!$data){
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Datos inválidos"]);
            return;
        }
    }elseif($path === 'api/employees/{id}' && $method === "DELETE"){
        $controller = new EmployeeController();
        $result = $controller->deleteEmployee($_GET['id']);
        echo json_encode($result);
    }
    else{
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Ruta no encontrada"]);
    }




}
handleRequest($method, $path);
?>