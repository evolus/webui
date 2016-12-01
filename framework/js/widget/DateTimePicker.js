function DateTimePicker() {
    BaseTemplatedWidget.call(this);

    this.pickerPopup.setPopupClass("DateTimePickerPopup");

    function leftPad2(s) {
        s = "" + s;
        while (s.length < 2) s = "0" + s;
        return s;
    }

    this.bind("click", function () {
        var m = this._getMoment() || moment();

        this.lastSelectedMoment = moment(m);
        this.gotoMonth(m.month(), m.year());

        if (this.withTime()) {
            this.hourInput.value = m.format(this.use24h() ? "HH" : "hh");
            this.minuteInput.value = m.format("mm");
            this.secondInput.value = m.format("ss");
        }

        Dom.toggleClass(this.timeRow, "Disabled", !this.withTime());
        Dom.toggleClass(this.timeRow, "WithoutMinute", !this.withMinute());
        Dom.toggleClass(this.timeRow, "WithoutSecond", !this.withSecond());
        Dom.toggleClass(this.timeRow, "Use24H", this.use24h());

        if (!this.inputConfigured) {
            Util.enforceNumberInput(this.hourInput, true, 0, this.use24h() ? 23 : 12, 2);
            Util.enforceNumberInput(this.minuteInput, true, 0, 59, 2);
            Util.enforceNumberInput(this.secondInput, true, 0, 59, 2);
            Util.enforceNumberInput(this.yearInput, true, 0, 5000, 4);
            this.inputConfigured = true;
        }

        this.pickerPopup.toggle(this.input, "left-inside", "bottom", 0, 5, "autoFlip");
    }, this.pickerButton);

    this.bind("click", function () {
        var m = this.month - 1;
        var y = this.year;
        if (m < 0) {
            m = 11;
            y --;
        }

        this.gotoMonth(m, y);
    }, this.prevMonthButton);
    this.bind("click", function () {
        var m = this.month + 1;
        var y = this.year;
        if (m > 11) {
            m = 0;
            y ++;
        }

        this.gotoMonth(m, y);
    }, this.nextMonthButton);
    this.bind("click", function (event) {
        var m = Dom.findUpwardForData(event.target, "_moment");
        if (!m) return;
        if (this.withTime()) {
            this.lastSelectedMoment = m;
            this.invalidate();
        } else {
            this._setMoment(m);
            this.pickerPopup.hide();
        }
    }, this.dayGrid);


    this.bind("p:PopupShown", function () {
        this.header.setAttribute("active", true);
    }, this.monthInput);
    this.bind("p:PopupHidden", function () {
        this.header.removeAttribute("active");
    }, this.monthInput);

    this.bind("focus", function () {
        this.header.setAttribute("focused", true);
    }, this.yearInput);
    this.bind("blur", function () {
        this.header.removeAttribute("focused");
    }, this.yearInput);


    this.bind("focus", function () {
        this.header.setAttribute("focused", true);
    }, this.monthInput.node());
    this.bind("blur", function () {
        this.header.removeAttribute("focused");
    }, this.monthInput.node());

    this.bind("p:ItemSelected", function () {
        this.gotoMonth(this.monthInput.getSelectedItem(), this.year);
        this.monthInput.node().focus();
    }, this.monthInput);

    this.bind("keypress", function (event) {
        if (this.pendingYearInputTimeout) window.clearTimeout(this.pendingYearInputTimeout);
        this.pendingYearInputTimeout = window.setTimeout(function () {
            this.gotoMonth(this.month, parseInt(this.yearInput.value, 10));
        }.bind(this), 300);
    }, this.yearInput);

    this.monthInput.comparer = sameRelax;
    this.monthInput.renderer = function (m) {
        return moment.months()[m];
    };
    this.monthInput.setItems([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);

    this.firstWeekDay = 0;

    for (var i = 0; i < 7; i ++) {
        var wd = (i + this.firstWeekDay) % 7;
        var span = document.createElement("span");
        span.innerHTML = Dom.htmlEncode(moment.weekdaysShort(wd));
        this.weakDayRow.appendChild(span);
        span.setAttribute("flex", "1");
        span.setAttribute("wd", "" + wd);
        span._weekDay = wd;
    }

    this.days = [];
    for (var k = 0; k < 6; k ++) {
        var row = document.createElement("hbox");
        this.dayGrid.appendChild(row);
        for (var i = 0; i < 7; i ++) {
            var wd = (i + this.firstWeekDay) % 7;

            var span = document.createElement("span");
            span.innerHTML = "" + (k * 7 + i + 1);
            span.setAttribute("flex", "1");
            span._weekDay = i;
            span._dayIndex = k * 7 + i;
            span.setAttribute("wd", "" + wd);
            row.appendChild(span);

            this.days.push(span);
        }
    }

    this.amInput.renderer = function (s) {
        return s.toUpperCase();
    };
    this.amInput.comparer = sameRelax;
    this.amInput.setItems(["am", "pm"]);

    this.bind("click", function () {
        var m = moment(this.lastSelectedMoment);
        m.hour(parseInt(this.hourInput.value, 10) + (!this.use24h() && this.amInput.getSelectedItem() == "pm" ? 12 : 0));
        m.minute(this.withMinute() ? parseInt(this.minuteInput.value, 10) % 60 : 0);
        m.second(this.withSecond() ? parseInt(this.secondInput.value, 10) % 60 : 0);

        this._setMoment(m);
        this.pickerPopup.hide();
    }, this.selectButton);
}

__extend(BaseTemplatedWidget, DateTimePicker);


DateTimePicker.prototype.getTemplatePrefix = function () {
    return "js/widget/";
};

DateTimePicker.prototype.withTime = function () {
    return this.getFormat().toLowerCase().indexOf("h") >= 0;
};
DateTimePicker.prototype.use24h = function () {
    return this.getFormat().indexOf("H") >= 0;
};
DateTimePicker.prototype.withMinute = function () {
    return this.getFormat().indexOf("m") >= 0;
};
DateTimePicker.prototype.withSecond = function () {
    return this.getFormat().indexOf("s") >= 0;
};

DateTimePicker.prototype.gotoMonth = function (month, year) {
    this.month = month;
    this.year = year;

    this.invalidate();
};
DateTimePicker.prototype.getFormat = function () {
    var javaFormat = this.format || DateTimePicker.GLOBAL_FORMAT || "MM/dd/yyyy";
    var momentFormat = javaFormat.replace(/([^ :\/]+)/g, function (zero, term) {
        if (term == "dd") return "DD";
        if (term == "MM") return "MM";
        if (term == "yy") return "YY";
        if (term == "yyyy") return "YYYY";
        if (term == "h") return "hh";
        if (term == "mm") return "mm";
        if (term == "a") return "a";
        if (term == "HH") return "HH";
        if (term == "ss") return "ss";
        if (term == "MMM") return "MMM";
        if (term == "EEE") return "ddd";

        return term;
    });

    return momentFormat;
};
DateTimePicker.prototype._getMoment = function () {
    var format = this.getFormat();
    var m = moment(this.input.value, format);
    return m.isValid() ? m : null;
};
DateTimePicker.prototype.getDate = function () {
    var m = this._getMoment();
    if (!m) return null;
    return m.toDate();
};
DateTimePicker.prototype.invalidate = function () {
    var m = moment({year: this.year, month: this.month, date: 1, hour: 0, minute: 0, second: 0, milisecond: 0});
    var padding = (m.day() - this.firstWeekDay + 7) % 7;
    m.subtract(padding, "days");

    var current = this.lastSelectedMoment || this._getMoment();
    var today = moment();

    for (var i = 0; i < this.days.length; i ++) {
        var span = this.days[i];
        span.innerHTML = m.date();
        span._moment = moment(m);

        Dom.toggleClass(span, "Inactive", m.month() != this.month);
        Dom.toggleClass(span, "Current", current != null && current.isSame(m, "day"));
        Dom.toggleClass(span, "Today", today.isSame(m, "day"));

        m.add(1, "days");
    }

    this.monthInput.selectItem(this.month);
    this.monthDisplay.innerHTML = Dom.htmlEncode(this.monthInput.renderer(this.month)) + " " + this.year;

    this.yearInput.value = "" + this.year;
};
DateTimePicker.prototype.setDate = function (date) {
    if (date) {
        this.input.value = moment(date).format(this.getFormat());
    } else {
        this.input.value = "";
    }
};
DateTimePicker.prototype._setMoment = function (m) {
    if (m) {
        this.input.value = m.format(this.getFormat());
    } else {
        this.input.value = "";
    }
};
