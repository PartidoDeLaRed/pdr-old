var mongoose = require('mongoose');

var CitizenSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	username: String,
	address: String,
	city: Object,
	profiles: Object,
	ideas: [{type: mongoose.Schema.ObjectId, ref: 'Idea'}],
	createdAt: {type: Date, default: Date.now},
	updatedAt: Date
});

module.exports = mongoose.model('Citizen', CitizenSchema);