/*
 *  Module dependencies
 */
var mongoose = require('mongoose');

module.exports = function(app) {
  /*
   *  Connect to mongo
   */
  mongoose.connect(app.get('mongoUrl'))

  /*
   *  Citizen Model
   */
  require('./citizen');

  /*
   *  Issue Model
   */
  require('./issue');

  /*
   *  Issue Vote Model
   */
  require('./issueVote');
  
  /*
   *  Issue Vote Option Model
   */
  require('./issueVoteOption');

  /*
   *  Idea Model
   */
  require('./idea');

  /*
   *  Idea Vote Model
   */
  require('./ideaVote');

  /*
   *  Activity Model
   */
  require('./activity');

  /*
   *  Comment Model
   */
  require('./comment');

  /*
   *  Comment Reply Model
   */
  require('./commentReply');

   /*
    *  Hash Model
    */
  // remporary an object with categories!!

  
}