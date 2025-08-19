-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-08-2025 a las 16:48:12
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
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `cdn_url` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(26, 'Brayan Alejandro Monroy Pinzon', '1032461712', 'brayan.monroy@ecopetrol.com.co', '1032461712', 'colaborador', '3047761-4', 1, '2025-08-19 14:37:03'),
(27, 'Camilo Andres Ibañez Rozo', '1115914517', 'ingcamilo.ibanez@gmail.com', '1115914517', 'colaborador', '3047761-4', 1, '2025-08-19 14:37:03'),
(28, 'Carlos Saul Celis Acero', '7161987', 'carlos.celis@ecopetrol.com.co', '7161987', 'colaborador', '3047761-4', 1, '2025-08-19 14:37:03'),
(29, 'Cesar Augusto Reyes Ballesteros', '13700520', 'cesar.reyes@meridianecp.com', '13700520', 'colaborador', '3047761-4', 1, '2025-08-19 14:37:03'),
(30, 'Claudia Marina Ortiz Avendaño', '24228529', 'claudia.ortiz@meridianecp.com', '24228529', 'colaborador', '3047761-4', 1, '2025-08-19 14:37:03'),
(31, 'Daniel Segura Espinosa', '74362501', 'daniel.segura@meridianecp.com', '74362501', 'colaborador', '3047761-4', 1, '2025-08-19 14:37:03'),
(32, 'Esteban Garcia Rojas', '1077173073', 'esteban.garcia@meridianecp.com', '1077173073', 'colaborador', '3047761-4', 1, '2025-08-19 14:37:03'),
(33, 'Fernando Jose Aparicio Becerra', '91285174', 'fernando.aparicio@meridianecp.com', '91285174', 'colaborador', '3047761-4', 1, '2025-08-19 14:37:03'),
(34, 'Julio Cesar Romero Arevalo', '88281896', 'julio.romero@ecopetrol.com.co', '88281896', 'colaborador', '3047761-4', 1, '2025-08-19 14:37:03'),
(35, 'Myriam Karina Paredes Forero', '33647141', 'myriam.paredes@meridianecp.com', '33647141', 'colaborador', '3047761-4', 1, '2025-08-19 14:37:03'),
(36, 'Pedro Rafael Cadena Ordoñez', '13871188', 'pedro.cadena@meridianecp.com', '13871188', 'colaborador', '3047761-4', 1, '2025-08-19 14:37:03'),
(37, 'Viani Yorely Ruiz Galindo', '1115914145', 'viani.ruiz@meridianecp.com', '1115914145', 'colaborador', '3047761-4', 1, '2025-08-19 14:37:03'),
(38, 'Wilber Castaneda Castaneda', '80150738', 'Wilbercastaeda@gmail.com', '80150738', 'colaborador', '3047761-4', 1, '2025-08-19 14:37:03'),
(39, 'Jose Mauricio Aponte Abril', '11189101', 'jose.aponte@meridianecp.com', '11189101', 'colaborador', '3047761-4', 1, '2025-08-19 14:37:03'),
(40, 'Angela Maria Hernandez Tapias', '42116896', 'angelama.hernandez@ecopetrol.com.co', '42116896', 'colaborador', '3047761-4', 1, '2025-08-19 14:37:03'),
(41, 'José Mateo López Cifuentes', '1011202252', 'desarrolloit@meridian.com.co', '1011202252', 'admin', 'administracion', 1, '2025-08-19 14:38:10');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `evidencias`
--
ALTER TABLE `evidencias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_reporte` (`id_reporte`),
  ADD KEY `idx_id_reporte` (`id_reporte`),
  ADD KEY `idx_creado_en` (`creado_en`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `reportes`
--
ALTER TABLE `reportes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

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
