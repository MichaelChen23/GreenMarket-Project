/**
 * green-market.home js
 * Created by mc on 2016/2/17.
 */

$(function () {

    var pageManager = {
        $container: $('.green_container'),
        _pageStack: [],
        _configs: [],
        _defaultPage: null,
        _isGo: false,
        default: function (defaultPage) {
            this._defaultPage = defaultPage;
            return this;
        },
        init: function () {
            var self = this;

            $(window).on('hashchange', function (e) {

                var _isBack = !self._isGo;
                self._isGo = false;
                if (!_isBack) {
                    return;
                }

                var url = location.hash.indexOf('#') === 0 ? location.hash : '#';
                var found = null;
                for(var i = 0, len = self._pageStack.length; i < len; i++){
                    var stack = self._pageStack[i];
                    if (stack.config.url === url) {
                        found = stack;
                        break;
                    }
                }
                if (found) {
                    self.back();
                }
                else {
                    goDefault();
                }
            });

            function goDefault(){
                var url = location.hash.indexOf('#') === 0 ? location.hash : '#';
                var page = self._find('url', url) || self._find('name', self._defaultPage);
                self.go(page.name);
            }

            goDefault();

            return this;
        },
        push: function (config) {
            this._configs.push(config);
            return this;
        },
        go: function (to) {
            var config = this._find('name', to);
            if (!config) {
                return;
            }

            var html = $(config.template).html();
            var $html = $(html).addClass('slideIn').addClass(config.name);
            this.$container.append($html);
            this._pageStack.push({
                config: config,
                dom: $html
            });

            this._isGo = true;
            location.hash = config.url;

            if (!config.isBind) {
                this._bind(config);
            }

            return this;
        },
        back: function () {
            var stack = this._pageStack.pop();
            if (!stack) {
                return;
            }

            stack.dom.addClass('slideOut').on('animationend', function () {
                stack.dom.remove();
            }).on('webkitAnimationEnd', function () {
                stack.dom.remove();
            });

            return this;
        },
        _find: function (key, value) {
            var page = null;
            for (var i = 0, len = this._configs.length; i < len; i++) {
                if (this._configs[i][key] === value) {
                    page = this._configs[i];
                    break;
                }
            }
            return page;
        },
        _bind: function (page) {
            var events = page.events || {};
            for (var t in events) {
                for (var type in events[t]) {
                    this.$container.on(type, t, events[t][type]);
                }
            }
            page.isBind = true;
        }
    };

    var login = {
        name: 'login',
        url: '#',
        template: '#gm_login',
        events: {
            '#showLoginTips': {
                click: function () {
                    var $phoneToast = $('#phone_warm_toast');
                    var $passwordToast = $('#password_warm_toast');
                    if ($phoneToast.css('display') != 'none') {
                        return;
                    }
                    if ($passwordToast.css('display') != 'none') {
                        return;
                    }

                    var account = trimStr(document.getElementById("account").value);
                    var password = trimStr(document.getElementById("password").value);

                    if(account=="" || account==null || account.length!=11) {
                        $phoneToast.show();
                        setTimeout(function () {
                            $phoneToast.hide();
                        }, 2000);
                        return;
                    }

                    if(password=="" || password==null || password.length<6) {
                        $passwordToast.show();
                        setTimeout(function () {
                            $passwordToast.hide();
                        }, 2000);
                        return;
                    }
                }
            }
        }
    };

    <!-- trim功能，去掉首尾空格 -->
    function trimStr(str) {
        return str.replace(/(^\s*)|(\s*$)/g,"");
    }

    pageManager
        .push(login)
        .default('login')
        .init();
});
