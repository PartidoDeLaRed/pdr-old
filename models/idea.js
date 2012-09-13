var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var IdeaSchema = new Schema({
	title: String,
	description: String,
	author: { type: ObjectId, ref: 'Citizen' },
	createdAt: { type: Date, default: Date.now },
	updatedAt: Date
});

module.exports = mongoose.model('Idea', IdeaSchema);