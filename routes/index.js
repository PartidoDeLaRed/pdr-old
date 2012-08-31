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
  if(req.isAuthenticated()) {
    res.redirect('/profile/4');
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

app.get('/idea/:id', function(req, res) {
	res.render('idea', { page: 'idea' });
});

app.get('/profile/:id', function(req, res) {
	res.render('profile', { page: 'profile' });
});
