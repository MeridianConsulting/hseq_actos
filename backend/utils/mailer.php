<?php
/**
 * Mailer básico usando mail() de PHP.
 * Configurable vía variables de entorno:
 *  - MAIL_FROM (por defecto: no-reply@localhost)
 *  - MAIL_ENABLE ("true"|"false", por defecto: true)
 *  - MAIL_TEST_TO (si se define, sobrescribe destinatario para pruebas)
 */

function mailer_is_enabled(): bool {
    $v = getenv('MAIL_ENABLE');
    if ($v === false || $v === '') return true; // por defecto habilitado
    return strtolower($v) === 'true' || $v === '1';
}

function mailer_from(): string {
    $from = getenv('MAIL_FROM');
    if (!$from) $from = 'no-reply@localhost';
    return $from;
}

function mailer_test_to(): ?string {
    $to = getenv('MAIL_TEST_TO');
    if ($to && filter_var($to, FILTER_VALIDATE_EMAIL)) return $to;
    return null;
}

function send_email(string $to, string $subject, string $htmlBody, ?string $textBody = null): array {
    if (!mailer_is_enabled()) {
        return ['success' => false, 'message' => 'Correo deshabilitado por configuración'];
    }

    // Forzar destino de pruebas si está configurado
    $override = mailer_test_to();
    if ($override) { $to = $override; }

    $headers = [];
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-type: text/html; charset=UTF-8';
    $headers[] = 'From: ' . mailer_from();
    $headersStr = implode("\r\n", $headers);

    // Proteger de warnings de mail() que podrían activar el manejador global y devolver 500
    $prevHandler = set_error_handler(function() { /* swallow warnings from mail() */ }, E_WARNING | E_NOTICE);
    try {
        $ok = @mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $htmlBody, $headersStr);
    } finally {
        if ($prevHandler !== null) {
            set_error_handler($prevHandler);
        } else {
            restore_error_handler();
        }
    }
    if ($ok) {
        return ['success' => true, 'message' => 'Correo enviado'];
    }
    return ['success' => false, 'message' => 'Fallo al enviar correo (función mail)'];
}


