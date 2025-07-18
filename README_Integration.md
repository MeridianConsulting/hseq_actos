# Integración Frontend-Backend para Reportes HSE

## 📋 Resumen

Se ha implementado una integración completa entre el frontend React y el backend PHP para manejar los reportes HSE. El sistema permite crear, gestionar y consultar reportes de tres tipos: hallazgos, incidentes y conversaciones.

## 🏗️ Arquitectura

### Backend (PHP)
- **Controlador**: `backend/controllers/reportController.php`
- **Base de datos**: MySQL con tabla `reportes`
- **API REST**: Endpoints para CRUD de reportes
- **Manejo de archivos**: Subida y almacenamiento de evidencias

### Frontend (React)
- **Servicio**: `frontend/src/services/reportService.js`
- **Componente**: `frontend/src/pages/CollaboratorDashboard.js`
- **Animación**: `frontend/src/components/SuccessAnimation.js`

## 🔌 Endpoints de la API

### POST `/api/reports`
**Crear un nuevo reporte**

**Body:**
```json
{
  "id_usuario": 1,
  "tipo_reporte": "hallazgos|incidentes|conversaciones",
  "asunto": "Asunto del reporte",
  "fecha_evento": "2025-07-18",
  // Campos específicos según tipo de reporte
  "evidencia": {
    "data": "base64_encoded_file",
    "type": "image/jpeg",
    "extension": "jpg"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reporte creado exitosamente",
  "report_id": 123
}
```

### GET `/api/reports`
**Obtener todos los reportes (con filtros opcionales)**

**Query Parameters:**
- `tipo_reporte`: Filtrar por tipo
- `estado`: Filtrar por estado

### GET `/api/reports/user?user_id=1`
**Obtener reportes de un usuario específico**

### GET `/api/reports/stats`
**Obtener estadísticas de reportes**

## 📊 Estructura de la Base de Datos

### Tabla `reportes`
```sql
CREATE TABLE `reportes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `tipo_reporte` enum('hallazgos','incidentes','conversaciones') NOT NULL,
  `estado` enum('pendiente','en_revision','cerrado') DEFAULT 'pendiente',
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  
  -- Campos comunes
  `asunto` varchar(255) DEFAULT NULL,
  `fecha_evento` date DEFAULT NULL,
  
  -- Campos específicos para Hallazgos
  `lugar_hallazgo` varchar(100) DEFAULT NULL,
  `tipo_hallazgo` enum('accion_mejoramiento','aspecto_positivo','condicion_insegura','acto_inseguro') DEFAULT NULL,
  `descripcion_hallazgo` text DEFAULT NULL,
  `recomendaciones` text DEFAULT NULL,
  `estado_condicion` enum('abierta','cerrada') DEFAULT NULL,
  
  -- Campos específicos para Incidentes
  `grado_criticidad` enum('bajo','medio','alto','critico') DEFAULT NULL,
  `ubicacion_incidente` varchar(255) DEFAULT NULL,
  `hora_evento` time DEFAULT NULL,
  `tipo_afectacion` enum('personas','medio_ambiente','instalaciones','vehiculos','seguridad_procesos','operaciones') DEFAULT NULL,
  `descripcion_incidente` text DEFAULT NULL,
  
  -- Campos específicos para Conversaciones
  `tipo_conversacion` enum('reflexion','conversacion') DEFAULT NULL,
  `sitio_evento_conversacion` varchar(255) DEFAULT NULL,
  `lugar_hallazgo_conversacion` varchar(100) DEFAULT NULL,
  `descripcion_conversacion` text DEFAULT NULL,
  `asunto_conversacion` varchar(255) DEFAULT NULL,
  
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`)
);
```

### Tabla `evidencias`
```sql
CREATE TABLE `evidencias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_reporte` int(11) NOT NULL,
  `tipo_archivo` varchar(20) DEFAULT NULL,
  `url_archivo` text NOT NULL,
  `subido_en` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_reporte`) REFERENCES `reportes` (`id`) ON DELETE CASCADE
);
```

## 🔄 Flujo de Datos

### 1. Usuario llena formulario
```javascript
// En CollaboratorDashboard.js
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Procesar evidencia
  let evidencia = null;
  if (reportData.evidencia) {
    evidencia = await ReportService.processEvidence(reportData.evidencia);
  }
  
  // Preparar datos
  const reportDataToSend = ReportService.prepareReportData(
    reportData, 
    selectedReportType, 
    user.id
  );
  
  // Enviar al backend
  const result = await ReportService.createReport(reportDataToSend);
};
```

### 2. Servicio procesa datos
```javascript
// En reportService.js
static prepareReportData(formData, tipoReporte, userId) {
  const baseData = {
    id_usuario: userId,
    tipo_reporte: tipoReporte,
    asunto: formData.asunto,
    fecha_evento: formData.fecha_evento
  };
  
  // Agregar campos específicos según tipo
  switch (tipoReporte) {
    case 'hallazgos':
      return { ...baseData, lugar_hallazgo: formData.lugar_hallazgo, /* ... */ };
    case 'incidentes':
      return { ...baseData, grado_criticidad: formData.grado_criticidad, /* ... */ };
    case 'conversaciones':
      return { ...baseData, tipo_conversacion: formData.tipo_conversacion, /* ... */ };
  }
}
```

### 3. Backend valida y guarda
```php
// En reportController.php
public function createReport($data) {
  // Validar datos requeridos
  if (!isset($data['tipo_reporte']) || !isset($data['id_usuario'])) {
    return ['success' => false, 'message' => 'Faltan campos requeridos'];
  }
  
  // Insertar en base de datos
  $sql = "INSERT INTO reportes (...) VALUES (...)";
  $stmt = $this->conn->prepare($sql);
  $stmt->execute();
  
  // Procesar evidencia si existe
  if (isset($data['evidencia'])) {
    $this->saveEvidence($reportId, $data['evidencia']);
  }
  
  return ['success' => true, 'report_id' => $reportId];
}
```

## 📁 Manejo de Archivos

### Estructura de directorios
```
backend/
├── uploads/           # Archivos subidos
│   ├── .htaccess     # Protección de archivos
│   └── evidencia_*   # Archivos de evidencia
└── controllers/
    └── reportController.php
```

### Proceso de subida
1. **Frontend**: Convierte archivo a base64
2. **Backend**: Decodifica y guarda en `/uploads/`
3. **Base de datos**: Guarda referencia en tabla `evidencias`

## 🛡️ Seguridad

### Validaciones
- **Frontend**: Validación de formularios con HTML5
- **Backend**: Validación de tipos de datos y campos requeridos
- **Base de datos**: Prepared statements para prevenir SQL injection

### Protección de archivos
- `.htaccess` en `/uploads/` restringe acceso directo
- Solo permite tipos de archivo específicos
- Headers de seguridad configurados

## 🚀 Uso

### 1. Instalar dependencias
```bash
# Frontend
cd frontend
npm install

# Backend (asegurar que PHP y MySQL estén configurados)
# Importar database/hseq.sql en MySQL
```

### 2. Configurar base de datos
```php
// backend/config/db.php
private $host = "localhost";
private $db_name = "hseq";
private $username = "root";
private $password = "";
```

### 3. Ejecutar aplicación
```bash
# Frontend
cd frontend
npm start

# Backend (XAMPP/WAMP)
# Asegurar que Apache y MySQL estén corriendo
```

## 🔧 Configuración

### Variables de entorno
- `API_BASE_URL`: URL del backend (default: `http://localhost/hseq/backend`)
- Configuración de base de datos en `backend/config/db.php`

### Permisos de archivos
```bash
chmod 755 backend/uploads/
chmod 644 backend/uploads/.htaccess
```

## 📈 Próximos Pasos

1. **Implementar autenticación JWT**
2. **Agregar validación de roles**
3. **Implementar notificaciones por email**
4. **Crear dashboard de administración**
5. **Agregar reportes y estadísticas**
6. **Implementar búsqueda y filtros avanzados**

## 🐛 Troubleshooting

### Error de conexión a la API
- Verificar que el backend esté corriendo
- Revisar URL en `reportService.js`
- Verificar configuración CORS

### Error de base de datos
- Verificar conexión MySQL
- Revisar credenciales en `db.php`
- Verificar que las tablas existan

### Error de subida de archivos
- Verificar permisos en `/uploads/`
- Revisar tamaño máximo de archivo
- Verificar tipos de archivo permitidos 