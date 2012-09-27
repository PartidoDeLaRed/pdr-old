var mongoose = require('mongoose')
  , utils = require('../utils')
  , Issue = mongoose.model('Issue')
  , Comment = mongoose.model('Comment');

/**
 * HTTP authentication module.
 */
var basic = require('http-auth')({
  authRealm : "Private area.",
  authList : ['pepe:tortugasninja']
});


module.exports = function(app) {

  /*
   *  Homepage route
   */
  app.get('/', function(req, res, next) {
    if ('development' == app.get('env')) {
      Issue.findOne(null,null, {sort: {createdAt: -1}}).populate('author').exec(function(err, issue) {
        if(!issue) return res.render('index');
        Comment.find({context: 'issue', reference: issue._id}, null, {sort: {createdAt: -1}}).populate('responses').populate('author').exec(function(err, comments) {
          res.render('issue', {page: 'idea', issue: issue, author: issue.author, comments: comments});
        });
      });
    } else {
      basic.apply(req, res, function(username) {
        Issue.findOne(null, null, {sort: {createdAt: -1}}).populate('author').exec(function(err, issue) {
          if(!issue) return res.render('index');
          Comment.find({context: 'issue', reference: issue._id}, null, {sort: {createdAt: -1}}).populate('responses').populate('author').exec(function(err, comments) {
            res.render('issue', {page: 'idea', issue: issue, author: issue.author, comments: comments});
          });
        });
      });
    }
  });

  /*
   *  Auth routes
   */
  require('./auth')(app, utils);
  
  /*
   *  Issues routes
   */
  require('./issues')(app, utils);

  /*
   *  Ideas routes
   */
  require('./ideas')(app, utils);

  /*
   *  Voting routes
   */
  require('./voting')(app, utils);

  /*
   *  Profiles routes
   */
  require('./profiles')(app, utils);

  /*
   *  Comments routes
   */
  require('./comments')(app, utils);

  /*
   *  Other routes
   */
  app.get('/settings', utils.restrict, function(req, res) {
    res.send('Settings page should be here...');
  });

  app.get('/help', function(req, res) {
    res.send('This page is same as "Como funciona?"');
  });
};


