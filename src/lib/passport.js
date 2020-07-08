const passport = require('passport'); // para autentificaciones
const Strategy = require('passport-local').Strategy;
const pool = require('../database');

passport.use('local.signin', new Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, email, password, done) => {
    let cont = 0;
    const rows = await pool.query("SELECT * FROM  acceso WHERE  correo = ?  and password = ? ", [email, password]);
    console.log(rows);
    
    if (rows.length > 0 && rows[0].estado != 0 ) {
        const user = rows[0];
        // const validPassword =   await helpers.matchPassword(password,user.password); validar contraseña convertida 
        done(null, user);
    } else { 
        
        try {
            const validacionUsuarios = await pool.query("SELECT * FROM  acceso WHERE  correo = ? ", [email]);
            if(validacionUsuarios[0].intentos_login >= 3  ){
                await pool.query(`UPDATE acceso SET  estado = 0  WHERE idacceso = ?`,validacionUsuarios[0].idacceso);   
                req.flash('error', 'Su usuario ha sido bloquieado, contacte al administrador.');
                return done(null, false);
            }
    
            if( validacionUsuarios.length > 0 ){
                let intentos =  validacionUsuarios[0].intentos_login == null? 0:validacionUsuarios[0].intentos_login ;
                await pool.query(`UPDATE acceso SET  intentos_login = ${intentos + 1} WHERE idacceso = ?`,validacionUsuarios[0].idacceso);
            }
        } catch (error) {
            
        }
       
        
        if (rows.length > 0 && rows[0].estado  == 0 ) {
            req.flash('error', 'Su correo está bloqueado reportese con el administrador.');
            return done(null, false);
        }
        req.flash('error', 'Favor de verificar su usuario y su contraseña.');
        done(null, false);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.idacceso);
});
passport.deserializeUser(async(id, done) => {
    const rows = await pool.query('SELECT   idacceso, c.nombre dep , d.nombre modulos,d.direccion,d.descripcion FROM  empleados inner join  empleados_departamentos using(id_empleados) inner join departamentos c using(id_departamento) inner join modulos d using(id_departamento)  where idacceso = ? ', [id]);
    done(null, rows);
});