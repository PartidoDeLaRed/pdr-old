var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, ObjectId = Schema.ObjectId;

/*
 * Vote schema
 */

var Vote = new Schema({
		idea				: { type: ObjectId, required: true, ref: 'Idea' }
	, voters 		  : { type: [ObjectId], default: [], ref: 'Citizen' }
	, options			: {
			inFavour: {type: Number, default: 0, min: 0}
		,	against: {type: Number, default: 0, min: 0}
		,	abstentions: {type: Number, default: 0, min: 0}
	}
	,	createdAt		: { type: Date, default: Date.now }
	,	updatedAt		: Date
});

var VoteOption = new Schema({
		label: {type: String, required: true}
	, votes: {type: Number, default: 0}
});