var mongoose = require('mongoose');

var IdeaSchema = new mongoose.Schema({
	title: String,
	description: String,
	author: { type: mongoose.Schema.ObjectId, ref: 'Citizen' },
	createdAt: { type: Date, default: Date.now },
	updatedAt: Date
});

module.exports = mongoose.model('Idea', IdeaSchema);