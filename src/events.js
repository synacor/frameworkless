/**	@name events.js
 *	@function
 *	@namespace Provides event firing and listening.
 *	@see http://nodejs.org/api/events.html
 */
(function(factory) {
	if (typeof window.define==='function' && window.define.amd) {
		window.define([], factory);
	}
	else {
		factory();
	}
}(function() {
	var key = '_eventemitterevents';
	
	function copy(t, f, i) {
		for (i in f) {
			if (f.hasOwnProperty(i)) {
				t[i]=f[i];
			}
		}
		return t;
	}
	
	/**	@class
	 *	@name events.EventEmitter
	 */
	function EventEmitter(obj) {
		if (!(this instanceof EventEmitter)) {
			obj = copy(obj || {}, proto);
			obj[key] = [];
			return obj;
		}
		this[key] = [];
	}
	
	var proto=EventEmitter.prototype;
	copy(proto, /** @lends events.EventEmitter */ {
		on : function(type, handler) {
			this[key].push([type, handler]);
		},
		removeListener : function(type, handler){
			var listeners = this[key],
				i = listeners.length;
			while (i--) {
				if (listeners[i][0]===type && listeners[i][1]===handler) {
					return listeners.splice(i, 1), this;
				}
			}
		},
		emit : function(type) {
			var args = [].slice.call(arguments,1),
				listeners = this[key],
				i = listeners.length;
			while (i--) {
				if (listeners[i][0]===type) {
					listeners[i][1].apply(this, args);
				}
			}
		}
	});
	proto.addListener = proto.on;
	proto.trigger = proto.emit;
	
	EventEmitter.mixin = EventEmitter.EventEmitter = EventEmitter;
	
	return EventEmitter;
}));