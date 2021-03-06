import * as core from './core.js';
import { log } from './logger.js';

export function init(app) {
  app.get('/favicon.ico', function get(req, res) {
    res.status(204).end();
  });

  app.get('/team', function get(req, res) {
    res.send(core.getTeams());
  });

  app.get('/team/:name/schedule', function get(req, res) {
    res.send(core.getTeamSchedule({
      name: req.params.name,
    }));
  });

  app.post('/screenshot', function post(req, res, next) {
    core.createScreenshot({
      html: req.body.html,
      height: req.body.height,
      width: req.body.width,
    }).then(function then(filePath) {
      res.send(filePath);
    }, function send(err) {
      return next(err);
    });
  });

  app.post('/log', function post(req, res, next) {
    try {
      log({
        message: req.body.message,
        level: req.body.level,
        client: true,
      });

      res.status(200).end();
    } catch (ex) {
      return next(ex);
    }
  });
}
