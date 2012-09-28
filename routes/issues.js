var mongoose = require('mongoose')
  , Issue = mongoose.model('Issue')
  , Comment = mongoose.model('Comment');

module.exports = function(app, utils) {
  app.post('/issues/process', utils.restrict, function(req, res) {
    if(!req.body.issue) res.redirect('/');
      // Deberiamos chequear el formulario y devolver errores
      // O dejarle a mongoose el tema validación y configurar un
      // middleware para devolver una respuesta con los errores
    if(!req.body.issue._id) {
      var newIssue = new Issue({
        title: req.body.issue.title,
        abstract: req.body.issue.abstract,
        essay: req.body.issue.essay,
        author: req.user._id,
        authors: [req.user._id],
        census: [req.user._id]
      }).save(function(err, issue) {
        if(err) console.log(err);
        res.redirect('/issues/' + issue._id);
      });
    } else {
      //Here to edit... ?
    }
  });

  app.get('/issues/:id', function(req, res) {
    Issue.findById(req.params.id).populate('author').exec(function(err, issue) {
      if(err) console.log(err);
      if(!issue) return res.redirect('/');
      issue.loadComments(function(err, comments) {
        issue.loadVote(function(err, issueVote) {
          res.render('issue', {page: 'idea', issue: issue, author: issue.author, comments: comments});
        });
      });
    });
  });

  app.get('/issues', function(req, res) {
    Issue.find(null, function(err, results) {
      res.render('issues', {page:'profile', issues: results || [] });
    });
  });
}

