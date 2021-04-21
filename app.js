var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var db=require('./config/connection')   //* mongo db require


var session=require('express-session');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var homeRouter = require('./routes/home');
var signupRouter=require('./routes/signup');
var adminRouter=require('./routes/admin');

const { Cookie } = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


db.connect((err)=>{   //*data base
  if(err){
    console.log(err)
  }
  else{
    console.log('Data base connected')
  }
})

app.use(session({
  secret:'itsmykey',

  cookie:{maxAge:3600000000000}
}))



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/home',homeRouter);
app.use('/signup',signupRouter);
app.use('/admin',adminRouter);

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
