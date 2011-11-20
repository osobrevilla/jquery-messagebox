/* jQuery YellowBox plugin 
 * Copyright 2010 Oscar Sobrevilla (oscar.sobrevilla@gmail.com)
 * Released under the MIT and GPL licenses.
 * version 1.5 Beta
 */
// <div class="yellowbox">
//   <div class="yellowbox-title"></div>
//   <div class="yellowbox-body"></div>
// </div>
(function ($) {
    $.fn.yellowBox = (function (options) {
        if (this && this.length) {
            var yBox = $.data(this[0], 'api');
            if (yBox) return yBox;
        }
        return this.each(function () {
            $.data(this, 'api', new YellowBox($(this), options));
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
                    timer = setInterval(function () {
                        if (counter < nrepeat - 1) {
                            self.fx(options, speed);
                            counter += 1;
                        } else {
                            clearInterval(timer);
                        }
                    }, settings.intervalRept);
                    return this;
                },
                fx: function (options, speed) {
                    //TO-DO 
                    // Hacer el efecto con css3 y para ie6 solo fadeIn<->Out
                    //yellowbox
                    //.animate($.extend(settings.enfasisFx, options), speed || 800)
                    //.animate({ backgroundColor: this.initialColor }, speed || 500);
                    clearTimeout(timer);
                    yellowBox.addClass('yellowbox-emphasis');
                    timer = setTimeout(function () {
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
                        })();
                        listButtons.push($btn.get(0));
                    }
                    return listButtons;
                },
                setMainContent: function (title, body) {
                    yellowBox.find('.yellowbox-title').html(title || "");
                    yellowBox.find('.yellowbox-body').html(body || "");
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
                    if (options.target && $.fn.toAnchor) {
                        $.fn.toAnchor.goTarget(options);
                    }
                    if (options.seconds) {
                        setTimeout(function () {
                            self.close();
                        }, (seconds || 5) * 1000);
                    }
                    return self;
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
        }
        return {
            enfasis: self.enfasis,
            confirm: self.setQuestion,
            alert: self.setMessage,
            show: self.show,
            close: self.close,
            closeIn: self.closeIn
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
        intervalRept: 1000,
        enfasisCustomFx: false,
        autoFx: false
    });
}(jQuery));
/* jQuery toAnchor Scroll Animate plugin 
 * Copyright 2009 Oscar Sobrevilla (oscar.sobrevilla@gmail.com)
 * Released under the MIT and GPL licenses.
 * version 1.0 Beta
 */
(function ($) {
    $.fn.toAnchor = function (_options) {
        var options = $.extend({
            speed: 600,
            animationShow: 'show',
            animationFx: 'normal',
            onMove: false
        }, _options);
        return $.each(this, function () {
            $(this).bind('click', function (event) {
                event.preventDefault();
                var target_ = $($(this).attr('href'))[options.animationShow](options.animationFx);
                var correctionpos = parseInt($($(this).attr('rel'))) || 0;
                $.fn.toAnchor.goTarget({
                    target: target_,
                    speed: options.speed,
                    cp: correctionpos,
                    callback: callback
                });
                if (options.onMove) options.onMove($(this));
            });
        });
    };
    $.fn.toAnchor.goTarget = function (options) {
        $('html, body').animate({
            scrollTop: $(options.target).offset().top + (options.cp || 0)
        }, (options.speed || 600), options.callback);
    };
}(jQuery));