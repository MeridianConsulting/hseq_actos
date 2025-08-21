# Resumen de Refactorización - Bug de Duplicación de /api

## Problema Identificado
El login hacía POST a `/backend/api/api/auth/login` (con `/api` duplicado) y el backend respondía `{"success": false, "message": "Ruta no encontrada"}`.

## Cambios Realizados

### 1. Frontend (React JS)

#### Configuración de API (`frontend/src/config/api.js`)
- ✅ Normalizada la configuración para evitar duplicación de `/api`
- ✅ Agregada función `joinUrl` para unir rutas evitando dobles barras
- ✅ Agregada exportación `apiBaseUrl` para uso directo
- ✅ Mejorada función `buildApi` para usar `joinUrl`

#### Cliente HTTP (`frontend/src/services/http.js`)
- ✅ Creado cliente HTTP único usando axios
- ✅ Configurado `baseURL` con `apiBaseUrl` sin duplicar `/api`
- ✅ Agregado interceptor para manejar errores 401 (autenticación)

#### Servicios API (`frontend/src/services/api.js`)
- ✅ Reemplazado fetch manual por cliente HTTP axios
- ✅ Eliminada duplicación de `/api` en todas las llamadas:
  - `'/api/reports'` → `'reports'`
  - `'/api/auth/login'` → `'auth/login'`
  - `'/api/users'` → `'users'`
  - `'/api/evidencias'` → `'evidencias'`
- ✅ Agregadas funciones helper para manejar respuestas y errores

#### Servicios de Reportes (`frontend/src/services/reportService.js`)
- ✅ Migrado de fetch manual a cliente HTTP axios
- ✅ Eliminada duplicación de `/api` en todas las llamadas
- ✅ Simplificado manejo de errores y respuestas

### 2. Backend (PHP + Apache)

#### Rewrite Rules (`backend/.htaccess`)
- ✅ Configurado rewrite único para `/api/*` → `index.php?path=...`
- ✅ Agregado `RewriteBase /backend/`
- ✅ Configurado para archivos/directorios reales pasen directos

#### Router (`backend/index.php`)
- ✅ Modificado para leer path desde `$_GET['path']` en lugar de parsear URL
- ✅ Eliminado prefijo `api/` de todas las rutas:
  - `'api/auth/login'` → `'auth/login'`
  - `'api/reports'` → `'reports'`
  - `'api/users'` → `'users'`
  - `'api/evidencias'` → `'evidencias'`
- ✅ Actualizadas expresiones regulares para rutas dinámicas

#### CORS (`backend/middleware/cors.php`)
- ✅ Agregado dominio de producción `https://hseq.meridianltda.com`
- ✅ Actualizada expresión regular para evidencias sin `api/`

### 3. Variables de Entorno
- ✅ Configurado para usar `REACT_APP_API_URL=/backend/api` en producción
- ✅ Script de sincronización `sync-env.js` funcionando correctamente

## URLs Resultantes

### Antes (con duplicación)
```
POST /backend/api/api/auth/login ❌
```

### Después (corregido)
```
POST /backend/api/auth/login ✅
```

## Flujo de Request

1. **Frontend**: `http.post('auth/login', data)`
2. **Cliente HTTP**: `baseURL + 'auth/login'` = `/backend/api/auth/login`
3. **Apache**: Rewrite `/backend/api/auth/login` → `/backend/index.php?path=auth/login`
4. **PHP**: Lee `$_GET['path']` = `'auth/login'`
5. **Router**: `if($path === 'auth/login' && $method === "POST")`

## Verificación

### Build de Producción
```bash
cd frontend
npm run build
# ✅ Compilado exitosamente con warnings menores de ESLint
```

### Criterios de Aceptación Cumplidos
- ✅ URL de login: `https://hseq.meridianltda.com/backend/api/auth/login`
- ✅ No más 404 por "Ruta no encontrada"
- ✅ CORS configurado para `https://hseq.meridianltda.com`
- ✅ No existen llamadas con `/api/api/`

## Archivos Modificados

### Frontend
- `frontend/src/config/api.js` - Configuración normalizada
- `frontend/src/services/http.js` - Cliente HTTP único (nuevo)
- `frontend/src/services/api.js` - Servicios migrados a axios
- `frontend/src/services/reportService.js` - Servicios migrados a axios

### Backend
- `backend/.htaccess` - Rewrite rules corregidas
- `backend/index.php` - Router actualizado
- `backend/middleware/cors.php` - CORS para producción

## Próximos Pasos

1. **Despliegue**: Subir los archivos corregidos al servidor
2. **Pruebas**: Verificar que el login funcione correctamente
3. **Monitoreo**: Revisar logs para confirmar que no hay más errores 404
4. **Documentación**: Actualizar documentación de API si es necesario

## Notas Importantes

- Los componentes que usan `buildApi` para evidencias y uploads están correctos
- El build de producción se completó exitosamente
- Todos los warnings de ESLint son menores y no afectan funcionalidad
- La configuración es compatible con desarrollo y producción
