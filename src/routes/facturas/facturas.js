const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const pool = require('../../database');
const { isLoggedIn } = require('../../lib/auth');

router.get('/',isLoggedIn ,(req , res)=> res.render('links/facturas/facturas') );
router.post('/', async (req , res) =>{

 const pedidos_facturar = await pool.query(`SELECT orden_de_compra,ruta,estatus,prioridadE,ruta_pdf_orden_compra,ruta_pdf_pedido,ruta_pdf_comprobante_pago ,num_pedido,observacion,DATE_FORMAT(fecha_inicial,'%d-%m-%Y %H:%i %p') fecha_inicial,comprobante_pago,concat( "$",FORMAT(importe, 2)) importe,IF(prioridad = 1,0,prioridad) prioridadA,prioridad
                                            FROM pedidos 
                                            WHERE estatus = 3  OR  estatus = 4 OR estatus = 8
                                            order by  prioridadA desc, fecha_inicial asc `);
    res.send(pedidos_facturar); 
    

}); 

router.post('/status', async (req , res)=>{
    let f = new Date();
    let fecha = f.getFullYear() + "-" + (f.getMonth() + 1) + "-" + f.getDate() + ' ' + f.getHours() + ':' + f.getMinutes();
    if(req.body.status  != "Facturando")  {

        await pool.query(`UPDATE pedidos SET estatus= 8  where num_pedido = '${req.body.id}'` );

    } else{

        await pool.query(`UPDATE pedidos SET estatus= 9  where num_pedido = '${req.body.id}'` );
        await pool.query(`UPDATE facturas SET numero_factura = "${req.body.factura}"  where id_pedido = (select  id_pedido from pedidos where num_pedido = '${req.body.id}') ` );
    }  
    if(req.body.status != 'Facturando' ) await pool.query(`INSERT INTO facturas VALUES (null ,(select id_pedido from pedidos where num_pedido ="${req.body.id}"),'${fecha}','')`);
    res.send(true);
    
});
router.post('/partidas',async (req , res)=>{

    const partidas  = await pool.query(`select   clave , nombre, cantidad 
                                        from pedidos inner  join   partidas b using(id_pedido) 
                                                     inner join partidas_productos using(idPartida) 
                                                     inner join  productos using(idProducto)
                                        where num_pedido = ? and   cantidad_surtida > 0 `,req.body.id);
//    console.log(partidas);
   
    res.send(partidas);

});

module.exports = router;