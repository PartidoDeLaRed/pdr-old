var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var CitizenSchema = new Schema({
	firstName: String,
	lastName: String,
	username: String,
	address: String,
	hometown: {type: String },
	location: {type: String },
	imageUrl: {type: String },
	profiles: Object,
	createdAt: {type: Date, default: Date.now},
	updatedAt: Date
});

CitizenSchema.virtual('fullName').get(function() {
	return this.firstName + ' ' + this.lastName;
});

CitizenSchema.virtual('fullName').set(function(name) {
  var split = name.split(' ');
  if(split.length) {
    this.firstName = split.shift();
    this.lastName = split.join(' ');
  }
});

// Ensures index on mongodb for query search
CitizenSchema.index({firstName:1, lastName:1});

module.exports = mongoose.model('Citizen', CitizenSchema);