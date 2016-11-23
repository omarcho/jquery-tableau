# jquery.period-selector


## Features

This is a datatables.net plugin that able to filter for each column data. 
You need to be sure to include [JQuery](https://jquery.com/), [jquery-ui](https://jqueryui.com/) and [Bootstrap](http://getbootstrap.com/).
It is optional to include [knockoutjs](http://knockoutjs.com/)

* JQuery plugin.
* Knockoutjs integration.
* Setup maximun and minimun allowed.


## Examples
###Basic:

```html

<head>
    <title>jquery.period-selector</title>
    
    <link rel="stylesheet" href="libs/css/jquery-ui.css">
    <link rel="stylesheet" href="libs/css/bootstrap.css">
    <link rel="stylesheet" href="libs/css/bootstrap-theme.css">
    <link rel="stylesheet" href="dist/css/period-selector.css">

	
    <!-- Latest compiled and minified JavaScript -->
	<script src="libs/js/jquery-1.10.2.min.js"></script>
	<script src="libs/js/jquery-ui.min.js"></script>
    <script src="libs/js/bootstrap.js"></script>
	

	
	<script src="dist/js/jquery.period-selector.js"></script>
	<script src="js/example2.js"></script>
    <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body>
	<div class="row">
		<div class="col-lg-6">
			<div id="s-date"></div>
			<span id="s-date-text"/>
				
        </div>
		<div class="col-lg-6">
			<div id="e-date"></div>
			<span id="e-date-text"/>
        </div>
    </div>
</body>	
```

```javascript
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
```




## Options

Under development.

```html


```



```javascript

```


