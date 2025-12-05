var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var app = express();
var server = require('http').createServer(app);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
require('./config/passport')(passport); // pass passport for configuration
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'deploymentplantnipsa' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(express.static(path.join(__dirname, 'public')));
// routes ======================================================================
require('./config/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./config/POST.js')(app, passport);
require('./config/reports.js')(app, passport);
require('./config/PUT.js')(app, passport);
// Take error Messsages
app.use(function(err,req, res, next){
    res.writeHead(err.status || 500,{
        'WWW-Authenticate': 'Basic',
        'Content-Type': 'text/plain'
    });
    res.end(err.message);
})
//app.use('/', index);
//app.use('/users', users);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development1' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

server.listen(93);