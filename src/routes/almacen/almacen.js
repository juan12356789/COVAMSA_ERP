const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const pool = require('../../database');
const { ALPN_ENABLED } = require("constants");
const { route } = require("../menu/menu");

router.get('/', async(req, res) => {

    res.render('links/almacen/pedidos');

});

router.get('/pedidos', async(req, res) => {

    const pedidos = await pool.query(`SELECT orden_de_compra,ruta,estatus,ruta_pdf_orden_compra,ruta_pdf_pedido,ruta_pdf_comprobante_pago ,num_pedido,observacion,DATE_FORMAT(fecha_inicial,'%d-%m-%Y %H:%i %p') fecha_inicial,comprobante_pago,prioridadE,concat( "$",FORMAT(importe, 2)) importe,prioridad
                                      FROM pedidos WHERE estatus != 7
                                      order by prioridad desc,fecha_inicial asc`);

    res.send(pedidos);
});

router.post('/partidas', async(req, res) => {
    const partidas = await pool.query("select  id_partidas_productos,cantidad_surtida,idPartida, b.status, clave ,prioridadE, nombre, cantidad from pedidos inner  join   partidas b using(id_pedido) inner join partidas_productos using(idPartida) inner join  productos using(idProducto) where num_pedido =?", req.body.pedido);
    res.send(partidas);

});
router.post('/cantidad_pedido', async(req, res) => {

    if (req.body.op == "true") await pool.query(`UPDATE partidas_productos SET cantidad_surtida = ${req.body.numero}  WHERE id_partidas_productos = ${req.body.id}`);
    if (req.body.op == "false") await pool.query(`UPDATE partidas_productos SET cantidad_surtida = 0 WHERE id_partidas_productos = ${req.body.id}`);
    res.send('guardado');

});

router.post("/pedidos_check", async(req, res) => {

    let productos_cantidad = await pool.query(`select id_partidas_productos,cantidad  
                                             from  pedidos inner join partidas using(id_pedido) 
                                                           inner join partidas_productos using(idPartida) 
                                            where num_pedido = ?`, req.body.num_pedido);
    productos_cantidad.forEach(async element => {

        await pool.query(`UPDATE partidas_productos SET cantidad_surtida= ${element.cantidad} where id_partidas_productos = ${element.id_partidas_productos}  `);

    });
    res.send(true);
    // console.log(productos_cantidad);


});

// Checar
router.post('/cambio_estado', async(req, res) => {

    switch (req.body.estado_nuevo) {
        case "3":
            const completados = await pool.query(`SELECT count(*) completados FROM pedidos INNER JOIN partidas using(id_pedido) inner join partidas_productos using(idPartida) where num_pedido = "${req.body.order}"  and  cantidad_surtida = cantidad `);
            const totales = await pool.query(`SELECT count(*)  totales FROM pedidos INNER JOIN partidas using(id_pedido) inner join partidas_productos using(idPartida) where num_pedido = "${req.body.order}"`);
            if (completados[0].completados != totales[0].totales) return res.send(false);
            break;
    }
    const status = await pool.query(`UPDATE pedidos SET estatus = ${req.body.estado_nuevo} WHERE num_pedido = ?`, req.body.order);
    res.send(status);
});

// se hace la búsqueda para los repartidores
router.post('/repartidores', async(req, res) => {

    const repartidores = await pool.query(`select  id_empleados , a.nombre , apellido_paterno, apellido_materno
                                          from empleados a inner join empleados_departamentos using(id_empleados)  
                                                           inner join  departamentos b using(id_departamento) 
                                          where  b.nombre = "entregas" `);
    res.send(repartidores);

});

// se  cambia el status de la partidas a en ruta 
router.post('/envioEntregas', async(req, res) => {

    const pedidos = JSON.parse(req.body.partidas);
    for (let i = 0; i < pedidos.length; i++) {
        await pool.query(`UPDATE pedidos SET estatus = 10 WHERE num_pedido = ? `, pedidos[i]);
        await pool.query(`INSERT INTO entregas VALUES (?,?,?,?,?,?)`, [null, req.body.descripcion, req.body.empleado, pedidos[i], '', '']);

    }

    for (let i = 0; i < pedidos.length; i++) {
        let pedido = await pool.query(`SELECT idProducto  
                                  FROM   pedidos inner  join partidas using(id_pedido) 
                                                 inner join partidas_productos using(idPartida)  
                                                 inner join  productos using(idProducto)
                                  WHERE num_pedido = "${pedidos[i]}" and  cantidad = cantidad_surtida `);

        let numeroEntrega = await pool.query(`select idEntregas from entregas where num_pedido = "${pedidos[i]}"`);

        for (let i = 0; i < pedido.length; i++) {

            await pool.query(`INSERT INTO entregas_productos VALUES (null,${numeroEntrega[0].idEntregas},${pedido[i].idProducto})`);

        }

    }

    res.send(true);

});
// Descarga el PDF 
router.get('/pdf/:id', (req, res) => {


    res.download(__dirname + '../../../files/' + req.params.id, req.params.id);

});
module.exports = router;