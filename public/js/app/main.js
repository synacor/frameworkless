define(['util', 'EventEmitter', 'app/routes'], function(util, EventEmitter, routes) {
	var app = new EventEmitter();
	
	// Set up routes:
	app.routes = routes;
	app.on('init', routes.init);
	
	// lazy init on page load:
	app.emit('init');
	return app;
});