(function (factory) {
    "use strict";

    if (typeof define === 'function' && define.amd) {
        // AMD
        define('tableau-manager',['jquery', 'tableau'], function ($) {
            return factory($, window, document);
        });
    }
    else {
        // Browser
        factory(jQuery, window, document);
    }
}
(function ($, window, document) {
    TableauManager = function (element, options) {
        var self = this;
        var defaultOptions = {
            getSelectedMarksEnabled: false,
            getFiltersEnabled: false,
            filtersCallback: null,
            selectMarksCallback: null
        };
        self.options = $.extend(defaultOptions, options);
        self.element = element;
        self.marks = null;
        self.selectedMarks = null;
        self.filters = null;
        self.selectedFilters = null;
        self.initialized = false;


        var enqueuedCallbacks = [];
        var enqueueActions = function (callback, arguments, owner) {
            enqueuedCallbacks.push({ callback: callback, arguments: arguments, owner: owner });
        };
        var getOption = function (name, def) {
            if (self.options == null || self.options[name] == null) {
                return def;
            }
            return self.options[name];
        };
        var callback = function (func, thisObject, parameters) {
            return func.apply(thisObject, parameters);
        };
        var queueActions = function () {
            if (self.marks != null) {
                select.apply(self, [self.marks]);
            }
            if (self.filters != null) {
                filter.apply(self, [self.filters]);
            }
            for (var i = 0; i < enqueuedCallbacks.length; i++) {
                var func = enqueuedCallbacks[i];
                var owner = func.owner ? func.owner : self;
                var arg = func.arguments;
                func.callback.apply(owner, arg);
            }
            enqueuedCallbacks = [];
        };
        var onError = function (event) {

            $(self.element).trigger("jquery.tableau.onerror", [event]);


        };
        var onSelectMarksChange = function (marks) {
            var getSelectedMarksEnabled = getOption("getSelectedMarksEnabled", false);
            if (!getSelectedMarksEnabled) { return false; }
			//var wb = self.Viz.getWorkbook();
			var ws = marks.getWorksheet();
			ws.getSelectedMarksAsync().then(
				function (marks) {
					if(marks.length > 0){
						onSelectMarks.apply(self, [marks, this.getName()]);
					}
					
				}.bind(ws)
			).otherwise(
				function (error) {
					onError(error);
				});
		
        };
        var onSelectMarks = function (marks, wsName) {
            var selectMarksCallback = getOption("selectMarksCallback", null);
            self.selectedMarks = [];

            for (var i = 0; i < marks.length; i++) {
                var m = marks[i];
                var pairs = m.getPairs();
                self.selectedMarks.push(pairs);
            }
            if (selectMarksCallback != null) {
                callback(selectMarksCallback, self, [self.selectedMarks]);
            }
			$(self.element).trigger("jquery.tableau.markschange", [self.selectedMarks, wsName]);
        };

        var getParameters = function () {
            if (!self.initialized) {
                enqueueActions(getParameters, arguments);
                return;
            }
            var wb = self.Viz.getWorkbook();
            wb.getParametersAsync().then(
                        function (parameters) {
                            callback(onParameters, self, [parameters, this.getName()]);
                        }.bind(wb)
                    ).otherwise(
                        function (error) {
                            onError(error);
                        });
        };
        var onParameters = function (parameters, wsName) {

            $(self.element).trigger("jquery.tableau.getparameters", [parameters, wsName]);

        };
        var parameter = function (data) {

            if (!self.initialized) { return false; }
            var wb = self.Viz.getWorkbook();
            for (var i = 0; i < data.length; i++) {
                var m = data[i];
                wb.changeParameterValueAsync(m.fieldName, m.value)
                        .otherwise(function (error) {
                            onError(error);
                        });
            }
        };

        var getFilters = function () {
            if (!self.initialized) {
                enqueueActions(getFilters, arguments);
                return;
            }

            var active = self.Viz.getWorkbook().getActiveSheet();
            // TODO: ¿Como me determino mejor que la hoja activa es un dashboard?
            var worksheets = active.getWorksheets != null ? active.getWorksheets() : [active];
            for (var i = 0; i < worksheets.length; i++) {
                var ws = worksheets[i];
                ws.getFiltersAsync().then(
                        function (filters) {
							if(filters.length > 0){
								callback(onFilters, self, [filters, this.getName()]);
							}
                        }.bind(ws)
                    ).otherwise(
                        function (error) {
                            onError(error);
                        });
            }
        };
        var onFiltersChange = function (viz) {
            if (!self.initialized) { return; }

            var getFiltersEnabled = getOption("getFiltersEnabled", false);
            if (!getFiltersEnabled) { return false; }
            return getFilters();
        };
        var onFilters = function (filters, wsName) {
            var filtersCallback = getOption("filtersCallback", null);
            self.selectedFilters = [];
            for (var i = 0; i < filters.length; i++) {

                var f = filters[i];


                //if(f.$type == "categorical"){
                //var filter = { caption: f.$caption, fieldName: f.$field, value: f.getAppliedValues() };
                self.selectedFilters.push(f);
                //}

            }
            if (filtersCallback != null) {
                filtersCallback.apply(self, [self.selectedFilters, wsName]);
            }
            $(self.element).trigger("jquery.tableau.filterchange", [self.selectedFilters, wsName]);

        };

        var onFirstInteractive = function (viz) {
            self.initialized = true;
            var loadCompleteCallback = getOption("loadCompleteCallback", null);
            
            if (loadCompleteCallback != null) {
                loadCompleteCallback.apply(self);
            }
            $(self.element).trigger("jquery.tableau.loadcomplete", [self])

            queueActions();
        };

        var refresh = function () {
            if (!self.pauseInterval) {
                self.pauseInterval = false;
                self.Viz.refreshDataAsync();
            }

        };
        var pauseRefreshInterval = function () {
            self.pauseInterval = true;
        };
        //applyFilterAsync( 
        //    fieldName: string, 
        //values: object[] or object, 
        //updateType: FilterUpdateType, 
        //options?: FilterOptions)

        var filter = function (data) {

            if (!self.initialized) { return false; }
            var active = self.Viz.getWorkbook().getActiveSheet();
            // TODO: ¿Como me determino mejor que la hoja activa es un dashboard?
            var worksheets = active.getWorksheets != null ? active.getWorksheets() : [active];
            for (var i = 0; i < worksheets.length; i++) {
                var ws = worksheets[i];
                for (var j = 0; j < data.length; j++) {
                    var m = data[j];
                    ws.applyFilterAsync(m.fieldName, m.value, 
						m.value === "" ?
							tableau.FilterUpdateType.ALL:
							tableau.FilterUpdateType.REPLACE)
                        .otherwise(function (error) {
                            onError(error);
                        });
                }

            }
        };
        var select = function (data) {

            if (!self.initialized) { return false; }
            var active = self.Viz.getWorkbook().getActiveSheet();
            // TODO: ¿Como me determino mejor que la hoja activa es un dashboard?
            var worksheets = active.getWorksheets != null ? active.getWorksheets() : [active];
            for (var i = 0; i < worksheets.length; i++) {
                var ws = worksheets[i];
                for (var j = 0; j < data.length; j++) {
                    var m = data[j];
                    ws.selectMarksAsync(m.fieldName, m.value, tableauSoftware.FilterUpdateType.REPLACE).otherwise(function (error) {
                        onError(error);
                    });
                }

            }
        };
		
		self.setOptions = function (opts){
			self.options = $.extend(self.options, opts);
		};
        self.pauseRefreshInterval = pauseRefreshInterval;
        self.refresh = refresh;
        self.select = function (data) {
            self.marks = data;
            if (self.initialized) {
                select.apply(self, [data]);
            }

        };
        self.filter = function (data) {
            self.filters = data;
            if (self.initialized) {
                filter.apply(self, [data]);
            }

        };
        self.parameter = function (data) {
            self.parameters = data;
            if (self.initialized) {
                parameter.apply(self, [data]);
            } else {
                enqueueActions(parameter, arguments);
            }
        };
        self.getParameters = getParameters;
        self.getFilters = getFilters;
        self.init = function () {

            var self = this;
            var turl = getOption("url");
            var params = {
                "host_url": turl,
                // Cuando el reporte está listo para interactuar.
                "onFirstInteractive": onFirstInteractive
            };
            $.extend(params, getOption("params"));

            self.Viz = new tableau.Viz(self.element, turl, params);
            self.Viz.addEventListener(tableauSoftware.TableauEventName.FILTER_CHANGE, onFiltersChange);

            self.Viz.addEventListener(tableauSoftware.TableauEventName.MARKS_SELECTION, onSelectMarksChange);
            //self.Viz.addEventListener(tableauSoftware.TableauEventName.CUSTOM_VIEW_LOAD, onFirstInteractive);

            // Se puede especificar un tiempo de refresco de los datos.
            var refreshInterval = getOption("refreshInterval", -1);
            if (refreshInterval != -1) {
                // Refresco la data cada determinado tiempo.
                setInterval(refresh, refreshInterval);
            }

        };
		self.reload = function (){
			if(self.Viz){
				self.Viz.dispose();	
			}
			self.init();
		}

    };

	return TableauManager;
}));
