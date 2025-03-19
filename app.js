var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var webServiceRouter = require('./routes/web_service');
var multiRouter = require('./routes/multi_router');
var routerMiddleWareRouter = require('./routes/router_middleware');
var routerMapRouter = require('./routes/router_map');
var paramsRouter = require('./routes/params');
var resourceRouter = require('./routes/resource');
var errorRouter = require('./routes/error');
var errorPagesRouter = require('./routes/error_pages');
var authRouter = require('./routes/auth');
var contentNegotiationRouter = require('./routes/content_negotiation');
var cookieSessionRouter = require('./routes/cookie_session');
var cookieRouter = require('./routes/cookie');
var downloadsRouter = require('./routes/downloads');
var mvcRouter = require('./routes/mvc/mvc');
var onlineRouter = require('./routes/online');
var searchRouter = require('./routes/search/search');
var sessionRouter = require('./routes/session/session');
var sessionRedisRouter = require('./routes/session/redis');
var vhostRouter = require('./routes/vhost');
var viewConstructorRouter = require('./routes/view_constructor/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/index', indexRouter);
app.use('/users_custom', usersRouter);
app.use('/web_service', webServiceRouter);
app.use('/multi_router', multiRouter);
app.use('/router_middleware', routerMiddleWareRouter);
app.use('/router_map', routerMapRouter);
app.use('/params', paramsRouter);
app.use('/resource', resourceRouter);
app.use('/error', errorRouter);
app.use('/error_pages', errorPagesRouter);
app.use('/auth', authRouter);
app.use('/content_negotiation', contentNegotiationRouter);
app.use('/cookie_session', cookieSessionRouter);
app.use('/cookie', cookieRouter);
app.use('/downloads', downloadsRouter);
app.use('/mvc', mvcRouter);
app.use('/online', onlineRouter);
app.use('/search', searchRouter);
app.use('/session', sessionRouter);
app.use('/session_redis', sessionRedisRouter);
app.use('/vhost', vhostRouter);
app.use('/view_constructor', viewConstructorRouter);

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

// app.get('/hello', (req, res) => {
//   res.send('Hello World!')
// })

// app.post('/post', (req, res) => {
//   res.send('Got a POST request')
// })

// app.put("/put", (req, res) => {
//   res.send("Got a PUT request at /put")
// })

// app.delete("/delete", (req, res) => {
//   res.send("Got a DELETE request at /delete")
// })
