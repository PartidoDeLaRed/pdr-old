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
      $('.quick-reply form').live('submit', function(ev) {
        if(!$(this).find('textarea[name="comment[text]"]').val().trim()) return false;
        return setTimeout($(this).submit,500);
      });

      $('#compose-initiative button.btn').live('click', function(ev) {
        ev.preventDefault();
        $('a.compose-initiative').html($('.initiative input[name="initiative[title]"]').val())
        .after("<span class='delete'> X</span>");
        $('#compose-initiative').fadeOut();
      });

      $('.quick-reply p span.delete').live('click', function(ev) {
        ev.preventDefault();
        $(this).remove();
        $('.initiative input, .initiative textarea').each(function(idx, el) {
          $(el).val('');
        });
        $('a.compose-initiative').html("Adjuntar propuesta")
      });
    }
  };
})(window);