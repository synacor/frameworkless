require.config({
	baseUrl : 'js/lib',
	paths : {
		app : '../app',
		templates : '../../templates'
	}
});

define(['app/main'], function(main) {
	window.app = main;
});