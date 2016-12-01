function InfoTip() {
    Popup.call(this);

    //avoid auto close
    this.skipStack = true;
    this.forceInside = false;
    this.useZIndex = false;
    this.popupOpacity = 0.999999;
    this.popupContainer = this.node();

    this.bind("click", function () {
        this.hide();
    }, this.tipClose);

}
__extend(Popup, InfoTip);

InfoTip.prototype.buildDOMNode = function () {
    var frameTemplate = "js/widget/InfoTip.html";
    var node = widget.Util.loadTemplateAsNodeSync(frameTemplate, this);

    if (this.constructor.name != "InfoTip") {
        //load also the sub-class template into the dialog body
        //please note that the binding will be done for both templates
        var contentNode = widget.Util.loadTemplateAsNodeSync(this.getTemplatePath(), this);
        this.tipBody.appendChild(contentNode);
    }

    return node;
};

InfoTip.prototype.setContentFragment = function (fragment) {
    this.tipBody.appendChild(fragment);
};

InfoTip.prototype.reparent = function () {
    // var parentNode = this.popupContainer.parentNode;
    // parentNode.removeChild(this.popupContainer);
    // parentNode.appendChild(this.popupContainer);
};

InfoTip.prototype._calculatePosition = function (anchor, hAlign, vAlign, hPadding, vPadding) {
    var rect = anchor.getBoundingClientRect();
    var p = InfoTip.__base.prototype._calculatePosition.bind(this)(anchor, hAlign, vAlign, hPadding, vPadding);
    p.x -= 1.5 * em() + 7 - rect.width / 2;
    p.y -= 7 + 0.7 * em();
    return p;
};
