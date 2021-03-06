const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const pool = require('../../database');
const { isLoggedIn } = require('../../lib/auth');
const upl = require('express-fileupload');
const importExcel  =  require('convert-excel-to-json');
const fs = require('fs');
const rutimage = path.join(__dirname, "../../files");
const upFormats = require('express-fileupload');

const storage = multer.diskStorage({
    destination: function(res, file, cb) {
        cb(null, rutimage)
    },
    filename: function(res, file, cb) {

        cb(null, Date.now() + file.originalname);
    }
});

const upload = multer({ storage: storage });


router.get('/', isLoggedIn, async(req, res) => {

    const permisoUsuario = await pool.query(`SELECT tipo_usuario  FROM acceso WHERE idacceso = ?`,req.user[0].idacceso);
    if(permisoUsuario[0].tipo_usuario == 'Administrador' || permisoUsuario[0].tipo_usuario == "Ventas" ) return res.render('links/ventas/formularioVentas');
    res.redirect('/menu');
    
});

router.post('/', async(req, res) => {
    
    let clientes;
    const empleado_id = await pool.query("SELECT id_empleados from empleados inner join acceso using(idacceso) where idacceso  = ?",req.user[0].idacceso);    
    if (req.body.validaciones ==  1) {
        clientes = await pool.query(`SELECT * FROM clientes  where  id_empleados = ${empleado_id[0].id_empleados}  and nombre like ?`, '%' + [req.body.words] + '%' );
    } else {
        clientes = await pool.query("SELECT * FROM clientes where id_empleados = ?",empleado_id[0].id_empleados);
    }

    res.send(clientes);

});


router.post('/pagos', async(req, res) => {
    const pagos = await pool.query(`SELECT tipo_pago FROM clientes INNER JOIN   preferencias_cliente  USING(idcliente) inner join preferencias_pagos using(idpreferencia) WHERE nombre = ? `, req.body.cliente);
    const all_kind_pagos = await pool.query(`SELECT tipo_pago FROM clientes INNER JOIN   preferencias_cliente  USING(idcliente) inner join preferencias_pagos using(idpreferencia)`);
    pagos.push(all_kind_pagos);
    res.send(pagos);

});

router.post('/importe', async(req, res) => {
    const monto = await pool.query(`SELECT format(importe,2,'DE_USD') FROM PEDIDOS`, req.body.importe);
    res.send(monto);

});

router.post("/updateTrasferencia", async(req , res)=>{
    let file = req.files.excel;
    let filename = file.name;
        const  updateComprobante  =  await pool.query(`UPDATE pedidos SET comprobante_pago='${req.body.comprobante_pago}'  ,ruta_pdf_comprobante_pago='${req.files.comprobante_pago[0].filename}', estatus = 1 WHERE num_pedido = ?`,req.body.num_pedido); 
        res.end(req.body.comprobante_pago);
    

}); 
// se   usa para confirmar que la  se muestre la  ventana modal en la sesion que debe de ser
router.post('/notificacionEntregado',  async (req , res)=>{

    const comprobarVentana  = await pool.query(` SELECT * FROM empleados inner join pedidos on id_empleados = id_empleado where idacceso = ? and num_pedido = ?`,[req.user[0].idacceso,req.body.id]); 
    if(comprobarVentana.length > 0 )  return res.send( true ) ;
    res.send(false);
    
}) ;

router.post('/log' , async (req , res )=>{

        const log = await pool.query(`SELECT  IF(prioridadE = 0,'Sí','No') entrega ,if(prioridad = 0,"Normal","Urgente") prioridad,
		                                      DATE_FORMAT( cambio_estado,'%d-%m-%Y %H:%i:%s %p')  fecha ,estado,nombre,descripcion
                                      FROM  pedidos  inner join  log  using(id_pedido) 
		                                             inner join empleados e  using(id_empleados) 
                                      where id_pedido = ?`,req.body.id);
        res.send(log);

});

router.post("/add",  upload.fields([{ name: 'orden_compra', maxCount: 1  }, { name: 'num_pedido', maxCount: 1 },{ name: 'comprobante_pago', maxCount: 1 }]),async(req, res) => {
   
    // const validacion_pedido_existente  = await pool.query("select id_pedido from pedidos where num_pedido = ?", req.body.numeroPedido); 
    const partidas_info   =  JSON.parse(req.body.productosArray);
    if (req.body.nombre_cliente != undefined && req.body.nombre != ' '  && req.body.observaciones.length < 250 ) {
        const cliente_id = await pool.query("SELECT idcliente, id_empleados FROM  empleados a inner join clientes b using(id_empleados) WHERE b.nombre = ?", req.body.nombre_cliente);
        let f = new Date();
        let time =  f.getFullYear() + "-" + (f.getMonth() + 1) + "-" + f.getDate() + ' ' + f.getHours() + ':' + f.getMinutes() + ':' + f.getSeconds();
        const insert = {
            id_pedido: null,
            id_empleado: cliente_id[0].id_empleados,
            idcliente: cliente_id[0].idcliente,
            orden_de_compra: req.body.orden != undefined?req.body.orden:'' ,
            ruta: req.body.ruta,
            estatus: (req.body.tipos_pago == 1  && req.body.comprobante_pago == '')? 7 : 1 ,
            ruta_pdf_orden_compra: req.files.orden_compra != undefined? req.files.orden_compra[0].filename: '',
            ruta_pdf_pedido: partidas_info.ruta  ,
            ruta_pdf_comprobante_pago: req.files.comprobante_pago != undefined? req.files.comprobante_pago[0].filename: '',
            num_pedido: req.body.numeroPedido,
            observacion: req.body.observaciones,
            fecha_inicial:time ,
            comprobante_pago: req.body.comprobante_pago != undefined && req.body.comprobante_pago ?req.body.comprobante_pago:'' ,
            importe: req.body.importe,
            prioridad: req.body.prioridad[0],
            tipo_de_pago:req.body.tipos_pago,
            numero_partidas : partidas_info.Hoja1[partidas_info.Hoja1.length - 1].numero_partidas,
            prioridadE: req.body.entrega  
        };
        const validacion_pedidio = await pool.query(`SELECT id_pedido from pedidos where  num_pedido = ?` , req.body.numeroPedido); 
        const empleado  = await pool.query(`select id_empleados from empleados  where idacceso = ? `,req.user[0].idacceso); 

        if (validacion_pedidio.length == 0) {
            let descipcionNuevaOrden  = `se ha creado la  orden en el sistema con el número  de pedido #${req.body.numeroPedido}`;

             await pool.query("INSERT INTO pedidos set ? ", [insert]);
             await pool.query(`INSERT INTO  partidas VALUES (null,(select id_pedido from pedidos where num_pedido = "${req.body.numeroPedido}" ),1)`); 


             const partidas_pedido  = await pool.query("SELECT a.id_pedido, idPartida FROM  pedidos a inner join partidas  using(id_pedido) where num_pedido = ?",req.body.numeroPedido); 
             await pool.query(`INSERT INTO log VALUES (?,?,?,?,?,?)`,[null,partidas_pedido[0].id_pedido,time,(req.body.tipos_pago == 1  && req.body.comprobante_pago == '')? 7 : 1,empleado[0].id_empleados,descipcionNuevaOrden ]);
             let cont_partidas = -1; 
             for (let i = 4; i < partidas_info.Hoja1.length; i++) {

                 let producto = await pool.query("SELECT idProducto from productos where clave = ?" , [partidas_info.Hoja1[i].B]);

                 if(producto.length == 0 &&  partidas_info.Hoja1[i].B != undefined ){
                     await pool.query(`INSERT INTO  productos VALUES (?,?,?) `,[partidas_info.Hoja1[i].B,partidas_info.Hoja1[i].D,null]);

                     let productoG = await pool.query("SELECT idProducto from productos where clave = ?" , [partidas_info.Hoja1[i].B]);
                     if(productoG.length !=  0)   await pool.query(`INSERT INTO partidas_productos VALUES (null , ${partidas_pedido[0].idPartida} , ${productoG[0].idProducto},${parseInt(partidas_info.Hoja1[i].A)},${0}) `);

                 }else{

                     if(producto.length != 0)   await pool.query(`INSERT INTO partidas_productos VALUES (null , ${partidas_pedido[0].idPartida} , ${producto[0].idProducto},${parseInt(partidas_info.Hoja1[i].A)},${0}) `);

                 }                
             }

    }else{
            let descripcionLogActualizar  = `Se ha actualizado la información de la orden de compra cambiando su estado a nuevo`;
            await pool.query(`UPDATE pedidos  
                              SET id_empleado = ${insert.id_empleado},idcliente = ${insert.idcliente},orden_de_compra='${insert.orden_de_compra}',
                                   ruta=${insert.ruta},estatus =${insert.estatus},ruta_pdf_orden_compra='${insert.ruta_pdf_orden_compra}',ruta_pdf_pedido ='${insert.ruta_pdf_pedido}',
                                   ruta_pdf_comprobante_pago = '${insert.ruta_pdf_orden_compra}',num_pedido ='${insert.num_pedido}',observacion='${insert.observacion}',fecha_inicial='${insert.fecha_inicial}',
                                   comprobante_pago='${insert.comprobante_pago}',importe =${insert.importe},motivo_de_cancelacion='',prioridad=${insert.prioridad},tipo_de_pago=${insert.tipo_de_pago},numero_partidas=${insert.numero_partidas},
                                   prioridadE=${insert.prioridadE} 
                              where id_pedido = ${validacion_pedidio[0].id_pedido} `);
                 
                
             const partidas_pedido  = await pool.query("SELECT a.id_pedido, idPartida FROM  pedidos a inner join partidas  using(id_pedido) where num_pedido = ?",req.body.numeroPedido); 
             await pool.query(`DELETE FROM partidas_productos where idPartida  = ${partidas_pedido[0].idPartida}`);

             await pool.query(`INSERT INTO log VALUES (?,?,?,?,?,?)`,[null,partidas_pedido[0].id_pedido,time,(req.body.tipos_pago == 1  && req.body.comprobante_pago == '')? 7 : 1,empleado[0].id_empleados,descripcionLogActualizar]);
             let cont_partidas = -1; 
             for (let i = 4; i < partidas_info.Hoja1.length; i++) {
                
                 let producto = await pool.query("SELECT idProducto from productos where clave = ?" , [partidas_info.Hoja1[i].B]);
                
                 if(producto.length == 0 &&  partidas_info.Hoja1[i].B != undefined ){
                     await pool.query(`INSERT INTO  productos VALUES (?,?,?) `,[partidas_info.Hoja1[i].B,partidas_info.Hoja1[i].D,null]);
                    
                     let productoG = await pool.query("SELECT idProducto from productos where clave = ?" , [partidas_info.Hoja1[i].B]);
                     if(productoG.length !=  0)   await pool.query(`INSERT INTO partidas_productos VALUES (null , ${partidas_pedido[0].idPartida} , ${productoG[0].idProducto},${parseInt(partidas_info.Hoja1[i].A)},${0}) `);
                    
                 }else{
                    
                     if(producto.length != 0)   await pool.query(`INSERT INTO partidas_productos VALUES (null , ${partidas_pedido[0].idPartida} , ${producto[0].idProducto},${parseInt(partidas_info.Hoja1[i].A)},${0}) `);
                     
                 }                
             }

    }
        const pedidos = await pool.query(`SELECT orden_de_compra,ruta,estatus,ruta_pdf_orden_compra,ruta_pdf_pedido,ruta_pdf_comprobante_pago ,num_pedido,observacion,DATE_FORMAT(fecha_inicial,'%y-%m-%d %H:%i %p') fecha_inicial,comprobante_pago,importe 
                                        FROM pedidos`);

        const numeroRastreo = await pool.query(`SELECT num_pedido from pedidos where num_pedido = ?`,req.body.numeroPedido);
        
        res.send(numeroRastreo); 

    } else {

        res.send(false);
    }

});



router.post('/pedidos_vendedor', async(req, res) => {

    const usario_permiso = await pool.query(`SELECT tipo_usuario 
                                             FROM  acceso  
                                             where idacceso = ? AND tipo_usuario  = 'Administrador' `,req.user[0].idacceso);

    if(usario_permiso.length != 0){

        const ordenes_vendedores = await pool.query(`SELECT id_pedido,num_subpedido,prioridadE,numero_factura,orden_de_compra,ruta,estatus,ruta_pdf_orden_compra,prioridad,ruta_pdf_pedido,ruta_pdf_comprobante_pago ,num_pedido,observacion,DATE_FORMAT(fecha_inicial,'%d-%m-%Y %H:%i %p') fecha_inicial,comprobante_pago,comprobante_pago,concat( "$",FORMAT(importe, 2)) importe,tipo_de_pago
                                                     FROM pedidos  INNER  JOIN empleados  on id_empleado = id_empleados  left join facturas using(id_pedido)
                                                     UNION
                                                     SELECT id_pedido,num_subpedido,prioridadE,numero_factura,orden_de_compra,ruta,estatus,ruta_pdf_orden_compra,prioridad,ruta_pdf_pedido,ruta_pdf_comprobante_pago ,num_pedido,observacion,DATE_FORMAT(fecha_inicial,'%d-%m-%Y %H:%i %p') fecha_inicial,comprobante_pago,comprobante_pago,concat( "$",FORMAT(importe, 2)) importe,tipo_de_pago
                                                     FROM pedidos  INNER JOIN empleados  on id_empleado = id_empleados   RIGHT  JOIN  facturas using(id_pedido )
                                                     ORDER BY fecha_inicial ASC `);
                            
        return res.send(ordenes_vendedores); 

    }

    const ordenes_vendedores = await pool.query(`SELECT id_pedido,num_subpedido,prioridadE,numero_factura,orden_de_compra,ruta,estatus,ruta_pdf_orden_compra,prioridad,ruta_pdf_pedido,ruta_pdf_comprobante_pago ,num_pedido,observacion,DATE_FORMAT(fecha_inicial,'%d-%m-%Y %H:%i %p') fecha_inicial,comprobante_pago,comprobante_pago,concat( "$",FORMAT(importe, 2)) importe,tipo_de_pago
                                                 FROM pedidos  INNER  JOIN empleados  on id_empleado = id_empleados  left join facturas using(id_pedido)
                                                 WHERE idacceso = ${req.user[0].idacceso}
                                                 UNION
                                                 SELECT id_pedido,num_subpedido,prioridadE,numero_factura,orden_de_compra,ruta,estatus,ruta_pdf_orden_compra,prioridad,ruta_pdf_pedido,ruta_pdf_comprobante_pago ,num_pedido,observacion,DATE_FORMAT(fecha_inicial,'%d-%m-%Y %H:%i %p') fecha_inicial,comprobante_pago,comprobante_pago,concat( "$",FORMAT(importe, 2)) importe,tipo_de_pago
                                                 FROM pedidos  INNER JOIN empleados  on id_empleado = id_empleados   RIGHT  JOIN  facturas using(id_pedido )
                                                 WHERE idacceso = ${req.user[0].idacceso}
                                                 ORDER BY fecha_inicial ASC `);
    res.send(ordenes_vendedores);
});


router.post('/cancel', async(req, res) => {

    let f = new Date();
    let descripcioCancelar  = `La orden de compra ha sido cancelada por el siguiente motivo "${req.body.reason}" `;
    let time =  f.getFullYear() + "-" + (f.getMonth() + 1) + "-" + f.getDate() + ' ' + f.getHours() + ':' + f.getMinutes() + ':' + f.getSeconds();
    await pool.query(`update pedidos set estatus = 6 , motivo_de_cancelacion = '${req.body.reason}' where  id_pedido  = ?`, req.body.data);
    const empleado  = await pool.query(`select id_empleados from empleados  where idacceso = ? `,req.user[0].idacceso); 
    await pool.query(`INSERT INTO log VALUES (?,?,?,?,?,?)`,[null,req.body.data,time,6,empleado[0].id_empleados,descripcioCancelar]);
    res.send('Guardado');

});

module.exports = router;

