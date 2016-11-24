requirejs(["tableau-module"], function (){
	requirejs(['jquery', 'jquery.tableau'], function ($) {
		var showMarks = function (marks, selector){
			$marks = $(selector);
			$marks.empty();
			$.each(marks, function(i, mark){
				$.each(mark, function(i, item){
					$div = $("<div>");
					$div.addClass("row");
					$item = $("<div>");
					$item.addClass("col-lg-4");
					$item.html(item.fieldName);
					$div.append($item);
					
					$div.append($item.clone().html(item.formattedValue));
					$div.append($item.clone().html(item.value));
					
					$marks.append($div);
				});
			});
		};
		
		var fillFilter = function (filters, selector, wsName){
			$filters= $(selector);
			$filters.append("<h3>" + wsName + "</h3>");
			
			var $ws = $("#worksheets");
			//$filters.empty();
			var ret = [];
			$.each(filters, function(i, filter){
				if(filter.getFilterType()!= "categorical"){
					return;
				}
				var $select = $("<select>")
					.attr("id",filter.getFieldName())
					.addClass("form-control");
				$select.data(filter);
				ret.push($select);
				var $group = $("<div class='input-group'>")
				$filters.append($group);
				$group
					.append("<span class='input-group-addon'>" + filter.getFieldName() + "</span>")			
					.append($select);
					
				$but = $("<button type='button' class='btn btn-primary'>Go</button>")
					.data($select)
					.on("click", function(evt){
						var item = $(evt.target);
						$("#tableau-report")
							.tableau("filter", 
								[{fieldName: item.data().data().getFieldName(), value:item.data().val()}],
								$ws.val()
								);
					});
				;
				$group.append($("<span class='input-group-btn'>").append($but));
				$.each(filter.getAppliedValues().concat([{value:"",formattedValue:"[All]"}]), function(i, item){
					$opt = $("<option>").attr("value", item.value);
					if(item.value==""){$opt.attr("selected", "true")};
					$opt.html(item.formattedValue);
					$select.append($opt);
				});
				
			});
			return ret;
		};
		
		var selects = [];
		var $turlgasprice = $("#turl-report");
		var $gasprice = $("#tableau-report").tableau({
			
			url:$turlgasprice.val(),
			getSelectedMarksEnabled:true,
			
			params:{
				width:"100%",
				height: "500px",
				hideTabs: true,
			}
		})
			.on("jquery.tableau.markschange", function (evt, marks, wsName){
				
				showMarks(marks, "#marks-report");
				console.log("Worsheet: " + wsName);
				
				
			})
			.on("jquery.tableau.filterchange", function (evt, filters, wsName){
				
				
				console.log("Filters: " + wsName);
				
				selects = selects.concat(fillFilter(filters, "#filter-report", wsName));
				
				
			})
			.on("jquery.tableau.loadcomplete", function (){
				var $ws = $("#worksheets");
				
				
				$ws.empty();
				$.each($gasprice.tableau("getActiveWorksheets"), function (i, item){
					$ws.append("<option>"+item+"</option>");
				}
				);
			})
			;
			// Once report is loaded we setup the buttons.
				
			
			var $ws = $("#worksheets");
			$("#get-filter-report").on("click", function(){
				$("#filter-report").empty();
				selects = [];
				$gasprice.tableau("setOptions", {"getFiltersEnabled": true} );
				$gasprice.tableau("getFilters", $ws.val());
				$gasprice.tableau("setOptions", {"getFiltersEnabled": false} );
			});
			
			
			$("#reload-report").on("click", function(){
					
				$gasprice.tableau("setOptions", {url:$turlgasprice.val()});
				$gasprice.tableau("reload");
			});
		
	} );
});



