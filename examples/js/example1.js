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
		
		var fillFilter = function (filters, selector){
			$filters= $(selector);
			$filters.empty();
			var ret = [];
			$.each(filters, function(i, filter){
				var $select = $("<select>")
					.attr("id",filter.getFieldName())
					.addClass("form-control");
				$select.data(filter);
				ret.push($select);
				var $group = $("<div class='form-group'>")
				$filters.append($group);
				$group
					.append("<label for='"+filter.getFieldName()+"'>" + filter.getFieldName() + "</label>")			
					.append($select);
				$.each(filter.getAppliedValues().concat([{value:"",formattedValue:"[All]"}]), function(i, item){
					$opt = $("<option>").attr("value", item.value);
					$opt.html(item.formattedValue);
					$select.append($opt);
				});
				
			});
			return ret;
		};
		
		var selects = [];
		var $turlgasprice = $("#turl-gasprice");
		var $gasprice = $("#tableau-gasprice").tableau({
			
			url:$turlgasprice.val(),
			getSelectedMarksEnabled:true,
			
			params:{
				width:"100%",
				height: "500px",
				hideTabs: true,
			}
		})
			.on("jquery.tableau.markschange", function (evt, marks, wsName){
				
				showMarks(marks, "#marks-gasprice");
				console.log("Worsheet: " + wsName);
				
				
			})
			.on("jquery.tableau.filterchange", function (evt, filters, wsName){
				
				
				console.log("Filters: " + wsName);
				selects = fillFilter(filters, "#filter-gasprice");
				
				
			})
			.on("jquery.tableau.loadcomplete", function (){
				// Once report is loaded we setup the buttons.
				$("#get-filter-gasprice").on("click", function(){
					$gasprice.tableau("setOptions", {"getFiltersEnabled": true} );
					$gasprice.tableau("getFilters");
					$gasprice.tableau("setOptions", {"getFiltersEnabled": false} );
				});
				
				$("#filterby-gasprice").on("click", function(){
					$.each(selects, function (i, item){
						$gasprice.tableau("filter", [{fieldName: item.data().getFieldName(), value:item.val()}]);
					});
					
				});
				$("#reload-gasprice").on("click", function(){
						
					$gasprice.tableau("setOptions", {url:$turlgasprice.val()});
					$gasprice.tableau("reload");
				});
			})
			;
		
		
		
		// $("#tableau-bubbles").tableau({
			
			// url:"https://public.tableau.com/views/ConsumerSpending_2/ConsumerSpendingBubbles?:embed=y&:display_count=yes",
			// getSelectedMarksEnabled:true,
			// selectMarksCallback:function(marks){
				// showMarks(marks, "#marks-bubbles");
			// },
			// params:{
				// width:"100%",
				// height: "450px",
				// hideTabs: true,
			// }
		// });
		
	} );
});



