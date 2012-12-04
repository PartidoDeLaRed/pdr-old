var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.OnbjectId;


var FeedSchema = new Schema({
    citizen:  { type: ObjectId, ref: 'Citizen' }
  , issue:    { type: ObjectId, ref: 'Issue' }
  , idea:     { type: ObjectId, ref: 'Idea' }
  , comment:  { tyep: ObjectId }
});
