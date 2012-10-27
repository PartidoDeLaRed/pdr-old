var mongoose = require('mongoose')
  , Idea = mongoose.model('Idea');

module.exports = function(app, utils) {
  app.post('/ideas/process', utils.restrict, function(req, res) {
    var newIdea = new Idea(req.body.idea);
    newIdea.author = req.user._id;
    newIdea.authors.push(req.user._id);
    newIdea.save();
    res.redirect('/ideas/' + newIdea._id);
  });

  app.get('/ideas/:id', function(req, res) {
    Idea.findById(req.params.id).populate('author').exec(function(err, idea) {
      idea.loadComments(function(err, comments) {
        res.render('ideas/single', { page: 'idea', idea: idea, author: idea.author, comments: comments });
      });
    });
  });

  app.get('/ideas', function(req, res) {
    Idea.find(null, function(err, results) {
      res.render('ideas/list', {page:'profile', ideas: results || [] });
    });
  });

  // Old routes
  app.get('/ideas/forge', utils.restrict, function(req, res) {
    res.render('ideas/form');
  });
};