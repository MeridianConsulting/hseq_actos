# Sistema de Notificaciones HSEQ

## Funcionalidades Implementadas

### 1. Notificaciones Automáticas
- **Creación de reportes**: Se envía correo automáticamente al crear un nuevo reporte
- **Cambio de estado**: Se notifica cuando un reporte cambia de estado
- **Reportes vencidos**: Notificación automática para reportes con más de 30 días sin resolver

### 2. Configuración de Correo
- **Correo de prueba**: `desarrolloit@meridian.com.co`
- **Configuración vía variables de entorno**:
  - `MAIL_FROM`: Remitente (por defecto: no-reply@localhost)
  - `MAIL_ENABLE`: Habilitar/deshabilitar correos (true/false)
  - `MAIL_TEST_TO`: Destinatario forzado para pruebas

### 3. Endpoints API

#### Obtener Reportes Vencidos
```
GET /api/reports/overdue
```
- Requiere autenticación (admin/soporte)
- Retorna reportes con más de 30 días sin resolver

#### Notificar Reportes Vencidos
```
POST /api/reports/notify-overdue
```
- Requiere autenticación (admin/soporte)
- Envía correos a todos los reportes vencidos
- Retorna estadísticas de envío

#### Probar Correo
```
POST /api/test-email
{
  "to": "destinatario@ejemplo.com",
  "subject": "Asunto del correo",
  "body": "<p>Contenido HTML del correo</p>"
}
```
- Requiere autenticación (admin)
- Permite probar el envío de correos

### 4. Interfaz de Usuario
- **Ruta**: `/notifications`
- **Acceso**: Solo admin y soporte
- **Funcionalidades**:
  - Prueba de envío de correos
  - Lista de reportes vencidos
  - Envío masivo de notificaciones

## Cómo Probar

### 1. Script de Prueba
```bash
php test_notifications.php
```

### 2. Desde el Frontend
1. Iniciar sesión como admin o soporte
2. Navegar a `/notifications`
3. Probar envío de correo de prueba
4. Ver reportes vencidos
5. Enviar notificaciones masivas

### 3. Desde API
```bash
# Probar correo
curl -X POST http://localhost/hseq/backend/index.php/api/test-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{
    "to": "desarrolloit@meridian.com.co",
    "subject": "Prueba HSEQ",
    "body": "<p>Correo de prueba</p>"
  }'

# Obtener reportes vencidos
curl -X GET http://localhost/hseq/backend/index.php/api/reports/overdue \
  -H "Authorization: Bearer TU_TOKEN"

# Notificar vencidos
curl -X POST http://localhost/hseq/backend/index.php/api/reports/notify-overdue \
  -H "Authorization: Bearer TU_TOKEN"
```

## Configuración del Servidor

### Para XAMPP
1. Verificar que `php.ini` tenga habilitado `mail()`
2. Configurar SMTP local si es necesario
3. Para pruebas, los correos se envían a `desarrolloit@meridian.com.co`

### Variables de Entorno
```bash
# En .env o configurar en el servidor
MAIL_FROM=no-reply@hseq.local
MAIL_ENABLE=true
MAIL_TEST_TO=desarrolloit@meridian.com.co
```

## Estructura de Base de Datos

### Tabla `notificaciones`
```sql
CREATE TABLE `notificaciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_reporte` int(11) NOT NULL,
  `destinatario` varchar(255) NOT NULL,
  `medio` enum('correo','sms','push') DEFAULT 'correo',
  `enviado_en` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reporte` (`id_reporte`)
);
```

## Logs y Debugging

### Verificar Logs de PHP
```bash
tail -f /xampp/php/logs/php_error_log
```

### Verificar Tabla de Notificaciones
```sql
SELECT * FROM notificaciones ORDER BY enviado_en DESC LIMIT 10;
```

## Notas Importantes

1. **Correo de prueba**: Todos los correos se redirigen a `desarrolloit@meridian.com.co` durante desarrollo
2. **Seguridad**: Solo usuarios admin y soporte pueden acceder a las notificaciones
3. **Rendimiento**: Las notificaciones se procesan de forma asíncrona para no bloquear la UI
4. **Fallback**: Si falla el envío de correo, no se interrumpe el flujo del reporte

## Próximas Mejoras

- [ ] Configuración de plantillas de correo
- [ ] Notificaciones push
- [ ] Programación de notificaciones automáticas
- [ ] Dashboard de estadísticas de notificaciones
- [ ] Configuración de SMTP externo
