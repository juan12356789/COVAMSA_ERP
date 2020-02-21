// protege las  rutas 
module.exports = {
        isLoggedIn(req,res,next){
            if(req.isAuthenticated()){ // si esta logeado continua
                return next();
            }// si no de regreso al login
            req.flash('error','Ingrese todos los campos requeridos ' ); 
            return  res.redirect('/'); 
            
        }
        // , el usuario  ya esta logeado 
        // isNotLoggedIn(){
        //     if(!req.isAuthenticated()){
        //         return  next();
        //     }
        //     return res.redirect()
        // }
}