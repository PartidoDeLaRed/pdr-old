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
      $('textarea').focus(function() {
        var _self = this;
        setTimeout(function() {
          var minHeight = parseInt($(_self).css('minHeight') , 10);
          if($(_self).height() < minHeight) $(_self).height(minHeight);
        }, 20);
      });

      $('.quick-reply form').live('submit', function(ev) {
        ev.preventDefault();

        var $form = $(this)
          , initiative = false
          , reply = false;

        // Simple validation
        if(!$form.find('textarea[name="comment[text]"]').val().trim()) return;
        if($form.find('input[name="initiative[title]"]').val()) initiative = true;
        if($form.find('input[name="comment[id]"]').val()) reply = true;

        // Submit form and process response
        PDR.api.comments.publish($(this).serialize(), function(err, res) {
          if(initiative) return window.location.reload();

          $form.find('input[type="text"],textarea').val('');

          if(reply) {
            //comment reply
            var $parentComment = $form.closest('.comment.question');

            $parentComment
            .after(res)
            .find('.comment-reply-form')
            .hide()
            .prev('.reply')
            .show();

          } else {
            //new parent comment
            $('.quick-reply p span.delete')
            .click();

            $('.comment-list')
            .prepend(res);
          }
        });
      });

      $('a.create-idea').live('click', function(ev) {
        $('.quick-reply form').first().toggleClass('auto-submit', true);
      });

      $('a.compose-initiative').live('click', function(ev) {
        $('.quick-reply form').first().toggleClass('auto-submit', false);
      });


      $('.initiative-form button.btn').live('click', function(ev) {
        ev.preventDefault();

        var $initiativeTitle = $('.initiative input[name="initiative[title]"]')
          , $initiativeEssay = $('.initiative textarea[name="initiative[essay]"]');

        // attach initiative
        $('a.compose-initiative')
        .html($initiativeTitle.val())
        .after("<span class='delete'> X</span>");

        // if comment is empty, fill with title and essay of initiative
        var $comment = $(this)
                      .closest('form')
                      .find('textarea[name="comment[text]"]');

        if(!$comment.val()) {
          var commentContent = $initiativeEssay.val().substr(0,150);
          commentContent += $initiativeEssay.val().length > 150 ? "[...]" : "";

          $comment.val(commentContent);
        }

        // if auto submit initiative return with form submit!
        if($(this).closest('form').hasClass('auto-submit')) return $(this).closest('form').submit();

        //Hide initiative form when attached initiative
        $('.initiative-form').fadeOut();

      });

      $('.quick-reply p span.delete').live('click', function(ev) {
        ev.preventDefault();

        // remove delete button
        $(this).remove();

        // clean forms
        $('.initiative input, .initiative textarea').each(function(idx, el) {
          $(el).val('');
        });

        // restore modal trigger title
        $('a.compose-initiative').html("Adjuntar propuesta")
      });

      $('.comment .reply').live('click', function(ev) {
        ev.preventDefault();

        $(ev.target)
        .hide()
        .next('.comment-reply-form')
        .show();

      });

      $('.vote-option a.vote').live('click', function(ev) {
        ev.preventDefault();
        var vote = $(this).closest('.vote-option')
          , params = {
            issue: vote.data('issue'),
            choice: vote.data('choice'),
            idea: vote.data('idea')
          };

        PDR.api.issues.vote(vote.data('issue'), params, function(err, res) {
          window.location.reload();
        });
      });

      // Delegation form on issue view
      $('#delegation p a.delegate-button').live('click', function(ev) {
        ev.preventDefault();
        $(this).parent('p').hide().next('p').show();
      });

      $('#delegation .input-delegate-another').tokenInput('/api/profiles', {
        theme: 'facebook',
        preventDuplicates: true,
        tokenLimit: 1
      });

      $('#delegation .confirm-delegation').live('click', function(ev) {
        ev.preventDefault();
        var trustee = $('#delegation .input-delegate-another').tokenInput('get');

        if(!trustee.length) return;
        trustee = trustee[0];
        if(trustee.id) {
          PDR.api.delegations.create({
            tid: trustee.id,
            category: $('#delegation').data('category') || ''
          }, function(err, result) {
            if(err) console.log(err); //should also remove recently added trustee

            window.location.reload();
          });
        }
      });
    }
  };
})(window);