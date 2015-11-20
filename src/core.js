(function(core) {

    var _ = require('lodash'),
        Converter = require("csvtojson").Converter,
        fs = require('fs'),
        path = require('path'),
        util = require('util'),
        webshot = require('webshot');

    var _schedule = null;

    var convertScheduleFromCsvIntoJson = function(opts) {
        return new Promise(function(resolve, reject) {

            if (!opts.scheduleAsCsv) reject('Missing parameter scheduleAsCsv');

            var converter = new Converter({ constructResult: true });
            opts.scheduleAsCsv.pipe(converter);

            converter.on('end_parsed', function (schedule) {
                resolve(schedule);
            });
        });
    };

    var loadSchedule = function() {
        return new Promise(function(resolve, reject) {
            try {
                var scheduleAsCsv = fs.createReadStream(path.resolve(__dirname, '../data/2015_NCAA_FOOTBALL_SCHEDULES.csv'));

                convertScheduleFromCsvIntoJson({
                    scheduleAsCsv: scheduleAsCsv
                }).then(
                    function(schedule) {
                        _schedule = schedule;
                        resolve();
                    },
                    function(err) { reject(err); }
                );
            }
            catch (ex) { reject(ex); }
        });
    };

    core.init = function() {
        return loadSchedule();
    };

    core.getTeams = function() {
        if (!_schedule) throw new Error('Need to call core.init()');

        return _.uniq(_.pluck(_schedule, 'Team'));
    };

    core.getTeamSchedule = function(opts) {
        var matchups,
            teamSchedule;

        if (!_schedule) throw new Error('Need to call core.init()');
        // TODO: Better way of handling missing/invalid parameters? Some library out there?
        if (!opts.name) throw new Error('Missing required parameter: name');

        matchups = _.where(_schedule, { Team: opts.name });

        teamSchedule = matchups.map(function(matchup) {
            return {
                opponentName: matchup.Opp,
                date: matchup.Date,
                location: matchup.Location,
                // TODO: Screenshot generated does not include team images (probably need absolute path)
                imageUri: util.format('/resources/images/ncaa/%s.png', encodeURIComponent(matchup.Opp.replace('&','')))
            }
        });

        return teamSchedule;
    };

    core.createScreenshot = function(opts) {
        // TODO: After some time (, clean up tmp folder

        return new Promise(function(resolve, reject) {

            // TODO: Better way of handling missing/invalid parameters? Some library out there?
            if (!opts.html) { reject('Missing required parameter: html'); return; }
            if (!opts.width) { reject('Missing required parameter: width'); return; }
            if (!opts.height) { reject('Missing required parameter: height'); return; }

            // TODO: Append random string to image file name so that multiple users can create screenshots
            // Another option, can webshot generate the image in memory?

            var clientFilePath = 'tmp/schedule.png',
                serverFilePath = path.resolve('client/dist', clientFilePath);

            webshot(opts.html, serverFilePath, {
                siteType: 'html',
                defaultWhiteBackground: true,
                windowSize: {
                    width: opts.width,
                    height: opts.height
                }
            }, function (err) {
                if (err) reject(err);
                else resolve(clientFilePath);
            });
        });
    };

})(module.exports);