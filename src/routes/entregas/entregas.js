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

router.post('/detalles',async ( req , res )=>{
    
    const details =  await pool.query(`select clave,nombre,cantidad_surtida 
                                        from pedidos inner join partidas using(id_pedido) 
                                                     inner join partidas_productos using(idPartida) 
                                                     inner join productos using(idProducto)
                                        where cantidad_surtida  != 0 and id_pedido  ='${req.body.pedido}'`); 
    res.send(details); 
});

router.post('/informacion_envios',  async (req , res)=>{
    const usuario  = await  pool.query("SELECT tipo_usuario,id_empleados from acceso inner join empleados using(idacceso) where idacceso  = ?",req.user[0].idacceso);
    
    if(usuario[0].tipo_usuario == 'Entregas'){
      
        const pedidosE = await pool.query(`SELECT idEntregas,a.id_pedido,numero_factura ,  DATE_FORMAT(fecha_facturacion,'%d-%m-%Y %H:%i %p') fecha_facturas,orden_de_compra,ruta,estatus,ruta_pdf_orden_compra,ruta_pdf_pedido,ruta_pdf_comprobante_pago ,a.num_pedido,observacion,comprobante_pago,concat( "$",FORMAT(importe, 2)) importe,prioridad   from  acceso  
                                                            inner join empleados using(idacceso)   
                                                            inner join   pedidos a on id_empleados = id_empleado  
                                                            inner join facturas using(id_pedido) 
                                                            inner join   entregas on idFacutura  = idFactura 
                                          WHERE estatus >= 10     and   repartidor  = ${usuario[0].id_empleados}
                                          order by prioridad desc,fecha_inicial asc`); 
        // ${req.user[0].idacceso}  
        res.send(pedidosE); 

    }
    if(usuario[0].tipo_usuario == 'Administrador'){

        const pedidos = await pool.query(`SELECT idEntregas,n.nombre nombreRepartidor,a.id_pedido,numero_factura ,  DATE_FORMAT(fecha_facturacion,'%d-%m-%Y %H:%i %p') fecha_facturas,orden_de_compra,ruta,estatus,ruta_pdf_orden_compra,ruta_pdf_pedido,ruta_pdf_comprobante_pago ,a.num_pedido,observacion,comprobante_pago,concat( "$",FORMAT(importe, 2)) importe,prioridad   from  acceso  
                                                        inner join empleados using(idacceso)   
                                                        inner join   pedidos a on id_empleados = id_empleado  
                                                        inner join facturas using(id_pedido) 
                                                        inner join   entregas on idFacutura  = idFactura 
                                                        inner join empleados n on repartidor = n.id_empleados
                                          WHERE estatus >= 10     
                                         order by prioridad desc,fecha_inicial asc`);
        res.send(pedidos);
    }

}); 

router.post('/archivo', async (req , res)=>{
    console.log(req.body);
    const archivo =  await pool.query(`SELECT comprobante_ruta FROM entregas  where id_pedido = ${req.body.id} `);
    if(archivo[0].comprobante_ruta == null || archivo[0].comprobante_ruta == '' || archivo.length == 0 ) return res.send(false);
    res.send(true); 

}); 

router.post('/eliminarArchivo',async (req , res )=>{

    const archivo =  await pool.query(`SELECT comprobante_ruta FROM entregas  where id_pedido = ${req.body.id} `);
    await pool.query(`UPDATE  entregas SET comprobante_ruta = '' WHERE id_pedido = ${req.body.id} `); 
    await pool.query(`UPDATE   pedidos SET  estatus   = 10 WHERE id_pedido =  ${req.body.id} `);
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
        await pool.query(`UPDATE entregas SET comprobante_ruta = "${filename}",descripcion_entrega = "${req.body.observaciones}" where id_pedido = ${req.body.num_pedido}`); 
        await pool.query(`UPDATE pedidos SET estatus = 11 WHERE id_pedido=  ${req.body.num_pedido}`);
        res.send(true); 
    });

});

router.post('/cancelar_entrega', async (req , res )=>{
    console.log(req.body);
    let idPedidos = JSON.parse(req.body.id);
    
    for (let i = 0; i < idPedidos.length; i++) {
      await  pool.query(`UPDATE pedidos SET estatus = 12  where id_pedido = ${idPedidos[i]}`);
      await  pool.query(`UPDATE entregas SET motivo_detencion  = "${req.body.observacion}"  where id_pedido =  ${idPedidos[i]}`);
    }
    res.send(true); 
}); 
module.exports =  router; 