var mongoose = require('mongoose')
  , Citizen = mongoose.model('Citizen');

module.exports = function(app, utils) {
  app.get('/profiles/me', utils.restrict, function(req, res) {
    res.render('profile-newsfeed', { page: 'profile', profile: req.user });
  });

  app.get('/profiles/:id', utils.restrict, function(req, res) {
    if(req.params.id === req.user._id) {
      res.render('profile', { page: 'profile', profile: req.user });
    } else {
      Citizen.findById(req.params.id, function(err, citizen) {
        if(!err && citizen) return res.render('profile-newsfeed', { page: 'profile', profile: citizen });
        res.send(404, 'Sorry, we cannot find that!'); //should be res.render('404'{status: 404, err: err });
      });
    }
  });

  app.get('/profiles/:id/delegations', utils.restrict, function(req, res) {
    Citizen.findById(req.params.id, function(err, citizen) {
      if(!err && citizen) return res.render('profile-delegations', {page: 'profile', profile: citizen});
      res.send(404, 'Sorry, we cannot find that!'); //should be res.render('404'{status: 404, err: err });
    });
  });

  app.get('/api/profiles?', utils.restrict, function(req, res) {
    var query = new RegExp(".*" + req.param('q') + ".*","i");
    
    Citizen.
      find()
      .or([{firstName: query}, {lastName: query}])
      .select('firstName lastName')
      .exec(function(err, citizens) {
      var result = [];
      citizens.forEach(function(citizen) {
        result.push({id:citizen.id, name: citizen.fullName});
      });
      res.json(result);
    });
  });
};