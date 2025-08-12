<?php
/**
 * Cargador simple de variables de entorno desde un archivo .env
 *
 * - Soporta líneas KEY=VALUE
 * - Ignora líneas vacías y comentarios (# ...)
 * - Quita comillas envolventes simples o dobles
 * - No expande variables anidadas
 */
function env_load(string $path): void {
    if (!is_file($path)) { return; }
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $trimmed = trim($line);
        if ($trimmed === '' || str_starts_with($trimmed, '#')) { continue; }
        $pos = strpos($trimmed, '=');
        if ($pos === false) { continue; }
        $key = trim(substr($trimmed, 0, $pos));
        $val = trim(substr($trimmed, $pos + 1));
        if (($val[0] ?? '') === '"' && substr($val, -1) === '"') {
            $val = substr($val, 1, -1);
        } elseif (($val[0] ?? '') === "'" && substr($val, -1) === "'") {
            $val = substr($val, 1, -1);
        }
        // Establecer en entorno
        putenv($key . '=' . $val);
        $_ENV[$key] = $val;
        $_SERVER[$key] = $val;
    }
}

/**
 * Carga .env desde el root del proyecto (un nivel arriba de backend) y un .env local opcional en backend
 */
function env_bootstrap(): void {
    $rootEnv = dirname(__DIR__, 1) . DIRECTORY_SEPARATOR . '.env';
    $backendEnv = __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '.env';
    env_load($rootEnv);
    env_load($backendEnv);
}


