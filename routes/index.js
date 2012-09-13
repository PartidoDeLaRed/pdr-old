var app = module.parent.exports.app
  , mongoose = require('mongoose')
  , config = require('../config')
  , utils = require('../utils')
  , passport = require('passport');

var Idea = mongoose.model('Idea')
  , Citizen = mongoose.model('Citizen');

/**
 * HTTP authentication module.
 */
var auth = require('http-auth');
var basic = auth({
    authRealm : "Private area.",
    authList : ['pepe:tortugasninja']
});
/*
 * Homepage
 */

app.get('/', function(req, res, next) {
  // For development only we use http-auth!!
  basic.apply(req, res, function(username) {
    Idea.findOne(null,null, {sort: {createdAt: -1}}).populate('author').exec(function(err, idea) {
      if(req.isAuthenticated() && req.user) {
        res.render('idea', {page: 'idea', idea: idea, author: idea.author });
      } else{
        res.render('idea', {page: 'idean', idea: idea, author: idea.author });
      }
    });
  });
});

/*
 * Authentication routes
 */
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
  Idea.find(null, function(err, results) {
    res.render('voting', {page:'profile', ideas: results || [] });
  })
});

app.get('/voting/:id', utils.restrict, function(req, res) {
  Idea.findById(req.params.id, function(err, idea) {
    if(idea.author === req.user._id) {
      res.render('idea', { page: 'idea', idea: idea, author: req.user });
    } else {
      Citizen.findById(idea.author, function(err, author) {
        res.render('idea', { page: 'idea', idea: idea, author: author });
      });
    }
  })
});

app.get('/idea/forge', utils.restrict, function(req, res) {
  res.render('idea-form');
});

app.post('/idea/process', utils.restrict, function(req, res) {
  var newIdea = new Idea(req.body.idea);
  newIdea.author = req.user._id;
  newIdea.save();
  res.redirect('/voting')
});

app.get('/profile/:id', utils.restrict, function(req, res) {
	if(req.params.id === req.user._id) {
		res.render('profile', { page: 'profile', profile: req.user });
	} else {
		Citizen.findById(req.params.id, function(err, citizen) {
			if(!err && citizen) return res.render('profile', { page: 'profile', profile: citizen });
			res.send(404, 'Sorry, we cannot find that!'); //should be res.render('404'{status: 404, err: err });
		});
	}
});