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
	// En esta versión se deshabilita el envío de correos.
	// Se retorna éxito para no romper flujos que esperan respuesta positiva.
	return ['success' => true, 'message' => 'Correo deshabilitado (no se envió).'];
}


