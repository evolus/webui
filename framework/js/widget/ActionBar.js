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

        // this.buttonGroupDiv = document.createElement("div");
        // Dom.addClass(this.buttonGroupDiv, "btn-group nav-pills");
        // this.container.appendChild(this.buttonGroupDiv);

        Dom.registerEvent(this.container, "click", actionBarClickHandler, false);
    }
    __extend(BaseWidget, ActionBar);

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

            var buttonGroupDiv = document.createElement("div");
            Dom.addClass(buttonGroupDiv, "btn-group nav-pills");

            for (var i = 0; i < actions.length; i ++) {
                var action = actions[i];
                if (action.isVisible && !action.isVisible()) continue;

                var disabled = action.isApplicable && !action.isApplicable();
                var button = document.createElement("button");
                button.setAttribute("type", "button");

                Dom.addClass(button, "btn btn-default");

                button.innerHTML = "<span><i class=\"" + action.getIcon() + "\" ui-icon=\"" + action.getIcon() + "\"></i> " + (this.simple ? "" : Dom.htmlEncode(action.getTitle())) + "</span>";
                if (this.simple) {
                    button.setAttribute("title", action.getTitle());
                }

                buttonGroupDiv.appendChild(button);
                if (disabled) {
                    Dom.addClass(button, "disabled");
                    button.setAttribute("disabled", "true");
                }
                button._action = action;
            }

            this.container.appendChild(buttonGroupDiv);
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
