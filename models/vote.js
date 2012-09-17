var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, ObjectId = Schema.ObjectId;

/*
 * Vote schema
 */

var VoteOption = new Schema({
		label: {type: String, required: true}
	, votes: {type: Number, default: 0}
});

/*
 * Vote schema
 */

var VoteSchema = new Schema({
		idea				: { type: ObjectId, required: true, ref: 'Idea' }
	,	type				: { type: String, required: true, default: "accept"}
	, voters 		  : { type: [ObjectId], default: [], ref: 'Citizen' }
	, options			: {
			infavor: {type: Number, default: 0, min: 0}
		,	against: {type: Number, default: 0, min: 0}
		,	neutral: {type: Number, default: 0, min: 0}
	}
	,	createdAt		: { type: Date, default: Date.now }
	,	updatedAt		: Date
});

module.exports = mongoose.model('Vote', VoteSchema);