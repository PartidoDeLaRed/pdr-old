var mongoose = require('mongoose')
  , IssueVote = mongoose.model('IssueVote');

module.exports = function(app, utils) {
  app.get('/voting', function(req, res) {
    IssueVote.find({}).populate('issue').exec(function(err, results) {
      res.render('voting', {page:'profile', votes: results || [] });
    });
  });
};