
const express=require("express"); 
const router =  express.Router(); 
const path=require("path"); 
const multer=require("multer"); 
const pool = require('../../database');
const {isLoggedIn}= require('../../lib/auth');

const  rutimage=path.join(__dirname,"../../files");

const storage=multer.diskStorage({
   destination:function (res,file,cb) {
     cb(null,rutimage)
   }, 
   filename:function (res,file,cb) {
     file.originalname = ''; 
     cb(null,Date.now()+file.originalname); 
   }
 }); 

  const  upload=multer({storage:storage})

  router.get('/',isLoggedIn,async(req,res)=>{

    res.render('links/ventas/formularioVentas');
  });


  router.post('/',async(req,res)=>{
    console.log(req.body);
    let clientes;
   
     clientes  = await pool.query("SELECT * FROM clientes  where  nombre like ?",'%'+[req.body.words]+'%');
    
    
  
    res.send(clientes); 

  });

  router.post('/pagos',async(req,res)=>{
    const pagos  =  await pool.query(`SELECT tipo_pago FROM clientes INNER JOIN   preferencias_cliente  USING(idcliente) inner join preferencias_pagos using(idpreferencia) WHERE nombre = ? `,req.body.cliente);
    const all_kind_pagos  =  await pool.query(`SELECT tipo_pago FROM clientes INNER JOIN   preferencias_cliente  USING(idcliente) inner join preferencias_pagos using(idpreferencia)`);  
    pagos.push(all_kind_pagos); 
    res.send(pagos); 
  
  });

  router.post("/add",upload.array('gimg', 12),async(req,res)=> {
    console.log(Object.keys(req.body).length);
        console.log(req.body);
        
    if (req.body.nombre != undefined  &&  req.body.nombre != ' ' ){
      console.log('hola');
      
      const cliente_id = await pool.query("SELECT idcliente, id_empleados FROM  empleados a inner join clientes b using(id_empleados) WHERE b.nombre = ?", req.body.nombre );
  
        let f= new Date();
        const   insert = {
          id_pedido: null,  
          id_empleado: cliente_id[0].id_empleados ,
          idcliente: cliente_id[0].idcliente,
          orden_de_compra: req.body.orden,
          ruta: req.body.ruta,
          estatus: 1,
          ruta_pdf_orden_compra: req.files[0].filename,
          ruta_pdf_pedido:req.files[1].filename,
          ruta_pdf_comprobante_pago:req.files[2].filename,
          num_pedido:req.body.numeroPedido,
          observacion: req.body.observaciones,
          fecha_inicial: f.getFullYear() + "-" + (f.getMonth() +1) + "-" +f.getDate()+' '+f.getHours()+':'+f.getMinutes(),
          comprobante_pago: req.body.comprobante_pago,
          importe:req.body.importe 
        }; 
        await pool.query("INSERT INTO pedidos set ? ",[insert]);
        const pedidos = await pool.query(`SELECT orden_de_compra,ruta,estatus,ruta_pdf_orden_compra,ruta_pdf_pedido,ruta_pdf_comprobante_pago ,num_pedido,observacion,fecha_inicial,comprobante_pago,importe
                                        FROM pedidos`);
        res.send(pedidos); 
    }else{
      res.send(false);
    }
        
  });

// cambiar la fecha 

  router.get('/pedidos', async (req,res)=>{
      
      res.send(pedidos);
  });
module.exports = router; 