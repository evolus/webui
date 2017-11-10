function Sample() {
    BaseTemplatedWidget.call(this);

    this.statusLabel.innerHTML = new Date().toString();

    this.menu = new Menu();

    this.menu.register({
        key: "Item1",
        isEnabled: function () { return true },
        getLabel: function () { return "Show an alert..." },
        isValid: function () { return true },
        run: function () {
            Dialog.alert("Parrot can speak Spanish", "A pet parrot that spoke with a British accent when it disappeared from its home four years ago has been reunited with its owner");
       }
    });
    this.menu.register({
        key: "Item2",
        isEnabled: function () { return false },
        getLabel: function () { return "Item 2" },
        isValid: function () { return true },
        run: function () {
            alert("Item 2");
       }
    });
    this.menu.separator();
    this.menu.register({
        key:  "SubMenu",
        label: "Item 3",
        type: "SubMenu",
        subItems: [
                   {
                       key: "SubItem1",
                       isEnabled: function () { return true },
                       getLabel: function () { return "Sub Item 1" },
                       isValid: function () { return true },
                       run: function () {
                           alert("Sub Item 1");
                      }
                   },
                   {
                       key: "SubItem2",
                       isEnabled: function () { return true },
                       getLabel: function () { return "Sub Item 2" },
                       isValid: function () { return true },
                       run: function () {
                           alert("Sub Item 1");
                      }
                   }
                   ]
    });
    this.menu.separator();
    this.menu.register({
        key: "Item4",
        type: "Toggle",
        isEnabled: function () { return true },
        getLabel: function () { return "Item 4" },
        isValid: function () { return true },
        checked: false,
        run: function (checked) {
            this.checked = checked;
        }
    });
    this.menu.register({
        key: "Item5",
        type: "Selection",
        isEnabled: function () { return true },
        getLabel: function () { return "Item 5" },
        isValid: function () { return true },
        checked: false,
        run: function (checked) {
            this.checked = checked;
        }
    });

    this.bind("click", function (event) {
//        var dialog = new SampleDialog();
//        dialog.open();
        this.menu.showMenu(this.button, "left-inside", "bottom", 5, 5, true);
    }, this.button);

    this.bind("click", function (event) {
       var dialog = new SampleDialog();
       dialog.open();
   }, this.buttonX);


    this.initializeDataTable();

    this.comboManager.setItems(["Item 1", "Item 2"]);



    this.patients = [
                     {
                         id: "1",
                         name: "Nguyen Van A"
                     },
                     {
                         id: "2",
                         name: "Nguyen Van 2"
                     },
                     {
                         id: "3",
                         name: "Nguyen Van 3"
                     },
                     {
                         id: "4",
                         name: "Nguyen Van 4"
                     },
                     {
                         id: "5",
                         name: "Nguyen Van 5"
                     },
                     {
                         id: "6",
                         name: "Nguyen Van 6"
                     },
                     {
                         id: "7",
                         name: "Nguyen Van 7"
                     },
                     {
                         id: "8",
                         name: "Nguyen Van 8"
                     },
                     {
                         id: "9",
                         name: "Nguyen Van 9"
                     },
                     {
                         id: "10",
                         name: "Nguyen Van 10"
                     },
                     {
                         id: "11",
                         name: "Nguyen Van 11"
                     }
                 ];

    var thiz = this;

    this.dataListSource = {
            order: {
                propertyName: "name",
                asc: true
            },
            term: "",
            paramName: "name",
            loadPage: function (pageIndex, pageSize, handler, failed) {
                var start = pageIndex * pageSize;
                var end = Math.min(start + pageSize, thiz.patients.length);
                var results = [];
                for (var i = start; i < end; i++) {
                    results.push(thiz.patients[i]);
                }

                handler(results, thiz.patients.length);
            },

            getOrder: function () {
                return this.order;
            },
            setOrder: function (order) {
                this.order = order;
            }
        };

    this.categories = [
                          {
                              name: "Tree 1",
                              id: 1,
                              children: [
                                         {
                                             name: "Sub Tree 1", id: 2,
                                             children: [
                                                        {
                                                            name: "Sub Sub tree 1", id: 3
                                                        }, {
                                                            name: "Sub Sub tree 2", id: 4
                                                        }
                                                        ]
                                         }, {
                                             name: "Sub Tree 1", id: 5
                                         }
                                     ]
                          },
                          {
                              name: "Tree 2", id: 6,
                              children: [
                                         {
                                             name: "Sub Tree 1", id: 7,
                                             children: [
                                                        {
                                                            name: "Sub Sub tree 1", id: 8
                                                        }, {
                                                            name: "Sub Sub tree 2", id: 9
                                                        }
                                                        ]
                                         }, {
                                             name: "Sub Tree 2", id: 10
                                         }
                                     ]
                          },
                          {
                              name: "Tree 3", id: 11,
                              children: [
                                         {
                                             name: "Sub Tree 1", id: 12,
                                             children: [
                                                        {
                                                            name: "Sub Sub tree 1", id : 13
                                                        }, {
                                                            name: "Sub Sub tree 2", id: 14
                                                        }
                                                        ]
                                         }, {
                                             name: "Sub Tree 1", id: 15,
                                             children: [
                                                        {
                                                            name: "Sub Sub tree 1", id: 16
                                                        }, {
                                                            name: "Sub Sub tree 2", id: 17
                                                        }
                                                    ]
                                         },
                                         {
                                             name: "Sub Tree 3", id: 18
                                         }
                                     ]
                          }
                      ];
    var thiz = this;
    var source = function (item, callback) {
        if (!item) {

            callback(thiz.categories);
        } else {
            callback(item.children ? item.children : []);
        }
    };

    var renderer = function (item) {
        return "<span class=\"IconicLabel\">" +
        "<span>" + Dom.htmlEncode(item.name) + "</span></span>";
    };

    var options = {
        expandedAll: true,
        checkable: function (item) {
            return true;
        },
        same: Util.sameId,
        isItemSelectable: function (item) {
            return true;
        },
        onInitialized: function () {
        }
    };

    this.categoryTree.setup(source, renderer, options);

    this.actionBar.register({
        getGroup: function (){
            return "editor";
        },
        getTitle: function () {
            return "Delete";
        },
        getIcon: function () {
            return "delete";
        },
        isApplicable: function () {
            return true;
        },
        run: function () {
            thiz.paginator.getSelectedItems(function (items) {
            });
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
            thiz.paginator.getSelectedItems(function (items) {
            });
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
            thiz.paginator.getSelectedItems(function (items) {
            });
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
            thiz.paginator.getSelectedItems(function (items) {
            });
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
            thiz.paginator.getSelectedItems(function (items) {
            });
        }
    });
}
__extend(BaseTemplatedWidget, Sample);

Sample.prototype.onAttached = function () {
    //this.dataTable.setup();
//    this.dataTable.setItems(this.patients);
    var thiz = this;
    this.paginator.setup({
        getTotalItemText: function(total) {
            return String.format("Total %d patients", total);
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
    //this.paginator.setSource(this.dataListSource);
};


Sample.prototype.initializeDataTable = function () {
    this.dataTable.column(new DataTable.PlainTextColumn("Id", function (data) {
        return (data.id);
    }).width("5em"));
    this.dataTable.column(new DataTable.PlainTextColumn("Name", function (data) {
        return (data.name);
    }).width("2*"));
    this.dataTable.column(new DataTable.PlainTextColumn("Price", function (data) {
        return "$" + (Math.round(Math.random() * 10000) / 100);
    }).type("numeric").sortable("price").width("6em"));
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
