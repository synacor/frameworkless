function $(p) {
	return $.extend(typeof p==='string'?document.querySelectorAll(p):[].concat(p),$.fn);
}
$.fn={};
$.extend=function(o,p,i) {
	for (i in p)
		if (p.hasOwnProperty(i))
			o[i]=p[i];
	return o;
};
$.iterate=function(c, f, a) {
	for (var i=0; i<c.length; i++) {
		a = f.call(c, c[i], i);
		if (a!==undefined)
			return a;
	}
	return c;
};
function wrap(method, ns) {
	return function() {
		var a = arguments;
		return $.iterate(this, function(c, o, j) {
			o = ns && c[ns] || c;
			j = o[method];
			if (j) j.apply(o, a);
			else return method.apply(o, a);
		});
	};
}
$.extend($.fn, {
	on : wrap('addEventListener'),
	off : wrap('removeEventListener'),
	classify : wrap('add', 'classList'),
	declassify : wrap('remove', 'classList'),
	hasClass : wrap(document.body.classList.contains, 'classList'),
	css : wrap(function(s){ $.extend(this, s); }),
	remove : wrap(function(){this.parentNode.removeChild(this);}),
	text : wrap(function(t){
		if (!arguments.length) return this.textContent;
		this.textContent = t;
	}),
	html : wrap(function(h){
		if (!arguments.length) return this.innerHTML;
		this.innerHTML = h;
	})
});

if (typeof window.define==='function' && window.define.amd) {
	window.define([], function(){ return $; });
}