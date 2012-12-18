var express = require('express')
  , http = require('http')
  , passport = require('passport')
  , mongoose = require('mongoose')
  , mongoStore = require('connect-mongodb')
  , utils = require('./utils');

/*
 * Create and config server
 */
var app = exports.app = express();

app.set('categories', require('./fixtures/categories.json'));

app.configure('development', function() {
  app.set('config', require('./config.dev.json'));
  app.set('mongoUrl', 'mongodb://localhost/pdr');

  console.log('development settings loaded!');
});

app.configure('production', function() {
  app.use(require('nowww')());
  app.use(express.compress());
  app.set('config', require('./config.json'));
  app.set('mongoUrl', process.env.MONGOHQ_URL);

  console.log('production settings loaded!');
});

app.configure(function() {
  app.set('port', process.env.PORT || 3005);
  app.set('view engine', 'jade'); 
  app.set('views', __dirname + '/views');
  app.use(express.static(__dirname + '/public'));
  app.use(express.bodyParser());
  app.use(express.cookieParser('pdr es la posta'));
  app.use(express.session({
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 1 week
    secret: 'pdr-is-awesome',
    key: "pdr",
    store: new mongoStore({ url: app.get('mongoUrl') })
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(function(req, res, next) {
    res.locals.md = utils.md;
    next();
  });
  app.use(function(req, res, next) {
    if(!res.locals.page) res.locals.page = "default";
    if(req.isAuthenticated() && req.user) res.locals.citizen = req.user;
    res.locals.categories = app.get('categories');
    next();
  });
  app.use(app.router);
  // Here we should have our own error handler!
  app.use(express.errorHandler());
});

/*
 * Mongoose Models and DB connection
 */
require('./models')(app);


/*
 * Passportjs auth strategy
 */
require('./strategy')(app);


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
