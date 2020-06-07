const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const pool = require('../../database');
const { isLoggedIn } = require('../../lib/auth');
const upl = require('express-fileupload');
const importExcel = require('convert-excel-to-json');
const fs = require('fs');
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

    let clientes;
    const empleado_id = await pool.query("SELECT id_empleados from empleados inner join acceso using(idacceso) where idacceso  = ?", req.user[0].idacceso);
    if (req.body.validaciones == 1) {
        clientes = await pool.query(`SELECT * FROM clientes  where  id_empleados = ${empleado_id[0].id_empleados}  and nombre like ?`, '%' + [req.body.words] + '%');
    } else {
        clientes = await pool.query("SELECT * FROM clientes where id_empleados = ?", empleado_id[0].id_empleados);
    }

    res.send(clientes);

});


router.post('/excel', (req, res) => {
    let file = req.files.excel;
    let filename = file.name;

    file.mv('./excel/' + filename, async(err) => {

        if (err) {

            console.log(err);

        } else {
            let result = importExcel({
                sourceFile: './excel/' + filename,
                // header:{rows:15},
                // columnTokey:{B:'cantidad',C:'Clave',F:'Descripción',O:'Importe'},
                sheets: ['Sheet1']
            });

            const infoPedidos = {
                cotizacion: '',
                fecha: '',
                cliente: '',
                vendedor: '',
                total: ''
            };

            for (let i = 0; i < result.Sheet1.length; i++) {

                if (result.Sheet1[i].M == 'COTIZACIÓN No. :') infoPedidos.cotizacion = result.Sheet1[i].O;
                if (result.Sheet1[i].M == 'Fecha') infoPedidos.fecha = result.Sheet1[i].O;
                if (result.Sheet1[i].B == 'Cliente:') infoPedidos.cliente = result.Sheet1[i].D;
                if (result.Sheet1[i].B == 'Vendedor :') infoPedidos.vendedor = result.Sheet1[i].C;
                if (result.Sheet1[i].K == 'Total') infoPedidos.total = result.Sheet1[i].O;

            }
            console.log(infoPedidos);
            const cliente = await pool.query("SELECT nombre FROM clientes where numero_interno = ?", infoPedidos.cliente);

            infoPedidos.cliente = cliente[0].nombre;
            res.send(infoPedidos);
        }
    });
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

router.post("/updateTrasferencia", upload.fields([{ name: 'comprobante_pago', maxCount: 1 }]), async(req, res) => {
    console.log(req.files);
    console.log(req.body);
    const updateComprobante = await pool.query(`UPDATE pedidos SET comprobante_pago='${req.body.comprobante_pago}'  ,ruta_pdf_comprobante_pago='${req.files.comprobante_pago[0].filename}', estatus = 1 WHERE num_pedido = ?`, req.body.num_pedido);
    res.end(req.body.comprobante_pago);



});

router.post("/add", upload.fields([{ name: 'orden_compra', maxCount: 1 }, { name: 'num_pedido', maxCount: 1 }, { name: 'comprobante_pago', maxCount: 1 }]), async(req, res) => {
    console.log(req.body);

    if (req.body.nombre != undefined && req.body.nombre != ' ' && req.files.num_pedido != undefined && req.body.observaciones.length < 250) {
        const cliente_id = await pool.query("SELECT idcliente, id_empleados FROM  empleados a inner join clientes b using(id_empleados) WHERE b.nombre = ?", req.body.nombre);
        let f = new Date();
        const insert = {
            id_pedido: null,
            id_empleado: cliente_id[0].id_empleados,
            idcliente: cliente_id[0].idcliente,
            orden_de_compra: req.body.orden != undefined ? req.body.orden : '',
            ruta: req.body.ruta,
            estatus: (req.body.tipos_pago == 1 && req.body.comprobante_pago == '') ? 7 : 1,
            ruta_pdf_orden_compra: req.files.orden_compra != undefined ? req.files.orden_compra[0].filename : '',
            ruta_pdf_pedido: req.files.num_pedido != undefined ? req.files.num_pedido[0].filename : '',
            ruta_pdf_comprobante_pago: req.files.comprobante_pago != undefined ? req.files.comprobante_pago[0].filename : '',
            num_pedido: req.body.numeroPedido,
            observacion: req.body.observaciones,
            fecha_inicial: f.getFullYear() + "-" + (f.getMonth() + 1) + "-" + f.getDate() + ' ' + f.getHours() + ':' + f.getMinutes(),
            comprobante_pago: req.body.comprobante_pago != undefined && req.body.comprobante_pago ? req.body.comprobante_pago : '',
            importe: req.body.importe,
            prioridad: req.body.prioridad,
            prioridadE: req.body.prioridadE,
            tipo_de_pago: req.body.tipos_pago
        };

        await pool.query("INSERT INTO pedidos set ? ", [insert]);

        const pedidos = await pool.query(`SELECT orden_de_compra,ruta,estatus,ruta_pdf_orden_compra,ruta_pdf_pedido,ruta_pdf_comprobante_pago ,num_pedido,prioridadE,observacion,DATE_FORMAT(fecha_inicial,'%y-%m-%d %H:%i %p') fecha_inicial,comprobante_pago,importe 
                                        FROM pedidos`);
        res.send(pedidos);

    } else {

        res.send(false);
    }

});



router.post('/pedidos_vendedor', async(req, res) => {

    const ordenes_vendedores = await pool.query(`SELECT orden_de_compra,ruta,estatus,ruta_pdf_orden_compra,prioridad,ruta_pdf_pedido,ruta_pdf_comprobante_pago ,num_pedido,observacion,DATE_FORMAT(fecha_inicial,'%d-%m-%Y %H:%i %p') fecha_inicial,comprobante_pago,comprobante_pago,concat( "$",FORMAT(importe, 2)) importe,tipo_de_pago FROM pedidos  INNER JOIN empleados  on id_empleado = id_empleados WHERE idacceso = ? ORDER BY fecha_inicial ASC`, req.user[0].idacceso);
    res.send(ordenes_vendedores);
});


router.post('/cancel', async(req, res) => {

    await pool.query(`update pedidos set estatus = 6 , motivo_de_cancelacion = '${req.body.reason}' where  num_pedido  = ?`, req.body.data);

    res.send('Guardado');

});

module.exports = router;