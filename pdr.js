var express = require('express')
  , http = require('http')
  , passport = require('passport')
  , mongoose = require('mongoose')
  , config;

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
    cookie: {maxAge: 100000 * 2000}, // 20 minutes
    secret: 'pdr-is-awesome',
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

app.configure('development', function() {
  config = exports.config = require('./config.dev.json')
});

app.configure('production', function() {
  config = exports.config = require('./config.json')
});

/*
 * Mongoose Models and DB connection
 */

// MongoDB connection with mongoose
var mongo_url = process.env.MONGOHQ_URL || 'mongodb://localhost/pdr';

// Connect mongoose to database
mongoose.connect(mongo_url);

// import mongoose models
require('./models');

/*
 * Passportjs auth strategy
 */

require('./strategy');

/*
 * Routes
 */

require('./routes')(app);

/*
 * Start Web server
 */

exports.server = http.createServer(app).listen(app.get('port'), function() {
  console.log('PDR started on port %d', app.get('port'));
});
