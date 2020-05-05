-- phpMyAdmin SQL Dump
-- version 4.9.4
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 30-03-2020 a las 09:54:55
-- Versión del servidor: 10.3.22-MariaDB
-- Versión de PHP: 7.3.6

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
(3, 'juan@gmail.com', '123Aa', 'ventas'),
(4, 'rosa@gmail.com', '123Aa', 'ALMACEN');

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
(1, 'VENTAS'),
(2, 'ALMACEN');

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
(2, 'ROSA ', 'ESTRADA', 'ORTEHA', 3),
(3, 'RODSA', 'JKBEK', 'SELN', 4);

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
(3, 2, 1),
(4, 3, 2);

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
(2, 'BUSQUEDA', '/VENTAS/BUSQUEDA', 'Se busca el pedido', 1),
(3, 'PEDIDOS', '/almacen', NULL, 2);

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
  `ruta_pdf_orden_compra` varchar(100) NOT NULL,
  `ruta_pdf_pedido` varchar(100) DEFAULT NULL,
  `ruta_pdf_comprobante_pago` varchar(150) DEFAULT NULL,
  `num_pedido` varchar(15) DEFAULT NULL,
  `observacion` varchar(100) DEFAULT NULL,
  `fecha_inicial` datetime DEFAULT NULL,
  `comprobante_pago` varchar(30) DEFAULT NULL,
  `importe` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id_pedido`, `id_empleado`, `idcliente`, `orden_de_compra`, `ruta`, `estatus`, `ruta_pdf_orden_compra`, `ruta_pdf_pedido`, `ruta_pdf_comprobante_pago`, `num_pedido`, `observacion`, `fecha_inicial`, `comprobante_pago`, `importe`) VALUES
(286, 1, 1, 'Airu744s', 2, 1, '1584558717580', '1584558718369', '1584558718641', 'twyw24F', 'ATTE. ESTRADA', '2020-03-18 13:12:00', 'Sswp12', 123.9),
(287, 1, 2, 'ASP123', 1, 1, '1584559025859', '1584559026998', '1584559027679', 'QWE123', 'Ps está chico ', '2020-03-18 13:17:00', 'QDF2334', 12.13),
(288, 1, 1, 'A123223', 2, 1, '1584639903418', '1584639906337', '1584639907005', '123123123213', 'Test', '2020-03-19 11:45:00', '12312312', 132124),
(289, 1, 2, 'adq45', 1, 1, '1584639965075', '1584639965280', '1584639965321', '777as', 'wd', '2020-03-19 11:46:00', 'as87', 11.45),
(290, 1, 2, 'Am123', 1, 1, '1584640083819', '1584640083868', '1584640083869', 'qwe45', 'hooa', '2020-03-19 11:48:00', 'as782', 11.45),
(291, 1, 1, '13123', 1, 1, '1584640127122', '1584640127661', '1584640130615', '123123', 'test luis', '2020-03-19 11:48:00', '123132434', 123),
(292, 1, 2, 'NUEVO456', 1, 1, '1584977840131', '1584977840290', '1584977840310', 'AM200', 'PREUBA', '2020-03-23 09:37:00', 'QUEONDA123', 12.4),
(293, 1, 2, 'AM45', 1, 1, '1585072537932', '1585072537999', '1585072538000', 'WE36', 'Hoa', '2020-03-24 11:55:00', 'ERT36', 45.45),
(294, 1, 2, 'WER123', 1, 1, '1585072922900', '1585072923507', '1585072923516', 'CVB456', 'hola', '2020-03-24 12:02:00', 'QWR', 11.45),
(295, 1, 1, 'Airu744', 1, 1, '1585073077943', '1585073083507', '1585073088789', '90as', 'martes', '2020-03-24 12:04:00', 'Sswp12', 905.9),
(296, 1, 2, 'ar789', 1, 1, '1585073257445', '1585073257502', '1585073257503', 'los456', 'hola', '2020-03-24 12:07:00', 'sfw', 12.45),
(297, 1, 2, 'QWE36', 1, 1, '1585073444061', '1585073444114', '1585073444223', 'CFG45', 'HOLA', '2020-03-24 12:10:00', 'JUL564', 12.45),
(298, 1, 2, 'adq45', 1, 1, '1585073977429', '1585073977468', '1585073977471', 'asd36', 'hola', '2020-03-24 12:19:00', 'AERT123', 45.45),
(299, 1, 1, 'Airu744esfr', 1, 1, '1585154634399', '1585154634462', '1585154634479', '132frA', 'Miercoles', '2020-03-25 10:43:00', 'Sswp12mis', 8903.9);

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
(4, 1, 4),
(5, 4, 2);

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
(1, 'orden_compra'),
(2, 'numero_pedido'),
(3, 'comprobante_pago'),
(4, 'observaciones');

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
('e_qDCKwFcOOWvPPRXaqr0aOhoHTRoNIb', 1585667174, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('fL2Lsq8tiaZlw1zRzq2f65ORcXUOC-S5', 1585587676, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('kAbprv6aG0rpWc7Y9k2y5Txcz1QJ3Ns_', 1585587676, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('mRIOe9VrI2626QjW_sXaqWgnz4GsZBX9', 1585667174, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}');

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
  MODIFY `idacceso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `idcliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `departamentos`
--
ALTER TABLE `departamentos`
  MODIFY `id_departamento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `empleados`
--
ALTER TABLE `empleados`
  MODIFY `id_empleados` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `empleados_departamentos`
--
ALTER TABLE `empleados_departamentos`
  MODIFY `id_empleado_departamaneto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
  MODIFY `idmodulo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id_pedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=300;

--
-- AUTO_INCREMENT de la tabla `permissions`
--
ALTER TABLE `permissions`
  MODIFY `permission_id` tinyint(4) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `preferencias_cliente`
--
ALTER TABLE `preferencias_cliente`
  MODIFY `idprefenciaCliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `preferencias_pagos`
--
ALTER TABLE `preferencias_pagos`
  MODIFY `idpreferencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
