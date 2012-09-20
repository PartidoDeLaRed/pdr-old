var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, ObjectId = Schema.ObjectId;

/*
 * Idea Vote Schema
 */
var IdeaVoteSchema = new Schema({
		idea				: { type: ObjectId, required: true, ref: 'Idea' }
	,	context			: { type: String, required: true, default: 'free', enum:['free', 'issue']}
	, voters 		  : { type: [ObjectId], default: [], ref: 'Citizen' }
	, choices			: {
			infavor: {type: Number, default: 0, min: 0}
		,	against: {type: Number, default: 0, min: 0}
		,	neutral: {type: Number, default: 0, min: 0}
	}
	,	createdAt		: { type: Date, default: Date.now }
	,	updatedAt		: Date
});

module.exports = mongoose.model('IdeaVote', IdeaVoteSchema);