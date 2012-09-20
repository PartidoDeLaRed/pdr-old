var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

/*
 * Issue Vote Option Schema
 */
var IssueVoteOptionSchema = new Schema({
  idea: {type: ObjectId, ref: "Idea"},
  result: {type: Number, default: 0, min: 0}
});

module.exports = mongoose.model('IssueVoteOption', IssueVoteOptionSchema);