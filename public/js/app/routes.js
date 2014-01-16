define([
	'util', 'Router',
	'./routes/index',
	'./routes/about'
], function(
	util, Router,
	index,
	about
) {
	var routes = new Router();
	
	for (var i=2; i<arguments.length; i++) {
		routes.get(arguments[i].url, arguments[i].load);
	}
	
	routes.init = function(path) {
		document.body.addEventListener('click', linkHandler);
		routes.route(path || location.pathname || location.hash || '/');
	};
	
	// Automatically route to pages
	function linkHandler(e) {
		var t=e.target, href;
		do {
			href = t.nodeName==='A' && t.getAttribute('href');
			if (href && href.match(/^\/#/g)) {
				routes.route(href.replace('#',''));
				e.preventDefault();
				return false;
			}
		} while (t=t.parentNode);
	}
	
	return routes;
});