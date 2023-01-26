//REQUIRES
const express = require('express');
const path = require('path');
const app = express();
const methodOverride =  require('method-override'); 
const mainRouter = require('./src/routes/mainRouter');
const usersRouter = require('./src/routes/usersRouter');
const session = require('express-session');
const cookie = require('cookie-parser');
const userLoggedMiddleware = require('./src/middlewares/userLoggedMiddleware')



//CONFIG
app.use(express.static(path.resolve(__dirname,'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'./src/views'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method')); 
app.use(session({
    secret: "Shhh, it's a secret",
    resave: false,
    saveUninitialized: false
}))
app.use(cookie());
app.use(userLoggedMiddleware);

//RUTAS

app.use('/users',usersRouter);
app.use('/',mainRouter); 


//SERVIDOR
app.listen(2000, () => {console.log('Servidor corriendo en el puerto 2000');})

 