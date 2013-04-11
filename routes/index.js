var mongoose = require('mongoose')
  , utils = require('../utils')
  , Issue = mongoose.model('Issue');

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
    index(req, res);
  });

  var index = function(req, res) {
    Issue
    .find(null, null, {sort: {createdAt: -1}})
    .populate('author')
    .populate('census')
    .exec(function(err, issues) {
      res.render('homepage', {issues: issues});
    });
  };
  
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
   *  Delegation routes
   */
  require('./delegations')(app, utils);

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


