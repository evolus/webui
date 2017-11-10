var ActionBar = function () {
    function actionBarClickHandler(event) {
        var target = Dom.getTarget(event);
        var button = Dom.findUpward(target, {
            eval: function (n) {
                return n._action;
            }
        });

        if (!button) return;
        if (button.disabled) return;

        Dom.cancelEvent(event);

        var action = button._action;

        action.run();

    }

    function ActionBar() {
        BaseWidget.call(this);

        this.container = this.node();
        this.actions = [];
        this.groups = {};

        // this.buttonGroupBox = document.createElement("div");
        // Dom.addClass(this.buttonGroupBox, "btn-group nav-pills");
        // this.container.appendChild(this.buttonGroupBox);

        Dom.registerEvent(this.container, "click", actionBarClickHandler, false);
    }
    __extend(BaseWidget, ActionBar);

    ActionBar.prototype.buildDOMNode = function () {
        var node = document.createElement("hbox");
        return node;
    };

    ActionBar.prototype.register = function (action) {
        this.actions.push(action);

        var actionGroup = action.getGroup ? action.getGroup() : "No group";
        if (!this.groups[actionGroup]) {
            this.groups[actionGroup] = [];
        }
        this.groups[actionGroup].push(action);

        this.invalidate();
    };
    ActionBar.prototype.invalidate = function () {
        this.container.innerHTML = "";
        for (var groupName in this.groups) {
            var actions = this.groups[groupName];

            if (!actions || actions.length < 0) continue;

            var buttonGroupBox = document.createElement("hbox");

            for (var i = 0; i < actions.length; i ++) {
                var action = actions[i];
                if (action.isVisible && !action.isVisible()) continue;

                var disabled = action.isApplicable && !action.isApplicable();
                var button = document.createElement("button");
                button.setAttribute("type", "button");

                var html = "";
                if (action.getIcon && action.getIcon()) html += "<icon class=\"" + action.getIcon() + "\"></icon>";
                if (action.getTitle && action.getTitle()) html += "<span>" + (this.simple ? "" : Dom.htmlEncode(action.getTitle())) + "</span>";

                button.innerHTML = html;
                if (this.simple && action.getTitle) {
                    button.setAttribute("title", action.getTitle());
                }

                buttonGroupBox.appendChild(button);
                if (disabled) {
                    Dom.addClass(button, "disabled");
                    button.setAttribute("disabled", "true");
                }
                button._action = action;
            }

            this.container.appendChild(buttonGroupBox);
        }
    };

    ActionBar.prototype.invalidateActionStatus = function () {
        Dom.doOnAllChildren(this.container, function (groupNode) {
            Dom.doOnAllChildren(groupNode, function (button) {
                var action = button._action;
                var disabled = action && action.isApplicable && !action.isApplicable();
                if (disabled) {
                    Dom.addClass(button, "disabled");
                    button.setAttribute("disabled", "true");
                } else {
                    Dom.removeClass(button, "disabled");
                    button.removeAttribute("disabled");
                }
            });
        });
    };

    return ActionBar;
}();
