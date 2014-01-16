require.config({
	baseUrl : 'lib',
	app : '../app'
});

define(['main'], function(main) {
	window.app = main;
});