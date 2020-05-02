const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const pool = require('../../database');
const nodemailer = require('nodemailer');
const { isLoggedIn } = require('../../lib/auth');

const rutimage = path.join(__dirname, "../../files");

const storage = multer.diskStorage({
    destination: function(res, file, cb) {
        cb(null, rutimage)
    },
    filename: function(res, file, cb) {

        cb(null, Date.now() + file.originalname);
    }
});

const upload = multer({ storage: storage })

router.get('/', isLoggedIn, async(req, res) => {

    res.render('links/ventas/formularioVentas');
});



router.post('/', async(req, res) => {
    console.log(req.body.words);
    let clientes ; 
   if(req.body.words != undefined && req.body.words != ''){
         clientes = await pool.query("SELECT * FROM clientes  where  nombre like ?", '%' + [req.body.words] + '%');
   }else{
        clientes = await pool.query("SELECT * FROM clientes"  );
   }

    res.send(clientes);

});

router.post('/pagos', async(req, res) => {
    const pagos = await pool.query(`SELECT tipo_pago FROM clientes INNER JOIN   preferencias_cliente  USING(idcliente) inner join preferencias_pagos using(idpreferencia) WHERE nombre = ? `, req.body.cliente);
    const all_kind_pagos = await pool.query(`SELECT tipo_pago FROM clientes INNER JOIN   preferencias_cliente  USING(idcliente) inner join preferencias_pagos using(idpreferencia)`);
    pagos.push(all_kind_pagos);
    res.send(pagos);

});





router.post("/add", upload.array('gimg', 12), async(req, res) => {

    if (req.body.nombre != undefined && req.body.nombre != ' ') {
        console.log(req.body);


        const cliente_id = await pool.query("SELECT idcliente, id_empleados FROM  empleados a inner join clientes b using(id_empleados) WHERE b.nombre = ?", req.body.nombre);

        let f = new Date();
        const insert = {
            id_pedido: null,
            id_empleado: cliente_id[0].id_empleados,
            idcliente: cliente_id[0].idcliente,
            orden_de_compra: req.body.orden,
            ruta: req.body.ruta,
            estatus: 1,
            ruta_pdf_orden_compra: req.files[0].filename,
            ruta_pdf_pedido: req.files[1].filename,
            ruta_pdf_comprobante_pago: req.files[2].filename,
            num_pedido: req.body.numeroPedido,
            observacion: req.body.observaciones,
            fecha_inicial: f.getFullYear() + "-" + (f.getMonth() + 1) + "-" + f.getDate() + ' ' + f.getHours() + ':' + f.getMinutes(),
            comprobante_pago: req.body.comprobante_pago,
            importe: req.body.importe,
            prioridad: req.body.prioridad
        };
        await pool.query("INSERT INTO pedidos set ? ", [insert]);

        const pedidos = await pool.query(`SELECT orden_de_compra,ruta,estatus,ruta_pdf_orden_compra,ruta_pdf_pedido,ruta_pdf_comprobante_pago ,num_pedido,observacion,DATE_FORMAT(fecha_inicial,'%y-%m-%d %H:%i %p') fecha_inicial,comprobante_pago,importe 
                                        FROM pedidos`);
        res.send(pedidos);

    } else {

        res.send(false);

    }

});

router.post('/pedidos_vendedor', async(req, res) => {

    const ordenes_vendedores = await pool.query(`SELECT orden_de_compra,ruta,estatus,ruta_pdf_orden_compra,ruta_pdf_pedido,ruta_pdf_comprobante_pago ,num_pedido,observacion,DATE_FORMAT(fecha_inicial,'%Y-%m-%d %H:%i %p') fecha_inicial,comprobante_pago,importe 
                                                FROM pedidos  INNER JOIN empleados  on id_empleado = id_empleados
                                                WHERE idacceso = ? 
                                                ORDER BY fecha_inicial ASC`, req.user[0].idacceso);
    res.send(ordenes_vendedores);
});


router.post('/cancel', async(req, res) => {

    await pool.query(`update pedidos set estatus = 6 , motivo_de_cancelacion = '${req.body.reason}' where  num_pedido  = ?`, req.body.data);

    res.send('Guardado');

});

module.exports = router;

//avance rleo