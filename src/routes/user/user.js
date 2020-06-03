const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const pool = require('../../database');
const { isLoggedIn } = require('../../lib/auth');

router.get('/', isLoggedIn ,( req ,  res )=>{res.render('links/user/user.hbs') });

router.post('/id' , async (req , res)=>{
   const user  = await pool.query("SELECT tipo_usuario FROM acceso WHERE  idacceso = ? ", req.user[0].idacceso);
   res.send(user[0].tipo_usuario);
});

router.post('/' , async( req , res )=>{
   const profile  = await pool.query("select * from  acceso inner join  empleados using(idacceso) where idacceso  = ?",req.user[0].idacceso); 
   res.send(profile[0]); 
});

router.post('/updatePassword', async ( req , res )=>{
   console.log(req.body);
   if(req.body.nuevContra.length > 30) return res.send(false);  
   const contraA = await pool.query("SELECT * from acceso WHERE idacceso = ? AND password = ?",[req.body.id , req.body.aContra]); 
   if(contraA.length >   0){
      await pool.query(`UPDATE acceso SET  password = "${req.body.nuevContra}" WHERE idacceso = ?`, req.body.id);
      res.send(true);

   }else{
      
      res.send(false);
   }
   

});

router.post('/selectUser',async(req , res)=>{

   const infto_empleados  = await pool.query("select idacceso,estado,correo,password,tipo_usuario,nombre,apellido_paterno,apellido_materno from acceso inner join empleados  using(idacceso)");
   res.send(infto_empleados);
    
});

router.post('/selectIdUser',async(req , res)=>{
   const empleado  = await pool.query("select idacceso,estado,correo,password,tipo_usuario,nombre,apellido_paterno,apellido_materno, estado from acceso inner join empleados  using(idacceso) WHERE idacceso = ?",req.body.id);
   res.send(empleado);
}); 



router.post('/updateInfoUsers' , async(req , res)=>{
   console.log(req.body);
   
   await pool.query(`UPDATE acceso 
                     SET  correo = "${req.body.correo}",estado=${req.body.actividad},  password="${req.body.password}", tipo_usuario="${req.body.tipo_usuario}", estado="${req.body.actividad}" 
                     WHERE idacceso = ?`,req.body.id); 
   
   await pool.query(`UPDATE empleados 
                     SET  nombre="${req.body.nombre}", apellido_paterno="${req.body.apellidoP}",apellido_materno="${req.body.apellidoM}"
                     WHERE idacceso = ? `,req.body.id); 
   
   const idEmpleado  =  await pool.query("SELECT id_empleados from empleados where idacceso =  ?", req.body.id); 

   switch (req.body.tipo_usuario) { 

      case "Ventas": 
         await pool.query(`DELETE FROM empleados_departamentos where id_empleados = ? `,idEmpleado[0].id_empleados); 
         await pool.query(`INSERT INTO  empleados_departamentos VALUE ( null , ${idEmpleado[0].id_empleados} , 1 ) `);
         await pool.query(`INSERT INTO  empleados_departamentos VALUE ( null , ${idEmpleado[0].id_empleados} , 4 ) `); 
      break;

      case"Almacen":   
         await pool.query(`DELETE FROM empleados_departamentos where id_empleados = ? `,idEmpleado[0].id_empleados); 
         await pool.query(`INSERT INTO  empleados_departamentos VALUE ( null , ${idEmpleado[0].id_empleados} , 2 ) `);
         await pool.query(`INSERT INTO  empleados_departamentos VALUE ( null , ${idEmpleado[0].id_empleados} , 4 ) `);
      break;

      case"Administrador":
         await pool.query(`DELETE FROM empleados_departamentos where id_empleados = ? `,idEmpleado[0].id_empleados); 
         for (let i = 1; i <= 4; i++) {
            await pool.query(`INSERT INTO  empleados_departamentos VALUE ( null , ${idEmpleado[0].id_empleados} , ${i} ) `);
         }
      break;
   }
   res.send("Actualizado");
      
}); 
router.post('/insert' , async(req , res)=>{
      console.log(req.body);
      await pool.query(`INSERT INTO acceso value(null,"${req.body.correo}","${req.body.password}","${req.body.tipo_usuario}",${req.body.actividad})`);
      await pool.query(`INSERT INTO empleados value (null,"${req.body.nombre}","${req.body.apellidoP}","${req.body.apellidoM}",
                        (select idacceso from acceso where correo = "${req.body.correo}" and password = "${req.body.password}" ))`); 
      const idEmpleado  =  await pool.query(`SELECT id_empleados from empleados where idacceso =  (select idacceso from acceso where correo = "${req.body.correo}" and password = "${req.body.password}" )`);
      console.log(idEmpleado);
       
      switch (req.body.tipo_usuario) { 

         case "Ventas": 
            
            await pool.query(`INSERT INTO  empleados_departamentos VALUE ( null , ${idEmpleado[0].id_empleados} , 1 ) `);
            await pool.query(`INSERT INTO  empleados_departamentos VALUE ( null , ${idEmpleado[0].id_empleados} , 4 ) `); 
         break;
   
         case"Almacen":   
            await pool.query(`INSERT INTO  empleados_departamentos VALUE ( null , ${idEmpleado[0].id_empleados} , 2 ) `);
            await pool.query(`INSERT INTO  empleados_departamentos VALUE ( null , ${idEmpleado[0].id_empleados} , 4 ) `);
         break;
   
         case"Administrador":
            await pool.query(`DELETE FROM empleados_departamentos where id_empleados = ? `,idEmpleado[0].id_empleados); 
            for (let i = 1; i <= 4; i++) {
               await pool.query(`INSERT INTO  empleados_departamentos VALUE ( null , ${idEmpleado[0].id_empleados} , ${i} ) `);
            }
         break;
      }
      res.send('hola');
      
});

module.exports = router;