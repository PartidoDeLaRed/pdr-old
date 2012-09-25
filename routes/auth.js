 var passport = require('passport');
 
  /*
   * Authentication routes
   */
module.exports = function(app, utils) {
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
}