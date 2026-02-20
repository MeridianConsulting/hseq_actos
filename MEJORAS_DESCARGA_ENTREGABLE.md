# Entregable: Mejoras de descarga (reportes y evidencias) HSEQ

## 1) Lista exacta de archivos modificados

### Frontend
- `frontend/src/utils/downloadHelper.js` — **NUEVO**
- `frontend/src/services/api.js` — modificado
- `frontend/src/services/http.js` — modificado
- `frontend/src/admin/Dashboard.js` — modificado
- `frontend/src/components/ReportDetailsModal.js` — modificado

### Backend
- `backend/index.php` — modificado
- `backend/controllers/pdfController.php` — modificado

### No tocados (como se pidió)
- `.htaccess` — no modificado
- Estilos (CSS/SCSS, clases) — no modificados
- Lógica de negocio (filtros, estados, reglas) — no modificada

---

## 2) Diff (ANTES / DESPUÉS) de las secciones tocadas

### A) `frontend/src/utils/downloadHelper.js` — NUEVO
- Archivo nuevo con: `getHeader(headers, name)` (headers tipo axios), `downloadBlob(blob, fileName, contentType)` con `revokeObjectURL` tras descarga, `downloadFileWithRetry(url, fileName, options)` con timeout (60s), 2 reintentos con backoff, y `sanitizeFileName`.

### B) `frontend/src/services/api.js`
- **ANTES:** `response.headers.get('content-disposition')` y `response.headers.get('content-type')` (axios no tiene `.get()` en headers).
- **DESPUÉS:** Import de `getHeader` desde `downloadHelper`; lectura con `getHeader(response.headers, 'content-disposition')` y `getHeader(response.headers, 'content-type')`; petición con `timeout: 60000`; hasta 2 reintentos en errores 5xx o ECONNABORTED/Network Error con delay 600 ms.

### C) `frontend/src/services/http.js`
- **ANTES:** `axios.create({ baseURL, withCredentials: false })`.
- **DESPUÉS:** Añadido `timeout: 30000` por defecto (las descargas sobrescriben con 60s en la petición).

### D) `frontend/src/admin/Dashboard.js`
- **ANTES:** Tras Excel con ExcelJS: `link.click(); document.body.removeChild(link);` sin revoke. Tras CSV fallback: mismo flujo sin revoke.
- **DESPUÉS:** Tras ambos flujos se añade `setTimeout(() => { try { URL.revokeObjectURL(link.href); } catch (_) {} }, 1000);` para liberar la URL del blob.

### E) `frontend/src/components/ReportDetailsModal.js`
- **ANTES:** `handleDownloadImage` hacía `fetch(buildPublicImageUrl(evidencia.url_archivo))` (URL pública /uploads), podía fallar por CORS; luego blob, crear `<a>`, click, revoke en 2s.
- **DESPUÉS:** Import de `downloadBlob` y `downloadFileWithRetry`. Primero se usa `evidenceService.getEvidenceBlob(evidencia.id)` (API con timeout y reintentos); si hay blob se llama `downloadBlob(blob, finalName, contentType)`; si falla, fallback a `downloadFileWithRetry(apiUrl, baseFileName, { headers Authorization, timeoutMs: 60000, retries: 2 })`. Mismo botón y mensajes al usuario.

### F) `backend/index.php`
- **ANTES:** Antes de llamar al PdfController: `if (ob_get_length()) ob_clean();`.
- **DESPUÉS:** `while (ob_get_level() > 0) { @ob_end_clean(); }` para limpiar todos los niveles de buffer y evitar BOM/espacios que corrompan el PDF.

### G) `backend/controllers/pdfController.php`
- **ANTES:** `downloadReportPDF` empezaba con el try y el log.
- **DESPUÉS:** Al inicio del try se añade `while (ob_get_level() > 0) { @ob_end_clean(); }` para asegurar que no quede salida previa antes de generar el PDF.

---

## 3) Explicación técnica breve

### Causa probable del fallo/demora
- **Headers en axios:** En `api.js` se usaba `response.headers.get(...)`, pero en axios `response.headers` es un objeto, no un `Headers` con `.get()`, lo que podía dar `undefined` y nombres de archivo/tipo incorrectos.
- **Timeouts:** No había timeout en el cliente; peticiones lentas o colgadas no fallaban de forma controlada y daban sensación de “no responde”.
- **Reintentos:** Un fallo transitorio (5xx o red) cortaba la descarga sin segundo intento.
- **Memoria (frontend):** Algunas descargas creaban `URL.createObjectURL(blob)` sin `URL.revokeObjectURL`, manteniendo referencias innecesarias.
- **Descarga de evidencias:** Usar la URL pública `/uploads/...` para descargar podía chocar con CORS; usar la API autenticada `evidencias/:id` con timeout y reintentos hace la descarga más estable.
- **PDF backend:** Cualquier salida previa (buffer, BOM, espacios) antes de que TCPDF envíe el binario podía corromper el PDF o provocar errores; limpiar todos los buffers evita eso.

### Cambios aplicados para robustez
- **Headers:** Lectura con `getHeader(response.headers, name)` compatible con objeto de headers de axios.
- **Blob y revoke:** Utilidad `downloadBlob` que hace click y luego `revokeObjectURL`; mismo patrón en Dashboard para Excel/CSV.
- **Retries:** Solo en descargas: `getEvidenceBlob` hasta 2 reintentos en 5xx/ECONNABORTED/Network Error; `downloadFileWithRetry` con 2 reintentos y backoff corto para fetch.
- **Timeouts:** 30s por defecto en http; 60s en peticiones de evidencias y en `downloadFileWithRetry`.
- **Streaming/backend:** Evidencias ya usan `readfile()` (streaming en PHP). PDF sigue con TCPDF `Output('D')`; no se cambió arquitectura, solo limpieza de buffers para evitar salida previa.

### Cómo se confirmó que no se cambió lógica ni estilos
- No se modificaron componentes de UI (botones, modales, clases CSS, estilos).
- No se cambiaron filtros, estados de reportes, permisos ni reglas de negocio.
- No se tocó `.htaccess`.
- Mismos flujos desde el usuario: “Descargar PDF” (reportes detallados sigue siendo ventana de impresión; PDF del modal sigue siendo jsPDF en cliente), “Descargar Excel”, “Descargar” en evidencia; solo se robusteció la obtención y el guardado del archivo.

---

## 4) Checklist de pruebas recomendadas

| Prueba | Cómo | Resultado esperado |
|--------|------|--------------------|
| 1) Reporte PDF reciente (modal) | Abrir detalle de un reporte reciente → “Descargar PDF” | PDF se genera y descarga con nombre correcto (reporte_hseq_ID_asunto.pdf). |
| 2) Reporte PDF antiguo | Igual con reporte antiguo | Mismo comportamiento. |
| 3) Evidencia imagen (jpg/png) | En detalle de reporte → “Descargar” en una evidencia imagen | Archivo descargado con nombre correcto (ej. evidencia_*.jpg). |
| 4) Evidencia PDF | Descargar evidencia tipo PDF | PDF descargado con nombre correcto. |
| 5) Evidencia archivo grande | Si existe, descargar evidencia grande | No falla por timeout (60s); o falla con mensaje claro. |
| 6) Red lenta (throttling) | DevTools → Network → Slow 3G, intentar descargas | No falla “en silencio”; tras reintentos puede completar o mostrar error. |
| 7) Nombre de archivo | Revisar nombre del archivo guardado en disco | Coincide con evidencia/reporte (sin caracteres raros). |
| 8) Duplicación de requests | Pestaña Network al descargar una evidencia | No hay 2 requests duplicados al mismo endpoint por la misma evidencia (cache + un solo flujo). |
| 9) Excel Dashboard | “Descargar Excel” (reportes detallados o con filtros) | Excel/CSV se descarga y no hay fugas de memoria (revoke aplicado). |
| 10) PDF backend (si se usa) | GET `/api/reports/:id/pdf` (ej. desde otro cliente o storeReportPDFTemp) | Respuesta binaria PDF con headers correctos; sin salida previa que corrompa el archivo. |

---

*Documento generado como parte de las mejoras de descarga HSEQ. No se han cambiado estilos, lógica de negocio ni .htaccess.*
