;(function(window) {
  var PDR = window.PDR = {
    api: {},
    
    initialize: function(options, cb) {
      if(this._initialized) return this;
      if('function' === typeof options) {
        cb = options;
        options = {};
      }

      this
        .init('domEvents', cb);

      this.request = superagent;

      this._initialized = true;
    },

    init: function(method, cb) {
      this[method] && this[method]();
      cb && cb();
      return this;
    },

    domEvents: function() {
      $('.quick-reply a.initiative').live('click', function(ev) {
        ev.preventDefault();
        
      });
    }
  };
})(window);