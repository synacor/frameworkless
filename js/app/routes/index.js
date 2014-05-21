define(['util', 'ford', 'text!templates/index.html'], function(util, $, view) {
	var page = {
		url : '/',
		load : function() {
			$('#main').html(util.template(view, {
				page : {
					name : "Frameworkless"
				}
			}));
		}
	};

	return page;
});
