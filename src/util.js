/**	@name util
 *	@namespace Utility functions and essential ES5 polyfills.
 *	@example
 *		var util = require('util');
 *		Array.isArray.bind([])(Object.keys(Object.create({a:' '.trim()})).forEach(util.typeOf));
 *		
 *		// "Hello Jason, your email is Fake &lt;not-a@real.email&gt;"
 *		util.template('Hello {{user.name}}, your email is {{{user.email}}}.', {
 *			user : {
 *				name : 'Jason',
 *				email : 'Fake <not-a@real.email>'
 *			}
 *		});
 */
(function(factory) {
	if (typeof window.define==='function' && window.define.amd) {
		window.define([], factory);
	}
	else {
		factory();
	}
}(function() {
	var entityMap = {'&':'amp','<':'lt','>':'gt','"':'quot'},
		uuids = 0,
		util;
	
	// Polyfills!
	
	if (!String.prototype.trim) {
		/**	{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim}
		 *	@name String#trim
		 */
		String.prototype.trim = function() {
			return this.replace(/^\s*.*?\s*$/g, '');
		};
	}
	
	if (!Array.isArray) {
		/**	{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray} */
		Array.isArray = function(obj) {
			return Object.prototype.toString.call(obj)==='[object Array]';
		};
	}
	
	if (!Array.prototype.forEach) {
		/**	{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach}
		 *	@name Array#forEach
		 */
		Array.prototype.forEach = function(iterator, context) {
			for (var i=0; i<this.length; i++) {
				iterator.call(context, this[i], i, this);
			}
		};
	}
	
	if (!Object.keys) {
		/**	{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys} */
		Object.keys = function(obj) {
			var keys=[], i;
			for (i in obj) {
				if (obj.hasOwnProperty(i)) {
					keys.push(i);
				}
			}
			return keys;
		};
	}
	
	if (!Object.create) {
		/**	{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create} */
		Object.create = function(o) {
			function F(){}
			F.prototype = o;
			return new F();
		};
	}
	
	if (!Function.prototype.bind) {
		/**	{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind}
		 *	@name Function#bind
		 */
		Function.prototype.bind = function(context, args) {
			var func=this, proxy;
			args = Array.prototype.slice.call(arguments, 1);
			if (context===null || context===undefined) {
				context = this;
			}
			proxy = function() {
				return func.apply(context, args.concat(Array.prototype.slice.call(arguments)));
			};
			proxy.unbind = function() {
				var o = func;
				context = args = func = proxy = null;
				return o;
			};
			return proxy;
		};
	}
	
	
	util = /** @lends util */ {

		/**	Get the lowercase type for the given object.
		 *	@returns {String} a type, eg: "array"
		 */
		typeOf : function(what) {
			if (what===undefined) {
				return 'undefined';
			}
			else if (what===null) {
				return 'null';
			}
			else if (util.isArray(what)) {
				return 'array';
			}
			else {
				return (typeof what || 'object').toLowerCase();
			}
		},
		
		/** Simple string templating: replace <code>{{fields}}</code> with values from a data object.
		 *	@function
		 *	@param {String} str			The string to operate on.
		 *	@param {Object} fields		A key-value field data.
		 *	@param {Object} [options]	Hashmap of options.
		 *	@param {String} [options.prefix]	If set, only operates on the subset of fields prefixed by the given character sequence. Example: <code>"i18n."</code>
		 *	@returns {String} result
		 */
		template : (function() {
			var rep = /\{\{\{?([^{}]+)\}?\}\}/gi,
				currentOptions,
				current;
		
			function template(str, fields, options) {
				current = fields;
				currentOptions = options;
				return str.replace(rep, field);
			}
		
			function field(str, token) {
				var opt = currentOptions,
					value;
				if (opt && opt.prefix) {
					if (token.substring(0, opt.prefix.length)!==opt.prefix) {
						return str;
					}
					token = token.substring(opt.prefix.length);
				}
				//value = current.hasOwnProperty(token) && current[token];
				value = util.delve(current, token);
				if (value) {
					if (str.charAt(2)==='{') {
						value = util.htmlEntities(value);
					}
					return value;
				}
				return str;
			}
		
			return template;
		}()),
		
		/**	Create a memoized proxy of a function.  This caches the return values of the given function using only the <strong>first argument</strong> as a cache key.
		 *	@function
		 *	@param {Function} func			A function to memoize.
		 *	@param {Object} [mem={}]		Optionally pre-supply key-value cache entries.
		 *	@param {Object} [options]		Hashmap of options for the cache.
		 *	@param {Object} [options.ignoreCase=false]		If <code>true</code>, the cache becomes case-insensitive.
		 *	@returns {Function} memoized
		 */
		memoize : function(func, mem, options) {
			var memoized;
			if (typeof func!=='function') {
				throw(new Error("util.memoize(func, mem) :: Error - first argument must be a function."));
			}
			mem = mem || {};
			options = options || {};
			/**	@ignore */
			memoized = function(input) {
				var ret;
				input += '';
				if (options.caseInsensitive===true) {
					// cast cache key to a string and normalize case:
					input = input.toLowerCase();
				}
				if (mem.hasOwnProperty(input)) {
					return mem[input];
				}
				ret = func.apply(this, arguments);
				mem[input] = ret;
				return ret;
			};
			/**	@ignore */
			memoized.unmemoize = function() {
				var o = func;
				memoized = func = mem = null;
				return o;
			};
			return memoized;
		},
		
		/** Call an iterator function on any Object or Array.<br />
		 *	<strong>Note:</strong> Return false from <code>iterator</code> to break out of the loop.
		 *	@param {Array|Object} obj		Any object
		 *	@param {Function} iterator		A function to call on each entry, gets passed <code>(value, key, obj)</code>.
		 *	@returns <code>obj</code>
		 */
		forEach : function(obj, iterator) {
			var p;
			if (Array.isArray(obj)) {
				for (p=0; p<obj.length; p++) {
					if (iterator.call(obj, obj[p], p)===false) {
						break;
					}
				}
			}
			else {
				for (p in obj) {
					if (obj.hasOwnProperty(p) && iterator.call(obj, obj[p], p)===false) {
						break;
					}
				}
			}
			return obj;
		},
		
		/**	Retrieve a nested property value using dot-notated keys.
		 *	@example
		 *		var doc = delve(window, 'document.body.innerHTML', false);
		 *	@param {Object} obj		An object to descend into
		 *	@param {String} key		A dot-notated (and/or bracket-notated) key
		 *	@param {any} [fallback]	Fallback to return if <code>key</code> is not found in <code>obj</code>
		 *	@returns The corresponding key's value if it exists, otherwise <code>fallback</code> or undefined.
		 */
		delve : function(obj, key, fallback) {
			var c=obj, i;
			if (key==='this') {
				return obj;
			}
			if (key==='.') {
				return obj.hasOwnProperty('.') ? obj['.'] : fallback;
			}
			if (key.indexOf('.')===-1) {
				return obj.hasOwnProperty(key) ? obj[key] : fallback;
			}
			key = key.replace(/(\.{2,}|\[(['"])([^\.]*?)\1\])/gm,'.$2').replace(/(^\.|\.$)/gm,'').split('.');
			for (i=0; i<key.length; i++) {
				if (!c || !c.hasOwnProperty(key[i])) {
					return fallback;
				}
				c = c[key[i]];
			}
			return c;
		},
		
		/** Copy own-properties from <code>props</code> onto <code>base</code>.
		 *	@returns base
		 */
		extend : function extend(base, props) {
			var i, p, obj, len=arguments.length, ctor=util.constructor, bypass;
			for (i=1; i<len; i++) {
				obj = arguments[i];
				if (obj!==null && obj!==undefined) {
					bypass = obj.constructor===util.constructor;
					for (p in obj) {
						if (bypass || obj.hasOwnProperty(p)) {
							base[p] = obj[p];
						}
					}
				}
			}
			return base;
		},
		
		/**	Simple inheritance.<br />
		 *	<b>Note: Operates directly on baseClass.</b>
		 *	@param {Function} baseClass		The base (child) class.
		 *	@param {Function} superClass	The SuperClass to inherit.
		 *	@returns {Function} the modified class, for convenience.
		 *	@example
		 *		function Animal() {
		 *			this.sound = "";
		 *		}
		 *		
		 *		function Cat() {
		 *			// call parent constructor:
		 *			Animal.call(this);
		 *			this.sound = "mew";
		 *		}
		 *		
		 *		// Inherit the parent prototype:
		 *		util.inherits(Cat, Animal);
		 */
		inherits : function(base, superClass) {
			var proto = base.prototype;
			function F() {}
			F.prototype = superClass.prototype;
			base.prototype = new F();
			util.extend(base.prototype, proto, {
				constructor : base,
				__super : superClass
			});
		},
		
		/**	Escape HTML entities within a string. */
		htmlEntities : function(str) {
			var t=str.split(''), i;
			for (i=t.length; i--; ) {
				if (entityMap.hasOwnProperty(t[i])) {
					t[i] = '&' + entityMap[t[i]] + ';';
				}
			}
			return t.join('');
		},
		
		/** Get an ID unique to the page with optional prefix. */
		uniqueId : function(prefix) {
			return (prefix || '') + ++uuids;
		}
	
	};
	
	util.foreach = util.forEach;
	
	return util;
}));