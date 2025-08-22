<?php
/**
 * Utilidades para generar URLs firmadas
 */

class SignedUrlGenerator {
    private $secretKey;
    private $baseUrl;
    private $defaultTtl;
    
    public function __construct($secretKey, $baseUrl = null, $defaultTtl = 600) {
        $this->secretKey = $secretKey;
        $this->baseUrl = $baseUrl ?: $this->getBaseUrl();
        $this->defaultTtl = $defaultTtl;
    }
    
    /**
     * Genera una URL firmada para un archivo
     * 
     * @param string $fileName Nombre del archivo
     * @param int $ttl Tiempo de vida en segundos (opcional)
     * @return string URL firmada
     */
    public function generateSignedUrl($fileName, $ttl = null) {
        $ttl = $ttl ?: $this->defaultTtl;
        $expiration = time() + $ttl;
        
        // Crear firma HMAC
        $signature = hash_hmac('sha256', $fileName . '|' . $expiration, $this->secretKey);
        
        // Construir URL
        $url = $this->baseUrl . '/signed-uploads.php?' . http_build_query([
            'f' => $fileName,
            'exp' => $expiration,
            'sig' => $signature
        ]);
        
        return $url;
    }
    
    /**
     * Genera múltiples URLs firmadas para una lista de archivos
     * 
     * @param array $fileNames Lista de nombres de archivos
     * @param int $ttl Tiempo de vida en segundos (opcional)
     * @return array Array asociativo [fileName => signedUrl]
     */
    public function generateMultipleSignedUrls($fileNames, $ttl = null) {
        $urls = [];
        foreach ($fileNames as $fileName) {
            $urls[$fileName] = $this->generateSignedUrl($fileName, $ttl);
        }
        return $urls;
    }
    
    /**
     * Valida una URL firmada (para testing)
     * 
     * @param string $url URL firmada completa
     * @return bool True si la URL es válida
     */
    public function validateSignedUrl($url) {
        $parsed = parse_url($url);
        if (!isset($parsed['query'])) {
            return false;
        }
        
        parse_str($parsed['query'], $params);
        
        if (!isset($params['f'], $params['exp'], $params['sig'])) {
            return false;
        }
        
        // Verificar expiración
        if ((int)$params['exp'] < time()) {
            return false;
        }
        
        // Verificar firma
        $expectedSignature = hash_hmac('sha256', $params['f'] . '|' . $params['exp'], $this->secretKey);
        return hash_equals($expectedSignature, $params['sig']);
    }
    
    /**
     * Obtiene la URL base automáticamente
     */
    private function getBaseUrl() {
        $scheme = 'http';
        if ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || 
            (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')) {
            $scheme = 'https';
        }
        
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
        $basePath = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\');
        
        return $scheme . '://' . $host . $basePath;
    }
}

// Función helper para uso rápido
function generateSignedUrl($fileName, $secretKey = null, $ttl = 600) {
    $secretKey = $secretKey ?: 'tu_clave_secreta_muy_larga_y_compleja_aqui_2024';
    $generator = new SignedUrlGenerator($secretKey);
    return $generator->generateSignedUrl($fileName, $ttl);
}

// Ejemplo de uso:
/*
$generator = new SignedUrlGenerator('mi_clave_secreta');
$signedUrl = $generator->generateSignedUrl('evidencia_50_1755870460_68a874fc3b4c4.jpg', 300); // 5 minutos

// O usar la función helper
$signedUrl = generateSignedUrl('evidencia_50_1755870460_68a874fc3b4c4.jpg');
*/
?>
