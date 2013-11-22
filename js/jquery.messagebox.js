MessageBox = (function($) {

    var dummyStyle = document.createElement('div').style,
        vendor = (function() {
            var vendors = 't,webkitT,MozT,msT,OT'.split(','),
                t,
                i = 0,
                l = vendors.length;

            for (; i < l; i++) {
                t = vendors[i] + 'ransform';
                if (t in dummyStyle) {
                    return vendors[i].substr(0, vendors[i].length - 1);
                }
            }
            return false;
        })(),
        TRNEND_EV = (function() {
            if (vendor === false) return false;
            var transitionEnd = {
                '': 'transitionend',
                'webkit': 'webkitTransitionEnd',
                'Moz': 'transitionend',
                'O': 'otransitionend',
                'ms': 'MSTransitionEnd'
            };
            return transitionEnd[vendor];
        })(),
        ANMEND_EV = (function() {
            if (vendor === false) return false;
            var animationEnd = {
                '': 'animationend',
                'webkit': 'webkitAnimationEnd',
                'Moz': 'animationend',
                'O': 'oanimationend',
                'ms': 'MSAnimationEnd'
            };
            return animationEnd[vendor];
        })(),

        MessageBox = function(title, text, options) {
            this.timer = 0;
            this.options = $.extend({}, MessageBox.options, options);
            this.el = $(this.tpl(title, text));
            this.dom = {};
            this.dom.title = this.el.find('div.messagebox-title');
            this.dom.text = this.el.find('div.messagebox-text');
            this.dom.buttons = this.el.find('div.messagebox-buttons');
            this._setup();
        };

    MessageBox.options = {
        close: 'Close'
    };

    $.extend(MessageBox.prototype, {

        _setup: function() {
            this.dom.close = this.el
                .find('.messagebox-closer')
                .on('click', $.proxy(function(e) {
                    e.preventDefault();
                    this.close();
                }, this));
            if (this.options.close)
                this.dom.close.show();
        },

        _hide: function(callback) {
            this.el.slideUp($.proxy(function() {
                callback && callback.call(this);
                if (this.options.onClose)
                    this.options.onClose(this);
            }, this));
        },

        _show: function(callback) {
            this.el.slideDown($.proxy(function() {
                callback && callback.call(this);
                if (this.options.onOpen)
                    this.options.onOpen(this);
            }, this));
        },

        _setContent: function(title, text) {
            this.dom.title.html(title || '');
            this.dom.text.html(text || '');
            return this;
        },

        _buildBtns: function(buttons) {
            var that = this,
                listButtons = [];
            $.each(buttons || [], function(label) {
                var button = this;
                listButtons.push($('<button class="messagebox-button" />')
                    .text(label)
                    .addClass(button.className)
                    .on('click', function(e) {
                        e.preventDefault();
                        button && button.call(that, this, e);
                    }).get(0));
            });
            return listButtons;
        },



        /**
         * Makes a question.
         * @param title {String}
         * @param text {String}
         * @param buttons {Object}
         * @exposed
         */
        question: function(title, text, buttons) {
            var that = this;
            buttons = buttons || {};
            that._setContent(title, text);
            that.dom.buttons.show().empty().append(that._buildBtns(buttons));
            return that;
        },

        /**
         * Displays a message.
         * @param title {String}
         * @param text {String}
         * @param delayToClose {Number} seconds for autoclose
         * @exposed
         */
        message: function(title, text, delayToClose) {
            var that = this;
            that.open().blink();
            that.dom.buttons.empty().hide();
            that._setContent(title, text);
            if (delayToClose)
                this.close(delayToClose);
            return that;
        },


        /**
         * Open the box
         * @param callback {function}
         * @exposed
         */

        open: function(callback) {
            this._show(callback);
            return this;
        },


        /**
         * Close the box
         * @param callback {function}
         * @exposed
         */
        close: function(delay, callback) {
            delay ? setTimeout($.proxy(function() {
                this._hide(callback);
            }, this), delay * 1000) : this._hide(callback);
            return this;
        },



        /**
         * Blink the box
         * @param times {Number} number of repeat blink animation.
         * @exposed
         */
        blink: function(times) {
            var that = this;
            if (times) {
                that.el.one(TRNEND_EV, function(e) {
                    that.el.one(TRNEND_EV, function(e) {
                        that.blink(times - 1);
                    }).removeClass('messagebox-emphasis');
                }).addClass('messagebox-emphasis');
            }
            return that;
        },


        /**
         * Shake the box
         * @param callback {function}
         * @exposed
         */
        shake: function(callback) {
            var that = this;
            that.el.one(ANMEND_EV, function(e) {
                if (callback) {
                    callback.call(that, this, e);
                }
                that.el.removeClass('animation-shake')
            }).css('animation-duration', '1s').addClass('animation-shake');
            return this;
        },

        destroy: function(){
            this.el.remove();
            this.el = null;
            this.dom = null;
        },


        tpl: function(title, text) {
            return '<div class="messagebox">' +
                '<a class="messagebox-closer" href="#close" style="display:none" title="' + this.options.close + '"/>' +
                '<div class="messagebox-title">' + title + '</div>' +
                '<div class="messagebox-text">' + text + '</div>' +
                '<div class="messagebox-buttons" style="display:none"></div>' +
                '</div>';
        }
    });

    return MessageBox;

}(jQuery))