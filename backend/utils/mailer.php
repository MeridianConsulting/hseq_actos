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

function send_email(string $to, string $subject, string $htmlBody, ?string $textBody = null, array $attachments = []): array {
    // Cambiar esto a true cuando quieras activar el envío real
    if (!mailer_is_enabled()) {
        return ['success' => true, 'message' => 'Correo deshabilitado (no se envió).'];
    }

    try {
        $from = mailer_from();
        $boundary = md5(uniqid((string)mt_rand(), true));

        $hasAttachments = is_array($attachments) && count($attachments) > 0;

        // Headers
        $headers = "From: {$from}\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        if ($hasAttachments) {
            $headers .= "Content-Type: multipart/mixed; boundary=\"{$boundary}\"\r\n";
        } else {
            $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        }

        // Cuerpo del mensaje
        if ($hasAttachments) {
            $message = "--{$boundary}\r\n";
            $message .= "Content-Type: text/html; charset=UTF-8\r\n";
            $message .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
            $message .= $htmlBody . "\r\n";

            // Agregar adjuntos
            foreach ($attachments as $attachment) {
                if (!isset($attachment['content']) || !isset($attachment['filename'])) {
                    continue;
                }

                $content = $attachment['content'];
                $filename = $attachment['filename'];
                $mimeType = $attachment['mime_type'] ?? 'application/octet-stream';

                $message .= "--{$boundary}\r\n";
                $message .= "Content-Type: {$mimeType}; name=\"{$filename}\"\r\n";
                $message .= "Content-Transfer-Encoding: base64\r\n";
                $message .= "Content-Disposition: attachment; filename=\"{$filename}\"\r\n\r\n";
                $message .= chunk_split(base64_encode($content));
                $message .= "\r\n";
            }

            $message .= "--{$boundary}--\r\n"; // cierre correcto de multipart
        } else {
            $message = $htmlBody;
        }

        // Enviar correo (suprimir warnings y establecer envelope sender cuando sea posible)
        $fromSafe = preg_replace("/[\r\n]+/", '', mailer_from());
        $envelope = filter_var($fromSafe, FILTER_VALIDATE_EMAIL) ? "-f{$fromSafe}" : null;
        $result = $envelope !== null
            ? @mail($to, $subject, $message, $headers, $envelope)
            : @mail($to, $subject, $message, $headers);
        
        if ($result) {
            return ['success' => true, 'message' => 'Correo enviado exitosamente'];
        } else {
            return ['success' => false, 'message' => 'Error al enviar el correo'];
        }
        
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
    }
}


