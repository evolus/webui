function AutoCompleteText() {
    BaseWidget.call(this);

    var css = "body .AutoCompleteTextPopup {padding: 0.5em 0em; }\nbody .AutoCompleteTextPopup .AnonId_list .Item {padding: 0.3em 0.8em; }\nbody .AutoCompleteTextPopup .AnonId_list .Item.Selected {background: #FFD40B; color: #000;}";
    widget.Util.insertGlobalStyleSheet(css, "AutoCompleteText");

    this.popup = new Popup().into(document.body);
    this.popup.setPopupClass("AutoCompleteTextPopup");

    this.list = document.createElement("div");
    this.popup.setContentFragment(this.list);
    Dom.addClass(this.list, "AnonId_list");

    this.bind("mouseover", this.handleMouseOver, this.list);
    this.bind("click", this.handleItemClick, this.list);
}

__extend(BaseTemplatedWidget, AutoCompleteText);

AutoCompleteText.prototype.buildDOMNode = function () {
    var input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("autocomplete", "off");

    return input;
};

AutoCompleteText.prototype.setup = function (source, renderer, builder, filter, sorter) {
    this.source = source;
    this.renderer = renderer || function (object) { return "" + object; };
    this.builder = builder || function (object) { return "" + object; };
    this.filter = filter;
    this.sorter = sorter;

    this.bind("keyup", this.handleKeyUp);
    this.bind("keypress", this.handleKeyPress);
};
AutoCompleteText.prototype.handleKeyPress = function (event) {
    if (event.keyCode == DOM_VK_DOWN) {
        this.selectNext(1);
        Dom.cancelEvent(event);
        return;
    }
    if (event.keyCode == DOM_VK_UP) {
        this.selectNext(-1);
        Dom.cancelEvent(event);
        return;
    }
};
AutoCompleteText.prototype.handleMouseOver = function (event) {
    var data = Dom.findUpwardForData(event.target, "_data");
    if (!data) return;
    var index = this.items.indexOf(data);
    if (index < 0) return;

    this.selectItemAt(index);
};
AutoCompleteText.prototype.handleItemClick = function (event) {
    var data = Dom.findUpwardForData(event.target, "_data");
    if (!data) return;

    this.node().value = this.builder(data);
    this.node().select();
    this.selectedData = data;

    this.focusedData = null;
    this.popup.hide();
    this.node().focus();

    Dom.cancelEvent(event);
};
AutoCompleteText.prototype.handleKeyUp = function (event) {
    if (this.pendingTimer) window.clearTimeout(this.pendingTimer);
    if (this.currentLoader) this.currentLoader.cancel();

    if (event.keyCode == DOM_VK_ESCAPE) return;
    if (event.keyCode == DOM_VK_DOWN) return;
    if (event.keyCode == DOM_VK_UP) return;

    if (event.keyCode == DOM_VK_ENTER || event.keyCode == DOM_VK_RETURN) {
        if (this.focusedData) {
            this.node().value = this.builder(this.focusedData);
            this.node().select();
            this.selectedData = this.focusedData;

            this.focusedData = null;
            this.popup.hide();
            this.node().focus();
        }
        Dom.cancelEvent(event);
        return;
    }

    this.pendingTimer = null;
    this.currentLoader = null;

    var thiz = this;
    var text = this.node().value.replace(/^[ \t]+/, "").replace(/[ \t]+$/, "");
    if (!text && !this.suggestOnBlank) {
        this.popup.closeUpward();
        return;
    }
    this.pendingTimer = window.setTimeout(function () {
        thiz.pendingTimer = null;
        if (thiz.currentLoader) thiz.currentLoader.cancel();
        thiz.currentLoader = new AutoCompleteTextLoader(thiz);
        thiz.currentLoader.start(text, thiz.source);
    }, this.timeout || 500);
};

AutoCompleteText.prototype.selectNext = function (delta) {
    var index = this.selectedIndex + delta;
    if (index < 0) index = this.items.length - 1;
    if (index >= this.items.length) index = 0;

    this.selectItemAt(index);
};
AutoCompleteText.prototype.selectItemAt = function (index) {
    if (index < 0 || index > this.items.length - 1) return;

    var data = this.items[index];
    var itemNode = null;
    this.selectedIndex = -1;
    this.focusedData = null;
    for (var i = 0; i < this.list.childNodes.length; i ++) {
        var node = this.list.childNodes[i];
        if (node._data == data) {
            itemNode = node;
            Dom.addClass(node, "Selected");
            this.selectedIndex = index;
            this.focusedData = data;
        } else {
            Dom.removeClass(node, "Selected");
        }
    }
};

AutoCompleteText.prototype.onFound = function (query, items) {
    this.currentLoader = null;
    if (items && items.length > 0) {
        this.setupItems(items);
        this.popup.show(this.node(), "left-inside", "bottom", 0, 5);
    } else {
        this.popup.closeUpward();
    }
};
AutoCompleteText.prototype.setupItems = function (items) {
    var first = null;
    this.items = items;
    this.list.innerHTML = "";
    if (!this.items) return;
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var element = this.renderer(item);
        var node = null;
        if (element.getAttribute) {
            node = Dom.newDOMElement({
                _name: "div",
                "class": "Item",
            });
            node.appendChild(element);
        } else {
            var spec = {
                _name: "div",
                "class": "Item",
                _text: element
            };

            spec[this.useHtml ? "_html" : "_text"] = element;
            node = Dom.newDOMElement(spec);
        }
        if (this.decorator) this.decorator(node, item);
        node._data = item;
        this.list.appendChild(node);
        if (!first) first = item;
    }

    if (items.length > 0) {
        this.selectItemAt(0);
        if (this.node().value == this.builder(first)) {
            this.selectedData = first;
        }
    }
    //this.selectItem(first);
};

AutoCompleteText.prototype.getSelectedData = function () {
    return this.selectedData;
};
AutoCompleteText.prototype.setSelectedData = function (data) {
    this.selectedData = data;
    this.node().value = data ? this.builder(data) : "";
};

AutoCompleteText.prototype.getText = function () {
    return this.node().value;
};

AutoCompleteText.prototype.focus = function () {
    return this.node().focus();
};

function AutoCompleteTextLoader(owner) {
    this.canceled = false;
    this.owner = owner;
}

AutoCompleteTextLoader.prototype.cancel = function () {
    this.canceled = true;
    this.owner = null;
};
AutoCompleteTextLoader.prototype.start = function (query, source) {
    var thiz = this;
    source(query, function (items) {
        if (thiz.canceled) return;
        thiz.owner.onFound(query, items);
    });
};
