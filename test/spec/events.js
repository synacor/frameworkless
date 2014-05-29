describe('events', function() {
	var events;

	it('should be exposed via require("events")', function(done) {
		require(["events"], function(lib) {
			events = lib;

			expect(events).to.exist;
			expect(events).to.be.a('function');
			done();
		});
	});


	describe('mixin()', function() {
		it('should be a function', function() {
			expect(events).to.have.property('mixin');
			expect(events.mixin).to.be.a('function');
		});

		it('should return the passed object', function() {
			var obj = {};
			var result = events.mixin(obj);
			expect(result).to.equal(obj);
		});

		it('should enhance an object with event methods', function() {
			var obj = {
					foo : 'bar'
				},
				proto = events.EventEmitter.prototype;

			events.mixin(obj);

			expect(obj).to.have.property('on');
			expect(obj.on).to.equal(proto.on);

			expect(obj).to.have.property('removeListener');
			expect(obj.removeListener).to.equal(proto.removeListener);

			expect(obj).to.have.property('once');
			expect(obj.once).to.equal(proto.once);

			expect(obj).to.have.property('emit');
			expect(obj.emit).to.equal(proto.emit);

			expect(obj).to.have.property('addListener');
			expect(obj.addListener).to.equal(proto.addListener);

			expect(obj).to.have.property('trigger');
			expect(obj.trigger).to.equal(proto.trigger);
		});
	});


	describe('EventEmitter', function() {
		it('should be a constructor', function() {
			expect(events).to.have.property('EventEmitter');
			expect(events.EventEmitter).to.be.a('function');

			var ee = new events.EventEmitter();
			expect(ee).to.be.an.instanceof(events.EventEmitter);
		});


		describe('#on', function() {
			it('should add a handler', function() {
				var ee = new events.EventEmitter();
				function handler(){}

				ee.on('testtype', handler);

				expect(ee._eventemitterevents[0]).to.exist;
				expect(ee._eventemitterevents[0][0]).to.equal('testtype');
				expect(ee._eventemitterevents[0][1]).to.equal(handler);
			});

			it('should add duplicate handlers', function() {
				var ee = new events.EventEmitter();
				function handler(){}

				ee.on('testtype', handler);
				ee.on('testtype', handler);

				expect(ee._eventemitterevents[0]).to.exist;
				expect(ee._eventemitterevents[1]).to.deep.equal(ee._eventemitterevents[0]);
			});
		});


		describe('#removeListener', function() {
			it('should remove an existing handler', function() {
				var ee = new events.EventEmitter();
				function handler(){}

				ee.on('testtype', handler);
				expect(ee._eventemitterevents[0]).to.exist;

				ee.removeListener('testtype', handler);
				expect(ee._eventemitterevents[0]).not.to.exist;
			});

			it('should be case-insensitve', function() {
				var ee = new events.EventEmitter();
				function handler(){}

				ee.on('testtype', handler);
				expect(ee._eventemitterevents[0]).to.exist;

				ee.removeListener('TesTTYpe', handler);
				expect(ee._eventemitterevents[0]).not.to.exist;
			});

			it('should only remove one handler', function() {
				var ee = new events.EventEmitter();
				function handler(){}

				ee.on('testtype', handler);
				ee.on('testtype', handler);
				expect(ee._eventemitterevents[0]).to.exist;
				expect(ee._eventemitterevents[1]).to.exist;

				var first = ee._eventemitterevents[0];

				ee.removeListener('testtype', handler);
				expect(ee._eventemitterevents[0]).to.exist;
				expect(ee._eventemitterevents[0]).to.equal(first);
				expect(ee._eventemitterevents[1]).not.to.exist;
			});
		});


		describe('#once', function() {
			it('should call the given handler with arguments', function() {
				var ee = new events.EventEmitter(),
					handler = sinon.spy();

				ee.once('test', handler);
				ee.emit('test', 'arg1', 'arg2');

				expect(handler).to.have.been.calledOnce;
				expect(handler).to.have.been.calledWithExactly('arg1', 'arg2');
			});

			it('should remove itself after invocation', function() {
				var ee = new events.EventEmitter(),
					handler = sinon.spy();

				ee.once('test', handler);
				expect(ee._eventemitterevents[0]).to.exist;

				ee.emit('test');
				expect(ee._eventemitterevents[0]).not.to.exist;
			});

			it('should be case-insensitve', function() {
				var ee = new events.EventEmitter(),
					handler = sinon.spy();

				ee.once('testHAndlER', handler);
				ee.emit('TestHandler');

				expect(handler).to.have.been.calledOnce;
			});
		});


		describe('#emit', function() {
			it('should call a registered handler with arguments', function() {
				var ee = new events.EventEmitter(),
					handler = sinon.spy();

				ee.on('test', handler);
				ee.emit('test', 'arg1', 'arg2');

				expect(handler).to.have.been.calledOnce;
				expect(handler).to.have.been.calledWithExactly('arg1', 'arg2');
			});

			it('should call all registered handlers', function() {
				var ee = new events.EventEmitter(),
					handler = sinon.spy();

				ee.on('test', handler);
				ee.on('test', handler);
				ee.emit('test', 'arg1', 'arg2');

				expect(handler).to.have.been.calledTwice;
				expect(handler.firstCall).to.have.been.calledWithExactly('arg1', 'arg2');
				expect(handler.secondCall).to.have.been.calledWithExactly('arg1', 'arg2');
			});

			it('should be case-insensitve', function() {
				var ee = new events.EventEmitter(),
					handler = sinon.spy();

				ee.on('testHAndlER', handler);
				ee.emit('TestHandler');

				expect(handler).to.have.been.calledOnce;
			});
		});


		describe('#addListener', function() {
			it('should be an alias of on()', function() {
				var ee = new events.EventEmitter();

				expect(events.EventEmitter.prototype.addListener).to.equal(events.EventEmitter.prototype.on);
				expect(ee.addListener).to.equal(ee.on);
			});
		});


		describe('#trigger', function() {
			it('should be an alias of emit()', function() {
				var ee = new events.EventEmitter();

				expect(events.EventEmitter.prototype.trigger).to.equal(events.EventEmitter.prototype.emit);
				expect(ee.trigger).to.equal(ee.emit);
			});
		});

	});

});
