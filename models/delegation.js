var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , categories = Object.keys(require('../fixtures/categories'));

var DelegationHashSchema = new Schema({
  // hash: {type: ObjectId, ref: 'Hash'}, // For when hashes get created from citizens
    category: {type: String, enum: categories}
  , trusters: [{type: ObjectId, ref: 'Citizen'}]
});

var DelegationIssueSchema = new Schema({
    issue: {type: ObjectId, ref: 'Issue'}
  , trusters: [{type: ObjectId, ref: 'Citizen'}]
});

var DelegationSchema = new Schema({
    trustee: {type: ObjectId, ref:'Citizen'}
  , hashes: [DelegationHashSchema]
  , issues: [DelegationIssueSchema]
  , updatedAt: Date
});

module.exports = mongoose.model('Delegation', DelegationSchema);