const express=require("express"); 
const router =  express.Router(); 
const path=require("path"); 
const multer=require("multer"); 
const pool = require('../../database');
router.get('/',async (req,res)=>{
    
    res.render('links/almacen/pedidos');

});

router.get('/pedidos',async(req,res)=>{
    const pedidos  = await  pool.query(`SELECT orden_de_compra,ruta,estatus,ruta_pdf_orden_compra,ruta_pdf_pedido,ruta_pdf_comprobante_pago ,num_pedido,observacion,fecha_inicial,comprobante_pago,importe
                                        FROM pedidos WHERE
                                        DATE_FORMAT(fecha_inicial,'%y-%m-%d') = curdate()  `);
    console.log(pedidos);
    
});
// Descarga el PDF 
router.get('/pdf/:id',(req,res)=>{

res.download(__dirname+'../../../files/'+req.params.id,req.params.id ); 

});
module.exports = router; 