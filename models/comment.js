var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

/*
 * Comment Schema
 */
var CommentSchema = new Schema({
    author: {type: ObjectId, required: true, ref: 'Citizen'}
  , context: {type: String, default: 'issue', enum: ['issue', 'issue-vote', 'idea', 'idea-vote']}
  , reference: {type: ObjectId} // references the _id property of the discussion context
  , responses: {type: [ObjectId], default: [], ref: 'Comment'} // Is it better to have childs, not parents?
  , text: {type: String}
  , createdAt: {type: Date, default: Date.now}
  , updatedAt: {type: Date}
});

module.exports = mongoose.model('Comment', CommentSchema);