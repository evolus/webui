function SampleDialog() {
	Dialog.call(this);
	this.title = "Use Google's location service?";
}
__extend(Dialog, SampleDialog);

SampleDialog.prototype.getDialogActions = function () {
    return [
        {
            type: "accept", title: "Agree",
            run: function () { return true; }
        },
        {
            type: "cancel", title: "Disagree",
            isCloseHandler: true,
            run: function () { return true; }
        }
    ]
};
