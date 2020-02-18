const express=require("express"); 
const router =  express.Router(); 
router.get('/menu',(req,res)=>{
    res.render('links/menu/menu');
});


module.exports = router;
