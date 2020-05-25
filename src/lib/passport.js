const passport = require('passport'); // para autentificaciones
const Strategy = require('passport-local').Strategy;
const pool = require('../database');

passport.use('local.signin', new Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, email, password, done) => {

    const rows = await pool.query("SELECT * FROM  acceso WHERE  correo = ?  and password = ? ", [email, password]);
  
    if (rows.length > 0 && rows[0].estado != 0 ) {
        const user = rows[0];
        // const validPassword =   await helpers.matchPassword(password,user.password); validar contraseña convertida 
        done(null, user);
    } else {
        req.flash('error', 'Favor de verificar su usuario y su contraseña.');
        done(null, false);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.idacceso);
});
passport.deserializeUser(async(id, done) => {
    const rows = await pool.query('SELECT   idacceso,c.nombre dep , d.nombre modulos,d.direccion,d.descripcion FROM  empleados inner join  empleados_departamentos using(id_empleados) inner join departamentos c using(id_departamento) inner join modulos d using(id_departamento)  where idacceso = ? ', [id]);
    done(null, rows);
});