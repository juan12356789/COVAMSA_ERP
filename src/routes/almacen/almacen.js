const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const pool = require('../../database');
const { ALPN_ENABLED } = require("constants");
const { route } = require("../menu/menu");
const { query } = require("express");
const { isLoggedIn } = require('../../lib/auth');
router.get('/', isLoggedIn , async(req, res) => {

  const permisoUsuario = await pool.query(`SELECT tipo_usuario  FROM acceso WHERE idacceso = ?`,req.user[0].idacceso);
  if(permisoUsuario[0].tipo_usuario == "Administrador" || permisoUsuario[0].tipo_usuario == "Almacen") return res.render('links/almacen/pedidos');
  res.redirect('/menu');
    
});



router.get('/pedidos', async(req, res) => {

    const pedidos = await pool.query(`SELECT num_subpedido,numero_factura ,id_pedido,orden_de_compra,
	                                        	 ruta,estatus,ruta_pdf_orden_compra,
		                                         ruta_pdf_pedido,ruta_pdf_comprobante_pago ,
		                                         num_pedido,observacion,DATE_FORMAT(fecha_inicial,'%d-%m-%Y %H:%i %p') fecha_inicial, fecha_inicial fecha ,
		                                         comprobante_pago,concat( "$",FORMAT(importe, 2)) importe,  IF(prioridad = 1,0,prioridad) prioridadA,prioridad
                                      FROM pedidos   LEFT JOIN facturas using(id_pedido)
                                      WHERE estatus != 7

                                      UNION
 
                                      SELECT num_subpedido,numero_factura,id_pedido,orden_de_compra,
                                      		ruta,estatus,ruta_pdf_orden_compra,
                                      		ruta_pdf_pedido,ruta_pdf_comprobante_pago ,
                                      		num_pedido,observacion,DATE_FORMAT(fecha_inicial,'%d-%m-%Y %H:%i %p') fecha_inicial,fecha_inicial fecha ,
                                      		comprobante_pago,concat( "$",FORMAT(importe, 2)) importe,  IF(prioridad = 1,0,prioridad) prioridadA,prioridad
                                      FROM pedidos    RIGHT  JOIN facturas using(id_pedido)
                                      WHERE estatus != 7 
                                      order by  prioridadA desc, fecha asc`);

    res.send(pedidos);
});

router.post('/partidas', async (req , res)=>{   
  const partidas  = await pool.query("select  id_partidas_productos,cantidad_surtida,idPartida, b.status, clave ,prioridadE, nombre, cantidad from pedidos inner  join   partidas b using(id_pedido) inner join partidas_productos using(idPartida) inner join  productos using(idProducto) where id_pedido = ?",req.body.pedido);
  res.send(partidas);
   
});

router.post('/cantidad_pedido',async(req , res)=>{
  
    let cantidad =  JSON.parse(req.body.cantidad) , partidas  = JSON.parse(req.body.partidas) ;
    const empleado  = await pool.query(`select id_empleados from empleados  where idacceso = ? `,req.user[0].idacceso); 
    let f = new Date();
    let time  = f.getFullYear() + "-" + (f.getMonth() + 1) + "-" + f.getDate() + ' ' + f.getHours() + ':' + f.getMinutes() + ':' + f.getSeconds();
    if(req.body.status  == 'Comprado'){
      const idFatnate  = await pool.query(`select idFaltantePartida,cantidad
                                           from pedidos inner join partidas using(id_pedido)
                                                        inner join partidas_productos using (idPartida)
                                                        inner join faltantes_partidas using(id_partidas_productos)
                                            WHERE id_pedido = ${req.body.id}`);
      for (let i = 0; i < cantidad.length; i++) {

        await pool.query(`UPDATE faltantes_partidas 
                          SET    cantidad_surtida = ${cantidad[i] == ''? 0 : parseInt(cantidad[i]) },
                                 estatus = ${cantidad[i] == idFatnate[i].cantidad ? 2 : cantidad[i] == 0 ? 0 : 1 } 
                          WHERE  idFaltantePartida = ${idFatnate[i].idFaltantePartida}`);

        let statusFaltante = await pool.query(`SELECT estado FROM log_faltantes where idFaltantePartida = ${idFatnate[i].idFaltantePartida} `);
        let estado = cantidad[i] == idFatnate[i].cantidad ? 2 : cantidad[i] == 0 ? 0 : 1;  
        let descripcion =  ["La partida aún no tiene nada surtido","Se ha surtido una parte de la partida ","La partida ha sido completada"] ;
        if(   statusFaltante.length  != 0   ){
          
          if(estado  != statusFaltante[0].estado) await pool.query(`INSERT INTO log_faltantes VALUE (?,?,?,?,?,?)`,[null,idFatnate[i].idFaltantePartida,cantidad[i] == idFatnate[i].cantidad ? 2 : cantidad[i] == 0 ? 0 : 1,time,empleado[0].id_empleados,descripcion[estado ]]);
        
        }else{

          await pool.query(`INSERT INTO  log_faltantes VALUE (?,?,?,?,?,?)`,[null,idFatnate[i].idFaltantePartida,cantidad[i] == idFatnate[i].cantidad ? 2 : cantidad[i] == 0 ? 0 : 1,time,empleado[0].id_empleados,descripcion[estado ]]);
       
        } 
      
      }
      const partida = await pool.query(`select idFaltante from  faltantes_partidas where idFaltantePartida = ${idFatnate[0].idFaltantePartida}`);
      const status = await pool.query(`select  count(*) status from  faltantes_partidas where idFaltante = ${partida[0].idFaltante} and estatus = 2`);

      if(status[0].status ==  cantidad.length)  await pool.query(`UPDATE faltantes SET estatus = 2 where idFaltante = ${partida[0].idFaltante}`); 
      else  await pool.query(`UPDATE faltantes SET estatus = 1 where idFaltante = ${partida[0].idFaltante}`);
    }
    
    for (let i = 0; i < cantidad.length; i++) {

     await pool.query(`UPDATE partidas_productos SET cantidad_surtida = ${cantidad[i] == ''? 0 : parseInt(cantidad[i]) }  WHERE id_partidas_productos = ${partidas[i]}`);
       
    }
    
    res.send('guardado'); 
    
});

router.post("/pedidos_check",  async ( req , res )=>{

      let productos_cantidad =  await  pool.query(`select id_partidas_productos,cantidad  
                                             from  pedidos inner join partidas using(id_pedido) 
                                                           inner join partidas_productos using(idPartida) 
                                            where id_pedido = ?`,req.body.num_pedido);
      if(req.body.check == "true"){

        productos_cantidad.forEach( async element => {
             
          await pool.query(`UPDATE partidas_productos SET cantidad_surtida= ${element.cantidad} where id_partidas_productos = ${element.id_partidas_productos}  `); 
             
        });

      }else{

        productos_cantidad.forEach( async element => {
             
          await pool.query(`UPDATE partidas_productos SET cantidad_surtida= 0 where id_partidas_productos = ${element.id_partidas_productos}  `); 
             
        });

      }
      res.send(true);
        // console.log(productos_cantidad);
        
}); 

// Checar
router.post('/cambio_estado', async (req , res)=>{

   switch (req.body.estado_nuevo) {

     case "3":
       
      const completados =    await pool.query(`SELECT count(*) completados FROM pedidos INNER JOIN partidas using(id_pedido) inner join partidas_productos using(idPartida) where id_pedido = ${req.body.order}  and  cantidad_surtida = cantidad `); 
      const totales  = await  pool.query(`SELECT count(*)  totales FROM pedidos INNER JOIN partidas using(id_pedido) inner join partidas_productos using(idPartida) where id_pedido = ${req.body.order}`);
      if(completados[0].completados != totales[0].totales ) return res.send(false);

     break;

   }
     
   let f = new Date();
   let time  = f.getFullYear() + "-" + (f.getMonth() + 1) + "-" + f.getDate() + ' ' + f.getHours() + ':' + f.getMinutes() + ':' + f.getSeconds();
   const empleado  = await pool.query(`select id_empleados from empleados  where idacceso = ? `,req.user[0].idacceso); 
   if(req.body.estado_nuevo == 5 ){

     const idProductosFaltantes = await pool.query(`SELECT id_partidas_productos
                                                    FROM  pedidos  inner join   partidas using(id_pedido) 
                                                                   inner join partidas_productos using(idPartida)
                                                    where id_pedido  = ?`,req.body.order);
      // console.log(idProductosFaltantes);  

      //  se guarda el  faltante en la tabla  
      await pool.query(`INSERT INTO faltantes value (?,?,?,?,?)`,[null,0,time,'','']);
      // Se  obtiene el maximo id de del faltante 
      const idFaltante = await pool.query(`select MAX(idFaltante) idFaltante  from faltantes`);  
     
      //  Se procede a guardar  los faltantes por partidas 
      for (let i = 0; i <  idProductosFaltantes.length; i++) {

        await pool.query(`INSERT INTO  faltantes_partidas  VALUE (?,?,?,?,?)  `,[null,idProductosFaltantes[i].id_partidas_productos,idFaltante[0].idFaltante,0,0]);
    
      }
   }
   const status = await pool.query(`UPDATE pedidos SET estatus = ${req.body.estado_nuevo == 4 ? 3 : req.body.estado_nuevo } WHERE id_pedido = ?`, req.body.order);
   let estado =  req.body.estado_nuevo == 4 ? 3 : req.body.estado_nuevo; 
   let descripcion = ['Se ha creado la orden en el sistema',
   'La orden está siendo surtida en almacen',
   'La orden está lista para ser facturada',
   'La orden ha sido requerida al modulo de compras ',
   'La orden ha sido requerida al modulo de compras',
   'La orden ha sido cancelada',
   'La orden ha sido detenida',
   'La orden esta en proceso de factura',
   'La orden ha sido facturada',
   'La orden está en ruta',
   'La orden ha sido entregada',
   'La orden ha sido suspendida',
   'Se han comprado los faltantes de la orden'];
   await pool.query(`INSERT INTO log VALUES (?,?,?,?,?,?)`,[null,req.body.order,time,req.body.estado_nuevo == 4 ? 3 : req.body.estado_nuevo ,empleado[0].id_empleados,descripcion[estado - 1]]);
   res.send(status);

});

// se hace la búsqueda para los repartidores
router.post('/repartidores' , async( req , res ) =>{
  
  const repartidores = await pool.query(`select  id_empleados , a.nombre , apellido_paterno, apellido_materno
                                          from empleados a inner join empleados_departamentos using(id_empleados)  
                                                           inner join  departamentos b using(id_departamento) 
                                          where  b.nombre = "entregas" `);
  res.send(repartidores);

});

// se  cambia el status de la partidas a en ruta 
router.post('/envioEntregas', async (req , res )=>{

  const pedidos = JSON.parse(req.body.partidas);
  let f = new Date();
  let fecha = f.getFullYear() + "-" + (f.getMonth() + 1) + "-" + f.getDate() + ' ' + f.getHours() + ':' + f.getMinutes();
  const empleado  = await pool.query(`select id_empleados from empleados  where idacceso = ? `,req.user[0].idacceso); 
  for (let i = 0; i < pedidos.length; i++) {
    await pool.query(`UPDATE pedidos SET estatus = 10  WHERE    id_pedido = ? `, pedidos[i]);
    const empleados  = await pool.query(`SELECT nombre, apellido_paterno  FROM empleados where id_empleados  = ${empleado[0].id_empleados} `);
    await pool.query(`INSERT INTO log VALUES (?,?,?,?,?,?)`,[null,pedidos[i],fecha,10,empleado[0].id_empleados,
    `Esta orden ya se encuentra en ruta a acargo del repartidor: ${empleados[0].nombre} ${empleados[0].apellido_paterno} `]);
    let facturas  =  await  pool.query(`SELECT idFacutura FROM  pedidos inner join  facturas using(id_pedido) where id_pedido = ? `,pedidos[i]);
    await pool.query(`INSERT INTO entregas VALUES (?,?,?,?,?,?,?,?)`,[null,req.body.descripcion,req.body.empleado,'','','',facturas[0].idFacutura,pedidos[i]]); 

  }

  

  let  numeroEntrega ;
  for (let i = 0; i < pedidos.length; i++) {

     let  pedido = await pool.query(`SELECT idProducto  
                                     FROM   pedidos inner  join partidas using(id_pedido) 
                                                    inner join partidas_productos using(idPartida)  
                                                    inner join  productos using(idProducto)
                                     WHERE  id_pedido = "${pedidos[i]}" and  cantidad = cantidad_surtida`);
         
       numeroEntrega   = await pool.query(`select idEntregas from entregas where id_pedido = "${pedidos[i]}"`);

      for (let i = 0; i < pedido.length; i++) {

          await pool.query(`INSERT INTO entregas_productos VALUES (null,${numeroEntrega[0].idEntregas},${pedido[i].idProducto})`); 
        
      }
    
  }
  res.send(numeroEntrega[0]);
  
});
// Se  hace el subpedido 
router.post('/subpedidos', async (req , res)=>{


  const pedidos  = await pool.query(`SELECT * FROM  pedidos where id_pedido = ?`, req.body.id);
  console.log(pedidos);
  const cantidad_pedidos   = await pool.query(`SELECT count(*) cantidad_pedidos FROM  pedidos where num_pedido= ?`, pedidos[0].num_pedido);
  let idUpdateLog = pedidos[0].id_pedido, subpedidoOriginal = pedidos[0].num_subpedido  ; 
  pedidos[0].num_subpedido = `${pedidos[0].num_pedido}-sub ${cantidad_pedidos[0].cantidad_pedidos } ` ;
  let f = new Date();
  pedidos[0].idSubpedidos = pedidos[0].id_pedido ;
  pedidos[0].id_pedido = null;
  pedidos[0].estatus = 5;
  pedidos[0].fecha_inicial = f.getFullYear() + "-" + (f.getMonth() + 1) + "-" + f.getDate() + ' ' + f.getHours() + ':' + f.getMinutes() + ':' + f.getSeconds();
  let t = f.getFullYear() + "-" + (f.getMonth() + 1) + "-" + f.getDate() + ' ' + f.getHours() + ':' + f.getMinutes() + ':' + f.getSeconds();
  await pool.query(`INSERT INTO pedidos SET  ? `, pedidos[0]);
  await pool.query(`UPDATE log SET descripcion = " Se ha dividido esta orden  con el #${pedidos[0].num_subpedido} " where  estado  = 3  and   id_pedido = ${idUpdateLog}` );

  const  productos  = await pool.query(`select  id_pedido ,idProducto  ,(cantidad - cantidad_surtida) faltante,cantidad ,cantidad_surtida 
                                        from pedidos inner join partidas using(id_pedido) 
                                                     inner join partidas_productos using(idPartida)
                                        where cantidad != cantidad_surtida  and id_pedido = ?`,req.body.id);
  const empleado  = await pool.query(`select id_empleados from empleados  where idacceso = ? `,req.user[0].idacceso); 
  
  const numeroPedidoNuevo = await  pool.query(`SELECT id_pedido , num_subpedido FROM pedidos where idSubpedidos = ?`,req.body.id);
  let descripcion  =  `Se  ha creado esta sub order con el "#${pedidos[0].num_subpedido }" perteneciente  a la orden #${subpedidoOriginal == null ?pedidos[0].num_pedido:subpedidoOriginal} `;

  await pool.query(`INSERT INTO log VALUES (?,?,?,?,?,?)`,[null,numeroPedidoNuevo[0].id_pedido,t,5,empleado[0].id_empleados,descripcion ]);

  await pool.query(`INSERT INTO partidas  VALUES(?,?,?)`,[null,numeroPedidoNuevo[0].id_pedido,1] ); 
  

  const numeroPartida = await pool.query(`SELECT idPartida  FROM partidas where id_pedido = ? `,numeroPedidoNuevo[0].id_pedido); 
  for (let i = 0; i < productos.length; i++) {
    
    await pool.query(`INSERT INTO partidas_productos VALUES (?,?,?,?,?)`,
    [
      null,
      numeroPartida[0].idPartida,
      productos[i].idProducto,
      productos[i].faltante,
      0
    ]); 
    
  }
  // se consigue el id del la tabla de partidas_producto 
  const idProductos  =  await pool.query(`SELECT id_partidas_productos from partidas_productos where  idPartida = ? `,numeroPartida[0].idPartida);
  
  let time  = f.getFullYear() + "-" + (f.getMonth() + 1) + "-" + f.getDate() + ' ' + f.getHours() + ':' + f.getMinutes() + ':' + f.getSeconds();
  //  se guarda el  faltante en la tabla  
  await pool.query(`INSERT INTO faltantes value (?,?,?,?,?)`,[null,0,time,'','']);
  // Se  obtiene el maximo id de del faltante 
  const idFaltante = await pool.query(`select MAX(idFaltante) idFaltante  from faltantes`);  
 
  //  Se procede a guardar  los faltantes por partidas 
  for (let i = 0; i <  idProductos.length; i++) {
    
    await pool.query(`INSERT INTO  faltantes_partidas  VALUE (?,?,?,?,?)  `,[null,idProductos[i].id_partidas_productos,idFaltante[0].idFaltante,0,null]);

  }


  res.send(numeroPedidoNuevo[0].num_subpedido); 
});

// Descarga el PDF 
router.get('/pdf/:id', (req, res) => {
 
  
    res.download(__dirname + '../../../files/' + req.params.id, req.params.id);

});
module.exports = router;
