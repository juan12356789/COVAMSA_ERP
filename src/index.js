const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session');
const bodyParser = require('body-parser');
const {database} = require('./key');
//  cambiar conexion en la  otras areas  
const app = express();
require('./lib/passport');



// settings 
app.set('port',process.env.port|| 4000);
app.set('views',path.join(__dirname,'views')); 


// app.set('port',process.env.PORT || 4000);
app.set('views',path.join(__dirname,'views')); // le dice a node donde esta la carpeta views 
// middlewars 


app.engine('.hbs',exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'), //unir directorios
    partialsDir:path.join (app.get('views'),'partials'), // para reutilizar código 
    extname: '.hbs',//como  van a terminar mis archivos 
    helpers: require('./lib/handlebars')
}));
app.use(flash());
app.use(session({
    secret: 'mysqlcovamsa',
    resave:false,
    saveUninitialized:false,
    expires: new Date(Date.now() + (30 * 86400 * 1000)),
    store: new MySQLStore(database)
}));
console.log(new Date(Date.now() + (1000 *18000  )));


app.set('view engine','.hbs'); //para que funcione las plantillas 
app.use(express.urlencoded({extended:false}));// sirve para aceptar los datos que me manden los usuarios
app.use(express.json()); //para aceptar json 
app.use(passport.initialize());//inicializar pass
app.use(passport.session());

app.use(morgan('dev')); // se utiliza para ver lo que llega al servidor



// Global Variables 
app.use((req,res,next)=>{// se usa para ver que variable son accedidadas desde la aplicación 
   app.locals.success  = req.flash('success');
   app.locals.error  = req.flash('error');
   app.locals.user  =req.user; 
    next(); // toma la infotmacion del usuario 
});
// routes 
app.use(require('./routes/login'));
app.use(require('./routes/menu/menu'));
app.use('/ventas',require('./routes/ventas/ventas')); 

// Public 
app.use(express.static(path.join(__dirname,'public')));
// Starting server 

// so existe un puerto 
app.listen(app.get('port'),()=>{
console.log('server on port ',app.get('port'));
}); 

