var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressValidator = require('express-validator');
var mongoose = require('mongoose');
var passport=require('passport');
var session=require('express-session');
var helpers = require('./helper');
const hbs = require('hbs');
hbs.registerHelper('ifEqual', function(arg1, arg2, options) {
  return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
});
var app = express();

require('./passport');
var config = require('./config');
var indexRoute = require('./routes/index');
var authRoute = require('./routes/auth');
var adminRoute = require('./routes/admintask');


require('dotenv').config(); 
const db_Link=process.env.DATABASE_LINK;



mongoose.connect(db_Link)
.then((db)=>{
    console.log('db connected');
})
.catch((err)=>{
    console.log(err);
})

global.User = require('./models/user');
global.VaccinationCenter=require('./models/Admintask');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(session({
  secret: config.sessionKey,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {//basically a middleware to check if the user is login or not 
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
});

app.use('/', indexRoute);
app.use('/', authRoute);
app.use('/', adminRoute);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
