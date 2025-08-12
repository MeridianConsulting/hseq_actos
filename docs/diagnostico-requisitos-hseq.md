## Diagnóstico de cumplimiento vs. levantamiento de requisitos – Plataforma HSEQ

### Resumen ejecutivo
- **F1. Registro de reportes**: Implementado. Formularios por tipo (hallazgos, incidentes, conversaciones), persistencia en `reportes`, subida de evidencia a `evidencias` (imágenes/PDF/DOC). Falta: soporte para video, múltiples evidencias desde el colaborador, y código/consecutivo legible de reporte.
- **F2. Notificaciones automáticas**: Parcial. Existe envío de correo al reportante en creación, cambio de estado y recordatorio de vencidos (>30 días), con registro en `notificaciones`. Falta: enrutamiento a responsables HSE por tipo/gravedad/área, configuración de destinatarios, SMTP/cola de correos y tarea programada.
- **F3. Generación de reportes**: Parcial. Hay dashboard con gráficas y exportación Excel (admin) y CSV (soporte). PDF se genera como HTML en ventana nueva (no PDF real). Falta: exportación PDF robusta y exportación de listados filtrados completos (no solo página actual) en Excel/PDF.
- **Seguridad (autenticación/roles)**: Implementado JWT y roles `admin`/`soporte`/`colaborador`. Falta rol explícito de `coordinador` si se requiere como perfil separado.
- **Integración externa**: No implementada con MERIDIAN/SharePoint (futuro).

---

### Trazabilidad con el documento de requisitos

#### 1) Objetivo y 2) Descripción general
- La app cumple el objetivo de centralizar reportes HSE y su gestión básica.

#### 3) Alcance funcional esperado
- **F1. Registro de Reporte**
  - Implementado:
    - Formularios por tipo en frontend (`HallazgosForm`, `IncidentesForm`, `ConversacionesForm`).
    - Endpoint `POST /api/reports` con validaciones y sanitización en `ReportController::createReport(...)`.
    - Campos mapeados a la tabla `reportes` (fecha, ubicación, descripción, etc.).
    - Evidencia: endpoint `POST /api/reports/{id}/evidencias` (multipart) y soporte base64 en creación; almacenamiento en `backend/uploads/` y tabla `evidencias`.
  - Pendiente/Mejoras:
    - Soporte de video (requisito permite “foto, video, PDF”). Actualmente tipos permitidos: imágenes, PDF, DOC/DOCX.
    - Carga de múltiples evidencias desde vista de colaborador (hoy un archivo por solicitud o vía soporte).
    - Generar un código/consecutivo legible (p. ej. HALL-2025-0001) además del `id` autoincremental.
- **F2. Notificaciones Automáticas**
  - Implementado:
    - Envío de correo en eventos: creación, cambio de estado, vencidos (>30 días) mediante `ReportController::notifyReportEvent(...)` y utilitario `send_email(...)`.
    - Registro en `notificaciones` de cada envío.
  - Pendiente/Mejoras:
    - Enviar a responsables HSEQ según tipo/gravedad/área (hoy va al reportante; se fuerza `MAIL_TEST_TO` en pruebas).
    - Definir y administrar responsables por reglas configurables (UI/tabla de “responsables por categoría/criticidad”).
    - SMTP/servicio transaccional (no `mail()`), colas y reintentos; tarea programada para recordatorios (cron/Windows Task Scheduler) en vez de endpoint manual.
- **F3. Generación de Reportes (PDF/Excel + gráficas)**
  - Implementado:
    - Dashboard con KPIs, tendencias y distribución por tipo.
    - Exportación Excel (admin) con `exceljs`/`xlsx`, incluyendo KPIs, series por periodo y detalle opcional.
    - Exportación CSV (soporte) de la página actual del listado.
  - Pendiente/Mejoras:
    - PDF “real” con plantilla corporativa (actualmente abre HTML en ventana; depende de impresión del navegador).
    - Exportación de listados completos (todo el filtro, no solo página) a Excel/PDF desde vistas de soporte.
    - Incluir gráficas en PDF (render a imagen) y metadatos/firmas.

#### 4) Requerimientos no funcionales
- **Seguridad**: Autenticación JWT y middleware; roles `admin`/`soporte`/`colaborador`. Falta confirmar si se requiere rol `coordinador` distinto a `soporte` y reforzar autorización fina por endpoints/acciones.
- **Disponibilidad 24/7**: No hay monitoreo/health-checks, ni documentación de despliegue/alta disponibilidad. Falta supervisión y alertas.
- **Compatibilidad**: Frontend responsive (React + Tailwind). Recomendado validar formalmente en navegadores móviles/desktop.
- **Rendimiento (< 2s)**: No hay métricas/APM. Recomendado medición y optimización (colas para correo, límites de payload, caching en listados/estadísticas).
- **Idioma**: Español implementado en UI y API.

#### 5) Usuarios del sistema
- Definidos y soportados: `colaborador`, `soporte` (responsable HSE), `admin`.
- Pendiente: `coordinador HSEQ` si se requiere como rol independiente (el código eliminó coordinador; hoy `soporte`/`admin` cubren la función).

#### 6) Flujos de información
- Implementado:
  - Creación con ID único (autoincremental), notificación al usuario, revisión y cambio de estado (`pendiente` → `en_revision`/`aprobado`/`rechazado`).
  - Historial básico vía timestamps/estado y consulta.
- Pendiente/Mejoras:
  - Código/consecutivo corporativo por tipo/proyecto.
  - Reglas de enrutamiento y SLA de atención (por criticidad/área) con notificación a responsables.
  - Programación automática de recordatorios.

#### 7) Entradas y salidas
- **Entradas**: Campos implementados; evidencia con imágenes/PDF/DOC.
  - Pendiente: soporte de video, validación de múltiples archivos, límites por rol.
- **Salidas**: Listados, estadísticas y exportaciones.
  - Pendiente: PDF robusto, exportación completa de filtros, descarga de evidencia para el reportante si aplica la política.

#### 8) Integración
- No implementada integración con MERIDIAN/SharePoint. Dejar parametrizado y documentar endpoints/colas para futura conexión (webhooks/API).

#### 9–11) Mockups, restricciones, observaciones
- Tecnología: Frontend React; Backend actual en PHP (preferencia inicial indicaba Node.js). No bloqueante, pero conviene documentar decisión y roadmap.
- Formularios de referencia: no hay integración directa; solo se tomaron campos/validaciones.

---

### Inventario técnico (referencias clave)
- Backend
  - `backend/index.php`: ruteo API, middleware JWT, endpoints de reportes/usuarios/notificaciones/evidencias.
  - `backend/controllers/reportController.php`: creación/edición/estado de reportes, estadísticas, evidencia, notificaciones.
  - `backend/utils/jwt.php`: emisión/validación de JWT.
  - `backend/utils/mailer.php`: envío de correos con `mail()` y variables de entorno.
  - Esquema BD: `database/hseq.sql` (`usuarios`, `reportes`, `evidencias`, `notificaciones`).
- Frontend (React)
  - Formularios: `src/components/forms/*`.
  - Dashboards: `src/admin/Dashboard.js`, `src/pages/SupportDashboard.js`.
  - Servicios API/exports: `src/services/api.js`, `src/admin/Dashboard.js` (Excel), `src/pages/SupportDashboard.js` (CSV).
  - Auth/roles: `src/utils/auth.js` (rutas por rol en `src/App.js`).

---

### Backlog recomendado (priorizado)
- Alta
  - Notificaciones a responsables HSE por tipo/gravedad/área (matriz de responsables + configuración UI/BD).
  - Programar recordatorios automáticos (cron/tarea programada) y migrar a SMTP/servicio de correo con colas y reintentos.
  - Exportación PDF corporativa con plantilla, inclusión de gráficas y listados completos por filtros.
  - Soporte de evidencia en video y múltiples archivos desde el flujo de colaborador.
  - Código/consecutivo legible por tipo/proyecto (p. ej. HALL-YYYY-NNNN) y exposición en UI/exportes.
  - Rol `coordinador` (si aplica) con vistas/alcances específicos.
- Media
  - Exportar listados completos (no solo “página actual”) en soporte; exportar Excel desde soporte.
  - Permisos finos por endpoint/acción y auditoría de cambios de estado.
  - Validación y pruebas de compatibilidad móvil (QA cruzado en navegadores).
- Baja
  - Integración futura con MERIDIAN/SharePoint (definir alcance API, colas y autenticación).
  - Health-checks, monitoreo y documentación de despliegue/operación 24/7.

---

### Conclusión
La plataforma cubre el núcleo de captura, gestión y visualización de reportes HSE. Para cumplir plenamente el levantamiento, se recomienda completar notificaciones a responsables con reglas operativas, robustecer exportaciones (especialmente PDF y listados completos), ampliar soporte de evidencias y formalizar operación (colas de correo, scheduling, monitoreo). Esto alinea el producto con los objetivos de trazabilidad y respuesta oportuna del área HSEQ.
