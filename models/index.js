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
   *  Issue Vote Option Model
   */
  require('./issueVoteOption');

  /*
   *  Issue Vote Model
   */
  require('./issueVote');

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
    *  Hash Model
    */

}