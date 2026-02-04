-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 04-02-2026 a las 13:05:52
-- Versión del servidor: 10.6.24-MariaDB-cll-lve
-- Versión de PHP: 8.3.29

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

--
-- Volcado de datos para la tabla `notificaciones`
--

INSERT INTO `notificaciones` (`id`, `id_reporte`, `destinatario`, `medio`, `enviado_en`) VALUES
(280, 128, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-12 16:33:50'),
(281, 129, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-12 16:41:10'),
(282, 130, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-12 16:42:25'),
(283, 131, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-12 16:43:40'),
(284, 132, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-12 16:44:33'),
(285, 133, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-12 16:45:12'),
(286, 134, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-12 16:45:39'),
(287, 135, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-12 16:46:05'),
(288, 136, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-12 16:46:33'),
(289, 137, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-12 16:47:03'),
(290, 138, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-12 16:47:27'),
(291, 129, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-13 12:33:26'),
(292, 129, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-13 12:33:40'),
(293, 138, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-13 12:33:49'),
(294, 137, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-13 12:34:03'),
(295, 137, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-13 12:34:12'),
(298, 136, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-15 20:03:23'),
(299, 136, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-15 20:03:24'),
(300, 135, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-15 20:03:26'),
(301, 134, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-15 20:03:28'),
(302, 133, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-15 20:03:31'),
(303, 132, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-15 20:03:33'),
(304, 131, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-15 20:03:36'),
(305, 130, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-15 20:03:38'),
(306, 128, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-15 20:03:41'),
(307, 138, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-15 20:04:23'),
(308, 134, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-15 20:04:39'),
(309, 137, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-15 20:04:57'),
(310, 136, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-15 20:05:09'),
(311, 132, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-15 20:05:46'),
(312, 135, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-15 20:05:58'),
(313, 133, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-15 20:06:13'),
(314, 131, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-15 20:06:38'),
(315, 130, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-15 20:06:52'),
(316, 129, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-15 20:07:00'),
(317, 128, 'pedro.cadena@meridianecp.com', 'correo', '2026-01-15 20:07:24'),
(324, 140, 'yorguinp@hotmail.com', 'correo', '2026-01-23 14:29:07'),
(325, 141, 'yorguinp@hotmail.com', 'correo', '2026-01-23 14:39:38'),
(326, 142, 'yorguinp@hotmail.com', 'correo', '2026-01-23 14:44:07'),
(327, 143, 'yorguinp@hotmail.com', 'correo', '2026-01-23 14:47:08'),
(328, 144, 'yorguinp@hotmail.com', 'correo', '2026-01-23 14:51:42'),
(329, 145, 'yorguinp@hotmail.com', 'correo', '2026-01-23 15:00:49'),
(330, 146, 'yorguinp@hotmail.com', 'correo', '2026-01-23 15:04:13'),
(331, 147, 'yorguinp@hotmail.com', 'correo', '2026-01-23 15:06:48'),
(332, 148, 'carlosfontalvocarrascal@hotmail.com', 'correo', '2026-01-23 15:17:34'),
(333, 149, 'carlosfontalvocarrascal@hotmail.com', 'correo', '2026-01-23 15:28:54'),
(334, 150, 'carlosfontalvocarrascal@hotmail.com', 'correo', '2026-01-23 15:35:10'),
(335, 151, 'carlosfontalvocarrascal@hotmail.com', 'correo', '2026-01-23 15:38:15'),
(336, 152, 'carlosfontalvocarrascal@hotmail.com', 'correo', '2026-01-23 15:39:45'),
(337, 153, 'carlosfontalvocarrascal@hotmail.com', 'correo', '2026-01-23 15:42:59'),
(338, 154, 'julio.romero@ecopetrol.com.co', 'correo', '2026-01-26 12:02:18'),
(339, 155, 'julio.romero@ecopetrol.com.co', 'correo', '2026-01-26 12:03:55'),
(340, 156, 'julio.romero@ecopetrol.com.co', 'correo', '2026-01-26 12:06:37'),
(341, 156, 'julio.romero@ecopetrol.com.co', 'correo', '2026-01-30 12:37:12'),
(342, 155, 'julio.romero@ecopetrol.com.co', 'correo', '2026-01-30 12:37:14'),
(343, 154, 'julio.romero@ecopetrol.com.co', 'correo', '2026-01-30 12:37:31'),
(344, 154, 'julio.romero@ecopetrol.com.co', 'correo', '2026-01-30 12:37:32'),
(345, 154, 'julio.romero@ecopetrol.com.co', 'correo', '2026-01-30 12:37:32'),
(346, 153, 'carlosfontalvocarrascal@hotmail.com', 'correo', '2026-01-30 12:37:35'),
(347, 152, 'carlosfontalvocarrascal@hotmail.com', 'correo', '2026-01-30 12:37:38'),
(348, 151, 'carlosfontalvocarrascal@hotmail.com', 'correo', '2026-01-30 12:37:41'),
(349, 150, 'carlosfontalvocarrascal@hotmail.com', 'correo', '2026-01-30 12:37:44'),
(350, 149, 'carlosfontalvocarrascal@hotmail.com', 'correo', '2026-01-30 12:37:53'),
(351, 149, 'carlosfontalvocarrascal@hotmail.com', 'correo', '2026-01-30 12:37:53'),
(352, 148, 'carlosfontalvocarrascal@hotmail.com', 'correo', '2026-01-30 12:38:03'),
(353, 147, 'yorguinp@hotmail.com', 'correo', '2026-01-30 12:38:14'),
(354, 146, 'yorguinp@hotmail.com', 'correo', '2026-01-30 12:38:21'),
(355, 145, 'yorguinp@hotmail.com', 'correo', '2026-01-30 12:38:24'),
(356, 144, 'yorguinp@hotmail.com', 'correo', '2026-01-30 12:38:27'),
(357, 143, 'yorguinp@hotmail.com', 'correo', '2026-01-30 12:38:30'),
(358, 142, 'yorguinp@hotmail.com', 'correo', '2026-01-30 12:38:33'),
(359, 141, 'yorguinp@hotmail.com', 'correo', '2026-01-30 12:38:36'),
(360, 140, 'yorguinp@hotmail.com', 'correo', '2026-01-30 12:38:39'),
(361, 156, 'julio.romero@ecopetrol.com.co', 'correo', '2026-02-03 15:52:51'),
(362, 155, 'julio.romero@ecopetrol.com.co', 'correo', '2026-02-03 15:53:03'),
(363, 151, 'carlosfontalvocarrascal@hotmail.com', 'correo', '2026-02-03 15:53:23'),
(364, 154, 'julio.romero@ecopetrol.com.co', 'correo', '2026-02-03 15:53:37'),
(365, 153, 'carlosfontalvocarrascal@hotmail.com', 'correo', '2026-02-03 15:55:45'),
(366, 152, 'carlosfontalvocarrascal@hotmail.com', 'correo', '2026-02-03 15:56:04'),
(367, 150, 'carlosfontalvocarrascal@hotmail.com', 'correo', '2026-02-03 15:56:28'),
(368, 149, 'carlosfontalvocarrascal@hotmail.com', 'correo', '2026-02-03 15:56:43'),
(369, 148, 'carlosfontalvocarrascal@hotmail.com', 'correo', '2026-02-03 15:57:00'),
(370, 147, 'yorguinp@hotmail.com', 'correo', '2026-02-03 15:57:23'),
(371, 146, 'yorguinp@hotmail.com', 'correo', '2026-02-03 15:58:03'),
(372, 143, 'yorguinp@hotmail.com', 'correo', '2026-02-03 15:58:19'),
(373, 145, 'yorguinp@hotmail.com', 'correo', '2026-02-03 15:58:40'),
(374, 144, 'yorguinp@hotmail.com', 'correo', '2026-02-03 15:58:57'),
(375, 142, 'yorguinp@hotmail.com', 'correo', '2026-02-03 15:59:13'),
(376, 141, 'yorguinp@hotmail.com', 'correo', '2026-02-03 15:59:32'),
(377, 140, 'yorguinp@hotmail.com', 'correo', '2026-02-03 15:59:48');

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
(128, 36, NULL, NULL, 'hallazgos', NULL, 'Áreas Seguras', NULL, '2026-01-02', 'pozos', '', 'accion_mejoramiento', 'Realizó safety tour al finalizar la intervención en PSB1, se solicita limpieza del well pad por parte del aliado CT-Halliburton y se realiza la entrega de pozo dejando locación en buenas condiciones de orden y aseo.', 'Realizo limpieza del well pad por parte del aliado CT-Halliburton.', 'cerrada', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aprobado', 51, 'Caso aprobado por Michael Stiven Ruiz Caro. Motivo: Cargar como Hallazgo', '2026-01-15 13:07:23', '2026-01-12 16:33:49', '2026-01-15 20:07:23'),
(129, 36, NULL, NULL, 'conversaciones', NULL, 'Charlas de seguridad', NULL, '2026-01-03', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'reflexion', 'PSB1', 'pozos', '', 'Realizó Charla de seguridad con personal aliado en locación PSB1. dirige reunión de seguridad con cada una de las empresas aliadas, firma permisos de trabajo (Turno día).  Comparte campaña: “seguridad vial”', 'Charlas de seguridad', 'aprobado', 51, 'Caso aprobado por Michael Stiven Ruiz Caro. Motivo: Cargar como conversación ', '2026-01-15 13:06:59', '2026-01-12 16:41:09', '2026-01-15 20:06:59'),
(130, 36, NULL, NULL, 'conversaciones', NULL, 'Áreas Seguras', NULL, '2026-01-05', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'reflexion', 'FRAP13', 'pozos', '', 'Realizó Charla de seguridad con personal aliado en locación FRAP13. dirige reunión de seguridad con cada una de las empresas aliadas, revisa y divulga análisis de riesgos y firma permisos de trabajo (Turno día).  Comparte campaña: “inicio de operaciones seguras.”', 'Áreas Seguras', 'aprobado', 51, 'Caso aprobado por Michael Stiven Ruiz Caro. Motivo: Cargar como conversación ', '2026-01-15 13:06:50', '2026-01-12 16:42:24', '2026-01-15 20:06:50'),
(131, 36, NULL, NULL, 'hallazgos', NULL, 'Áreas Seguras', NULL, '2026-01-05', 'pozos', '', 'accion_mejoramiento', 'Realizó safety tour al inicio de la intervención en FRAP13, encontrando buenas condiciones de orden y aseo. Verifico el cierre de los hallazgos encontrados en la visita previa (desmonte de DFL, pararrayos y jaula protectora) y recibe locación por parte de operaciones de superficie.', 'Realizo desmonte de DFL, pararrayos y jaula protectora y recibió pozo.', 'cerrada', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aprobado', 51, 'Caso aprobado por Michael Stiven Ruiz Caro. Motivo: Cargar como Hallazgo ', '2026-01-15 13:06:36', '2026-01-12 16:43:39', '2026-01-15 20:06:36'),
(132, 36, NULL, NULL, 'conversaciones', NULL, 'Charlas de seguridad', NULL, '2026-01-06', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'conversacion', 'FRAP13', 'pozos', '', 'Realizó Charla de seguridad con personal aliado en locación FRAP13. dirige reunión de seguridad con cada una de las empresas aliadas. Divulga Alerta HSE: “Golpe en hombro izquierdo a trabajador.”', 'Charlas de seguridad', 'aprobado', 51, 'Caso aprobado por Michael Stiven Ruiz Caro. Motivo: Cargar como conversación ', '2026-01-15 13:05:44', '2026-01-12 16:44:32', '2026-01-15 20:05:44'),
(133, 36, NULL, NULL, 'conversaciones', NULL, 'Charlas de seguridad', NULL, '2026-01-07', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'conversacion', 'FRAP13', 'pozos', '', 'Realizó Charla de seguridad con personal aliado en locación FRAP13. dirige reunión de seguridad con cada una de las empresas aliadas. Divulga Alerta HSE: “Perdida de contención en pozo durante intervención.”', 'Charlas de seguridad', 'aprobado', 51, 'Caso aprobado por Michael Stiven Ruiz Caro. Motivo: Cargar como conversación ', '2026-01-15 13:06:12', '2026-01-12 16:45:10', '2026-01-15 20:06:12'),
(134, 36, NULL, NULL, 'conversaciones', NULL, 'Charlas de seguridad', NULL, '2026-01-08', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'conversacion', 'FRAP13', 'pozos', '', 'Realizó Charla de seguridad con personal aliado en locación FRAP13. dirige reunión de seguridad con cada una de las empresas aliadas. Divulga Alerta HSE: “Exposición a agua caliente durante cargue de agua de producción.”', 'Charlas de seguridad', 'aprobado', 51, 'Caso aprobado por Michael Stiven Ruiz Caro. Motivo: Cargar como conversación ', '2026-01-15 13:04:38', '2026-01-12 16:45:37', '2026-01-15 20:04:38'),
(135, 36, NULL, NULL, 'conversaciones', NULL, 'Charlas de seguridad', NULL, '2026-01-09', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'conversacion', 'FRAP13', 'pozos', '', 'Realizó Charla de seguridad con personal aliado en locación FRAP13. dirige reunión de seguridad con cada una de las empresas aliadas. Divulga Alerta HSE: “Fuego Incipiente de estabilizador de energía en oficina.”', 'Charlas de seguridad', 'aprobado', 51, 'Caso aprobado por Michael Stiven Ruiz Caro. Motivo: Cargar como conversación ', '2026-01-15 13:05:57', '2026-01-12 16:46:04', '2026-01-15 20:05:57'),
(136, 36, NULL, NULL, 'conversaciones', NULL, 'Charlas de seguridad', NULL, '2026-01-10', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'conversacion', 'FRAP13', 'pozos', '', 'Realizó Charla de seguridad con personal aliado en locación FRAP13. dirige reunión de seguridad con cada una de las empresas aliadas. Divulga Alerta HSE: “Ruptura de oreja y grillete durante corrida de Casing.”', 'Charlas de seguridad', 'aprobado', 51, 'Caso aprobado por Michael Stiven Ruiz Caro. Motivo: Cargar como conversación ', '2026-01-15 13:05:07', '2026-01-12 16:46:32', '2026-01-15 20:05:07'),
(137, 36, NULL, NULL, 'conversaciones', NULL, 'Charlas de seguridad', NULL, '2026-01-11', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'conversacion', 'FRAP13', 'pozos', '', 'Realizó Charla de seguridad con personal aliado en locación FRAP13. dirige reunión de seguridad con cada una de las empresas aliadas. Divulga Alerta HSE: “Caída de herramienta en pie de trabajador.”', 'Charlas de seguridad', 'aprobado', 51, 'Caso aprobado por Michael Stiven Ruiz Caro. Motivo: Cargar como conversación ', '2026-01-15 13:04:56', '2026-01-12 16:47:01', '2026-01-15 20:04:56'),
(138, 36, NULL, NULL, 'conversaciones', NULL, 'Charlas de seguridad', NULL, '2026-01-12', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'conversacion', 'FRAP13', 'pozos', '', 'Realizó Charla de seguridad con personal aliado en locación FRAP13. dirige reunión de seguridad con cada una de las empresas aliadas. Divulga Alerta HSE: “Incendio en cobertura vegetal en temporada de verano.”', 'Charlas de seguridad', 'aprobado', 51, 'Caso aprobado por Michael Stiven Ruiz Caro. Motivo: Cargar como conversación ', '2026-01-15 13:04:22', '2026-01-12 16:47:26', '2026-01-15 20:04:22'),
(140, 295, NULL, NULL, 'conversaciones', NULL, 'Divulgación Preoperacional', NULL, '2026-02-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'conversacion', 'Suerte 50/ Rig IND-225', 'pozos', '', 'Con las cuadrillas al entrar a turno se realiza divulgación de las actividades a realizar (pulling sarta en sencillos con overshot) asigno roles y responsabilidad. Divulgo AR y procedimiento aplicable a la actividad', 'Divulgación Preoperacional', 'aprobado', 51, 'Caso aprobado por Michael Stiven Ruiz Caro. Motivo: Cargar como conversación', '2026-02-03 08:59:47', '2026-01-23 14:29:06', '2026-02-03 15:59:47'),
(141, 295, NULL, NULL, 'conversaciones', NULL, 'Divulgación Preoperacional', NULL, '2026-03-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'conversacion', 'Suerte 50/ Rig IND-225', 'pozos', '', 'Con las cuadrillas al entrar a turno, se realiza divulgación de las actividades a realizar (Arme y corrida BHA#1 de calibración y/o corrección de casing)asigno roles y responsabilidad. Divulgo AR y procedimiento aplicable a la actividad.', 'Divulgación Preoperacional', 'aprobado', 51, 'Caso aprobado por Michael Stiven Ruiz Caro. Motivo: Cargar como conversación', '2026-02-03 08:59:31', '2026-01-23 14:39:37', '2026-02-03 15:59:31'),
(142, 295, NULL, NULL, 'conversaciones', NULL, 'Divulgación Preoperacional', NULL, '2026-01-04', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'conversacion', 'Suerte 50/ Rig IND-225', 'pozos', '', 'Con las cuadrillas al entrar a turno, se realiza divulgación de las actividades a realizar (Pulling BHA#1 de calibración)asigno roles y responsabilidades. Divulgo AR y procedimiento aplicable a la actividad.', 'Divulgación Preoperacional', 'aprobado', 51, 'Caso aprobado por Michael Stiven Ruiz Caro. Motivo: Cargar como conversación', '2026-02-03 08:59:12', '2026-01-23 14:44:06', '2026-02-03 15:59:12'),
(143, 295, NULL, NULL, 'conversaciones', NULL, 'Divulgación Preoperacional', NULL, '2026-01-05', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'conversacion', 'Suerte 50/ Rig IND-225', 'pozos', '', 'Con las cuadrillas al entrar a turno, se realiza divulgación de las actividades a realizar (Pulling BHA #2 con setting tool) asigno roles y responsabilidad. Divulgo AR y procedimiento aplicable a la actividad.', 'Divulgación Preoperacional', 'aprobado', 51, 'Caso aprobado por Michael Stiven Ruiz Caro. Motivo: Carga como conversación', '2026-02-03 08:58:18', '2026-01-23 14:47:07', '2026-02-03 15:58:18'),
(144, 295, NULL, NULL, 'conversaciones', NULL, 'Divulgación Preoperacional', NULL, '2026-01-06', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'conversacion', 'Suerte 50/ Rig IND-225', 'pozos', '', 'Con las cuadrillas al entrar a turno, se realiza divulgación de las actividades a realizar (Corrida de registros eléctricos- ultrasónico modo cemento/corrosión) asigno roles y responsabilidad. Divulgo AR y procedimiento aplicable a la actividad.', 'Divulgación Preoperacional', 'aprobado', 51, 'Caso aprobado por Michael Stiven Ruiz Caro. Motivo: Cargar como conversación', '2026-02-03 08:58:56', '2026-01-23 14:51:41', '2026-02-03 15:58:56'),
(145, 295, NULL, NULL, 'conversaciones', NULL, 'Divulgación Preoperacional', NULL, '2026-01-07', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'conversacion', 'Suerte 50/ Rig IND-225', 'pozos', '', 'Con las cuadrillas al entrar a turno, se realiza divulgación de las actividades a realizar (retira/instalación set BOP y mesa rotativa, cambio de cabezal de pozo) asigno roles y responsabilidad. Divulgo AR y procedimiento aplicable a la actividad.', 'Divulgación Preoperacional', 'aprobado', 51, 'Caso aprobado por Michael Stiven Ruiz Caro. Motivo: Cargar como conversación', '2026-02-03 08:58:39', '2026-01-23 15:00:47', '2026-02-03 15:58:39'),
(146, 295, NULL, NULL, 'conversaciones', NULL, 'Divulgación Preoperacional', NULL, '2026-01-08', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'conversacion', 'Suerte 50/ Rig IND-225', 'pozos', '', 'Con las cuadrilla al entrar a turno, se realiza divulgación de las actividades a realizar (Cañoneo csg gun - unidad wireline WTF), asigno roles y responsabilidad. Divulgo AR y procedimiento aplicable a la actividad', 'Divulgación Preoperacional', 'aprobado', 51, 'Caso aprobado por Michael Stiven Ruiz Caro. Motivo: Cargar como conversación ', '2026-02-03 08:58:02', '2026-01-23 15:04:12', '2026-02-03 15:58:02'),
(147, 295, NULL, NULL, 'conversaciones', NULL, 'Divulgación Preoperacional', NULL, '2026-01-09', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'conversacion', 'Suerte 50/ Rig IND-225', 'pozos', '', 'Con las cuadrillas al entrar a turno se realiza divulgación de las actividades a realizar (Arme y corrida de cañones para detonar de manera selectiva asigno roles y responsabilidad. divulgo AR y procedimiento aplicable a la actividad.', 'Divulgación Preoperacional', 'aprobado', 51, 'Caso aprobado por Michael Stiven Ruiz Caro. Motivo: Cargar como conversación ', '2026-02-03 08:57:22', '2026-01-23 15:06:47', '2026-02-03 15:57:22'),
(148, 106, NULL, NULL, 'conversaciones', NULL, 'GOLPE HOMBRO IZQUIERDO TRABAJADOR', NULL, '2026-01-16', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'conversacion', 'Rig Independence 225', 'pozos', '', 'Momento de seguridad HSE, Tema: GOLPE HOMBRO IZQUIERDO TRABAJADOR empresas involucradas: Independence, Meridian/ECOPETROL, identifico peligros de la actividad, reviso procedimientos, estableció controles operativos y HSE, definió roles y responsabilidades, firmo y valido permisos de trabajo y AR, HSE-F-040 SAS #00024', 'GOLPE HOMBRO IZQUIERDO TRABAJADOR', 'aprobado', 51, 'Caso aprobado por Michael Stiven Ruiz Caro. Motivo: Cargar como conversación', '2026-02-03 08:56:59', '2026-01-23 15:17:33', '2026-02-03 15:56:59'),
(149, 106, NULL, NULL, 'conversaciones', NULL, 'Descenso lento no controlado de bloque viajero', NULL, '2026-01-16', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'conversacion', 'Rig Independence 225', 'pozos', '', 'Momento de Seguridad HSE, Tema: Descenso lento no controlado de bloque viajero, Empresas involucradas: Independence, Meridian/ECOPETROL, Identifico peligros de la actividad, reviso procedimientos, estableció controles operativos y HSE, definió roles y responsabilidades, firmó y validó permisos de trabajo y AR, HSE-F-040 SAS #00024.', 'Descenso lento no controlado de bloque viajero', 'aprobado', 51, 'Caso aprobado por Michael Stiven Ruiz Caro. Motivo: Cargar como conversación', '2026-02-03 08:56:42', '2026-01-23 15:28:53', '2026-02-03 15:56:42'),
(150, 106, NULL, NULL, 'conversaciones', NULL, 'Momento de Seguridad HSE, Tema: Perdida de equilibrio al descender porescalera', NULL, '2026-01-18', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'conversacion', 'Rig Independence 225', 'pozos', '', 'Momento de Seguridad HSE, Tema: Perdida de equilibrio al descender por escalera,Empresas involucradas: Independence, Meridian/ECOPETROL, Identifico peligros de laactividad, reviso procedimientos, estableció controles operativos y HSE, definió roles yresponsabilidades, firmó y validó permisos de trabajo y AR, HSE-F-040 SAS #00024.', 'Momento de Seguridad HSE, Tema: Perdida de equilibrio al descender porescalera', 'aprobado', 51, 'Caso aprobado por Michael Stiven Ruiz Caro. Motivo: Cargar como conversación', '2026-02-03 08:56:27', '2026-01-23 15:35:08', '2026-02-03 15:56:27'),
(151, 106, NULL, NULL, 'conversaciones', NULL, 'Momento de Seguridad HSE, Tema: Pérdida de contención en pozo durante intervención (Evento de Well Control)', NULL, '2026-01-20', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'conversacion', 'Rig Independence 225', 'pozos', '', 'Momento de Seguridad HSE, Tema: Pérdida de contención en pozo durante intervención(Evento de Well Control)', 'Momento de Seguridad HSE, Tema: Pérdida de contención en pozo durante intervención (Evento de Well Control)', 'aprobado', 51, 'Caso aprobado por Michael Stiven Ruiz Caro. Motivo: Cargar como conversación', '2026-02-03 08:53:22', '2026-01-23 15:38:14', '2026-02-03 15:53:22'),
(152, 106, NULL, NULL, 'conversaciones', NULL, 'Momento de Seguridad HSE, Tema: Evento: Incidente de Seguridad Vial, Maniobra de reversa para la salida del área de estacionamiento de la Ambulancia', NULL, '2026-01-21', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'conversacion', 'Rig Independence 225', 'pozos', '', 'Momento de Seguridad HSE, Tema: Evento: Incidente de Seguridad Vial, Maniobra de reversa para la salida del área de estacionamiento de la Ambulancia', 'Momento de Seguridad HSE, Tema: Evento: Incidente de Seguridad Vial, Maniobra de reversa para la salida del área de estacionamiento de la Ambulancia', 'aprobado', 51, 'Caso aprobado por Michael Stiven Ruiz Caro. Motivo: Cargar como conversación', '2026-02-03 08:56:02', '2026-01-23 15:39:44', '2026-02-03 15:56:02'),
(153, 106, NULL, NULL, 'conversaciones', NULL, 'Momento de Seguridad HSE, Tema: Evento: Fuego incipiente de estabilizador deenergía en oficina', NULL, '2026-01-22', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'conversacion', 'Rig Independence 225', 'pozos', '', 'Momento de Seguridad HSE, Tema: Evento: Fuego incipiente de estabilizador de energía en oficina', 'Momento de Seguridad HSE, Tema: Evento: Fuego incipiente de estabilizador deenergía en oficina', 'aprobado', 51, 'Caso aprobado por Michael Stiven Ruiz Caro. Motivo: Cargar como conversación ', '2026-02-03 08:55:44', '2026-01-23 15:42:58', '2026-02-03 15:55:44'),
(154, 34, NULL, NULL, 'hallazgos', NULL, 'Hallazgo', NULL, '2026-01-12', 'pozos', '', 'acto_inseguro', 'Se observa camioneta reversando a velocidad inadecuada', 'Se comenta con el conductor y este es consiente del peligro en que incurre ajustando su trabajo', 'cerrada', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aprobado', 51, 'Caso aprobado por Michael Stiven Ruiz Caro. Motivo: Cargar como Hallazgo', '2026-02-03 08:53:36', '2026-01-26 12:02:17', '2026-02-03 15:53:36'),
(155, 34, NULL, NULL, 'hallazgos', NULL, 'Hallazgo', NULL, '2026-01-12', 'pozos', '', 'acto_inseguro', 'Se observa camioneta en vía a pozo a alta velocidad.', 'se comunica con el aliado que la contrató y posteriormente con el conductor dejando claro los limites de velocidad y la conciencia del manejo defensivo', 'cerrada', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aprobado', 51, 'Caso aprobado por Michael Stiven Ruiz Caro. Motivo: Cargar como Hallazgo', '2026-02-03 08:53:01', '2026-01-26 12:03:54', '2026-02-03 15:53:01'),
(156, 34, NULL, NULL, 'hallazgos', NULL, 'Hallazgo', NULL, '2026-01-14', 'pozos', '', 'acto_inseguro', 'Se observa zona de operación delimitada con cinta pero sin los avisos completos faltando el de cable en tensión', 'se comunica con la cuadrilla y reajustan el trabajo colocando el letreo apropiado para la labor', 'cerrada', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aprobado', 51, 'Caso aprobado por Michael Stiven Ruiz Caro. Motivo: Cargar como Hallazgo', '2026-02-03 08:52:42', '2026-01-26 12:06:36', '2026-02-03 15:52:42');

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
(27, 'Camilo Andres Ibañez Rozo', '1115914517', 'ingcamilo.ibanez@gmail.com', '$2y$10$yPi5OfAmrcZjeUHsTpCs7OZAnHB3yutv/TB9IiUAHZo2VbWFXBXm2', 'colaborador', 'COMPANY MAN - GGS', 1, '2025-08-19 14:37:03'),
(28, 'Carlos Saul Celis Acero', '7161987', 'carlos.celis@ecopetrol.com.co', '$2y$10$rsaSsw17TfaUQrV/4ARuBurk6GJfHcyGu.RyGsm2in76d9fuS9Zxi', 'colaborador', 'COMPANY MAN - GGS', 1, '2025-08-19 14:37:03'),
(32, 'Esteban Garcia Rojas', '1077173073', 'esteban.garcia@meridianecp.com', '$2y$10$M5vY900KpNfg4Q.70fUbdeRYjeZMz6NN6Kjfs1ysbydVHU2rI6o0e', 'colaborador', 'COMPANY MAN - GGS', 1, '2025-08-19 14:37:03'),
(34, 'Julio Cesar Romero Arevalo', '88281896', 'julio.romero@ecopetrol.com.co', '$2y$10$k3KNCVBeKMB3ehEto6w8ROYK3Imrf.6EH6xMahW5SulRtt4or40pi', 'colaborador', 'COMPANY MAN - GGS', 1, '2025-08-19 14:37:03'),
(36, 'Pedro Rafael Cadena Ordoñez', '13871188', 'pedro.cadena@meridianecp.com', '$2y$10$ZPaMKNnYt7sJ/lPrmOTYCugzKJES9lSBj39oEDO9ehsJnmJbpiote', 'colaborador', 'COMPANY MAN - GGS', 1, '2025-08-19 14:37:03'),
(37, 'Viani Yorely Ruiz Galindo', '1115914145', 'viani.ruiz@meridianecp.com', '$2y$10$O2tsmrQPuSXT/SSIyFV2y.K4uwn9Yt8/lN8ERJjVjY0V6iIuBXF6y', 'colaborador', 'COMPANY MAN - GGS', 1, '2025-08-19 14:37:03'),
(41, 'José Mateo López Cifuentes', '1011202252', 'desarrolloit@meridian.com.co', '$2y$10$CwKGmnRZdgD4t7CeYEk.XeaCflzUNKT8lukfot9QfvNYj5X2dtAx2', 'admin', 'ADMINISTRACION', 1, '2025-08-19 14:38:10'),
(44, 'Nora Gisell Moreno Moreno', '52030991', 'nmoreno@meridian.com.co', '$2y$10$6iVvGeWc8.4XobGj.UKmI.6/zUunWzsgmXGJRbBMA1wUi9zF2FLVG', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(45, 'William Augusto Franco Castellanos', '79613401', 'wfranco@meridian.com.co', '$2y$10$5xgJRBNML4u4/2chfNEMuutD3dA3Tf5UyxaUriFvxtXxO7iHLuEEO', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(46, 'Cesar Augusto Urrego Avendaño', '79490148', 'currego@meridian.com.co', '$2y$10$ihTdyb7rXNu/4kZ8.aTeQu8jVAEQXvCbokV5OFxdg6ZQcqPPJpHfm', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(47, 'Ruth Muñoz Castillo', '52147279', 'rmunoz@meridian.com.co', '52147279', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(48, 'Zandra Patricia Mayorga Gomez', '52005033', 'coordinadoracontable@meridian.com.co', '52005033', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(49, 'Gustavo Adolfo Giraldo Correa', '1053788938', 'ggiraldo@meridian.com.co', '1053788938', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(50, 'Aura Alejandra Contreras Torres', '1014251428', 'asistenteadministrativo1@meridian.com.co', '$2y$10$r20EARy1UGvl8lwNrDi5Iuf3vW/vB0lqIJQ7THLByJGto./6Pujeu', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(51, 'Michael Stiven Ruiz Caro', '1007493802', 'soportehseqproyectos@meridian.com.co', '$2y$10$nS0jOp46EB6d9T5qNB9Hr.wVxmsjPFbXAqh6i0hQfhbkXs8DxNQhu', 'admin', 'COMPANY MAN - ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(53, 'Luis Miguel Guevara Marles', '1119211830', 'hseq@meridian.com.co', '$2y$10$drtpG6TvrCyM1BL6JEvF9ONjz3IcEcIqmahuR.YktSL5BB5V/bwp.', 'admin', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(54, 'Sandra Milena Florez Prado', '1014180459', 'asistenteadministrativo2@meridian.com.co', '$2y$10$0YmqZO44j55pBJDG7B.i.Ok4IDwVV5Gah9pnt3ZEyWZ/3fbmu/pDO', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(55, 'Eloy Gabriel Gomez Reyes', '1020733194', 'coordinaciongestionhumana@meridian.com.co', '1020733194', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(56, 'Diana Marcela Jacobo Mancera', '1031145571', 'soportehseq@meridian.com.co', '$2y$10$GycAgoorOM/FMtnzdG.PPOWGBaXAzKtYFO3QDbo1j6LNeQFWVJ1qS', 'admin', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(57, 'Laura Daniela Segura Morera', '1121936876', 'profesionalhseq@meridian.com.co', '$2y$10$g3o7koJ5TD5qp6SwRTrHP.a7ILFvKO6kzlaMzoZqtOVupns6hDm7a', 'admin', 'COMPANY MAN - ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(59, 'Andres Camilo Cardenas Reyes', '1007627524', 'soporteit.nivel1@meridian.com.co', '$2y$10$HBrTd8Dn5fydKYtWpIKZk.YEdbcwtjg.zIv4SwmPl9xa4booG5wyS', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(61, 'Wendy Zamanda Fonseca Hurtado', '1026267917', 'zamandafh1988@gmail.com', '1026267917', 'colaborador', 'FRONTERA', 1, '2025-08-19 15:08:27'),
(62, 'Sonia Stephania Fonseca Lopez', '1007647736', 'asistentegestionhumana2@meridian.com.co', '1007647736', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(64, 'Fabryzcio Andres Ortiz Garcia', '1102580512', 'fabryzcioortiz@gmail.com', '1102580512', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(65, 'Eymer Santiago Méndez Herrera', '1031649053', 'santiagom202418@gmail.com', '1031649053', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(81, 'Eliana Iveth Alarcon Rondon', '1032446831', 'proyectos6@meridian.com.co', '$2y$10$aATlzerjoHVHcL.dbCYpZuO46rpuQco1P4Agy6sk0NKrYwgmOdKVq', 'colaborador', 'PETROSERVICIOS - ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(83, 'Camila Fernanda Medina Sandoval', '1100954344', 'camila.medina@meridianecp.com', '1100954344', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(88, 'Luis Guillermo Mercado Rico', '80100600', 'luis.guillermo.mercado@gmail.com', '$2y$10$bhvPSe6R2Mocdp5athAY9uCR0X4g0mQjtLk6TFJBRXMhabz6Zroqe', 'colaborador', 'COMPANY MAN  - GGS', 1, '2025-08-19 15:08:27'),
(95, 'Angy Yolima Salcedo Amado', '1053611893', 'angysalcedo0810@hotmail.com', '1053611893', 'colaborador', 'COMPANY MAN - GGS', 1, '2025-08-19 15:08:27'),
(97, 'Karen Julieth Carranza Rodriguez', '1000931984', 'analistacontable@meridian.com.co', '$2y$10$fDJA.U9ZFKFyV9S9cpcg1uznh9PP5ULcXYtEM491quaSu20zVKjDa', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(98, 'Aura Maria Traslaviña Prada', '1095786398', 'aura.traslavina@meridianecp.com', '$2y$10$xe2.jKVvJCQhjxKsh5dH..HwnkfaK/Ppz9JdUHmLwKW/VaUgu7gs2', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(101, 'Viviana Del Pilar Alfonso Avendaño', '1022344726', 'viviana.alfonsoa@gmail.com', '$2y$10$pX/BgBxNUnZAZZ24sn.2BeweV5rno1wgsn122KC/y20zYzZy5FBKi', 'colaborador', 'ADMINISTRACION - STAFF', 1, '2025-08-19 15:08:27'),
(102, 'Nicolas Urrego Sandoval', '1007407868', 'nicolasurregos@gmail.com', '1007407868', 'colaborador', 'ADMINISTRACION - STAFF', 1, '2025-08-19 15:08:27'),
(103, 'Natalia Ximena Franco Reina', '1000185449', 'nataliaxfranco@gmail.com', '1000185449', 'colaborador', 'ADMINISTRACION - STAFF', 1, '2025-08-19 15:08:27'),
(104, 'Juan David Castro Franco', '1019087239', 'juandafranco3@gmail.com', '1019087239', 'colaborador', 'ADMINISTRACION - STAFF', 1, '2025-08-19 15:08:27'),
(105, 'Christian Camilo Franco Reina', '1013261036', 'christianfranco688@gmail.com', '1013261036', 'colaborador', 'ADMINISTRACION - STAFF', 1, '2025-08-19 15:08:27'),
(106, 'Carlos Antonio Fontalvo Carrascal', '73188189', 'carlosfontalvocarrascal@hotmail.com', '$2y$10$dW7Rshbcrc41ctSU8nrA8e3U6Hu0PBP/rSFVOnG6KhxfpOfzCmaKK', 'colaborador', 'COMPANY MAN - GGS', 1, '2025-08-19 15:08:27'),
(107, 'Blanca Atilia Leiton De Reina', '20312319', 'monica_reina@outlook.com', '20312319', 'colaborador', 'ADMINISTRACION - STAFF', 1, '2025-08-19 15:08:27'),
(109, 'Karol Daniela Salcedo Romero', '1024478397', 'karoldanielasr12@gmail.com', '1024478397', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
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
(180, 'Ronald Vasquez Zarate', '79954907', 'nominas@meridian.com.co', '79954907', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(181, 'Daniel Andres Joya Saavedra', '1136888916', 'proyectos2@meridian.com.co', '1136888916', 'colaborador', 'FRONTERA - ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(183, 'Cristina Caro Velez', '1039448281', 'cristina.caro@meridianecp.com', '1039448281', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(184, 'Oscar Fabian Suarez Suarez', '1098733967', 'oscar.suarez@meridianecp.com', '1098733967', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(185, 'Julio Cesar Figueroa Vega', '13740129', 'julio.figueroa@meridianecp.com', '13740129', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(187, 'Mariann Lissette Mahecha Laverde', '1075212439', 'mariann.mahecha@meridianecp.com', '1075212439', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(188, 'Luisa Fernanda Pachecho Rubio', '1000588440', 'asistentegestionhumana@meridian.com.co', '$2y$10$RfhSycbn.imbXV5mqjWatuyh/uDUUY636E6Wiz7bRz1mu9bMxA7iq', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(189, 'Jorge Eduardo Paiba Alzate', '75101511', 'jorge.paiba@meridianecp.com', '75101511', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
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
(216, 'Briggite Susec Camacho Jerez', '1098692205', 'briggite.camacho@meridianecp.com', '$2y$10$ci4INC/Rf3XZMBv5aS9ggeSttjvD0vXA9jWsLM7M7tzPRs5j4dFiu', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(217, 'Ana Maria Castellanos Barreto', '52455261', 'ana.castellanos@meridianecp.com', '52455261', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(218, 'Alejandro Duvan Lopez Rojas', '1121941649', 'alejandro.lopez@meridianecp.com', '$2y$10$hJ4HPeYF3YuVe9p.tusf7uVJG8Ifxy0wpimS/XqpFPFdpUv5lHVfe', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(219, 'Jennyfer Paola Sanchez Pinzon', '1018411794', 'asistentecontable1@meridian.com.co', '1018411794', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(222, 'Carlos Espinosa Leon', '1098639151', 'carlos.espinosa@meridianecp.com', '1098639151', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(224, 'Oscar Fabian Ramirez Jaramillo', '98772810', 'oscar.ramirez@meridianecp.com', '98772810', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(225, 'Miguel Leonardo Martinez Soto', '1022347823', 'lidergh@meridian.com.co', '1022347823', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(226, 'Diana Marcela Cáceres Salinas', '30405867', 'diana.caceres@meridianecp.com', '30405867', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(227, 'Claudia Alejandra Cajicá Trillos', '1098800508', 'claudia.cajica@meridianecp.com', '$2y$10$hehbpEdiTMGMrjZKSie44ekQ1KXGZbZzT8zWfbzRwfNUZMqaD4Dz.', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(228, 'Carolina Leon Vanegas', '52969518', 'carolina.leon@meridianecp.com', '52969518', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(229, 'Diego Alejandro Barreto Hernandez', '1140916030', 'dbarretohernandez13@gmail.com', '$2y$10$5Ngb9r.MwQ1DgYnWvrJcAOveT4oKqZ/9F.VunOP5E3/cbnB2Um3BG', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(230, 'Jully Marcela Ortegon Barrera', '63536247', 'jully.ortegon@meridianecp.com', '63536247', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(231, 'Jorge Armando Pacheco Collazos', '1010174163', 'asistentelogistica@meridian.com.co', '1010174163', 'colaborador', 'ZIRCON', 1, '2025-08-19 15:08:27'),
(232, 'Jessica Alexandra Alava Chavez', '1010222610', 'jessica.a.alava@hotmail.com', '1010222610', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(233, 'Jefferson Julian Sanabria Amaya', '1098631939', 'jeffersanabria@hotmail.com', '1098631939', 'colaborador', 'FRONTERA', 1, '2025-08-19 15:08:27'),
(234, 'Edwin Fabian Mayorga Lopez', '1013634120', 'edwin.mayorga@meridianecp.com', '1013634120', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(235, 'Diego Andrey Lopez Calderon', '1033776515', 'andrey.1995@outlook.es', '$2y$10$XVtLGzawcttQlLziDrKmNOhGKLH.sWv9fMaZcAZRRXTAzGK3.aewq', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(237, 'Diego Mauricio Martinez Bravo', '80243783', 'diego.martinez@meridianecp.com', '80243783', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(238, 'Mario Augusto Moreno Castellanos', '13720871', 'mario.moreno@meridianecp.com', '13720871', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(239, 'Ana Ebelia Gamez Figueredo', '39949703', 'contador@meridian.com.co', '$2y$10$ilCI5o7VmXZyOoDn9k7T2OrZZ8WvsrkvrNJFNdyrO4fd9xXDQVK0G', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(240, 'Juan Sebastian Pinto Velasquez', '1026306000', 'juansebastian.pinto1999@gmail.com', '1026306000', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(241, 'Angie Paola Forero Méndez', '1000514435', 'apfm514@hotmail.com', '1000514435', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(242, 'Luisa Maria Melo Rodríguez', '1018516821', 'luisamrdz22@gmail.com', '1018516821', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
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
(255, 'Jessica Astrid Mayorga Barrera', '1026301759', 'jessicamayorgabarrera@gmail.com', '$2y$10$LUZZoT5XsH6XFyiiP3pjEuPJfZnGoUS9QtZ6JJrZlniQckSXY3/b2', 'colaborador', 'ADMINISTRACION  COMPANY MAN', 1, '2025-08-19 15:08:27'),
(257, 'Juan Carlos Duran Zapata', '13481943', 'juducaza@hotmail.com', '$2y$10$3/F5F7EuA2XnEjH5q2lFd.jkgRS4Z13UgNUoUbPUpsYyenV1kFcc.', 'colaborador', 'COMPANY MAN - GGS', 1, '2025-08-19 15:08:27'),
(258, 'Jessica Paola Mosquera Lozano', '1075213439', 'jeshika.mosquera@outlook.es', '$2y$10$jkXBJo9HaF6hLSxh7Cv0huzNpaFNZG9p87EJSI4VAsZQ0VDb4n5va', 'colaborador', 'FRONTERA', 1, '2025-08-19 15:08:27'),
(259, 'Maria Del Pilar Gomez Mora', '1075248439', 'mdpgomezm@gmail.com', '$2y$10$pfFZLfHG0p3SVWyWThagP.sHeQ27JYwXWscB/kLX7fIHEb1E35UKK', 'colaborador', 'FRONTERA', 1, '2025-08-19 15:08:27'),
(260, 'Jhonatan Alexander Torres Rodriguez', '1096202008', 'jhonatantorresrdr@gmail.com', '$2y$10$BNQTpTOWfs4XUqge4Y2hueckdz/GEGs13RGvPsfE6M6YqCbv4iZRW', 'colaborador', 'COMPANY MAN GRM', 1, '2025-09-02 14:35:42'),
(261, 'Laura Marcela Arenas Perez', '1098681142', 'lamarcela1289@gmail.com', '$2y$10$WccJNi1psOT1FB9Az9is.Oq7pCKlHW3ZVacxBL/YABhxWyVZ/QzbW', 'colaborador', 'COMPANY MAN GRM', 1, '2025-09-02 14:36:41'),
(262, 'Miguel Ángel Ayala Pinzon', '1101687575', 'ing.ayala19@gmail.com', '$2y$10$lY24FPgTbOKa.6LSYWuV7ekGOTtWFF87Qz5e2F4t14a02xYJGAT9u', 'colaborador', 'COMPANY MAN GRM', 1, '2025-09-02 14:37:06'),
(263, 'Dianis Chavez Campuzano ', '1002465061', '01dianischavez@gmail.com', '$2y$10$qKZXrAj5CN4uByGEp/Q9guMHmDUWV8tCCDvL23v6ojC1ztSu4uULO', 'colaborador', 'COMPANY MAN GRM', 1, '2025-09-02 14:37:34'),
(264, 'Angela Maria Toro Paternina', '1037580568', 'amtorop90@hotmail.com', '$2y$10$aYiRt6Z6ESPsuqhJ39EmWevlqkFheEcBogYWcumB.ZzZ.ApXlLkA.', 'colaborador', 'COMPANY MAN GRM', 1, '2025-09-02 14:38:30'),
(265, 'Laura Vanesa Castro Carmona', '1143388273', 'laucastro212011@gmail.com', '$2y$10$X/lz/ueZG4Tw7ETx.a25aeJnMEp2AgD/sW2Ovtw1hQ7d8n/2ZqZ6W', 'colaborador', 'COMPANY MAN GRM', 1, '2025-09-02 14:38:48'),
(267, 'Maryluz Santamaria Becerra ', '63501053', 'maryluzsantamaria@hotmail.com', '$2y$10$M201tJmurdcY60eN/H26teuQlzw32BTjRNBZOwU2HuXeGtUQEgGpC', 'colaborador', 'COMPANY MAN GRM', 1, '2025-09-02 14:39:35'),
(268, 'Edgar Mauricio Alvarez Franco ', '88278069', 'genioalv@gmail.com', '88278069', 'colaborador', 'COMPANY MAN GRM', 1, '2025-09-02 14:39:59'),
(269, 'Yojan Gil Gonzales ', '1042212691', 'yojan35@hotmail.com', '$2y$10$q.BFbew66yIKz2j629icuu3ULM9Ap1aOMJ5QKo2gsVPrBrmzBZd9a', 'colaborador', 'COMPANY MAN GRM', 1, '2025-09-02 14:40:21'),
(270, 'Juan Sebastian Valencia Ortega', '1020427784', 'juanseb89@hotmail.com', '1020427784', 'colaborador', 'COMPANY MAN GRM', 1, '2025-09-02 14:40:40'),
(271, 'Perla Melissa Pinzon Agudelo', '1098727333', 'perlameli_92@hotmail.com', '$2y$10$N0VGHqQSuZtRDF2xl04WCupfi7L6r0ofVMDGP6ARSyjrmlYjOuW8C', 'colaborador', 'COMPANY MAN GRM', 1, '2025-09-02 14:40:59'),
(272, 'Andres Mauricio Gonzales Herrera', '1014181943', 'amaogh@gmail.com', '$2y$10$obC.8yeoUgPzESs44Hg3Gef89VfAYCzUcn7escVHQTnZ6zzv1uHpK', 'colaborador', 'COMPANY MAN GRM', 1, '2025-09-02 14:41:19'),
(273, 'Edgar Kellyn Ordoñez', '1022348859', 'ekobogota@hotmail.com', '1022348859', 'colaborador', 'COMPANY MAN GRM', 1, '2025-09-02 14:41:35'),
(274, 'Maira Alejandra Vásquez Correa', '1096245598', 'Aleja.2017@outlook.es', '$2y$10$BHt4u0Q0XJktaYsOTdaKWO.Y70AhXk4IJmLL5DQbf0.in8hEk./1S', 'colaborador', 'COMPANY MAN GRM', 1, '2025-09-02 14:41:54'),
(275, 'Julio Cesar Rodriguez Aparicio', '1101695749', 'cesarjuliocesar1997@gmail.com', '1101695749', 'colaborador', 'COMPANY MAN GRM', 1, '2025-09-02 14:42:10'),
(276, 'Jessica Vanessa Alba Beleño', '1096208135', 'yessica.alba19@gmail.com', '$2y$10$9Czr8owqLEvdmRjjPsOsiOwyOWgPghlPWZiGmU2oFJC7eDd2T9SYS', 'colaborador', 'COMPANY MAN GRM', 1, '2025-09-02 14:42:27'),
(277, 'Jorge Enrique Niño Santos', '1064838225', 'datolo90@hotmail.com', '1064838225', 'colaborador', 'COMPANY MAN GRM', 1, '2025-09-02 14:43:02'),
(288, 'Miguel Angel Riaño Molina', '1015475289', 'miguelmolinave@gmail.com', '1015475289', 'colaborador', 'COMPANY MAN GGS', 1, '2025-09-02 14:49:49'),
(289, 'Alex Jhoan González Mora', '80076686', 'ing.alexgonzalez@hotmail.com', '80076686', 'colaborador', 'COMPANY MAN GRM', 1, '2025-09-02 14:51:22'),
(295, 'Yorguin Daniel Peña Lugo ', '7317575', 'yorguinp@hotmail.com', '$2y$10$PgQkbcUqX7Dq/JSxFCZ8Zuc.Mu0qq2GAAthLcjn9JMrUcGl6G8O/i', 'colaborador', 'COMPANY MAN - GGS', 1, '2025-09-02 14:53:51'),
(296, 'Ricardo Jose Correa Cerro ', '18760161', 'ricardocorreacerro@gmail.com', '$2y$10$Q8tsULm13.yHAo6i0PYymuMFyaFb9foJv7m5S/DJbo/unBYk.1Yuu', 'colaborador', 'COMPANY MAN  - GGS', 1, '2025-09-02 14:54:15'),
(302, 'Joshua Mena', '1091966621', 'jomevarss@gmail.com', '$2y$10$mr6JlymOHmZt.rFfq6.0meAkFGxpPWuv5KB5/ZaYQBXIqmIH9s/.i', 'admin', 'Administrativo', 1, '2025-10-24 13:12:51'),
(304, 'Diego Francisco Leal Roncancio ', '86055003', 'diegoflealr@gmail.com', '$2y$10$Stk7AR44swb8ukP1ELMLpus6a2n.iDItWRc5VdS8/JpuC4KK.pFgS', 'colaborador', 'COMPANY MAN - GGS', 0, '2025-12-29 13:04:58');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=378;

--
-- AUTO_INCREMENT de la tabla `reportes`
--
ALTER TABLE `reportes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=157;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=305;

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
