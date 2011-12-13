/* jQuery YellowBox plugin (Beta)
 * Copyright 2011 Oscar Sobrevilla (oscar.sobrevilla@gmail.com)
 * Released under the MIT and GPL licenses.
 * version 1.0 Beta
 */
// <div class="yellowbox">
//   <div class="yellowbox-title"></div>
//   <div class="yellowbox-body"></div>
// </div>
(function ($, w) {
    $.fn.yellowBox = (function (options) {
        var t = this;
        if (t && t.length) {
            var yBox = $.data(t[0], 'api');
            if (yBox) return yBox;
        }
        return t.each(function () {
            var self = this;
            $.data(self, 'api', new YellowBox($(self), options));
        });
    });
    var YellowBox = (function (elem, options) {
        var settings = $.extend(true, {}, YellowBox.defaults, options),
            timer, yellowBox = elem,
            closer, yelloBoxHtml = yellowBox.html(),
            initialColor = yellowBox.css('backgroundColor'),
            boxButtons = $('<div class="yellowbox-buttons" />'),
            self = {
                enfasis: function (numRepeat, speed, options) {
                    var counter = 0,
                        nrepeat = numRepeat || 1,
                        timer;
                    self.fx(options, speed);
                    timer = w.setInterval(function () {
                        if (counter < nrepeat - 1) {
                            self.fx(options, speed);
                            counter += 1;
                        } else {
                            w.clearInterval(timer);
                        }
                    }, settings.intervalRept);
                    return this;
                },
                fx: function (options, speed) {
                    //TO-DO 
                    // make the effects css3 with javascript to IE6-7-8 versions, only fadeIn<->Out
                    //.animate($.extend(settings.enfasisFx, options), speed || 800)
                    //.animate({ backgroundColor: this.initialColor }, speed || 500);
                    w.clearTimeout(timer);
                    yellowBox.addClass('yellowbox-emphasis');
                    timer = w.setTimeout(function () {
                        yellowBox.removeClass('yellowbox-emphasis');
                    }, speed || settings.speedFx);
                },
                show: function (fx, speedFx, callback) {
                    yellowBox[fx || settings.showFx]((speedFx || settings.speedFx), callback);
                    return self;
                },
                close: function (fx, speedFx, callback) {
                    yellowBox[fx || settings.hideFx]((speedFx || settings.speedFx), callback);
                    return self;
                },
                closeIn: function (timeToClose) {
                    setTimeout(self.close, timeToClose || settings.timeToClose);
                    return self;
                },
                buildButtons: function (buttons) {
                    options = options || {};
                    var listButtons = [];
                    for (btnName in buttons) {
                        var $btn;
                        (function () {
                            var btn = buttons[btnName];
                            $btn = $('<span class="yellowbox-button" />').html(btnName).addClass(btn.className).bind('click.ybox', function (e) {
                                if (btn.onClick) {
                                    btn.onClick.call(self, this);
                                }
                                e.preventDefault();
                            });
                        }());
                        listButtons.push($btn.get(0));
                    }
                    return listButtons;
                },
                setMainContent: function (title, body) {
                    yellowBox.find('.yellowbox-title').html(title || '');
                    yellowBox.find('.yellowbox-body').html(body || '');
                },
                setQuestion: function (options) {
                    options = options || {};
                    self.setMainContent(options.title, options.body);
                    boxButtons.show().empty().append(self.buildButtons(options.buttons));
                    yellowBox.append(boxButtons);
                    return self;
                },
                setMessage: function (options) {
                    options = options || {};
                    self.show('slideDown', 'fast').enfasis();
                    boxButtons.hide();
                    self.setMainContent(options.title, options.body);
                    if (options.seconds) {
                        w.setTimeout(function () {
                            self.close();
                        }, (seconds || 5) * 1000);
                    }
                    return self;
                },
                
                shake: function(callback){
                  // Only Webkit (Google Chrome and Safari 5)
                  if (yellowBox.hasClass('yellowbox-shake')) return;
                    yellowBox
                      .css('-webkit-animation-duration', settings.shakeDuration + 's')
                      .addClass('yellowbox-shake')
                      .data('yellowbox-callback', callback);
                }
            };
        if (settings.closer) {
            closer = yellowBox.find('.close');
            if (!closer.length) {
                closer = $('<a class="yellowbox-closer" href="#close" title="Cerrar"/>');
            }
            yellowBox.prepend(closer.bind('click.ybox', function (e) {
                e.preventDefault();
                self.close();
                if (settings.onClose) settings.onClose.call(self, this);
            }));
            
            yellowBox.bind('animationend webkitAnimationEnd', function(){ 
              yellowBox.removeClass('yellowbox-shake');
              if ( yellowBox.data('yellowbox-callback'))
                yellowBox.data('yellowbox-callback').call(self, this);
                yellowBox.removeData('yellowbox-callback');
            });
        }
        return {
            'shake': self.shake,
            'enfasis': self.enfasis,
            'confirm': self.setQuestion,
            'alert': self.setMessage,
            'show': self.show,
            'close': self.close,
            'closeIn': self.closeIn
        }
    });
    YellowBox.defaults = ({
        hideFx: 'slideUp',
        showFx: 'fadeIn',
        closer: true,
        onClose: false,
        timeToClose: 15000,
        manualClose: true,
        autoClose: false,
        speedFx: 500,
        shakeDuration:1.1, //seconds
        intervalRept: 1000,
        enfasisCustomFx: false,
        autoFx: false
    });
}(jQuery, window));