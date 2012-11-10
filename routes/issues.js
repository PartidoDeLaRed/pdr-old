var mongoose = require('mongoose')
  , Issue = mongoose.model('Issue')
  , Comment = mongoose.model('Comment')
  , Delegation = mongoose.model('Delegation');

module.exports = function(app, utils) {
  app.post('/issues/process', utils.restrict, function(req, res) {
    if(!req.body.issue) return res.redirect('/');
    if(!req.body.issue._id) {
      var newIssue = new Issue({
        title: req.body.issue.title,
        category: req.body.issue.category,
        essay: req.body.issue.essay,
        author: req.user,
        authors: [req.user],
        census: [req.user]
      }).save(function(err, issue) {
        if(err) {
          console.log(err)
          return res.redirect('back');
        };
        res.redirect('/issues/' + issue.id);
      });
    } else {
      //Here to edit... ?
    }
  });

  app.get('/issues/:id', function(req, res) {
    Issue
    .findById(req.params.id)
    .populate('author')
    .populate('vote.choices.idea')
    .populate('vote.choices.author')
    .populate('vote.choices.sponsor')
    .exec(function(err, issue) {
      if(err) console.log(err);
      if(!issue) return res.redirect('/');
      issue.loadComments(function(err, comments) {
        if(req.user) {
          Delegation
          .findOne({truster: req.user.id, category: issue.category})
          // .select('trustees')
          .populate('trustees')
          .exec(function(err, delegation) {
            res.render('issues/single', {page: 'idea', issue: issue, author: issue.author, comments: comments, delegation: delegation});
          });
        } else {
          res.render('issues/single', {page: 'idea', issue: issue, author: issue.author, comments: comments, delegation: {}});
        }
      });
    });
  });

  app.get('/issues', function(req, res) {
    Issue.find(null, function(err, results) {
      res.render('issues/list', {page:'profile', issues: results || [] });
    });
  });

  app.post('/api/issues/:id/vote', utils.restrict, loadIssueId, loadIssueById, checkIssueHasChoice, loadAllowedVoters, vote, function(req, res) {
    res.send(req.body.idea);
  });
}

var loadIssueId = function(req, res, next) {
  req.issueId = req.param('id');
  next();
};

var loadIssueById = function(req, res, next) {
  Issue
  .findById(req.issueId)
  .exec(function(err, issue) {
    if(err) console.log(err);
    req.issue = issue;
    next();
  });
};

var checkIssueHasChoice = function(req, res, next) {
  if(!req.issue) return next();
  var choice = req.issue.vote.choices.id(req.body.choice);
  if(!choice) console.log('voting for issue', req.issueId, 'has no choice', req.body.choice);
  req.choice = choice;
  next();
};

var loadAllowedVoters = function(req, res, next) {
  if(!req.issue) return next();
  req.voters = [req.user.id];

  //loading trusters for this citizen
  Delegation
  .find({category: req.issue.category, trustees: req.user.id})
  .distinct('truster', function(err, trusters) {
    req.voters = req.voters.concat(trusters);
    next();
  });
};

var vote = function(req, res, next) {
  //errors before!
  if(!req.issue || !req.choice || !req.voters) return next();

  // Let mongoose find out who can vote!
  var voters = req.issue.vote.voters.addToSet.apply(req.issue.vote.voters, req.voters);
  if(!voters.length) return next(); //already voted!

  req.choice.result += voters.length;

  req.issue.save(function(err) {
    if(err) console.log(err);
    next();
  });
}
