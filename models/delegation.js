var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var DelegationHashSchema = new Schema({
  hash: {type: ObjectId, ref: 'Hash'},
  trusters: {type: ObjectId, ref: 'Citizen'}
});

var DelegationSchema = new Schema({
  trustee: {type: ObjectId, ref:'Citizen'},
  hashes: [DelegationHashSchema],
  updatedAt: Date
});

module.exports = mongoose.model('Delegation', DelegationSchema);