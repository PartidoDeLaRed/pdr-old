var mongoose = require('mongoose')
  , Delegation = mongoose.model('Delegation')
  , Issue = mongoose.model('Issue')
  , categories = require('../fixtures/categories');

module.exports = function(app, utils) {
  app.post('/api/delegations/create', utils.restrict, loadDelegationScope, loadDelegation, createDelegation, function(req, res) {
    res.send(req.delegation.id);
  });

  app.post('/api/delegations/delete', utils.restrict, loadDelegationScope, loadDelegation, deleteDelegation, function(req, res) {
    res.send(req.delegation ? req.delegation.id : '');
  });
};

var loadDelegationScope = function(req, res, next) {
  if(req.param('category')) req.scope = 'category';
  if(req.param('issue')) req.scope = 'issue';
  if(!req.scope) return res.json({error: "no category or issue reference received!"});
  next();
};

var loadDelegation = function(req, res, next) {
  var query;

  if(req.scope == 'category') {
    query = Delegation.findOne({truster: req.user.id, scope: req.scope, category: req.param('category')});
  } else {
    query = Delegation.findOne({truster: req.user.id, scope: req.scope, issue: req.param('issue')});
  }

  query.exec(function(err, delegation) {
    req.delegation = delegation;
    next()
  });
};

var createDelegation = function(req, res, next) {
  if(!req.delegation) {
    req.delegation = new Delegation({
      truster: req.user.id,
      scope: req.scope,
      category: req.param('category'),
      issue: req.param('issue'),
      trustees: [req.param('tid')]
    });
  }
  // create new delegation

  req.delegation.trustees.addToSet(req.param('tid'));
  req.delegation.save(function(err) {
    if(err) return res.json({error: err});
    next();
  });
};

var deleteDelegation = function(req, res, next) {
  console.log(req.delegation);
  if(!req.delegation) return next();
  // delete existent delegation
  req.delegation.trustees.remove(req.param('tid'));
  req.delegation.save(function(err) {
    if(err) return res.json({error: err});
    next();
  })
};