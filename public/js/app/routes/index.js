define(['util'], function(util) {
	var page = {
		url : '/',
		
		load : function() {
			document.body.innerHTML = util.template('<h1>Hello, {{{recipient.name}}}!</h1><p><a href="/#about/">About Page</a></p>', {
				recipient : {
					name : "World"
				}
			});
		}
	};
	
	return page;
});