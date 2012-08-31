var mongoose = require('mongoose');

var IdeaModel = require('./idea');

var CitizenSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	username: String,
	address: String,
	city: Object,
	profiles: Object,
	ideas: [IdeaModel.schema],
	votes: Array,
	createdAt: {type: Date, default: Date.now},
	updatedAt: Date
});

module.exports = mongoose.model('Citizen', CitizenSchema);