var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.OnbjectId;

var types = [
      'comment'
    , 'delegation'
    , 'vote'
    , 'issue-creation'
    , 'idea-creation'
  ];

var FeedSchema = new Schema({

  // Types of Feed
    type: {type: String, enum: types }

  // Feed was performed by Citizen with id
  , citizen:  { type: ObjectId, ref: 'Citizen' }

  // Feed refers to Issue with id
  , issue:    { type: ObjectId, ref: 'Issue' }

  // Feed refers to Idea with id
  , idea:     { type: ObjectId, ref: 'Idea' }

  // Feed refers to Comment with id
  , comment:  { tyep: ObjectId }

  // Array of metadata with format according to each type of feed
  , meta:     []
});
