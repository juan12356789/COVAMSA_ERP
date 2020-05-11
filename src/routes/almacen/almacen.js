const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const pool = require('../../database');

router.get('/', async(req, res) => {

    res.render('links/almacen/pedidos');

});

router.get('/pedidos', async(req, res) => {

    const pedidos = await pool.query('SELECT  * FROM pedidos ');


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
