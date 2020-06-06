const express = require("express");
const router = express.Router();
const path = require("path");
const pool = require('../../database');
const { isLoggedIn } = require('../../lib/auth');
const upload = require('express-fileupload');
const importExcel  =  require('convert-excel-to-json');
const fs = require('fs');
router.use(upload());



router.post('/', (req , res) => {
    let file = req.files.excel;
    let filename = file.name;
    
    file.mv(  './excel/'+filename ,async (err)=>{

        if(err){

            console.log(err);

        }else{
            let result = importExcel({
                sourceFile: './excel/'+filename,
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
            let numero_partidas = 0 , contador  = 0; 
            for (let i = 0; i < result.Sheet1.length; i++) {

                    if(result.Sheet1[i].M == 'COTIZACIÓN No. :') infoPedidos.cotizacion =  result.Sheet1[i].O;
                    if(result.Sheet1[i].M == 'Fecha') infoPedidos.fecha =  result.Sheet1[i].O;
                    if(result.Sheet1[i].B == 'Cliente:')infoPedidos.cliente =  result.Sheet1[i].D;
                    if(result.Sheet1[i].B == 'Vendedor :'){
                        
                        infoPedidos.vendedor =  result.Sheet1[i].C;
                        numero_partidas++; 

                    }
                    if(numero_partidas >  contador ){
                        contador = numero_partidas; 
                    }
                    if(result.Sheet1[i].K == 'Total')infoPedidos.total =  result.Sheet1[i].O;

            }
             infoPedidos.numero_partidas = numero_partidas; 
             console.log(result);
             
             try {

                 const cliente  = await pool.query("SELECT nombre FROM clientes where numero_interno = ?",infoPedidos.cliente);
                 infoPedidos.cliente = cliente[0].nombre;
                 res.send(infoPedidos);  
                 
             } catch (error) {
                 
                 res.send("null"); 
             }
             
            
        }
    });
}); 

module.exports = router;