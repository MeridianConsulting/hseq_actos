-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-08-2025 a las 17:22:03
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
(41, 'José Mateo López Cifuentes', '1011202252', 'desarrolloit@meridian.com.co', '$2y$10$CwKGmnRZdgD4t7CeYEk.XeaCflzUNKT8lukfot9QfvNYj5X2dtAx2', 'admin', 'ADMINISTRACION', 1, '2025-08-19 14:38:10'),
(44, 'Nora Gisell Moreno Moreno', '52030991', 'nmoreno@meridian.com.co', '52030991', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(45, 'William Augusto Franco Castellanos', '79613401', 'wfranco@meridian.com.co', '79613401', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(46, 'Cesar Augusto Urrego Avendaño', '79490148', 'currego@meridian.com.co', '79490148', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(47, 'Ruth Muñoz Castillo', '52147279', 'rmunoz@meridian.com.co', '52147279', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(48, 'Zandra Patricia Mayorga Gomez', '52005033', 'coordinadoracontable@meridian.com.co', '52005033', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(49, 'Gustavo Adolfo Giraldo Correa', '1053788938', 'ggiraldo@meridian.com.co', '1053788938', 'colaborador', 'FRONTERA - ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(50, 'Aura Alejandra Contreras Torres', '1014251428', 'asistenteadministrativo1@meridian.com.co', '1014251428', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(51, 'Michael Stiven Ruiz Caro', '1007493802', 'soportehseqproyectos@meridian.com.co', '1007493802', 'soporte', 'COMPANY MAN - ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(52, 'Nidia Carolina Grandas Castañeda', '1136887341', 'proyectos3@meridian.com.co', '1136887341', 'colaborador', 'COMPANY MAN - ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(53, 'Luis Miguel Guevara Marles', '1119211830', 'hseq@meridian.com.co', '1119211830', 'admin', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(54, 'Sandra Milena Florez Prado', '1014180459', 'asistenteadministrativo2@meridian.com.co', '1014180459', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(55, 'Eloy Gabriel Gomez Reyes', '1020733194', 'coordinaciongestionhumana@meridian.com.co', '1020733194', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(56, 'Diana Marcela Jacobo Mancera', '1031145571', 'soportehseq@meridian.com.co', '1031145571', 'soporte', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(57, 'Laura Daniela Segura Morera', '1121936876', 'profesionalhseq@meridian.com.co', '1121936876', 'soporte', 'COMPANY MAN - ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(58, 'Erika Liliana Mancipe Rodriguez', '52978024', 'aprendizhseq@meridian.com.co', '52978024', 'soporte', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(59, 'Andres Camilo Cardenas Reyes', '1007627524', 'soporteit.nivel1@meridian.com.co', '1007627524', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
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
(82, 'Maria Del Pilar Rodriguez Sanchez', '1122135336', 'pilar.rodriguez23@hotmail.com', '1122135336', 'colaborador', 'COMPANY MAN  - CASTILLA', 1, '2025-08-19 15:08:27'),
(83, 'Camila Fernanda Medina Sandoval', '1100954344', 'camila.medina@meridianecp.com', '1100954344', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(84, 'Anggie Estefania Alonso Ruiz', '1022407009', 'asisdministrativo@meridian.com.co', '1022407009', 'colaborador', 'COMPANY MAN - ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(88, 'Luis Guillermo Mercado Rico', '80100600', 'luis.guillermo.mercado@gmail.com', '80100600', 'colaborador', 'COMPANY MAN  - APIAY', 1, '2025-08-19 15:08:27'),
(95, 'Angy Yolima Salcedo Amado', '1053611893', 'angysalcedo0810@hotmail.com', '1053611893', 'colaborador', 'COMPANY MAN - PIEDEMONTE', 1, '2025-08-19 15:08:27'),
(97, 'Karen Julieth Carranza Rodriguez', '1000931984', 'analistacontable@meridian.com.co', '1000931984', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(98, 'Aura Maria Traslaviña Prada', '1095786398', 'aura.traslavina@meridianecp.com', '1095786398', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(99, 'Hector Andres Noguera Bolaños', '87454560', 'andresnoguera111@hotmail.com', '87454560', 'colaborador', 'COMPANY MAN  - APIAY', 1, '2025-08-19 15:08:27'),
(100, 'Alexander Rondon', '86057747', 'alexander.rondon@meridianecp.com', '86057747', 'colaborador', 'COMPANY MAN  - APIAY', 1, '2025-08-19 15:08:27'),
(101, 'Viviana Del Pilar Alfonso Avendaño', '1022344726', 'viviana.alfonsoa@gmail.com', '1022344726', 'colaborador', 'ADMINISTRACION - STAFF', 1, '2025-08-19 15:08:27'),
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
(116, 'Agustin Jose Roncallo Cervantes', '1082067533', 'roncalloagustin@gmail.com', '1082067533', 'colaborador', 'COMPANY MAN - CPO09', 1, '2025-08-19 15:08:27'),
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
(136, 'Lina Maria Rendon Cardona', '31429767', 'lina.rendon@meridianecp.com', '31429767', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
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
(156, 'Carlos Jose Urzola Ebratt', '1152210959', 'carlos.urzola@meridianecp.com', '1152210959', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
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
(218, 'Alejandro Duvan Lopez Rojas', '1121941649', 'alejandro.lopez@meridianecp.com', '1121941649', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
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
(229, 'Diego Alejandro Barreto Hernandez', '1140916030', 'dbarretohernandez13@gmail.com', '1140916030', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(230, 'Jully Marcela Ortegon Barrera', '63536247', 'jully.ortegon@meridianecp.com', '63536247', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(231, 'Jorge Armando Pacheco Collazos', '1010174163', 'asistentelogistica@meridian.com.co', '1010174163', 'colaborador', 'ZIRCON', 1, '2025-08-19 15:08:27'),
(232, 'Jessica Alexandra Alava Chavez', '1010222610', 'jessica.a.alava@hotmail.com', '1010222610', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(233, 'Jefferson Julian Sanabria Amaya', '1098631939', 'jeffersanabria@hotmail.com', '1098631939', 'colaborador', 'FRONTERA', 1, '2025-08-19 15:08:27'),
(234, 'Edwin Fabian Mayorga Lopez', '1013634120', 'edwin.mayorga@meridianecp.com', '1013634120', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(235, 'Diego Andrey Lopez Calderon', '1033776515', 'andrey.1995@outlook.es', '1033776515', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(236, 'Carlos Alberto Ruiz Vanegas', '91283664', 'carruizvan@gmail.com', '91283664', 'colaborador', 'COMPANY MAN - APIAY', 1, '2025-08-19 15:08:27'),
(237, 'Diego Mauricio Martinez Bravo', '80243783', 'diego.martinez@meridianecp.com', '80243783', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(238, 'Mario Augusto Moreno Castellanos', '13720871', 'mario.moreno@meridianecp.com', '13720871', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(239, 'Ana Ebelia Gamez Figueredo', '39949703', 'contador@meridian.com.co', '39949703', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(240, 'Juan Sebastian Pinto Velasquez', '1026306000', 'juansebastian.pinto1999@gmail.com', '1026306000', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(241, 'Angie Paola Forero Méndez', '1000514435', 'apfm514@hotmail.com', '1000514435', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(242, 'Luisa Maria Melo Rodríguez', '1018516821', 'luisamrdz22@gmail.com', '1018516821', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(243, 'Luis Fernando Parra Gil', '71420827', 'lfparragil@hotmail.com', '71420827', 'colaborador', 'COMPANY MAN - CPO09', 1, '2025-08-19 15:08:27'),
(244, 'Lady Lorena Vinchery Solano', '1019136436', 'lvinchery@estudiantes.areandina.edu.co', '1019136436', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(245, 'Cristian Andres Murillo', '1033703338', 'andresmurillo163@gmail.com', '1033703338', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(246, 'Darwin Yamid Garzon Rodriguez', '1070750164', 'dgarzon162@gmail.com', '1070750164', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(247, 'Candida Patricia Marquez Brun', '1035854640', 'candidapmb@gmail.com', '1035854640', 'colaborador', 'FRONTERA', 1, '2025-08-19 15:08:27'),
(248, 'Jenny Andrea Cipagauta Cardozo', '37949169', 'andrea.cipagauta@meridianecp.com', '37949169', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(249, 'Jesus David Arenas Navarro', '91520047', 'jesus.arenas@meridianecp.com', '91520047', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(250, 'Alexandra Katherine Londoño Camacho', '1098761186', 'alexandra.londoño@meridianecp.com', '1098761186', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(251, 'Jorge Felipe Alarcon Torres', '1020792684', 'jorge.alarcon@meridianecp.com', '1020792684', 'colaborador', 'PETROSERVICIOS', 1, '2025-08-19 15:08:27'),
(252, 'Juan Esteban Lopez Osorio', '1089599089', 'juan12@hotmail.com', '1089599089', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(253, 'Paola Adriana Gil Chipatecua', '52786386', 'cordinadorproyectos@meridian.com', '52786386', 'colaborador', 'COMPANY MAN - ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(254, 'Yohana Rocio Gomez Vargas', '1024486676', 'contadorjunior@meridian.com.co', '1024486676', 'colaborador', 'ADMINISTRACION', 1, '2025-08-19 15:08:27'),
(255, 'Jessica Astrid Mayorga Barrera', '1026301759', 'jessicamayorgabarrera@gmail.com', '1026301759', 'colaborador', 'ADMINISTRACION  COMPANY MAN', 1, '2025-08-19 15:08:27'),
(256, 'Rafael Pinzon Merchan', '93354886', 'rafaelpinzon01@hotmail.com', '93354886', 'colaborador', 'COMPANY MAN - CPO09', 1, '2025-08-19 15:08:27'),
(257, 'Juan Carlos Duran Zapata', '13481943', 'juducaza@hotmail.com', '13481943', 'colaborador', 'COMPANY MAN - CPO09', 1, '2025-08-19 15:08:27'),
(258, 'Jessica Paola Mosquera Lozano', '1075213439', 'jeshika.mosquera@outlook.es', '1075213439', 'colaborador', 'FRONTERA', 1, '2025-08-19 15:08:27'),
(259, 'Maria Del Pilar Gomez Mora', '1075248439', 'mdpgomezm@gmail.com', '1075248439', 'colaborador', 'FRONTERA', 1, '2025-08-19 15:08:27');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=260;

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
