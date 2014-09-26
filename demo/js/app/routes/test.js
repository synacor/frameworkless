define(['util', 'ford', 'text!templates/test.html'], function(util, $, view) {
	var page = {
		url : '/test/',

		load : function(params) {
			var html = util.template(view, {
				params : params
			}, {
				empty : '[not set]'
			});
			$('#main').html(html);
		}
	};

	return page;
});
