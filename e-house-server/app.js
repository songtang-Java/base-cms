var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// 只需引入即可,在session持久化时，需要
const mongoConnection = require('./database/config')
const session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var indexRouter = require('./routes/index');

const passport = require("passport");
var app = express();
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});
// 配置express-session持久化存储
app.use(session({
  name:'asdasd',
  secret: 'zj',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, expires: 1000*60*60*2 },    //true:对应https
  store: new MongoStore({ mongooseConnection: mongoConnection })
}));

// 配置passport  配置passport代码量非常大   把配置抽离一个单独的文件
app.use(passport.initialize()); // 初始化
require("./controller/config/passport")(passport); // 导入配置文件  把passport传递过去,而且要导入一个函数

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
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
