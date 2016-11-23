 $(document).ready(function() {
		var Model = function (){
			var today = new Date();
			this.sDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
			this.eDate = new Date(today.getFullYear()+9, today.getMonth(), today.getDate());
			this.maxDate = new Date(today.getFullYear()+5, today.getMonth(), today.getDate());
			
		};
		var model = new Model();
		var sd = $("#s-date").periodSelector({ 
				value: model.sDate, 
				maxDate: model.eDate, 
				change: function(date){
					model.sDate=date;
					ed.periodSelector("minDate", date);
				}, 
				quarterSelector:true, 
				monthSelector:true,
				nextBtnClass:'btn-primary'
		});
		var ed = $("#e-date").periodSelector({ 
				value: model.eDate, 
				maxDate: model.maxDate, 
				change: function(date){
					model.eDate = date;
					sd.periodSelector("maxDate", date);
				}, 
				quarterSelector:false, 
				monthSelector:true
		});
		$(document).on("period-selector.change", function (evt, date){
			console.log("Change to " + date.toString());
			var span = $("#" + evt.target.parentElement.id + "-text");
			span.html(date.toString());
		})
		
	} );

