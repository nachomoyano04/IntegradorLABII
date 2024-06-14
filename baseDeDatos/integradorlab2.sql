-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 14-06-2024 a las 04:31:40
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `integradorlab2`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `administrador`
--

CREATE TABLE `administrador` (
  `idAdministrador` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `id` int(11) NOT NULL,
  `nombreCategoria` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`id`, `nombreCategoria`) VALUES
(1, 'aparato digestivo'),
(6, 'aparato rectal'),
(3, 'cardiovascular'),
(8, 'categoriaNew'),
(7, 'nueva categoria'),
(2, 'nutriologia'),
(4, 'respiratorio'),
(5, 'sistema nervioso central');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `concentracion`
--

CREATE TABLE `concentracion` (
  `idConcentracion` int(11) NOT NULL,
  `cantidadConcentracion` int(5) NOT NULL,
  `unidadMedidaCon` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `concentracion`
--

INSERT INTO `concentracion` (`idConcentracion`, `cantidadConcentracion`, `unidadMedidaCon`) VALUES
(5, 2, 'mg'),
(4, 5, 'mg'),
(1, 20, 'mg'),
(10, 50, 'mg'),
(13, 123, 'capsulas'),
(11, 200, 'mg'),
(3, 400, 'mg'),
(2, 500, 'mg'),
(6, 850, 'mg'),
(12, 1001, 'ms');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especialidad`
--

CREATE TABLE `especialidad` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `especialidad`
--

INSERT INTO `especialidad` (`id`, `nombre`) VALUES
(1, 'cardiologia'),
(2, 'dermatologia'),
(3, 'endocrinologia'),
(4, 'gastroenterologia'),
(5, 'ginecologia y obstetricia'),
(6, 'infectologia'),
(7, 'hematologia'),
(8, 'oftalmologia'),
(9, 'pediatria'),
(10, 'radiologia'),
(11, 'urologia');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `familia`
--

CREATE TABLE `familia` (
  `id` int(11) NOT NULL,
  `nombreFamilia` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `familia`
--

INSERT INTO `familia` (`id`, `nombreFamilia`) VALUES
(1, 'analgesicos'),
(5, 'antibioticos'),
(4, 'antiemeticos'),
(3, 'antihistaminicos'),
(2, 'antivirales'),
(8, 'familiaNew'),
(6, 'familiera'),
(7, 'nueva familia');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `formafarmaceutica`
--

CREATE TABLE `formafarmaceutica` (
  `idFormaFarmaceutica` int(11) NOT NULL,
  `forma` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `formafarmaceutica`
--

INSERT INTO `formafarmaceutica` (`idFormaFarmaceutica`, `forma`) VALUES
(12, 'aguja'),
(1, 'capsula'),
(8, 'crema'),
(14, 'cuchillo'),
(9, 'gel'),
(6, 'gotas'),
(5, 'inyeccion'),
(7, 'jarabe'),
(13, 'nueva forma'),
(11, 'parche'),
(4, 'pildora'),
(10, 'supositorio'),
(3, 'suspension oral'),
(2, 'tableta');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lado`
--

CREATE TABLE `lado` (
  `idLado` int(11) NOT NULL,
  `nombreLado` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `lado`
--

INSERT INTO `lado` (`idLado`, `nombreLado`) VALUES
(1, 'Izquierdo'),
(2, 'Derecho'),
(3, 'Bilateral'),
(4, 'Central'),
(5, 'Superior'),
(6, 'Inferior'),
(7, 'Anterior'),
(8, 'Posterior'),
(9, 'Distal'),
(10, 'Proximal');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicamento`
--

CREATE TABLE `medicamento` (
  `idMedicamento` int(5) NOT NULL,
  `nombreGenerico` varchar(60) NOT NULL,
  `nombreComercial` varchar(60) DEFAULT NULL,
  `idFamilia` int(11) NOT NULL,
  `idCategoria` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medicamento`
--

INSERT INTO `medicamento` (`idMedicamento`, `nombreGenerico`, `nombreComercial`, `idFamilia`, `idCategoria`) VALUES
(1, 'Fluoxetina', NULL, 1, 1),
(2, 'Ibuprofeno', 'a', 1, 1),
(3, 'Paracetamol', NULL, 1, 3),
(4, 'Amoxicilina', NULL, 1, 4),
(5, 'Omeprazol', NULL, 1, 5),
(6, 'Diazepam', NULL, 2, 1),
(7, 'Lorazepam', NULL, 2, 2),
(8, 'Minoxidil', NULL, 2, 3),
(9, 'Metformina', NULL, 2, 4),
(10, 'Oxicodona', NULL, 2, 5),
(11, 'Tiotropio', NULL, 3, 1),
(12, 'Finasteride', NULL, 3, 2),
(13, 'Salmeterol', NULL, 3, 3),
(14, 'Atenolol', NULL, 3, 4),
(15, 'Esomeprazol', NULL, 3, 5),
(16, 'Amlodipino', NULL, 5, 4),
(17, 'Valsartán', NULL, 4, 2),
(18, 'Atorvastatina', NULL, 4, 3),
(19, 'Sertralina', NULL, 4, 4),
(20, 'Ciprofloxacina', 'cipo', 6, 6),
(21, 'Cefalexina', 'Keflex', 7, 7),
(22, 'Espeliarmus', 'Espe', 8, 8),
(23, 'Generico nuevooo', 'comercialGenerics', 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicamentodetalle`
--

CREATE TABLE `medicamentodetalle` (
  `id` int(11) NOT NULL,
  `idMedicamento` int(11) NOT NULL,
  `idConcentracion` int(11) NOT NULL,
  `idFormaFarmaceutica` int(11) NOT NULL,
  `idPresentacion` int(11) NOT NULL,
  `estado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medicamentodetalle`
--

INSERT INTO `medicamentodetalle` (`id`, `idMedicamento`, `idConcentracion`, `idFormaFarmaceutica`, `idPresentacion`, `estado`) VALUES
(1, 1, 1, 1, 1, 1),
(2, 1, 13, 7, 1, 1),
(3, 1, 1, 1, 4, 1),
(4, 1, 2, 1, 1, 1),
(5, 1, 5, 1, 2, 1),
(6, 1, 5, 5, 1, 1),
(7, 5, 1, 5, 5, 0),
(8, 9, 1, 9, 6, 0),
(9, 3, 2, 2, 2, 0),
(10, 3, 2, 3, 2, 0),
(11, 4, 2, 1, 3, 0),
(12, 4, 2, 4, 3, 0),
(13, 4, 2, 1, 4, 0),
(14, 4, 4, 2, 2, 0),
(15, 2, 2, 2, 2, 0),
(16, 2, 4, 2, 3, 0),
(17, 2, 2, 3, 4, 0),
(18, 2, 2, 2, 3, 0),
(19, 2, 1, 3, 1, 1),
(20, 1, 3, 2, 1, 0),
(21, 1, 1, 3, 1, 0),
(23, 3, 2, 1, 1, 0),
(24, 1, 3, 1, 4, 0),
(25, 1, 5, 5, 6, 1),
(27, 1, 1, 1, 2, 1),
(30, 20, 10, 12, 7, 1),
(31, 21, 11, 13, 8, 1),
(32, 22, 12, 14, 9, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medico`
--

CREATE TABLE `medico` (
  `idMedico` int(5) NOT NULL,
  `nombre` varchar(60) NOT NULL,
  `apellido` varchar(60) NOT NULL,
  `documento` int(12) NOT NULL,
  `idProfesion` int(5) NOT NULL,
  `domicilio` varchar(120) NOT NULL,
  `matricula` varchar(20) NOT NULL,
  `idRefeps` int(20) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `estado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medico`
--

INSERT INTO `medico` (`idMedico`, `nombre`, `apellido`, `documento`, `idProfesion`, `domicilio`, `matricula`, `idRefeps`, `idUsuario`, `estado`) VALUES
(1, 'Juan', 'Andrada', 35421785, 1, 'Lainez 345 Villa Mercedes San Luis', 'MR123', 1001, 2, 1),
(2, 'Matias', 'Perez', 12345678, 6, 'Av Siempre Viva 123 Buenos Aires', '1234', 56789, 3, 0),
(3, 'Maria ', 'Gomez', 87654321, 3, 'Calle falsa 456 Rosario Santa Fe', '5678', 98765, 4, 1),
(4, 'Roberto', 'Martinez', 11223344, 7, 'Av Libertador 789 Cordoba', '9101', 54321, 5, 1),
(5, 'Julieta Elizabeth', ' Poffo Baez', 46260591, 2, 'Calazans 346 Cordoba Cordoba ', '46415441', 459865, 6, 0),
(6, 'Anibal', 'Pachano', 32548992, 8, 'Brasil 23 San Luis ', '2323', 12312, 7, 0),
(7, 'Marga', 'MalAventura', 12344444, 2, 'Lanus 23 Lanus CABA', '1342134', 123123, 8, 0),
(8, 'Axel', 'Sepulveda', 11111111, 8, 'Mitre 32 La Punta San Luis', '9999999999', 9999, 9, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medico_especialidad`
--

CREATE TABLE `medico_especialidad` (
  `id` int(11) NOT NULL,
  `idMedico` int(11) NOT NULL,
  `idEspecialidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medico_especialidad`
--

INSERT INTO `medico_especialidad` (`id`, `idMedico`, `idEspecialidad`) VALUES
(154, 1, 1),
(145, 1, 9),
(146, 1, 9),
(147, 1, 9),
(167, 2, 2),
(168, 2, 10),
(159, 3, 1),
(172, 3, 4),
(160, 3, 11),
(158, 4, 5),
(161, 5, 2),
(162, 6, 2),
(163, 6, 4),
(165, 7, 3),
(166, 7, 5),
(169, 8, 1),
(170, 8, 3),
(171, 8, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `obra_social`
--

CREATE TABLE `obra_social` (
  `idObraSocial` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `obra_social`
--

INSERT INTO `obra_social` (`idObraSocial`, `nombre`) VALUES
(3, 'Medifé'),
(1, 'OSDE'),
(4, 'OSPE'),
(2, 'Swiss Medical');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paciente`
--

CREATE TABLE `paciente` (
  `idPaciente` int(5) NOT NULL,
  `nombre` varchar(60) NOT NULL,
  `apellido` varchar(60) NOT NULL,
  `documento` int(10) NOT NULL,
  `fechaNacimiento` date NOT NULL,
  `sexo` varchar(30) NOT NULL,
  `estado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `paciente`
--

INSERT INTO `paciente` (`idPaciente`, `nombre`, `apellido`, `documento`, `fechaNacimiento`, `sexo`, `estado`) VALUES
(1, 'Maria', 'Celeste', 23543532, '1967-01-20', 'femenino', 1),
(2, 'Juan', 'Quiroga', 12345719, '1995-04-20', 'desconocido', 1),
(3, 'Ignacio', 'Moyano Guzman', 44480381, '2002-11-19', 'desconocido', 1),
(4, 'Maria', 'Antonieta de las Nieves', 11111111, '1920-01-01', 'desconocido', 1),
(5, 'Sebastian', 'Moyano', 26322097, '1978-10-31', 'masculino', 1),
(6, 'Nuevo paciente', 'paciente Nuevo', 12345698, '2002-03-12', 'desconocido', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paciente_plan`
--

CREATE TABLE `paciente_plan` (
  `id` int(11) NOT NULL,
  `idPaciente` int(11) NOT NULL,
  `idPlan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `paciente_plan`
--

INSERT INTO `paciente_plan` (`id`, `idPaciente`, `idPlan`) VALUES
(35, 1, 2),
(34, 2, 2),
(36, 3, 2),
(39, 3, 6),
(37, 4, 7),
(38, 5, 1),
(40, 6, 1),
(41, 6, 4),
(42, 6, 9),
(43, 6, 11);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `plan`
--

CREATE TABLE `plan` (
  `idPlan` int(11) NOT NULL,
  `tipo` varchar(100) NOT NULL,
  `descripcion` varchar(500) NOT NULL,
  `idObraSocial` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `plan`
--

INSERT INTO `plan` (`idPlan`, `tipo`, `descripcion`, `idObraSocial`) VALUES
(1, 'Plan 210', 'Plan básico con cobertura en consultas médicas, estudios de diagnóstico, tratamientos, internaciones, y medicamentos. Incluye cobertura odontológica y oftalmológica.', 1),
(2, 'Plan 310', 'Cobertura intermedia con mayor acceso a prestadores y mejores beneficios en consultas, internaciones, y medicamentos. Incluye terapias de rehabilitación y prestaciones adicionales en salud mental.', 1),
(3, 'Plan 410', 'Plan premium con la más amplia red de prestadores y cobertura en todas las especialidades. Incluye asistencia al viajero internacional y mayores descuentos en medicamentos.', 1),
(4, 'SMG 20', 'Plan básico con cobertura en consultas médicas, estudios de diagnóstico, internaciones y medicamentos. Incluye cobertura en odontología básica y oftalmología.', 2),
(5, 'SMG 40', 'Cobertura intermedia con acceso a una mayor red de prestadores y beneficios adicionales en internaciones y tratamientos especiales. Incluye servicios de emergencias y traslados.', 2),
(6, 'SMG 50', 'Plan premium con cobertura completa en todas las especialidades, servicios de urgencias y emergencias, y asistencia al viajero. Incluye cobertura en cirugía estética y tratamientos de fertilidad.', 2),
(7, 'Plan Bronce', 'Plan básico con cobertura en consultas, estudios, internaciones y medicamentos. Incluye consultas médicas generales y especializadas, y servicios de emergencia.', 3),
(8, 'Plan Plata', 'Cobertura intermedia con mayor acceso a prestadores y beneficios adicionales en tratamientos y medicamentos. Incluye servicios odontológicos y oftalmológicos avanzados.', 3),
(9, 'Plan Oro', 'Plan premium con la más amplia cobertura en todas las especialidades, incluyendo cirugía, internación, y tratamientos de alta complejidad. Incluye asistencia al viajero y cobertura internacional.', 3),
(10, 'Plan Básico', 'Cobertura en consultas médicas generales y especializadas, estudios de diagnóstico y tratamientos. Incluye servicios de internación y medicamentos con descuentos.', 4),
(11, 'Plan Integral', 'Mayor cobertura en consultas y tratamientos, con acceso a una red más amplia de prestadores. Incluye servicios de rehabilitación y tratamientos especiales.', 4),
(12, 'Plan Premium', 'Cobertura completa en todas las especialidades, incluyendo internaciones, cirugías y tratamientos de alta complejidad. Incluye beneficios adicionales en odontología y oftalmología.', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prescripcion`
--

CREATE TABLE `prescripcion` (
  `idPrescripcion` int(5) NOT NULL,
  `diagnostico` varchar(100) NOT NULL,
  `fecha` date NOT NULL,
  `vigencia` date NOT NULL,
  `idMedico` int(5) NOT NULL,
  `idPaciente` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `prescripcion`
--

INSERT INTO `prescripcion` (`idPrescripcion`, `diagnostico`, `fecha`, `vigencia`, `idMedico`, `idPaciente`) VALUES
(1, 'Diabetes tipo 2', '2024-06-13', '2024-07-13', 1, 1),
(2, 'Otra prescripcion para la paciente maria celeste', '2024-06-13', '2024-08-12', 1, 1),
(3, 'Parece que hay que cambiarle la rodilla', '2024-06-13', '2024-08-12', 1, 4),
(4, 'Nueva prescripcion de prueba', '2024-06-13', '2024-08-12', 3, 3),
(5, 'Nueva prestacion para maria', '2024-06-13', '2024-08-12', 1, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prescripcion_medicamentodetalle`
--

CREATE TABLE `prescripcion_medicamentodetalle` (
  `id` int(11) NOT NULL,
  `idPrescripcion` int(11) NOT NULL,
  `idMedicamentoDetalle` int(11) NOT NULL,
  `dosis` varchar(100) NOT NULL,
  `duracion` varchar(10) NOT NULL,
  `intervalo` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `prescripcion_medicamentodetalle`
--

INSERT INTO `prescripcion_medicamentodetalle` (`id`, `idPrescripcion`, `idMedicamentoDetalle`, `dosis`, `duracion`, `intervalo`) VALUES
(1, 1, 1, '5 pastillas', '7 dias', 12),
(2, 2, 4, '2', '2', 2),
(3, 2, 31, '13', '13', 13),
(4, 3, 4, '1', '1', 1),
(5, 4, 1, '1', '1', 1),
(6, 4, 19, '2', '2', 2),
(7, 5, 1, '1', '3', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prescripcion_prestacion`
--

CREATE TABLE `prescripcion_prestacion` (
  `id` int(11) NOT NULL,
  `idPrescripcion` int(11) NOT NULL,
  `idPrestacion` int(11) NOT NULL,
  `resultadoPrestacion` varchar(600) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `prescripcion_prestacion`
--

INSERT INTO `prescripcion_prestacion` (`id`, `idPrescripcion`, `idPrestacion`, `resultadoPrestacion`) VALUES
(1, 1, 1, 'salio todo bien'),
(2, 2, 6, 'de 10 la colonoscopia'),
(3, 3, 3, 'al final salio todo perfecto y no paso a mas'),
(4, 4, 1, NULL),
(5, 5, 3, NULL),
(6, 5, 1, NULL),
(7, 5, 2, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `presentacion`
--

CREATE TABLE `presentacion` (
  `idPresentacion` int(11) NOT NULL,
  `cantidadPresentacion` int(5) NOT NULL,
  `unidadMedidaPres` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `presentacion`
--

INSERT INTO `presentacion` (`idPresentacion`, `cantidadPresentacion`, `unidadMedidaPres`) VALUES
(1, 14, 'unidades'),
(2, 20, 'unidades'),
(8, 21, 'unidades'),
(5, 25, 'unidades'),
(4, 30, 'unidades'),
(6, 60, 'unidades'),
(7, 100, 'capsulas'),
(3, 100, 'ml'),
(9, 1441, 'unitys');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prestacion`
--

CREATE TABLE `prestacion` (
  `idPrestacion` int(5) NOT NULL,
  `nombrePrestacion` varchar(60) NOT NULL,
  `indicacion` varchar(200) NOT NULL,
  `justificacion` varchar(200) NOT NULL,
  `estado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `prestacion`
--

INSERT INTO `prestacion` (`idPrestacion`, `nombrePrestacion`, `indicacion`, `justificacion`, `estado`) VALUES
(1, 'Radiografía de Tórax', 'Evaluación de infección pulmonar', 'Paciente presenta tos persistente y fiebre alta', 1),
(2, ' Ecografía Abdominal', 'Dolor abdominal en hipocondrio derecho', 'Sospecha de colelitiasis', 1),
(3, 'Resonancia Magnética de Rodilla', 'Dolor y limitación de movimiento', 'Sospecha de desgarro de menisco', 1),
(4, 'Electrocardiograma (ECG)', 'Dolor torácico', 'Evaluación de posible infarto de miocardio', 0),
(5, 'Examen de Sangre', 'Fatiga y palidez', 'Sospecha de anemia', 0),
(6, 'Colonoscopia', 'indicacion colonoscopia', 'justificacion colonoscopia', 1),
(7, 'Mamografía', 'Dolor mamario y nódulo palpable', 'Detección temprana de cáncer de mama', 0),
(8, 'Prueba de Función Pulmonar', 'Disnea de esfuerzo', 'Evaluación de enfermedad pulmonar obstructiva crónica (EPOC)', 0),
(9, 'Prestacion sin lados', 'Indicacion de prestacion sin lados', 'Justificacion de prestacion sin lados', 0),
(10, 'Prestacion con lados', 'Indicacion prestacion con lados', 'Justificacion prestacion con lados', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prestacion_lado`
--

CREATE TABLE `prestacion_lado` (
  `idPrestacionLado` int(11) NOT NULL,
  `idPrestacion` int(11) NOT NULL,
  `idLado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `prestacion_lado`
--

INSERT INTO `prestacion_lado` (`idPrestacionLado`, `idPrestacion`, `idLado`) VALUES
(31, 2, 1),
(28, 3, 1),
(27, 6, 1),
(23, 10, 1),
(22, 1, 2),
(8, 2, 2),
(24, 10, 2),
(32, 2, 3),
(6, 1, 9),
(29, 3, 9),
(30, 3, 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesion`
--

CREATE TABLE `profesion` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `profesion`
--

INSERT INTO `profesion` (`id`, `nombre`) VALUES
(3, 'cirujano'),
(4, 'docente'),
(2, 'especialista'),
(5, 'forense'),
(1, 'general '),
(8, 'investigador'),
(7, 'salud publica'),
(6, 'urgencias');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `id` int(11) NOT NULL,
  `nombreRol` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`id`, `nombreRol`) VALUES
(1, 'administrador'),
(2, 'profesional');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `idUsuario` int(11) NOT NULL,
  `nombreUsuario` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`idUsuario`, `nombreUsuario`, `password`) VALUES
(1, 'admin', '$2b$08$EdfvjQqkiDRpkFGZZs07j.O8kiyLkyKrRrKG0Jb/5Vme/FDuklcHi'),
(2, 'juan', '$2b$08$.9Ud56Apsf1iI.2CspO8Q..Iv8g0pP3wJ7l8El62MMhfWCL3oRiO6'),
(3, '12345678', '$2b$08$jCyu5vdy8L2HBCXHVvb53Oz/RPtTnSO3T5rlsrgIrLA/NCTPxTXC.'),
(4, '87654321', '$2b$08$RdTr78ru4hbKalh2Ge.nMuEJthXvj4.q0n/w3KxFFPh9E1C5FAITS'),
(5, '11223344', '$2b$08$uOaMOLd1QugW0Y0iKzmdAuIFlxdJ4FS0N6Kp9YQ4KU2GQnLyPFbhe'),
(6, '46260591', '$2b$08$NQCG.ZnmcQg98jc8/EZw.Od0.8IL3ghoPjtZiOZcZiPh41M80FYkW'),
(7, '32548992', '$2b$08$WBOeYufm6HyUAgyKj/IDS.cyz65WlzIxTGERYBqybD0NpTKRxtfjO'),
(8, '12344444', '$2b$08$IaI.v8n8VzLjuGZ17Gpd5OHEELm2FHPRHU6wdD.ysRXPGp.b7YmYy'),
(9, '11111111', '$2b$08$d2kW4nKkJjdE.TjQiKh/B.ckCnsARvmFXFa0qh3KlVdqUaxQV1nAi');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_rol`
--

CREATE TABLE `usuario_rol` (
  `id` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `idRol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario_rol`
--

INSERT INTO `usuario_rol` (`id`, `idUsuario`, `idRol`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 2, 2),
(4, 3, 2),
(5, 4, 2),
(6, 5, 2),
(7, 6, 2),
(8, 7, 2),
(9, 8, 2),
(10, 9, 2);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `administrador`
--
ALTER TABLE `administrador`
  ADD PRIMARY KEY (`idAdministrador`),
  ADD KEY `idUsuario` (`idUsuario`);

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombreCategoria` (`nombreCategoria`);

--
-- Indices de la tabla `concentracion`
--
ALTER TABLE `concentracion`
  ADD PRIMARY KEY (`idConcentracion`),
  ADD UNIQUE KEY `cantidad` (`cantidadConcentracion`,`unidadMedidaCon`),
  ADD UNIQUE KEY `cantidad_2` (`cantidadConcentracion`,`unidadMedidaCon`),
  ADD UNIQUE KEY `cantidad_3` (`cantidadConcentracion`,`unidadMedidaCon`);

--
-- Indices de la tabla `especialidad`
--
ALTER TABLE `especialidad`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `familia`
--
ALTER TABLE `familia`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombreFamilia` (`nombreFamilia`);

--
-- Indices de la tabla `formafarmaceutica`
--
ALTER TABLE `formafarmaceutica`
  ADD PRIMARY KEY (`idFormaFarmaceutica`),
  ADD UNIQUE KEY `forma` (`forma`),
  ADD UNIQUE KEY `forma_2` (`forma`);

--
-- Indices de la tabla `lado`
--
ALTER TABLE `lado`
  ADD PRIMARY KEY (`idLado`);

--
-- Indices de la tabla `medicamento`
--
ALTER TABLE `medicamento`
  ADD PRIMARY KEY (`idMedicamento`),
  ADD UNIQUE KEY `nombreGenerico` (`nombreGenerico`),
  ADD KEY `idCategoria` (`idCategoria`),
  ADD KEY `idFamilia` (`idFamilia`);

--
-- Indices de la tabla `medicamentodetalle`
--
ALTER TABLE `medicamentodetalle`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_medicamento_detalle` (`idMedicamento`,`idConcentracion`,`idFormaFarmaceutica`,`idPresentacion`),
  ADD KEY `idMedicamento` (`idMedicamento`),
  ADD KEY `idConcentracion` (`idConcentracion`),
  ADD KEY `idFormaFarmaceutica` (`idFormaFarmaceutica`),
  ADD KEY `idPresentacion` (`idPresentacion`);

--
-- Indices de la tabla `medico`
--
ALTER TABLE `medico`
  ADD PRIMARY KEY (`idMedico`),
  ADD UNIQUE KEY `idRefeps` (`idRefeps`),
  ADD UNIQUE KEY `documento` (`documento`,`matricula`),
  ADD KEY `profesion` (`idProfesion`),
  ADD KEY `idUsuario` (`idUsuario`);

--
-- Indices de la tabla `medico_especialidad`
--
ALTER TABLE `medico_especialidad`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idMedico` (`idMedico`,`idEspecialidad`),
  ADD KEY `idEspecialidad` (`idEspecialidad`);

--
-- Indices de la tabla `obra_social`
--
ALTER TABLE `obra_social`
  ADD PRIMARY KEY (`idObraSocial`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `paciente`
--
ALTER TABLE `paciente`
  ADD PRIMARY KEY (`idPaciente`),
  ADD UNIQUE KEY `documento` (`documento`);

--
-- Indices de la tabla `paciente_plan`
--
ALTER TABLE `paciente_plan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idPaciente` (`idPaciente`,`idPlan`),
  ADD KEY `idPlan` (`idPlan`);

--
-- Indices de la tabla `plan`
--
ALTER TABLE `plan`
  ADD PRIMARY KEY (`idPlan`),
  ADD UNIQUE KEY `tipo` (`tipo`),
  ADD KEY `idObraSocial` (`idObraSocial`);

--
-- Indices de la tabla `prescripcion`
--
ALTER TABLE `prescripcion`
  ADD PRIMARY KEY (`idPrescripcion`),
  ADD KEY `idMedico` (`idMedico`),
  ADD KEY `idMedico_2` (`idMedico`,`idPaciente`),
  ADD KEY `idPaciente` (`idPaciente`);

--
-- Indices de la tabla `prescripcion_medicamentodetalle`
--
ALTER TABLE `prescripcion_medicamentodetalle`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idPrescripcion` (`idPrescripcion`,`idMedicamentoDetalle`),
  ADD KEY `idMedicamentoDetalle` (`idMedicamentoDetalle`);

--
-- Indices de la tabla `prescripcion_prestacion`
--
ALTER TABLE `prescripcion_prestacion`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idPrescripcion` (`idPrescripcion`,`idPrestacion`),
  ADD KEY `idPrestacion` (`idPrestacion`);

--
-- Indices de la tabla `presentacion`
--
ALTER TABLE `presentacion`
  ADD PRIMARY KEY (`idPresentacion`),
  ADD UNIQUE KEY `cantidad` (`cantidadPresentacion`,`unidadMedidaPres`);

--
-- Indices de la tabla `prestacion`
--
ALTER TABLE `prestacion`
  ADD PRIMARY KEY (`idPrestacion`);

--
-- Indices de la tabla `prestacion_lado`
--
ALTER TABLE `prestacion_lado`
  ADD PRIMARY KEY (`idPrestacionLado`),
  ADD UNIQUE KEY `unique_prestacion_lado` (`idLado`,`idPrestacion`),
  ADD KEY `idPrestacion` (`idPrestacion`,`idLado`);

--
-- Indices de la tabla `profesion`
--
ALTER TABLE `profesion`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`idUsuario`);

--
-- Indices de la tabla `usuario_rol`
--
ALTER TABLE `usuario_rol`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idUsuario` (`idUsuario`,`idRol`),
  ADD KEY `idRol` (`idRol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `administrador`
--
ALTER TABLE `administrador`
  MODIFY `idAdministrador` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `concentracion`
--
ALTER TABLE `concentracion`
  MODIFY `idConcentracion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `especialidad`
--
ALTER TABLE `especialidad`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `familia`
--
ALTER TABLE `familia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `formafarmaceutica`
--
ALTER TABLE `formafarmaceutica`
  MODIFY `idFormaFarmaceutica` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `lado`
--
ALTER TABLE `lado`
  MODIFY `idLado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `medicamento`
--
ALTER TABLE `medicamento`
  MODIFY `idMedicamento` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `medicamentodetalle`
--
ALTER TABLE `medicamentodetalle`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de la tabla `medico`
--
ALTER TABLE `medico`
  MODIFY `idMedico` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `medico_especialidad`
--
ALTER TABLE `medico_especialidad`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=173;

--
-- AUTO_INCREMENT de la tabla `obra_social`
--
ALTER TABLE `obra_social`
  MODIFY `idObraSocial` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `paciente`
--
ALTER TABLE `paciente`
  MODIFY `idPaciente` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `paciente_plan`
--
ALTER TABLE `paciente_plan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT de la tabla `plan`
--
ALTER TABLE `plan`
  MODIFY `idPlan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `prescripcion`
--
ALTER TABLE `prescripcion`
  MODIFY `idPrescripcion` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `prescripcion_medicamentodetalle`
--
ALTER TABLE `prescripcion_medicamentodetalle`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `prescripcion_prestacion`
--
ALTER TABLE `prescripcion_prestacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `presentacion`
--
ALTER TABLE `presentacion`
  MODIFY `idPresentacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `prestacion`
--
ALTER TABLE `prestacion`
  MODIFY `idPrestacion` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `prestacion_lado`
--
ALTER TABLE `prestacion_lado`
  MODIFY `idPrestacionLado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de la tabla `profesion`
--
ALTER TABLE `profesion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `idUsuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `usuario_rol`
--
ALTER TABLE `usuario_rol`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `administrador`
--
ALTER TABLE `administrador`
  ADD CONSTRAINT `administrador_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`);

--
-- Filtros para la tabla `medicamento`
--
ALTER TABLE `medicamento`
  ADD CONSTRAINT `medicamento_ibfk_1` FOREIGN KEY (`idCategoria`) REFERENCES `categoria` (`id`),
  ADD CONSTRAINT `medicamento_ibfk_2` FOREIGN KEY (`idFamilia`) REFERENCES `familia` (`id`);

--
-- Filtros para la tabla `medicamentodetalle`
--
ALTER TABLE `medicamentodetalle`
  ADD CONSTRAINT `medicamentodetalle_ibfk_1` FOREIGN KEY (`idMedicamento`) REFERENCES `medicamento` (`idMedicamento`),
  ADD CONSTRAINT `medicamentodetalle_ibfk_2` FOREIGN KEY (`idConcentracion`) REFERENCES `concentracion` (`idConcentracion`),
  ADD CONSTRAINT `medicamentodetalle_ibfk_3` FOREIGN KEY (`idFormaFarmaceutica`) REFERENCES `formafarmaceutica` (`idFormaFarmaceutica`),
  ADD CONSTRAINT `medicamentodetalle_ibfk_4` FOREIGN KEY (`idPresentacion`) REFERENCES `presentacion` (`idPresentacion`);

--
-- Filtros para la tabla `medico`
--
ALTER TABLE `medico`
  ADD CONSTRAINT `medico_ibfk_1` FOREIGN KEY (`idProfesion`) REFERENCES `profesion` (`id`),
  ADD CONSTRAINT `medico_ibfk_3` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`);

--
-- Filtros para la tabla `medico_especialidad`
--
ALTER TABLE `medico_especialidad`
  ADD CONSTRAINT `medico_especialidad_ibfk_1` FOREIGN KEY (`idMedico`) REFERENCES `medico` (`idMedico`),
  ADD CONSTRAINT `medico_especialidad_ibfk_2` FOREIGN KEY (`idEspecialidad`) REFERENCES `especialidad` (`id`);

--
-- Filtros para la tabla `paciente_plan`
--
ALTER TABLE `paciente_plan`
  ADD CONSTRAINT `paciente_plan_ibfk_1` FOREIGN KEY (`idPlan`) REFERENCES `plan` (`idPlan`),
  ADD CONSTRAINT `paciente_plan_ibfk_2` FOREIGN KEY (`idPaciente`) REFERENCES `paciente` (`idPaciente`);

--
-- Filtros para la tabla `plan`
--
ALTER TABLE `plan`
  ADD CONSTRAINT `plan_ibfk_1` FOREIGN KEY (`idObraSocial`) REFERENCES `obra_social` (`idObraSocial`);

--
-- Filtros para la tabla `prescripcion`
--
ALTER TABLE `prescripcion`
  ADD CONSTRAINT `prescripcion_ibfk_3` FOREIGN KEY (`idPaciente`) REFERENCES `paciente` (`idPaciente`),
  ADD CONSTRAINT `prescripcion_ibfk_4` FOREIGN KEY (`idMedico`) REFERENCES `medico` (`idMedico`);

--
-- Filtros para la tabla `prescripcion_medicamentodetalle`
--
ALTER TABLE `prescripcion_medicamentodetalle`
  ADD CONSTRAINT `prescripcion_medicamentodetalle_ibfk_1` FOREIGN KEY (`idPrescripcion`) REFERENCES `prescripcion` (`idPrescripcion`),
  ADD CONSTRAINT `prescripcion_medicamentodetalle_ibfk_2` FOREIGN KEY (`idMedicamentoDetalle`) REFERENCES `medicamentodetalle` (`id`);

--
-- Filtros para la tabla `prescripcion_prestacion`
--
ALTER TABLE `prescripcion_prestacion`
  ADD CONSTRAINT `prescripcion_prestacion_ibfk_1` FOREIGN KEY (`idPrestacion`) REFERENCES `prestacion` (`idPrestacion`),
  ADD CONSTRAINT `prescripcion_prestacion_ibfk_2` FOREIGN KEY (`idPrescripcion`) REFERENCES `prescripcion` (`idPrescripcion`);

--
-- Filtros para la tabla `prestacion_lado`
--
ALTER TABLE `prestacion_lado`
  ADD CONSTRAINT `prestacion_lado_ibfk_1` FOREIGN KEY (`idLado`) REFERENCES `lado` (`idLado`),
  ADD CONSTRAINT `prestacion_lado_ibfk_2` FOREIGN KEY (`idPrestacion`) REFERENCES `prestacion` (`idPrestacion`);

--
-- Filtros para la tabla `usuario_rol`
--
ALTER TABLE `usuario_rol`
  ADD CONSTRAINT `usuario_rol_ibfk_1` FOREIGN KEY (`idRol`) REFERENCES `rol` (`id`),
  ADD CONSTRAINT `usuario_rol_ibfk_2` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
