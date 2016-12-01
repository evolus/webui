function Sample() {
	BaseApplicationView.call(this);

    this.statusLabel.innerHTML = new Date().toString();

    this.menu = new Menu();

    this.menu.register({
    	key: "Item1",
        isEnabled: function () { return true },
        getLabel: function () { return "Item 1" },
        isValid: function () { return true },
        run: function () {
        	alert("Item 1");
       }
    });
    this.menu.register({
    	key: "Item2",
        isEnabled: function () { return true },
        getLabel: function () { return "Item 2" },
        isValid: function () { return true },
        run: function () {
        	alert("Item 2");
       }
    });
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
    this.menu.register({
    	key: "Item4",
    	type: "Toggle",
        isEnabled: function () { return true },
        getLabel: function () { return "Item 4" },
        isValid: function () { return true },
        run: function () {
        	alert("Item 4");
       }
    });
    this.menu.register({
    	key: "Item5",
    	type: "Selection",
        isEnabled: function () { return true },
        getLabel: function () { return "Item 5" },
        isValid: function () { return true },
        run: function () {
        	alert("Item 5");
       }
    });

    this.bind("click", function (event) {
//    	var dialog = new SampleDialog();
//    	dialog.open();
    	this.menu.showMenu(this.button, "left", "bottom", 5, 5, true);
    }, this.button);

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

//                $assetService.findAssetsForAdministration(
//                    thiz.category ? thiz.category.id : 0, thiz.group ? thiz.group.id : 0, this.paramName, this.term,
//                    pageIndex + 1, pageSize, this.order.propertyName, this.order.asc,
//                    function (result) {
//                        handler(result.results, result.totalResults);
//                }, failed);
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
//            $assetService.getRootCategories(function (category) {
//                console.log("getRootCategories: ", category);
//                thiz.rootCategory = category;
//                callback([category].concat(AssetAdminCategoryTreeView.SYS_NODES));
//            }, widget.LOADING);
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
        checkable: false,
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
            return "Edit";
        },
        getIcon: function () {
            return "trash";
        },
        isApplicable: function () {
            return true;
        },
        run: function () {
            thiz.paginator.getSelectedItems(function (items) {
                new AssetDetailDialog().open({
                    assetId: items[0].assetDTO.id,
                    forceStartEdit: false
                });
            });
        }
    });
//
    this.actionBar.register({
        getGroup: function (){
            return "assetEditor";
        },
        getTitle: function () {
            return "Clone asset";
        },
        getIcon: function () {
            return "cog";
        },
        isApplicable: function () {
            return true;
        },
        run: function () {
            thiz.paginator.getSelectedItems(function (items) {
                var asset = items[0];

                new AssetDetailDialog().open({
                    forceStartEdit: true,
                    defaultPrimaryCategory: asset.assetDTO.primaryCategory,
                    defaultCategories: asset.assetDTO.categories,
                    defaultBusinessStatus: asset.assetDTO.assetBusinessStatus,
                    defaultDepartments: asset.assetDTO.departments,
                    defaultGroups: asset.assetDTO.groups,
                    defaultSerialNo: asset.assetDTO.serialNo,
                    defaultDescription: asset.assetDTO.description,
                    defaultActivityStatus: asset.assetDTO.activityStatus
                });
            });
        }
    });
}
__extend(BaseApplicationView, Sample);

Sample.prototype.onAttached = function () {
	this.dataTable.setup();
//	this.dataTable.setItems(this.patients);
	var thiz = this;
    this.paginator.setup({
        getTotalItemText: function(total) {
            return String.format("Total %d patients", total);
        },
        showPaginator: true,
        withoutStatus: true,
        onPageLoaded: function (p, count) {
            thiz.refreshedAt = new Date().getTime();
            //thiz.updateLastRefreshTime();
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


Sample.prototype.initializeDataTable = function () {
	this.dataTable.column(new DataTable.PlainTextColumn("Id", function (data) {
        return (data.id);
    }).width("1*"));
    this.dataTable.column(new DataTable.PlainTextColumn("Name", function (data) {
        return (data.name);
    }).width("2*"));
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

    this.dataTable.configurable().selector(false);
    this.dataTable.setDefaultSelectionHandler({
        run: function (patient) {
//            new AssetDetailDialog().open({
//                assetId: asset.assetDTO.id,
//                forceStartEdit: false
//            });
        }
    });
}
