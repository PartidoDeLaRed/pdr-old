var mongose = require('mongoose')
  , Delegation = mongoose.model('Delegation')
  , Citizen = mongoose.model('Citizen')
  , Issue = mongoose.model('Issue');

module.exports = function(app, utils) {
  app.post('/api/delegation/list', function(req, res) {
    
  });

  app.post('/api/delegation/sinle', function(req, res) {

  });
};