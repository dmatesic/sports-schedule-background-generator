(function(router) {

    var _ = require('lodash'),
        path = require('path'),
        core = require('./core.js');

    router.init = function(app) {

        app.get('/team', function(req, res) {
            res.send(core.getTeams());
        });

        app.get('/team/:name/schedule', function(req, res) {
            res.send(core.getTeamSchedule({
                name: req.params.name
            }));
        });

        app.post('/screenshot', function(req, res, next) {
            core.createScreenshot({
                html: req.body.html,
                height: req.body.height,
                width: req.body.width
            }).then(function(filePath) {
                res.send(filePath);
            }, function(err) {
                return next(err);
            });
        });

    };

})(module.exports);