/*
 * Module dependencies
 */

var passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy
  , config = module.parent.exports.config
  , mongoose = require('mongoose');

var Citizen = mongoose.model('Citizen');

/*
 * Auth strategy
 */

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new FacebookStrategy({
    clientID: config.auth.facebook.clientid,
    clientSecret: config.auth.facebook.clientsecret,
    callbackURL: config.auth.facebook.callback
  },
  function(accessToken, refreshToken, profile, done) {
    Citizen.findOne({ 'profiles.facebook.id': profile.id }, function(err, citizen) {
      if(!err && citizen) {
        done(null, citizen);
      } else if(!err) {
        var newCitizen = new Citizen();
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