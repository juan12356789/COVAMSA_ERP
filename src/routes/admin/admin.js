const express=require("express"); 
const router =  express.Router(); 
const path=require("path"); 
const pool = require('../../database');
const { isLoggedIn } = require('../../lib/auth');
router.get('/'  , isLoggedIn,(req , res) =>  res.render('links/admin/admin.hbs') );
router.post('/urgentes' ,  async (req , res)=>{
       
    switch (req.body.tipo_de_pedido) {
        case '1':
            const pedidos  = await pool.query(`SELECT numero_factura,orden_de_compra,ruta,estatus,ruta_pdf_orden_compra,prioridad,ruta_pdf_pedido,ruta_pdf_comprobante_pago ,num_pedido,observacion,DATE_FORMAT(fecha_inicial,'%d-%m-%Y %H:%i %p') fecha_inicial,comprobante_pago,comprobante_pago,concat( "$",FORMAT(importe, 2)) importe,tipo_de_pago
            FROM pedidos  INNER  JOIN empleados  on id_empleado = id_empleados  left join facturas using(id_pedido)
            UNION
            SELECT numero_factura,orden_de_compra,ruta,estatus,ruta_pdf_orden_compra,prioridad,ruta_pdf_pedido,ruta_pdf_comprobante_pago ,num_pedido,observacion,DATE_FORMAT(fecha_inicial,'%d-%m-%Y %H:%i %p') fecha_inicial,comprobante_pago,comprobante_pago,concat( "$",FORMAT(importe, 2)) importe,tipo_de_pago
            FROM pedidos  INNER JOIN empleados  on id_empleado = id_empleados   RIGHT  JOIN  facturas using(id_pedido )
            ORDER BY fecha_inicial ASC`);
           
            res.send(pedidos);
        break;

        case '2':

            const pedidos_con_prioridad  = await pool.query(`SELECT orden_de_compra,ruta,estatus,ruta_pdf_orden_compra,ruta_pdf_pedido,ruta_pdf_comprobante_pago ,num_pedido,observacion,DATE_FORMAT(fecha_inicial,'%d-%m-%Y %H:%i %p') fecha_inicial,comprobante_pago,comprobante_pago,concat( "$",FORMAT(importe, 2)) importe,prioridad ,tipo_de_pago
            FROM pedidos  INNER JOIN empleados  on id_empleado = id_empleados
            WHERE prioridad = 1 
            ORDER BY fecha_inicial ASC`);
            res.send(pedidos_con_prioridad);
            
        break;
            
        case '3':

            await pool.query(`UPDATE pedidos SET prioridad= ${req.body.tipo_prioridad} where num_pedido = ?`,req.body.numero_pedido); 
            res.send(req.body.tipo_prioridad); 

        break;  
    }
       
});

router.post('/data' , async (req , res )=>{
            const productos  = await pool.query("select clave , nombre from productos "); 
            res.send(productos);

}); 

router.post('/cliente' , async (req , res )=>{
    const clientes  = await pool.query("select nombre,numero_interno from clientes "); 
    res.send(clientes);

}); 



module.exports = router;   