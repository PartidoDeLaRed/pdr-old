var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , categories = Object.keys(require('../fixtures/categories'));

var IssueVoteOptionSchema = require('./issueVoteOption').schema;

/*
 * Issue Schema
 */
var IssueSchema = new Schema({
  title: {type: String, required: true, min: 8, max: 256 },
  essay: { type: String, min: 512, max: 2048},
  category: {type: String, required: true, enum: categories},

  author: { type: ObjectId, ref: 'Citizen' },
  authors: [{ type: ObjectId, required: true, ref: 'Citizen'}],

  census: [{type: ObjectId, ref: 'Citizen' }],    // Citizens who have been participating in discussion and Issue's activity

  vote: {
    choices: [IssueVoteOptionSchema],
    voters: [{type: ObjectId, ref: "Citizen"}],
    updatedAt: {type: Date, default: Date.now}
  },

  // comments?

  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});


IssueSchema.virtual('abstract').get(function() {
  var firstDot = 0;
  if(this.essay.length < 150) return this.essay;
  firstDot = this.essay.indexOf('.')
  if(firstDot < 150 && firstDot > 100) return this.essay.substr(0, firstDot).concat('[...]');
  return this.essay.substr(0, 150).concat('[...]');
});

IssueSchema.methods.loadComments = function(cb) {
  var q = this.model('Comment').find({context: 'issue', reference: this._id}, null, {sort: {createdAt: -1}});
  q.populate('author')
  q.populate('replies.author')
  q.populate('metadata.initiative.idea')
  q.populate('metadata.initiative.ideaAuthor')
  return q.exec(cb);
};

module.exports = mongoose.model('Issue', IssueSchema);