var mongoose = require('mongoose');

var IdeaSchema = new mongoose.Schema({
	title: String,
	description: String,
	author: {type: mongoose.Schema.ObjectId, ref: 'Citizen'},
	createdAt: Date,
	updatedAt: Date
});

module.exports = mongoose.model('Idea', IdeaSchema);