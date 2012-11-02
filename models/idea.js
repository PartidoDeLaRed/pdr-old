var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

/*
 * Idea Schema
 */
var IdeaSchema = new Schema({
  title: {type: String, required: true, min: 8, max: 256 },
  essay: { type: String, min: 512, max: 2048},
  author: { type: ObjectId, required: true, ref: 'Citizen' },
  authors: [{ type: ObjectId, required: true, ref: 'Citizen'}],
  link: {type: String},
  sources: {type: String},
  census: [{type: ObjectId, ref: 'Citizen' }],
  votes: [{type: ObjectId, ref: 'IdeaVote'}],
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});

IdeaSchema.methods.loadComments = function(cb) {
  return this.model('Comment').find({context: 'idea', reference: this._id}, null, {sort: {createdAt: -1}}).populate('author').exec(cb);
};

module.exports = mongoose.model('Idea', IdeaSchema);