# Funcionalidad: PDF Adjunto en Correo al Cerrar Reporte

## 📋 Resumen de Cambios

Se ha implementado la funcionalidad para que cuando un reporte se **cierre** (cambie a estado "aprobado" o "rechazado"), se adjunte automáticamente el PDF del reporte en el correo de notificación al usuario.

## 🔧 Archivos Modificados

### 1. `backend/utils/mailer.php`
- ✅ Actualizado para soportar adjuntos en correos
- ✅ Nuevo parámetro `$attachments` en `send_email()`
- ✅ Implementación de MIME multipart/mixed para adjuntos

### 2. `backend/controllers/reportController.php`
- ✅ Método `notifyReportEvent()` actualizado para detectar estados cerrados
- ✅ Nuevo método `generateReportPDFContent()` para generar PDF como string
- ✅ Nuevo método `generateSimplePDFHTML()` para crear HTML del reporte
- ✅ Manejo robusto de errores con logging detallado

## 🚀 Cómo Funciona

1. **Usuario crea reporte** → Estado inicial: "pendiente"
2. **Coordinador/Admin revisa** → Cambia estado a "aprobado" o "rechazado"
3. **Sistema detecta el cierre** → Se ejecuta `updateReportStatus()`
4. **Se genera notificación** → `notifyReportEvent()` es llamado
5. **Se genera PDF** → `generateReportPDFContent()` crea el PDF
6. **Se envía correo** → El PDF se adjunta al correo de notificación

## ⚙️ Configuración

### Activar Envío de Correos

El envío de correos está actualmente **deshabilitado** por defecto. Para activarlo:

**Opción 1: Variable de Entorno (Recomendado)**
```bash
# En tu archivo .env o configuración del servidor
MAIL_ENABLE=true
MAIL_FROM=hseq@meridianltda.com
MAIL_TEST_TO=desarrolloit@meridian.com.co  # Opcional: para pruebas
```

**Opción 2: Modificar código directamente**
En `backend/utils/mailer.php`, línea 30:
```php
if (!mailer_is_enabled()) {
    return ['success' => true, 'message' => 'Correo deshabilitado (no se envió).'];
}
```
Comentar o eliminar este bloque para activar el envío.

### Verificar TCPDF

El sistema usa TCPDF para generar PDFs. Verificar que existe en:
```
backend/vendor/tcpdf/tcpdf.php
```

## 🧪 Cómo Probar

### Prueba 1: Aprobar un Reporte
```bash
1. Crear un nuevo reporte en el sistema
2. Como coordinador/admin, ir a la lista de reportes
3. Hacer clic en "Aprobar" en el reporte
4. Verificar que:
   - El estado cambia a "aprobado"
   - Se envía un correo al usuario
   - El correo contiene el PDF adjunto
```

### Prueba 2: Rechazar un Reporte
```bash
1. Seleccionar un reporte pendiente
2. Hacer clic en "Rechazar"
3. Agregar comentarios de rechazo
4. Verificar que:
   - El estado cambia a "rechazado"
   - Se envía correo con PDF adjunto
   - Los comentarios aparecen en el PDF
```

## 📝 Verificar Logs

Los logs se encuentran en el error_log de PHP. Buscar mensajes como:

```
Intentando generar PDF para reporte #123 con estado aprobado
PDF generado exitosamente para reporte #123
Error generando PDF para adjuntar: [mensaje de error]
```

### Ver logs en servidor
```bash
# En servidor Linux/XAMPP
tail -f /var/log/apache2/error.log

# En XAMPP Windows
# Ver en: C:\xampp\apache\logs\error.log
```

## 🛠️ Troubleshooting

### Error 500 al Actualizar Estado

**Problema:** Error interno del servidor al aprobar/rechazar reporte

**Solución:**
1. Verificar logs de PHP para mensaje detallado
2. Asegurarse de que TCPDF está instalado
3. Verificar permisos de lectura en carpeta `vendor/tcpdf/`

```bash
# Verificar si TCPDF existe
ls -la backend/vendor/tcpdf/tcpdf.php

# Dar permisos si es necesario (Linux)
chmod 755 backend/vendor/tcpdf/
```

### PDF No Se Adjunta

**Problema:** El correo se envía pero sin PDF adjunto

**Verificar:**
1. Revisar logs para mensaje "PDF generado exitosamente"
2. Si dice "pdfContent es null", hay problema en generación
3. Verificar que el reporte tenga datos completos

```bash
# Revisar log
grep "PDF generado" /var/log/apache2/error.log
```

### Correo No Se Envía

**Problema:** No llega ningún correo

**Verificar:**
1. `MAIL_ENABLE=true` está configurado
2. Servidor tiene MTA configurado (sendmail, postfix, etc.)
3. Revisar bandeja de spam

```bash
# Verificar si sendmail está activo (Linux)
which sendmail
service sendmail status

# Probar envío manual
echo "Test" | mail -s "Test" tu@email.com
```

## 📧 Formato del Correo con PDF

El correo que recibe el usuario incluye:

```
Asunto: [HSEQ] Estado actualizado reporte #123 → aprobado

Cuerpo:
- Notificación del cambio de estado
- Comentarios del revisor (si los hay)
- Mensaje indicando que se adjunta el PDF
- Archivo adjunto: reporte_hseq_123.pdf
```

## 📄 Contenido del PDF

El PDF generado incluye:

- **Encabezado:** Logo y título "REPORTE HSEQ"
- **Información General:**
  - ID del reporte
  - Tipo de reporte
  - Estado
  - Usuario
  - Fecha del evento
  - Título/Asunto

- **Descripción:** Según el tipo de reporte
- **Comentarios de Revisión:** Si los hay
- **Evidencias:** Cantidad de evidencias adjuntas

## 🔒 Seguridad

- ✅ Los PDFs solo se generan cuando el estado es "aprobado" o "rechazado"
- ✅ Solo coordinadores y admins pueden cambiar estados
- ✅ Todos los datos se escapan con `htmlspecialchars()`
- ✅ Los errores se manejan silenciosamente para no interrumpir el flujo
- ✅ Se registran en logs para debugging

## 🔄 Rollback (En Caso de Problemas)

Si necesitas desactivar temporalmente la funcionalidad:

```php
// En backend/controllers/reportController.php
// Línea ~1308, comentar el bloque:

/*
if (in_array($estadoOriginal, ['aprobado', 'rechazado'])) {
    try {
        // ... código de generación de PDF
    } catch (Exception $e) {
        // ...
    }
}
*/
```

O simplemente desactivar correos:
```bash
MAIL_ENABLE=false
```

## 📞 Soporte

Si encuentras algún problema:

1. **Revisar logs** primero
2. **Verificar configuración** de correo y TCPDF
3. **Contactar soporte** con:
   - Mensaje de error específico
   - ID del reporte que causó el problema
   - Contenido de los logs relevantes

---

**Fecha de Implementación:** 27 de Octubre, 2025
**Versión:** 1.0
**Estado:** ✅ Implementado y Listo para Pruebas

