var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

/*
 * Issue Vote Option Schema
 */
var IssueVoteOptionSchema = new Schema({
    idea: {type: ObjectId, ref: "Idea"}         // Idea presented as a choice
  , author: {type: ObjectId, ref: "Citizen"}    // Original Author of the Idea presented
  , sponsor: {type: ObjectId, ref: "Citizen"}   // Sponsor of this Idea (Who presented it as a valid choice)
  , result: {type: Number, min: 0, default: 0}
  , updatedAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('IssueVoteOption', IssueVoteOptionSchema);