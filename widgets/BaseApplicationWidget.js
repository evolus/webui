function BaseApplicationView () {
    BaseTemplatedWidget.call(this);
}
__extend(BaseTemplatedWidget, BaseApplicationView);

BaseApplicationView.prototype.getTemplatePrefix = function () {
return "widgets/";  
};
