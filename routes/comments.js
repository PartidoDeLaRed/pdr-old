var mongoose = require('mongoose')
  , Comment = mongoose.model('Comment')
  , CommentReply = mongoose.model('CommentReply')
  , Idea = mongoose.model('Idea')
  , Issue = mongoose.model('Issue')
  , IssueVoteOption = mongoose.model('IssueVoteOption');

module.exports = function(app, utils) {
  app.post('/comments/process', utils.restrict, processCommentReference, processInitiative, checkParentComment, function(req, res) {    
    if(req.parentComment) {
      replyCommentSubmit(req, res, function() {
        res.redirect('back');
      });
    } else {
      newCommentSubmit(req, res, function() {
        res.redirect('back');
      });
    }
  });

  app.post('/api/comments/publish', utils.restrict, processCommentReference, processInitiative, checkParentComment, function(req, res) {
    if(req.parentComment) {
      replyCommentSubmit(req, res, function() {
        res.render('element/comment_reply_single', {reply: req.comment});
      });
    } else {
      newCommentSubmit(req, res, function() {
        res.render('element/comment_single', {comment: req.comment, element: {id: req.reference.reference}});
      });
    }
  });
};

var caringRoutes = { //rutas extraidas de app.router!! con console.log
    'issue': /\/issues\/(?:([^\/]+?))\/?$/g
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

var processCommentReference = function(req, res, next) {
    if(!req.body.comment) return res.redirect('back');
    req.reference = 
      composeCommentReference(req.header('referrer')) || 
      {context: 'issue', reference: req.body.comment.reference};

    next();
};

var processInitiative = function(req, res, next) {
  if(!req.body.initiative || !req.body.initiative.title.length) return next();
  req.idea = new Idea(req.body.initiative);
  req.idea.author = req.user;
  req.idea.authors.push(req.user);
  req.idea.save(function(err, i) {
    if(!err && i) {
      req.issueVoteOption = new IssueVoteOption({
          idea: req.idea
        , author: req.idea.author
        , sponsor: req.user.id
      });

      Issue
      .findById(req.reference.reference)
      .exec(function(err, issue) {
        issue.vote.choices.push(req.issueVoteOption);
        issue.save(function(err) {
          if(err) console.log(err);
          next();
        });
      });
    }
  });
};

var checkParentComment = function(req, res, next) {
  if(!req.body.comment.id) return next();
  Comment.findById(req.body.comment.id, function(err, comment) {
    if(err) console.log(err);
    if(comment) {
      req.parentComment = comment;
    }
    next();
  });
};

var newCommentSubmit = function(req, res, next) {
  var newComment = new Comment({
      context: req.reference.context
    , reference: req.reference.reference
    , author: req.user
    , text: req.body.comment.text
  });

  if(req.issueVoteOption) {
    newComment.metadata = {
      initiative: {
          choice: req.issueVoteOption._id
        , idea: req.idea
        , ideaAuthor: req.idea.author
      }
    }
  }

  newComment.save(function(err, comment) {
    if(err) console.log(err);
    if(!comment) return next();
    var cm = comment.toObject();
    cm.author = req.user;
    req.comment = cm;
    next();
  });

};

var replyCommentSubmit = function(req, res, next) {
  var commentReply = new CommentReply({
      author: req.user
    , text: req.body.comment.text
  });

  req.parentComment.replies.push(commentReply);
  req.parentComment.save(function(err) {
    if(err) console.log(err);
    var cm = commentReply.toObject();
    cm.author = req.user;
    req.comment = cm;
    next();
  });
};