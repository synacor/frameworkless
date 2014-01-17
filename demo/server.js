var express = require('express'),
	app = express(),
	port = process.env.PORT || 8080;

app.use(express.compress());

// rewrite
app.use(function(req, res, next) {
	if (!req.url.match(/(^\/?static\/|\.[a-z]+$)/g)) {
		req.url = '/';
	}
	next();
});

app.use(express.static('./'));

app.listen(port, function() {
	console.log('Server listening on localhost:'+port);
});