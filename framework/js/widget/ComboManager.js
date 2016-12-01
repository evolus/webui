function ComboManager() {
    BaseTemplatedWidget.call(this);
    this.button = this.node();
    this.button.setAttribute("type", "button");

    this.popup.setPopupClass("ComboManagerPopup");
    this.useHtml = false;

    this.renderer = ComboManager.DEFAULT_RENDERER;
    this.comparer = Util.sameId;
    this.bind("click", function () {
        this.popup.show(this.button, "left-inside", "bottom", 0, 5);
    }, this.button);
    this.bind("click", this.onItemClick, this.list);

    this.bind("p:PopupShown", function () {
        this.button.setAttribute("active", true);
    }, this.popup);
    this.bind("p:PopupHidden", function () {
        this.button.removeAttribute("active");
    }, this.popup);


}
__extend(BaseTemplatedWidget, ComboManager);

ComboManager.DEFAULT_RENDERER = function (item) {
    return "" + item;
};

ComboManager.prototype.onItemClick = function (event) {
    var item = Dom.findUpwardForData(event.target, "_data");
    if (typeof(item) == "undefined") return;

    this.selectItem(item, true);
};
ComboManager.prototype.setItems = function (items) {
    var first = undefined;
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
        if (typeof(first) == "undefined") first = item;
    }
    this.selectItem(first);
};

ComboManager.prototype.selectItem = function (item, fromUserAction) {
    var element = this.renderer(item, "forCurrentItemDisplay");
    if (!element) return;

    if (element.getAttribute) {
        Dom.empty(this.buttonDisplay);
        this.buttonDisplay.appendChild(element);
    } else {
        this.buttonDisplay.innerHTML = this.useHtml ? element : Dom.htmlEncode(element);
        this.button.setAttribute("title", Dom.htmlEncode(this.useHtml ? Dom.htmlStrip(element) : element));
    }
    if (this.decorator != null) {
        this.decorator(this.buttonDisplay, item);
    }
    this.selectedItem = item;
    if (fromUserAction) {
        Dom.emitEvent("p:ItemSelected", this.node(), {});
        this.popup.hide();
    }
};

ComboManager.prototype.getSelectedItem = function () {
    return this.selectedItem;
};
ComboManager.prototype.setDisabled = function (disabled) {
    if (disabled == true) {
        this.button.setAttribute("disabled", "true");
    } else {
        this.button.removeAttribute("disabled");
    }
};
ComboManager.prototype.selectItemIfContains = function (selectedItem) {
    var item = null;
    var found = false;
    for (var i = 0; i < this.items.length; i ++) {
        if (this.comparer(selectedItem, this.items[i])) {
            item = this.items[i];
            found = true;
            break;
        }
    }

    if (found) {
        this.selectItem(item);
        return true;
    }

    return false;
};
ComboManager.prototype.getCurrentItemDisplayText = function (item) {
    return this.useHtml ? Dom.htmlStrip(this.renderer(item, "forCurrentItemDisplay")) : this.renderer(item, "forCurrentItemDisplay");
};
ComboManager.prototype.fireSelectionEvent = function (fromUserAction) {
    Dom.emitEvent("p:ItemSelected", this.node(), {});
    if (this.options && this.options.onItemSelected) {
        this.options.onItemSelected(fromUserAction ? true : false);
    }
};
ComboManager.prototype.setEnable = function (enable) {
    this.setDisabled(!enable);
};
