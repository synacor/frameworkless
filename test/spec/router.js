describe('router', function() {
	var router,
		oldHistory;

	beforeEach(function() {
		oldHistory = window.history;
		function add(title, state, url, _offset) {
			var entry = {
				title : title,
				state : state,
				url : url,
				added : Date.now()
			};
			history.entries[history.entries.length - 1 - _offset] = entry;
			history.length = history.entries.length;
		}
		window.history = {
			length : 0,
			entries : [],
			replaceState : sinon.spy(function(t, s, u) {
				add(t, s, u, 1);
			}),
			pushState : sinon.spy(add)
		};
	});

	afterEach(function() {
		window.history = oldHistory;
	});

	it('should be exposed via require("router")', function(done) {
		require(["router"], function(lib) {
			router = lib;

			expect(router).to.exist;
			expect(router).to.be.a('function');
			done();
		});
	});


	it('should be a factory for router.Router()', function() {
		expect(router).to.be.a('function');
		var routes = router();
		expect(routes).to.be.an.instanceOf(router.Router);
	});


	describe('Router', function() {
		it('should be a constructor', function() {
			expect(router).to.have.property('Router');
			expect(router.Router).to.be.a('function');

			var routes = new router.Router();
			expect(routes).to.be.an.instanceof(router.Router);
		});


		it('should inherit from EventEmitter', function(done) {
			require(['events'], function(events) {
				var routes = router(),
					proto = events.EventEmitter.prototype,
					i;
				expect(new router.Router()).to.be.an.instanceOf(events.EventEmitter);

				for (i in proto) {
					if (typeof proto[i]==='function') {
						expect(routes[i]).to.be.a('function');
					}
				}

				done();
			});
		});


		describe('#setBaseUrl', function() {
			it('should set baseUrl', function() {
				var routes = router();
				expect(routes.baseUrl).to.equal('/');

				routes.setBaseUrl('/foo/');

				expect(routes.baseUrl).to.equal('/foo/');
			});
		});


		describe('#route', function() {
			it('should register a handler when second arg is a function', function() {
				var routes = router(),
					route = sinon.spy();
				expect(routes.routes).to.be.empty;

				routes.route('/foo/bar', route);

				expect(routes.routes[0]).to.exist;
				expect(routes.routes[0].url).to.equal('/foo/bar');
				expect(routes.routes[0].handler).to.equal(route);
			});
		});

	});

});
