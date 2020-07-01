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

    const partidas  = await pool.query(`select   orden_de_compra,ruta,estatus,prioridadE,ruta_pdf_orden_compra,ruta_pdf_pedido,ruta_pdf_comprobante_pago ,num_pedido,observacion,DATE_FORMAT(fecha_inicial,'%d-%m-%Y %H:%i %p') fecha_inicial,comprobante_pago,concat( "$",FORMAT(importe, 2)) importe,prioridad
                                        from pedidos inner  join   partidas b using(id_pedido) 
                                                     inner join partidas_productos using(idPartida) 
                                                     inner join  productos using(idProducto)
                                        where  cantidad !=  cantidad_surtida
                                        group by num_pedido`,req.body.id);
                        
//    console.log(partidas);
   
    res.send(partidas);

});

module.exports = router; 