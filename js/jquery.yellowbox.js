/* jQuery YellowBox plugin (Beta)
 * Copyright 2011 Oscar Sobrevilla (oscar.sobrevilla@gmail.com)
 * Released under the MIT and GPL licenses.
 * version 1.0 Beta
 */ (function ($) {

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
      // Set Timer 
      that.timer = null;
      // Set Timer closeIn 
      that.timerIn = null;
      // Set onAnimationEnd
      that.animationEnd = null;
      // Set custom settings
      that.setup();
    };

  YellowBox.defaults = {
    hideFx: 'slideUp',
    showFx: 'fadeIn',
    speedFx: 500,
    closer: true,
    onClose: false,
    onShow: false,
    timeToClose: 5000,
    shakeDuration: 1.1,
    intervalRpt: 1000,
    autoFx: false,
    strClose: 'Close'
  };

  YellowBox.prototype = {
    setup: function () {
      var that = this,
        close, anim;
      if(that.options.closer) {
        that.closer = that.el.find('.close');
        if(!that.closer.length) {
          that.closer = $('<a class="yellowbox-closer" href="#close" title="' + that.options.strClose + '"/>');
        }
        close = function (e) {
          e.preventDefault();
          that.close();
        };
        anim = function (e) {
          if(that.animationend) {
            that.animationEnd(e);
            that.animationend = null;
          }
          $(this).removeClass('yellowbox-shake');
        };
        that.el.prepend(
        that.closer.bind('click.yellowbox', close));
        that.el.bind('animationend webkitAnimationEnd', anim);
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
      $.each(buttons || [], function (i) {
        var button = buttons[i];
        listButtons.push(
        $('<span class="yellowbox-button" />').html(button.btnName).addClass(button.className).bind('click.yellowbox', function (e) {
          e.preventDefault();
          if(button.onClick) {
            button.onClick.call(that, this, e);
          }
        }).get(0));
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
        that.animationend = callback;
        that.el.css('animation-duration', duration || that.options.shakeDuration + 's').addClass('yellowbox-shake');
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
      if(that.options.onShow) {
        that.options.onShow(this);
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
      this.el.find('.yellowbox-title').html(title || '').end().find('.yellowbox-body').html(body || '');
      return this;
    },


    /**
     * Se message in Yellowbox
     * @param options {object}
     */
    setMessage: function (options) {
      var that = this;
      options = options || {};
      that.show('slideDown', 'fast').blink();
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