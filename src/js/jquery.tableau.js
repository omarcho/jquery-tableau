(function (factory) {
    "use strict";

    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['tableau-manager','jquery', 'jquery-ui'], function (TableauManager, $) {
            return factory(TableauManager, $, window, document);
        });
    }
    else {
        // Browser
        factory(TableauManager, jQuery, window, document);
    }
}
(function (TableauManager, $, window, document) {
    

    $.widget("custom.tableau", {

        _create: function () {
            var defaults = {
            }
            this.options = (this.options) ? $.extend(defaults, this.options) : defaults;
            this.api = new TableauManager(this.element[0], this.options);
            this.api.init();
        },
		setOptions: function (options) {
            this.api.setOptions(options);

        },
        select: function (sel) {
            this.api.select(sel);

        },
        filter: function (sel) {
            this.api.filter(sel);

        },

        getFilters: function () {
            return this.api.getFilters();

        },
        parameter: function (sel) {
            this.api.parameter(sel);

        },
        getParameters: function () {
            return this.api.getParameters();

        },
        refresh: function () {
            this.api.refresh();

        },
        pauseRefreshInterval: function () {
            this.api.pauseRefreshInterval();
        },
		reload: function (){
			this.api.reload();
		},
        destroy: function () {

        }
    });
}));