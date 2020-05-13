-- MySQL Script generated by MySQL Workbench
-- Wed May 13 10:40:21 2020
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema covamsa_desarrollo
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema covamsa_desarrollo
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `covamsa_desarrollo` DEFAULT CHARACTER SET latin1 ;
USE `covamsa_desarrollo` ;

-- -----------------------------------------------------
-- Table `covamsa_desarrollo`.`acceso`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `covamsa_desarrollo`.`acceso` (
  `idacceso` INT(11) NOT NULL AUTO_INCREMENT,
  `correo` VARCHAR(35) NOT NULL,
  `password` VARCHAR(300) NOT NULL,
  `tipo_usuario` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idacceso`),
  UNIQUE INDEX `idacceso_UNIQUE` (`idacceso` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `covamsa_desarrollo`.`empleados`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `covamsa_desarrollo`.`empleados` (
  `id_empleados` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(20) NOT NULL,
  `apellido_paterno` VARCHAR(25) NOT NULL,
  `apellido_materno` VARCHAR(25) NOT NULL,
  `idacceso` INT(11) NOT NULL,
  PRIMARY KEY (`id_empleados`),
  UNIQUE INDEX `id_empleados_UNIQUE` (`id_empleados` ASC) VISIBLE,
  INDEX `fk_empleados_acceso_idx` (`idacceso` ASC) VISIBLE,
  CONSTRAINT `fk_empleados_acceso`
    FOREIGN KEY (`idacceso`)
    REFERENCES `covamsa_desarrollo`.`acceso` (`idacceso`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `covamsa_desarrollo`.`clientes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `covamsa_desarrollo`.`clientes` (
  `idcliente` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(30) NOT NULL,
  `numero_interno` VARCHAR(45) NOT NULL,
  `id_empleados` INT(11) NOT NULL,
  PRIMARY KEY (`idcliente`),
  UNIQUE INDEX `idcliente_UNIQUE` (`idcliente` ASC) VISIBLE,
  INDEX `fk_clientes_empleados1_idx` (`id_empleados` ASC) VISIBLE,
  CONSTRAINT `fk_clientes_empleados1`
    FOREIGN KEY (`id_empleados`)
    REFERENCES `covamsa_desarrollo`.`empleados` (`id_empleados`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `covamsa_desarrollo`.`departamentos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `covamsa_desarrollo`.`departamentos` (
  `id_departamento` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id_departamento`),
  UNIQUE INDEX `id_departamento_UNIQUE` (`id_departamento` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `covamsa_desarrollo`.`empleados_departamentos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `covamsa_desarrollo`.`empleados_departamentos` (
  `id_empleado_departamaneto` INT(11) NOT NULL AUTO_INCREMENT,
  `id_empleados` INT(11) NOT NULL,
  `id_departamento` INT(11) NOT NULL,
  PRIMARY KEY (`id_empleado_departamaneto`),
  UNIQUE INDEX `id_empleado_departamaneto_UNIQUE` (`id_empleado_departamaneto` ASC) VISIBLE,
  INDEX `fk_empleados_has_departamentos_departamentos1_idx` (`id_departamento` ASC) VISIBLE,
  INDEX `fk_empleados_has_departamentos_empleados1_idx` (`id_empleados` ASC) VISIBLE,
  CONSTRAINT `fk_empleados_has_departamentos_departamentos1`
    FOREIGN KEY (`id_departamento`)
    REFERENCES `covamsa_desarrollo`.`departamentos` (`id_departamento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_empleados_has_departamentos_empleados1`
    FOREIGN KEY (`id_empleados`)
    REFERENCES `covamsa_desarrollo`.`empleados` (`id_empleados`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `covamsa_desarrollo`.`pedidos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `covamsa_desarrollo`.`pedidos` (
  `id_pedido` INT(11) NOT NULL AUTO_INCREMENT,
  `id_empleado` INT(11) NOT NULL,
  `idcliente` INT(11) NOT NULL,
  `orden_de_compra` VARCHAR(31) NOT NULL,
  `ruta` INT(1) NOT NULL,
  `estatus` INT(1) NOT NULL,
  `ruta_pdf_orden_compra` VARCHAR(100) NOT NULL,
  `ruta_pdf_pedido` VARCHAR(100) NULL DEFAULT NULL,
  `ruta_pdf_comprobante_pago` VARCHAR(150) NULL DEFAULT NULL,
  `num_pedido` VARCHAR(31) NULL DEFAULT NULL,
  `observacion` VARCHAR(250) NULL DEFAULT NULL,
  `fecha_inicial` DATETIME NULL DEFAULT NULL,
  `comprobante_pago` VARCHAR(31) NULL DEFAULT NULL,
  `importe` FLOAT NULL DEFAULT NULL,
  `motivo_de_cancelacion` VARCHAR(90) NULL DEFAULT NULL,
  `prioridad` TINYINT(1) NULL DEFAULT NULL,
  `tipo_de_pago` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id_pedido`),
  UNIQUE INDEX `id_pedido_UNIQUE` (`id_pedido` ASC) VISIBLE,
  INDEX `fk_pedidos_empleados1_idx` (`id_empleado` ASC) VISIBLE,
  INDEX `fk_pedidos_clientes1_idx` (`idcliente` ASC) VISIBLE,
  CONSTRAINT `fk_pedidos_clientes1`
    FOREIGN KEY (`idcliente`)
    REFERENCES `covamsa_desarrollo`.`clientes` (`idcliente`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_pedidos_empleados1`
    FOREIGN KEY (`id_empleado`)
    REFERENCES `covamsa_desarrollo`.`empleados` (`id_empleados`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 866
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `covamsa_desarrollo`.`faltantes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `covamsa_desarrollo`.`faltantes` (
  `idfaltante` INT(11) NOT NULL AUTO_INCREMENT,
  `id_pedido` INT(11) NOT NULL,
  `codigoProducto` VARCHAR(45) NOT NULL,
  `fechaPedido` DATETIME NOT NULL,
  `fechaLlegada` DATE NOT NULL,
  `descripcion` VARCHAR(50) NOT NULL,
  `estatus` INT(11) NOT NULL,
  `factura` VARCHAR(15) NOT NULL,
  `rutaFactura` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idfaltante`),
  UNIQUE INDEX `idfaltante_UNIQUE` (`idfaltante` ASC) VISIBLE,
  INDEX `fk_faltantes_pedidos1_idx` (`id_pedido` ASC) VISIBLE,
  CONSTRAINT `fk_faltantes_pedidos1`
    FOREIGN KEY (`id_pedido`)
    REFERENCES `covamsa_desarrollo`.`pedidos` (`id_pedido`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `covamsa_desarrollo`.`proveedores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `covamsa_desarrollo`.`proveedores` (
  `idproveedor` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `numero_interno` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idproveedor`),
  UNIQUE INDEX `idproveedor_UNIQUE` (`idproveedor` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `covamsa_desarrollo`.`faltantes_proveedores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `covamsa_desarrollo`.`faltantes_proveedores` (
  `id_faltante_proveedore` INT(11) NOT NULL AUTO_INCREMENT,
  `idfaltante` INT(11) NOT NULL,
  `idproveedor` INT(11) NOT NULL,
  PRIMARY KEY (`id_faltante_proveedore`),
  UNIQUE INDEX `id_faltantes_proveedorescol_UNIQUE` (`id_faltante_proveedore` ASC) VISIBLE,
  INDEX `fk_faltantes_has_proveedores_proveedores1_idx` (`idproveedor` ASC) VISIBLE,
  INDEX `fk_faltantes_has_proveedores_faltantes1_idx` (`idfaltante` ASC) VISIBLE,
  CONSTRAINT `fk_faltantes_has_proveedores_faltantes1`
    FOREIGN KEY (`idfaltante`)
    REFERENCES `covamsa_desarrollo`.`faltantes` (`idfaltante`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_faltantes_has_proveedores_proveedores1`
    FOREIGN KEY (`idproveedor`)
    REFERENCES `covamsa_desarrollo`.`proveedores` (`idproveedor`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `covamsa_desarrollo`.`informacion_pedido`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `covamsa_desarrollo`.`informacion_pedido` (
  `id_informacion_pedido` INT(11) NOT NULL AUTO_INCREMENT,
  `id_pedido` INT(11) NOT NULL,
  `observaciones` VARCHAR(55) NOT NULL,
  `importe` DOUBLE NOT NULL,
  `fecha_pedido` DATETIME NOT NULL,
  `cotizacion` VARCHAR(15) NOT NULL,
  `estatus` INT(1) NOT NULL,
  `ruta_pdf_cotizacion` VARCHAR(45) NOT NULL,
  `ruta_pdf_factura` VARCHAR(45) NOT NULL,
  `numeroFactura` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_informacion_pedido`),
  UNIQUE INDEX `id_informacion_pedido_UNIQUE` (`id_informacion_pedido` ASC) VISIBLE,
  INDEX `fk_informacion_pedido_pedidos1_idx` (`id_pedido` ASC) VISIBLE,
  CONSTRAINT `fk_informacion_pedido_pedidos1`
    FOREIGN KEY (`id_pedido`)
    REFERENCES `covamsa_desarrollo`.`pedidos` (`id_pedido`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `covamsa_desarrollo`.`modulos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `covamsa_desarrollo`.`modulos` (
  `idmodulo` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(30) NULL DEFAULT NULL,
  `direccion` VARCHAR(30) NULL DEFAULT NULL,
  `descripcion` VARCHAR(50) NULL DEFAULT NULL,
  `id_departamento` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`idmodulo`),
  INDEX `id_departamento` (`id_departamento` ASC) VISIBLE,
  CONSTRAINT `modulos_ibfk_1`
    FOREIGN KEY (`id_departamento`)
    REFERENCES `covamsa_desarrollo`.`departamentos` (`id_departamento`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `covamsa_desarrollo`.`permissions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `covamsa_desarrollo`.`permissions` (
  `permission_id` TINYINT(4) NOT NULL AUTO_INCREMENT,
  `expires` INT(11) NOT NULL,
  `writing` TINYINT(1) NOT NULL,
  `reading` TINYINT(1) NOT NULL,
  `departamentos_id_departamento` INT(11) NOT NULL,
  PRIMARY KEY (`permission_id`),
  UNIQUE INDEX `session_id_UNIQUE` (`permission_id` ASC) VISIBLE,
  INDEX `fk_permissions_departamentos1_idx` (`departamentos_id_departamento` ASC) VISIBLE,
  CONSTRAINT `fk_permissions_departamentos1`
    FOREIGN KEY (`departamentos_id_departamento`)
    REFERENCES `covamsa_desarrollo`.`departamentos` (`id_departamento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `covamsa_desarrollo`.`preferencias_pagos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `covamsa_desarrollo`.`preferencias_pagos` (
  `idpreferencia` INT(11) NOT NULL AUTO_INCREMENT,
  `tipo_pago` VARCHAR(30) NULL DEFAULT NULL,
  PRIMARY KEY (`idpreferencia`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `covamsa_desarrollo`.`preferencias_cliente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `covamsa_desarrollo`.`preferencias_cliente` (
  `idprefenciaCliente` INT(11) NOT NULL AUTO_INCREMENT,
  `idpreferencia` INT(11) NULL DEFAULT NULL,
  `idcliente` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`idprefenciaCliente`),
  INDEX `idpreferencia` (`idpreferencia` ASC) VISIBLE,
  INDEX `idcliente` (`idcliente` ASC) VISIBLE,
  CONSTRAINT `preferencias_cliente_ibfk_1`
    FOREIGN KEY (`idpreferencia`)
    REFERENCES `covamsa_desarrollo`.`preferencias_pagos` (`idpreferencia`),
  CONSTRAINT `preferencias_cliente_ibfk_2`
    FOREIGN KEY (`idcliente`)
    REFERENCES `covamsa_desarrollo`.`clientes` (`idcliente`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `covamsa_desarrollo`.`sessions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `covamsa_desarrollo`.`sessions` (
  `session_id` VARCHAR(128) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_bin' NOT NULL,
  `expires` INT(11) UNSIGNED NOT NULL,
  `data` MEDIUMTEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_bin' NULL DEFAULT NULL,
  PRIMARY KEY (`session_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;