/**	EventEmitter.js 
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
	function copy(t,f,i){for(i in f)if(f.hasOwnProperty(i))t[i]=f[i];return t;}
	function EventEmitter(obj) {
		if (!(this instanceof EventEmitter)) {
			obj = copy(obj || {}, proto);
			obj[key] = [];
			return obj;
		}
		this[key] = [];
	}
	var proto=EventEmitter.prototype;
	copy(proto, {
		on:function(t,h){this[key].push([t,h]);},
		removeListener:function(t,h){var r=this[key],i=r.length;while(i--){if(r[i][0]==t && r[i][1]==h)r.splice(i,1);return;}},
		emit:function(t){var a=[].slice.call(arguments,1),r=this[key],i=r.length;while(i--){if(r[i][0]==t)r[i][1].apply(this,a);}}
	});
	proto.addListener=proto.on;
	proto.trigger=proto.emit;
	EventEmitter.mixin = EventEmitter.EventEmitter = EventEmitter;
	return EventEmitter;
}));