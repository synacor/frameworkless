define(['util', 'events', 'ford', 'app/routes'], function(util, events, $, routes) {
	var app = events();

	app.on('init', function() {
		// set up sidebar events
		$('#menuLink, #menu a').on('click', function() {
			// menu link is a toggle, sidebar links are close-only:
			var op = this.id==='menuLink' ? 'toggleClass' : 'declassify';
			$('#layout, #menu, #menuLink')[op]('active');
		});
	});

	// Set up routes:
	app.on('init', routes.init);

	// Update the sidebar:
	routes.on('route', function(e) {
		$('.pure-menu-selected').declassify('pure-menu-selected');
		$('a[href="/#'+e.url+'"]').classify('pure-menu-selected');
	});

	return app.emit('init');
});
