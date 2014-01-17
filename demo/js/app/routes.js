define([
	'util', 'router', 'events',
	'./routes/index',
	'./routes/about',
	'./routes/test'
], function(
	util, router, events,
	index,
	about,
	test
) {
	var routes = router();
	events.mixin(routes);
	
	for (var i=3; i<arguments.length; i++) {
		routes.get(arguments[i].url, arguments[i].load);
	}
	
	routes.onroute = routes.emit.bind(routes, 'route');
	
	routes.init = function(path) {
		document.body.addEventListener('createTouch' in document ? 'touchstart' : 'click', linkHandler);
		routes.route(path || location.pathname || location.hash || '/', true);
	};
	
	// Automatically route to pages
	function linkHandler(e) {
		var t=e.target, href;
		do {
			href = t.nodeName==='A' && t.getAttribute('href');
			if (href && href.match(/^\/#/g)) {
				routes.route(href.replace(/^\/#\/*/g,'/'));
				e.preventDefault();
				return false;
			}
		} while (t=t.parentNode);
	}
	
	return routes;
});