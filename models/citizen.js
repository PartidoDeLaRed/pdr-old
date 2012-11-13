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
	imageUrl: {type: String },     //normal value from provider
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

CitizenSchema.virtual('imageUrlOriginal').get(function() {
  var url = 'https://api.twitter.com/1/users/profile_image?screen_name=$s_name&size=$size';
  
  url = url
  .replace('$s_name', this.profiles.twitter.username)
  .replace('$size', 'bigger');

  return url;
});

CitizenSchema.virtual('imageUrlMini').get(function() {
  // 24px by 24px
  var url = 'https://api.twitter.com/1/users/profile_image?screen_name=$s_name&size=$size';
  
  url = url
  .replace('$s_name', this.profiles.twitter.username)
  .replace('$size', 'mini');

  return url;
});

CitizenSchema.virtual('imageUrlNormal').get(function() {
  // 48px by 48px
  var url = 'https://api.twitter.com/1/users/profile_image?screen_name=$s_name&size=$size';
  
  url = url
  .replace('$s_name', this.profiles.twitter.username)
  .replace('$size', 'normal');

  return url;
});

CitizenSchema.virtual('imageUrlBigger').get(function() {
  // 73px by 73px
  var url = 'https://api.twitter.com/1/users/profile_image?screen_name=$s_name&size=$size';
  
  url = url
  .replace('$s_name', this.profiles.twitter.username)
  .replace('$size', 'bigger');

  return url;
});

CitizenSchema.virtual('imageUrlRSmall').get(function() {
  // 128px by 128px
  var url = 'https://api.twitter.com/1/users/profile_image?screen_name=$s_name&size=$size';
  
  url = url
  .replace('$s_name', this.profiles.twitter.username)
  .replace('$size', 'reasonably_small');

  return url;
});

// Ensures index on mongodb for query search
CitizenSchema.index({firstName:1, lastName:1});

module.exports = mongoose.model('Citizen', CitizenSchema);