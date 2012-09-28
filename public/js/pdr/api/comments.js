;(function(window) {
  var PDR = window.PDR;
  var request = PDR.request;

  var commentsAPI = {
    publish: function(options, fn) {
      if("function" == typeof options) {
        fn = options;
        options = {};
      }
      options = options || {};

      request
      .post('/api/comments/publish')
      .send(options)
      .end(function(res) {
        if(!res.ok) console.log('comments-publish', res.error);
        return fn && fn(res.error, res.body);
      });
    }
  }
});