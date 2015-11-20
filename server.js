var _ = require('lodash'),
	async = require('async'),
	bodyParser = require('body-parser'),
	Bing = require('node-bing-api')({ accKey: '' }),
	Converter = require("csvtojson").Converter,
	cloudinary = require('cloudinary'),
	cors = require('cors'),
	express = require('express'),
	fs = require('fs'),
	request = require('request'),
	util = require('util'),
	webshot = require('webshot');

var config = {
	express: {
		port: 4001
	}
};

/*
cloudinary.config({
	cloud_name: '',
	api_key: '',
	api_secret: ''
});

// Only 10 results? Could also use names from CSV to download all
cloudinary.api.resource(null,
	function(result)  {
		console.log(result)
	}
);
*/

var scheduleCsv = fs.createReadStream("./2015_NCAA_FOOTBALL_SCHEDULES.csv");
var converter = new Converter({constructResult:true});
scheduleCsv.pipe(converter);

converter.on('end_parsed', function (schedule) {
	var app = module.exports = express();

	app.use(bodyParser.json({
		limit: '50mb'
	}));

	app.use(cors());

	app.use(express.static(__dirname + '/'));

	app.get('/team', function(req, res) {
		res.send(_.uniq(_.pluck(schedule, 'Team')));
	});

	app.get('/team/:teamName/schedule', function(req, res) {
		var data = getTeamSchedule(
			{
				teamName: req.params.teamName,
				schedule: schedule
			}
		);

		res.send(data);
	});

	app.post('/screenshot', function(req, res) {
		var html = req.body.html;

		getScreenshot(html, function(err) {
			if (err) res.send(500);
			else {
				/*res.setHeader('Content-disposition', 'attachment; filename=schedule.png');
				res.setHeader('Content-type', 'image/png');
				res.download(__dirname + '/schedule.png');*/

				res.send('/schedule.png');
			}
		});
	});

	app.listen(config.express.port, function () {
		console.log(util.format('Express server listening on port %d in %s mode', config.express.port, app.settings.env));
	});

	/*getTeamSchedule({
		teamName: 'Ohio St.',
		schedule: schedule},
	function(err, res) {
		console.log(res);
	});*/
});


function getTeamSchedule(opts) {
	var matchups = _.where(opts.schedule, { Team: opts.teamName });

	var teamSchedule = matchups.map(function(matchup) {
		return {
			OpponentName: matchup.Opp,
			Date: matchup.Date,
			Location: matchup.Location,
			ImageUri: util.format('http://res.cloudinary.com/hmohypuzp/image/upload/v1441391249/%s.png', encodeURIComponent(matchup.Opp.replace('&','')))
		}
	});

	return teamSchedule;

	/*
	async.forEachOfSeries(matchups, function(matchup, key, matchupCallback) {
		Bing.images(util.format('%s ncaa college primary logo site:sportslogos.net', matchup.Opp), {
			imageFilters: { style: 'Graphics' }
		}, function(err, res, body){
			if (!err && body && body.d && body.d.results && body.d.results.length && body.d.results.length > 0) {
				matchups[key].ImageUri = body.d.results[0].MediaUrl
				matchupCallback(null);
			} else {
				matchupCallback(err || 'Body is null');
			}
		});
	}, function(err){
		var teamSchedule = matchups.map(function(matchup) {
			return {
				OpponentName: matchup.Opp,
				Date: matchup.Date,
				Location: matchup.Location,
				ImageUri: matchup.ImageUri
			}
		});

		callback(err, teamSchedule);
	});
	*/
}

function getScreenshot(html, callback) {
	webshot(html, 'schedule.png', {
		siteType: 'html',
		defaultWhiteBackground: true,
		windowSize: {
			width: 621,
			height: 1104
		}
	}, function(err) {
		callback(err);
	});
}