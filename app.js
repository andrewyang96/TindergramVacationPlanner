var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var apiRoutes = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Passport
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('express-session')({ secret: 'travel the world' }));

// Fetch Facebook credentials
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgresql://root@localhost:26257?sslmode=disable';
pg.connect(connectionString, function (err, client, done) {
  if (err) {
    done();
    throw err;
  }
  client.query("SELECT client_id, client_secret FROM tgvp.credentials WHERE platform = 'fb'",
    function (err, result) {
      var client_id = result.rows[0].client_id;
      var client_secret = result.rows[0].client_secret;

      // Setup passport
      passport.use(new Strategy({
        clientID: client_id,
        clientSecret: client_secret,
        callbackURL: '/login/callback',
      }, function (access_token, refresh_token, profile, cb) {
        console.log(profile);
        return cb(null, profile);
      }));

      passport.serializeUser(function(user, cb) {
        cb(null, user);
      });

      passport.deserializeUser(function(obj, cb) {
        cb(null, obj);
      });

      done();
    });
});

app.use(passport.initialize());
app.use(passport.session());
console.log('Passport configured');
app.use('/', routes);
app.use('/api', apiRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
