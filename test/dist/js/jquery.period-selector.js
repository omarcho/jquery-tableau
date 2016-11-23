(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
	    // AMD
        
	    define('period-selector',["jquery", "jquery-ui"], function ($) {
	        return factory($, window, document);
	        
		} );
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {


    /**
    * PeriodSelector
    **/
    PeriodSelector = function (options) {
        
        var that = this;
        this.options = this.getDefaultOptions();
        if (options) {
            $.extend(this.options, options);
        }
        var date = this.getOptions("value");

        this.ui = $("<div class='input-group period-selector'></div>");
        this.ui.addClass("period-selector");

        this.nextBut = $("<span class='input-group-btn'><button type='button' class='btn' title='Next'><i class='glyphicon glyphicon-chevron-right'></i></button></span>");
        this.prevBut = $("<span class='input-group-btn'><button type='button' class='btn' title='Previous'><i class='glyphicon glyphicon-chevron-left'></i></button></span>");
		
		this.nextBut.children("button").addClass(this.getOptions("nextBtnClass"));
		this.prevBut.children("button").addClass(this.getOptions("prevBtnClass"));
        this.months = this.createMonths();
        this.quarters = this.createQuarters();
        this.years = this.createYears();
 
        

        this.ui.append(this.prevBut);

        this.container = $("<div class='select-container' />");
        this.ui.append(this.container);
        this.container.append(this.months);
        this.container.append(this.quarters);
        this.container.append(this.years);


        //this.ui.append(this.container);
        this.ui.append(this.nextBut);
        this.setDate(date);

        this.prevBut.on("click",
            function () {
                that.movePrev();
            });
        this.nextBut.on("click",
            function () {
                that.moveNext();
            });


    }
    
    PeriodSelector.prototype.show = function () {
        this.ui.show();
    }
    PeriodSelector.prototype.hide = function () {
        this.ui.hide();
    }

    PeriodSelector.prototype.setDate = function (date) {
        this.selectedDate = date;
        this.refresh();
    }
    PeriodSelector.prototype.getDate = function () {
        return this.selectedDate;
    }
    PeriodSelector.prototype.refresh = function (date) {
        if (this.selectedDate == null) { return; }
        var monthSel = this.getOptions("monthSelector");
        var quarterSel = this.getOptions("quarterSelector");
        var yearSel = this.getOptions("yearSelector");
        //this.removeSelector(this.months);
        //this.removeSelector(this.quarters);
        //this.removeSelector(this.years);
        var widthCount = 0;


        if (monthSel) {
            this.ui.addClass("monthSel");
            //this.months.show();
            this.addMonthsOptions(this.months);
            widthCount++;
        } else {
            this.ui.removeClass("monthSel");
            //this.months.hide();
        }
        if (quarterSel) {
            this.ui.addClass("quarterSel");
            //this.quarters.show();
            this.addQuartersOptions(this.quarters);
            widthCount++;
        } else {
            //this.quarters.hide();
            this.ui.removeClass("quarterSel");
        }
        if (yearSel) {
            this.ui.addClass("yearSel");
            //this.years.show();
            this.addYearsOptions(this.years);
            widthCount++;
        } else {
            //this.years.hide();
            this.ui.removeClass("yearSel");
        }
        this.ui.addClass("selcount-" + widthCount);
        this.ui.attr("title", this.getValueFormatted(true));
    }

    PeriodSelector.prototype.updateDate = function (mode) {
        var month = this.getSelectedMonth();
        var quarter = this.getSelectedQuarter();
        var year = this.getSelectedYear();
        var monthSelector = this.getOptions("monthSelector");
    
        if (mode == "quarter") {
            this.selectedDate.setMonth((quarter * 3) - 1);
        }
        if (mode == "month") {
            this.selectedDate.setMonth(month);
        }
       
        this.selectedDate.setFullYear(year);
        this.checkMinMax();
        this.dispatchChange();
        this.refresh();
    }
    PeriodSelector.prototype.checkMinMax = function () {
        if (this.selectedDate == null) { return; }
        var maxDate = this.getOptions("maxDate");
        var minDate = this.getOptions("minDate");
        // Validate that months aren't out of min and max.
        if (maxDate.getFullYear() == this.selectedDate.getFullYear()
           && this.selectedDate.getMonth() > maxDate.getMonth()) {
            this.selectedDate.setMonth(maxDate.getMonth());
        }
        if (minDate.getFullYear() == this.selectedDate.getFullYear()
           && this.selectedDate.getMonth() < minDate.getMonth()) {
            this.selectedDate.setMonth(minDate.getMonth());
        }
    }
    PeriodSelector.prototype.dispatchChange = function () {
        var f = this.getOptions("change");
        if (f != null) {
            f(this.selectedDate);
        }
		this.ui.trigger("period-selector.change", [this.selectedDate]);
    }
    PeriodSelector.prototype.dispatchMonthChange = function () {
        var f = this.getOptions("monthChange");
        if (f != null) {
            f(this.getSelectedMonth(), this.selectedDate);
        }
		this.ui.trigger("period-selector.monthChange", [this.selectedDate]);
    }
    PeriodSelector.prototype.dispatchQuarterChange = function () {
        var f = this.getOptions("quarterChange");
        if (f != null) {
            f(this.getSelectedQuarter(), this.selectedDate);
        }
		this.ui.trigger("period-selector.quarterChange", [this.selectedDate]);
    }
    PeriodSelector.prototype.dispatchYearChange = function () {
        var f = this.getOptions("yearChange");
        if (f != null) {
            f(this.getSelectedYear(), this.selectedDate);
        }
		this.ui.trigger("period-selector.yearChange", [this.selectedDate]);
    }
    PeriodSelector.prototype.getSelectedMonth = function () {
        if (!this.months) {
            return this.selectedDate.getMonth();
        }
        var select = this.months[0];
        var ret = select.value;
        return ret;
    }
    PeriodSelector.prototype.normalizeMonthToQuarter = function (month) {
        return (parseInt((month) / 3)) * 3;
    }
    PeriodSelector.prototype.convertMonthToQuarter = function (month) {
        month = this.normalizeMonthToQuarter(month);
        return parseInt(month / 3) + 1;
    }
    PeriodSelector.prototype.getSelectedQuarter = function () {
        if (!this.quarters) {
            var month = this.selectedDate.getMonth();
            var quarter = this.normalizeMonthToQuarter(month);
            return quarter;
        }
        var select = this.quarters[0];
        var ret = select.value;
        return ret;
    }
    PeriodSelector.prototype.getSelectedYear = function () {
        if (!this.years) {
            return this.selectedDate.getFullYear();
        }
        var select = this.years[0];
        var ret = select.value;
        return ret;
    }
    //PeriodSelector.prototype.removeSelector = function (selector){
    //    if(selector){
    //        selector.detach();
    //        selector.remove();
    //    }
    //}
    PeriodSelector.prototype.getDefaultOptions = function () {
        var maxDate = new Date();
        var minDate = new Date();
        minDate.setFullYear(maxDate.getFullYear() - 6)
        minDate.setMonth(0);
        return {
            "monthSelector": true,
            "quarterSelector": true,
            "yearSelector": true,
            "monthChange": null,
            "yearChange": null,
            "quarterChange": null,
            "change": null,
            "maxDate": maxDate,
            "minDate": minDate,
            //"years":6,
            "longMonthNames": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], // Names of months for drop-down and formatting
            "monthNames": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], // For formatting
            "quarterNames": ["Q1", "Q2", "Q3", "Q4"],
            "longQuarterNamnes": ["Quarter 1", "Quarter 2", "Quartes 3", "Quarter 4"],
			"nextBtnClass":"btn btn-default",
			"prevBtnClass":"btn btn-default"
        }
    }
    PeriodSelector.prototype.getValueFormatted = function (longName) {
        longName = typeof (longName) == "undefined" ? true : longName;
        var monthSel = this.getOptions("monthSelector");
        var quarterSel = this.getOptions("quarterSelector");
        var yearSel = this.getOptions("yearSelector");
        var text = "";
        if (monthSel) {
            text = this.getMonthFormatted(longName);
        } else if (quarterSel) {
            text = this.getQuarterFormatted(longName);
        } else if (yearSel) {
            text = this.getYearFormatted(longName);
        } else {
            text = this.selectedDate.toDateString();
        }
        return text;
    }
    PeriodSelector.prototype.getMonthFormatted = function (longName) {
        longName = typeof (longName) == "undefined" ? true : longName;
        var month = this.selectedDate.getMonth();
        var year = longName ? this.selectedDate.getFullYear() : parseInt(this.selectedDate.getFullYear().toString().substr(2, 2));
        var monthNames = this.getOptions(longName ? "longMonthNames" : "monthNames");
        return longName ? monthNames[month] + " " + year.toString() : monthNames[month] + ", " + year.toString();
    }
    PeriodSelector.prototype.getQuarterFormatted = function (longName) {
        longName = typeof (longName) == "undefined" ? true : longName;
        var year = longName ? this.selectedDate.getFullYear() : parseInt(this.selectedDate.getFullYear().toString().substr(2, 2));
        var month = this.selectedDate.getMonth();
        var quarter = this.convertMonthToQuarter(month);
        var quarterNames = this.getOptions(longName ? "longQuarterNames" : "quarterNames");
        return longName ? quarterNames[quarter - 1] + " " + year.toString() : quarterNames[quarter - 1] + ", " + year.toString();
    }
    PeriodSelector.prototype.getYearFormatted = function (longName) {
        longName = typeof (longName) == "undefined" ? true : longName;
        var year = longName ? this.selectedDate.getFullYear() : parseInt(this.selectedDate.getFullYear().toString().substr(2, 2));
        return year.toString();
    }
    PeriodSelector.prototype.getOptions = function (name, defaultValue) {
        var ret = this.options[name];
        if (typeof ret == "undefined") {
            ret = defaultValue;
        }
        return ret;
    }
    PeriodSelector.prototype.createMonths = function () {
        // TODO: How to do this method private?
        var list = $("<select class='form-control monthSel'></select>")
        list.addClass("months-list");

        var that = this;
        list.on("change",
            function (e) {
                that.updateDate("month");
                that.dispatchMonthChange();
            });
        return list;
    }
    PeriodSelector.prototype.addMonthsOptions = function (list) {
        // TODO: How to do this method private?
        if (!list) { return }
        list.empty();
        var maxDate = this.getOptions("maxDate");
        var minDate = this.getOptions("minDate");
        var max = this.selectedDate.getFullYear() == maxDate.getFullYear() ? maxDate.getMonth() + 1 : 12;
        var min = this.selectedDate.getFullYear() == minDate.getFullYear() ? minDate.getMonth() : 0;
        var names = this.getOptions("monthNames");

        for (var i = max - 1; i >= min; i--) {
            var option = $("<option>" + names[i] + "</option>");
            option.attr("value", i);
            if (this.selectedDate.getMonth() == i) {
                option.attr("selected", true);
            }
            list.append(option);
        }
    }
    PeriodSelector.prototype.createQuarters = function () {
        // TODO: How to do this method private?
        var list = $("<select class='form-control quarterSel'></select>")
        list.addClass("quarter-list");
        var that = this;
        list.on("change",
            function (e) {
                that.updateDate("quarter");
                that.dispatchQuarterChange();
            });
        return list;
    }
    PeriodSelector.prototype.addQuartersOptions = function (list) {
        // TODO: How to do this method private?
        if (!list) { return }
        list.empty();
        var maxDate = this.getOptions("maxDate");
        var minDate = this.getOptions("minDate");
        var max = this.selectedDate.getFullYear() == maxDate.getFullYear() ? this.convertMonthToQuarter(maxDate.getMonth()) - 1 : 3;
        var min = this.selectedDate.getFullYear() == minDate.getFullYear() ? this.convertMonthToQuarter(minDate.getMonth()) - 1 : 0;
        var names = this.getOptions("quarterNames");
        for (var i = max; i >= min; i--) {
            var option = $("<option>" + names[i] + "</option>");
            if (this.convertMonthToQuarter(this.selectedDate.getMonth()) == i + 1) {
                option.attr("selected", true);
            }
            option.attr("value", i + 1);
            list.append(option);
        }
    }
    PeriodSelector.prototype.createYears = function () {
        // TODO: How to do this method private?
        var list = $("<select class='form-control yearSel'></select>")
        list.addClass("year-list");

        var that = this;
        list.on("change",
            function (e) {
                that.updateDate("month");
                that.dispatchYearChange();
            });
        return list;
    }
    PeriodSelector.prototype.addYearsOptions = function (list) {
        // TODO: How to do this method private?
        if (!list) { return }
        list.empty();
        var minDate = this.getOptions("minDate");
        var maxDate = this.getOptions("maxDate");
        var max = maxDate.getFullYear();
        var min = minDate.getFullYear();
		var isSelected = false;
        for (var i = max; i >= min; i--) {

            var option = $("<option>" + i + "</option>");
            if (this.selectedDate.getFullYear() == i) {
                option.attr("selected", true);
				isSelected = true;
            }
            option.attr("value", i);
            list.append(option);
        }
		// In case the year is not into values allowed we include this value in order to show the selected date correctly.
		if(!isSelected){
			var option = $("<option>(" + this.selectedDate.getFullYear() + ")</option>");
            option.attr("selected", true);
            option.attr("value", this.selectedDate.getFullYear());
            list.append(option);
		}
		
    }
    PeriodSelector.prototype.setOptions = function (options) {

        if (options && this.options) {
            $.extend(this.options, options);
        }
        if (this.options == null) {
            this.options = options;
        }
        this.checkMinMax();
        this.refresh();
    }

    PeriodSelector.prototype.moveNext = function () {
        this.move(1);
    }
    PeriodSelector.prototype.movePrev = function () {
        this.move(-1);
    }

    PeriodSelector.prototype.move = function (value) {
        var monthSel = this.getOptions("monthSelector");
        var quarterSel = this.getOptions("quarterSelector");
        var yearSel = this.getOptions("yearSelector");
        if (monthSel) {
            this.moveMonths(value);
            this.dispatchMonthChange();
            this.dispatchChange();
        } else if (quarterSel) {
			var qMonth = this.normalizeMonthToQuarter(this.selectedDate.getMonth()) + value * 3;
            var normalMonth = qMonth - this.selectedDate.getMonth();
			this.moveMonths(normalMonth);
            this.dispatchQuarterChange();
            this.dispatchChange();
        } else if (yearSel) {
            this.moveYears(value);
            this.dispatchYearChange();
            this.dispatchChange();
        }
        this.refresh();
    }

    PeriodSelector.prototype.moveMonths = function (value) {
        var next = this.selectedDate.getMonth();
        var nextYear = this.selectedDate.getFullYear();
        var maxDate = this.getOptions("maxDate");
        var minDate = this.getOptions("minDate");

        next = next + 1 * value;
        // Validate that selected date doesn't exceed the max allowed.
        if (this.selectedDate.getFullYear() == maxDate.getFullYear()
          && next > maxDate.getMonth()) {
            return;
        }
        // Validate that selected date doesn't exceed the min month.
        if (this.selectedDate.getFullYear() == minDate.getFullYear()
          && next < minDate.getMonth()) {
            return;
        }
        // In case it overpass 12 months we have to move it to the next year.
        if (next > 11 && this.canMoveYears(1)) {
            next = next - 12;
            nextYear++;
        }
        // Or we should move it to the previous year.
        if (next < 0 && this.canMoveYears(-1)) {
            next = 12 + next;
            nextYear--;
        }
        this.selectedDate.setMonth(next);
        this.selectedDate.setFullYear(nextYear);

    }

    PeriodSelector.prototype.canMoveYears = function (value) {
        //var years = this.getOptions("years");
        var nextYear = this.selectedDate.getFullYear() + 1 * value;

        var minDate = this.getOptions("minDate");
        var maxDate = this.getOptions("maxDate");

        var maxYear = maxDate.getFullYear();
        var minYear = minDate.getFullYear();


        // In case we overpass 12 months we have to move it to the next year.
        if (nextYear <= maxYear && nextYear >= minYear) {
            return true;
        }
        return false;
    }
    PeriodSelector.prototype.moveYears = function (value) {
        var nextYear = this.selectedDate.getFullYear();
        if (this.canMoveYears(value)) {
            nextYear = nextYear + value;
        }
        this.selectedDate.setFullYear(nextYear);
    }



    return PeriodSelector;
}));
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
	    // AMD
        
	    define('jquery.period-selector',["period-selector","jquery", "jquery-ui"], function (PeriodSelector, $) {
	        return factory(PeriodSelector, $, window, document);
	        
		} );
	}
	else {
		// Browser
		factory(PeriodSelector, jQuery, window, document );
	}
}(function( PeriodSelector, $, window, document, undefined ) {

    $.widget("custom.periodSelector",{
        period: null,
        _create: function (data) { 
            this.period = new PeriodSelector(this.options);
            this.element.append(this.period.ui);
        },
		value: function (date) {
            this.period.setDate(date);
        },
        minDate: function (date) {
            this.period.setOptions({ "minDate": date });
           
        },
        maxDate: function (date) {
            this.period.setOptions({ "maxDate": date });
            
        },
        change: function (func) {
            this.period.setOptions({ "change": func });
        },
        dispatchChange: function () {
            this.period.dispatchChange();
        },
        updateDate: function (mode) {
            this.period.updateDate(mode);
        },
        destroy: function () {

        }
    });
     
}));
