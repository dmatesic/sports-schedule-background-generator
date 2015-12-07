(function coreModules(core) {
  var _ = require('lodash');
  var Converter = require('csvtojson').Converter;
  var fs = require('fs');
  var path = require('path');
  var util = require('util');
  var webshot = require('webshot');

  var _schedule = null;

  var convertScheduleFromCsvIntoJson = function convertScheduleFromCsvIntoJson(opts) {
    return new Promise(function promise(resolve, reject) {
      var converter;

      if (!opts.scheduleAsCsv) reject('Missing parameter scheduleAsCsv');

      converter = new Converter({ constructResult: true });
      opts.scheduleAsCsv.pipe(converter);

      converter.on('end_parsed', function on(schedule) {
        resolve(schedule);
      });
    });
  };

  var loadSchedule = function loadSchedule() {
    return new Promise(function promise(resolve, reject) {
      var scheduleAsCsv;

      try {
        scheduleAsCsv = fs.createReadStream(path.resolve(__dirname, '../data/2015_NCAA_FOOTBALL_SCHEDULES.csv'));

        convertScheduleFromCsvIntoJson({
          scheduleAsCsv: scheduleAsCsv,
        }).then(
          function resolveFn(schedule) {
            _schedule = schedule;
            resolve();
          },
          function rejectFn(err) {
            reject(err);
          }
        );
      } catch (ex) {
        reject(ex);
      }
    });
  };

  core.init = function init() {
    return loadSchedule();
  };

  core.getTeams = function getTeams() {
    if (!_schedule) throw new Error('Need to call core.init()');

    return _.uniq(_.pluck(_schedule, 'Team'));
  };

  core.getTeamSchedule = function getTeamSchedule(opts) {
    var matchups;
    var teamSchedule;

    if (!_schedule) throw new Error('Need to call core.init()');
    if (!opts.name) throw new Error('Missing required parameter: name');

    matchups = _.where(_schedule, { Team: opts.name });

    teamSchedule = matchups.map(function map(matchup) {
      return {
        opponentName: matchup.Opp,
        date: matchup.Date,
        location: matchup.Location,
        imageUri: util.format('/resources/images/ncaa/%s.png', encodeURIComponent(matchup.Opp.replace('&', ''))),
      };
    });

    return teamSchedule;
  };

  core.createScreenshot = function createScreenshot(opts) {
    return new Promise(function promise(resolve, reject) {
      var clientFilePath;
      var serverFilePath;

      if (!opts.html) {
        reject('Missing required parameter: html');
        return;
      }
      if (!opts.width) {
        reject('Missing required parameter: width');
        return;
      }
      if (!opts.height) {
        reject('Missing required parameter: height');
        return;
      }

      clientFilePath = util.format('tmp/schedule_%s.png', Math.random().toString(36).substring(2));
      serverFilePath = path.resolve('client/dist', clientFilePath);

      webshot(opts.html, serverFilePath, {
        siteType: 'html',
        defaultWhiteBackground: true,
        windowSize: {
          width: opts.width,
          height: opts.height,
        },
      }, function webshotCallback(err) {
        if (err) reject(err);
        else resolve(clientFilePath);
      });
    });
  };
})(module.exports);
