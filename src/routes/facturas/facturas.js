const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const pool = require('../../database');
const { isLoggedIn } = require('../../lib/auth');

router.get('/',(req , res)=> res.render('links/facturas/facturas') );
router.post('/', async (req , res) =>{

 const pedidos_facturar = await pool.query(`SELECT orden_de_compra,ruta,estatus,ruta_pdf_orden_compra,ruta_pdf_pedido,ruta_pdf_comprobante_pago ,num_pedido,observacion,DATE_FORMAT(fecha_inicial,'%d-%m-%Y %H:%i %p') fecha_inicial,comprobante_pago,concat( "$",FORMAT(importe, 2)) importe,prioridad
                                            FROM pedidos 
                                            WHERE estatus = 3  OR  estatus = 4
                                            order by prioridad desc,fecha_inicial asc`);
    res.send(pedidos_facturar); 
    

}); 

module.exports = router;