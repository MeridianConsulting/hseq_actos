-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 21-07-2025 a las 17:58:23
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
(4, 12, 'image/png', 'evidencia_12_1753111346_687e5b3217f50.png', '2025-07-21 15:22:26');

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
(11, 2, 'incidentes', 'test', NULL, '2025-07-17', NULL, NULL, NULL, NULL, NULL, NULL, 'alto', 'test', '02:16:00', 'vehiculos', 'test', NULL, NULL, NULL, NULL, NULL, NULL, 'pendiente', NULL, NULL, NULL, '2025-07-21 15:16:49', '2025-07-21 15:16:49'),
(12, 2, 'incidentes', 'test', NULL, '2025-07-16', NULL, NULL, NULL, NULL, NULL, NULL, 'critico', 'tes', '01:21:00', 'instalaciones', 'test', NULL, NULL, NULL, NULL, NULL, NULL, 'pendiente', NULL, NULL, NULL, '2025-07-21 15:22:26', '2025-07-21 15:22:26');

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
  `rol` enum('colaborador','soporte','coordinador','admin') NOT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `cedula`, `correo`, `contrasena`, `rol`, `activo`, `creado_en`) VALUES
(1, 'Mateo Lopez', '1011202252', 'desarrolloit@meridian.com.co', '1011202252', 'admin', 1, '2025-07-03 18:47:32'),
(2, 'Ana María García', '1234567890', 'ana.garcia@meridian.com.co', '1234567890', 'colaborador', 1, '2025-07-04 16:33:05'),
(3, 'Carlos Rodríguez', '9876543210', 'carlos.rodriguez@meridian.com.co', '9876543210', 'soporte', 1, '2025-07-04 16:33:05'),
(4, 'María Elena Díaz', '5555666777', 'maria.diaz@meridian.com.co', '5555666777', 'coordinador', 1, '2025-07-04 16:33:06');

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
  ADD UNIQUE KEY `correo` (`correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `evidencias`
--
ALTER TABLE `evidencias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reportes`
--
ALTER TABLE `reportes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
