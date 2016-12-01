var SplitView = function () {
    var currentSplitView = null;
    function getSplitView(target) {
        var container = Dom.findParentWithProperty(target, "_splitView");
        if (!container) return null;
        return container._splitView;
    }
    function handleMouseDown(event) {
        Dom.cancelEvent(event);
        var target = Dom.getTarget(event);
        currentSplitView = getSplitView(target);

        if (!currentSplitView) return;
        currentSplitView.ox = event.pageX;
        currentSplitView.originalSplitViewX = currentSplitView.splitViewPos;
        currentSplitView.moved = false;
        Dom.addClass(currentSplitView.container, "SplitViewHeld");
    }

    function handleMouseMove(event) {
        var target = Dom.getTarget(event);
        if (!currentSplitView) return;
        Dom.cancelEvent(event);

        var x = event.pageX;
        var p = currentSplitView.originalSplitViewX + x - currentSplitView.ox;
        var W = Dom.getOffsetWidth(currentSplitView.container);

        var margin = Math.round(W / 10);
        p = Math.min(Math.max(p, margin), W - margin);
        currentSplitView.setSplitViewPosition(p);
        currentSplitView.moved = true;
    }

    function handleMouseUp(event) {
        Dom.cancelEvent(event);
        if (!currentSplitView) return;
        if (!currentSplitView.moved) return;
        currentSplitView.moved = false;
        var r = (currentSplitView.splitViewPos / Dom.getOffsetWidth(currentSplitView.container));
        currentSplitView.ratio = r;
        currentSplitView.updateView();
    	BaseWidget.signalOnSizeChangedRecursively(currentSplitView.node());
    	
        Dom.removeClass(currentSplitView.container, "SplitViewHeld");
        currentSplitView = null;
    }

    function SplitView() {
        BaseWidget.call(this);
        this.container = this.node();
        this.container._splitView = this;
        Dom.addClass(this.container, "SplitView");
    }
    __extend(BaseWidget, SplitView);

    SplitView.MODE_LEFT = "LEFT";
    SplitView.MODE_RIGHT = "RIGHT";
    SplitView.MODE_BOTH = "BOTH";
    SplitView.HANDLE_WIDTH = 10;

    SplitView.prototype.setContentFragment = function (fragment) {
        console.log("setContentFragment called on splitview", fragment);
        for (var i = 0; i < fragment.childNodes.length; i ++) {
            var node = fragment.childNodes[i];
            if (!node.nodeName || !node.getAttribute) continue;
            if (!this.left) {
                this.left = node;
                this.node().appendChild(node);
            } else {
                if (!this.right) {
                    this.right = node;
                    this.node().appendChild(node);
                }
            }
        }
        this.splitter = this.node().ownerDocument.createElement("div");
        this.splitter.setAttribute("role", "splitter");
        this.node().appendChild(this.splitter);
    };

    SplitView.prototype.setup = function (options) {
        if (this._setupCalled) return;
        this._setupCalled = true;
        
        this.options = options || {};

        if (!this.options.initialRatio) this.options.initialRatio = 0.5;
        this.ratio = this.options.initialRatio;

        if (!this.options.initialMode) this.options.initialMode = SplitView.MODE_BOTH;
        this.mode = this.options.initialMode;

        Dom.registerEvent(this.splitter, "mousedown", handleMouseDown);
        Dom.registerEvent(document, "mousemove", handleMouseMove);
        Dom.registerEvent(document, "mouseup", handleMouseUp);

        Dom.addClass(this.splitter, "SplitViewSplitter");
        this.splitter.innerHTML = this.options.keepSplitterVisible ? "<div class=\"Kept\"></div>" : "<div></div>";

        this.splitter.style.position = "absolute";
        this.splitter.style.top = "0px";
        this.splitter.style.bottom = "0px";
        this.splitter.style.overflow = "hidden";
        this.splitter.style.width = SplitView.HANDLE_WIDTH + "px";

        this.left.style.position = "absolute";
        this.left.style.left = "0px";
        this.left.style.top = "0px";
        this.left.style.bottom = "0px";

        this.right.style.position = "absolute";
        this.right.style.top = "0px";
        this.right.style.bottom = "0px";

        this.updateView();
    };

    SplitView.prototype.setMode = function (mode) {
        this.mode = mode;
        this.updateView();
    };
    SplitView.prototype.setRatio = function (ratio) {
        this.ratio = ratio;
        this.updateView();
    };
    SplitView.prototype.getRatioFromFixedSize = function (size) {
        var w = Dom.getOffsetWidth(this.container);
        return size / w;
    };

    SplitView.prototype.updateView = function () {
        Dom.addClass(this.container, "SplitView" + this.mode);
        var w = Dom.getOffsetWidth(this.container);
        if (this.mode == SplitView.MODE_LEFT) {
            this.left.style.left = "0px";
            this.left.style.right = "0px";
            this.left.style.width = w + "px";
            Dom.show(this.left);

            Dom.hide(this.splitter);
            this.right.style.display = "none";
            this.right.style.width = "0px";

        } else if (this.mode == SplitView.MODE_RIGHT) {

            this.right.style.left = "0px";
            this.right.style.right = "0px";
            this.right.style.width =  w + "px";
            this.right.style.display = "block";
            Dom.show(this.right);

            Dom.hide(this.splitter);
            this.left.style.display = "none";
            this.left.style.width = "0px";
        } else if (this.mode == SplitView.MODE_BOTH) {
            var lw = Math.round(w * this.ratio);
            var rw = w - lw;

            var margin = this.options.margin || 0;

            this.left.style.left = "0px";
            this.left.style.right = (rw + margin) + "px";
            this.left.style.width = (lw - margin) + "px";

            this.right.style.left = (lw + margin) + "px";
            this.right.style.right = "0px";
            this.right.style.width = (rw - margin) + "px";

            this.setSplitViewPosition(lw);

            Dom.show(this.left);
            Dom.show(this.splitter);
            Dom.show(this.right);
            if (this.listener) {
            	this.listener(lw, rw);
            }
        }
    };
    
    SplitView.prototype.onSizeChanged = function () {
        this.updateView();
    };
    

    SplitView.prototype.setSplitViewPosition = function (pos) {
        this.splitter.style.left = (pos - SplitView.HANDLE_WIDTH / 2) + "px";
        this.splitViewPos = pos;
    };

    SplitView.prototype.setOnResizeListener = function(listener) {
    	this.listener = listener;
    	return this;
    };
    
    SplitView.prototype.onAttached = function () {
        this.setup({
            initialRatio: 0.2,
            margin: 2,
            keepSplitterVisible: true
        });
    };

    return SplitView;
}();
