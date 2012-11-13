/*
 * Module dependencies
 */
var passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy
  , mongoose = require('mongoose');

module.exports = function(app) {
  var config = app.get('config')
    , Citizen = mongoose.model('Citizen');

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
      var imageUrl = profile._json.picture.url || profile._json.picture;

      Citizen.findOne({ 'profiles.facebook.id': profile.id }, function(err, citizen) {
        if(!err && citizen) {
          if(citizen.imageUrl === imageUrl) return done(err, citizen);
          citizen.imageUrl = imageUrl;
          citizen.save(function(err, ctz) {
            return done(err, ctz);
          });
        } else if(!err) {
          var newCitizen = new Citizen();
          newCitizen.firstName = profile.name.givenName;
          newCitizen.lastName = profile.name.familyName;
          newCitizen.username = profile.username;
          newCitizen.location = profile._json.location.name; 
          newCitizen.hometown = profile._json.hometown.name; 
          newCitizen.imageUrl = imageUrl;
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
      var imageUrl = profile._json.profile_image_url;

      Citizen.findOne({ 'profiles.twitter.id': profile.id }, function(err, citizen) {
        if(!err && citizen) {
          if(citizen.imageUrl === imageUrl) return done(err, citizen);
          citizen.imageUrl = imageUrl;
          citizen.save(function(err, ctz) {
            return done(err, ctz);
          });
        } else if(!err) {
          var newCitizen = new Citizen();

          newCitizen.fullName = profile.displayName;
          newCitizen.username = profile.username;
          newCitizen.location = profile._json.location; 
          newCitizen.imageUrl = imageUrl;
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
};