use desarrollo ;
-- MySQL Script generated by MySQL Workbench
-- Sun Jan 19 11:31:00 2020
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------


-- -----------------------------------------------------
-- Table `mydb`.`acceso`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`acceso` (
  `idacceso` INT NOT NULL AUTO_INCREMENT,
  `correo` VARCHAR(35) NOT NULL,
  `password` VARCHAR(300) NOT NULL,
  `tipo_usuario` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idacceso`),
  UNIQUE INDEX `idacceso_UNIQUE` (`idacceso` ASC)  )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`departamentos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`departamentos` (
  `id_departamento` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id_departamento`),
  UNIQUE INDEX `id_departamento_UNIQUE` (`id_departamento` ASC)  )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`empleados`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`empleados` (
  `id_empleados` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(20) NOT NULL,
  `apellido_paterno` VARCHAR(25) NOT NULL,
  `apellido_materno` VARCHAR(25) NOT NULL,
  `idacceso` INT NOT NULL,
  PRIMARY KEY (`id_empleados`),
  UNIQUE INDEX `id_empleados_UNIQUE` (`id_empleados` ASC)  ,
  INDEX `fk_empleados_acceso_idx` (`idacceso` ASC)  ,
  CONSTRAINT `fk_empleados_acceso`
    FOREIGN KEY (`idacceso`)
    REFERENCES `mydb`.`acceso` (`idacceso`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`empleados_departamentos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`empleados_departamentos` (
  `id_empleado_departamaneto` INT NOT NULL AUTO_INCREMENT,
  `id_empleados` INT NOT NULL,
  `id_departamento` INT NOT NULL,
  INDEX `fk_empleados_has_departamentos_departamentos1_idx` (`id_departamento` ASC)  ,
  INDEX `fk_empleados_has_departamentos_empleados1_idx` (`id_empleados` ASC)  ,
  PRIMARY KEY (`id_empleado_departamaneto`),
  UNIQUE INDEX `id_empleado_departamaneto_UNIQUE` (`id_empleado_departamaneto` ASC)  ,
  CONSTRAINT `fk_empleados_has_departamentos_empleados1`
    FOREIGN KEY (`id_empleados`)
    REFERENCES `mydb`.`empleados` (`id_empleados`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_empleados_has_departamentos_departamentos1`
    FOREIGN KEY (`id_departamento`)
    REFERENCES `mydb`.`departamentos` (`id_departamento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`clientes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`clientes` (
  `idcliente` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(30) NOT NULL,
  `numero_interno` VARCHAR(45) NOT NULL,
  `id_empleados` INT NOT NULL,
  PRIMARY KEY (`idcliente`),
  UNIQUE INDEX `idcliente_UNIQUE` (`idcliente` ASC)  ,
  INDEX `fk_clientes_empleados1_idx` (`id_empleados` ASC)  ,
  CONSTRAINT `fk_clientes_empleados1`
    FOREIGN KEY (`id_empleados`)
    REFERENCES `mydb`.`empleados` (`id_empleados`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`pedidos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`pedidos` (
  `id_pedido` INT NOT NULL AUTO_INCREMENT,
  `id_empleado` INT NOT NULL,
  `idcliente` INT NOT NULL,
  `orden_de_compra` VARCHAR(20) NOT NULL,
  `ruta` INT(1) NOT NULL,
  `estatus` INT(1) NOT NULL,
  `ruta_pdf_orden_compra` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_pedido`),
  UNIQUE INDEX `id_pedido_UNIQUE` (`id_pedido` ASC)  ,
  INDEX `fk_pedidos_empleados1_idx` (`id_empleado` ASC)  ,
  INDEX `fk_pedidos_clientes1_idx` (`idcliente` ASC)  ,
  CONSTRAINT `fk_pedidos_empleados1`
    FOREIGN KEY (`id_empleado`)
    REFERENCES `mydb`.`empleados` (`id_empleados`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_pedidos_clientes1`
    FOREIGN KEY (`idcliente`)
    REFERENCES `mydb`.`clientes` (`idcliente`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`informacion_pedido`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`informacion_pedido` (
  `id_informacion_pedido` INT NOT NULL AUTO_INCREMENT,
  `id_pedido` INT NOT NULL,
  `observaciones` VARCHAR(55) NOT NULL,
  `importe` DOUBLE NOT NULL,
  `fecha_pedido` DATETIME NOT NULL,
  `cotizacion` VARCHAR(15) NOT NULL,
  `estatus` INT(1) NOT NULL,
  `ruta_pdf_cotizacion` VARCHAR(45) NOT NULL,
  `ruta_pdf_factura` VARCHAR(45) NOT NULL,
  `numeroFactura` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_informacion_pedido`),
  UNIQUE INDEX `id_informacion_pedido_UNIQUE` (`id_informacion_pedido` ASC)  ,
  INDEX `fk_informacion_pedido_pedidos1_idx` (`id_pedido` ASC)  ,
  CONSTRAINT `fk_informacion_pedido_pedidos1`
    FOREIGN KEY (`id_pedido`)
    REFERENCES `mydb`.`pedidos` (`id_pedido`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`faltantes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`faltantes` (
  `idfaltante` INT NOT NULL AUTO_INCREMENT,
  `id_pedido` INT NOT NULL,
  `codigoProducto` VARCHAR(45) NOT NULL,
  `fechaPedido` DATETIME NOT NULL,
  `fechaLlegada` DATE NOT NULL,
  `descripcion` VARCHAR(50) NOT NULL,
  `estatus` INT NOT NULL,
  `factura` VARCHAR(15) NOT NULL,
  `rutaFactura` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idfaltante`),
  UNIQUE INDEX `idfaltante_UNIQUE` (`idfaltante` ASC)  ,
  INDEX `fk_faltantes_pedidos1_idx` (`id_pedido` ASC)  ,
  CONSTRAINT `fk_faltantes_pedidos1`
    FOREIGN KEY (`id_pedido`)
    REFERENCES `mydb`.`pedidos` (`id_pedido`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`proveedores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`proveedores` (
  `idproveedor` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `numero_interno` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idproveedor`),
  UNIQUE INDEX `idproveedor_UNIQUE` (`idproveedor` ASC)  )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`faltantes_proveedores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`faltantes_proveedores` (
  `id_faltante_proveedore` INT NOT NULL AUTO_INCREMENT,
  `idfaltante` INT NOT NULL,
  `idproveedor` INT NOT NULL,
  INDEX `fk_faltantes_has_proveedores_proveedores1_idx` (`idproveedor` ASC)  ,
  INDEX `fk_faltantes_has_proveedores_faltantes1_idx` (`idfaltante` ASC)  ,
  PRIMARY KEY (`id_faltante_proveedore`),
  UNIQUE INDEX `id_faltantes_proveedorescol_UNIQUE` (`id_faltante_proveedore` ASC)  ,
  CONSTRAINT `fk_faltantes_has_proveedores_faltantes1`
    FOREIGN KEY (`idfaltante`)
    REFERENCES `mydb`.`faltantes` (`idfaltante`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_faltantes_has_proveedores_proveedores1`
    FOREIGN KEY (`idproveedor`)
    REFERENCES `mydb`.`proveedores` (`idproveedor`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
