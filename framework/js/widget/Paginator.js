var Paginator = function () {
    function paginatorClickHandler(event) {
        var target = Dom.getTarget(event);
        var node = Dom.findUpward(target, {
            eval: function (n) {
                return n.getAttribute && n.getAttribute("role") != null;
            }
        });

        if (!node) return;
        var role = node.getAttribute("role");

        var list = Dom.findUpward(target, {
            eval: function (n) {
                return n._p;
            }
        });

        if (!list) return;
        var paginator = list._p;

        Dom.cancelEvent(event);

        if (role == "prev" && paginator.currentPage > 0) {
            paginator.gotoPage(paginator.currentPage - 1);
        } else if (role == "next" && paginator.currentPage < paginator.totalPages - 1) {
            paginator.gotoPage(paginator.currentPage + 1);
        } else {
            try {
                var n = parseInt(role, 10);
                if (!isNaN(n) && n >= 0 && n < paginator.totalPages) {
                    paginator.gotoPage(n);
                }
            } catch (e) {}
        }
    }

    function Paginator() {
        BaseWidget.call(this);
        this.container = this.node();
        this.renderer = null;
        this.source = null;
        this.pageSize = 40;
        this.currentPage = 0;
        this.totalPages = 0;
        this.firstRender = true;

        this.selectedItems = [];
        this.lastPageSizeCalculationAt = 0;
    }
    __extend(BaseWidget, Paginator);

    Paginator.prototype.setup = function (options) {
        this.options = options ? options : null;
        this.comparer = (options && options.comparer) ? options.comparer : function (a, b) {
            return a.id == b.id;
        };
    };
    Paginator.prototype.control = function (renderer) {
        this.renderer = renderer;
        this.renderer.withItemComparer(this.comparer);

        if (this.renderer.addOrderRequestListener) {
            this.renderer.addOrderRequestListener(this);
        }

        var thiz = this;

        if (this.renderer.addListener) {
            this.renderer.addListener({
                onSelectionChanged: function (table, fromUserAction) {
                    thiz.onRendererSelectionChanged(table, fromUserAction);
                    thiz.renderer.invalidateSelectionInfo(thiz);
                },
                onSelectNoneAction: function () {
                    thiz.clearSelection();
                },
                onSizeChanged: function () {
                    thiz.onRendererSizeChanged();
                }
            });
        }

        var showPaginator = this.options != null && this.options.showPaginator ? true : false;

        if (showPaginator) {
            if (this.renderer.markedAsPaginated) this.renderer.markedAsPaginated(true);
            return;
        }
        //console.log("add load more event " + showPaginator);
        Dom.registerEvent(this.renderer.container, "scroll", function(e){
            var position = this.scrollTop + this.offsetHeight;
            var percent = position / this.scrollHeight * 100;
            //console.log(percent);
            if (percent >= 75) {
                thiz.loadMore();
            }
        });
    };
    Paginator.prototype.clearSelection = function () {
        this.selectedItems = [];
        this.renderer.invalidateSelectionInfo(this);
        this.fireSelectionChangedEvent();
    };

    Paginator.prototype.loadMore = function() {
    	//console.log("load");
    	var thiz = this;
    	this.currentPage++;
    	this.source.loadPage(this.currentPage, this.pageSize, function (results, totalItems) {
    		if (thiz.pageSize < results.length) {
                thiz.renderer.addItems(results.slice(0, thiz.pageSize));
            } else {
                thiz.renderer.addItems(results);
            }
    	});
    };

    Paginator.prototype.onRendererSelectionChanged = function (table, fromUserAction) {
        if (!fromUserAction) return;

        var items = this.renderer.getSelectedItems();
        var all = this.renderer.items;

        if (!all) return;

        var newSelectedItems = [];
        for (var i = 0; i < this.selectedItems.length; i ++) {
            var item = this.selectedItems[i];
            if (!Util.contains(all, item, this.comparer) || Util.contains(items, item, this.comparer)) {
                newSelectedItems.push(item);
            }
        }
        for (var i = 0; i < items.length; i ++) {
            var item = items[i];
            if (!Util.contains(this.selectedItems, item, this.comparer)) {
                newSelectedItems.push(item);
            }
        }

        this.selectedItems = newSelectedItems;
        this.fireSelectionChangedEvent();
    };

    Paginator.prototype.fireSelectionChangedEvent = function (fromUserAction) {
        if (this.onSelectionChanged) this.onSelectionChanged(this, fromUserAction);
    };

    Paginator.prototype.changeOrder = function (order) {
        if (!this.source || !this.source.setOrder) return;
        this.source.setOrder(order);
        this.gotoPage(this.currentPage);
    };
    Paginator.prototype.onRendererSizeChanged = function () {
        if (this.options && this.options.avoidPageSizeRecalculation) return;
        if (this.firstRender) return;

        var now = new Date().getTime();

        if (now - this.lastPageSizeCalculationAt < 1000) return;

        var thiz = this;
        var calculatePageSize = this.renderer.calculatePreferredPageSize && this.renderer.getItems;
        if (!calculatePageSize) return;
        var items = this.renderer.getItems();

        var currentIndex = this.currentPage * this.pageSize;
        thiz.lastPageSizeCalculationAt = now;
        thiz.renderer.calculatePreferredPageSize(items, function (preferredPageSize) {
            if (!isNaN(preferredPageSize) && preferredPageSize > 0 && preferredPageSize != thiz.pageSize) {
                var newPageIndex = Math.floor(currentIndex / preferredPageSize);
                thiz.pageSize = preferredPageSize;
                thiz.gotoPage(newPageIndex);
            } else {
                thiz.renderer.setItems(items);
            }
        });

    };

    Paginator.prototype.gotoPage = function (pageIndex, silent) {
        var thiz = this;
        //this.renderer.setItems([], true);
        if (this.renderer.showBusy && !silent) this.renderer.showBusy(true);
        this.source.loadPage(pageIndex, this.pageSize, function (results, totalItems) {
            var showPaginator = thiz.options != null && thiz.options.showPaginator;
            var calculatePageSize = thiz.needCalculatePageSize() && showPaginator && pageIndex == 0 && totalItems > 0 && thiz.firstRender && thiz.renderer.calculatePreferredPageSize;

            if (thiz.selectedItems && thiz.selectedItems.length > 0 && results && results.length > 0) {
                var updatedItems = [];
                for (var i = 0; i < thiz.selectedItems.length; i ++) {
                    var item = thiz.selectedItems[i];
                    var other = find(results, function (a) {
                        return thiz.comparer(a, item);
                    });

                    updatedItems.push(other ? other : item);
                }

                thiz.selectedItems = updatedItems;
            }

            var count = results.length;

            if (!thiz.renderer.isSelectAll()) {
                thiz.renderer.selectItems(thiz.selectedItems);
            }

            var postRenderRunnable = function () {
                if (thiz.source.getOrder && thiz.renderer.setOrder) {
                    thiz.renderer.setOrder(thiz.source.getOrder());
                }

                //calculate pages
                thiz.totalPages = Math.ceil(totalItems / thiz.pageSize);
                thiz.currentPage = pageIndex;
                thiz.totalItems = totalItems;

                if (thiz.options && thiz.options.onPageLoaded) {
                    thiz.options.onPageLoaded(thiz, count);
                }

                if (showPaginator) {
                	thiz._updateUI();
                } else {
                	thiz.container.innerHTML = "";
                	thiz.invalidateRendererHeight();
                }

                thiz.renderer.multiPages = thiz.totalPages > 1;
                thiz.renderer.totalItems = thiz.totalItems;
                if (thiz.renderer.showBusy && !silent) thiz.renderer.showBusy(false);

            }

            thiz.firstRender = false;

            if (calculatePageSize) { //perform calculation
                thiz.lastPageSizeCalculationAt = new Date().getTime();
                thiz.renderer.calculatePreferredPageSize(results, function (preferredPageSize) {
                    console.log("calculated preferredPageSize: ", preferredPageSize);
                    if (!isNaN(preferredPageSize) && preferredPageSize > 0) thiz.pageSize = preferredPageSize;

                    if (thiz.pageSize > results.length) {
                        if (thiz.renderer.showBusy && !silent) thiz.renderer.showBusy(false);
                        thiz.gotoPage(0, silent);
                        return;
                    }

                    var subList = results.slice(0, thiz.pageSize);
                    thiz.renderer.setItems(subList);
                    count = subList.length;

                    if (!thiz.renderer.isSelectAll()) {
                        thiz.renderer.selectItems(thiz.selectedItems);
                    }

                    postRenderRunnable();
                });
            } else {
                thiz.renderer.setItems(results);
                postRenderRunnable();
            }
        }, function (error) {
            if (thiz.renderer.showBusy && !silent) thiz.renderer.showBusy(false);
        });
    };

    Paginator.prototype.invalidateRendererHeight = function() {
    	if (this.renderer == null) return;

    	var calculatedHeight = this.renderer.getCalculatedHeight();

    	this.renderer.setHeight(calculatedHeight);
    }
    Paginator.prototype.needCalculatePageSize = function() {
        return true;
    }
    Paginator.prototype.setSource = function (source) {
        this.source = source;
        this._allItems = null;
        this.selectedItems = [];
        this.firstRender = true;
        if (this.renderer) {
            if (this.renderer.reset) this.renderer.reset();
            this.gotoPage(0);
        }
    };

    Paginator.prototype.refresh = function (withIndicator) {
        if (!this.source) return;
        this._allItems = null;
        this.gotoPage(this.currentPage, withIndicator ? null : "silent");
    };

    Paginator.prototype.reInit = function () {
        if (this.firstRender) {
        	this.invalidateRendererHeight();
        	this.renderer.invalidateSizing();
        	return;
        }

    	this.firstRender = true;
        //this.renderer.setItems([]);

        this.gotoPage(0, "silent");
    };

    Paginator.THRESHOLD = 2;
    Paginator.PADDING = 2;
    Paginator.prototype._generateLIs = function (from, to, enableDot) {
        var count = to - from + 1;
        if (enableDot && count - 2 * Paginator.PADDING > Paginator.THRESHOLD) {
            var html = this._generateLIs(from, from + Paginator.PADDING, false);
            html += "<li><a>...</a></li>"; //dot
            html += this._generateLIs(to - Paginator.PADDING, to, false);
            return html;
        } else {
            var html = "";
            for (var i = Math.max(0, from); i < Math.min(to, this.totalPages); i ++) {
                html += "<li";
                if (i == this.currentPage) {
                    html += " class=\"active\"";
                }
                html += "><a href=\"#\" role=\"" + i + "\">" + (i + 1) + "</a></li>";
            }

            return html;
        }
    };
    Paginator.prototype._generateButtons = function (from, to, enableDot) {
        var count = to - from + 1;
        if (enableDot && count - 2 * Paginator.PADDING > Paginator.THRESHOLD) {
            var html = this._generateButtons(from, from + Paginator.PADDING, false);
            html += "<button type=\"button\"><span>...</span></button>"; //dot
            html += this._generateButtons(to - Paginator.PADDING, to, false);
            return html;
        } else {
            var html = "";
            for (var i = Math.max(0, from); i < Math.min(to, this.totalPages); i ++) {
                html += "<button type=\"button\" role=\"" + i + "\"";
                if (i == this.currentPage) {
                    html += " class=\"active\"";
                }
                html += "><span>" + (i + 1) + "</span></button>";
            }

            return html;
        }
    };
    Paginator.prototype._updateUI = function () {
        if (this.options.useButtons) {
            this._updateButtonUI();
            return;
        }
        var id = widget.random();
        var html = "";

        if (this.options && this.options.withoutStatus) {
            html = "<div class=\"ResultInfo\">" +
            "<div>" +
            "<ul class=\"pagination\" id=\"" + id + "\">";
        } else {
            html = "<div class=\"ResultInfo row\"><div><p class=\"Status\">" + (this.options && this.options.getTotalItemText ? this.options.getTotalItemText(this.totalItems) : "") + "</p></div>" +
            "<div>" +
            "<ul class=\"pagination\" id=\"" + id + "\">";
        }

        html += "<li";
        if (this.currentPage == 0) {
            html += " class=\"disabled\"";
        }

        html += "><a href=\"#\" role=\"prev\">&laquo;</a></li>";

        html += this._generateLIs(0, this.currentPage, true);
        html += this._generateLIs(this.currentPage, this.totalPages, true);

        html += "<li";
        if (this.currentPage == this.totalPages - 1) {
            html += " class=\"disabled\"";
        }

        html += "><a href=\"#\" role=\"next\">&raquo;</a></li>";
        html += "</ul></div></div>";
        this.container.innerHTML = html;
        this.list = document.getElementById(id);
        this.list._p = this;
        Dom.registerEvent(this.list, "click", paginatorClickHandler, false);
    };
    Paginator.prototype._updateButtonUI = function () {
        var id = widget.random();
        var html = "";

        html += "<div class=\"pagination\" id=\"" + id + "\"><div class=\"ButtonGroup\">";

        html += "<button type=\"button\" role=\"prev\"";
        if (this.currentPage == 0) {
            html += " disabled=\"true\"";
        }

        html += "><span>&#171;</span></button>";

        html += this._generateButtons(0, this.currentPage, true);
        html += this._generateButtons(this.currentPage, this.totalPages, true);

        html += "<button type=\"button\" role=\"next\"";
        if (this.currentPage == this.totalPages - 1) {
            html += " disabled=\"true\"";
        }

        html += "><span role=\"next\">&#187;</span></button>";
        html += "</div></div>";

        this.container.innerHTML = html;
        this.list = document.getElementById(id);
        this.list._p = this;
        Dom.registerEvent(this.list, "click", paginatorClickHandler, false);
    };
    Paginator.prototype.getSelectionCount = function () {
        if (!this.renderer) return 0;
        if (!this.renderer.isSelectAll()) {
            return this.selectedItems.length;
        } else {
            return this.totalItems;
        }
    };
    Paginator.prototype.getSelectedItems = function (callback, forceSelectAll) {
    	if (!callback) {
    		return this.selectedItems;
    	}
        if ((typeof(forceSelectAll) == "undefined"
            || forceSelectAll == null)&& !this.renderer.isSelectAll()) {
            callback(this.selectedItems);
        } else {
            if (this.source == null) {
                callback([]);
                return;
            }
            if (this._allItems) {

                callback(this._allItems);
                return;
            }
            var total = this.totalItems;
            var chunk = 100;
            var items = [];
            var thiz = this;
            var index = 0;
            var next = function () {
                thiz.source.loadPage(index, chunk, function (results, totalItems) {
                    for (var i = 0; i < results.length; i ++) {
                        items.push(results[i]);
                    }
                    total = totalItems;
                    index ++;
                    if (items.length < total && results.length > 0) {
                        next();
                    } else {
                        defaultIndicator.done();
                        //console.log("Done loading " + items.length + " items.");
                        thiz._allItems = items;
                        callback(items);
                    }
                }, function (error) {
                    console.error(error);
                    defaultIndicator.done();
                });
            };
            defaultIndicator.busy("Fetching data list...");
            next();
        }
    };


    return Paginator;
}();
