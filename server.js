var express = require('express'),
	app = express(),
	port = process.env.PORT || 8080;

app.use(express.static('./public'));
app.use(express.compress());

app.listen(port, function() {
	console.log('Server listening on localhost:'+port);
});