require('dotenv').config();
var express = require('express')
var tasksRouter = require('./routes/tasks');

var usersRouter = require('./routes/users');

var path = require('path');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var app = express();

var passport = require('passport');
const Error = mongoose.Error;
var createError = require('http-errors');
var logger = require('morgan');
app.use(logger('dev'));

app.use(passport.initialize());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



//'mongodb+srv://david:<123>@cluster0-02ljv.mongodb.net/test?retryWrites=true'

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/todo')


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public/todo')));

app.use('/tasks', tasksRouter);
app.use('/users', usersRouter);
app.get('*', function(req, res) {
  res.sendfile('./public/todo/index.html');
});


  
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(process.env.PORT || 3000, () => console.log(`app listening !`))
module.exports = app;
