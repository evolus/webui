function BaseDialog() {
    Dialog.call(this);
}
__extend(Dialog, BaseDialog);

BaseDialog.prototype.getTemplatePrefix = function() {
    return "widgets/";
}
