var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

/*
 * Idea Schema
 */
var IdeaSchema = new Schema({
  title: {type: String, required: true, min: 8, max: 256 },
  abstract: { type: String, required: true, min: 256, max: 512},
  essay: { type: String, min: 512, max: 2048},
  author: { type: ObjectId, ref: 'Citizen' },
  authors: { type: [ObjectId], required: true, default: [], ref: 'Citizen'},
  link: {type: String},
  sources: {type: String},
  census: {type: [ObjectId], default: [], ref: 'Citizen' },
  votes: {type: [ObjectId], default: [], ref: 'IdeaVote'},
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});

module.exports = mongoose.model('Idea', IdeaSchema);