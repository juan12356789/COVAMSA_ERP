const express = require("express");
const router = express.Router();
const pool = require('../../database');
const { isLoggedIn } = require('../../lib/auth');
const upload = require('express-fileupload');
const importExcel  =  require('convert-excel-to-json');
const path = require("path");
const rutimage = path.join(__dirname, "../../files/");

const fs = require('fs');
router.use(upload());




router.post('/', (req , res) => {
    let file = req.files.excel;
    let filename = file.name;
    
    file.mv(  rutimage+filename ,async (err)=>{

        if(err){

            console.log(err);

        }else{
            const informacion_partida  = [];
            let result = importExcel({
                sourceFile: rutimage + filename,
                // header:{rows:15},
                // columnTokey:{B:'cantidad',C:'Clave',F:'Descripción',O:'Importe'},
                sheets:['Hoja1']
            });
            const infoPedidos = {
                cotizacion:'',
                fecha: '',
                cliente:'',
                vendedor:'',
                total:'',
                numero_partidas : ''
            }; 
            let numero_partidas = 0 , contador  = 0 ,clave = -1; 
            for (let i = 0; i < result.Hoja1.length; i++) {
                    if(clave != -1) clave++; 
                    if(result.Hoja1[i].A == 'FOLIO COTIZACION') infoPedidos.cotizacion =  result.Hoja1[i].B;
                    if(result.Hoja1[i].D == 'FECHA') infoPedidos.fecha =  result.Hoja1[i].E;
                    if(result.Hoja1[i].A == 'NUMERO DE CLIENTE')infoPedidos.cliente =  result.Hoja1[i].B;
                    if(result.Hoja1[i].A == 'NUMERO VENDEDOR') infoPedidos.vendedor =  result.Hoja1[i].B;
                    if(numero_partidas >  contador ) contador = numero_partidas; 
                    if(result.Hoja1[i].F == 'TOTAL') infoPedidos.total =  result.Hoja1[i].G;
                    if(result.Hoja1[i].C == 'CODIGO')  clave = 0;       
            }

             infoPedidos.numero_partidas = numero_partidas;
             try {
                
                 const cliente  = await pool.query("SELECT nombre , prioridadE FROM clientes inner join preferencias_cliente using(idcliente) where numero_interno = ?",infoPedidos.cliente);
            
                 const clientes_verndedor =  await pool.query(`select * from acceso inner join empleados using(idacceso) 
                    	                                                            inner  join clientes using(id_empleados)  
                                                                where idacceso = ${req.user[0].idacceso}  and numero_interno  = ${infoPedidos.cliente} `);
                                    
                 const usario_permiso = await pool.query(`SELECT tipo_usuario 
                                                          FROM  acceso  
                                                          where idacceso = ? AND tipo_usuario  = 'Administrador' `,req.user[0].idacceso);                 
                
                 const pedidos = await pool.query(`SELECT * FROM pedidos where num_pedido  = ?`,infoPedidos.cotizacion);

                if(pedidos.length > 0 ) return res.send('enProceso'); 
                if(clientes_verndedor.length == 0  && usario_permiso.length == 0  ) {
                  
                    return  res.send(false); 

                }else{
                    if(usario_permiso.length != 0){

                        const clientes_admin =  await pool.query(`select * from acceso inner join empleados using(idacceso) 
                    	                                                            inner  join clientes using(id_empleados)  
                                                                  where  numero_interno  = ${infoPedidos.cliente} `);
                        infoPedidos.cliente = clientes_admin[0].nombre;
                        if(cliente.length != 0) infoPedidos.tipoDeEntega  =  cliente[0].prioridadE;
                        result.Hoja1.push(infoPedidos); 
                        result.ruta  = filename ; 
                        res.send(result);  

                    }else{
                        infoPedidos.cliente = clientes_verndedor[0].nombre;
                        if(cliente.length != 0) infoPedidos.tipoDeEntega  =  cliente[0].prioridadE;
                        result.Hoja1.push(infoPedidos); 
                        result.ruta  = filename ; 
                        res.send(result);  
                    }
                }
             } catch (error) {
                 res.send("null"); 
             }
             
            
        }
    });
}); 

router.post('/excelDetail', async (req , res)=>{
        
    let productos    = await pool.query(`select clave,nombre,cantidad 
                                        from pedidos inner join partidas using(id_pedido) 
                                                     inner join partidas_productos using(idPartida)
                                                     inner join productos using(idProducto)
                                        WHERE id_pedido = ? `,req.body.pedido);
    res.send(productos);
    

           
});

module.exports = router;