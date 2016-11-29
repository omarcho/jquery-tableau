requirejs.config({
	deps:['js/example1'],
    baseUrl: './',
	waitSeconds: 15,
    paths: {
        "jquery": "libs/js/jquery-1.10.2.min",
        "jquery-ui": "libs/js/jquery-ui.min",
        "bootstrap": "libs/js/bootstrap",
		"knockout": "libs/js/knockout-3.3.0",
		"tableau": "libs/js/tableau-2.1.1",
		"jquery.tableau":"dist/js/jquery.tableau"
    },
    shim: {
        
    }
});