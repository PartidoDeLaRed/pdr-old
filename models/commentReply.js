var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

/*
 * Comment Reply Schema
 */
var CommentReplySchema = new Schema({
    author: {type: ObjectId, required: true, ref: 'Citizen'}
  , text: {type: String}
  , createdAt: {type: Date, default: Date.now}
  , updatedAt: {type: Date}
});

module.exports = mongoose.model('CommentReply', CommentReplySchema);