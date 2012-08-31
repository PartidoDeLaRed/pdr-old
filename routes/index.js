var parent = module.parent.exports
	, app = parent.app
	, models = parent.models
  , config = require('../config')
  , utils = require('../utils')
  , passport = require('passport');

/*
 * Homepage
 */

app.get('/', function(req, res, next) {
  if(req.isAuthenticated() && req.user) {
    res.redirect('/profile/' + req.user._id);
  } else{
    res.render('index');
  }
});

/*
 * Authentication routes
 */

if(config.auth.twitter.consumerkey.length) {
  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get('/auth/twitter/callback', 
    passport.authenticate('twitter', {
      successRedirect: '/',
      failureRedirect: '/'
    })
  );
}

if(config.auth.facebook.clientid.length) {
  app.get('/auth/facebook', passport.authenticate('facebook'));

  app.get('/auth/facebook/callback', 
    passport.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/'
    })
  );
}

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/voting', function(req, res) {
  res.render('voting', { page: 'profile', ideas: [{
    _id:1,
    title:"Los documentos contables del Estado deberian ser publicos y libres."
  }, {
    _id:2,
    title:"Cada argentino deberia poder decidir a dónde van sus ingresos."
  },{
    _id:3,
    title:"El dolar no debería tener más de un valor vigente."
  }]});
});

app.get('/voting/:id', utils.restrict, function(req, res) {
	res.render('idea', { page: 'idea' });
});

app.get('/idea/forge', utils.restrict, function(req, res) {
  res.render('idea-form');
});

app.post('/idea/process', utils.restrict, function(req, res) {
  var newIdea = new models.Idea(req.body.idea);
  newIdea.save();
  res.redirect('/voting')
});

app.get('/profile/:id', utils.restrict, function(req, res) {
	if(req.params.id === req.user._id) {
		res.render('profile', { page: 'profile', profile: req.user });
	} else {
		models.Citizen.findById(req.params.id, function(err, citizen) {
			if(!err && citizen) return res.render('profile', { page: 'profile', profile: citizen });
			res.send(404, 'Sorry, we cannot find that!'); //should be res.render('404'{status: 404, err: err });
		});
	}
});