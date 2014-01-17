define(['util', 'ford', 'text!templates/about.html'], function(util, $, view) {
	var page = {
		url : '/about/',
		
		load : function() {
			$('#main').html(view);
		}
	};
	
	return page;
});