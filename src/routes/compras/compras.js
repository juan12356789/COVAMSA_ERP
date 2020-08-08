const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const pool = require('../../database');
const { isLoggedIn } = require('../../lib/auth');

router.get('/',isLoggedIn, (req , res )=>{
    res.render('links/compras/compras');
});

router.post('/partidas',async (req , res)=>{

    const partidas  = await pool.query(`SELECT (cantidad -  cantidad_surtida) cantidad_faltante ,
                                                num_subpedido ,id_pedido,orden_de_compra,
                                                ruta,estatus,ruta_pdf_orden_compra,
                                                ruta_pdf_pedido,ruta_pdf_comprobante_pago ,
                                                num_pedido,observacion,DATE_FORMAT(fecha_inicial,'%d-%m-%Y %H:%i %p') fecha_inicial, fecha_inicial fecha ,
                                                comprobante_pago,concat( "$",FORMAT(importe, 2)) importe,  IF(prioridad = 1,0,prioridad) prioridadA,prioridad  
                                        FROM pedidos inner join partidas using(id_pedido)
                                                     inner join partidas_productos using(idPartida) 
                                        WHERE  status  = 4 or status  = 5  
                                        order by id_pedido`); 


    res.send(partidas);

});

module.exports = router; 