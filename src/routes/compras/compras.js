const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const pool = require('../../database');
const { isLoggedIn } = require('../../lib/auth');
const { json } = require("express");

router.get('/',isLoggedIn, (req , res )=>{
    res.render('links/compras/compras');
});

router.post('/partidas',async (req , res)=>{

    
    const partidas = await pool.query(`select DISTINCT idPartida,num_pedido, num_subpedido ,  if(prioridad = 0 , "Normal", "Urgente") prioridad,
                                              DATE_FORMAT(a.fecha,'%d-%m-%Y %H:%i %p') fecha  ,numero_factura,id_pedido, idPartida,a.estatus
                                       FROM facturas right join   pedidos using(id_pedido) inner join partidas using(id_pedido)  
                                                                                           inner join partidas_productos using(idPartida) 
                                                                                           inner join faltantes_partidas f using(id_partidas_productos) 
                                                                                           inner join faltantes a using(idFaltante)
                                        UNION 

                                       select DISTINCT idPartida,num_pedido, num_subpedido ,  if(prioridad = 0 , "Normal", "Urgente") prioridad,
                                            DATE_FORMAT(a.fecha,'%d-%m-%Y %H:%i %p') fecha  ,numero_factura,id_pedido, idPartida,a.estatus
                                        FROM   facturas  left join  pedidos using(id_pedido) inner join partidas using(id_pedido)  
                                                                                             inner join partidas_productos using(idPartida) 
                                                                                             inner join faltantes_partidas f using(id_partidas_productos) 
                                                                                             inner join faltantes a using(idFaltante)`);
    res.send(partidas);

});

router.post('/faltantes_partida', async(req , res ) =>{

        const faltantesPorPartida  = await pool.query(`
        select clave, p.cantidad, a.cantidad_surtida,v.nombre nombre_proveedor,a.idFaltantePartida ,d.nombre,estatus, DATE_FORMAT(fecha_llegada,'%d-%m-%Y %H:%i %p') fechaL,
               if(fecha_faltante =null,'',DATE_FORMAT(fecha_faltante,'%d-%m-%Y %H:%i %p')  ) fechaF
        from productos  d		inner join partidas_productos p using(idProducto) 
						        inner join faltantes_partidas a using(id_partidas_productos)
                                left  join  proveedores_faltantes_partidas using(idFaltantePartida)
						        left join proveedores v using(idProveedor)  
        where idPartida  = ${req.body.id}

	    UNION 

        select clave, p.cantidad, a.cantidad_surtida,v.nombre nombre_proveedor,a.idFaltantePartida,d.nombre,estatus,DATE_FORMAT(fecha_llegada,'%d-%m-%Y %H:%i %p') fechaL,
              if(fecha_faltante =null,'',DATE_FORMAT(fecha_faltante,'%d-%m-%Y %H:%i %p')  ) fechaF
        from productos d         inner join partidas_productos p using(idProducto) 
        						 inner join faltantes_partidas a using(id_partidas_productos)
                                 right  join  proveedores_faltantes_partidas using(idFaltantePartida)
                                 right join proveedores v using(idProveedor)  
        where idPartida  = ${req.body.id} 
        order by clave
        `); 
        res.send(faltantesPorPartida);
        
}); 

router.post('/proveedores',  async(req , res)=>{

    const proveedores  =  await pool.query(`SELECT nombre  FROM proveedores`);
    res.send(proveedores); 

});

router.post('/guardar', async (req , res )=>{
    let partidas =  JSON.parse(req.body.idPartidas), f = new Date(),a = new Date(),todasLasPartidas =JSON.parse(req.body.select) ;
    const proveedor  = await pool.query(`SELECT idProveedor,tiempoEntrega FROM proveedores where nombre = ?`,req.body.proveedor);
    console.log( f.setHours(f.getHours() + 40));
    let tiempoActual  = a.getFullYear() + "-" + (a.getMonth() + 1) + "-" + a.getDate() + ' ' + a.getHours()  + ':' + a.getMinutes() + ':' + a.getSeconds();
    let time  = f.getFullYear() + "-" + (f.getMonth() + 1) + "-" + f.getDate() + ' ' + f.getHours()  + ':' + f.getMinutes() + ':' + f.getSeconds();
    if(req.body.select  ==  'false' ){

        for (let i = 0; i < partidas.length; i++) {
            await pool.query(`INSERT INTO proveedores_faltantes_partidas VALUE (?,?,?,?,?,?)`,[null,proveedor[0].idProveedor,partidas[i],0,tiempoActual,time]);
        }

    }else{

        for (let i = 0; i < todasLasPartidas.length; i++) {
            await pool.query(`INSERT INTO proveedores_faltantes_partidas VALUE (?,?,?,?,?,?)`,[null,proveedor[0].idProveedor,todasLasPartidas[i],0,tiempoActual,time]);
        }

    }
    res.send(true);

});

router.post('/selectAllSupplier',async ( req , res )=>{

    const idSelectAll = await pool.query(`select idFaltantePartida 
                                          from faltantes_partidas  inner join partidas_productos using(id_partidas_productos) 
                                          WHERE idPartida  = ?`,req.body.id);
    res.send(idSelectAll); 

}); 
module.exports = router; 