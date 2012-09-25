var mongoose = require('mongoose')
  , IssueVote = mongoose.model('IssueVote');

module.exports = function(app, utils) {
  app.get('/voting', function(req, res) {
    IssueVote.find(null, function(err, results) {
      res.render('voting', {page:'profile', votes: results || [] });
    });
  });
};