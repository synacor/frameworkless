/**	Router.js
 *	@example
 *		var Router = require('router').Router;
 *		var routes = new Router();
 *		
 *		// Define a route:
 *		routes.get('/pages/:name/:tab', function(params) {
 *			console.log(params.name, params.tab);
 *		});
 *		
 *		// Manually route to a page:
 *		routes.route('/pages/welcome/about');
 *		
 *		// Automatically route to pages:
 *		document.body.addEventListener('click', function(e) {
 *			var t=e.target, href;
 *			do {
 *				href = t.nodeName==='A' && t.getAttribute('href');
 *				if (href && href.match(/^\/#/g))) {
 *					routes.route(href.replace('#',''));
 *					e.preventDefault();
 *					return false;
 *				}
 *			} while (t=t.parentNode);
 *		});
 */
(function(factory) {
	if (typeof window.define==='function' && window.define.amd) {
		window.define(['EventEmitter'], factory);
	}
	else {
		factory(window.EventEmitter);
	}
}(function(EventEmitter) {
	/**	@class A URL router.
	 *	@public
	 */
	function Router() {
		var router = this;
		this.routes = [];
		
		EventEmitter.call(this);
		
		addEventListener('popstate', function() {
			route(router, location.pathname || location.hash);
		});
	}
	
	/**	Route to a given URL, or add a routing handler for the given URL pattern.
	 *	@param {String} url		A URL to route to
	 *	@param {Function} [handler]		If given, <code>url</code> is used as a URL pattern that maps to this handler function.
	 */
	Router.prototype.route = function(url, handler) {
		if (typeof handler==='function') {
			this.routes.push({
				url : url,
				handler : handler
			});
			this.routes.sort(sort);
		}
		else {
			history.pushState(0, 0, url);
			if (this.currentUrl!==url) {
				route(this, url);
			}
		}
		return this;
	};
	
	/**	Alias of Router#route
	 *	@function
	 */
	Router.prototype.get = Router.prototype.route;
	
	
	/**	Perform routing for the given router+url combo. */
	function route(router, url) {
		var route, matches, i;
		for (i=router.routes.length; i--; ) {
			route = router.routes[i];
			matches = exec(url, route.url);
			if (matches && route.handler(matches)!==false) {
				router.currentUrl = url;
				return;
			}
		}
	}
	
	/**	Check if the given URL matches a route's URL pattern.
	 *	@returns key-value matches for a match, or false for a mismatch
	 */
	function exec(url, route) {
		var matches = {};
		url = segmentize(url);
		route = segmentize(route);
		for (var i=0; i<Math.max(url.length, route.length); i++) {
			if (route[i].charAt(0)===':') {
				matches[route[i].substring(1)] = url[i];
			}
			else {
				if (route[i]!==url[i]) {
					return false;
				}
			}
		}
		return matches;
		//route = route.replace(/(^\/+|\/+$)/g, '');
		//var reg = new RegExp('^\/?'+route.replace(/\/\:[^\/]+/g)+'\/?$');
	}
	
	/**	Get an Array containing the segments for a given URL */
	function segmentize(url) {
		return url.replace(/(^\/+|\/+$)/g, '').split('/');
	}
	
	/**	Sort in descending order of number of real path segments */
	function sort(a, b) {
		return b.url.match(/\/./g).length - b.url.match(/\/./g).length;
	}
	
	return Router;
}));