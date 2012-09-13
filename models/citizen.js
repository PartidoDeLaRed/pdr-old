var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var CitizenSchema = new Schema({
	firstName: String,
	lastName: String,
	username: String,
	address: String,
	city: Object,
	profiles: Object,
	ideas: [{type: ObjectId, ref: 'Idea'}],
	createdAt: {type: Date, default: Date.now},
	updatedAt: Date
});

module.exports = mongoose.model('Citizen', CitizenSchema);