-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 23-10-2025 a las 12:16:26
-- Versión del servidor: 10.6.23-MariaDB-cll-lve
-- Versión de PHP: 8.3.25

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

--
-- Volcado de datos para la tabla `evidencias`
--

INSERT INTO `evidencias` (`id`, `id_reporte`, `tipo_archivo`, `url_archivo`, `creado_en`, `cdn_url`) VALUES
(59, 65, 'image/jpeg', 'evidencia_65_1756847235_68b75c83f3092.jpg', '2025-09-02 21:07:15', NULL),
(61, 76, 'image/jpeg', 'evidencia_76_1757434062_68c050ce7f6bb.jpg', '2025-09-09 16:07:42', NULL),
(62, 77, 'image/jpeg', 'evidencia_77_1757694997_68c44c15ae729.jpg', '2025-09-12 16:36:37', NULL),
(64, 94, 'image/jpeg', 'evidencia_94_1760107916_68e91d8c39daf.jpg', '2025-10-10 14:51:56', NULL),
(65, 95, 'image/jpeg', 'evidencia_95_1760108394_68e91f6ad7cfb.jpg', '2025-10-10 14:59:54', NULL),
(67, 97, 'image/jpeg', 'evidencia_97_1760969726_68f643fe0cafe.jpg', '2025-10-20 14:15:26', NULL),
(68, 98, 'image/jpeg', 'evidencia_98_1761146468_68f8f66437938.jpg', '2025-10-22 15:21:08', NULL);

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

--
-- Volcado de datos para la tabla `notificaciones`
--

INSERT INTO `notificaciones` (`id`, `id_reporte`, `destinatario`, `medio`, `enviado_en`) VALUES
(25, 52, 'desarrolloit@meridian.com.co', 'correo', '2025-08-22 16:34:39'),
(26, 52, 'desarrolloit@meridian.com.co', 'correo', '2025-08-22 16:36:10'),
(27, 52, 'desarrolloit@meridian.com.co', 'correo', '2025-08-22 16:37:33'),
(28, 53, 'desarrolloit@meridian.com.co', 'correo', '2025-09-02 15:59:00'),
(29, 54, 'desarrolloit@meridian.com.co', 'correo', '2025-09-02 17:21:34'),
(30, 55, 'desarrolloit@meridian.com.co', 'correo', '2025-09-02 17:24:57'),
(31, 56, 'desarrolloit@meridian.com.co', 'correo', '2025-09-02 17:35:16'),
(32, 57, 'desarrolloit@meridian.com.co', 'correo', '2025-09-02 17:36:59'),
(33, 58, 'desarrolloit@meridian.com.co', 'correo', '2025-09-02 17:42:50'),
(34, 59, 'desarrolloit@meridian.com.co', 'correo', '2025-09-02 18:05:33'),
(35, 60, 'desarrolloit@meridian.com.co', 'correo', '2025-09-02 18:52:51'),
(36, 61, 'desarrolloit@meridian.com.co', 'correo', '2025-09-02 19:32:52'),
(37, 62, 'desarrolloit@meridian.com.co', 'correo', '2025-09-02 20:15:23'),
(40, 65, 'desarrolloit@meridian.com.co', 'correo', '2025-09-02 21:07:15'),
(45, 67, 'desarrolloit@meridian.com.co', 'correo', '2025-09-02 21:39:25'),
(46, 68, 'desarrolloit@meridian.com.co', 'correo', '2025-09-02 21:56:33'),
(47, 69, 'desarrolloit@meridian.com.co', 'correo', '2025-09-03 03:32:21'),
(48, 70, 'desarrolloit@meridian.com.co', 'correo', '2025-09-03 15:32:31'),
(49, 71, 'desarrolloit@meridian.com.co', 'correo', '2025-09-03 23:06:46'),
(50, 72, 'desarrolloit@meridian.com.co', 'correo', '2025-09-03 23:13:14'),
(51, 73, 'desarrolloit@meridian.com.co', 'correo', '2025-09-04 13:55:47'),
(52, 74, 'desarrolloit@meridian.com.co', 'correo', '2025-09-04 14:24:38'),
(53, 73, 'desarrolloit@meridian.com.co', 'correo', '2025-09-05 20:58:31'),
(54, 73, 'desarrolloit@meridian.com.co', 'correo', '2025-09-05 21:04:11'),
(55, 70, 'desarrolloit@meridian.com.co', 'correo', '2025-09-05 21:10:33'),
(56, 71, 'desarrolloit@meridian.com.co', 'correo', '2025-09-05 21:10:47'),
(57, 65, 'desarrolloit@meridian.com.co', 'correo', '2025-09-05 21:10:50'),
(58, 75, 'desarrolloit@meridian.com.co', 'correo', '2025-09-05 21:14:26'),
(59, 75, 'desarrolloit@meridian.com.co', 'correo', '2025-09-05 21:14:37'),
(60, 75, 'desarrolloit@meridian.com.co', 'correo', '2025-09-05 21:16:35'),
(61, 70, 'desarrolloit@meridian.com.co', 'correo', '2025-09-05 21:20:12'),
(62, 74, 'desarrolloit@meridian.com.co', 'correo', '2025-09-05 21:35:31'),
(63, 72, 'desarrolloit@meridian.com.co', 'correo', '2025-09-05 21:35:35'),
(64, 53, 'desarrolloit@meridian.com.co', 'correo', '2025-09-05 21:35:42'),
(65, 53, 'desarrolloit@meridian.com.co', 'correo', '2025-09-09 15:23:09'),
(66, 76, 'desarrolloit@meridian.com.co', 'correo', '2025-09-09 16:07:42'),
(67, 76, 'desarrolloit@meridian.com.co', 'correo', '2025-09-09 20:40:17'),
(68, 76, 'desarrolloit@meridian.com.co', 'correo', '2025-09-10 14:42:15'),
(69, 77, 'desarrolloit@meridian.com.co', 'correo', '2025-09-12 16:36:37'),
(70, 78, 'desarrolloit@meridian.com.co', 'correo', '2025-09-12 21:21:34'),
(71, 79, 'desarrolloit@meridian.com.co', 'correo', '2025-09-15 13:35:18'),
(72, 79, 'desarrolloit@meridian.com.co', 'correo', '2025-09-15 21:57:33'),
(73, 78, 'desarrolloit@meridian.com.co', 'correo', '2025-09-15 21:57:36'),
(74, 77, 'desarrolloit@meridian.com.co', 'correo', '2025-09-15 21:57:38'),
(75, 80, 'desarrolloit@meridian.com.co', 'correo', '2025-09-17 21:48:29'),
(76, 80, 'desarrolloit@meridian.com.co', 'correo', '2025-09-25 13:28:30'),
(77, 78, 'desarrolloit@meridian.com.co', 'correo', '2025-09-25 17:12:08'),
(78, 72, 'desarrolloit@meridian.com.co', 'correo', '2025-09-25 17:20:37'),
(79, 77, 'desarrolloit@meridian.com.co', 'correo', '2025-09-25 17:26:35'),
(80, 65, 'desarrolloit@meridian.com.co', 'correo', '2025-09-25 19:07:30'),
(81, 81, 'desarrolloit@meridian.com.co', 'correo', '2025-09-30 19:00:37'),
(82, 82, 'desarrolloit@meridian.com.co', 'correo', '2025-09-30 19:03:02'),
(83, 83, 'desarrolloit@meridian.com.co', 'correo', '2025-09-30 19:05:34'),
(84, 84, 'desarrolloit@meridian.com.co', 'correo', '2025-09-30 20:54:07'),
(85, 85, 'desarrolloit@meridian.com.co', 'correo', '2025-09-30 20:56:06'),
(86, 86, 'desarrolloit@meridian.com.co', 'correo', '2025-09-30 21:10:33'),
(87, 87, 'desarrolloit@meridian.com.co', 'correo', '2025-09-30 21:11:32'),
(88, 86, 'desarrolloit@meridian.com.co', 'correo', '2025-09-30 21:13:09'),
(89, 88, 'desarrolloit@meridian.com.co', 'correo', '2025-09-30 21:13:16'),
(90, 89, 'desarrolloit@meridian.com.co', 'correo', '2025-09-30 21:15:17'),
(91, 90, 'desarrolloit@meridian.com.co', 'correo', '2025-09-30 21:15:58'),
(92, 91, 'desarrolloit@meridian.com.co', 'correo', '2025-09-30 21:18:14'),
(93, 92, 'desarrolloit@meridian.com.co', 'correo', '2025-09-30 21:18:50'),
(94, 58, 'desarrolloit@meridian.com.co', 'correo', '2025-10-01 13:54:44'),
(95, 59, 'desarrolloit@meridian.com.co', 'correo', '2025-10-01 13:54:49'),
(96, 60, 'desarrolloit@meridian.com.co', 'correo', '2025-10-01 13:54:52'),
(97, 61, 'desarrolloit@meridian.com.co', 'correo', '2025-10-01 13:54:54'),
(98, 62, 'desarrolloit@meridian.com.co', 'correo', '2025-10-01 13:54:55'),
(99, 67, 'desarrolloit@meridian.com.co', 'correo', '2025-10-01 13:54:58'),
(100, 68, 'desarrolloit@meridian.com.co', 'correo', '2025-10-01 13:54:59'),
(101, 69, 'desarrolloit@meridian.com.co', 'correo', '2025-10-01 13:55:01'),
(102, 57, 'desarrolloit@meridian.com.co', 'correo', '2025-10-01 13:55:10'),
(103, 55, 'desarrolloit@meridian.com.co', 'correo', '2025-10-01 13:55:18'),
(104, 56, 'desarrolloit@meridian.com.co', 'correo', '2025-10-01 13:55:29'),
(105, 54, 'desarrolloit@meridian.com.co', 'correo', '2025-10-01 13:55:37'),
(106, 61, 'desarrolloit@meridian.com.co', 'correo', '2025-10-01 13:56:52'),
(107, 92, 'desarrolloit@meridian.com.co', 'correo', '2025-10-06 16:04:04'),
(110, 91, 'desarrolloit@meridian.com.co', 'correo', '2025-10-09 13:13:35'),
(111, 90, 'desarrolloit@meridian.com.co', 'correo', '2025-10-09 13:13:45'),
(112, 69, 'desarrolloit@meridian.com.co', 'correo', '2025-10-09 20:49:08'),
(113, 55, 'desarrolloit@meridian.com.co', 'correo', '2025-10-09 20:57:50'),
(114, 94, 'desarrolloit@meridian.com.co', 'correo', '2025-10-10 14:51:55'),
(115, 95, 'desarrolloit@meridian.com.co', 'correo', '2025-10-10 14:59:54'),
(116, 94, 'desarrolloit@meridian.com.co', 'correo', '2025-10-10 15:02:00'),
(117, 95, 'desarrolloit@meridian.com.co', 'correo', '2025-10-10 15:02:07'),
(118, 89, 'desarrolloit@meridian.com.co', 'correo', '2025-10-10 15:06:47'),
(120, 97, 'desarrolloit@meridian.com.co', 'correo', '2025-10-20 14:15:25'),
(121, 98, 'desarrolloit@meridian.com.co', 'correo', '2025-10-22 15:21:08'),
(122, 97, 'desarrolloit@meridian.com.co', 'correo', '2025-10-22 16:58:32'),
(123, 98, 'desarrolloit@meridian.com.co', 'correo', '2025-10-22 16:58:37'),
(124, 97, 'desarrolloit@meridian.com.co', 'correo', '2025-10-22 16:58:43'),
(125, 95, 'desarrolloit@meridian.com.co', 'correo', '2025-10-22 17:13:52'),
(126, 79, 'desarrolloit@meridian.com.co', 'correo', '2025-10-22 17:22:36'),
(127, 94, 'desarrolloit@meridian.com.co', 'correo', '2025-10-22 17:39:48'),
(128, 80, 'desarrolloit@meridian.com.co', 'correo', '2025-10-22 17:45:06'),
(129, 99, 'desarrolloit@meridian.com.co', 'correo', '2025-10-23 15:10:57');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reportes`
--

CREATE TABLE `reportes` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `telefono_contacto` varchar(20) DEFAULT NULL,
  `correo_contacto` varchar(100) DEFAULT NULL,
  `tipo_reporte` enum('hallazgos','incidentes','conversaciones','pqr') NOT NULL,
  `tipo_pqr` enum('peticion','queja','reclamo','inquietud') DEFAULT NULL,
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

INSERT INTO `reportes` (`id`, `id_usuario`, `telefono_contacto`, `correo_contacto`, `tipo_reporte`, `tipo_pqr`, `asunto`, `descripcion_general`, `fecha_evento`, `lugar_hallazgo`, `lugar_hallazgo_otro`, `tipo_hallazgo`, `descripcion_hallazgo`, `recomendaciones`, `estado_condicion`, `grado_criticidad`, `ubicacion_incidente`, `hora_evento`, `tipo_afectacion`, `descripcion_incidente`, `tipo_conversacion`, `sitio_evento_conversacion`, `lugar_hallazgo_conversacion`, `lugar_hallazgo_conversacion_otro`, `descripcion_conversacion`, `asunto_conversacion`, `estado`, `revisado_por`, `comentarios_revision`, `fecha_revision`, `creado_en`, `actualizado_en`) VALUES
(52, 36, NULL, NULL, 'hallazgos', NULL, 'Modificación de plan de emergencia', NULL, '2025-08-22', 'pozos', '', 'condicion_insegura', 'Al iniciar el Arme de equipos de Slick-Line se observa que no tienen protección para la caída de residuos al contrapozo', 'Se realizo charla de seguridad con el personal aliado en locación Floreña I9 se les hace la recomendación y se procede a colocar una protección plástica', 'cerrada', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aprobado', 51, 'Caso aprobado por Michael Stiven Ruiz Caro. Motivo: se realizaron las acciones correspondientes ', '2025-08-22 09:37:33', '2025-08-22 16:34:39', '2025-08-22 16:37:33'),
(53, 156, NULL, NULL, 'conversaciones', NULL, 'Cuidado de la espalda', NULL, '2025-09-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'reflexion', 'Puesto fisico de trabajo remoto', 'otras', 'Escritorio', 'La capacitación sobre el cuidado de la espalda me hizo notar lo fácil que es ignorar las recomendaciones de descanso, especialmente en días de mucho trabajo. El viernes pasado lo viví en carne propia: al final del día, el dolor en la parte baja de la espalda me recordó la importancia de esas pausas.\n\nPor eso, desde este lunes, me he propuesto ser más disciplinado con los descansos y la postura, integrando las pausas activas recomendadas para cuidar no solo mi espalda, sino también mi vista. Es un compromiso que estoy tomando para mi bienestar.', 'Cuidado de la espalda', 'aprobado', 56, 'Caso aprobado por Diana Marcela Jacobo Mancera. Motivo: Se realiza la verificación del caso, destacando que este constituye un comentario que fortalece la importancia de la ejecución de las pausas activas y la implementación de cambios posturales promovidos durante la capacitación de cuidado de la espalda.', '2025-09-09 08:23:09', '2025-09-02 15:59:00', '2025-09-09 15:23:09'),
(54, 262, NULL, NULL, 'hallazgos', NULL, 'Dotación para laborar mis actividades', NULL, '2025-09-02', 'pozos', '', 'accion_mejoramiento', 'En la dotación de trabajo no me entregaron overoles, solo me dieron camisas y jeans. Y requiero overoles ya que visito constantemente a pozos del campo. También superviso operaciones donde debo estar con la dotación adecuada.', 'Entrega de overoles de la empresa y no camisas y Jeans', 'abierta', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'en_revision', 51, 'Estado cambiado a en_revision por Michael Stiven Ruiz Caro', '2025-10-01 06:55:37', '2025-09-02 17:21:34', '2025-10-01 13:55:37'),
(55, 267, NULL, NULL, 'hallazgos', NULL, 'Solicitud cambio dotacion', NULL, '2025-09-02', 'epp', '', 'accion_mejoramiento', 'Buen dia\nSe reporta talla muy grande de dotacion bragas', 'Se requiere cambiar las 2 bragas entregadas por talla 4', 'abierta', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aprobado', 51, 'Caso aprobado por Michael Stiven Ruiz Caro. Motivo: Se realiza cambio de la braga por talla 4 dama ', '2025-10-09 13:57:50', '2025-09-02 17:24:57', '2025-10-09 20:57:50'),
(56, 269, NULL, NULL, 'hallazgos', NULL, 'Entrega de materiales faltantes', NULL, '2025-09-02', 'campo_produccion', '', 'accion_mejoramiento', 'Aún no cuento con los accesorios para los actividades diarias como lo son pantalla, mouse, descansa pies', 'Entrega de materiales restantes', 'abierta', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'en_revision', 51, 'Estado cambiado a en_revision por Michael Stiven Ruiz Caro', '2025-10-01 06:55:29', '2025-09-02 17:35:16', '2025-10-01 13:55:29'),
(57, 269, NULL, NULL, 'hallazgos', NULL, 'No envíe overoles', NULL, '2025-09-02', 'campo_produccion', '', 'accion_mejoramiento', 'No recibí overoles , ya que las actividades son de subsuelo y se requiere trabajos en campo', 'Envío de dotación completa', 'abierta', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'en_revision', 51, 'Estado cambiado a en_revision por Michael Stiven Ruiz Caro', '2025-10-01 06:55:10', '2025-09-02 17:36:59', '2025-10-01 13:55:10'),
(58, 261, NULL, NULL, 'hallazgos', NULL, 'Dotación Overol', NULL, '2025-09-02', 'otras', 'N/A', 'accion_mejoramiento', 'Solicito amablemente de tu apoyo con la dotación de overol y pantalla', 'Solicito amablemente de tu apoyo con la dotación de overol y pantalla', 'abierta', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'en_revision', 51, 'Estado cambiado a en_revision por Michael Stiven Ruiz Caro', '2025-10-01 06:54:44', '2025-09-02 17:42:50', '2025-10-01 13:54:44'),
(59, 265, NULL, NULL, 'hallazgos', NULL, 'NOVEDAD DOTACIÓN', NULL, '2025-09-02', 'epp', '', 'accion_mejoramiento', 'Buen día, reporto novedad en la dotación. Ya que recibí 2 camisas talla S para hombre. \npor favor, su apoyo con el cambio de las tallas ( para mujer talla S) y realizar el cambio de una camisa y un jean por un overol. \nMuchas gracias.', 'Tener en cuenta la dotación solicitada.', 'abierta', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'en_revision', 51, 'Estado cambiado a en_revision por Michael Stiven Ruiz Caro', '2025-10-01 06:54:49', '2025-09-02 18:05:32', '2025-10-01 13:54:49'),
(60, 272, NULL, NULL, 'hallazgos', NULL, 'Entrega de pantalla y soporte de la misma con el soporte del computador.', NULL, '2025-09-02', 'campo_produccion', '', 'accion_mejoramiento', 'Se reporta por favor entregar la pantalla y soporte de la misma ademas del soporte del computador.', 'Entrega de los elementos relacionados', 'abierta', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'en_revision', 51, 'Estado cambiado a en_revision por Michael Stiven Ruiz Caro', '2025-10-01 06:54:52', '2025-09-02 18:52:51', '2025-10-01 13:54:52'),
(61, 266, NULL, NULL, 'hallazgos', NULL, 'SOLICITUD DE OVEROL', NULL, '2025-09-02', 'epp', '', 'aspecto_positivo', 'SOLICITUD DE OVEROL ADICUONAL TALLA 6 PARA REALIZAR ACTIVIDADES EN CAMPO RELACIONADOS CON EL ROL DE EQUIPOS.', 'ENTREGA DE OVEROL ADICIONAL.', 'abierta', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aprobado', 51, 'Caso aprobado por Michael Stiven Ruiz Caro. Motivo: Se realiza entrega de overol talla 4 dama, de acuerdo a lo solicitado ', '2025-10-01 06:56:52', '2025-09-02 19:32:52', '2025-10-01 13:56:52'),
(62, 263, NULL, NULL, 'hallazgos', NULL, 'Novedades EPP', NULL, '2025-09-02', 'epp', '', 'accion_mejoramiento', 'Reporto novedades de dotación pendientes: 2 overoles talla 6\npantalla (monitor)\nchaqueta talla s', 'Reporto novedades de dotación para solicitar: 2 overoles talla 6\npantalla (monitor)\nchaqueta talla s\nreposa pies', 'abierta', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'en_revision', 51, 'Estado cambiado a en_revision por Michael Stiven Ruiz Caro', '2025-10-01 06:54:55', '2025-09-02 20:15:23', '2025-10-01 13:54:55'),
(65, 56, NULL, NULL, 'hallazgos', NULL, 'Se reporta que el lavaplatos se encuentra una filtración de agua el cual pasa a el almacenamiento de los quimicos', NULL, '2025-08-26', 'otras', 'Cocina - Lavaplatos', 'condicion_insegura', 'Se evidencia que el lavaplatos presenta una filtración de agua que pasa hacia el área de almacenamiento de químicos, ocasionando que los productos permanezcan húmedos y generando, a su vez, filtración de agua hacia el piso de la cocina.\nEsta situación representa un riesgo potencial de accidente por caída y requiere atención inmediata para su corrección.', 'Realizar mantenimiento correctivo al lavaplatos para eliminar la filtración de agua', 'abierta', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aprobado', 56, 'Caso aprobado por Diana Marcela Jacobo Mancera. Motivo: Se procede a realizar el sellado del lavaplatos con el fin de evitar filtraciones de agua hacia la zona de almacenamiento de químicos. Se anexa evidencia fotográfica del cierre realizado.', '2025-09-25 12:07:30', '2025-09-02 21:07:15', '2025-09-25 19:07:30'),
(67, 264, NULL, NULL, 'hallazgos', NULL, 'Solicitud de Overol', NULL, '2025-09-02', 'epp', '', 'accion_mejoramiento', 'Necesito 2 overoles talla 8 de dama para ir a mis actividades de pozo.', 'Mis actividades en visitas de campo previo al abandono de los pozos, requieren que esté totalmente protegida usando overol.', 'abierta', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'en_revision', 51, 'Estado cambiado a en_revision por Michael Stiven Ruiz Caro', '2025-10-01 06:54:58', '2025-09-02 21:39:25', '2025-10-01 13:54:58'),
(68, 274, NULL, NULL, 'hallazgos', NULL, 'Solicitud de Dotación', NULL, '2025-09-02', 'epp', '', 'accion_mejoramiento', 'Solicito de manera amable, el cambio de botas talla 38 por unas talla 39, auditivo para adaptar casco tipo safari MSA, cambio de overoles talla 14 por una talla 10. Además, de la pantalla, descansa pies, y el resto de cosas.', 'Por favor agradezco que me colaboren con urgencia el tema de dotación.', 'abierta', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'en_revision', 51, 'Estado cambiado a en_revision por Michael Stiven Ruiz Caro', '2025-10-01 06:54:59', '2025-09-02 21:56:33', '2025-10-01 13:54:59'),
(69, 274, NULL, NULL, 'hallazgos', NULL, 'Solicitud de herramienta', NULL, '2025-09-02', 'campo_produccion', '', 'accion_mejoramiento', 'Solicitud de Mouse ergonómico', 'Como Acción a mejorar, es importante precisar que las herramientas de trabajo deben de ergonómicas, ya que el uso de dispositivos no adecuados puede generar afectaciones como el síndrome del túnel carpiano y otros trastornos musculoesqueléticos.', 'abierta', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aprobado', 51, 'Caso aprobado por Michael Stiven Ruiz Caro. Motivo: Se le suministra al colaborador el elemento de acuerdo a la solicitud ', '2025-10-09 13:49:08', '2025-09-03 03:32:21', '2025-10-09 20:49:08'),
(70, 244, NULL, NULL, 'hallazgos', NULL, 'Mi puesto de trabajo me está generando dolor en el antebrazo derecho', NULL, '2025-09-03', 'otras', 'Puesto aprendiz', 'accion_mejoramiento', 'Posibles molestias futuras, he tenido dolor en antebrazo derecho, mi postura dificulta que repose mis brazos en el escritorio, la silla no ayuda a que se minimice esa molestia, requiero adicional un posapiés para que pueda mejorar', 'verificación del puesto de trabajo', 'abierta', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aprobado', 56, 'Caso aprobado por Diana Marcela Jacobo Mancera. Motivo: La colaboradora realizará rotación en los puestos disponibles de teletrabajo que cuenten con sillas de rodachines, y adicionalmente se le suministrará un elevador de pies para mejorar sus condiciones ergonómicas.', '2025-09-05 14:20:12', '2025-09-03 15:32:31', '2025-09-05 21:20:12'),
(71, 54, NULL, NULL, 'hallazgos', NULL, 'Ingreso de viento y aire constante', NULL, '2025-09-03', 'otras', 'Ventanas de las oficinas zona aprendices', 'accion_mejoramiento', 'Los aprendices quedan frente a dos ventanas que tienen un acceso de aire que apesar que está cerrada , queda un espacio en las bisagras que siempre deja ingreso de aire de forma directa a ellos lo cual los mantiene con frío y está provocando congestión', 'Verificar si se puede instalar un tipo de caucho o empaque para disminuir el aire', 'abierta', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'en_revision', 56, 'Estado cambiado a en_revision por Diana Marcela Jacobo Mancera', '2025-09-05 14:10:47', '2025-09-03 23:06:46', '2025-09-05 21:10:47'),
(72, 54, NULL, NULL, 'hallazgos', NULL, 'Mal uso de las impresoras y de papel', NULL, '2025-09-03', 'otras', 'En oficina principal de plaza 67', 'accion_mejoramiento', 'El personal envía a imprimir y no se hacerca a recoger sus impresiones, esto haciendo uso de las resmas de papel solicitadas por contabilidad, así acumulando hojas para reciclar y luego no son usadas.', 'Realizar sencibilizacion del consumo de papel y de tintas', 'abierta', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aprobado', 56, 'Caso aprobado por Diana Marcela Jacobo Mancera. Motivo: Se realiza el envío de la Comunicación Interna No. 42 – Reducción de consumo de agua, energía y papel.\nAdicionalmente, esta información será socializada en la reunión de cierre de actividades, con el fin de concientizar a los colaboradores sobre la importancia del consumo responsable y el ahorro de estos recursos.', '2025-09-25 10:20:37', '2025-09-03 23:13:14', '2025-09-25 17:20:37'),
(73, 56, NULL, NULL, 'hallazgos', NULL, 'Se reporta que no hay un lugar adecuado para lavar los traperos', NULL, '2025-08-25', 'otras', 'lavado de traperos', 'condicion_insegura', 'Se reporta que no se tiene un lugar adecuado para lavar el trapero y para evacuar el agua de que se utiliza para la limpieza de los pisos', 'Se solicita que se compre Balde Tornado Spin 10 Lts Pedal y se ubique un cifon para evacuar el agua', 'abierta', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aprobado', 56, 'Caso aprobado por Diana Marcela Jacobo Mancera. Motivo: Se adquiere un balde para enjuague con escurridor, con capacidad de 6 litros, acompañado de un cabezal con mopa de microfibra y un mango ergonómico de 118 cm de longitud. El sistema permite exprimir la mopa fácilmente, mediante giros al subir y bajar el mango, optimizando la limpieza y reduciendo el esfuerzo físico.', '2025-09-05 14:04:11', '2025-09-04 13:55:47', '2025-09-05 21:04:11'),
(74, 58, NULL, NULL, 'hallazgos', NULL, 'Malos olores por el sifón del baño', NULL, '2025-09-03', 'otras', 'Baño ubicado en el área de aprendices', 'accion_mejoramiento', 'Durante el día se perciben malos olores que salen del sifón del baño ubicado en el área de aprendices, ya que el baño exporadicamente se usa y mantiene con la puerta cerrada.', 'Realizar una inspección para detectar obstrucciones, revisar y limpiar sifón, desagüe interior.\nProgramar limpieza y mantenimiento.', 'abierta', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'en_revision', 56, 'Estado cambiado a en_revision por Diana Marcela Jacobo Mancera', '2025-09-05 14:35:31', '2025-09-04 14:24:38', '2025-09-05 21:35:31'),
(75, 56, NULL, NULL, 'hallazgos', NULL, 'Se reporta que el personal de GH ha abierto la puerta de emergencias debido a episodios de sofocación presentados en su puesto de trabajo.', NULL, '2025-09-04', 'otras', 'Area de GH', 'condicion_insegura', 'Se reporta que el personal de GH ha abierto la puerta de emergencias debido a episodios de sofocación presentados en su puesto de trabajo.', 'Se solicita que se coloque ventilador', 'abierta', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aprobado', 56, 'Caso aprobado por Diana Marcela Jacobo Mancera. Motivo: Se procede a instalar un ventilador junto a la puerta de emergencias con el fin de minimizar la sensación de sofocación en el área.', '2025-09-05 14:16:35', '2025-09-05 21:14:26', '2025-09-05 21:16:35'),
(76, 253, NULL, NULL, 'hallazgos', NULL, 'Orden y aseo', NULL, '2025-09-09', 'otras', 'Oficina', 'accion_mejoramiento', 'Buzon de sugerencias con monedas', 'El buzon de sugerencias se está usando inadecuadamente, se suguiere hacer limpieza.', 'abierta', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aprobado', 56, 'Caso aprobado por Diana Marcela Jacobo Mancera. Motivo: Se informa que anteriormente este buzón era utilizado como mecanismo de amonestación por dejar la puerta principal de ingreso abierta, debiendo depositar la suma de $500 COP por cada incumplimiento.\n\nA partir de la fecha y teniendo en cuenta el traslado de oficina, este proceso queda omitido y, por lo tanto, el buzón ya no se continuará utilizando para este fin.\n\nSe deja constancia de que el monto recolectado fue de $1.600 COP.', '2025-09-10 07:42:15', '2025-09-09 16:07:42', '2025-09-10 14:42:15'),
(77, 56, NULL, NULL, 'incidentes', NULL, 'Atrapamiento de dedo por ventana', NULL, '2025-09-12', NULL, NULL, NULL, NULL, NULL, NULL, 'alto', 'Ventana del área de aprendices', '11:20:00', 'personas', 'Se reporta que, al momento de cerrar la ventana del área de aprendices, el sujetador se desplazó provocando la caída de la ventana sobre el dedo corazón de la mano del colaborador. El incidente ocasionó machucamiento, ruptura de la uña e inflamación en el dedo afectado.', NULL, NULL, NULL, NULL, NULL, NULL, 'aprobado', 56, 'Caso aprobado por Diana Marcela Jacobo Mancera. Motivo: Se realiza la socialización sobre la importancia de analizar previamente los riesgos antes de ejecutar cualquier actividad, incluso aquellas que puedan parecer sencillas o rutinarias, tal como se indica en el correo.', '2025-09-25 10:26:35', '2025-09-12 16:36:37', '2025-09-25 17:26:35'),
(78, 229, NULL, NULL, 'hallazgos', NULL, 'Implemento inadecuados para los aprendices', NULL, '2025-09-12', 'otras', 'Area de aprendices', 'accion_mejoramiento', 'En mi lugar de trabajo, no cuento con los implementos en buenas condiciones, ya que los audifonos no me funcionan, el teclado tiene teclas que no funcionan y me toca hacer mucho esfuerzo, de igual manera con el mouse, siento en oportunidades que la silla me genera incomodidad ya que me dan dolores de espalda.', 'Revisión de los implementos y cambio de los mismos.', 'abierta', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aprobado', 56, 'Caso aprobado por Diana Marcela Jacobo Mancera. Motivo: Se procede a realizar el cambio de los elementos (teclado, mouse) y se entregan audífonos.\nAdicionalmente, se implementarán pausas activas con mayor frecuencia, las cuales serán lideradas por Erika Mancipe.', '2025-09-25 10:12:08', '2025-09-12 21:21:34', '2025-09-25 17:12:08'),
(79, 235, NULL, NULL, 'hallazgos', NULL, 'Solicitud de mejora de las condiciones ergonómicas y equipo de trabajo para optimizar el rendimiento y prevenir riesgos laborales.', NULL, '2025-09-15', 'otras', 'oficinas de trabajo meridian Bogota, puesto de trabajo aprendices', 'condicion_insegura', '1. Mobiliario Ergonómico Inadecuado\nLa silla de trabajo que me ha sido asignada no cumple con los estándares ergonómicos necesarios para la labor. Su principal deficiencia es la falta de un sistema de ajuste de altura. Esto genera las siguientes problemáticas:\n\nAltura del escritorio: El escritorio me resulta excesivamente alto, lo que obliga a adoptar una postura forzada al usar el teclado y el mouse.\n\nPostura forzada: Para compensar, debo colocar el teclado sobre mis piernas, lo cual es incómodo e insostenible a largo plazo.\n\nDolor en hombros: La altura inadecuada del mouse causa tensión y dolor en el hombro, un síntoma directo de la mala ergonomía del puesto.\nEstas condiciones, al ser prolongadas, aumentan el riesgo de desarrollar lesiones musculoesqueléticas y fatiga.\n2. Equipo de Trabajo Deficiente\nEl equipo de trabajo actual, un computador portátil, no es el adecuado para las funciones de diseño que desempeño. Sus dimensiones y características técnicas resultan insuficientes para las siguientes tareas:\n\nPantalla pequeña: El tamaño reducido de la pantalla dificulta la visualización detallada, crucial para las labores de diseño gráfico.\n\nFatiga visual: La necesidad de forzar la vista para trabajar en una pantalla tan pequeña me genera fatiga visual, estrés laboral, y dolores de cabeza recurrentes.\nContar con una pantalla de mayores dimensiones y una mejor resolución gráfica es fundamental para optimizar mi rendimiento, reducir la fatiga visual y mejorar la calidad de mi trabajo.\n3. Condiciones Ambientales\nHe notado que las ventanas de mi área de trabajo no cierran correctamente. En ocasiones, esto permite la entrada de malos olores del exterior, lo que afecta negativamente el ambiente y la concentración.', 'En vista de lo expuesto, solicito amablemente la revisión y mejora de mi puesto de trabajo, incluyendo:\n\nUna silla ergonómica con ajuste de altura.\n\nUna pantalla externa de mayores dimensiones para conectar el equipo de cómputo.\n\nEl mantenimiento o reparación de las ventanas del área para asegurar un ambiente de trabajo adecuado.\n\nConfío en que estas mejoras no solo contribuirán a mi bienestar físico, sino que también me permitirán ser más productivo y eficiente en mis responsabilidades. Agradezco de antemano su atención a este asunto.', 'abierta', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aprobado', 56, 'Caso aprobado por Diana Marcela Jacobo Mancera. Motivo: Se deja constancia de la entrega del elemento ergonómico y pantalla externa, con el fin de prevenir riesgos asociados a posturas inadecuadas. Se anexa evidencia fotográfica del ajuste realizado.', '2025-10-22 10:22:36', '2025-09-15 13:35:18', '2025-10-22 17:22:36'),
(80, 101, NULL, NULL, 'hallazgos', NULL, 'FALTA VENTILACIÓN', NULL, '2025-09-17', 'otras', 'OFICINA MERIDIAN PLAZA 67', 'accion_mejoramiento', 'EN LA OFICINA PRINCIPAL PLAZA 67 SE HA EVIDENCIADO FALTA DE VENTILACION EN LAS TARDES Y ESTA SIENDO INCOMODA LA SITUACIÓN, DEBIDO A ESTO SE PRESENTA ACUMULACIÓN DE OLORES EN ESPECIAL CUANDO REALIZAN ASEO.', 'PODRIA SER AIRE ACONDICIONADO O VENTILADORES EN TODAS LAS ZONAS', 'abierta', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aprobado', 56, 'Caso aprobado por Diana Marcela Jacobo Mancera. Motivo: Se realiza la instalación de un ventilador con el fin de mejorar la circulación del aire y evitar la acumulación de calor y olores en el área de trabajo.', '2025-10-22 10:45:06', '2025-09-17 21:48:29', '2025-10-22 17:45:06'),
(81, 295, NULL, NULL, 'hallazgos', NULL, 'Identificación fuga', NULL, '2025-09-04', 'pozos', '', 'condicion_insegura', 'Se identifica liqueo de hidráulico en línea del acumulador.', 'Se realiza la verificación con el supervisor de turno y el mecánico realiza corrección.', 'cerrada', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'pendiente', NULL, NULL, NULL, '2025-09-30 19:00:37', '2025-09-30 19:00:37'),
(82, 295, NULL, NULL, 'hallazgos', NULL, 'Falta de señalización', NULL, '2025-09-02', 'pozos', '', 'condicion_insegura', 'Se observa guaya de anclaje fijo para el equipo de perforación en el patio de la locación sin señalización, generando condición insegura.', 'Se llama a supervisor de turno, y se pide realizar el ajuste de la condición.', 'cerrada', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'pendiente', NULL, NULL, NULL, '2025-09-30 19:03:02', '2025-09-30 19:03:02'),
(83, 295, NULL, NULL, 'hallazgos', NULL, 'Felicitación', NULL, '2025-09-09', 'pozos', '', 'acto_inseguro', 'Se realiza felicitación a la cuadrilla por realizar la actividad de enganche para BHA según procedimiento.', 'Se replica la felicitación.', 'cerrada', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'pendiente', NULL, NULL, NULL, '2025-09-30 19:05:34', '2025-09-30 19:05:34'),
(84, 28, NULL, NULL, 'conversaciones', NULL, 'Divulgación de alerta por reubicación de ventilzdor, golpe en pie derecho', NULL, '2025-09-07', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'conversacion', 'Floreña AP13', 'pozos', '', 'Divulgación de alerta por reubicación de ventilador, golpe en pie derecho a todo el personal en el área de trabajo', 'Divulgación de alerta por reubicación de ventilzdor, golpe en pie derecho', 'pendiente', NULL, NULL, NULL, '2025-09-30 20:54:07', '2025-09-30 20:54:07'),
(85, 28, NULL, NULL, 'hallazgos', NULL, 'Area de trabajo bien delimitada y señalizada', NULL, '2025-09-08', 'pozos', '', 'aspecto_positivo', 'Area de trabajo bien delimitada y señalizada por parte del aliado durante operación de registros en pozo.', 'Se felicitó al aliado\nSe informó del tema en reuniones posteriores', 'cerrada', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'pendiente', NULL, NULL, NULL, '2025-09-30 20:56:06', '2025-09-30 20:56:06'),
(86, 36, NULL, NULL, 'conversaciones', NULL, 'Áreas Seguras', NULL, '2025-09-19', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'reflexion', 'CPSXN6', 'pozos', '', 'Realizó safety tour al inicio y final de la intervención en CPSXN6, encontrando buenas condiciones de orden y aseo. Verifico el cierre de los hallazgos encontrados en la visita previa. La locación se entrego en buenas condiciones de orden y asea, tal cual como fue recibida.', 'Áreas Seguras', 'en_revision', 51, 'Estado cambiado a en_revision por Michael Stiven Ruiz Caro', '2025-09-30 14:13:09', '2025-09-30 21:10:33', '2025-09-30 21:13:09'),
(87, 36, NULL, NULL, 'conversaciones', NULL, 'Áreas Seguras', NULL, '2025-09-23', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'reflexion', 'CPSXN6', 'pozos', '', 'Realizó safety tour durante la visita previa a la intervención locación Cupiagua Sur XN6, con las compañías aliadas y el operador de pozo. Se evidencio falta de vigilancia, nivel alto en el contrapozo y falta de brazo adicional en el árbol de producción, a lo que el operador de pozo procedió a diligenciar su cierre.', 'Áreas Seguras', 'pendiente', NULL, NULL, NULL, '2025-09-30 21:11:32', '2025-09-30 21:11:32'),
(88, 36, NULL, NULL, 'hallazgos', NULL, 'EPP', NULL, '2025-09-23', 'pozos', '', 'accion_mejoramiento', 'Durante la ubicación de los equipos se observa al señalero de la grúa sin chaleco reflectivo, se llama al operador y se le recuerda la importancia de este elemento, a lo que el operador procedió a usar inmediatamente', 'Se le recuerda la importancia de este elemento, a lo que el operador procedió a usar inmediatamente', 'cerrada', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'pendiente', NULL, NULL, NULL, '2025-09-30 21:13:16', '2025-09-30 21:13:16'),
(89, 36, NULL, NULL, 'hallazgos', NULL, 'Áreas Seguras', NULL, '2025-09-19', 'pozos', '', 'accion_mejoramiento', 'Realizó safety tour durante la visita previa a la intervención locación Cupiagua Sur XN6, con las compañías aliadas y el operador de pozo. Se evidencio falta de vigilancia, nivel alto en el contrapozo y falta de brazo adicional en el árbol de producción, a lo que el operador de pozo procedió a diligenciar su cierre.', 'Se movilizo seguridad para la movilización del campamento, se realizo drenaje de contrapozo y se realizo instalación de brazo adicional del árbol de producción antes del ingreso a pozo.', 'cerrada', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'en_revision', 51, 'Estado cambiado a en_revision por Michael Stiven Ruiz Caro', '2025-10-10 08:06:47', '2025-09-30 21:15:17', '2025-10-10 15:06:47'),
(90, 36, NULL, NULL, 'conversaciones', NULL, 'Charlas de seguridad', NULL, '2025-09-23', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'conversacion', 'CPSXN6', 'pozos', '', 'Realizó Charla de seguridad con personal aliado en locación CPSXN6. dirige reunión de seguridad con cada una de las empresas aliadas, revisa y divulga análisis de riesgos y firma permisos de trabajo (Turno día).  Comparte campaña: “inicio de operaciones seguras.”', 'Charlas de seguridad', 'en_revision', 58, 'Estado cambiado a en_revision por Erika Liliana Mancipe Rodriguez', '2025-10-09 06:13:45', '2025-09-30 21:15:58', '2025-10-09 13:13:45'),
(91, 36, NULL, NULL, 'conversaciones', NULL, 'Simulacros', NULL, '2025-09-25', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'reflexion', 'CPSXN6', 'pozos', '', 'Realizó simulacro con personal aliado (ETO) en locación CPSXN6, “Conato de incendio en unidad de generación de campamento”. Buena participación de personal en locación y personal de la ARL.', 'Simulacros', 'en_revision', 58, 'Estado cambiado a en_revision por Erika Liliana Mancipe Rodriguez', '2025-10-09 06:13:35', '2025-09-30 21:18:14', '2025-10-09 13:13:35'),
(92, 36, NULL, NULL, 'conversaciones', NULL, 'Charlas de seguridad', NULL, '2025-09-25', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'conversacion', 'CPSXN6', 'pozos', '', 'Realizó Charla de seguridad con personal aliado en locación CPSXN6. dirige reunión de seguridad con cada una de las empresas aliadas, revisa y divulga análisis de riesgos Integral durante operación de bombeo.  Comparte lección aprendida: “Golpe en pómulo con manguera.”', 'Charlas de seguridad', 'en_revision', 41, 'Estado cambiado a en_revision por José Mateo López Cifuentes', '2025-10-06 09:04:04', '2025-09-30 21:18:50', '2025-10-06 16:04:04'),
(94, 58, NULL, NULL, 'hallazgos', NULL, 'Solicitud de base para pantalla', NULL, '2025-10-10', 'otras', 'Puesto de trabajo área Aprendices', 'condicion_insegura', 'Darwin Garzón se encuentra sin soporte para la pantalla ya que realizaron el cambio de portátil por PC el 26 de Septiembre y  desde ese fecha tiene como soporte dos agendas.\nLa falta de soporte para la pantalla puede generar:\nMala postura (cuello inclinado, hombros encorvados o tensión en la espalda).\nDolor cervical y lumbar.\nFatiga visual, al no mantener la pantalla a la altura de los ojos.\nDolor de cabeza o tensión muscular por mantener posiciones forzadas.\nDisminución del rendimiento laboral, debido al malestar físico.', 'Solicitud de soporte para pantalla pc.\nInstalar un soporte ajustable para monitor que permita al colaborador mantener la parte superior de la pantalla a la altura de los ojos.', 'abierta', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aprobado', 56, 'Caso aprobado por Diana Marcela Jacobo Mancera. Motivo: Se deja constancia de la entrega del elemento ergonómico y de la adecuada ubicación de las pantallas, con el fin de prevenir riesgos asociados a posturas inadecuadas. Se anexa evidencia fotográfica del ajuste realizado.', '2025-10-22 10:39:48', '2025-10-10 14:51:55', '2025-10-22 17:39:48'),
(95, 58, NULL, NULL, 'hallazgos', NULL, 'Colaborador se encuentra sin soporte para pantalla', NULL, '2025-10-10', 'otras', 'Administrativo oficinas Meridian área aprendices', 'condicion_insegura', 'El colaborador Andrey Lopez del área de aprendices se encuentra sin soporte para la pantalla.\nRiesgos asociados: La falta de soporte para la pantalla puede generar:\nMala postura (cuello inclinado, hombros encorvados o tensión en la espalda).\nDolor cervical y lumbar.\nFatiga visual, al no mantener la pantalla a la altura de los ojos.\nDolor de cabeza o tensión muscular por mantener posiciones forzadas.\nDisminución del rendimiento laboral, debido al malestar físico.', 'Solicitud de Instalar un soporte ajustable para monitor que permita al colaborador mantener la parte superior de la pantalla a la altura de los ojos.', 'abierta', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aprobado', 56, 'Caso aprobado por Diana Marcela Jacobo Mancera. Motivo: Se deja constancia de la entrega del elemento ergonómico y de la adecuada ubicación de las pantallas, con el fin de prevenir riesgos asociados a posturas inadecuadas. Se anexa evidencia fotográfica del ajuste realizado.', '2025-10-22 10:13:52', '2025-10-10 14:59:54', '2025-10-22 17:13:52'),
(97, 41, '111111111111', 'TEST@GMAIL.COM', 'pqr', 'peticion', 'PRUEBA', NULL, NULL, NULL, NULL, NULL, 'testtestetsetsetsetsetsetsetsetes', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'rechazado', 56, 'Estado cambiado a rechazado por Diana Marcela Jacobo Mancera', '2025-10-22 09:58:43', '2025-10-20 14:15:25', '2025-10-22 16:58:43'),
(98, 50, NULL, NULL, 'hallazgos', NULL, 'Acto inseguro  Uso inadecuado de cafetera de agua caliente', NULL, '2025-10-14', 'otras', 'Cocina', 'accion_mejoramiento', 'el día vienes 14 de  octubre , presento  la cafetera de agua caliente  no  dio función el cual no prendió el bombillo de que no estaba encendido.   en el lugar de cafetería, también se cambio de toma y tampoco , en todo el día .', 'se reporto a HSEQ \n , sobre el caso para el uso exclusivo para personal.', 'abierta', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'en_revision', 56, 'Estado cambiado a en_revision por Diana Marcela Jacobo Mancera', '2025-10-22 09:58:37', '2025-10-22 15:21:08', '2025-10-22 16:58:37'),
(99, 46, NULL, NULL, 'hallazgos', NULL, 'Personal en la oficina con gripa, asistiendo durante varios días con esta condición. Se aviso al lider de HSEQ, pero aun el trabajador sigue en la oficina', NULL, '2025-10-23', 'otras', 'Oficinas principales Meridian Consulting Ltda.', 'condicion_insegura', 'Viviana Alfonso ha estado desde ayer viniendo a la oficina principal de la empresa con tapabocas y con signos de gripa. El posible riesgo es de contagio cruzado a otras personas que trabajan en la oficina, teniendo en cuenta que son oficinas cerradas y que ella esta en la parte central de las mismas', 'Las personas con  sintomas de gripa, deberían trabajar desde su casa. Deberian ser enviadas a su domicilio cuando se verifique que los sintomas son de gripa', 'abierta', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'pendiente', NULL, NULL, NULL, '2025-10-23 15:10:57', '2025-10-23 15:10:57');

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
(26, 'Brayan Alejandro Monroy Pinzon', '1032461712', 'brayan.monroy@ecopetrol.com.co', '$2y$10$FcRSX.9YcGBZ.f2wM6CWk.f5XzXCoAHikJ5t6GLYFuOrUpVMnvRgy', 'colaborador', '3047761-4', 0, '2025-08-19 14:37:03'),
(27, 'Camilo Andres Ibañez Rozo', '1115914517', 'ingcamilo.ibanez@gmail.com', '$2y$10$yPi5OfAmrcZjeUHsTpCs7OZAnHB3yutv/TB9IiUAHZo2VbWFXBXm2', 'colaborador', 'COMPANY MAN - GGS', 1, '2025-08-19 14:37:03'),
(28, 'Carlos Saul Celis Acero', '7161987', 'carlos.celis@ecopetrol.com.co', '$2y$10$rsaSsw17TfaUQrV/4ARuBurk6GJfHcyGu.RyGsm2in76d9fuS9Zxi', 'colaborador', 'COMPANY MAN - GGS', 1, '2025-08-19 14:37:03'),
(29, 'Cesar Augusto Reyes Ballesteros', '13700520', 'cesar.reyes@meridianecp.com', '$2y$10$RbQVYsdpnR1cYdy9qf1N.evriN2ghTWRYyzwSJOQekQlz6cIZRpf2', 'colaborador', '3047761-4', 0, '2025-08-19 14:37:03'),
(30, 'Claudia Marina Ortiz Avendaño', '24228529', 'claudia.ortiz@meridianecp.com', '$2y$10$81VPu.sCV8XR9iundwZXt.iwkWTXBUybVRjJSc9v0G1USa1w4t.kC', 'colaborador', '3047761-4', 0, '2025-08-19 14:37:03'),
(31, 'Daniel Segura Espinosa', '74362501', 'daniel.segura@meridianecp.com', '$2y$10$kGF2lRGgbW.80eu7GhLhQuw7I1pKrvIFt4TufVzMONx6Rcv7sTBe.', 'colaborador', '3047761-4', 0, '2025-08-19 14:37:03'),
(32, 'Esteban Garcia Rojas', '1077173073', 'esteban.garcia@meridianecp.com', '$2y$10$M5vY900KpNfg4Q.70fUbdeRYjeZMz6NN6Kjfs1ysbydVHU2rI6o0e', 'colaborador', 'COMPANY MAN - GGS', 1, '2025-08-19 14:37:03'),
(33, 'Fernando Jose Aparicio Becerra', '91285174', 'fernando.aparicio@meridianecp.com', '$2y$10$Zh6UFCukXs/ehqFoF49zjugWAIrOGqu8gT197VY/ES/7huhMinSeW', 'colaborador', '3047761-4', 0, '2025-08-19 14:37:03'),
(34, 'Julio Cesar Romero Arevalo', '88281896', 'julio.romero@ecopetrol.com.co', '$2y$10$k3KNCVBeKMB3ehEto6w8ROYK3Imrf.6EH6xMahW5SulRtt4or40pi', 'colaborador', 'COMPANY MAN - GGS', 1, '2025-08-19 14:37:03'),
(35, 'Myriam Karina Paredes Forero', '33647141', 'myriam.paredes@meridianecp.com', '33647141', 'colaborador', '3047761-4', 0, '2025-08-19 14:37:03'),
(36, 'Pedro Rafael Cadena Ordoñez', '13871188', 'pedro.cadena@meridianecp.com', '$2y$10$ZPaMKNnYt7sJ/lPrmOTYCugzKJES9lSBj39oEDO9ehsJnmJbpiote', 'colaborador', '3047761-4', 1, '2025-08-19 14:37:03'),
(37, 'Viani Yorely Ruiz Galindo', '1115914145', 'viani.ruiz@meridianecp.com', '$2y$10$O2tsmrQPuSXT/SSIyFV2y.K4uwn9Yt8/lN8ERJjVjY0V6iIuBXF6y', 'colaborador', '3047761-4', 1, '2025-08-19 14:37:03'),
(38, 'Wilber Castaneda Castaneda', '80150738', 'Wilbercastaeda@gmail.com', '$2y$10$9Sdtph0OlgGfZfifamYUB.CYfV5.cuQJW/qhohaktlQb2ffDyPiqq', 'colaborador', 'COMPANY MAN - GGS', 1, '2025-08-19 14:37:03'),
(39, 'Jose Mauricio Aponte Abril', '11189101', 'jose.aponte@meridianecp.com', '$2y$10$kk7YFcaLJt7efX1drY5jfuiTi9y/C644HFlNRkSkAg5.I4.l.2gwO', 'colaborador', 'COMPANY MAN - GGS', 0, '2025-08-19 14:37:03'),
(40, 'Angela Maria Hernandez Tapias', '42116896', 'angelama.hernandez@ecopetrol.com.co', '42116896', 'colaborador', '3047761-4', 1, '2025-08-19 14:37:03'),
(41, 'José Mateo López Cifuentes', '1011202252', 'desarrolloit@meridian.com.co', '$2y$10$CwKGmnRZdgD4t7CeYEk.XeaCflzUNKT8lukfot9QfvNYj5X2dtAx2', 'admin', 'ADMINISTRACION', 1, '2025-08-19 14:38:10'),
(44, 'Nora Gisell Moreno Moreno', '52030991', 'nmoreno@meridian.com.co', '$2y$10$6iVvGeWc8.4XobGj.UKmI.6/zUunWzsgmXGJRbBMA1wUi9zF2FLVG', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(45, 'William Augusto Franco Castellanos', '79613401', 'wfranco@meridian.com.co', '$2y$10$5xgJRBNML4u4/2chfNEMuutD3dA3Tf5UyxaUriFvxtXxO7iHLuEEO', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(46, 'Cesar Augusto Urrego Avendaño', '79490148', 'currego@meridian.com.co', '$2y$10$ihTdyb7rXNu/4kZ8.aTeQu8jVAEQXvCbokV5OFxdg6ZQcqPPJpHfm', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(47, 'Ruth Muñoz Castillo', '52147279', 'rmunoz@meridian.com.co', '52147279', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(48, 'Zandra Patricia Mayorga Gomez', '52005033', 'coordinadoracontable@meridian.com.co', '52005033', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(49, 'Gustavo Adolfo Giraldo Correa', '1053788938', 'ggiraldo@meridian.com.co', '1053788938', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(50, 'Aura Alejandra Contreras Torres', '1014251428', 'asistenteadministrativo1@meridian.com.co', '$2y$10$r20EARy1UGvl8lwNrDi5Iuf3vW/vB0lqIJQ7THLByJGto./6Pujeu', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(51, 'Michael Stiven Ruiz Caro', '1007493802', 'soportehseqproyectos@meridian.com.co', '$2y$10$nS0jOp46EB6d9T5qNB9Hr.wVxmsjPFbXAqh6i0hQfhbkXs8DxNQhu', 'soporte', 'COMPANY MAN - ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(52, 'Nidia Carolina Grandas Castañeda', '1136887341', 'proyectos3@meridian.com.co', '1136887341', 'colaborador', 'COMPANY MAN - ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(53, 'Luis Miguel Guevara Marles', '1119211830', 'hseq@meridian.com.co', '$2y$10$drtpG6TvrCyM1BL6JEvF9ONjz3IcEcIqmahuR.YktSL5BB5V/bwp.', 'admin', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(54, 'Sandra Milena Florez Prado', '1014180459', 'asistenteadministrativo2@meridian.com.co', '$2y$10$0YmqZO44j55pBJDG7B.i.Ok4IDwVV5Gah9pnt3ZEyWZ/3fbmu/pDO', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(55, 'Eloy Gabriel Gomez Reyes', '1020733194', 'coordinaciongestionhumana@meridian.com.co', '1020733194', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(56, 'Diana Marcela Jacobo Mancera', '1031145571', 'soportehseq@meridian.com.co', '$2y$10$GycAgoorOM/FMtnzdG.PPOWGBaXAzKtYFO3QDbo1j6LNeQFWVJ1qS', 'admin', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(57, 'Laura Daniela Segura Morera', '1121936876', 'profesionalhseq@meridian.com.co', '$2y$10$g3o7koJ5TD5qp6SwRTrHP.a7ILFvKO6kzlaMzoZqtOVupns6hDm7a', 'admin', 'COMPANY MAN - ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(58, 'Erika Liliana Mancipe Rodriguez', '52978024', 'aprendizhseq@meridian.com.co', '$2y$10$ssRTSNIwDP2qOklbp4NSPecBCojGk0I3wBRD/HRWB1T1foTTuw5cC', 'admin', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(59, 'Andres Camilo Cardenas Reyes', '1007627524', 'soporteit.nivel1@meridian.com.co', '$2y$10$HBrTd8Dn5fydKYtWpIKZk.YEdbcwtjg.zIv4SwmPl9xa4booG5wyS', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(60, 'Andres Felipe Loaiza Caviedes', '1014663204', 'loaizaf187@gmail.com', '1014663204', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(61, 'Wendy Zamanda Fonseca Hurtado', '1026267917', 'zamandafh1988@gmail.com', '1026267917', 'colaborador', 'FRONTERA', 1, '2025-08-19 15:08:27'),
(62, 'Sonia Stephania Fonseca Lopez', '1007647736', 'asistentegestionhumana2@meridian.com.co', '1007647736', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(63, 'Maria Shirley Ordoñez Cuesta', '1121848186', 'profesionaladministrativoproyectos@meridian.com.co', '1121848186', 'colaborador', 'COMPANY MAN - ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(64, 'Fabryzcio Andres Ortiz Garcia', '1102580512', 'fabryzcioortiz@gmail.com', '1102580512', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(65, 'Eymer Santiago Méndez Herrera', '1031649053', 'santiagom202418@gmail.com', '1031649053', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(66, 'Yenny Lolita Garcia Betancourt', '26430509', 'yen289@hotmail.com', '26430509', 'colaborador', 'COMPANY MAN  - APIAY', 1, '2025-08-19 15:08:27'),
(67, 'Yenni Paola Doncel Acho', '1121869050', 'yenni.doncel08@hotmail.com', '1121869050', 'colaborador', 'COMPANY MAN  - APIAY', 1, '2025-08-19 15:08:27'),
(68, 'Olga Lucia Rueda Figueredo', '37949528', 'olga.ruedafigueredo@gmail.com', '37949528', 'colaborador', 'COMPANY MAN  - APIAY', 1, '2025-08-19 15:08:27'),
(69, 'Julio Edgardo Villamil Mondragon', '74375671', 'juedvimon@hotmail.com', '74375671', 'colaborador', 'COMPANY MAN  - APIAY', 1, '2025-08-19 15:08:27'),
(70, 'Juan Pablo Ramirez Diaz', '1057580446', 'juanpianoo@gmail.com', '1057580446', 'colaborador', 'COMPANY MAN  - APIAY', 1, '2025-08-19 15:08:27'),
(71, 'Jorge Leonardo Moyano Peña', '1121871041', 'jorgeleo-07@hotmail.com', '1121871041', 'colaborador', 'COMPANY MAN  - APIAY', 1, '2025-08-19 15:08:27'),
(72, 'Jhon Freddy Pabon Sanchez', '13874046', 'jhonfreddypabon@hotmail.com', '13874046', 'colaborador', 'COMPANY MAN  - APIAY', 1, '2025-08-19 15:08:27'),
(73, 'Hugo Fernando Rodriguez', '71376583', 'huferod2023@gmail.com', '71376583', 'colaborador', 'COMPANY MAN  - APIAY', 1, '2025-08-19 15:08:27'),
(74, 'Harrizon Alexander Rivera Arenas', '12197484', 'harrizoning590@hotmail.com', '12197484', 'colaborador', 'COMPANY MAN  - APIAY', 1, '2025-08-19 15:08:27'),
(75, 'Camilo Andres Riaño Galvis', '86084413', 'andres.rianog84@gmail.com', '86084413', 'colaborador', 'COMPANY MAN  - APIAY', 1, '2025-08-19 15:08:27'),
(76, 'Camilo Andres Patarroyo Varon', '1121825022', 'patacam86@hotmail.com', '1121825022', 'colaborador', 'COMPANY MAN  - APIAY', 1, '2025-08-19 15:08:27'),
(77, 'Andrea Paola Gutierrez Ramirez', '53014035', 'andreitagutierrez0707@gmail.com', '53014035', 'colaborador', 'COMPANY MAN  - APIAY', 1, '2025-08-19 15:08:27'),
(78, 'Aida Faisuly Avila Morales', '1010185219', 'aidaavilam@gmail.com', '1010185219', 'colaborador', 'COMPANY MAN  - APIAY', 1, '2025-08-19 15:08:27'),
(79, 'Sergio Velez Cardona', '86068586', 'servelez80@hotmail.com', '86068586', 'colaborador', 'COMPANY MAN  - APIAY', 1, '2025-08-19 15:08:27'),
(80, 'Gustavo Leon Delgado Zambrano', '98398935', 'gustdelz@hotmail.com', '98398935', 'colaborador', 'COMPANY MAN  - APIAY', 1, '2025-08-19 15:08:27'),
(81, 'Eliana Iveth Alarcon Rondon', '1032446831', 'proyectos6@meridian.com.co', '1032446831', 'colaborador', 'PETROSERVICIOS - ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(82, 'Maria Del Pilar Rodriguez Sanchez', '1122135336', 'pilar.rodriguez23@hotmail.com', '1122135336', 'colaborador', 'COMPANY MAN  - CASTILLA', 0, '2025-08-19 15:08:27'),
(83, 'Camila Fernanda Medina Sandoval', '1100954344', 'camila.medina@meridianecp.com', '1100954344', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(84, 'Anggie Estefania Alonso Ruiz', '1022407009', 'asisdministrativo@meridian.com.co', '1022407009', 'colaborador', 'COMPANY MAN - ADMINISTRACION', 0, '2025-08-19 15:08:27'),
(88, 'Luis Guillermo Mercado Rico', '80100600', 'luis.guillermo.mercado@gmail.com', '$2y$10$bhvPSe6R2Mocdp5athAY9uCR0X4g0mQjtLk6TFJBRXMhabz6Zroqe', 'colaborador', 'COMPANY MAN  - GGS', 1, '2025-08-19 15:08:27'),
(95, 'Angy Yolima Salcedo Amado', '1053611893', 'angysalcedo0810@hotmail.com', '1053611893', 'colaborador', 'COMPANY MAN - GGS', 0, '2025-08-19 15:08:27'),
(97, 'Karen Julieth Carranza Rodriguez', '1000931984', 'analistacontable@meridian.com.co', '$2y$10$fDJA.U9ZFKFyV9S9cpcg1uznh9PP5ULcXYtEM491quaSu20zVKjDa', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(98, 'Aura Maria Traslaviña Prada', '1095786398', 'aura.traslavina@meridianecp.com', '$2y$10$xe2.jKVvJCQhjxKsh5dH..HwnkfaK/Ppz9JdUHmLwKW/VaUgu7gs2', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(99, 'Hector Andres Noguera Bolaños', '87454560', 'andresnoguera111@hotmail.com', '87454560', 'colaborador', 'COMPANY MAN  - APIAY', 1, '2025-08-19 15:08:27'),
(100, 'Alexander Rondon', '86057747', 'alexander.rondon@meridianecp.com', '86057747', 'colaborador', 'COMPANY MAN  - APIAY', 1, '2025-08-19 15:08:27'),
(101, 'Viviana Del Pilar Alfonso Avendaño', '1022344726', 'viviana.alfonsoa@gmail.com', '$2y$10$pX/BgBxNUnZAZZ24sn.2BeweV5rno1wgsn122KC/y20zYzZy5FBKi', 'colaborador', 'ADMINISTRACION - STAFF', 1, '2025-08-19 15:08:27'),
(102, 'Nicolas Urrego Sandoval', '1007407868', 'nicolasurregos@gmail.com', '1007407868', 'colaborador', 'ADMINISTRACION - STAFF', 1, '2025-08-19 15:08:27'),
(103, 'Natalia Ximena Franco Reina', '1000185449', 'nataliaxfranco@gmail.com', '1000185449', 'colaborador', 'ADMINISTRACION - STAFF', 1, '2025-08-19 15:08:27'),
(104, 'Juan David Castro Franco', '1019087239', 'juandafranco3@gmail.com', '1019087239', 'colaborador', 'ADMINISTRACION - STAFF', 1, '2025-08-19 15:08:27'),
(105, 'Christian Camilo Franco Reina', '1013261036', 'christianfranco688@gmail.com', '1013261036', 'colaborador', 'ADMINISTRACION - STAFF', 1, '2025-08-19 15:08:27'),
(106, 'Carlos Antonio Fontalvo Carrascal', '73188189', 'carlosfontalvocarrascal@hotmail.com', '73188189', 'colaborador', 'COMPANY MAN  - APIAY', 1, '2025-08-19 15:08:27'),
(107, 'Blanca Atilia Leiton De Reina', '20312319', 'monica_reina@outlook.com', '20312319', 'colaborador', 'ADMINISTRACION - STAFF', 1, '2025-08-19 15:08:27'),
(108, 'Susana Hernandez Montealegre', '43989939', 'shernan8@hotmail.com', '43989939', 'colaborador', 'COMPANY MAN  - APIAY', 1, '2025-08-19 15:08:27'),
(109, 'Karol Daniela Salcedo Romero', '1024478397', 'karoldanielasr12@gmail.com', '1024478397', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(110, 'Misael Gonzalez Ruiz', '13707063', 'misaelgonzalezruiz76@outlook.com', '13707063', 'colaborador', 'COMPANY MAN - CPO09', 1, '2025-08-19 15:08:27'),
(111, 'Gutemberg Alaine Gomez Rivera', '86042335', 'gutemberg.gomez@yahoo.com', '86042335', 'colaborador', 'COMPANY MAN - CPO09', 1, '2025-08-19 15:08:27'),
(112, 'Karla Jineth Corredor Marin', '1099210462', 'jineth.corredor@hotmail.com', '1099210462', 'colaborador', 'COMPANY MAN  - APIAY', 1, '2025-08-19 15:08:27'),
(113, 'Juan Carlos Saavedra Bohórquez', '1002691928', 'juancho811.js@gmail.com', '1002691928', 'colaborador', 'COMPANY MAN - CPO09', 1, '2025-08-19 15:08:27'),
(114, 'Jose Carlos Baquero Peñaloza', '1065810992', 'josecarlosbaquero1994@gmail.com', '1065810992', 'colaborador', 'COMPANY MAN - CPO09', 1, '2025-08-19 15:08:27'),
(115, 'Javier Eduardo Rojas Prieto', '1013678265', 'javierrojas1214@gmail.com', '1013678265', 'colaborador', 'COMPANY MAN - CPO09', 1, '2025-08-19 15:08:27'),
(116, 'Agustin Jose Roncallo Cervantes', '1082067533', 'roncalloagustin@gmail.com', '$2y$10$UEKiQR3kA95NQwsMPsVQ8Oq0hFhaDiO4/jHBoHQjGeu95bPr5cUaS', 'colaborador', 'COMPANY MAN - CPO09', 1, '2025-08-19 15:08:27'),
(117, 'Jair Enrique Aldana Palma', '80748832', 'jaimark@hotmail.com', '80748832', 'colaborador', 'COMPANY MAN - CPO09', 1, '2025-08-19 15:08:27'),
(119, 'Jose Luis Velez Cardona', '86075700', 'jose.velezcardona@hotmail.com', '86075700', 'colaborador', 'COMPANY MAN - CPO09', 1, '2025-08-19 15:08:27'),
(120, 'Berardo Giraldo Gaitan', '86072643', 'lordberar@hotmail.com', '86072643', 'colaborador', 'COMPANY MAN  - APIAY', 1, '2025-08-19 15:08:27'),
(121, 'Ricardo Gaviria Garcia', '79686130', 'ricardo.gaviria@meridianecp.com', '79686130', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(122, 'German Dario Orejarena Escobar', '91514446', 'german.orejarena@meridianecp.com', '91514446', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(123, 'Gabriel Eduardo Velez Barrera', '1115069820', 'gabriel.velez@meridianecp.com', '1115069820', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(124, 'Diego Fernando Castillo Bayona', '1022380991', 'diego.castillo@meridianecp.com', '1022380991', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(125, 'Yessica Del Carmen Mateus Tarazona', '1098663190', 'yessica.tarazona@meridianecp.com', '1098663190', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(126, 'William Cabrera Castro', '83042295', 'wcabrera@meridianecp.com', '83042295', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(127, 'Sergio Fernando Poveda Salazar', '1007555164', 'sergio.poveda@meridianecp.com', '1007555164', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(128, 'Sebastian Llanos Gallo', '1075284985', 'sebastian.llanos@meridianecp.com', '1075284985', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(129, 'Ruben Dario Ortiz Murcia', '1072699593', 'ruben.ortiz@meridianecp.com', '1072699593', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(130, 'Ricardo Andres Vargas Corredor', '1015449004', 'ricardoanvaco@gmail.com', '1015449004', 'colaborador', 'FRONTERA', 1, '2025-08-19 15:08:27'),
(131, 'Oveimar Santamaria Torres', '80883010', 'oveimar.santamaria@meridianecp.com', '80883010', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(132, 'Nicolas Avendaño Vasquez', '1023961699', 'nicolas.avendano@meridianecp.com', '1023961699', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(133, 'Maria Alejandra Joya Rincon', '1098697791', 'alejandra.joya@meridianecp.com', '1098697791', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(134, 'Maria Alejandra Cabrera Garcia', '1075286382', 'mariaalejandra.cabrera@meridianecp.com', '1075286382', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(135, 'Lucia Maria Acero Lizcano', '37514608', 'lucia.acero@meridianecp.com', '37514608', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(136, 'Lina Maria Rendon Cardona', '31429767', 'lina.rendon@meridianecp.com', '$2y$10$vixvINfNvH5JYD9XCTCbgenZKCvoBlJfrh/zmBnaNcTqdWVFDUVvO', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(137, 'Laura Maria Hernandez Riveros', '1032414423', 'laura.hernandez@meridianecp.com', '1032414423', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(138, 'Lady Milena Lopez Rojas', '1100950373', 'lady.lopez@meridian.com.co', '1100950373', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(139, 'Jully Alexandra Vargas Quintero', '1075286613', 'jully.vargas@meridianecp.com', '1075286613', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(140, 'Juan Sebastian Avila Parra', '1098782789', 'juan.avila@meridianecp.com', '1098782789', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(141, 'Juan David Aristizabal Marulanda', '1026267749', 'juandavid.aristizabal@meridianecp.com', '1026267749', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(142, 'Jose Manuel Garcia Orozco', '10297751', 'josemanuel.garcia@meridianecp.com', '10297751', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(143, 'Jorge Luis Coronado Navarro', '1098610954', 'jorge.coronado@meridianecp.com', '1098610954', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(144, 'Jesus Ernesto Coqueco Vargas', '1075263195', 'jesusccvargas@meridianecp.com', '1075263195', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(145, 'Ina Yadith Serrano Lastre', '63527981', 'ina.serrano@meridianecp.com', '63527981', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(146, 'Gustavo Adolfo Moreno Beltran', '1098739269', 'gustavo.moreno@meridianecp.com', '1098739269', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(147, 'Giovanni Martinez Leones', '1143327261', 'giovanni.martinez@meridianecp.com', '1143327261', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(148, 'Franklin Alejandro Botero Rivera', '1010167959', 'alejandro.botero@meridianecp.com', '1010167959', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(149, 'Esperanza De Jesus Cotes Leon', '40936668', 'esperanza.cotes@meridianecp.com', '40936668', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(150, 'Emeli Yohana Yacelga Chitan', '1010056001', 'emeli.yacelga@meridianecp.com', '1010056001', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(151, 'Edna Miled Niño Orozco', '52844528', 'edna.nino@meridianecp.com', '52844528', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(152, 'Diego Armando Vanegas Araque', '1049619319', 'diego.vanegas@meridianecp.com', '1049619319', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(153, 'Diana Paola Solano Sua', '52967140', 'diana.solano@meridianecp.com', '52967140', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(154, 'Daniela Molina Landinez', '1075293846', 'daniela.molina@meridianecp.com', '1075293846', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(155, 'Cindy Natalia Isaza Toro', '1128452509', 'cindy.isaza@meridianecp.com', '1128452509', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(156, 'Carlos Jose Urzola Ebratt', '1152210959', 'carlos.urzola@meridianecp.com', '$2y$10$nUkvOAGBMx880sw3OiH8SeKtboSL.EfUY0CX5DfnFnZqV0p17Dz9S', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(157, 'Carlos Alejandro Forero Peña', '1014216060', 'carlos.forero@meridianecp.com', '1014216060', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(158, 'Camilo Andres Santana Otalora', '1026292916', 'camilo.santana@meridianecp.com', '1026292916', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(159, 'Blanca Offir Hurtado Lopera', '30400528', 'blanca.hurtado@meridianecp.com', '30400528', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(160, 'Alexandra Isabel Mesa Cardenas', '43728382', 'alexandra.mesa@meridianecp.com', '43728382', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(161, 'Alejandra Arbelaez Londoño', '43578774', 'alejandra.arbelaez@meridianecp.com', '43578774', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(162, 'Adriana Patricia Dueñes Garcés', '63540751', 'adriana.duenes@meridianecp.com', '63540751', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(163, 'Wilman Enrique Alvarez Quiroz', '1098712563', 'wilman.alvarez1@hotmail.com', '1098712563', 'colaborador', 'FRONTERA', 1, '2025-08-19 15:08:27'),
(164, 'Yuber Rodriguez Arturo', '1087047704', 'yuber.rodriguez@meridianecp.com', '1087047704', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(165, 'María Angélica Prada Fonseca', '1014262113', 'angelica.prada@meridianecp.com', '1014262113', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(166, 'Leidy Johanna Bello Arevalo', '1019011177', 'leidy.bello@meridianecp.com', '1019011177', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(167, 'Kelly Lorena Diez Hernandez', '1040746072', 'kelly.diez@meridianecp.com', '1040746072', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(168, 'Juan Mateo Cordoba Wagner', '1151954545', 'juanmateo.cordoba@meridianecp.com', '1151954545', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(169, 'Jose Carlos Garcia Rueda', '1045706790', 'jose.garcia@meridianecp.com', '1045706790', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(170, 'José Andrés Anaya Mancipe', '91524899', 'andres.anaya@meridianecp.com', '91524899', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(171, 'Jhon Abelardo Cuesta Asprilla', '1003934174', 'jhon.cuesta@meridianecp.com', '1003934174', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(172, 'Hernán Albeyro Fula Bohórquez', '1032398017', 'hernan.fula@meridianecp.com', '1032398017', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(173, 'Gustavo Andres Bautista Velandia', '1013633604', 'andres.bautista@meridianecp.com', '1013633604', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(174, 'Estefany Lizeth Velandia Jaimes', '1098745210', 'estefany.velandia@meridianecp.com.co', '1098745210', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(175, 'Emmanuel Robles Albarracin', '1098726424', 'emmanuel.robles@meridianecp.com', '1098726424', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(176, 'Wilmar Andres De La Hoz Gamboa', '1095918218', 'wilmar.delahoz@meridianecp.com', '1095918218', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(177, 'Juan Gabriel Esterlin', '1098622402', 'juan.esterlin@meridianecp.com', '1098622402', 'colaborador', 'COMPANY MAN  - APIAY', 1, '2025-08-19 15:08:27'),
(180, 'Ronald Vasquez Zarate', '79954907', 'nominas@meridian.com.co', '79954907', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(181, 'Daniel Andres Joya Saavedra', '1136888916', 'proyectos2@meridian.com.co', '1136888916', 'colaborador', 'FRONTERA - ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(182, 'Vanessa Torres Pardo', '1013590107', 'vanessatorrespardo@gmail.com', '1013590107', 'colaborador', 'COMPANY MAN  - APIAY', 1, '2025-08-19 15:08:27'),
(183, 'Cristina Caro Velez', '1039448281', 'cristina.caro@meridianecp.com', '1039448281', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(184, 'Oscar Fabian Suarez Suarez', '1098733967', 'oscar.suarez@meridianecp.com', '1098733967', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(185, 'Julio Cesar Figueroa Vega', '13740129', 'julio.figueroa@meridianecp.com', '13740129', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(187, 'Mariann Lissette Mahecha Laverde', '1075212439', 'mariann.mahecha@meridianecp.com', '1075212439', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(188, 'Luisa Fernanda Pachecho Rubio', '1000588440', 'asistentegestionhumana@meridian.com.co', '1000588440', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(189, 'Jorge Eduardo Paiba Alzate', '75101511', 'jorge.paiba@meridianecp.com', '75101511', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(190, 'Carlos Alberto De Jesus Puerta Almeida', '73156643', 'carlospuerta18@hotmail.com', '73156643', 'colaborador', 'COMPANY MAN  - APIAY', 1, '2025-08-19 15:08:27'),
(191, 'Maria Claudia Orozco Cujia', '56078704', 'maria.orozco@meridianecp.com', '56078704', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(192, 'Paola Andrea Gomez Cabrera', '1016037506', 'paola.gomez@meridianecp.com', '1016037506', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(193, 'Olmer Andres Morales Mora', '1075292422', 'andres.morales@meridianecp.com', '1075292422', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(194, 'Nubia Solanlly Reyes Ávila', '52423689', 'nubia.reyes@meridianecp.com', '52423689', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(195, 'Monica Del Pilar Martinez Vera', '53103915', 'monica.martinez@meridianecp.com', '53103915', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(196, 'Milton Julian Gualteros Quiroga', '1098758681', 'milton.gualteros@meridianecp.com', '1098758681', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(197, 'Maria Alejandra Mojica Arciniegas', '1026255124', 'maria.mojica@meridianecp.com', '1026255124', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(198, 'Luis Carlos Monsalve Parra', '1098683077', 'luis.monsalve@meridianecp.com', '1098683077', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(199, 'Lizeth Dayana Bautista Rico', '1095826986', 'lizeth.bautista@meridianecp.com', '1095826986', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(200, 'Julián Andrés Hernández Pinto', '1098706838', 'julian.hernandez@meridianecp.com', '1098706838', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(201, 'Jose Gabriel Nassar Diaz', '1098725794', 'jose.nassar@meridianecp.com', '1098725794', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(202, 'Jhon Harvey Carreño Hernandez', '1098681773', 'jhon.carreno@meridianecp.com', '1098681773', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(203, 'Jesús Iván Pacheco Romero', '1091668362', 'jesus.pacheco@meridianecp.com', '1091668362', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(204, 'Jaime José Martínez Vertel', '1098755426', 'jaime.martinez@meridianecp.com', '1098755426', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(205, 'Ivan Dario Mozo Moreno', '1056709240', 'ivan.mozo@meridianecp.com', '1056709240', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(206, 'Gloria Fernanda Vidal Gonzalez', '51781946', 'gloria.vidal@meridianecp.com', '51781946', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(207, 'Geisson René Zafra Urrea', '1100961505', 'geisson.zafra@meridianecp.com', '1100961505', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(208, 'Diego Fernando Pinto Hernández', '1101692935', 'diego.pinto@meridianecp.com', '1101692935', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(209, 'Diego Fernando Galeano Barrera', '13959717', 'diego.galeano@meridianecp.com', '13959717', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(210, 'David Alejandro Garcia Coronado', '1140847297', 'david.garcia@meridianecp.com', '1140847297', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(211, 'Christian Mauricio Pardo Carranza', '1032467291', 'christian.pardo@meridianecp.com', '1032467291', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(212, 'Christian David Mendoza Ramirez', '1082981742', 'christian.mendoza@meridianecp.com', '1082981742', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(213, 'Cesar Eliecer Rodriguez Camelo', '1065599609', 'cesar.rodriguez@meridianecp.com', '1065599609', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(214, 'Cesar Eduardo Garnica Gomez', '1101693549', 'cesar.garnica@meridianecp.com', '1101693549', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(215, 'Carlos Rafael Olmos Carval', '1047451443', 'carlos.olmos@meridianecp.com', '1047451443', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(216, 'Briggite Susec Camacho Jerez', '1098692205', 'briggite.camacho@meridianecp.com', '1098692205', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(217, 'Ana Maria Castellanos Barreto', '52455261', 'ana.castellanos@meridianecp.com', '52455261', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(218, 'Alejandro Duvan Lopez Rojas', '1121941649', 'alejandro.lopez@meridianecp.com', '$2y$10$hJ4HPeYF3YuVe9p.tusf7uVJG8Ifxy0wpimS/XqpFPFdpUv5lHVfe', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(219, 'Jennyfer Paola Sanchez Pinzon', '1018411794', 'asistentecontable1@meridian.com.co', '1018411794', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(220, 'Vanessa Tangarife Ortiz', '1128270688', 'vanessa.tangarife@gmail.com', '1128270688', 'colaborador', 'COMPANY MAN  - APIAY', 1, '2025-08-19 15:08:27'),
(221, 'Carlos Andres De Los Rios Restrepo', '71382364', 'ingcarlosdelosrios@hotmail.com', '71382364', 'colaborador', 'COMPANY MAN - CPO09', 1, '2025-08-19 15:08:27'),
(222, 'Carlos Espinosa Leon', '1098639151', 'carlos.espinosa@meridianecp.com', '1098639151', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(223, 'Luis Felipe Uribe Parra', '79902734', 'lfu1978@hotmail.com', '79902734', 'colaborador', 'COMPANY MAN  - APIAY', 1, '2025-08-19 15:08:27'),
(224, 'Oscar Fabian Ramirez Jaramillo', '98772810', 'oscar.ramirez@meridianecp.com', '98772810', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(225, 'Miguel Leonardo Martinez Soto', '1022347823', 'lidergh@meridian.com.co', '1022347823', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(226, 'Diana Marcela Cáceres Salinas', '30405867', 'diana.caceres@meridianecp.com', '30405867', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(227, 'Claudia Alejandra Cajicá Trillos', '1098800508', 'claudia.cajica@meridianecp.com', '1098800508', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(228, 'Carolina Leon Vanegas', '52969518', 'carolina.leon@meridianecp.com', '52969518', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(229, 'Diego Alejandro Barreto Hernandez', '1140916030', 'dbarretohernandez13@gmail.com', '$2y$10$5Ngb9r.MwQ1DgYnWvrJcAOveT4oKqZ/9F.VunOP5E3/cbnB2Um3BG', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(230, 'Jully Marcela Ortegon Barrera', '63536247', 'jully.ortegon@meridianecp.com', '63536247', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(231, 'Jorge Armando Pacheco Collazos', '1010174163', 'asistentelogistica@meridian.com.co', '1010174163', 'colaborador', 'ZIRCON', 1, '2025-08-19 15:08:27'),
(232, 'Jessica Alexandra Alava Chavez', '1010222610', 'jessica.a.alava@hotmail.com', '1010222610', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(233, 'Jefferson Julian Sanabria Amaya', '1098631939', 'jeffersanabria@hotmail.com', '1098631939', 'colaborador', 'FRONTERA', 1, '2025-08-19 15:08:27'),
(234, 'Edwin Fabian Mayorga Lopez', '1013634120', 'edwin.mayorga@meridianecp.com', '1013634120', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(235, 'Diego Andrey Lopez Calderon', '1033776515', 'andrey.1995@outlook.es', '$2y$10$XVtLGzawcttQlLziDrKmNOhGKLH.sWv9fMaZcAZRRXTAzGK3.aewq', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(236, 'Carlos Alberto Ruiz Vanegas', '91283664', 'carruizvan@gmail.com', '91283664', 'colaborador', 'COMPANY MAN - APIAY', 1, '2025-08-19 15:08:27'),
(237, 'Diego Mauricio Martinez Bravo', '80243783', 'diego.martinez@meridianecp.com', '80243783', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(238, 'Mario Augusto Moreno Castellanos', '13720871', 'mario.moreno@meridianecp.com', '13720871', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(239, 'Ana Ebelia Gamez Figueredo', '39949703', 'contador@meridian.com.co', '39949703', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(240, 'Juan Sebastian Pinto Velasquez', '1026306000', 'juansebastian.pinto1999@gmail.com', '1026306000', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(241, 'Angie Paola Forero Méndez', '1000514435', 'apfm514@hotmail.com', '1000514435', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(242, 'Luisa Maria Melo Rodríguez', '1018516821', 'luisamrdz22@gmail.com', '1018516821', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(243, 'Luis Fernando Parra Gil', '71420827', 'lfparragil@hotmail.com', '71420827', 'colaborador', 'COMPANY MAN - CPO09', 1, '2025-08-19 15:08:27'),
(244, 'Lady Lorena Vinchery Solano', '1019136436', 'lvinchery@estudiantes.areandina.edu.co', '$2y$10$2U3O3AaQhrOF1t541HnwV.3drDFngSsAiMuG.OI83oC6Ud/B3fO8u', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(245, 'Cristian Andres Murillo', '1033703338', 'andresmurillo163@gmail.com', '1033703338', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(246, 'Darwin Yamid Garzon Rodriguez', '1070750164', 'dgarzon162@gmail.com', '$2y$10$W/AmfzUkvpMKV828grIePO8zN22UlX42uH5psuPiyEcq.WdhARCJO', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(247, 'Candida Patricia Marquez Brun', '1035854640', 'candidapmb@gmail.com', '1035854640', 'colaborador', 'FRONTERA', 1, '2025-08-19 15:08:27'),
(248, 'Jenny Andrea Cipagauta Cardozo', '37949169', 'andrea.cipagauta@meridianecp.com', '37949169', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(249, 'Jesus David Arenas Navarro', '91520047', 'jesus.arenas@meridianecp.com', '91520047', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(250, 'Alexandra Katherine Londoño Camacho', '1098761186', 'alexandra.londoño@meridianecp.com', '1098761186', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(251, 'Jorge Felipe Alarcon Torres', '1020792684', 'jorge.alarcon@meridianecp.com', '1020792684', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(252, 'Juan Esteban Lopez Osorio', '1089599089', 'juan12@hotmail.com', '1089599089', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(253, 'Paola Adriana Gil Chipatecua', '52786386', 'cordinadorproyectos@meridian.com', '$2y$10$IWGHwe1.dUPxlNl1zK0ZgOrfuNYSlnWVSJFsnIr8oLbdsuvrYWvZa', 'colaborador', 'COMPANY MAN - ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(254, 'Yohana Rocio Gomez Vargas', '1024486676', 'contadorjunior@meridian.com.co', '1024486676', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(255, 'Jessica Astrid Mayorga Barrera', '1026301759', 'jessicamayorgabarrera@gmail.com', '1026301759', 'colaborador', 'ADMINISTRACION  COMPANY MAN', 1, '2025-08-19 15:08:27'),
(256, 'Rafael Pinzon Merchan', '93354886', 'rafaelpinzon01@hotmail.com', '$2y$10$8jtdPFIdpiKJwDKAV9umpu8bIml5ugI/r6oLO.UCLZqfC1mgiSN2a', 'colaborador', 'COMPANY MAN - CPO09', 1, '2025-08-19 15:08:27'),
(257, 'Juan Carlos Duran Zapata', '13481943', 'juducaza@hotmail.com', '$2y$10$3/F5F7EuA2XnEjH5q2lFd.jkgRS4Z13UgNUoUbPUpsYyenV1kFcc.', 'colaborador', 'COMPANY MAN - GGS', 1, '2025-08-19 15:08:27'),
(258, 'Jessica Paola Mosquera Lozano', '1075213439', 'jeshika.mosquera@outlook.es', '$2y$10$jkXBJo9HaF6hLSxh7Cv0huzNpaFNZG9p87EJSI4VAsZQ0VDb4n5va', 'colaborador', 'FRONTERA', 1, '2025-08-19 15:08:27'),
(259, 'Maria Del Pilar Gomez Mora', '1075248439', 'mdpgomezm@gmail.com', '$2y$10$pfFZLfHG0p3SVWyWThagP.sHeQ27JYwXWscB/kLX7fIHEb1E35UKK', 'colaborador', 'FRONTERA', 1, '2025-08-19 15:08:27'),
(260, 'Jhonatan Alexander Torres Rodriguez', '1096202008', 'jhonatantorresrdr@gmail.com', '$2y$10$BNQTpTOWfs4XUqge4Y2hueckdz/GEGs13RGvPsfE6M6YqCbv4iZRW', 'colaborador', 'COMPANY MAN', 1, '2025-09-02 14:35:42'),
(261, 'Laura Marcela Arenas Perez', '1098681142', 'lamarcela1289@gmail.com', '$2y$10$WccJNi1psOT1FB9Az9is.Oq7pCKlHW3ZVacxBL/YABhxWyVZ/QzbW', 'colaborador', 'COMPANY MAN', 1, '2025-09-02 14:36:41'),
(262, 'Miguel Ángel Ayala Pinzon', '1101687575', 'ing.ayala19@gmail.com', '$2y$10$lY24FPgTbOKa.6LSYWuV7ekGOTtWFF87Qz5e2F4t14a02xYJGAT9u', 'colaborador', 'COMPANY MAN', 1, '2025-09-02 14:37:06'),
(263, 'Dianis Chavez Campuzano ', '1002465061', '01dianischavez@gmail.com', '$2y$10$qKZXrAj5CN4uByGEp/Q9guMHmDUWV8tCCDvL23v6ojC1ztSu4uULO', 'colaborador', 'COMPANY MAN', 1, '2025-09-02 14:37:34'),
(264, 'Angela Maria Toro Paternina', '1037580568', 'amtorop90@hotmail.com', '$2y$10$aYiRt6Z6ESPsuqhJ39EmWevlqkFheEcBogYWcumB.ZzZ.ApXlLkA.', 'colaborador', 'COMPANY MAN', 1, '2025-09-02 14:38:30'),
(265, 'Laura Vanesa Castro Carmona', '1143388273', 'laucastro212011@gmail.com', '$2y$10$X/lz/ueZG4Tw7ETx.a25aeJnMEp2AgD/sW2Ovtw1hQ7d8n/2ZqZ6W', 'colaborador', 'COMPANY MAN', 1, '2025-09-02 14:38:48'),
(266, 'Ingrid Yiset Sanchez Perez', '1075234956', 'ingridyisetsanchez@outlook.es', '$2y$10$/V/i68Tsdgfm8P.VitQ6Vu.pFPoWNDwR3hfcKYuddfOsbBElBNB0y', 'colaborador', 'COMPANY MAN', 1, '2025-09-02 14:39:08'),
(267, 'Maryluz Santamaria Becerra ', '63501053', 'maryluzsantamaria@hotmail.com', '$2y$10$M201tJmurdcY60eN/H26teuQlzw32BTjRNBZOwU2HuXeGtUQEgGpC', 'colaborador', 'COMPANY MAN', 1, '2025-09-02 14:39:35'),
(268, 'Edgar Mauricio Alvarez Franco ', '88278069', 'genioalv@gmail.com', '88278069', 'colaborador', 'COMPANY MAN', 1, '2025-09-02 14:39:59'),
(269, 'Yojan Gil Gonzales ', '1042212691', 'yojan35@hotmail.com', '$2y$10$q.BFbew66yIKz2j629icuu3ULM9Ap1aOMJ5QKo2gsVPrBrmzBZd9a', 'colaborador', 'COMPANY MAN', 1, '2025-09-02 14:40:21'),
(270, 'Juan Sebastian Valencia Ortega', '1020427784', 'juanseb89@hotmail.com', '1020427784', 'colaborador', 'COMPANY MAN', 1, '2025-09-02 14:40:40'),
(271, 'Perla Melissa Pinzon Agudelo', '1098727333', 'perlameli_92@hotmail.com', '$2y$10$N0VGHqQSuZtRDF2xl04WCupfi7L6r0ofVMDGP6ARSyjrmlYjOuW8C', 'colaborador', 'COMPANY MAN', 1, '2025-09-02 14:40:59'),
(272, 'Andres Mauricio Gonzales Herrera', '1014181943', 'amaogh@gmail.com', '$2y$10$obC.8yeoUgPzESs44Hg3Gef89VfAYCzUcn7escVHQTnZ6zzv1uHpK', 'colaborador', 'COMPANY MAN', 1, '2025-09-02 14:41:19'),
(273, 'Edgar Kellyn Ordoñez', '1022348859', 'ekobogota@hotmail.com', '1022348859', 'colaborador', 'COMPANY MAN', 1, '2025-09-02 14:41:35'),
(274, 'Maira Alejandra Vásquez Correa', '1096245598', 'Aleja.2017@outlook.es', '$2y$10$BHt4u0Q0XJktaYsOTdaKWO.Y70AhXk4IJmLL5DQbf0.in8hEk./1S', 'colaborador', 'COMPANY MAN', 1, '2025-09-02 14:41:54'),
(275, 'Julio Cesar Rodriguez Aparicio', '1101695749', 'cesarjuliocesar1997@gmail.com', '1101695749', 'colaborador', 'COMPANY MAN', 1, '2025-09-02 14:42:10'),
(276, 'Jessica Vanessa Alba Beleño', '1096208135', 'yessica.alba19@gmail.com', '$2y$10$9Czr8owqLEvdmRjjPsOsiOwyOWgPghlPWZiGmU2oFJC7eDd2T9SYS', 'colaborador', 'COMPANY MAN', 1, '2025-09-02 14:42:27'),
(277, 'Jorge Enrique Niño Santos', '1064838225', 'datolo90@hotmail.com', '1064838225', 'colaborador', 'COMPANY MAN', 1, '2025-09-02 14:43:02'),
(288, 'Miguel Angel Riaño Molina', '1015475289', 'miguelmolinave@gmail.com', '1015475289', 'colaborador', 'COMPANY MAN', 1, '2025-09-02 14:49:49'),
(289, 'Alex Jhoan González Mora', '80076686', 'ing.alexgonzalez@hotmail.com', '80076686', 'colaborador', 'COMPANY MAN', 1, '2025-09-02 14:51:22'),
(294, 'Juan Antonio Cubillos Urrea', '79621922', 'juancubillos@hotmail.com', '79621922', 'colaborador', 'COMPANY MAN', 1, '2025-09-02 14:53:06'),
(295, 'Yorguin Daniel Peña Lugo ', '7317575', 'yorguinp@hotmail.com', '$2y$10$PgQkbcUqX7Dq/JSxFCZ8Zuc.Mu0qq2GAAthLcjn9JMrUcGl6G8O/i', 'colaborador', 'COMPANY MAN', 1, '2025-09-02 14:53:51'),
(296, 'Ricardo Jose Correa Cerro ', '9659415', 'ricardocorreacerro@gmail.com', '$2y$10$IP8oCIHaU2fHsJWMuQQTkuUihaOPNcO83/LZQuayhoR4Ebw3cdk7G', 'colaborador', 'COMPANY MAN', 1, '2025-09-02 14:54:15'),
(300, '', '', '', '', '', NULL, 1, '2025-10-23 16:41:00');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=130;

--
-- AUTO_INCREMENT de la tabla `reportes`
--
ALTER TABLE `reportes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=301;

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
