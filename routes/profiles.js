var mongoose = require('mongoose')
  , Citizen = mongoose.model('Citizen')
  , Delegation = mongoose.model('Delegation');

module.exports = function(app, utils) {
  app.get('/profiles/me', utils.restrict, function(req, res) {
    res.render('profile-newsfeed', { page: 'profile', section: "activity", profile: req.user });
  });

  app.get('/profiles/:id', utils.restrict, function(req, res) {
    if(req.params.id === req.user._id) {
      res.render('profile', { page: 'profile', profile: req.user });
    } else {
      Citizen.findById(req.params.id, function(err, citizen) {
        if(!err && citizen) return res.render('profile-newsfeed', { page: 'profile', section: 'activity', profile: citizen });
        res.send(404, 'Sorry, we cannot find that!'); //should be res.render('404'{status: 404, err: err });
      });
    }
  });

  app.get('/profiles/me/delegations', utils.restrict, function(req, res) {
    Citizen.findById(req.user.id, function(err, citizen) {
      Delegation
      .find({truster: req.user.id, scope: "category"})
      .populate('trustees', 'firstName lastName')
      .exec(function(err, delegations) {
        var userCategoryDelegations = {};
        delegations.forEach(function(delegation) {
          var result = [];
          delegation.trustees.forEach(function(trustee) {
            if(trustee.id === req.user.id) return; //ignore current user
            result.push({id:trustee.id, name: trustee.fullName});
          });

          userCategoryDelegations[delegation.category] = result;
        });
        if(!err && citizen) return res.render('profile-delegations', {page: 'profile', section:'delegations', profile: citizen, userCategoryDelegations: userCategoryDelegations});
        res.send(404, 'Sorry, we cannot find that!'); //should be res.render('404'{status: 404, err: err });
      });
    });
  });

  app.get('/api/profiles?', utils.restrict, function(req, res) {
    var query = new RegExp(".*" + req.param('q') + ".*","i");
    
    Citizen
    .find()
    .or([{firstName: query}, {lastName: query}])
    .select('firstName lastName username imageUrl')
    .exec(function(err, citizens) {
      var result = [];
      citizens.forEach(function(citizen) {
        if(citizen.id === req.user.id) return; //ignore current user
        result.push({id:citizen.id, name: citizen.fullName, username: citizen.username, imageUrl: citizen.imageUrl});
      });
      res.json(result);
    });
  });
};