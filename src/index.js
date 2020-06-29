const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session');
const bodyParser = require('body-parser');
const { database } = require('./key');
//  cambiar conexion en la  otras areas  
const app = express();

require('./lib/passport');



// settings 
app.set('port', process.env.port || 4000);
app.set('views', path.join(__dirname, 'views'));



app.set('views', path.join(__dirname, 'views'));
// middlewars 


app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'), //unir directorios
    partialsDir: path.join(app.get('views'), 'partials'), // para reutilizar código 
    extname: '.hbs', //como  van a terminar mis archivos 
    helpers: require('./lib/handlebars')
}));
app.use(flash());
app.use(session({
    secret: 'mysqlcovamsa',
    resave: false,
    saveUninitialized: false,
    expires: new Date(Date.now() + (1000 * 60 * 1)),
    store: new MySQLStore(database)
}));


app.set('view engine', '.hbs'); //para que funcione las plantillas 
app.use(express.urlencoded({ extended: false })); // sirve para aceptar los datos que me manden los usuarios
app.use(express.json()); //para aceptar json 
app.use(passport.initialize()); //inicializar pass
app.use(passport.session());

app.use(morgan('dev'));



// Global Variables 
app.use((req, res, next) => { // se usa para ver que variable son accedidadas desde la aplicación 
    app.locals.success = req.flash('success');
    app.locals.error = req.flash('error');
    app.locals.user = req.user;
    next(); // toma la infotmacion del usuario 
});
// routes 
// app.use('/favicon.ico', express.static('.routes/favicon.ico/favicon.ico'));

app.use(require('./routes/login'));
app.use(require('./routes/menu/menu'));
app.use('/ventas', require('./routes/ventas/ventas'));
app.use('/almacen', require('./routes/almacen/almacen'));
app.use('/admin', require('./routes/admin/admin'));
app.use('/user', require('./routes/user/user'));
app.use('/excel', require('./routes/ventas/excel'));
app.use('/nadvar', require('./routes/nadvar/nadvar'));
app.use('/facturas', require('./routes/facturas/facturas'));
app.use('/compras', require('./routes/compras/compras'));
// Public 
app.use(express.static(path.join(__dirname, 'public')));


const server = app.listen(app.get('port'), () => {
    console.log('server on port ', app.get('port'));
});

const SocketIO = require('socket.io');
const io = SocketIO(server);

io.on('connection', (socket) => {

    socket.on('data:pedidos', (data) => {

        io.sockets.emit('data:pedidos', data);

    });

    socket.on('data:facturas', data => io.sockets.emit('data:facturas', data));

});