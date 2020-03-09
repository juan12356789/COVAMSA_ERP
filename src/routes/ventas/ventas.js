
const express=require("express"); 
const router =  express.Router(); 
const path=require("path"); 
const multer=require("multer"); 
const pool = require('../../database');
const {isLoggedIn}= require('../../lib/auth');
const {format} = require('fecha');  


const  rutimage=path.join(__dirname,"../../files");

const storage=multer.diskStorage({
   destination:function (res,file,cb) {
     cb(null,rutimage)
   }, 
   filename:function (res,file,cb) {
     console.log(file.originalname);
     cb(null,Date.now()+file.originalname); 
   }
 }); 

  const  upload=multer({storage:storage}); 

  router.get('/',isLoggedIn,async(req,res)=>{

    const clientes  = await pool.query("select * from  empleados a inner join clientes b using(id_empleados) where a.idacceso = ?",[req.user[0].idacceso]); 
    res.render('links/ventas/formularioVentas',{clientes});

  });

  router.post('/',async(req,res)=>{
    const clientes  = await pool.query("SELECT * FROM clientes  where  nombre like ?",'%'+[req.body.busqueda]+'%');
     console.log(req.user);  
    res.send(clientes); 

  });

  router.post('/pagos',async(req,res)=>{
    const pagos  =  await pool.query(`SELECT tipo_pago FROM clientes INNER JOIN   preferencias_cliente  USING(idcliente) inner join preferencias_pagos using(idpreferencia) WHERE nombre = ? `,req.body.cliente);
    const all_kind_pagos  =  await pool.query(`SELECT tipo_pago FROM clientes INNER JOIN   preferencias_cliente  USING(idcliente) inner join preferencias_pagos using(idpreferencia)`);  
    pagos.push(all_kind_pagos); 
    console.log(pagos);
    
    res.send(pagos); 
    
    
    
  });

  router.post("/add",upload.array('gimg', 12),async(req,res)=> {
    
    //Ya ssolo falta cambiar los valores cuando haya quedado el  front 
     const {orden,pedido,cliente,ruta,importe,observaciones} = req.body; 
     console.log(req.body);
     
     const cliente_id = await pool.query("SELECT idcliente, id_empleados FROM  empleados a inner join clientes b using(id_empleados) WHERE b.nombre = ?", cliente);
     let fecha = new Date();
      let  insert = {
        id_pedido: null,
        id_empleado: cliente_id[0].id_empleados ,
        idcliente: cliente_id[0].idcliente,
        orden_de_compra: orden,
        ruta: 1,
        estatus: 1,
        ruta_pdf_orden_compra: "files/orden",
        ruta_pdf_pedido:'files/pedido',
        ruta_pdf_comprobante_pago:'files/comprobante',
        num_pedido:pedido,
        observacion: observaciones,
        fecha_inicial: fecha.getFullYear()+'-'+fecha.getMonth()+'-'+fecha.getDay()+' '+fecha.getHours()+':'+fecha.getMinutes()
      };
      console.log(insert);
      
      // await pool.query("INSERT INTO pedidos set ? ",[insert]);
      
      
      req.flash('success','Pedido Guardado' ); 
      res.redirect('/ventas')  ; 
      
  });
module.exports = router; 