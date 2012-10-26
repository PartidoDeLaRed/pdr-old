;(function(window) {
  var PDR = window.PDR = {
    api: {},
    request: superagent,

    initialize: function(options, cb) {
      if(this._initialized) return this;
      if('function' === typeof options) {
        cb = options;
        options = {};
      }

      this
        .init('domEvents', cb);

      this._initialized = true;
    },

    init: function(method, cb) {
      this[method] && this[method]();
      cb && cb();
      return this;
    },

    domEvents: function() {
      $('.quick-reply form').live('submit', function(ev) {
        var $form = $(this);
        ev.preventDefault();
        if(!$form.find('textarea[name="comment[text]"]').val().trim()) return;
        PDR.api.comments.publish($(this).serialize(), function(err, res) {
          $form.find('input[type="text"],textarea').val('');
          $('.quick-reply p span.delete').click();
          $('.comment-list').prepend(res);
        });
      });

      $('.initiative-form button.btn').live('click', function(ev) {
        ev.preventDefault();
        $('a.compose-initiative').html($('.initiative input[name="initiative[title]"]').val())
        .after("<span class='delete'> X</span>");
        $('.initiative-form').fadeOut();
      });

      $('.quick-reply p span.delete').live('click', function(ev) {
        ev.preventDefault();
        $(this).remove();
        $('.initiative input, .initiative textarea').each(function(idx, el) {
          $(el).val('');
        });
        $('a.compose-initiative').html("Adjuntar propuesta")
      });

      $('.vote-option a.vote').live('click', function(ev) {
        ev.preventDefault();
        var vote = $(this).closest('.vote-option');
        var params = {
          issue: vote.data('issue'),
          choice: vote.data('choice'),
          idea: vote.data('idea')
        };

        PDR.api.issues.vote(vote.data('issue'), params, function(err, res) {
          window.location.reload();
        });
      });
    }
  };
})(window);