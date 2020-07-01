const express = require("express");
const router = express.Router();
const pool = require('../../database');
const { isLoggedIn } = require('../../lib/auth');
const upload = require('express-fileupload');
const importExcel  =  require('convert-excel-to-json');
const path = require("path");
const rutimage = path.join(__dirname, "../../files/");
console.log(rutimage);

const fs = require('fs');
router.use(upload());




router.post('/', (req , res) => {
    let file = req.files.excel;
    let filename = file.name;
    console.log(rutimage);
    
    file.mv(  rutimage+filename ,async (err)=>{

        if(err){

            console.log(err);

        }else{
            const informacion_partida  = []; 
            let result = importExcel({
                sourceFile: rutimage + filename,
                // header:{rows:15},
                // columnTokey:{B:'cantidad',C:'Clave',F:'Descripción',O:'Importe'},
                sheets:['Sheet1']
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
            for (let i = 0; i < result.Sheet1.length; i++) {
                    if(clave != -1) clave++; 
                    if(result.Sheet1[i].M == 'COTIZACIÓN No. :') infoPedidos.cotizacion =  result.Sheet1[i].O;
                    if(result.Sheet1[i].M == 'Fecha') infoPedidos.fecha =  result.Sheet1[i].O;
                    if(result.Sheet1[i].B == 'Cliente:')infoPedidos.cliente =  result.Sheet1[i].D;
                    if(result.Sheet1[i].B == 'Vendedor :') infoPedidos.vendedor =  result.Sheet1[i].C;
                    if(numero_partidas >  contador ) contador = numero_partidas;
                    if(result.Sheet1[i].K == 'Total')infoPedidos.total =  result.Sheet1[i].O;
                    if(result.Sheet1[i].C == 'Clave')  clave = 0;
                     
                    
                    
            }
            console.log(clave);
            
             infoPedidos.numero_partidas = numero_partidas;
            
            
             try {
                 const cliente  = await pool.query("SELECT nombre , prioridadE FROM clientes inner join preferencias_cliente using(idcliente) where numero_interno = ?",infoPedidos.cliente);
                 const clientes_verndedor =  await pool.query(`select * from acceso inner join empleados using(idacceso) 
                    	                                                            inner  join clientes using(id_empleados)  
                                                                where idacceso = ${req.user[0].idacceso}  and numero_interno  = ${infoPedidos.cliente} `); 
                
                
                if(clientes_verndedor.length == 0) {
                    return  res.send(false); 
                }else{

                 infoPedidos.cliente = cliente[0].nombre;
                 infoPedidos.tipoDeEntega  =  cliente[0].prioridadE;
                 result.Sheet1.push(infoPedidos);
                 res.send(result);  
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
                                        WHERE num_pedido = ? `,req.body.pedido);
    res.send(productos);
    

           
});

module.exports = router;