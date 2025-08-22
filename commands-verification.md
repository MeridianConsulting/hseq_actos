# Comandos de Verificación y Corrección

## 1. Verificación de Archivos y Permisos

### Verificar existencia de archivo específico:
```bash
# Verificar archivo específico
curl -I "https://hseq.meridianltda.com/backend/uploads/evidencia_50_1755870460_68a874fc3b4c4.jpg"

# Verificar con script de diagnóstico
curl "https://hseq.meridianltda.com/backend/debug-uploads.php?action=check_file&file=evidencia_50_1755870460_68a874fc3b4c4.jpg"
```

### Verificar directorio de uploads:
```bash
# Listar archivos en uploads
curl "https://hseq.meridianltda.com/backend/debug-uploads.php?action=list_files"

# Verificar directorio
curl "https://hseq.meridianltda.com/backend/debug-uploads.php?action=check_directory"
```

### Comandos SSH (si tienes acceso):
```bash
# Navegar al directorio
cd /home/eufbe81hvmyp/public_html/hseq.meridianltda.com/backend/uploads/

# Verificar permisos del directorio
ls -la

# Verificar archivo específico
ls -la evidencia_50_1755870460_68a874fc3b4c4.jpg

# Verificar propietario y grupo
stat evidencia_50_1755870460_68a874fc3b4c4.jpg

# Verificar permisos del directorio padre
ls -la /home/eufbe81hvmyp/public_html/hseq.meridianltda.com/backend/
```

## 2. Corrección de Permisos

### Si tienes acceso SSH:
```bash
# Corregir permisos del directorio uploads
chmod 755 /home/eufbe81hvmyp/public_html/hseq.meridianltda.com/backend/uploads/

# Corregir permisos de archivos de imagen
find /home/eufbe81hvmyp/public_html/hseq.meridianltda.com/backend/uploads/ -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.webp" -o -name "*.bmp" -o -name "*.svg" | xargs chmod 644

# Corregir propietario (reemplazar 'usuario_web' con el usuario correcto)
chown -R usuario_web:usuario_web /home/eufbe81hvmyp/public_html/hseq.meridianltda.com/backend/uploads/

# Verificar que el directorio sea legible por el servidor web
chmod 755 /home/eufbe81hvmyp/public_html/hseq.meridianltda.com/backend/
```

### Si NO tienes acceso SSH (usar panel de control):
1. Ir al panel de control del hosting
2. Buscar "File Manager" o "Administrador de archivos"
3. Navegar a `/backend/uploads/`
4. Verificar permisos:
   - Directorio: 755 (drwxr-xr-x)
   - Archivos de imagen: 644 (-rw-r--r--)
5. Cambiar permisos si es necesario

## 3. Verificación de Configuración

### Verificar .htaccess:
```bash
# Verificar que el .htaccess del backend excluya uploads
curl -I "https://hseq.meridianltda.com/backend/.htaccess"

# Verificar que el .htaccess de uploads permita acceso directo
curl -I "https://hseq.meridianltda.com/backend/uploads/.htaccess"
```

### Verificar configuración del servidor:
```bash
# Verificar información del servidor
curl "https://hseq.meridianltda.com/backend/debug-uploads.php"

# Verificar que Apache/Nginx esté configurado correctamente
curl -I "https://hseq.meridianltda.com/backend/uploads/"
```

## 4. Testing de URLs

### Test de imagen directa:
```bash
# Test imagen pública (Opción A)
curl -I "https://hseq.meridianltda.com/backend/uploads/evidencia_50_1755870460_68a874fc3b4c4.jpg"

# Debería devolver:
# HTTP/1.1 200 OK
# Content-Type: image/jpeg
# Cache-Control: public, max-age=604800, immutable
```

### Test de imagen firmada (Opción B):
```bash
# Primero obtener URL firmada
curl -X POST "https://hseq.meridianltda.com/backend/api/signed-url" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{"fileName":"evidencia_50_1755870460_68a874fc3b4c4.jpg","ttl":600}'

# Luego testear la URL firmada
curl -I "URL_FIRMADA_GENERADA"
```

## 5. Checklist de Verificación

### ✅ Verificaciones que deben pasar:

1. **Directorio existe y es legible:**
   ```bash
   curl "https://hseq.meridianltda.com/backend/debug-uploads.php?action=check_directory"
   # Debe mostrar "exists": true, "readable": true
   ```

2. **Archivo específico existe:**
   ```bash
   curl "https://hseq.meridianltda.com/backend/debug-uploads.php?action=check_file&file=evidencia_50_1755870460_68a874fc3b4c4.jpg"
   # Debe mostrar "exists": true, "readable": true
   ```

3. **Acceso directo a imagen:**
   ```bash
   curl -I "https://hseq.meridianltda.com/backend/uploads/evidencia_50_1755870460_68a874fc3b4c4.jpg"
   # Debe devolver 200 OK, no 302, 401, o 404
   ```

4. **Frontend carga imagen:**
   - Abrir DevTools en el navegador
   - Ir a la pestaña Network
   - Cargar una página con imágenes
   - Verificar que las imágenes se cargan como tipo "img" con status 200

5. **No hay redirects a login:**
   - Las URLs de imágenes no deben redirigir a `/login`
   - Las imágenes deben cargar directamente sin autenticación

## 6. Solución de Problemas Comunes

### Problema: 404 "Archivo no encontrado"
**Causas posibles:**
- Archivo no existe en el directorio
- Nombre de archivo incorrecto (case-sensitive)
- Ruta base incorrecta
- Permisos insuficientes

**Solución:**
```bash
# Verificar archivo
curl "https://hseq.meridianltda.com/backend/debug-uploads.php?action=check_file&file=NOMBRE_ARCHIVO"

# Corregir permisos si es necesario
chmod 644 /path/to/file.jpg
```

### Problema: 302 Redirect a /login
**Causa:** El .htaccess del backend está capturando las rutas de uploads
**Solución:** Verificar que el .htaccess tenga la regla de exclusión para uploads

### Problema: 403 Forbidden
**Causa:** Permisos insuficientes
**Solución:**
```bash
chmod 755 /path/to/uploads/directory
chmod 644 /path/to/uploads/file.jpg
```

### Problema: 500 Internal Server Error
**Causa:** Error en configuración PHP o .htaccess
**Solución:** Verificar logs de error del servidor y sintaxis de archivos
