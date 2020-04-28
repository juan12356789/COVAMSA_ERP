ALTER TABLE `rp2020`.`compras` 
ADD COLUMN `status` INT(1) NULL AFTER `total`;

ALTER TABLE `rp2020`.`comprasproductos` 
ADD COLUMN `iva` INT(1) NULL AFTER `descuento`;
