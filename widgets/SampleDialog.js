function SampleDialog() {
	BaseDialog.call(this);
	this.title = "Sample Dialog";
}
__extend(BaseDialog, SampleDialog);

SampleDialog.prototype.getDialogActions = function () {
    return [
        {
            type: "cancel", title: "Close",
            isCloseHandler: true,
            run: function () { return true; }
        }
    ]
};
