const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const pool = require('../../database');
const { isLoggedIn } = require('../../lib/auth');

router.get('/', isLoggedIn ,( req ,  res )=>{res.render('links/user/user.hbs') });
router.post('/' , async( req , res )=>{
   const profile  = await pool.query("select * from  acceso inner join  empleados using(idacceso) where idacceso  = ?",req.user[0].idacceso); 
   res.send(profile[0]); 
});

router.post('/updatePassword', async ( req , res )=>{
   if(req.body.nuevContra.length > 30) return res.send(false);  
   await pool.query(`UPDATE acceso SET  password = "${req.body.nuevContra}" WHERE idacceso = ?`, req.body.id);
   res.send(true); 

});
module.exports = router;