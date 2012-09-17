var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var IdeaSchema = new Schema({
	title: String,
	description: String,
	author: { type: ObjectId, ref: 'Citizen' },
  authors: { type: [ObjectId], required: true, default: [], ref: 'Citizen'},
  votes: {type: [ObjectId], required: true, default: [], ref: 'Vote'},
	createdAt: { type: Date, default: Date.now },
	updatedAt: Date
});

module.exports = mongoose.model('Idea', IdeaSchema);