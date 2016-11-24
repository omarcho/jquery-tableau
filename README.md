# jquery.tableau


## Features

JQuery plugin to easily embed a tableau report and interact with it.
You need to be sure to include [JQuery](https://jquery.com/), [jquery-ui](https://jqueryui.com/).


* Filter by parameters and filters.
* Discover filters applied.
* Select markers.
* Get selected markers.


## Examples
###Basic:

```html
<div id="tableau-report"></div>
```

```javascript

$("#tableau-report").tableau({
	
	url:"https://public.tableau.com/views/GasPrice_4/GasPricesbyRegion?:embed=y&:display_count=yes",
	getSelectedMarksEnabled:true,
	
	params:{
		width:"100%",
		height: "500px",
		hideTabs: true,
	}
})

```




## Options

Under development.

```html


```



```javascript

```


