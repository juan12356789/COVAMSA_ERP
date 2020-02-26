
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
    res.send(clientes); 

  });



  router.post("/add",upload.array('gimg', 12), async(req,res)=> {

    let data =  JSON.stringify(req.body).toUpperCase();
    let {ORDEN,NUMEROCOTIZACION,NOMBRE,IMPORTE,OBSERVACIONES,RUTA} = JSON.parse(data);
    if(NOMBRE  === undefined)  return; 
    const id  =  await pool.query('SELECT idcliente  FROM clientes where nombre   = ?', [NOMBRE] );
    console.log(req.user);
     
    const idEmpleado  = await  pool.query('SELECT id_empleados from empleados WHERE idacceso  = ?',[req.user[0].idacceso]);    
    console.log(idEmpleado);
  
    let  pedido  = {
        id_pedido:null, 
        id_empleado : idEmpleado[0].id_empleados, //cambiar cuand0 haga el login
        idcliente: id[0].idcliente,
        orden_de_compra: ORDEN,
        ruta: RUTA,
        estatus: 1 ,
        ruta_pdf_orden_compra: req.files[0].filename
        }; 
        
        
        if( /^[0-9a-zA-Z]+$/.test(ORDEN) || /^[0-9a-zA-Z]+$/.test(NUMEROCOTIZACION)) {
          console.log('hola');
          await pool.query("INSERT INTO  pedidos  set ?", [pedido]);
          
         /* const idPedido  = await pool.query('select id_pedido from pedidos where orden_de_compra = ? and cotizacion = ?',[ORDEN,NUMEROCOTIZACION]);

         let infoPedido  = {
          id_informacion_pedido: null, 
          id_pedido: idPedido[0].id_pedido,
          observaciones: OBSERVACIONES,
          importe : IMPORTE,
          fecha_pedido:format(new Date(), 'YYYY-MM-DD'),
          estatus: 1
        }*/
       // await pool.query("INSERT INTO informacion_pedido set ?",[infoPedido]);
        req.flash('success','Pedido Guardado' ); 
        res.redirect('/ventas')  ; 
      }
  });
module.exports = router; 