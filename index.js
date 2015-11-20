var bodyParser = require('body-parser'),
	cors = require('cors'),
	express = require('express'),
	util = require('util'),
	core = require('./src/core.js'),
	router = require('./src/router.js');

// TODO: Create configuration file
var config = {
	express: {
		port: process.env.PORT || 4000
	}
};

var startServer = function() {
	var app = module.exports = express();

	app.use(function(req, res, next) {
		console.log(util.format(
			'%s requested for %s',
			req.method,
			req.url
		));
		next();
	});

	app.use(bodyParser.json({
		limit: '50mb'
	}));

	// TODO: Cors should only be allowed for cross port, not domain
	// Cors required for webpack-server-dev cross ports and for
	// screenshots (Request header field Content-Type is not allowed by Access-Control-Allow-Headers in preflight response)
	app.use(cors());

	app.use(express.static('client/dist'));

	router.init(app);

	// Error handling middleware
	app.use(function(err, req, res, next) {
		console.error(err);
		// TODO: Not every error is 500 (e.g. invalid parameters should return 400), maybe look into github.com/ctavan/express-validator
		res.sendStatus(500);
	});

	app.listen(config.express.port, function () {
		console.log(util.format('Express server listening on port %d in %s mode', config.express.port, app.settings.env));
	});
};

core.init().then(startServer).catch(function(err) {
	console.error(err);
	process.exit(1);
});