/*
 * Module dependencies
 */

var passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy
  , config = require('./config.json')
  , models = module.parent.exports.models;

/*
 * Auth strategy
 */

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

if(config.auth.twitter.consumerkey.length) {
  passport.use(new TwitterStrategy({
      consumerKey: config.auth.twitter.consumerkey,
      consumerSecret: config.auth.twitter.consumersecret,
      callbackURL: config.auth.twitter.callback
    },
    function(token, tokenSecret, profile, done) {
      return done(null, profile);
    }
  ));
} 

if(config.auth.facebook.clientid.length) {
  passport.use(new FacebookStrategy({
      clientID: config.auth.facebook.clientid,
      clientSecret: config.auth.facebook.clientsecret,
      callbackURL: config.auth.facebook.callback
    },
    function(accessToken, refreshToken, profile, done) {
      models.Citizen.findOne({ 'profiles.facebook.id': profile.id }, function(err, citizen) {
        if(!err && citizen) {
          done(null, citizen);
        } else if(!err) {
          var newCitizen = new models.Citizen();
          newCitizen.firstName = profile.name.givenName;
          newCitizen.lastName = profile.name.familyName;
          newCitizen.username = profile.username;
          newCitizen.city = profile._json.location || profile._json.hometown || {}; 
          newCitizen.profiles = {facebook: profile};       
          newCitizen.save(function(err, ctz) {
            if(!err) done(null, newCitizen);
          });
        } else {
          console.log("Something happened!! ==>>", err);
          done(err, null)
        }
      });
    }
  ));
}
