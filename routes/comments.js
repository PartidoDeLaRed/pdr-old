var mongoose = require('mongoose')
  , Comment = mongoose.model('Comment')
  , Idea = mongoose.model('Idea')
  , IssueVoteOption = mongoose.model('IssueVoteOption')
  , IssueVote = mongoose.model('IssueVote');

module.exports = function(app, utils) {
  app.post('/comments/process', function(req, res) {
    if(!req.body.comment) return res.redirect('back');
    commentReference = 
      composeCommentReference(req.header('referrer')) || 
      {context: 'issue', reference: req.body.comment.reference};

    if(req.body.initiative) submitInitiative(commentReference.reference, req.body.initiative);
    
    var newComment = new Comment({
        context: commentReference.context
      , reference: commentReference.reference
      , author: req.user
      , text: req.body.comment.text
    }).save(function(err, comment) {
      if(err) {
        res.redirect('back');
      }
      res.redirect('back');
    });
  });
};

var caringRoutes = { //rutas extraidas de app.router!! con console.log
    'issue-vote': /\/voting\/issue\/(?:([^\/]+?))\/?$/g
  , 'idea-vote': /\/voting\/idea\/(?:([^\/]+?))\/?$/g
  , 'issue': /\/issues\/(?:([^\/]+?))\/?$/g
  , 'idea': /\/idea\/(?:([^\/]+?))\/?$/g
};

var composeCommentReference = function(route) {
  var context
    , referenceMatch;
  for(context in caringRoutes) {
    referenceMatch = caringRoutes[context].exec(route);
    if(referenceMatch !== null && referenceMatch.length) return {context: context, reference: referenceMatch[1]};
  }
  return null;
};

var submitInitiative = function(issueId, initiative) {
  idea = new Idea(initiative);
  idea.save(function(err, i) {
    if(!err && i) {
      issueVoteOption = new IssueVoteOption({idea: idea._id});
      IssueVote.findOne({issue: issueId}, function(err, issueVote) {
        issueVote.choices.push(issueVoteOption);
        issueVote.save();
      });
    }
  });

}