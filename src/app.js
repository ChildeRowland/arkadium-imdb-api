var express 	= 	require('express');
var path 		= 	require('path');
var bodyParser 	= 	require('body-parser');
var http 		= 	require('http');

var app 		= 	express();
var port 		= 	process.env.PORT || 3000;
var env 		= 	process.env.NODE_ENV || 'development';

var config 		= 	require('./server/config');
var apiKey 		=   config.apiKey3;

// remove for deployment
var mockData 	= 	require("./server/themoviedb_data.json");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use('/assets', express.static(path.join(__dirname, 'assets')));


// search imdb with query parameters
app.use('/search', function (req, res, next) {

	if ( req.query ) {
		var encodeActor = encodeURIComponent(req.query.actor);
		var path = '/3/search/person?query='+encodeActor+'&api_key='+apiKey;

		var options = {
			"method": "GET",
			"hostname": "api.themoviedb.org",
			"port": null,
			"path": path,
			"headers": {}
		};

		var req = http.request(options, function (response) {
			var chunks = [];

			response.on("data", function (chunk) {
				chunks.push(chunk);
			});

			response.on("end", function () {
				var body = Buffer.concat(chunks);
				res.json(JSON.parse(body.toString()));
			});
		});

		req.write("{}");
		req.end();
	} else {
		next();
	}
});

// get actor by id
app.use('/actor/:id', function (req, res, next) {

	if ( req.params ) {

		var path = 'https://api.themoviedb.org/3/person/'+req.params.id+'/movie_credits?api_key='+apiKey;
		
		var options = {
			"method": "GET",
			"hostname": "api.themoviedb.org",
			"port": null,
			"path": path,
			"headers": {}
		};

		var req = http.request(options, function (response) {
			var chunks = [];

			response.on("data", function (chunk) {
				chunks.push(chunk);
			});

			response.on("end", function () {
				var body = Buffer.concat(chunks);
				res.json(JSON.parse(body.toString()));
			});
		});

		req.write("{}");
		req.end();
	} else {
		next();
	}
});

// entry point for SPA
app.get('/*', function (req, res) {
	res.sendFile(path.join(__dirname,'index.html'));
});

//catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Server Not Found');
	err.status = 404;
	next(err);
});

app.listen(port, function () {
	console.log('Express server started on port ' + port);
});


module.exports = app;