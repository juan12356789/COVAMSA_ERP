const express=require("express"); 
const router =  express.Router(); 
const path=require("path"); 
const pool = require('../../database');

router.get('/'  , (req , res) =>  res.render('links/admin/admin.hbs') );

router.post('/urgentes' ,  async (req , res)=>{
        
        if( req.body.tipo_de_pedido == 2 ){

            const pedidos_con_prioridad  = await pool.query(`SELECT orden_de_compra,ruta,estatus,ruta_pdf_orden_compra,ruta_pdf_pedido,ruta_pdf_comprobante_pago ,num_pedido,observacion,DATE_FORMAT(fecha_inicial,'%Y-%m-%d %H:%i %p') fecha_inicial,comprobante_pago,importe 
                                                          FROM pedidos  INNER JOIN empleados  on id_empleado = id_empleados
                                                          WHERE prioridad = 1 
                                                          ORDER BY fecha_inicial ASC`);
            res.send(pedidos_con_prioridad);

        }else{

            const pedidos  = await pool.query(`SELECT orden_de_compra,ruta,estatus,ruta_pdf_orden_compra,ruta_pdf_pedido,ruta_pdf_comprobante_pago ,num_pedido,observacion,DATE_FORMAT(fecha_inicial,'%Y-%m-%d %H:%i %p') fecha_inicial,comprobante_pago,importe 
                                                          FROM pedidos  INNER JOIN empleados  on id_empleado = id_empleados 
                                                          ORDER BY fecha_inicial ASC`);
            res.send(pedidos);

        }
       
});



module.exports = router;   