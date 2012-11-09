var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , categories = Object.keys(require('../fixtures/categories'));

var DelegationSchema = new Schema({
    truster: {type: ObjectId, ref:'Citizen', required: true}
  , scope: {type: String, enum: ['category', 'issue'], required: true}
  , category: {type: String, enum: categories }
  , issue: {type: ObjectId, ref: 'Issue'}
  , trustees: [{type: ObjectId, ref: 'Citizen'}]
  , updatedAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Delegation', DelegationSchema);