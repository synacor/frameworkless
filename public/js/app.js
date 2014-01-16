require.config({
	baseUrl : 'js/lib',
	paths : {
		app : '../app'
	}
});

define(['app/main'], function(main) {
	window.app = main;
});