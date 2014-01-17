define(['util', 'events', 'ford', 'app/routes'], function(util, events, $, routes) {
	var app = events();
	
	// Set up routes:
	app.routes = routes;
	app.on('init', routes.init);
	
	// Show active links:
	routes.on('route', function(url) {
		$('.pure-menu-selected').declassify('pure-menu-selected');
		$('a[href="/#'+url+'"]').classify('pure-menu-selected');
	});
	
	// lazy init on page load:
	app.emit('init');
	return app;
});