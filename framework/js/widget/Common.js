const DOM_VK_CANCEL = 3
const DOM_VK_HELP = 6
const DOM_VK_BACK_SPACE = 8
const DOM_VK_TAB = 9
const DOM_VK_CLEAR = 12
const DOM_VK_RETURN = 13
const DOM_VK_ENTER = 14
const DOM_VK_SHIFT = 16
const DOM_VK_CONTROL = 17
const DOM_VK_ALT = 18
const DOM_VK_PAUSE = 19
const DOM_VK_CAPS_LOCK = 20
const DOM_VK_ESCAPE = 27
const DOM_VK_SPACE = 32
const DOM_VK_PAGE_UP = 33
const DOM_VK_PAGE_DOWN = 34
const DOM_VK_END = 35
const DOM_VK_HOME = 36
const DOM_VK_LEFT = 37
const DOM_VK_UP = 38
const DOM_VK_RIGHT = 39
const DOM_VK_DOWN = 40
const DOM_VK_PRINTSCREEN = 44
const DOM_VK_INSERT = 45
const DOM_VK_DELETE = 46
const DOM_VK_0 = 48
const DOM_VK_1 = 49
const DOM_VK_2 = 50
const DOM_VK_3 = 51
const DOM_VK_4 = 52
const DOM_VK_5 = 53
const DOM_VK_6 = 54
const DOM_VK_7 = 55
const DOM_VK_8 = 56
const DOM_VK_9 = 57
const DOM_VK_SEMICOLON = 59
const DOM_VK_EQUALS = 61
const DOM_VK_A = 65
const DOM_VK_B = 66
const DOM_VK_C = 67
const DOM_VK_D = 68
const DOM_VK_E = 69
const DOM_VK_F = 70
const DOM_VK_G = 71
const DOM_VK_H = 72
const DOM_VK_I = 73
const DOM_VK_J = 74
const DOM_VK_K = 75
const DOM_VK_L = 76
const DOM_VK_M = 77
const DOM_VK_N = 78
const DOM_VK_O = 79
const DOM_VK_P = 80
const DOM_VK_Q = 81
const DOM_VK_R = 82
const DOM_VK_S = 83
const DOM_VK_T = 84
const DOM_VK_U = 85
const DOM_VK_V = 86
const DOM_VK_W = 87
const DOM_VK_X = 88
const DOM_VK_Y = 89
const DOM_VK_Z = 90
const DOM_VK_CONTEXT_MENU = 93
const DOM_VK_NUMPAD0 = 96
const DOM_VK_NUMPAD1 = 97
const DOM_VK_NUMPAD2 = 98
const DOM_VK_NUMPAD3 = 99
const DOM_VK_NUMPAD4 = 100
const DOM_VK_NUMPAD5 = 101
const DOM_VK_NUMPAD6 = 102
const DOM_VK_NUMPAD7 = 103
const DOM_VK_NUMPAD8 = 104
const DOM_VK_NUMPAD9 = 105
const DOM_VK_MULTIPLY = 106
const DOM_VK_ADD = 107
const DOM_VK_SEPARATOR = 108
const DOM_VK_SUBTRACT = 109
const DOM_VK_DECIMAL = 110
const DOM_VK_DIVIDE = 111
const DOM_VK_F1 = 112
const DOM_VK_F2 = 113
const DOM_VK_F3 = 114
const DOM_VK_F4 = 115
const DOM_VK_F5 = 116
const DOM_VK_F6 = 117
const DOM_VK_F7 = 118
const DOM_VK_F8 = 119
const DOM_VK_F9 = 120
const DOM_VK_F10 = 121
const DOM_VK_F11 = 122
const DOM_VK_F12 = 123
const DOM_VK_F13 = 124
const DOM_VK_F14 = 125
const DOM_VK_F15 = 126
const DOM_VK_F16 = 127
const DOM_VK_F17 = 128
const DOM_VK_F18 = 129
const DOM_VK_F19 = 130
const DOM_VK_F20 = 131
const DOM_VK_F21 = 132
const DOM_VK_F22 = 133
const DOM_VK_F23 = 134
const DOM_VK_F24 = 135
const DOM_VK_NUM_LOCK = 144
const DOM_VK_SCROLL_LOCK = 145
const DOM_VK_COMMA = 188
const DOM_VK_PERIOD = 190
const DOM_VK_SLASH = 191
const DOM_VK_BACK_QUOTE = 192
const DOM_VK_OPEN_BRACKET = 219
const DOM_VK_BACK_SLASH = 220
const DOM_VK_CLOSE_BRACKET = 221
const DOM_VK_QUOTE = 222
const DOM_VK_META = 224

function __extend() {
    var __base = arguments[0];
    var sub = arguments[1];

    sub.prototype = Object.create(__base.prototype);
    sub.prototype.constructor = sub;
    sub.__base = __base;

    for (var i = 2; i < arguments.length; i ++) {
        var f = arguments[i];
        sub.prototype[f.name] = f;
    }

    return sub;
}

function __isSubClassOf(sub, base) {
    if (!sub.__base) return false;
    return sub.__base === base || __isSubClassOf(sub.__base, base);
}
function __isAssignableFrom(sub, base) {
    return sub === base || __isSubClassOf(sub, base);
}

function __base(object) {
    return object.constructor.__base.prototype;
}
function __getFrameworkPrefix() {
    return window.FRAMEWORK_PATH || "framework/";
};
//support function.name in IE9+
if (!(function f() {}).name) {
    Object.defineProperty(Function.prototype, 'name', {
        get: function() {
            var name = this.toString().match(/^\s*function\s*(\S*)\s*\(/)[1];
            // For better performance only parse once, and then cache the
            // result through a new accessor for repeated access.
            Object.defineProperty(this, 'name', { value: name });
            return name;
        }
    });
}

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(pattern) {
        var d = this.length - pattern.length;
        return d >= 0 && this.lastIndexOf(pattern) === d;
    };
}

if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

(function() {
    var throttle = function(type, name, obj) {
        obj = obj || window;
        var running = false;
        var func = function() {
            if (running) { return; }
            running = true;
             requestAnimationFrame(function() {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
        obj.addEventListener(type, func);
    };

    /* init - you can init any event */
    throttle("resize", "optimizedResize");
})();

//DAMN jQuery
window.$ = function () {
    console.log("jQuery removed.");
};


var widget = {};
widget.random = function() {
    return "" + new Date().getTime() + "_" + Math.round(10000 * Math.random());
};
widget.STATIC_BASE = "";
widget.LOADING = "Loading...";
widget.CACHE_RANDOM = widget.random();

widget.get = function(foo) {
    if (typeof (foo) == "string") return document.getElementById(foo);
    if (foo && foo.nodeType) return foo;
    return null;
};
widget.getId = function (node) {
    var id = node.getAttribute("id");
    if (!id) {
        id = "node_" + widget.random();
        node.setAttribute("id", id);
        try {
            node.id = id;
        } catch (e) {}
    }

    return id;
};

widget.evaluate = function(object, context) {
    if (typeof (object) == "function") {
        return object.apply(context);
    }
    return object;
};
widget.registerEvent = function (target, event, handlerName, capture) {
    Dom.registerEvent(target, event, function (e) {
        var t = Dom.getTarget(e);
        var node = Dom.findUpward(t, function (n) {
            return n._widget;
        });
        if (!node) return;
        var f = node._widget[handlerName];
        if (!f) return;
        f.apply(node._widget, [e]);
    }, capture);
};

function ie() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('msie') != -1) {
        return parseInt(ua.split('msie')[1], 10);
    }
    if (ua.indexOf('trident') != -1) {
        return 11;
    }
    return false;
}

widget.Util = function() {
    var TEMPLATE_CACHE = {};
    var processedCSS = {};
    var lessParserConfig = {
    		paths: [__getFrameworkPrefix(), __getFrameworkPrefix() + "style/"]
    };
    return {
        _processTemplateStyleSheet: function (html, prefix, templateName) {
        	
            return html.replace(/(<style[^>]*>)([^<]+)(<\/style>)/g, function (zero, start, content, end) {

                if (processedCSS[templateName]) return "";
                
                var css = content.replace(/([\r\n ]+)([^\{\}\$;]+)\{/g, function (zero, leading, selectors) {
                    selectors = selectors.replace(/@this/gi, "body " + prefix);
                    selectors = selectors.replace(/(\.widget_[^\r\n\,]+ )@([a-z])/gi, "$1 .AnonId_$2");
                    if (!selectors.match(/^[ \t]*@media /)) {
                        selectors = selectors.replace(/@([a-z])/gi, ".AnonId_" + (templateName + "_") + "$1");
                    }
                    selectors = selectors.replace(/[ \r\n\t]\,[ \r\n\t]+/g, ",");
                    if (!selectors.match(/^[ \t]*body[ \.\[:]/) && !selectors.match(/^[ \t]*@media /)) {
                        selectors = prefix + " " + selectors.replace(/\,/g, ",\n" + prefix + " ");
                    }

                    var modified = leading + selectors + "{";

                    return modified;
                });
                css = css.replace(/\$([a-z0-9_]+)/g, "@$1");

                //appending less config
                var includes = "";
                if (window.APP_THEME_PATH) {
                    includes += "@import \"" + window.APP_THEME_PATH + "\";\n";
                }
                
                console.log(includes);
                
                css = includes + css;
                
                less.render(css, lessParserConfig).then(function (output) {
                	widget.Util.insertGlobalStyleSheet(output.css, templateName);
                });

                processedCSS[templateName] = true;
                
                return "";

            });
        },
        insertGlobalStyleSheet: function (css, templateName) {
            var head = document.head || document.getElementsByTagName("head")[0];
            var style = document.createElement("style");
            style.type = "text/css";
            style.setAttribute("widget", templateName);

            if (style.styleSheet) {
                style.styleSheet.cssText = "";
            }

            head.appendChild(style);
            style.appendChild(document.createTextNode(css));
        },
        processLocalizationMacros: function (html) {
            if (!window.Messages) return html;
            return html.replace(/#\{([^\r\n\}]+)\}/g, function (all, one) {
                var s = Messages[one] || one;
                return Dom.htmlEncode(s);
            });
        },
        performAutoBinding: function (container, namingContext, ownerTemplateName, forced) {
            Dom.doOnChildRecursively(container, {
                eval: function(n) {
                    return (n.localName == "ui" || (n.namespaceURI == "http://evolus.vn/Namespaces/WebUI/1.0")) && (n.getAttribute("autobinding") != "false" || forced);
                }
            }, function(n) {
                if (!namingContext.__childWidgets) namingContext.__childWidgets = [];

                var clazz = n.getAttribute("type");
                if (!clazz) clazz = n.localName;
                if (!clazz) return;

                var f = window[clazz];
                if (!f) {
                    console.log("No implementation found for: " + clazz);
                }
                var wg = new f(n);

                for (var i = 0; i < n.attributes.length; i ++) {
                    var name = n.attributes[i].name;
                    var value = n.attributes[i].value;

                    if (name == "anon-id") {
                        if (namingContext) {
                            namingContext[value] = wg;
                            Dom.addClass(wg.node(), "AnonId_" + value);
                            Dom.addClass(wg.node(), "AnonId_" + (ownerTemplateName ? (ownerTemplateName + "_") : "") + value);
                        }
                        wg._anonId = value;
                    } else if (name == "style") {
                        var currentStyle = wg.node().getAttribute("style");
                        if (currentStyle) {
                            currentStyle += value;
                        } else {
                            currentStyle = value;
                        }
                        wg.node().setAttribute("style", currentStyle);
                    } else if (name == "flex") {
                        wg.node().setAttribute("flex", value);
                    } else if (name == "class") {
                        Dom.addClass(wg.node(), value);
                    } else {
                        wg[name] = value;
                        if (name != "type") {
                            wg.node().setAttribute(name, value);
                        }
                    }
                }

                var parentNode = n.parentNode;
                parentNode.replaceChild(wg.node(), n);
                namingContext.__childWidgets.push(wg);

                if (wg.setContentFragment && n.childNodes) {
                    var f = wg.node().ownerDocument.createDocumentFragment();

                    while (n.firstChild) {
                        var child = n.firstChild;
                        n.removeChild(child);
                        f.appendChild(child);
                    }

                    widget.Util.performAutoBinding(f, namingContext);
                    wg.setContentFragment(f);
                }

                // if (parentNode.ownerDocument.body.contains(parentNode)) wg.signalOnAttached();
            });
        },
        _processTemplate: function(dolly, namingContext, templateName) {
            dolly.removeAttribute("id");
            //dolly.style.display = "block";

            var anonIdToIdMap = {};

            widget.Util.performAutoBinding(dolly, namingContext, templateName);

            Dom.doOnChildRecursively(dolly, {
                eval: function(n) {
                    return n.getAttribute && n.getAttribute("anon-id");
                }
            }, function(n) {
                var id = n.getAttribute("anon-id");

                if (namingContext) {
                    namingContext[id] = n;
                }
                n.removeAttribute("anon-id");

                var newId = id + widget.random();
                n.setAttribute("id", newId);
                n.id = newId;
                anonIdToIdMap[id] = newId;
                Dom.addClass(n, "AnonId_" + id);
                Dom.addClass(n, "AnonId_" + (templateName ? (templateName + "_") : "") + id);
            });
            Dom.doOnChildRecursively(dolly, {
                eval: function(n) {
                    return n.getAttribute;
                }
            }, function(n) {
                if (n.getAttribute) {
                    var href = n.getAttribute("href");
                    if (href && href.match(/^#(.+)$/)) {
                        var id = RegExp.$1;
                        if (anonIdToIdMap[id]) {
                            n.setAttribute("href", "#" + anonIdToIdMap[id]);
                        }
                    }

                    var ffor = n.getAttribute("for");
                    if (ffor && anonIdToIdMap[ffor]) {
                        n.setAttribute("for", anonIdToIdMap[ffor]);
                    }
                }
            });
        },
        buildDOMFromTemplate: function(template, namingContext) {
            template = widget.get(template);
            var dolly = template.cloneNode(true);

            widget.Util._processTemplate(dolly, namingContext);

            return dolly;
        },

        loadTemplate: function(path, callback) {
            if (!callback) return widget.Util.loadTemplateSync(path);

            if (typeof (TEMPLATE_CACHE[path]) != "undefined") {
                if (callback) {
                    callback(TEMPLATE_CACHE[path]);
                    return;
                } else {
                    return TEMPLATE_CACHE[path];
                }
            }

            var task = function(done) {
                var request = new XMLHttpRequest();
                request.onreadystatechange = function() {
                    if (request.readyState == 4) {
                        done();
                        var html = request.responseText;
                        html = widget.Util.processLocalizationMacros(html);
                        TEMPLATE_CACHE[path] = html;
                        callback(html);
                    }
                };
                request.open("GET", widget.STATIC_BASE + path + "?t=" + widget.CACHE_RANDOM, true);
                request.send(null);
            };

            run(task);
        },
        loadTemplateSync: function(path) {
            if (typeof (TEMPLATE_CACHE[path]) != "undefined") {
                return TEMPLATE_CACHE[path];
            }

            var request = new XMLHttpRequest();
            request.open("GET", widget.STATIC_BASE + path + "?t=" + widget.CACHE_RANDOM, false);
            request.send(null);
            var html = request.responseText;
            html = widget.Util.processLocalizationMacros(html);
            TEMPLATE_CACHE[path] = html;

            return html;
        },
        _toTemplateNode: function (path, html, namingContext) {
            if (html) {
                html = html.replace(/<ui:([^>]+)\/>/gi, function (all, attr) {
                    return "<ui:" + attr + "></ui:Dummy>";
                }).replace(/<ui:([a-zA-Z0-9]+)/gi, function (all, name) {
                    return "<ui type=\"" + name + "\"";
                }).replace(/<\/ui:([a-zA-Z0-9]+)/gi, function (all, name) {
                    return "</ui";
                });
            }
            var div = document.createElement("div");
            var templateName = path.replace(/[^a-z0-9]+/gi, "_");
            var className = "DynamicTemplate" + templateName;
            var processedHtml = widget.Util._processTemplateStyleSheet(html, "." + className, templateName);
            try {
                div.innerHTML = processedHtml;
            } catch (e) {
                console.log("Bad HTML: " + html);
                throw e;
            }
            var firstElement = null;
            for (var i = 0; i < div.childNodes.length; i ++) {
                var e = div.childNodes[i];
                if (e && e.nodeType == Node.ELEMENT_NODE) {
                    firstElement = e;
                    break;
                }
            }

            if (firstElement) {
                div = firstElement;
            }

            Dom.addClass(div, className);
            Dom.addClass(div, templateName);

            widget.Util._processTemplate(div, namingContext, templateName);

            return div;
        },
        loadTemplateAsNode: function(path, callback, namingContext) {
            widget.Util.loadTemplate(path, function (html) {
                callback(widget.Util._toTemplateNode(path, html, namingContext));
            });
        },
        loadTemplateAsNodeSync: function(path, namingContext) {
            var html = widget.Util.loadTemplateSync(path);
            return widget.Util._toTemplateNode(path, html, namingContext);

        },
        registerGlobalListener: function(listener) {
            if (!widget.globalListeners) widget.globalListeners = [];
            widget.globalListeners.push(listener);
        },
        fireGlobalEvent: function() {
            if (!widget.globalListeners) return;
            var name = arguments[0];
            var args = [];
            for ( var i = 1; i < arguments.length; i++) {
                args.push(arguments[i]);
            }

            for ( var i = 0; i < widget.globalListeners.length; i++) {
                var listener = widget.globalListeners[i];
                if (!listener[name]) continue;
                var f = listener[name];
                f.apply(listener, args);
            }
        },
        createOverlayCover: function (zIndex, opacity, color, onClose) {
            var cover = document.createElement("div");
            document.body.appendChild(cover);
            cover.style.position = "fixed";
            cover.style.top = "0px";
            cover.style.left = "0px";
            cover.style.bottom = "0px";
            cover.style.right = "0px";

            if (opacity) cover.style.opacity = "" + opacity;
            if (zIndex) cover.style.zIndex = "" + zIndex;
            if (color) cover.style.background = color;

            if (onClose) {
                Dom.registerEvent(cover, "click", function () {
                    cover.parentNode.removeChild(cover);
                    onClose();
                });
            }

            return cover;
        },
        createBlankCover: function (onClose) {
            return this.createOverlayCover(widget.Dialog.getTopZIndex(), 0, null, onClose);
        },
        createDarkCover: function (onClose) {
            return this.createOverlayCover(widget.Dialog.getTopZIndex(), 0.3, "#000", onClose);
        },
        popupStack: [],
        positionAsPopup: function (node, anchor, hAlign, vAlign, hPadding, vPadding) {
            if (!node.parentNode || node.parentNode != document.body) {
                if (node.parentNode) node.parentNode.removeChild(node);
                document.body.appendChild(node);

                node.style.visibility = "hidden";

                node.style.left = "0px";
                node.style.top = "0px";

                window.setTimeout(function () {
                    widget.Util.positionAsPopup(node, anchor, hAlign, vAlign, hPadding, vPadding);
                }, 10);

                return;
            }
            node.style.left = "0px";
            node.style.top = "0px";

            var display = node.style.display;

            node.style.display = "block";

            var w = node.offsetWidth;
            var h = node.offsetHeight;

            node.style.display = display;

            var rect = anchor.getBoundingClientRect();
            var aw = rect.width;
            var ah = rect.height;
            var ax = rect.left;
            var ay = rect.top;

            var p = hPadding || 0;

            var x = 0;
            if (hAlign == "left") x = ax - w - p;
            if (hAlign == "left-inside") x = ax + p;
            if (hAlign == "middle" || hAlign == "center") x = ax + aw / 2 - w / 2;
            if (hAlign == "right") x = ax + aw + p;
            if (hAlign == "right-inside") x = ax + aw - w - p;

            p = vPadding || p;

            var y = 0;
            if (vAlign == "top") y = ay - h - p;
            if (vAlign == "top-inside") y = ay + p;
            if (vAlign == "middle" || vAlign == "center") y = ay + ah / 2 - h / 2;
            if (vAlign == "bottom") y = ay + ah + p;
            if (vAlign == "bottom-inside") y = ay + ah - h - p;

            //invalidate into view
            var screenW = document.body.offsetWidth - 10;
            console.log("Location", x, w, screenW);
            if (x + w > screenW) x = screenW - w;

            var screenH = document.body.offsetHeight - 10;
            if (y + h > screenH) y = ay - h - p;

            node.style.position = "absolute";
            node.style.left = x + "px";
            node.style.top = y + "px";
            node.style.zIndex = "9999";
            node.style.visibility = "visible";

            widget.Util.popupStack.push(node);
        },
        registerPopopCloseHandler: function () {
            document.body.addEventListener("mousedown", function (event) {
                if (widget.Util.popupStack.length == 0) return;
                var popup = widget.Util.popupStack[widget.Util.popupStack.length - 1];
                var node = Dom.findUpward(event.target, function (n) {
                    return n == popup;
                });
                if (node) return;
                popup.style.visibility = "hidden";
                widget.Util.popupStack.pop();
                event.preventDefault();
            }, false);
        },
        configureNumberInput: function (input, min, max) {
            input._min = min;
            input._max = max;
        }
    };
}();

var busyIndicator = null;
function initBusyIndicator() {
    if (busyIndicator) return;
    busyIndicator = {};

    busyIndicator.overlay = document.createElement("div");
    document.body.appendChild(busyIndicator.overlay);
    Dom.addClass(busyIndicator.overlay, "Overlay");
    Dom.addClass(busyIndicator.overlay, "BusyOverlay");

    document.body.appendChild(busyIndicator.overlay);
    busyIndicator.overlay.style.display = "none";

    busyIndicator.messageContainer = document.createElement("div");
    document.body.appendChild(busyIndicator.messageContainer);
    busyIndicator.messageContainer.style.visibility = "hidden";

    Dom.addClass(busyIndicator.messageContainer, "BusyMessage");
    var spinner = document.createElement("i");
    busyIndicator.messageContainer.appendChild(spinner);
    Dom.addClass(spinner, "fa fa-spinner fa-spin");

    busyIndicator.message = document.createElement("span");
    Dom.addClass(busyIndicator.message, "Text");
    busyIndicator.messageContainer.appendChild(busyIndicator.message);
    Dom.setInnerText(busyIndicator.message, widget.LOADING);

    var w = Dom.getOffsetWidth(busyIndicator.messageContainer);
    busyIndicator.messageContainer.style.marginLeft = "-" + (w / 2) + "px";
}

var defaultIndicator = {
    count: 0,
    busy: function(message) {
        initBusyIndicator();

        Dom.setInnerText(busyIndicator.message, message || widget.LOADING);
        var w = Dom.getOffsetWidth(busyIndicator.messageContainer);
        busyIndicator.messageContainer.style.marginLeft = "-" + (w / 2) + "px";

        busyIndicator.messageContainer.style.visibility = "visible";
        busyIndicator.overlay.style.display = "block";
        this.count++;
    },
    done: function() {
        this.count--;
        if (this.count <= 0) {
            busyIndicator.messageContainer.style.visibility = "hidden";
            busyIndicator.overlay.style.display = "none";
        }
    }
}
function NodeBusyIndicator(node) {
    this.node = node;
}
NodeBusyIndicator.prototype.busy = function (m) {
    Dom.addClass(this.node, "Busy");
};
NodeBusyIndicator.prototype.done = function (m) {
    Dom.removeClass(this.node, "Busy");
};

function run(task, message, indicator) {
    var i = indicator || defaultIndicator;
    var m = message || null;

    i.busy(m);
    task(function() {
        i.done();
    });
}

window.addEventListener("load", function () {
    BaseWidget.registerDOMMutationHandler();
    window.globalViews = {};
    widget.Util.performAutoBinding(document.body, window.globalViews);
    widget.Util.registerPopopCloseHandler();
    
    window.addEventListener("optimizedResize", function() {
        BaseWidget.signalOnSizeChangedRecursively(document.body);
    });
}, false);


function BaseWidget(definitionNode) {
    var node = this.buildDOMNode(definitionNode);

    Dom.addClass(node, "widget_" + this.constructor.name);
    this.__node = node;
    node.__widget = this;

    var thiz = this;
    node.addEventListener("DOMNodeInsertedIntoDocument", function () {
        if (thiz.onFirstInsertedIntoDocument && !thiz._signalInserted) {
            thiz.onFirstInsertedIntoDocument();
            thiz._signalInserted = true;
        }

        if (thiz.onInsertedIntoDocument) thiz.onInsertedIntoDocument();
    }, false);

    this.__delegate("addEventListener", "hasAttribute", "getAttribute", "setAttribute", "setAttributeNS", "removeAttribute", "removeAttributeNS", "dispatchEvent");
}
//@abstract BaseWidget.prototype.buildDOMNode = function () {};
BaseWidget.prototype.node = function () {
    return this.__node;
};
BaseWidget.prototype.__base = function () {
    return __base(this);
};
BaseWidget.prototype.e = function (member, target) {
    if (member instanceof Function) return member.apply(target || this);
    return member;
};
BaseWidget.signalOnAttachedRecursively = function (container) {
    if (container.__widget && container.__widget.onAttached) {
        container.__widget.onAttached();
    }
    for (var i = 0; i < container.childNodes.length; i++) {
        var child = container.childNodes[i];
        BaseWidget.signalOnAttachedRecursively(child);
    }
};
BaseWidget.signalOnSizeChangedRecursively = function (container) {
    if (container.__widget && container.__widget.onSizeChanged) {
        container.__widget.onSizeChanged();
    }
    for (var i = 0; i < container.childNodes.length; i++) {
        var child = container.childNodes[i];
        BaseWidget.signalOnSizeChangedRecursively(child);
    }
};
BaseWidget.prototype.bind = function (eventName, f, node) {
    var n = node || this.__node;
    var thiz = this;
    n.addEventListener(eventName, function (event) {
        f.apply(thiz, [event]);
    });
};

BaseWidget.prototype.onAttached = function () { };
Object.defineProperty(BaseWidget.prototype, "ownerDocument", {
    get: function () {
        return this.node().ownerDocument;
    }
});

BaseWidget.prototype.into = function (container) {
    container.appendChild(this.node());
    return this;
};
BaseWidget.prototype.__delegate = function () {
    for (var i = 0; i < arguments.length; i ++) {
        this.__delegateOne(arguments[i]);
    }
};
BaseWidget.prototype.__delegateOne = function (name) {
    var thiz = this;
    this[name] = function () {
        var f = thiz.__node[name];
        var args = [];
        for (var i = 0; i < arguments.length; i ++) {
            args.push(arguments[i]);
        }
        return f.apply(thiz.__node, args);
    };
};
BaseWidget.prototype.buildDOMNode = function () {
    var node = document.createElement("div");
    return node;
};

BaseWidget.registerDOMMutationHandler = function () {
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type == "childList" && mutation.addedNodes && mutation.addedNodes.length > 0) {
                for (var i = 0; i < mutation.addedNodes.length; i ++) {
                    var container = mutation.addedNodes[i];
                    BaseWidget.signalOnAttachedRecursively(container);
                }
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
};

BaseWidget.closables = [];
BaseWidget.registerClosable = function (closable) {
    BaseWidget.tryRegisterCloseHandlers();

    BaseWidget.unregisterClosable(closable);
    BaseWidget.closables.push(closable);
};
BaseWidget.unregisterClosable = function (closable) {
    var index = BaseWidget.closables.indexOf(closable);
    if (index >= 0) BaseWidget.closables.splice(index, 1);
};
BaseWidget.handleClosableEscapeKey = function (event) {
    if (BaseWidget.closables.length == 0) return;
    var closable = BaseWidget.closables[BaseWidget.closables.length - 1];
    var shouldClose = closable.canCloseNow ? closable.canCloseNow() : true;
    if (typeof(shouldClose) == "undefined") shouldClose = true;

    if (shouldClose) {
        closable.close();
        BaseWidget.unregisterClosable(closable);
        event.preventDefault();
        Dom.cancelEvent(event);
    }
};
BaseWidget.handleGlobalMouseDown = function (event) {
    if (BaseWidget.closables.length == 0) return;
    var closable = BaseWidget.closables[BaseWidget.closables.length - 1];
    var container = closable.getClosableContainer ? closable.getClosableContainer() : closable;
    var found = Dom.findUpward(event.target, function (node) {
        return node == container;
    });
    if (found) return;

    var shouldClose = closable.shouldCloseOnBlur ? closable.shouldCloseOnBlur() : false;
    if (!shouldClose) return;

    closable.close("onBlur");
    BaseWidget.unregisterClosable(closable);
    event.preventDefault();
    Dom.cancelEvent(event);
};

BaseWidget.tryRegisterCloseHandlers = function () {
    if (BaseWidget.closeHandlersRegistered) return;

    window.addEventListener("keyup", function (event) {
        if (event.keyCode == DOM_VK_ESCAPE) {
            BaseWidget.handleClosableEscapeKey(event);
        }
    }, false);


    document.body.addEventListener("mousedown", function (event) {
        BaseWidget.handleGlobalMouseDown(event);
    }, true);

    BaseWidget.closeHandlersRegistered = true;
};
BaseWidget.findUpward = function (node, type) {
    var n = Dom.findUpward(node, function (x) {
        return x.__widget && x.__widget instanceof type;
    });

    return n ? n.__widget : null;
}
BaseWidget.prototype.findUpward = function (type) {
    return BaseWidget.findUpward(this.node(), type);
};

function BaseTemplatedWidget() {
    BaseWidget.call(this);
}
__extend(BaseWidget, BaseTemplatedWidget);

BaseTemplatedWidget.prototype.buildDOMNode = function () {
    var path = this.getTemplatePath();
    var node = widget.Util.loadTemplateAsNodeSync(path, this);

    return node;
};

BaseTemplatedWidget.getTemplatePrefix = function () {
    return __getFrameworkPrefix() + "js/widget/";
};
BaseTemplatedWidget.prototype.getTemplatePrefix = function () {
    return BaseTemplatedWidget.getTemplatePrefix();
};
BaseTemplatedWidget.prototype.getTemplatePath = function () {
    return this.getTemplatePrefix() + this.constructor.name + ".xhtml";
};

var Util = (function () {
	function em() {
	    if (Util._calculatedEM) return Util._calculatedEM;
	    var div = document.createElement("div");
	    var s = "mmmmmmmmmmmmmmmmmmmmmmmmmmm";
	    div.innerHTML = s;
	    document.body.appendChild(div);
	    div.style.position = "absolute";
	    div.style.top = "0px";
	    div.style.opacity = "0";
	    div.style.left = "0px";
	    div.style.whiteSpace = "nowrap";

	    Util._calculatedEM = div.offsetWidth / s.length;
	    document.body.removeChild(div);
	    return Util._calculatedEM;
	};

	function contains(list, item, comparer) {
	    return findItemByComparer(list, item, comparer) >= 0;
	}

	function sameList(a, b, comparer) {
	    return containsAll(a, b, comparer) && containsAll(b, a, comparer);
	};
	function containsAll(a, b, comparer) {
	    var c = comparer || sameId;
	    for (var i = 0; i < b.length; i ++) {
	        if (!contains(a, b[i], c)) return false;
	    }

	    return true;
	};
	function intersect(a, b, comparer) {
	    if (!a || !b) return [];
	    var items = [];
	    for (var i = 0; i < a.length; i ++) {
	        if (contains(b, a[i], comparer)) {
	            items.push(a[i]);
	        }
	    }

	    return items;
	};

	function findItemByComparer(list, item, comparer) {
	    for (var i = 0; i < list.length; i ++) {
	        if (comparer(list[i], item)) return i;
	    }

	    return -1;
	}
	function removeItemByComparer(list, item, comparer) {
	    var result = [];
	    for (var i = 0; i < list.length; i ++) {
	        if (!comparer(list[i], item)) {
	            result.push(list[i]);
	        }
	    }

	    return result;
	}
	function find(list, matcher) {
	    for (var i = 0; i < list.length; i ++) {
	        if (matcher(list[i])) return list[i];
	    }

	    return null;
	}
	function findById(list, id) {
	    return find(list, function (u) { return u.id == id; });
	}
	
	var uuidGenerator = {
	    generateUUID: function () {
	        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	            var r = crypto.getRandomValues(new Uint8Array(1))[0]%16|0, v = c == 'x' ? r : (r&0x3|0x8);
	            return v.toString(16);
	        });
	    }
	};

	function newUUID () {
	    var uuid = Util.uuidGenerator.generateUUID();
	    return uuid.toString().replace(/[^0-9A-Z]+/gi, "");
	};

	var instanceToken = "" + (new Date()).getTime();
	function getInstanceToken () {
	    return Util.instanceToken;
	};
	
	return {
		em: em,
		contains: contains,
		sameList: sameList,
		containsAll: containsAll,
		intersect: intersect,
		findItemByComparer: findItemByComparer,
		removeItemByComparer: removeItemByComparer,
		find: find,
		findById: findById,
		uuidGenerator: uuidGenerator,
		newUUID: newUUID,
		instanceToken: instanceToken,
		getInstanceToken: getInstanceToken
	}

} ());


widget.busyIndicator = (function () {
	var busyCount = 0;
	var currentBusyOverlay = null;

	function showBusyIndicator() {
	    currentBusyOverlay = document.createElement("div");
	    document.body.appendChild(currentBusyOverlay);
	    currentBusyOverlay.style.cssText = "position: absolute; z-index:1000; top: 0px; left: 0px; right: 0px; bottom: 0px; cursor: wait;";
	}
	function hideBusyIndicator() {
	    if (currentBusyOverlay) {
	        if (currentBusyOverlay.parentNode) currentBusyOverlay.parentNode.removeChild(currentBusyOverlay);
	        currentBusyOverlay = null;
	    }
	}
	function busy() {
	    busyCount ++;
	    if (busyCount == 1) showBusyIndicator();
	}
	function unbusy() {
	    if (busyCount > 0) busyCount --;
	    if (busyCount == 0) hideBusyIndicator();
	}
	
	return {
		busy: busy,
		unbusy: unbusy
	}
})();

window.__busyIndicator = widget.busyIndicator;
window.APP_THEME_PATH = __getFrameworkPrefix() + "style/theme-default.less";

