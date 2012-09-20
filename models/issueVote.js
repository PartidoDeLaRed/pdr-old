var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

/*
 * Issue Vote Schema
 */
var IssueVoteSchema = new Schema({
    issue       : { type: ObjectId, required: true, ref: 'Issue' }
  , voters      : { type: [ObjectId], default: [], ref: 'Citizen' }
  , choices     : { type: [ObjectId], ref: 'IssueVoteOption'}
  , createdAt   : { type: Date, default: Date.now }
  , updatedAt   : Date
});

module.exports = mongoose.model('IssueVote', IssueVoteSchema);