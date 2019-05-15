
var express = require('express')
var tasksRouter = require('./routes/tasks');
var usersRouter = require('./routes/users');
var indexRouter = require('./routes/index');

var path = require('path');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var app = express();

var passport = require('passport');
app.use(passport.initialize());

const url = 'mongodb://localhost:27017/todo';
const connect = mongoose.connect(url,{
  useMongoClient: true
});
connect.then((db)=>{
  console.log('Connect Correctly to Server ')}
  , err =>console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/tasks', tasksRouter);
app.use('/users', usersRouter);


  
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
app.listen(3000, () => console.log(`Example app listening on port 3000 !`))
module.exports = app;
