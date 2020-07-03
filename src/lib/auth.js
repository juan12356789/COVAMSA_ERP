// protege las  rutas 
module.exports = {
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) { // si esta logeado continua
            return next();
        } // si no de regreso al login
        return res.redirect('/');

    }

}