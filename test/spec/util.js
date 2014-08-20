describe('util', function() {
	var util;

	it('should be exposed via require("util")', function(done) {
		require(["util"], function(lib) {
			util = lib;

			expect(util).to.exist;
			expect(util).to.be.an('object');
			done();
		});
	});


	describe('String', function() {
		describe('#trim()', function() {
			it('should be a function', function() {
				expect(String.prototype).to.have.property('trim');
				expect("foo".trim).to.be.a('function');
			});

			it('should trim spaces', function() {
				expect("foo ".trim()).to.equal('foo');
				expect(" foo".trim()).to.equal('foo');
				expect(" foo ".trim()).to.equal('foo');
				expect("  foo   ".trim()).to.equal('foo');
			});

			it('should trim tabs', function() {
				expect("foo\t".trim()).to.equal('foo');
				expect("\tfoo".trim()).to.equal('foo');
				expect("\tfoo\t".trim()).to.equal('foo');
				expect("\t\t\tfoo\t\t\t".trim()).to.equal('foo');
			});

			it('should trim newlines', function() {
				expect("foo\r\n".trim()).to.equal('foo');
				expect("\nfoo".trim()).to.equal('foo');
				expect("\rfoo\n".trim()).to.equal('foo');
				expect("\r\n\n\nfoo\n\r".trim()).to.equal('foo');
			});

			it('should trim mixed whitespace', function() {
				expect(" \t\nfoo\t\n\t ".trim()).to.equal('foo');
			});
		});
	});


	describe('Array', function() {
		describe('.isArray()', function() {
			it('should be a function', function() {
				expect(Array).to.have.property('isArray');
				expect(Array.isArray).to.be.a('function');
			});

			it('should return false for non-Arrays', function() {
				expect( Array.isArray({}) ).to.equal(false);
				expect( Array.isArray("foo") ).to.equal(false);
				expect( Array.isArray(25) ).to.equal(false);
				expect( Array.isArray(/foo/g) ).to.equal(false);
				expect( Array.isArray(null) ).to.equal(false);
				expect( Array.isArray(undefined) ).to.equal(false);
			});

			it('should return true for Arrays', function() {
				expect( Array.isArray([]) ).to.equal(true);
				expect( Array.isArray(new Array()) ).to.equal(true);
			});

			it('should return true for Arrays created in other contexts', function() {
				var frame = document.createElement('iframe'),
					win, arr;

				document.body.appendChild(frame);
				win = frame.contentWindow;

				expect( Array.isArray(new win.Object()) ).to.equal(false);

				arr = new win.Array();
				expect( Array.isArray(arr) ).to.equal(true);

				win.document.write('<script>window.arr=[];</script>');
				expect( Array.isArray(win.arr) ).to.equal(true);
			});
		});


		describe('#forEach()', function() {
			it('should be a function', function() {
				expect(Array.prototype).to.have.property('forEach');
				expect([].forEach).to.be.a('function');
			});

			it('should call iterator on each element', function() {
				var arr = ['a', 'b', 'c'],
					ctx = {},
					spy = sinon.spy();
				arr.forEach(spy, ctx);
				expect(spy).to.have.been.calledThrice;
				expect(spy.alwaysCalledOn(ctx)).to.equal(true);
				expect(spy.firstCall).to.have.been.calledWithExactly('a', 0, arr);
				expect(spy.secondCall).to.have.been.calledWithExactly('b', 1, arr);
				expect(spy.thirdCall).to.have.been.calledWithExactly('c', 2, arr);
			});
		});
	});


	describe('Object', function() {
		describe('.keys()', function() {
			it('should be a function', function() {
				expect(Object).to.have.property('keys');
				expect(Object.keys).to.be.a('function');
			});

			it('should return an Array of own-properties', function() {
				var obj = {
						foo : 'fooval',
						bar : 'barval',
						baz : 'bazval'
					};
				expect(Object.keys(obj)).to.deep.equal(['foo', 'bar', 'baz']);
			});

			it('should skip prototype members', function() {
				function Foo() {}
				Foo.prototype.baz = 'bazval';
				var obj = new Foo();
				obj.foo = 'fooval';
				obj.bar = 'barval';
				expect(Object.keys(obj)).to.deep.equal(['foo', 'bar']);
			});
		});


		describe('.create()', function() {
			it('should be a function', function() {
				expect(Object).to.have.property('create');
				expect(Object.create).to.be.a('function');
			});

			it('should create a new object with a given prototype', function() {
				var proto = {
					foo : 'fooval',
					meth : function() { },
					ref : {
						key : 'val'
					}
				};

				var obj = Object.create(proto);

				// no own-properties:
				expect(obj).to.deep.equal({});

				// all prototype properties in-tact
				expect(obj.foo).to.equal(proto.foo);
				expect(obj.meth).to.equal(proto.meth);
				expect(obj.ref).to.equal(proto.ref);
			});
		});
	});


	describe('Function', function() {
		describe('#bind()', function() {
			it('should be a function', function() {
				expect(Function.prototype).to.have.property('bind');
				expect((function(){}).bind).to.be.a('function');
			});

			it('should bind a function to a given context', function() {
				var ctx = {},
					spy = sinon.spy(),
					bound = spy.bind(ctx);
				bound();
				expect(spy).to.have.been.calledOn(ctx);
			});

			it('should curry additional arguments', function() {
				var b = {},
					d = [],
					spy = sinon.spy(),
					bound = spy.bind(null, 'a', b);
				bound('c', d);
				expect(spy).to.have.been.calledOn(spy);
				expect(spy).to.have.been.calledWithExactly('a', b, 'c', d);
			});
		});
	});


	describe('.typeOf()', function() {
		it('should be a function', function() {
			expect(util).to.have.property('typeOf');
			expect(util.typeOf).to.be.a('function');
		});

		it('should return "undefined" for undefined', function() {
			expect(util.typeOf(undefined)).to.equal('undefined');
			expect(util.typeOf()).to.equal('undefined');
		});

		it('should return "null" for null', function() {
			expect(util.typeOf(null)).to.equal('null');
		});

		it('should return "array" for Arrays', function() {
			expect(util.typeOf([])).to.equal('array');
			expect(util.typeOf(new Array())).to.equal('array');
			expect(util.typeOf(arguments)).not.to.equal('array');
		});

		it('should return "regexp" for regular expressions', function() {
			expect(util.typeOf(/a/g)).to.equal('regexp');
			expect(util.typeOf(new RegExp())).to.equal('regexp');
		});

		it('should return "string" for Strings', function() {
			expect(util.typeOf('')).to.equal('string');
			expect(util.typeOf(new String())).to.equal('string');
		});

		it('should return "number" for Numbers', function() {
			expect(util.typeOf(1)).to.equal('number');
			expect(util.typeOf(1.1)).to.equal('number');
			expect(util.typeOf(new Number())).to.equal('number');
		});

		it('should return "boolean" for Booleans', function() {
			expect(util.typeOf(true)).to.equal('boolean');
			expect(util.typeOf(false)).to.equal('boolean');
			expect(util.typeOf(new Boolean())).to.equal('boolean');
		});

		it('should return "function" for Functions', function() {
			expect(util.typeOf(function(){})).to.equal('function');
			expect(util.typeOf(new Function())).to.equal('function');
			expect(util.typeOf(Math.sin)).to.equal('function');
		});
	});


	describe('.template()', function() {
		it('should be a function', function() {
			expect(util).to.have.property('template');
			expect(util.template).to.be.a('function');
		});

		it('should inject {{fields}}', function() {
			var fields = {
				foo : 'bar',
				baz : 'bat'
			};
			expect(util.template('{{foo}}{{baz}}', fields)).to.equal('barbat');
			expect(util.template('\n{{foo}}\n{{baz}}\n', fields)).to.equal('\nbar\nbat\n');
		});

		it('should encode HTML characters in {{.}} fields', function() {
			var fields = {
					foo : '<>&"'
				},
				encoded = '&lt;&gt;&amp;&quot;';
			expect(util.template('{{foo}}', fields)).to.equal(encoded);
		});

		it('should not encode HTML characters in {{{.}}} fields', function() {
			var fields = {
				foo : '<>&"'
			};
			expect(util.template('{{{foo}}}', fields)).to.equal(fields.foo);
		});

		it('should replace missing fields with (opt.empty || "")', function() {
			expect(util.template('{{foo}}', {})).to.equal('');
			expect(util.template('{{foo}}')).to.equal('');
			expect(util.template('{{foo}}', {}, {empty:false})).to.equal('{{foo}}');
			expect(util.template('{{foo}}', {}, {empty:'hi'})).to.equal('hi');
		});

		it('should template only prefixed fields when opt.prefix is used', function() {
			var fields = {
					foo : 'foovalue',
					bar : 'barvalue'
				},
				tpl, out;

			tpl = '{{foo}}\n{{pfx.foo}}\n{{pfx.bar}}';
			out = util.template(tpl, fields, { prefix:'pfx' });
			expect(out).to.equal('{{foo}}\nfoovalue\nbarvalue');

			tpl = '{{{foo}}}\n{{{pfx.foo}}}\n{{{pfx.bar}}}';
			out = util.template(tpl, fields, { prefix:'nope' });
			expect(out).to.equal(tpl);
		});
	});


	describe('.memoize()', function() {
		it('should be a function', function() {
			expect(util).to.have.property('memoize');
			expect(util.memoize).to.be.a('function');
		});

		it('should return a function', function() {
			var spy = sinon.spy();
			expect(util.memoize(spy)).to.be.a('function');
			expect(util.memoize).to.throw();
		});

		it('should proxy calls to the original function', function() {
			var spy = sinon.spy(),
				proxy = util.memoize(spy);
			proxy();
			expect(spy).to.have.been.calledOnce;
			proxy('a', 'b', 'c');
			expect(spy).to.have.been.calledTwice;
			expect(spy.secondCall).to.have.been.calledWithExactly('a', 'b', 'c');
		});

		it('should cache calls with an identical first argument', function() {
			var spy = sinon.spy(),
				proxy = util.memoize(spy);
			proxy('a', 'b');
			proxy('a', 'b', 'c');
			expect(spy).to.have.been.calledOnce;
			expect(spy).to.have.been.calledWithExactly('a', 'b');
		});

		it('should be at least 2x faster', function() {
			var proxy, start, i, slow, fast;

			function func(id) {
				return document.querySelectorAll('#'+id);
			}
			proxy = util.memoize(func);

			function now() {
				return (window.performance && window.performance.now()) || (Date.now && Date.now()) || new Date().getTime();
			}

			function test(f) {
				var start = now(),
					c = 0;
				while ( now() - start < 10 ) {
					f('test');
					c++;
				}
				return c;
			}

			slow = test(func);
			fast = test(proxy);

			//console.log('Original: '+slow+' ops/sec, memoized: '+fast+' ops/sec');
			expect(fast).to.be.at.greaterThan(slow);
		});
	});


	describe('.forEach()', function() {
		it('should be a function', function() {
			expect(util).to.have.property('forEach');
			expect(util.forEach).to.be.a('function');
		});

		it('should be aliased as util.foreach', function() {
			expect(util).to.have.property('foreach');
			expect(util.foreach).to.equal(util.forEach);
		});

		it('should call iterator on all Object own-properties', function() {
			var spy = sinon.spy(),
				obj = {
					key1 : 'value1',
					key2 : 'value2',
					key3 : 'value3'
				},
				ret;

			ret = util.forEach(obj, spy);

			expect(spy).to.have.been.calledThrice;
			expect(spy.firstCall).to.have.been.calledWithExactly('value1', 'key1');
			expect(spy.secondCall).to.have.been.calledWithExactly('value2', 'key2');
			expect(spy.thirdCall).to.have.been.calledWithExactly('value3', 'key3');

			expect(ret).to.equal(obj);
		});

		it('should bail if iterator returns false', function() {
			var obj = { key:'value' },
				spy = sinon.stub().returns(false);

			util.forEach(obj, spy);

			expect(spy).to.have.been.calledOnce;
			expect(spy).to.have.been.calledWithExactly('value', 'key');
		});
	});


	describe('.delve()', function() {
		it('should be a function', function() {
			expect(util).to.have.property('delve');
			expect(util.delve).to.be.a('function');
		});

		it('should return the passed object for "this"', function() {
			var obj = {};
			expect(util.delve(obj, 'this')).to.equal(obj);
		});

		it('should return a property called "." if requested', function() {
			var obj = {};
			expect(util.delve(obj, '.', 'fallback')).to.equal('fallback');
			obj['.'] = 'test';
			expect(util.delve(obj, '.', 'fallback')).to.equal('test');
		});

		it('should return property values for valid keys', function() {
			var obj = {
				p1 : 'v1',
				p2 : 'v2',
				a : {
					b : {
						c : 'test'
					}
				}
			};
			expect(util.delve(obj, 'p1')).to.equal(obj.p1);
			expect(util.delve(obj, 'p2')).to.equal(obj.p2);
			expect(util.delve(obj, 'a')).to.equal(obj.a);
			expect(util.delve(obj, 'a.b')).to.equal(obj.a.b);
			expect(util.delve(obj, 'a.b.c')).to.equal(obj.a.b.c);
		});

		it('should return fallback or undefined for missing keys', function() {
			var obj = {
				a : {
					b : {
						c : 'test'
					}
				}
			};
			expect(util.delve(obj, 'b')).to.equal(undefined);
			expect(util.delve(obj, 'b', 'fb')).to.equal('fb');
			expect(util.delve(obj, 'a.c')).to.equal(undefined);
			expect(util.delve(obj, 'a.c', 'fb')).to.equal('fb');
			expect(util.delve(obj, 'b.c')).to.equal(undefined);
			expect(util.delve(obj, 'b.c', 'fb')).to.equal('fb');
		});
	});


	describe('.extend()', function() {
		it('should be a function', function() {
			expect(util).to.have.property('extend');
			expect(util.extend).to.be.a('function');
		});

		it('should copy own-properties onto obj', function() {
			var obj = {
					orig : 'v'
				},
				props = {
					foo : 'bar',
					baz : 'bat'
				},
				props2 = {
					test : 'val'
				},
				copy = util.extend(obj, props, props2);

			expect(copy).to.deep.equal({
				orig : 'v',
				foo : 'bar',
				baz : 'bat',
				test : 'val'
			});

			// make sure it clones:
			expect(util.extend({}, obj)).not.to.equal(obj);
			expect(util.extend({}, obj)).to.deep.equal(obj);
		});
	});


	describe('.inherits()', function() {
		it('should be a function', function() {
			expect(util).to.have.property('inherits');
			expect(util.inherits).to.be.a('function');
		});

		it('should support instanceof', function() {
			function Animal(){}
			function Cat(){}
			util.inherits(Cat, Animal);

			var cat = new Cat();

			expect(cat).to.be.an.instanceOf(Animal);
			expect(cat instanceof Animal).to.equal(true);
		});

		it('should nest prototypes', function() {
			function Animal(){}
			Animal.prototype.type = 'Unknown';

			function Cat(){}
			util.inherits(Cat, Animal);
			Cat.prototype.type = 'Feline';

			var animal = new Animal();
			var cat = new Cat();

			expect(animal.type).to.equal('Unknown');
			expect(cat.type).to.equal('Feline');
		});
	});


	describe('.htmlEntities()', function() {
		it('should be a function', function() {
			expect(util).to.have.property('htmlEntities');
			expect(util.htmlEntities).to.be.a('function');
		});

		it('should encode HTML characters', function() {
			var chars = ['<', '>', '&', '"'],
				encoded = ['&lt;', '&gt;', '&amp;', '&quot;'],
				i;
			for (i=0; i<chars.length; i++) {
				expect(util.htmlEntities(chars[i])).to.equal(encoded[i]);
			}
		});
	});


	describe('.uniqueId()', function() {
		it('should be a function', function() {
			expect(util).to.have.property('uniqueId');
			expect(util.uniqueId).to.be.a('function');
		});

		it('should return a unique string for 100 calls', function() {
			var list = [],
				unique = true,
				offender, id, i;
			for (i=100; i--; ) {
				id = util.uniqueId();
				if (list.indexOf(id)!==-1) {
					unique = false;
					offender = id;
				}
				list.push(id);
			}
			expect(list.length).to.equal(100);
			expect(unique).to.equal(true);
		});

		it('should return optionally prefixed IDs', function() {
			expect(util.uniqueId('prefix')).to.contain('prefix');
		});
	});

});
