var app = module.parent.exports.app
  , mongoose = require('mongoose')
  , config = require('../config')
  , utils = require('../utils')
  , passport = require('passport');

var Issue = mongoose.model('Issue')
  , Idea = mongoose.model('Idea')
  , IssueVote = mongoose.model('IssueVote')
  , Citizen = mongoose.model('Citizen');

/**
 * HTTP authentication module.
 */
var basic = require('http-auth')({
  authRealm : "Private area.",
  authList : ['pepe:tortugasninja']
});

/*
 * Homepage
 */

app.get('/', function(req, res, next) {
  if ('development' == app.get('env')) {
    Issue.findOne(null,null, {sort: {createdAt: -1}}).populate('author').exec(function(err, idea) {
        if(!idea) return res.render('index');
        res.render('idea', {page: 'idea', idea: idea, author: idea.author });
    });
  } else {
    basic.apply(req, res, function(username) {
      Issue.findOne(null,null, {sort: {createdAt: -1}}).populate('author').exec(function(err, idea) {
          if(!idea) return res.render('index');
          res.render('idea', {page: 'idea', idea: idea, author: idea.author });
      });
    });
  }
});

/*
 * Authentication routes
 */
app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/'
  })
);

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', {
    successRedirect: '/',
    failureRedirect: '/'
  })
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.post('/issues/process', utils.restrict, function(req, res) {
  if(!req.body.issue) res.redirect('/');
    // Deberiamos chequear el formulario y devolver errores
    // O dejarle a mongoose el tema validación y configurar un
    // middleware para devolver una respuesta con los errores
  if(!req.body.issue._id) {
    var newIssue = new Issue({
      title: req.body.issue.title,
      abstract: req.body.issue.abstract,
      essay: req.body.issue.essay,
      author: req.user._id,
      authors: [req.user._id],
      census: [req.user._id]
    }).save(function(err, issue) {
      if(err) console.log(err);
      res.redirect('/issues/' + issue._id);
    });
  } else {
    //Here to edit... ?
  }
});

app.get('/issues/:id', function(req, res) {
  Issue.findById(req.params.id).populate('author').exec(function(err, issue) {
    if(err) console.log(err);
    res.render('issue', {page: 'idea', issue: issue, author: issue.author});
  });
});

app.get('/issues', function(req, res) {
  Issue.find(null, function(err, results) {
    res.render('issues', {page:'profile', issues: results || [] });
  });
});

app.post('/ideas/process', utils.restrict, function(req, res) {
  var newIdea = new Idea(req.body.idea);
  newIdea.author = req.user._id;
  newIdea.authors.push(req.user._id);
  newIdea.save();
  res.redirect('/ideas/' + newIdea._id);
});

app.get('/ideas/:id', function(req, res) {
  Idea.findById(req.params.id).populate('author').exec(function(err, idea) {
    res.render('idea', { page: 'idea', idea: idea, author: idea.author });
  });
});

app.get('/ideas', function(req, res) {
  Idea.find(null, function(err, results) {
    res.render('ideas', {page:'profile', ideas: results || [] });
  });
});

app.get('/voting', function(req, res) {
  IssueVote.find(null, function(err, results) {
    res.render('voting', {page:'profile', votes: results || [] });
  });
});

// Old routes
app.get('/ideas/forge', utils.restrict, function(req, res) {
  res.render('ideas/form');
});

app.get('/profiles/me', utils.restrict, function(req, res) {
  res.render('profile', { page: 'profile', profile: req.user });
});

app.get('/profiles/:id', utils.restrict, function(req, res) {
	if(req.params.id === req.user._id) {
		res.render('profile', { page: 'profile', profile: req.user });
	} else {
		Citizen.findById(req.params.id, function(err, citizen) {
			if(!err && citizen) return res.render('profile', { page: 'profile', profile: citizen });
			res.send(404, 'Sorry, we cannot find that!'); //should be res.render('404'{status: 404, err: err });
		});
	}
});

app.get('/settings', utils.restrict, function(req, res) {
  res.send('Settings page should be here...');
});

app.get('/help', function(req, res) {
  res.send('This page is same as "Como funciona?"');
});