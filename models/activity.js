var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var ActivitySchema = new Schema({
	author: {type: ObjectId, required: true, ref: 'Citizen'},
	action: String,
	params: Object
});

module.exports = mongoose.model('Activity', ActivitySchema);