(function routerModules(router) {
  var core = require('./core.js');

  router.init = function init(app) {
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
  };
})(module.exports);
