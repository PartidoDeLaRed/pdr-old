var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.OnbjectId;

var utils = require('../utils');

/*
 * Comment Schema
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var actions = utils.actions
  , actionsKeys = Object.keys(actions);

var ActivitySchema = new Schema({
	author: {type: ObjectId, required: true, ref: 'Citizen'},
	action: {type: String, required: true, default: actionsKeys[0], enum: actionsKeys},
	params: Object,
  createdAt: {type:Date, default: Date.now}
});

module.exports = mongoose.model('Activity', ActivitySchema);