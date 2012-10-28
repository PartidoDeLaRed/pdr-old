var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var IssueVoteOptionSchema = require('./issueVoteOption').schema;

/*
 * Issue Vote Schema
 */
var IssueVoteSchema = new Schema({
    issue       : { type: ObjectId, required: true, ref: 'Issue' }
  , voters      : [{ type: ObjectId, ref: 'Citizen' }]
  , choices     : [IssueVoteOptionSchema]
  , createdAt   : { type: Date, default: Date.now }
  , updatedAt   : Date
});

module.exports = mongoose.model('IssueVote', IssueVoteSchema);

