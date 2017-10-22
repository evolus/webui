function SampleDialog() {
	Dialog.call(this);
	this.title = "Sample Dialog";
}
__extend(Dialog, SampleDialog);

SampleDialog.prototype.getDialogActions = function () {
    return [
        {
            type: "cancel", title: "Close",
            isCloseHandler: true,
            run: function () { return true; }
        }
    ]
};
