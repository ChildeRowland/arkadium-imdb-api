var express 		= 	require('express');
var path 			= 	require('path');
var bodyParser 		= 	require('body-parser');
var config 			= 	require('./server/config');

var mockData 		= 	require("./server/themoviedb_data.json");

var app = express();
var port = process.env.PORT || 3000;

var env = process.env.NODE_ENV || 'development';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// temp route for search reature
app.get('/search', function (req, res, next) {
	if (env == 'development') {
		console.log(config.development.url);
	}

	return res.status(200).send(mockData);
	// Quiz.find(function (err, result) {
	// 	if (err) {
	// 		return res.status(500).json({
	// 			code: 500,
	// 			message: "An error occurred while getting quizzes",
	// 			error: err
	// 		});
	// 	}
	// 	res.status(202).json({
	// 		code: 202,
	// 		message: "Success getting the quizzes",
	// 		obj: result
	// 	});
	// });
});

// entry point for SPA
app.get('/*', function (req, res) {
	res.sendFile(path.join(__dirname,'index.html'))
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