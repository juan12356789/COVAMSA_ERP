const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const pool = require('../../database');

router.get('/', async(req, res) => {

    res.render('links/almacen/pedidos');

});

router.get('/pedidos', async(req, res) => {

    const pedidos = await pool.query(`SELECT orden_de_compra,ruta,estatus,ruta_pdf_orden_compra,ruta_pdf_pedido,ruta_pdf_comprobante_pago ,num_pedido,observacion,DATE_FORMAT(fecha_inicial,'%d-%m-%Y %H:%i %p') fecha_inicial,comprobante_pago,concat( "$",FORMAT(importe, 2)) importe,prioridad FROM pedidos WHERE estatus != 7 group by prioridad,fecha_inicial order by prioridad desc,fecha_inicial asc`);

    res.send(pedidos);
});


router.post('/cambio_estado', async (req , res)=>{
   const status = await pool.query(`UPDATE pedidos SET estatus = ${req.body.estado_nuevo} WHERE num_pedido = ?`, req.body.order);
    res.send(status);
});


// Descarga el PDF 
router.get('/pdf/:id', (req, res) => {

    res.download(__dirname + '../../../files/' + req.params.id, req.params.id);

});
module.exports = router;
