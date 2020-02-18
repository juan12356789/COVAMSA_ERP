const express=require("express"); 
const router =  express.Router(); 
const pool = require('../database')
const  passport =  require('passport');
const {isLoggedIn}= require('../lib/auth');

router.get('/',(req,res)=>{
    res.render('links/login/login');
});

router.post('/',(req,res,next)=>{
    passport.authenticate('local.signin',{
        successRedirect: '/menu',
        failureRedirect:'/'
    })(req,res,next); 
});

router.get('/profile',isLoggedIn ,async(req,res)=>{

      const clientes  = await pool.query("SELECT * FROM clientes");    
      res.render('links/ventas/formularioVentas',{clientes});

});
router.post('/profile',async(req,res)=>{
    console.log(req.body.clientes);
    const clientes  = await pool.query("SELECT * FROM clientes  where  nombre like ?",'%'+[req.body.clientes]+'%');
    res.send(clientes)
}); 
router.get('/logout',(req,res)=>{
    req.logOut(); 
    res.redirect('/'); 
}); 


// router.post('/',passport.authenticate('local.signup',{
//         succesRedirect:'/profile',
//         failureRedirect: '/',
//         failureFlash: true
// }));

// router.get('/profile',(req,res)=>{
//     res.send('enviar');
// });

//  router.post('/',(req,res,next)=>{
//         passport.authenticate('local.signin',{
//             successRedirect:'/profile',
//             failureRedirect:'/',
//             failureFlash:true
//         })(req,res,next);
//  });

module.exports = router; 