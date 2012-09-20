var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

/*
 * Issue Schema
 */
var IssueSchema = new Schema({
  title: {type: String, min: 8, max: 256 },
  abstract: { type: String, min: 256, max: 512},
  essay: { type: String, min: 512, max: 2048},
  author: { type: ObjectId, ref: 'Citizen' },
  authors: { type: [ObjectId], required: true, default: [], ref: 'Citizen'},
  link: {type: String},
  sources: {type: String},
  census: {type: [ObjectId], default: [], ref: 'Citizen' },
  votes: {type: [ObjectId], default: [], ref: 'Vote'},
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});

module.exports = mongoose.model('Issue', IssueSchema);