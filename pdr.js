var express = require('express')
  , http = require('http')
  , passport = require('passport')
  , config = require('./config.json')
  , mongoose = exports.mongoose = require('mongoose')
  , models = exports.models = require('./models');

mongoose.connect("mongodb://localhost/pdr");

/*
 * Passportjs auth strategy
 */

require('./strategy');

/*
 * Create and config server
 */

var app = exports.app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 3005);
  app.set('view engine', 'jade'); 
  app.set('views', __dirname + '/views');
  app.use(express.static(__dirname + '/public'));
  app.use(express.bodyParser());
  app.use(express.cookieParser('pdr es la posta'));
  app.use(express.session({
    key: "pdr"
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(function(req, res, next) {
    if(!res.locals.page) res.locals.page = "default";
    if(req.isAuthenticated() && req.user) res.locals.citizen = req.user;
    next();
  });
  app.use(app.router);
});

/*
 * Routes
 */

require('./routes');

/*
 * Start Web server
 */

exports.server = http.createServer(app).listen(app.get('port'), function() {
  console.log('PDR started on port %d', app.get('port'));
});
