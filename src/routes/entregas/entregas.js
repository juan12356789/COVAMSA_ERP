const express = require("express");
const router = express.Router();
const pool = require('../../database');
const { isLoggedIn } = require('../../lib/auth');
const upload = require('express-fileupload');
const path = require("path");
const rutimage = path.join(__dirname, "../../files/");
console.log(rutimage);
const fs = require('fs');
const { json } = require("express");
router.use(upload());



router.get('/', isLoggedIn ,( req , res )=>{
    res.render('links/entregas/entregas');
});

router.post('/informacion_envios',  async (req , res)=>{
       
    const pedidos = await pool.query(`SELECT DATE_FORMAT(fecha_facturacion,'%d-%m-%Y %H:%i %p') fecha_facturas,orden_de_compra,ruta,estatus,ruta_pdf_orden_compra,ruta_pdf_pedido,ruta_pdf_comprobante_pago ,num_pedido,observacion,comprobante_pago,concat( "$",FORMAT(importe, 2)) importe,prioridad
    FROM  pedidos inner join facturas using(id_pedido) WHERE estatus = 10 or estatus = 11  or estatus =12
    order by prioridad desc,fecha_inicial asc`);
    
    res.send(pedidos);
    
        
}); 

router.post('/archivo', async (req , res)=>{

    const archivo =  await pool.query(`SELECT comprobante_ruta FROM entregas  where num_pedido = "${req.body.id}" `);
    if(archivo[0].comprobante_ruta == null || archivo[0].comprobante_ruta == '' ) return res.send(false);
    res.send(true); 

}); 

router.post('/eliminarArchivo',async (req , res )=>{
    const archivo =  await pool.query(`SELECT comprobante_ruta FROM entregas  where num_pedido = "${req.body.id}" `);
    await pool.query(`UPDATE  entregas SET comprobante_ruta = '' WHERE num_pedido ="${req.body.id}" `); 
    await pool.query(`UPDATE   pedidos SET  estatus   = 10 WHERE num_pedido =  "${req.body.id}" `);
    fs.unlink(rutimage+archivo[0].comprobante_ruta,(err)=>{
        if(err) console.log(err);
        
    }); 
    res.send(true); 
    
        
}); 

router.post('/', async (req , res) => {

    let file = req.files.comprobante ;
    let filename =  Date.now() + file.name ;

    file.mv(  rutimage+filename ,async (err)=>{
        if(err) return console.log(err);
        await pool.query(`UPDATE entregas SET comprobante_ruta = "${filename}",descripcion_entrega = "${req.body.observaciones}" where num_pedido = "${req.body.num_pedido}"`); 
        await pool.query(`UPDATE pedidos SET estatus = 11 WHERE num_pedido =  "${req.body.num_pedido}"`);
        res.send(true); 
    });

});

router.post('/cancelar_entrega', async (req , res )=>{

    let idPedidos = JSON.parse(req.body.id);
    console.log(req.body.observacion);
    
    for (let i = 0; i < idPedidos.length; i++) {
      await  pool.query(`UPDATE pedidos SET estatus = 12  where num_pedido =  "${idPedidos[i]}"`);
      await  pool.query(`UPDATE entregas SET motivo_detencion  = "${req.body.observacion}"  where num_pedido =  "${idPedidos[i]}"`);
    }
    res.send(true); 
    

}); 
module.exports =  router; 