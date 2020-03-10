-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 06-03-2020 a las 16:58:00
-- Versión del servidor: 10.4.11-MariaDB
-- Versión de PHP: 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `covamsa_desarrollo`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `acceso`
--

CREATE TABLE `acceso` (
  `idacceso` int(11) NOT NULL,
  `correo` varchar(35) NOT NULL,
  `password` varchar(300) NOT NULL,
  `tipo_usuario` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `acceso`
--

INSERT INTO `acceso` (`idacceso`, `correo`, `password`, `tipo_usuario`) VALUES
(2, 'covamsa@gmail.com', '123Aa', 'ventas'),
(3, 'juan@gmail.com', '123Aa', 'ventas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `idcliente` int(11) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `numero_interno` varchar(45) NOT NULL,
  `id_empleados` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`idcliente`, `nombre`, `numero_interno`, `id_empleados`) VALUES
(1, 'MODELO', '1', 1),
(2, 'CORONA PACIFICO ', '2', 1),
(3, 'CORONA EL PACIFICO', '3', 2),
(4, 'TORNILLOS SAN MARCOS', '4', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `departamentos`
--

CREATE TABLE `departamentos` (
  `id_departamento` int(11) NOT NULL,
  `nombre` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `departamentos`
--

INSERT INTO `departamentos` (`id_departamento`, `nombre`) VALUES
(1, 'VENTAS');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleados`
--

CREATE TABLE `empleados` (
  `id_empleados` int(11) NOT NULL,
  `nombre` varchar(20) NOT NULL,
  `apellido_paterno` varchar(25) NOT NULL,
  `apellido_materno` varchar(25) NOT NULL,
  `idacceso` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `empleados`
--

INSERT INTO `empleados` (`id_empleados`, `nombre`, `apellido_paterno`, `apellido_materno`, `idacceso`) VALUES
(1, 'jUAN CARLOS', 'PEDROZA', 'HERNÁNDEZ  ', 2),
(2, 'ROSA ', 'ESTRADA', 'ORTEHA', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleados_departamentos`
--

CREATE TABLE `empleados_departamentos` (
  `id_empleado_departamaneto` int(11) NOT NULL,
  `id_empleados` int(11) NOT NULL,
  `id_departamento` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `empleados_departamentos`
--

INSERT INTO `empleados_departamentos` (`id_empleado_departamaneto`, `id_empleados`, `id_departamento`) VALUES
(1, 1, 1),
(3, 2, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `faltantes`
--

CREATE TABLE `faltantes` (
  `idfaltante` int(11) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `codigoProducto` varchar(45) NOT NULL,
  `fechaPedido` datetime NOT NULL,
  `fechaLlegada` date NOT NULL,
  `descripcion` varchar(50) NOT NULL,
  `estatus` int(11) NOT NULL,
  `factura` varchar(15) NOT NULL,
  `rutaFactura` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `faltantes_proveedores`
--

CREATE TABLE `faltantes_proveedores` (
  `id_faltante_proveedore` int(11) NOT NULL,
  `idfaltante` int(11) NOT NULL,
  `idproveedor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `informacion_pedido`
--

CREATE TABLE `informacion_pedido` (
  `id_informacion_pedido` int(11) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `observaciones` varchar(55) NOT NULL,
  `importe` double NOT NULL,
  `fecha_pedido` datetime NOT NULL,
  `cotizacion` varchar(15) NOT NULL,
  `estatus` int(1) NOT NULL,
  `ruta_pdf_cotizacion` varchar(45) NOT NULL,
  `ruta_pdf_factura` varchar(45) NOT NULL,
  `numeroFactura` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modulos`
--

CREATE TABLE `modulos` (
  `idmodulo` int(11) NOT NULL,
  `nombre` varchar(30) DEFAULT NULL,
  `direccion` varchar(30) DEFAULT NULL,
  `descripcion` varchar(50) DEFAULT NULL,
  `id_departamento` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `modulos`
--

INSERT INTO `modulos` (`idmodulo`, `nombre`, `direccion`, `descripcion`, `id_departamento`) VALUES
(1, 'PEDIDOS', '/ventas', 'Ingresar los pedidos', 1),
(2, 'BUSQUEDA', '/VENTAS/BUSQUEDA', 'Se busca el pedido', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id_pedido` int(11) NOT NULL,
  `id_empleado` int(11) NOT NULL,
  `idcliente` int(11) NOT NULL,
  `orden_de_compra` varchar(20) NOT NULL,
  `ruta` int(1) NOT NULL,
  `estatus` int(1) NOT NULL,
  `ruta_pdf_orden_compra` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id_pedido`, `id_empleado`, `idcliente`, `orden_de_compra`, `ruta`, `estatus`, `ruta_pdf_orden_compra`) VALUES
(1, 1, 1, '223AMJ', 1, 1, '1582737619463COMANDOS.txt'),
(2, 1, 2, '223AMJ', 1, 1, '1582737700341COMANDOS.txt'),
(3, 1, 1, 'SFE', 1, 1, '1583253496869ofertas laborales');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permissions`
--

CREATE TABLE `permissions` (
  `permission_id` tinyint(4) NOT NULL,
  `expires` int(11) NOT NULL,
  `writing` tinyint(1) NOT NULL,
  `reading` tinyint(1) NOT NULL,
  `departamentos_id_departamento` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preferencias_cliente`
--

CREATE TABLE `preferencias_cliente` (
  `idprefenciaCliente` int(11) NOT NULL,
  `idpreferencia` int(11) DEFAULT NULL,
  `idcliente` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `preferencias_cliente`
--

INSERT INTO `preferencias_cliente` (`idprefenciaCliente`, `idpreferencia`, `idcliente`) VALUES
(1, 2, 1),
(2, 1, 2),
(3, 3, 1),
(4, 1, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preferencias_pagos`
--

CREATE TABLE `preferencias_pagos` (
  `idpreferencia` int(11) NOT NULL,
  `tipo_pago` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `preferencias_pagos`
--

INSERT INTO `preferencias_pagos` (`idpreferencia`, `tipo_pago`) VALUES
(1, 'credito'),
(2, 'Anticipado'),
(3, 'Contra Entrega');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `idproveedor` int(11) NOT NULL,
  `nombre` varchar(45) NOT NULL,
  `numero_interno` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('ZHvcBFENW6y6A9slCpUmY1rrAQKcPc7o', 1583596662, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{\"user\":2}}'),
('bHDh6e-8kpFmXNqtjhJ7n4BfxKFARPBG', 1583556468, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{\"user\":2}}'),
('cQvGrnQHvBFckq-z18oiVlyiPQZ9fnaM', 1583519448, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{\"user\":2}}'),
('hz3CgoKArRyxgftaSUQYFY_HnKs3Ls4R', 1583538200, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{\"user\":2}}'),
('pb7lAca0frjzlBkrHfUjKvh1QIkpK79Z', 1583596384, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `acceso`
--
ALTER TABLE `acceso`
  ADD PRIMARY KEY (`idacceso`),
  ADD UNIQUE KEY `idacceso_UNIQUE` (`idacceso`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`idcliente`),
  ADD UNIQUE KEY `idcliente_UNIQUE` (`idcliente`),
  ADD KEY `fk_clientes_empleados1_idx` (`id_empleados`);

--
-- Indices de la tabla `departamentos`
--
ALTER TABLE `departamentos`
  ADD PRIMARY KEY (`id_departamento`),
  ADD UNIQUE KEY `id_departamento_UNIQUE` (`id_departamento`);

--
-- Indices de la tabla `empleados`
--
ALTER TABLE `empleados`
  ADD PRIMARY KEY (`id_empleados`),
  ADD UNIQUE KEY `id_empleados_UNIQUE` (`id_empleados`),
  ADD KEY `fk_empleados_acceso_idx` (`idacceso`);

--
-- Indices de la tabla `empleados_departamentos`
--
ALTER TABLE `empleados_departamentos`
  ADD PRIMARY KEY (`id_empleado_departamaneto`),
  ADD UNIQUE KEY `id_empleado_departamaneto_UNIQUE` (`id_empleado_departamaneto`),
  ADD KEY `fk_empleados_has_departamentos_departamentos1_idx` (`id_departamento`),
  ADD KEY `fk_empleados_has_departamentos_empleados1_idx` (`id_empleados`);

--
-- Indices de la tabla `faltantes`
--
ALTER TABLE `faltantes`
  ADD PRIMARY KEY (`idfaltante`),
  ADD UNIQUE KEY `idfaltante_UNIQUE` (`idfaltante`),
  ADD KEY `fk_faltantes_pedidos1_idx` (`id_pedido`);

--
-- Indices de la tabla `faltantes_proveedores`
--
ALTER TABLE `faltantes_proveedores`
  ADD PRIMARY KEY (`id_faltante_proveedore`),
  ADD UNIQUE KEY `id_faltantes_proveedorescol_UNIQUE` (`id_faltante_proveedore`),
  ADD KEY `fk_faltantes_has_proveedores_proveedores1_idx` (`idproveedor`),
  ADD KEY `fk_faltantes_has_proveedores_faltantes1_idx` (`idfaltante`);

--
-- Indices de la tabla `informacion_pedido`
--
ALTER TABLE `informacion_pedido`
  ADD PRIMARY KEY (`id_informacion_pedido`),
  ADD UNIQUE KEY `id_informacion_pedido_UNIQUE` (`id_informacion_pedido`),
  ADD KEY `fk_informacion_pedido_pedidos1_idx` (`id_pedido`);

--
-- Indices de la tabla `modulos`
--
ALTER TABLE `modulos`
  ADD PRIMARY KEY (`idmodulo`),
  ADD KEY `id_departamento` (`id_departamento`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id_pedido`),
  ADD UNIQUE KEY `id_pedido_UNIQUE` (`id_pedido`),
  ADD KEY `fk_pedidos_empleados1_idx` (`id_empleado`),
  ADD KEY `fk_pedidos_clientes1_idx` (`idcliente`);

--
-- Indices de la tabla `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`permission_id`),
  ADD UNIQUE KEY `session_id_UNIQUE` (`permission_id`),
  ADD KEY `fk_permissions_departamentos1_idx` (`departamentos_id_departamento`);

--
-- Indices de la tabla `preferencias_cliente`
--
ALTER TABLE `preferencias_cliente`
  ADD PRIMARY KEY (`idprefenciaCliente`),
  ADD KEY `idpreferencia` (`idpreferencia`),
  ADD KEY `idcliente` (`idcliente`);

--
-- Indices de la tabla `preferencias_pagos`
--
ALTER TABLE `preferencias_pagos`
  ADD PRIMARY KEY (`idpreferencia`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`idproveedor`),
  ADD UNIQUE KEY `idproveedor_UNIQUE` (`idproveedor`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `acceso`
--
ALTER TABLE `acceso`
  MODIFY `idacceso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `idcliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `departamentos`
--
ALTER TABLE `departamentos`
  MODIFY `id_departamento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `empleados`
--
ALTER TABLE `empleados`
  MODIFY `id_empleados` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `empleados_departamentos`
--
ALTER TABLE `empleados_departamentos`
  MODIFY `id_empleado_departamaneto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `faltantes`
--
ALTER TABLE `faltantes`
  MODIFY `idfaltante` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `faltantes_proveedores`
--
ALTER TABLE `faltantes_proveedores`
  MODIFY `id_faltante_proveedore` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `informacion_pedido`
--
ALTER TABLE `informacion_pedido`
  MODIFY `id_informacion_pedido` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `modulos`
--
ALTER TABLE `modulos`
  MODIFY `idmodulo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id_pedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `permissions`
--
ALTER TABLE `permissions`
  MODIFY `permission_id` tinyint(4) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `preferencias_cliente`
--
ALTER TABLE `preferencias_cliente`
  MODIFY `idprefenciaCliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `preferencias_pagos`
--
ALTER TABLE `preferencias_pagos`
  MODIFY `idpreferencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `idproveedor` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD CONSTRAINT `fk_clientes_empleados1` FOREIGN KEY (`id_empleados`) REFERENCES `empleados` (`id_empleados`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `empleados`
--
ALTER TABLE `empleados`
  ADD CONSTRAINT `fk_empleados_acceso` FOREIGN KEY (`idacceso`) REFERENCES `acceso` (`idacceso`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `empleados_departamentos`
--
ALTER TABLE `empleados_departamentos`
  ADD CONSTRAINT `fk_empleados_has_departamentos_departamentos1` FOREIGN KEY (`id_departamento`) REFERENCES `departamentos` (`id_departamento`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_empleados_has_departamentos_empleados1` FOREIGN KEY (`id_empleados`) REFERENCES `empleados` (`id_empleados`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `faltantes`
--
ALTER TABLE `faltantes`
  ADD CONSTRAINT `fk_faltantes_pedidos1` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `faltantes_proveedores`
--
ALTER TABLE `faltantes_proveedores`
  ADD CONSTRAINT `fk_faltantes_has_proveedores_faltantes1` FOREIGN KEY (`idfaltante`) REFERENCES `faltantes` (`idfaltante`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_faltantes_has_proveedores_proveedores1` FOREIGN KEY (`idproveedor`) REFERENCES `proveedores` (`idproveedor`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `informacion_pedido`
--
ALTER TABLE `informacion_pedido`
  ADD CONSTRAINT `fk_informacion_pedido_pedidos1` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `modulos`
--
ALTER TABLE `modulos`
  ADD CONSTRAINT `modulos_ibfk_1` FOREIGN KEY (`id_departamento`) REFERENCES `departamentos` (`id_departamento`);

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `fk_pedidos_clientes1` FOREIGN KEY (`idcliente`) REFERENCES `clientes` (`idcliente`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_pedidos_empleados1` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id_empleados`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `permissions`
--
ALTER TABLE `permissions`
  ADD CONSTRAINT `fk_permissions_departamentos1` FOREIGN KEY (`departamentos_id_departamento`) REFERENCES `departamentos` (`id_departamento`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `preferencias_cliente`
--
ALTER TABLE `preferencias_cliente`
  ADD CONSTRAINT `preferencias_cliente_ibfk_1` FOREIGN KEY (`idpreferencia`) REFERENCES `preferencias_pagos` (`idpreferencia`),
  ADD CONSTRAINT `preferencias_cliente_ibfk_2` FOREIGN KEY (`idcliente`) REFERENCES `clientes` (`idcliente`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
