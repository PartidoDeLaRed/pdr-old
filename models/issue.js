var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , categories = Object.keys(require('../fixtures/categories'));

/*
 * Issue Schema
 */
var IssueSchema = new Schema({
  title: {type: String, required: true, min: 8, max: 256 },
  category: {type: String, required: true, enum: categories},
  essay: { type: String, min: 512, max: 2048},
  author: { type: ObjectId, ref: 'Citizen' },
  authors: [{ type: ObjectId, required: true, ref: 'Citizen'}],
  link: {type: String},
  sources: {type: String},
  census: [{type: ObjectId, ref: 'Citizen' }],
  votes: [{type: ObjectId, ref: 'IssueVote'}],
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

IssueSchema.post('save', function() {
  var IssueVote = mongoose.model('IssueVote');
  var issueVote = new IssueVote({
    issue: this._id
  }).save();
});

IssueSchema.methods.loadVote = function(cb) {
  return this.model('IssueVote').findOne({issue: this._id}).populate('choices.idea').populate('choices.idea.author').exec(cb);
};

IssueSchema.methods.loadComments = function(cb) {
  var q = this.model('Comment').find({context: 'issue', reference: this._id}, null, {sort: {createdAt: -1}});
  q.populate('author')
  q.populate('replies.author')
  q.populate('metadata.initiative.idea')
  q.populate('metadata.initiative.ideaAuthor')
  return q.exec(cb);
};

module.exports = mongoose.model('Issue', IssueSchema);