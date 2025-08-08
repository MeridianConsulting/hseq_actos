<?php
/**
 * Utilidades simples para JWT (HS256)
 */

function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode($data) {
    return base64_decode(strtr($data, '-_', '+/'));
}

function jwt_get_secret() {
    $secret = getenv('JWT_SECRET');
    if (!$secret) {
        // Valor por defecto solo para desarrollo local
        $secret = 'change-me-in-env-very-secret-key';
    }
    return $secret;
}

function jwt_encode(array $payload, int $ttlSeconds = 3600) {
    $header = ['alg' => 'HS256', 'typ' => 'JWT'];
    $now = time();
    $payload['iat'] = $payload['iat'] ?? $now;
    $payload['exp'] = $payload['exp'] ?? ($now + $ttlSeconds);
    $segments = [
        base64url_encode(json_encode($header)),
        base64url_encode(json_encode($payload))
    ];
    $signingInput = implode('.', $segments);
    $signature = hash_hmac('sha256', $signingInput, jwt_get_secret(), true);
    $segments[] = base64url_encode($signature);
    return implode('.', $segments);
}

function jwt_decode(string $token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        throw new Exception('Token inválido');
    }
    [$header64, $payload64, $signature64] = $parts;
    $signingInput = $header64 . '.' . $payload64;
    $expected = base64url_encode(hash_hmac('sha256', $signingInput, jwt_get_secret(), true));
    if (!hash_equals($expected, $signature64)) {
        throw new Exception('Firma inválida');
    }
    $payload = json_decode(base64url_decode($payload64), true);
    if (!$payload) {
        throw new Exception('Payload inválido');
    }
    if (isset($payload['exp']) && time() >= (int)$payload['exp']) {
        throw new Exception('Token expirado');
    }
    return $payload;
}

function jwt_from_authorization_header() {
    $headers = getallheaders();
    if (!isset($headers['Authorization'])) return null;
    $auth = $headers['Authorization'];
    if (stripos($auth, 'Bearer ') === 0) {
        return trim(substr($auth, 7));
    }
    return null;
}


