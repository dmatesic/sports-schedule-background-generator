import _ from 'lodash';
import { Converter } from 'csvtojson';
import fs from 'fs';
import path from 'path';
import util from 'util';
import webshot from 'webshot';

let _schedule = null;

function convertScheduleFromCsvIntoJson(opts) {
  return new Promise(function promise(resolve, reject) {
    let converter;

    if (!opts.scheduleAsCsv) reject('Missing parameter scheduleAsCsv');

    converter = new Converter({ constructResult: true });
    opts.scheduleAsCsv.pipe(converter);

    converter.on('end_parsed', function on(schedule) {
      resolve(schedule);
    });
  });
}

function loadSchedule() {
  return new Promise(function promise(resolve, reject) {
    let scheduleAsCsv;

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
}

export function init() {
  return loadSchedule();
}

export function getTeams() {
  if (!_schedule) throw new Error('Need to call core.init()');

  return _.uniq(_.pluck(_schedule, 'Team'));
}

export function getTeamSchedule(opts) {
  let matchups;
  let teamSchedule;

  if (!_schedule) throw new Error('Need to call core.init()');
  if (!opts.name) throw new Error('Missing required parameter: name');

  matchups = _.where(_schedule, { Team: opts.name });

  if (!matchups || matchups.length === 0) throw new Error(404);

  teamSchedule = matchups.map(function map(matchup) {
    return {
      opponentName: matchup.Opp,
      date: matchup.Date,
      location: matchup.Location,
      imageUri: util.format('/resources/images/ncaa/%s.png', encodeURIComponent(matchup.Opp.replace('&', ''))),
    };
  });

  return teamSchedule;
}

export function createScreenshot(opts) {
  return new Promise(function promise(resolve, reject) {
    let clientFilePath;
    let serverFilePath;

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
}
