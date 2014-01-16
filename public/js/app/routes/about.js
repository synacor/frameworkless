define(['util'], function(util) {
	var page = {
		url : '/about/',
		
		load : function() {
			document.body.innerHTML = '<h1>About</h1><p>This is the about page.</p>';
		}
	};
	
	return page;
});