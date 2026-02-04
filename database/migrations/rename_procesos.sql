-- Migración: Renombrar procesos según PDF (pág. 2)
-- Ejecutar si existen tablas procesos o perfiles con columna proceso/nombre.
-- Ajustar nombres de tablas/columnas según tu esquema real.

-- Si existe tabla procesos con columna nombre:
-- UPDATE procesos SET nombre = 'Administrativo' WHERE nombre ILIKE '%administr%';
-- UPDATE procesos SET nombre = 'Proyecto CW_Company Man' WHERE nombre ILIKE '%company%man%';
-- UPDATE procesos SET nombre = 'Proyecto Frontera' WHERE nombre ILIKE '%frontera%';
-- UPDATE procesos SET nombre = 'Proyecto Petroservicios' WHERE nombre ILIKE '%petroservicios%';

-- Si el proceso está en perfiles (texto suelto):
-- UPDATE perfiles SET proceso = 'Administrativo' WHERE proceso ILIKE '%administr%';
-- UPDATE perfiles SET proceso = 'Proyecto CW_Company Man' WHERE proceso ILIKE '%company%man%';
-- UPDATE perfiles SET proceso = 'Proyecto Frontera' WHERE proceso ILIKE '%frontera%';
-- UPDATE perfiles SET proceso = 'Proyecto Petroservicios' WHERE proceso ILIKE '%petroservicios%';

-- MySQL/MariaDB (quitar -- y ajustar nombre de tabla/columna):
-- UPDATE procesos SET nombre = 'Administrativo' WHERE LOWER(nombre) LIKE '%administr%';
-- UPDATE procesos SET nombre = 'Proyecto CW_Company Man' WHERE LOWER(nombre) LIKE '%company%man%';
-- UPDATE procesos SET nombre = 'Proyecto Frontera' WHERE LOWER(nombre) LIKE '%frontera%';
-- UPDATE procesos SET nombre = 'Proyecto Petroservicios' WHERE LOWER(nombre) LIKE '%petroservicios%';
