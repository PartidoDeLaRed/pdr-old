;(function(window) {
  var PDR = window.PDR;
  var request = PDR.request;

  var delegationsAPI = {
    create: function(options, fn) {
      if("function" == typeof options) {
        fn = options;
        options = {};
      }
      options = options || {};

      request
      .post('/api/delegations/create')
      .send(options)
      .end(function(res) {
        if(!res.ok) console.log('delegations-submit', res.error);
        return fn && fn(res.error, res.body || res.text);
      });
    },

    del: function(options, fn) {
      if("function" == typeof options) {
        fn = options;
        options = {};
      }
      options = options || {};

      request
      .post('/api/delegations/delete')
      .send(options)
      .end(function(res) {
        if(!res.ok) console.log('delegations-submit', res.error);
        return fn && fn(res.error, res.body || res.text);
      });
    }
  };

  PDR.api.delegations = delegationsAPI;
})(window);