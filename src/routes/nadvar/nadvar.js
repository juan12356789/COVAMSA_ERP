const express = require("express");
const router = express.Router();
const pool = require('../../database');


router.post('/usuario',  async(req , res)=>{
    const usuario  = await pool.query("select nombre,apellido_paterno, correo from acceso inner join empleados using(idacceso) where idacceso = ? ",req.user[0].idacceso);
    res.send(usuario);
    

}); 


module.exports = router;