const express=require("express"); 
const router =  express.Router(); 
const path=require("path"); 
const multer=require("multer"); 
const pool = require('../../database');
router.get('/',(req,res)=>{
    res.render('links/almacen/pedidos');

}); 
module.exports = router; 