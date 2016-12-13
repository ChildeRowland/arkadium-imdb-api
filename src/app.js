var express 		= 	require('express');
var path 			= 	require('path');
var bodyParser 		= 	require('body-parser');

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

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