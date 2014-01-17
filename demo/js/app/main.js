define(['util', 'events', 'ford', 'app/routes'], function(util, events, $, routes) {
	var app = events();
	
	$.fn.toggleClass = function(className) {
		$.iterate(this, function(c) {
			c = $(c);
			c[c.hasClass(className)?'declassify':'classify'](className);
		});
		return this;
	};
	
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
	routes.on('route', function(url) {
		$('.pure-menu-selected').declassify('pure-menu-selected');
		$('a[href="/#'+url+'"]').classify('pure-menu-selected');
	});
	
	// lazy init on page load:
	app.emit('init');
	return app;
});