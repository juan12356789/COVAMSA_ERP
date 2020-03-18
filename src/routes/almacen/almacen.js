const express=require("express"); 
const router =  express.Router(); 
const path=require("path"); 
const multer=require("multer"); 
const pool = require('../../database');
router.get('/',(req,res)=>{
    
    res.render('links/almacen/pedidos');

});
router.get('/pdf/:id',(req,res)=>{
   //console.log(req.params.id);
   
    
res.download(__dirname+'../../../files/'+req.params.id,req.params.id ); 

});
module.exports = router; 