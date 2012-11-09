var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var CommentReplySchema = require('./commentReply').schema;

/*
 * Comment Schema
 */
var CommentSchema = new Schema({
    author: {type: ObjectId, required: true, ref: 'Citizen'}
  , context: {type: String, default: 'issue', enum: ['issue', 'issue-vote', 'idea', 'idea-vote']}
  , reference: {type: ObjectId} // references the _id property of the discussion context
  , text: {type: String}
  , metadata: {
      initiative: {
          choice: {type: ObjectId} //issueVote choice id!!
        , idea: {type: ObjectId, ref: 'Idea'}
        , ideaAuthor: {type: ObjectId, ref: 'Citizen'}
      }
    }
  , replies: [CommentReplySchema]
  , createdAt: {type: Date, default: Date.now}
  , updatedAt: {type: Date}
});


CommentSchema.post('save', function(comment) {
  var Element = this.context.charAt(0).toUpperCase() + this.context.slice(1);

  try {
    Element = this.model(Element);
  } catch (err) {
    console.log(err);
    return;
  }
  Element.findById(this.reference, function(err, element) {
    element.census.addToSet(comment.author);
    element.save(function(err) {
      if(err) console.log(err);
    });
  })
});

module.exports = mongoose.model('Comment', CommentSchema);