var mongoose = require('mongoose');

var CitizenModel = require('./citizen');

var IdeaSchema = new mongoose.Schema({
	title: String,
	description: String,
	author: mongoose.Schema.ObjectId,
	createdAt: Date,
	updatedAt: Date
});

module.exports = mongoose.model('Idea', IdeaSchema);