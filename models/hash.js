var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var HashSchema = new Schema({
    name: String,
    createdAt: {type: Date, default: Date.now}
    updatedAt: {type: Date}
});

module.exports = mongoose.model('Hash', HashSchema);