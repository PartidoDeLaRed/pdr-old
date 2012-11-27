/*
 * jQuery Plugin: jMore - Simple collapse & expand jQuery Plugin
 * Version 0.1.0
 *
 * Copyright (c) 2012 Cristian Douce (http://cristiandouce.com)
 * Licensed jointly under the GPL and MIT licenses,
 * choose which one suits your project best!
 *
 */
;(function($) {

  /**
   *  Plugin's name
   */
  var pluginName = 'jMore';

  /**
   *  Plugin's key
   */
  var pluginKey = 'plugin_' + pluginName;

  /**
   *  Plugin's templates
   */
  var BOTTOM_OVERLAY_TEMPLATE  = '<div class="jmore-bottom-overlay"></div>';
  var EXPAND_BUTTON_TEMPLATE  = '<a href="#" class="jmore-button jmore-button-expand"></a>';
  var COLLAPSE_BUTTON_TEMPLATE  = '<a href="#" class="jmore-button jmore-button-collapse"></a>';

  /**
   * Plugin's styles
   */
  var styles  = '<style id="jquery_jMore_styles" type="text/css">'
              + ".jmore-container { }"
              + ".jmore-container.collapsed:hover > .jmore-button-expand { display:block; }"
              + ".jmore-container.expanded:hover > .jmore-button-collapse { display:block; }"
              + ".jmore-container.expanded:hover > .jmore-bottom-overlay { display:none; }"
              + ".jmore-bottom-overlay { position:absolute; height:30px; bottom:0; left:0; right:0; background: -moz-linear-gradient(top,  rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%); /* FF3.6+ */ background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(255,255,255,0)), color-stop(100%,rgba(255,255,255,1))); /* Chrome,Safari4+ */ background: -webkit-linear-gradient(top,  rgba(255,255,255,0) 0%,rgba(255,255,255,1) 100%); /* Chrome10+,Safari5.1+ */ background: -o-linear-gradient(top,  rgba(255,255,255,0) 0%,rgba(255,255,255,1) 100%); /* Opera 11.10+ */ background: -ms-linear-gradient(top,  rgba(255,255,255,0) 0%,rgba(255,255,255,1) 100%); /* IE10+ */ background: linear-gradient(to bottom,  rgba(255,255,255,0) 0%,rgba(255,255,255,1) 100%); /* W3C */ filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00ffffff', endColorstr='#ffffff',GradientType=0 ); /* IE6-9 */}"
              + ".jmore-button {display:none;position:absolute;bottom:0;right:0;font-family:Arial;color:#f3f3f3;font-size:12px;padding:5px;text-decoration:none;-webkit-border-radius:5px;-moz-border-radius:5px;-webkit-box-shadow:0 1px 3px #5e5e5e;-moz-box-shadow:0 1px 3px #5e5e5e;text-shadow:1px 1px 3px #3e3e3e;border:solid #444 1px;background:#333}"
              + ".jmore-button:hover{background:-webkit-gradient(linear,0 0,0 100%,from(#666),to(#333));background:-moz-linear-gradient(top,#666,#333) filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=undefined,endColorstr=undefined)}"
              // + ".jmore-bottom-overlay { background:red;}" //test only
              + '</style>';

  /**
   *  Plugin's public methods
   */
  var methods = {
    init: function (options) {
      return this.each(function () {
        if (!$.data(this, pluginKey)) {
          $.data(this, pluginKey, new More(this, options || {} ));
        }
      });
    }
  }

  /**
   *  Plugin's constructor
   */
  var More = function(element, options) {
    // saving element's reference
    this.element = element;
    this.$element = $(element);

    // Build settings object
    this.settings = {
        collapsedHeight: parseInt(options.collapsedHeight, 10) || 200
      , collapsedText: options.collapsedText || 'Read More'
      , expandedText: options.expandedText || 'Read Less'
      , triggerOnHover: !!options.triggerOnHover
    };

    // Initialize jMore
    this.init();
  };

  More.prototype = {
    constructor: More,

    init: function () {
      // render required html and styles
      this.render();

      // bind events
      this.bindEvents();
    },

    render: function () {
      // inject plugin's styles on top of document, inside <head> tag
      if(!$('head style#jquery_jMore_styles').length) $('style,link[rel="stylesheet"][type="text/css"]').before(styles);
      if(!$('head style#jquery_jMore_styles').length) $('head').append(styles);

      // refer to $element
      this.$element

      // inject bottom overlay
      .append(BOTTOM_OVERLAY_TEMPLATE)

      // add class 'jmore-container' to element container
      .addClass('jmore-container')

      // add class 'collapsed' to element container
      .addClass('collapsed')

      // add 'required' inline styles to override anything else
      .css({
        position: 'relative',
        height: 'auto',
        maxHeight: this.settings.collapsedHeight,
        overflowY: 'hidden'
      });

      if(!this.settings.triggerOnHover) this._addButtons();
    },

    bindEvents: function () {
      var self = this;
      
      if(!this.settings.triggerOnHover) {

        this.$element
        .find('.jmore-button-expand')
        .live('click', function(ev) {
          ev.preventDefault();
          self.$element
          .toggleClass('collapsed', false)
          .toggleClass('expanded', true)
          .animate({
            overflowY: 'auto',
            maxHeight: self.$element.prop('scrollHeight')
          }, 150);
        });

        this.$element
        .find('.jmore-button-collapse')
        .live('click', function(ev) {
          ev.preventDefault();
          self.$element
          .toggleClass('collapsed', true)
          .toggleClass('expanded', false)
          .animate({
            overflowY: 'hidden',
            maxHeight: self.settings.collapsedHeight
          }, 150);

        });

      } else {

        this.$element

        .mouseenter(function() {
          self.$element
          .toggleClass('collapsed', false)
          .toggleClass('expanded', true)
          .animate({
            overflowY: 'auto',
            maxHeight: self.$element.prop('scrollHeight')
          }, 150);
        })

        .mouseleave(function() {
          self.$element
          .toggleClass('collapsed', true)
          .toggleClass('expanded', false)
          .animate({
            overflowY: 'hidden',
            maxHeight: self.settings.collapsedHeight
          }, 150);
        });
      }
    },

    _addButtons: function() {
      var $expandButton = $(EXPAND_BUTTON_TEMPLATE);
      var $collapseButton = $(COLLAPSE_BUTTON_TEMPLATE);

      $expandButton.text(this.settings.collapsedText);
      $collapseButton.text(this.settings.expandedText);

      this.$element
      .append($expandButton)
      .append($collapseButton);
    }
  };

  /**
   *  Plugin's expose to jQuery
   */
  $.fn[pluginName] = function ( method ) {
    if(methods[method]) {
      return methods[method].apply($(this).data(pluginKey),  Array.prototype.slice.call(arguments, 1));
    } else {
      return methods.init.apply(this, arguments);
    }
  };
})(jQuery);
