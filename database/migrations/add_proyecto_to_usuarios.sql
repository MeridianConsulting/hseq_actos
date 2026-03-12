-- Migración: Agregar columna Proyecto a la tabla usuarios
-- Ejecutar este script en el servidor de producción si aparece el error:
-- "Unknown column 'u.Proyecto' in 'SELECT'"

ALTER TABLE `usuarios`
  ADD COLUMN `Proyecto` varchar(100) DEFAULT NULL
  AFTER `rol`;
