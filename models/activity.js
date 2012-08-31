var mongoose = require('mongoose');

var ActivitySchema = new mongoose.Schema({
	author: mongoose.Schema.ObjectId,
	action: String,
	params: Object
});