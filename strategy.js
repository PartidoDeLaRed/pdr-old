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

passport.serializeUser(function(citizen, done) {
  done(null, citizen._id);
});

passport.deserializeUser(function(citizenId, done) {
  Citizen.findById(citizenId, function(err, citizen) {
    done(null, citizen);
  });
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
        done(err, null);
      }
    });
  }
));

passport.use(new TwitterStrategy({
    consumerKey: config.auth.twitter.consumerkey,
    consumerSecret: config.auth.twitter.consumersecret,
    callbackURL: config.auth.twitter.callback
  },
  function(accessToken, refreshToken, profile, done) {
    Citizen.findOne({ 'profiles.twitter.id': profile.id }, function(err, citizen) {
      if(!err && citizen) {
        done(null, citizen);
      } else if(!err) {
        var newCitizen = new Citizen();

        var names = profile.displayName.split(' ');
        if(names.length) {
          newCitizen.firstName = names.shift();
          newCitizen.lastName = names.join(' ');
        }

        newCitizen.username = profile.username;
        newCitizen.city = profile._json.location || profile._json.hometown || {}; 
        newCitizen.profiles = {twitter: profile};       
        newCitizen.save(function(err, ctz) {
          if(!err) done(null, newCitizen);
        });
      } else {
        console.log("Something happened!! ==>>", err);
        done(err, null);
      }
    });
  }
));