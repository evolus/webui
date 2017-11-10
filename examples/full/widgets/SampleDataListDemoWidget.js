function SampleDataListDemoWidget() {
    BaseTemplatedWidget.call(this);

    var thiz = this;
    this.dataListSource = {
        order: {
            propertyName: "name",
            asc: true
        },
        term: "",
        paramName: "name",
        loadPage: function (pageIndex, pageSize, handler, failed) {
            CommonNet.get("https://jsonplaceholder.typicode.com/users")
                .then(function (users) {
                    handler(users.slice(pageIndex * pageSize, Math.min(users.length, (pageIndex + 1) * pageSize)), users.length);
                })
                .catch(function (e) {
                    failed(e);
                });
        },

        getOrder: function () {
            return this.order;
        },
        setOrder: function (order) {
            this.order = order;
        }
    };

    this.actionBar.register({
        getGroup: function (){
            return "list";
        },
        getTitle: function () {
            return "Reload";
        },
        getIcon: function () {
            return "reload";
        },
        isApplicable: function () {
            return true;
        },
        run: function () {
            thiz.paginator.setSource(thiz.dataListSource);
        }
    });
    this.actionBar.register({
        getGroup: function (){
            return "editor";
        },
        getTitle: function () {
            return "Clone asset...";
        },
        getIcon: function () {
            return "settings";
        },
        isApplicable: function () {
            return true;
        },
        run: function () {
        }
    });
    this.actionBar.register({
        getGroup: function (){
            return "editor";
        },
        getTitle: function () {
            return "";
        },
        getIcon: function () {
            return "download";
        },
        isApplicable: function () {
            return false;
        },
        run: function () {
        }
    });
    this.actionBar.register({
        getGroup: function (){
            return "editor";
        },
        getTitle: function () {
            return "";
        },
        getIcon: function () {
            return "calendar-clock";
        },
        isApplicable: function () {
            return true;
        },
        run: function () {
        }
    });
    this.actionBar.register({
        getGroup: function (){
            return "editor";
        },
        getTitle: function () {
            return "Send";
        },
        getIcon: function () {
            return "send";
        },
        isApplicable: function () {
            return true;
        },
        run: function () {
        }
    });

    this.initializeDataTable();
}
__extend(BaseTemplatedWidget, SampleDataListDemoWidget);

SampleDataListDemoWidget.prototype.onAttached = function () {
    this.dataTable.setup();
    var thiz = this;
    this.paginator.setup({
        getTotalItemText: function(total) {
            return String.format("Total %d users", total);
        },
        showPaginator: true,
        withoutStatus: true,
        onPageLoaded: function (p, count) {
            thiz.refreshedAt = new Date().getTime();
            var start = p.currentPage * p.pageSize + 1;
            var end = start + count - 1;
            Dom.setInnerText(thiz.contentDescription, String.format("Showing patients {0}-{1} of {2}", start, end, p.totalItems));
        },
        comparer: function (a, b) {
            return a.id == b.id;
        },
        useButtons: true
    });
    this.paginator.pageSize = 5;
    this.paginator.control(this.dataTable);
    this.paginator.setSource(this.dataListSource);
};


SampleDataListDemoWidget.prototype.initializeDataTable = function () {
    this.dataTable.column(new DataTable.GenericDomColumn("Name", function (data) {
        return {
                    _name: "vbox",
                    _children: [
                        {_name: "strong", _text: data.name},
                        {_name: "span", _text: data.email}
                    ]
                };
    }).width("2*"));
    this.dataTable.column(new DataTable.GenericDomColumn("Company", function (data) {
        return {
                    _name: "vbox",
                    _children: [
                        {_name: "span", _text: data.company.name},
                        {_name: "span", _text: data.company.catchPhrase}
                    ]
                };
    }).width("2*"));
    this.dataTable.column(new DataTable.PlainTextColumn("Address", function (data) {
        return (data.address.suite + " " + data.address.street + ", " + data.address.city);
    }).sortable("email").width("3*"));
    var thiz = this;
    var actions = [ {
            id: "edit", type: "fa-pencil-square-o", title: "Edit Patient",
            isApplicable: function(item) {
                return true;
            },
            handler: function (item) {
            }
        },{
            id: "delete", type: "fa-pencil-square-o", title: "Delete Patient",
            isApplicable: function(item) {
                return true;
            },
            handler: function (item) {
                Dialog.confirm("Are you sure you want to delete this patient?", "Delete", function () {
                        Dialog.alert("The selected patient has been deleted.");
                    }, "Cancel", function () {});
            }
        }];
    this.dataTable.column(new DataTable.ActionColumn(actions).width("1*"));

    this.dataTable.configurable().selector(true, false);
    this.dataTable.setDefaultSelectionHandler({
        run: function (patient) {
        }
    });
}
