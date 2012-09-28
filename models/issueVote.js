var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var IssueVoteOptionSchema = mongoose.model('IssueVoteOption').schema;

/*
 * Issue Vote Schema
 */
var IssueVoteSchema = new Schema({
    issue       : { type: ObjectId, required: true, ref: 'Issue' }
  , voters      : { type: [ObjectId], default: [], ref: 'Citizen' }
  , choices     : { type: [IssueVoteOptionSchema], default: []}
  , createdAt   : { type: Date, default: Date.now }
  , updatedAt   : Date
});

module.exports = mongoose.model('IssueVote', IssueVoteSchema);

