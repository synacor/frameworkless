/**	Instantiable declarative URL router.
 *	@module router
 *	@requires events
 *	
 *	@example
 *		<caption>Basic Usage:</caption>
 *		
 *		var router = require('router'),
 *			routes = router();
 *		
 *		// Define a route:
 *		routes.get('/pages/:name/:tab', function(params) {
 *			console.log(params.name, params.tab);
 *		});
 *		
 *		// Manually route to a page:
 *		routes.route('/pages/welcome/about');
 *
 *	@example
 *		<caption>Useful Tip: Automatically route to pages from HTML links.</caption>
 *		
 *		document.body.addEventListener('click', function(e) {
 *			var t=e.target, href;
 *			do {
 *				href = t.nodeName==='A' && t.getAttribute('href');
 *				if (href && href.match(/^\//g)) && routes.route(href)) {
 *					e.preventDefault();
 *					return false;
 *				}
 *			} while (t=t.parentNode);
 *		});
 */
(function(factory) {
	if (typeof window.define==='function' && window.define.amd) {
		window.define(['events'], factory);
	}
	else {
		factory(window.EventEmitter);
	}
}(function(events) {
	var EventEmitter = events.EventEmitter || events;
	
	/**	A URL router.
	 *	@class module:router.Router
	 *	@augments module:events.EventEmitter
	 *	@fires module:router.Router#route
	 */
	function Router() {
		if (!(this instanceof Router)) return new Router();
		
		var router = this;
		this.routes = [];
		
		if (!(this instanceof EventEmitter)) {
			EventEmitter.call(this);
		}
		else if (events && typeof events.mixin==='function') {
			events.mixin(this);
		}
		
		addEventListener('popstate', function() {
			route(router, location.pathname || location.hash);
		});
	}
	
	try {
		Router.prototype = new EventEmitter();
		Router.prototype.constructor = Router;
	} catch(err) {
		console.warn(err.message);
	}
	
	
	/**	Use the given URL fragment as a prefix when parsing and creating all route URLs.
	 *	@example
	 *		router.setBaseUrl('/my-app/');
	 *		
	 *		// routes are now relative to the Base URL:
	 *		router.route('/hello', function() {
	 *			console.log('Hello');
	 *		});
	 *		
	 *		// routing remains relative to the Base URL:
	 *		router.route('/hello');		// "hello"
	 */
	Router.prototype.setBaseUrl = function(baseUrl) {
		this.baseUrl = baseUrl;
	};
	
	/**	A URL to which all routes are relative.  To change, use {@link module:router.Router#setBaseUrl setBaseUrl}.
	 *	@string
	 *	@default "/"
	 */
	Router.prototype.baseUrl = '/';
	
	
	/**	Route to <code>url</code>, or register a <code>handler</code> to respond to <code>url</code>.  
	 *	If <code>handler</code> is passed:  registers <code>handler</code> as a route for the given <code>url</code> pattern.  
	 *	If <code>handler</code> is omitted:  Attempts to route to the given <code>url</code>.
	 *	@function module:router.Router#route
	 *	@param {String} url							A URL to route to.
	 *	@param {Function} [handler]					If given, <code>url</code> is instead used as a pattern that maps URLs to <code>handler</code>.
	 *	@param {Boolean} [relativeToBaseUrl=true]	If <code>false</code>, the router will attempt to route to <code>url</code> without taking {@link module:router.Router#baseUrl baseUrl} into account.
	 *	
	 *	@example
	 *		<caption>Registering a route handler:</caption>
	 *		
	 *		router.route('/jobs/:id', function(params) {
	 *			console.log('Job ID: ' + params.id);
	 *		});
	 *	
	 *	@example
	 *		<caption>Invoking a route: (uses previous example's route handler)</caption>
	 *		
	 *		var didRoute = router.route('/jobs/1337');
	 *		console.log( didRoute );   // true
	 */
	Router.prototype.route = function(url, handler, relativeToBaseUrl) {
		var type = typeof handler;
		if (type==='function' || type==='object') {
			this.routes.push({
				url : url,
				handler : handler
			});
			this.routes.sort(sort);
			return this;
		}
		if (relativeToBaseUrl!==false && this.baseUrl) {
			url = this.baseUrl.replace(/\/+$/g, '') + '/' + url.replace(/^\/+/g, '');
		}
		history[handler===true ? 'replaceState' : 'pushState'](0, 0, url);
		return this.currentUrl===url || route(this, url);
	};
	
	/**	Alias of {@link module:router.Router#route}.
	 *	@function module:router.Router#get
	 */
	Router.prototype.get = Router.prototype.route;
	
	
	/**	Check if the given URL matches the current active route. */
	Router.prototype.isUrlActive = function(url) {
		var r = this.currentRoute;
		return r && !!exec(url, r.url);
	};
	
	
	// Perform routing for the given router+url combo.
	function route(router, url) {
		var cur, matches, base, evt, i,
			rawUrl = url,
			old = router.currentRoute,
			emit = router.emit || router.trigger,
			handler;
		if (router.baseUrl) {
			base = strip(router.baseUrl);
			if (strip(url).substring(0, base.length)!==base) {
				return false;
			}
			url = url.replace(/^\/+/g, '').substring(base.length);
		}
		url = '/' + url.replace(/^\/+/g,'');
		for (i=router.routes.length; i--; ) {
			cur = router.routes[i];
			matches = exec(url, cur.url);
			handler = cur.handler;
			if (typeof handler==='object') {
				if (router.currentRoute===cur && typeof handler.reload==='function') {
					handler = handler.reload;
				}
				else if (typeof handler.load==='function') {
					handler = handler.load;
				}
				else {
					console.warn('Handler for '+cur.url+' is malformed (not a function or an object with a `load` method)');
					continue;
				}
			}
			if (matches && handler.call(cur.handler, matches, router)!==false) {
				if (old && old!==cur && typeof old.handler.unload==='function') {
					old.handler.unload();
				}
				router.currentUrl = url;
				router.currentUrlRaw = rawUrl;
				router.currentRoute = cur;
				
				evt = {
					url : url,
					rawUrl : rawUrl
				};
				
				/**	Indicates the current "routed" URL has changed (a new route has become active).
				 *	@event module:router.Router#route
				 *	@type {Object}
				 *	@property {String} url		The new active/current route URL, relative to {@link module:router.Router#baseUrl baseUrl}
				 *	@property {String} rawUrl	The full active route URL including {@link module:router.Router#baseUrl baseUrl}
				 */
				if (typeof emit==='function') {
					emit.call(router, 'route', evt);
				}
				if (typeof router.onroute==='function') {
					router.onroute(evt);
				}
				return true;
			}
		}
		return false;
	}
	
	// Check if the given URL matches a route's URL pattern.
	// @returns key-value matches for a match, or false for a mismatch
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
	}
	
	// Remove preceeding and trailing slashes from a URL
	function strip(url) {
		return url.replace(/(^\/+|\/+$)/g, '');
	}
	
	// Get an Array containing the segments for a given URL
	function segmentize(url) {
		return strip(url).split('/');
	}
	
	// Sort in descending order of number of real path segments
	function sort(a, b) {
		return segmentize(b.url).length - segmentize(a.url).length;
	}
	
	
	/**	If the module is called as a function, returns a new {@link router.Router} instance.
	 *	@name router.router
	 *	@function router.router
	 */
	
	
	Router.Router = Router;
	return Router;
}));