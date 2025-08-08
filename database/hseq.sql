-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-08-2025 a las 16:05:32
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `hseq`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evidencias`
--

CREATE TABLE `evidencias` (
  `id` int(11) NOT NULL,
  `id_reporte` int(11) NOT NULL,
  `tipo_archivo` varchar(50) DEFAULT 'image',
  `url_archivo` varchar(255) NOT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `evidencias`
--

INSERT INTO `evidencias` (`id`, `id_reporte`, `tipo_archivo`, `url_archivo`, `creado_en`) VALUES
(1, 9, 'image/png', 'evidencia_9_1753110883_687e596326797.png', '2025-07-21 15:14:43'),
(2, 10, 'image/png', 'evidencia_10_1753110984_687e59c898146.png', '2025-07-21 15:16:24'),
(3, 11, 'image/png', 'evidencia_11_1753111009_687e59e14cc40.png', '2025-07-21 15:16:49'),
(4, 12, 'image/png', 'evidencia_12_1753111346_687e5b3217f50.png', '2025-07-21 15:22:26'),
(25, 6, 'image/png', 'evidencia_6_1753112000_687e5c1234567.png', '2025-01-08 19:25:00'),
(26, 7, 'image/jpeg', 'evidencia_7_1753112100_687e5c2345678.jpeg', '2025-01-20 21:50:00'),
(27, 8, 'image/png', 'evidencia_8_1753112200_687e5c3456789.png', '2025-02-05 15:35:00'),
(28, 9, 'image/jpeg', 'evidencia_9_1753112300_687e5c4567890.jpeg', '2025-02-15 20:25:00'),
(29, 10, 'image/png', 'evidencia_10_1753112400_687e5c5678901.png', '2025-03-01 17:20:00'),
(30, 11, 'image/jpeg', 'evidencia_11_1753112500_687e5c6789012.jpeg', '2025-03-10 16:50:00'),
(31, 12, 'image/png', 'evidencia_12_1753112600_687e5c7890123.png', '2025-03-20 19:05:00'),
(32, 6, 'image/jpeg', 'evidencia_6b_1753112700_687e5c8901234.jpeg', '2025-01-12 20:35:00'),
(33, 7, 'image/png', 'evidencia_7b_1753112800_687e5c9012345.png', '2025-01-28 15:05:00'),
(34, 8, 'image/jpeg', 'evidencia_8b_1753112900_687e5c0123456.jpeg', '2025-02-14 21:50:00'),
(35, 9, 'image/png', 'evidencia_9b_1753113000_687e5c1234567.png', '2025-03-08 18:25:00'),
(36, 10, 'image/jpeg', 'evidencia_10b_1753113100_687e5c2345678.jpeg', '2025-03-18 19:20:00'),
(37, 11, 'image/png', 'evidencia_11b_1753113200_687e5c3456789.png', '2025-01-15 21:50:00'),
(38, 12, 'image/jpeg', 'evidencia_12b_1753113300_687e5c4567890.jpeg', '2025-01-22 17:05:00'),
(39, 6, 'image/png', 'evidencia_6c_1753113400_687e5c5678901.png', '2025-02-03 14:35:00'),
(40, 7, 'image/jpeg', 'evidencia_7c_1753113500_687e5c6789012.jpeg', '2025-02-10 22:05:00'),
(41, 8, 'image/png', 'evidencia_8c_1753113600_687e5c7890123.png', '2025-02-18 19:35:00'),
(42, 9, 'image/jpeg', 'evidencia_9c_1753113700_687e5c8901234.jpeg', '2025-03-05 16:05:00'),
(43, 10, 'image/png', 'evidencia_10c_1753113800_687e5c9012345.png', '2025-03-12 20:50:00'),
(44, 11, 'image/jpeg', 'evidencia_11c_1753113900_687e5c0123456.jpeg', '2025-03-25 13:05:00'),
(45, 33, 'image/png', 'evidencia_33_1753802990_6888e8eea976a.png', '2025-07-29 15:29:50'),
(46, 34, 'image/png', 'evidencia_34_1753819269_6889288593e01.png', '2025-07-29 20:01:09');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id` int(11) NOT NULL,
  `id_reporte` int(11) NOT NULL,
  `destinatario` varchar(100) NOT NULL,
  `medio` varchar(50) DEFAULT 'correo',
  `enviado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reportes`
--

CREATE TABLE `reportes` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `tipo_reporte` enum('hallazgos','incidentes','conversaciones') NOT NULL,
  `asunto` varchar(255) DEFAULT NULL,
  `descripcion_general` text DEFAULT NULL,
  `fecha_evento` date DEFAULT NULL,
  `lugar_hallazgo` varchar(100) DEFAULT NULL,
  `lugar_hallazgo_otro` varchar(255) DEFAULT NULL,
  `tipo_hallazgo` varchar(50) DEFAULT NULL,
  `descripcion_hallazgo` text DEFAULT NULL,
  `recomendaciones` text DEFAULT NULL,
  `estado_condicion` enum('abierta','cerrada') DEFAULT NULL,
  `grado_criticidad` enum('bajo','medio','alto','critico') DEFAULT NULL,
  `ubicacion_incidente` varchar(255) DEFAULT NULL,
  `hora_evento` time DEFAULT NULL,
  `tipo_afectacion` varchar(50) DEFAULT NULL,
  `descripcion_incidente` text DEFAULT NULL,
  `tipo_conversacion` enum('reflexion','conversacion') DEFAULT NULL,
  `sitio_evento_conversacion` varchar(255) DEFAULT NULL,
  `lugar_hallazgo_conversacion` varchar(100) DEFAULT NULL,
  `lugar_hallazgo_conversacion_otro` varchar(255) DEFAULT NULL,
  `descripcion_conversacion` text DEFAULT NULL,
  `asunto_conversacion` varchar(255) DEFAULT NULL,
  `estado` enum('pendiente','en_revision','aprobado','rechazado') DEFAULT 'pendiente',
  `revisado_por` int(11) DEFAULT NULL,
  `comentarios_revision` text DEFAULT NULL,
  `fecha_revision` datetime DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `reportes`
--

INSERT INTO `reportes` (`id`, `id_usuario`, `tipo_reporte`, `asunto`, `descripcion_general`, `fecha_evento`, `lugar_hallazgo`, `lugar_hallazgo_otro`, `tipo_hallazgo`, `descripcion_hallazgo`, `recomendaciones`, `estado_condicion`, `grado_criticidad`, `ubicacion_incidente`, `hora_evento`, `tipo_afectacion`, `descripcion_incidente`, `tipo_conversacion`, `sitio_evento_conversacion`, `lugar_hallazgo_conversacion`, `lugar_hallazgo_conversacion_otro`, `descripcion_conversacion`, `asunto_conversacion`, `estado`, `revisado_por`, `comentarios_revision`, `fecha_revision`, `creado_en`, `actualizado_en`) VALUES
(6, 2, 'incidentes', 'test', NULL, '0222-02-12', NULL, NULL, NULL, NULL, NULL, NULL, 'alto', 'test', '00:00:00', 'vehiculos', 'tes', NULL, NULL, NULL, NULL, NULL, NULL, 'pendiente', NULL, NULL, NULL, '2025-07-21 14:45:02', '2025-07-21 14:45:02'),
(7, 2, 'incidentes', 'test', NULL, '2025-07-22', NULL, NULL, NULL, NULL, NULL, NULL, 'critico', 'test', '01:05:00', 'seguridad_procesos', 'test', NULL, NULL, NULL, NULL, NULL, NULL, 'pendiente', NULL, NULL, NULL, '2025-07-21 15:06:01', '2025-07-21 15:06:01'),
(8, 2, 'incidentes', 'test', NULL, '2025-07-22', NULL, NULL, NULL, NULL, NULL, NULL, 'critico', 'test', '01:05:00', 'seguridad_procesos', 'test', NULL, NULL, NULL, NULL, NULL, NULL, 'pendiente', NULL, NULL, NULL, '2025-07-21 15:14:08', '2025-07-21 15:14:08'),
(9, 2, 'incidentes', 'test con evidencia', NULL, '2025-07-22', NULL, NULL, NULL, NULL, NULL, NULL, 'critico', 'test', '01:05:00', 'seguridad_procesos', 'test', NULL, NULL, NULL, NULL, NULL, NULL, 'pendiente', NULL, NULL, NULL, '2025-07-21 15:14:43', '2025-07-21 15:14:43'),
(10, 2, 'incidentes', 'test', NULL, '2025-07-22', NULL, NULL, NULL, NULL, NULL, NULL, 'alto', 'test', '02:16:00', 'instalaciones', 'test', NULL, NULL, NULL, NULL, NULL, NULL, 'pendiente', NULL, NULL, NULL, '2025-07-21 15:16:24', '2025-07-21 15:16:24'),
(11, 2, 'incidentes', 'test', NULL, '2025-07-17', NULL, NULL, NULL, NULL, NULL, NULL, 'alto', 'test', '02:16:00', 'vehiculos', 'test', NULL, NULL, NULL, NULL, NULL, NULL, 'en_revision', 3, 'Estado cambiado a en_revision por Carlos Rodríguez', '2025-07-21 11:06:55', '2025-07-21 15:16:49', '2025-07-21 16:06:55'),
(12, 2, 'incidentes', 'test', NULL, '2025-07-16', NULL, NULL, NULL, NULL, NULL, NULL, 'critico', 'tes', '01:21:00', 'instalaciones', 'test', NULL, NULL, NULL, NULL, NULL, NULL, 'en_revision', 3, 'Estado cambiado a en_revision por Carlos Rodríguez', '2025-07-21 11:02:39', '2025-07-21 15:22:26', '2025-07-21 16:02:39'),
(13, 5, 'incidentes', 'Caída de herramienta desde altura', 'Un trabajador dejó caer una llave inglesa desde una altura de 3 metros', '2025-01-15', NULL, NULL, NULL, NULL, NULL, NULL, 'medio', 'Plataforma de trabajo - Piso 2', '14:30:00', 'personal', 'Herramienta cayó cerca de zona de paso, sin lesionados', NULL, NULL, NULL, NULL, NULL, NULL, 'aprobado', 1, 'Incidente reportado correctamente. Se implementarán medidas preventivas.', '2025-01-16 09:00:00', '2025-01-15 21:45:00', '2025-07-21 21:15:34'),
(14, 6, 'incidentes', 'Derrame de aceite en área de mantenimiento', 'Pequeño derrame de aceite hidráulico en el taller', '2025-01-22', NULL, NULL, NULL, NULL, NULL, NULL, 'bajo', 'Taller de mantenimiento', '11:15:00', 'instalaciones', 'Derrame de aproximadamente 2 litros, limpiado inmediatamente', NULL, NULL, NULL, NULL, NULL, NULL, 'aprobado', 1, 'Situación controlada. Reforzar procedimientos de manejo de aceites.', '2025-01-23 08:30:00', '2025-01-22 17:00:00', '2025-07-21 21:15:34'),
(15, 7, 'incidentes', 'Casi accidente con vehículo de carga', 'Operador de montacargas casi atropella a un trabajador', '2025-02-03', NULL, NULL, NULL, NULL, NULL, NULL, 'alto', 'Almacén principal', '08:45:00', 'vehiculos', 'El trabajador cruzó sin mirar, el operador frenó a tiempo', NULL, NULL, NULL, NULL, NULL, NULL, 'en_revision', 1, 'Revisar señalización y procedimientos de circulación.', '2025-02-04 10:15:00', '2025-02-03 14:30:00', '2025-07-21 21:15:34'),
(16, 8, 'incidentes', 'Corto circuito en panel eléctrico', 'Falla eléctrica en panel de control', '2025-02-10', NULL, NULL, NULL, NULL, NULL, NULL, 'critico', 'Sala de control', '16:20:00', 'instalaciones', 'Corto circuito causó apagón parcial, sin daños mayores', NULL, NULL, NULL, NULL, NULL, NULL, 'aprobado', 1, 'Mantenimiento preventivo programado para el panel.', '2025-02-11 07:45:00', '2025-02-10 22:00:00', '2025-07-21 21:15:34'),
(17, 9, 'incidentes', 'Lesión menor en mano', 'Corte superficial con herramienta', '2025-02-18', NULL, NULL, NULL, NULL, NULL, NULL, 'medio', 'Área de corte', '13:45:00', 'personal', 'Corte de 2cm en dedo índice, requirió primeros auxilios', NULL, NULL, NULL, NULL, NULL, NULL, 'aprobado', 1, 'Revisar uso de guantes de protección.', '2025-02-19 08:00:00', '2025-02-18 19:30:00', '2025-07-21 21:15:34'),
(18, 10, 'incidentes', 'Fuga de gas en tubería', 'Detección de olor a gas en área de proceso', '2025-03-05', NULL, NULL, NULL, NULL, NULL, NULL, 'critico', 'Área de proceso químico', '10:30:00', 'seguridad_procesos', 'Fuga detectada por sistema de alarmas, evacuación preventiva', NULL, NULL, NULL, NULL, NULL, NULL, 'aprobado', 1, 'Fuga reparada. Reforzar inspecciones de tuberías.', '2025-03-06 09:15:00', '2025-03-05 16:00:00', '2025-07-21 21:15:34'),
(19, 11, 'incidentes', 'Resbalón en piso mojado', 'Trabajador resbaló en área de limpieza', '2025-03-12', NULL, NULL, NULL, NULL, NULL, NULL, 'bajo', 'Pasillo de servicios', '15:20:00', 'personal', 'Resbalón sin lesiones, área señalizada inmediatamente', NULL, NULL, NULL, NULL, NULL, NULL, 'en_revision', 3, 'Estado cambiado a en_revision por Carlos Rodríguez', '2025-07-29 14:43:48', '2025-03-12 20:45:00', '2025-07-29 19:43:48'),
(20, 12, 'incidentes', 'Falla en sistema de ventilación', 'Ventilador principal dejó de funcionar', '2025-03-25', NULL, NULL, NULL, NULL, NULL, NULL, 'medio', 'Sala de máquinas', '07:15:00', 'instalaciones', 'Falla detectada en mantenimiento rutinario', NULL, NULL, NULL, NULL, NULL, NULL, 'en_revision', 1, 'Mantenimiento correctivo en proceso.', '2025-03-26 08:30:00', '2025-03-25 13:00:00', '2025-07-21 21:15:34'),
(21, 13, 'hallazgos', 'Extintor sin mantenimiento', 'Extintor vencido en área de almacén', '2025-01-08', 'almacen', NULL, 'equipos_emergencia', 'Extintor tipo ABC vencido hace 2 meses', 'Renovar extintor y programar mantenimiento preventivo', 'abierta', 'medio', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aprobado', 1, 'Extintor reemplazado. Implementar control de fechas.', '2025-01-09 10:00:00', '2025-01-08 19:20:00', '2025-07-21 21:15:34'),
(22, 14, 'hallazgos', 'Cables eléctricos expuestos', 'Cables sin protección en área de trabajo', '2025-01-20', 'area_produccion', NULL, 'instalaciones_electricas', 'Cables de alimentación sin canalización', 'Instalar canaletas o tuberías para proteger cables', 'abierta', 'alto', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aprobado', 1, 'Canalización instalada. Verificar otras áreas.', '2025-01-21 09:30:00', '2025-01-20 21:45:00', '2025-07-21 21:15:34'),
(23, 15, 'hallazgos', 'Falta de señalización', 'Ausencia de señales de seguridad', '2025-02-05', 'pasillos', NULL, 'señalizacion', 'Falta señalización de salida de emergencia', 'Instalar señales de salida y rutas de evacuación', 'cerrada', 'medio', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aprobado', 1, 'Señalización instalada correctamente.', '2025-02-06 11:15:00', '2025-02-05 15:30:00', '2025-07-21 21:15:34'),
(24, 16, 'hallazgos', 'Equipo sin protección', 'Máquina sin guardas de seguridad', '2025-02-15', 'taller', NULL, 'equipos_maquinaria', 'Torno sin protección en zona de corte', 'Instalar guardas de seguridad en máquina', 'abierta', 'alto', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'en_revision', 1, 'Guardas en proceso de instalación.', '2025-02-16 08:45:00', '2025-02-15 20:20:00', '2025-07-21 21:15:34'),
(25, 17, 'hallazgos', 'Orden y limpieza deficiente', 'Área de trabajo desordenada', '2025-03-01', 'area_produccion', NULL, 'orden_limpieza', 'Herramientas y materiales dispersos en área', 'Implementar programa 5S en el área', 'abierta', 'bajo', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'pendiente', NULL, NULL, NULL, '2025-03-01 17:15:00', '2025-07-21 21:15:34'),
(26, 18, 'hallazgos', 'EPP incompleto', 'Trabajador sin elementos de protección', '2025-03-10', 'area_produccion', NULL, 'epp', 'Operador sin gafas de seguridad', 'Verificar dotación completa de EPP', 'cerrada', 'medio', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aprobado', 1, 'EPP entregado. Capacitación realizada.', '2025-03-11 09:00:00', '2025-03-10 16:45:00', '2025-07-21 21:15:34'),
(27, 19, 'hallazgos', 'Falta de iluminación', 'Área con iluminación insuficiente', '2025-03-20', 'almacen', NULL, 'iluminacion', 'Lámparas fundidas en zona de estanterías', 'Reemplazar lámparas y mejorar iluminación', 'abierta', 'bajo', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'en_revision', 1, 'Lámparas en proceso de reemplazo.', '2025-03-21 10:30:00', '2025-03-20 19:00:00', '2025-07-21 21:15:34'),
(28, 20, 'conversaciones', 'Reflexión sobre uso de EPP', NULL, '2025-01-12', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'reflexion', 'Área de producción', NULL, NULL, 'Conversación sobre importancia del uso correcto de EPP', 'Reflexión sobre seguridad personal', 'aprobado', 1, 'Conversación productiva. Compromisos adquiridos.', '2025-01-13 08:00:00', '2025-01-12 20:30:00', '2025-07-21 21:15:34'),
(29, 21, 'conversaciones', 'Capacitación en procedimientos', NULL, '2025-01-28', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'conversacion', 'Sala de capacitación', NULL, NULL, 'Revisión de procedimientos de trabajo seguro', 'Capacitación en procedimientos', 'aprobado', 1, 'Capacitación exitosa. Evaluación positiva.', '2025-01-29 09:15:00', '2025-01-28 15:00:00', '2025-07-21 21:15:34'),
(30, 22, 'conversaciones', 'Reflexión sobre incidente reciente', NULL, '2025-02-14', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'reflexion', 'Área de descanso', NULL, NULL, 'Análisis del incidente de la semana pasada', 'Reflexión sobre incidente', 'aprobado', 1, 'Análisis constructivo. Lecciones aprendidas.', '2025-02-15 07:30:00', '2025-02-14 21:45:00', '2025-07-21 21:15:34'),
(31, 23, 'conversaciones', 'Conversación sobre mejoras', NULL, '2025-03-08', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'conversacion', 'Oficina de coordinación', NULL, NULL, 'Discusión sobre mejoras en seguridad', 'Conversación sobre mejoras', 'pendiente', NULL, NULL, NULL, '2025-03-08 18:20:00', '2025-07-21 21:15:34'),
(32, 24, 'conversaciones', 'Reflexión sobre cultura de seguridad', NULL, '2025-03-18', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'reflexion', 'Sala de reuniones', NULL, NULL, 'Conversación sobre cultura de seguridad en la empresa', 'Reflexión sobre cultura de seguridad', 'en_revision', 1, 'Conversación enriquecedora. Seguimiento programado.', '2025-03-19 11:00:00', '2025-03-18 19:15:00', '2025-07-21 21:15:34'),
(33, 2, 'incidentes', 'Caida de objetos en pozo 3', NULL, '2025-07-29', NULL, NULL, NULL, NULL, NULL, NULL, 'alto', 'Villa Vicencio', '02:28:00', 'personas', 'Una herramienta de cayo desde una mesa de trabajo a la boca del pozo en la cual podia ocasionar daño a las personas que se encontraban trbajando', NULL, NULL, NULL, NULL, NULL, NULL, 'en_revision', 3, 'Estado cambiado a en_revision por Carlos Rodríguez', '2025-07-29 14:22:38', '2025-07-29 15:29:50', '2025-07-29 19:22:38'),
(34, 2, 'incidentes', 'test', NULL, '0312-12-23', NULL, NULL, NULL, NULL, NULL, NULL, 'critico', 'test', '18:00:00', 'vehiculos', 'test', NULL, NULL, NULL, NULL, NULL, NULL, 'pendiente', NULL, NULL, NULL, '2025-07-29 20:01:09', '2025-07-29 20:01:09');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `cedula` varchar(20) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `rol` enum('colaborador','soporte','admin') NOT NULL,
  `Proyecto` varchar(100) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `cedula`, `correo`, `contrasena`, `rol`, `Proyecto`, `activo`, `creado_en`) VALUES
(1, 'Mateo Lopez', '1011202252', 'dev@meridian.com.co', '1011202252', 'admin', NULL, 1, '2025-07-03 18:47:32'),
(2, 'Ana María García', '1234567890', 'ana.garcia@meridian.com.co', '1234567890', 'colaborador', NULL, 1, '2025-07-04 16:33:05'),
(3, 'Carlos Rodríguez', '9876543210', 'carlos.rodriguez@meridian.com.co', '9876543210', 'soporte', NULL, 1, '2025-07-04 16:33:05'),
  (4, 'María Elena Díaz', '5555666777', 'maria.diaz@meridian.com.co', '5555666777', 'admin', NULL, 1, '2025-07-04 16:33:06'),
(5, 'Juan Carlos Pérez', '1122334455', 'juan.perez@meridian.com.co', '1122334455', 'colaborador', NULL, 1, '2024-12-15 13:30:00'),
(6, 'Laura Patricia Silva', '2233445566', 'laura.silva@meridian.com.co', '2233445566', 'colaborador', NULL, 1, '2024-12-20 14:15:00'),
(7, 'Roberto Andrés Mendoza', '3344556677', 'roberto.mendoza@meridian.com.co', '3344556677', 'soporte', NULL, 1, '2025-01-05 15:45:00'),
  (8, 'Carmen Elena Vargas', '4455667788', 'carmen.vargas@meridian.com.co', '4455667788', 'admin', NULL, 1, '2025-01-10 16:20:00'),
(9, 'Fernando José Herrera', '5566778899', 'fernando.herrera@meridian.com.co', '5566778899', 'colaborador', NULL, 1, '2025-01-15 19:30:00'),
(10, 'Patricia Isabel Morales', '6677889900', 'patricia.morales@meridian.com.co', '6677889900', 'colaborador', NULL, 1, '2025-01-20 20:45:00'),
(11, 'Ricardo Alberto Torres', '7788990011', 'ricardo.torres@meridian.com.co', '7788990011', 'soporte', NULL, 1, '2025-02-01 21:20:00'),
(12, 'Sandra Milena Ruiz', '8899001122', 'sandra.ruiz@meridian.com.co', '8899001122', 'colaborador', NULL, 1, '2025-02-05 13:10:00'),
(13, 'Diego Alejandro Jiménez', '9900112233', 'diego.jimenez@meridian.com.co', '9900112233', 'colaborador', NULL, 1, '2025-02-10 14:30:00'),
  (14, 'Mónica Andrea Castro', '0011223344', 'monica.castro@meridian.com.co', '0011223344', 'admin', NULL, 1, '2025-02-15 15:15:00'),
(15, 'Héctor Manuel Rojas', '1122334456', 'hector.rojas@meridian.com.co', '1122334456', 'colaborador', NULL, 1, '2025-02-20 16:40:00'),
(16, 'Adriana Marcela Luna', '2233445567', 'adriana.luna@meridian.com.co', '2233445567', 'soporte', NULL, 1, '2025-03-01 17:25:00'),
(17, 'Oscar David Pineda', '3344556678', 'oscar.pineda@meridian.com.co', '3344556678', 'colaborador', NULL, 1, '2025-03-05 18:50:00'),
(18, 'Claudia Marcela Restrepo', '4455667789', 'claudia.restrepo@meridian.com.co', '4455667789', 'colaborador', NULL, 1, '2025-03-10 19:35:00'),
(19, 'Jorge Luis Mejía', '5566778890', 'jorge.mejia@meridian.com.co', '5566778890', 'colaborador', NULL, 1, '2025-03-15 20:20:00'),
(20, 'Natalia Andrea Giraldo', '6677889901', 'natalia.giraldo@meridian.com.co', '6677889901', 'soporte', NULL, 1, '2025-03-20 21:05:00'),
(21, 'Andrés Felipe Valencia', '7788990012', 'andres.valencia@meridian.com.co', '7788990012', 'colaborador', NULL, 1, '2025-04-01 13:45:00'),
  (22, 'Diana Carolina Osorio', '8899001123', 'diana.osorio@meridian.com.co', '8899001123', 'admin', NULL, 1, '2025-04-05 14:30:00'),
(23, 'Camilo Andrés Ramírez', '9900112234', 'camilo.ramirez@meridian.com.co', '9900112234', 'colaborador', NULL, 1, '2025-04-10 15:15:00'),
(24, 'Valentina Sofía Cardona', '0011223345', 'valentina.cardona@meridian.com.co', '0011223345', 'colaborador', NULL, 1, '2025-04-15 16:00:00');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `evidencias`
--
ALTER TABLE `evidencias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_reporte` (`id_reporte`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_reporte` (`id_reporte`);

--
-- Indices de la tabla `reportes`
--
ALTER TABLE `reportes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `tipo_reporte` (`tipo_reporte`),
  ADD KEY `estado` (`estado`),
  ADD KEY `revisado_por` (`revisado_por`),
  ADD KEY `idx_fecha_evento` (`fecha_evento`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo` (`correo`),
  ADD UNIQUE KEY `cedula` (`cedula`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `evidencias`
--
ALTER TABLE `evidencias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reportes`
--
ALTER TABLE `reportes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `evidencias`
--
ALTER TABLE `evidencias`
  ADD CONSTRAINT `evidencias_ibfk_1` FOREIGN KEY (`id_reporte`) REFERENCES `reportes` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`id_reporte`) REFERENCES `reportes` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `reportes`
--
ALTER TABLE `reportes`
  ADD CONSTRAINT `reportes_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reportes_ibfk_2` FOREIGN KEY (`revisado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
