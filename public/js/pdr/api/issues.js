;(function(window) {
  var PDR = window.PDR;
  var request = PDR.request;

  var issuesAPI = {
    vote: function(issue, options, fn) {
      if("function" == typeof options) {
        fn = options;
        options = {};
      }
      options = options || {};

      request
      .post('/api/issues/$issue/vote'.replace('$issue', issue))
      .send(options)
      .end(function(res) {
        if(!res.ok) console.log('issues-vote', res.error);
        return fn && fn(res.error, res.text);
      });
    }
  };

  PDR.api.issues = issuesAPI;
})(window);