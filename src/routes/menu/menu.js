const express=require("express"); 
const router =  express.Router(); 
const {isLoggedIn}= require('../../lib/auth');
router.get('/menu', isLoggedIn, (req,res)=>{
    console.log('hola');
    res.render('links/menu/menu');
});
module.exports = router;
