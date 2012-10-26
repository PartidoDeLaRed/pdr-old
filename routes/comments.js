var mongoose = require('mongoose')
  , Comment = mongoose.model('Comment')
  , Idea = mongoose.model('Idea')
  , IssueVoteOption = mongoose.model('IssueVoteOption')
  , IssueVote = mongoose.model('IssueVote')
  , jade = require('jade');

module.exports = function(app, utils) {
  app.post('/comments/process', function(req, res) {

    if(!req.body.comment) return res.redirect('back');
    commentReference = 
      composeCommentReference(req.header('referrer')) || 
      {context: 'issue', reference: req.body.comment.reference};

    if(req.body.initiative && req.body.initiative.title.length) submitInitiative(commentReference.reference, req.user, req.body.initiative);
    
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

  app.post('/api/comments/publish', utils.restrict, function(req, res) {
    if(!req.body.comment) return res.redirect('back');
    commentReference = 
      composeCommentReference(req.header('referrer')) || 
      {context: 'issue', reference: req.body.comment.reference};

    if(req.body.initiative && req.body.initiative.title.length) submitInitiative(commentReference.reference, req.user, req.body.initiative);
    
    var newComment = new Comment({
        context: commentReference.context
      , reference: commentReference.reference
      , author: req.user
      , text: req.body.comment.text
    });
    newComment.save(function(err, comment) {
      if(err) {
        res.send(err);
      }
      var cm = comment.toObject();
      cm.author = req.user;
      res.render('element/comment_single', {comment: cm, element: {id: cm.reference}});
    });
  });
};

var caringRoutes = { //rutas extraidas de app.router!! con console.log
    'issue-vote': /\/voting\/issue\/(?:([^\/]+?))\/?$/g
  , 'idea-vote': /\/voting\/idea\/(?:([^\/]+?))\/?$/g
  , 'issue': /\/issues\/(?:([^\/]+?))\/?$/g
  , 'idea': /\/ideas\/(?:([^\/]+?))\/?$/g
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

var submitInitiative = function(issueId, author, initiative) {
  idea = new Idea(initiative);
  idea.author = author;
  idea.authors.push(author);
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