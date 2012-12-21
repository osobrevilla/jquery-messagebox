/* jQuery YellowBox plugin (Beta)
 * Copyright 2011 Oscar Sobrevilla (oscar.sobrevilla@gmail.com)
 * Released under the MIT and GPL licenses.
 * version 1.0 Beta
 */
(function ($) {

  'use strict';

  /**
   * Show Yellowbox alerts, confirms messages
   * @param elem {dom object} 
   * @param options {object}
   * Require have HTML:
   *
   *  <div class="yellowbox">
   *    <div class="yellowbox-title">The title example</div>
   *    <div class="yellowbox-body">The body example for yellowbox box messages</div>
   *  </div>
   *
   * Init Plugin with:
   *
   *  <script>
   *    $(function(){ 
   *      $(".yellowbox").yellowBox(); 
   *    });
   *  </script>
   *
   */

  var YellowBox = function (elem, options) {
      var that = this;
      // Set general options
      that.options = $.extend(true, {}, YellowBox.defaults, options);
      // Set DOM box element
      that.el = $(elem);
      // Set closer
      that.closer = null;
      // Set initial color
      that.boxInitBgColor = that.el.css('backgroundColor') || "white";
      // Set box buttons
      that.boxButtons = $('<div class="yellowbox-buttons" />');
      // Other dom objets
      that.dom = {};
      that.dom.title  = that.el.find('.yellowbox-title');
      that.dom.body   = that.el.find('.yellowbox-body');
      that.dom.closer = that.el.find('.close');
      // Set Timer 
      that.timer = null;
      // Set Timer closeIn 
      that.timerIn = null;
      // Set custom settings
      that.setup();
    };

  // Default options
  YellowBox.defaults = {
    hideFx: 'slideUp',
    showFx: 'fadeIn',
    speedFx: 500,
    closer: true,
    onClose: false,
    onOpen: false,
    timeToClose: 5000,
    shakeDuration: 1.1,
    intervalRpt: 1000,
    autoFx: false,
    strClose: 'Close'
  };

  YellowBox.prototype = {

    /**
     * Setup 
     */

    setup: function () {
      var that = this,
        close;
      if(that.options.closer) {
        if(!that.dom.closer.size()) {
          that.dom.closer = $('<a class="yellowbox-closer" href="#close" title="' + that.options.strClose + '"/>');
        }
        that.el.prepend(
        that.dom.closer.on('click.yellowbox', function(e){
          e.preventDefault();
          that.close();
        }));
      }
    },


    /**
     * Default effect
     * @param options {object}
     * @param speed {Integer} speed of animation in milliseconds.
     */
    fx: function (options, speed) {
      var that = this;
      options = options || {};
      //TO-DO 
      // make the effects css3 with javascript to IE6-7-8 versions, only fadeIn<->Out
      //.animate($.extend(settings.blink, options), speed || 800)
      //.animate({ backgroundColor: this.initialColor }, speed || 500);
      clearTimeout(that.timer);
      that.el.addClass('yellowbox-emphasis');
      that.timer = setTimeout(function () {
        that.el.removeClass('yellowbox-emphasis');
      }, speed || that.options.speedFx);
    },


    /**
     * Generate buttons
     * @param buttons {object}
     */
    buildBtns: function (buttons) {
      var that = this,
        listButtons = [];
      $.each(buttons || [], function (label) {
        var button = this,
          btn = $('<span class="yellowbox-button" />');
        btn.html(label);
        btn.addClass(button.className).on('click.yellowbox', function (e) {
          e.preventDefault();
          if(button.onClick) {
            button.onClick.call(that, this, e);
          }
        });
        listButtons.push(btn.get(0));
      });
      return listButtons;
    },


    /**
     * Blink the yellowbox
     * @param repeats {Integer} number of repeat blink animation.
     * @param options {object}
     * @param speed {dom object} 
     */
    blink: function (repeats, options, speed) {
      var that = this,
        counter = 0,
        nrepeat = repeats || 1,
        timer;
      that.fx(options, speed);
      timer = setInterval(function () {
        if(counter < nrepeat - 1) {
          that.fx(options, speed);
          counter += 1;
        } else {
          clearInterval(timer);
        }
      }, that.options.intervalRpt);
      return that;
    },

    /**
     * Shake the yellowbox
     * @param callback {function}
     * @param duration {int seconds}
     */
    shake: function (callback, duration) {
      var that = this;
      if(!that.el.hasClass('yellowbox-shake')) {
        that.el.one('animationend webkitAnimationEnd oAnimationEnd', function (e) {
          if(callback) {
            callback.call(that, this, e);
          }
          that.el.removeClass('animation-shake');
        }).css('animation-duration', duration || that.options.shakeDuration + 's').addClass('animation-shake');
      }
      return this;
    },


    /**
     * Show Yellowbox
     * @param callback {function}
     * @param fx {Strign} jQuery animation name ej. slidedown, fadeIn
     * @param speed {Integer} speed of animation in milliseconds.
     */
    show: function (callback, fx, speed) {
      var that = this;
      that.el[fx || that.options.showFx](speed || that.options.speedFx, callback);
      if(that.options.onOpen) {
        that.options.onOpen(this);
      }
      return that;
    },


    /**
     * Hide Yellowbox
     * @param callback {function}
     * @param fx {Strign} jQuery animation name ej. slideup, fadeOut  
     * @param speed {Integer} speed of animation in milliseconds.
     */
    close: function (callback, fx, speed) {
      var that = this;
      that.el[fx || that.options.hideFx](speed || that.options.speedFx, callback);
      if(that.options.onClose) {
        that.options.onClose(this);
      }
      return that;
    },


    /**
     * Hide Yellowbox with delay
     * @param timeToClose {Integer} time to wait before close. (milliseconds).
     */
    closeIn: function (timeToClose) {
      var that = this;
      clearTimeout(that.timerIn);
      that.timerIn = setTimeout(function () {
        that.close();
      }, timeToClose || that.options.timeToClose);
      return that;
    },


    /**
     * Asks a question in Yellowbox
     * @param options {options} 
     */
    setQuestion: function (options) {
      var that = this;
      options = options || {};
      that.setContent(options.title, options.body);
      that.boxButtons.show().empty().append(that.buildBtns(options.buttons));
      that.el.append(that.boxButtons);
      return that;
    },


    /**
     * Set new content to the Yellowbox
     * @param title {String/HtmlString} 
     * @param body {String/HtmlString}
     */
    setContent: function (title, body) {
      this.dom.title.html(title || '');
      this.dom.body.html(body || '');
      return this;
    },


    /**
     * Se message in Yellowbox
     * @param options {object}
     */
    setMessage: function (options) {
      var that = this;
      options = options || {};
      that.show(null, 'slideDown', 'fast').blink();
      that.boxButtons.hide();
      that.setContent(options.title, options.body);
      if(options.seconds) {
        setTimeout(function () {
          that.close();
        }, (options.seconds || 5) * 1E3);
      }
      return that;
    }
  };

  // Set Constructor
  YellowBox.prototype.constructor = YellowBox;
  
  // add Yellowbox Class to jQuery fn.
  $.fn.yellowBox = function (options) {
    var t = this,
      yBox;
    if(t && t.length) {
      yBox = $.data(t[0], 'api');
      if(yBox) {
        return yBox;
      }
    }
    return t.each(function () {
      $.data(this, 'api', new YellowBox($(this), options));
    });
  };
}(window.jQuery));