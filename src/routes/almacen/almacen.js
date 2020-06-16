const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const pool = require('../../database');

router.get('/', async(req, res) => {

    res.render('links/almacen/pedidos');

});

router.get('/pedidos', async(req, res) => {

    const pedidos = await pool.query(`SELECT orden_de_compra,ruta,estatus,ruta_pdf_orden_compra,ruta_pdf_pedido,ruta_pdf_comprobante_pago ,num_pedido,observacion,DATE_FORMAT(fecha_inicial,'%d-%m-%Y %H:%i %p') fecha_inicial,comprobante_pago,prioridadE,concat( "$",FORMAT(importe, 2)) importe,prioridad
                                      FROM pedidos WHERE estatus != 7
                                      order by prioridad desc,fecha_inicial asc`);

    res.send(pedidos);
});

router.post('/partidas', async (req , res)=>{   
  const partidas  = await pool.query("select  id_partidas_productos,cantidad_surtida,idPartida, b.status, clave , nombre, cantidad from pedidos inner  join   partidas b using(id_pedido) inner join partidas_productos using(idPartida) inner join  productos using(idProducto) where num_pedido =?",req.body.pedido);
  res.send(partidas);
   
});
router.post('/cantidad_pedido',async(req , res)=>{
    await pool.query(`UPDATE partidas_productos SET cantidad_surtida = ${req.body.numero}  WHERE id_partidas_productos = ${req.body.id}`);
    res.send('guardado'); 
    
});

router.post('/cambio_estado', async(req, res) => {
    const status = await pool.query(`UPDATE pedidos SET estatus = ${req.body.estado_nuevo} WHERE num_pedido = ?`, req.body.order);
    res.send(status);
});


// Descarga el PDF 
router.get('/pdf/:id', (req, res) => {

    res.download(__dirname + '../../../files/' + req.params.id, req.params.id);

});
module.exports = router;