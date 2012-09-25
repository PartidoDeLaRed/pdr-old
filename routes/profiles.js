var mongoose = require('mongoose')
  , Citizen = mongoose.model('Citizen');

module.exports = function(app, utils) {
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
}