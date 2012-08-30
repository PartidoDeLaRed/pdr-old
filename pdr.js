var express = require('express')
	, http = require('http');

var app = exports.app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 6789);
  app.set('view engine', 'jade'); 
  app.set('views', __dirname + '/views');
  app.use(express.static(__dirname + '/public'));
  app.use(express.bodyParser());
  app.use(express.cookieParser('pdr es la posta'));
  app.use(express.session({
    key: "pdr"
  }));
  app.use(function(req, res, next) {
  	if(!res.locals.page) res.locals.page = "default";
  	next();
  });
  app.use(app.router);
});

app.get('/', function(req, res) {
	res.render('homepage');
});
app.get('/profile', function(req, res) {
	res.render('profile', { page:'profile' });
});

/*
 * Web server
 */

exports.server = http.createServer(app).listen(app.get('port'), function() {
  console.log('Balloons.io started on port %d', app.get('port'));
});
