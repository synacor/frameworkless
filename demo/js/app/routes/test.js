define(['util', 'ford', 'text!templates/test.html'], function(util, $, view) {
	var page = {
		url : '/test/',
		
		load : function() {
			$('#main').html(view);
		}
	};
	
	return page;
});