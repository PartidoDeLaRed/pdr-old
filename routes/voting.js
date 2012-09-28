var mongoose = require('mongoose')
  , Issue = mongoose.model('Issue')
  , IssueVote = mongoose.model('IssueVote');

module.exports = function(app, utils) {
  app.get('/voting', function(req, res) {
    // IssueVote.find({}).populate('issue').exec(function(err, results) {
    //   res.render('voting', {page:'profile', votes: results || [] });
    // });
    Issue.find(null, function(err, results) {
      res.render('issues', {page:'profile', issues: results || [] });
    });
  });
};