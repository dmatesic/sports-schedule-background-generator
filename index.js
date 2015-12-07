var bodyParser = require('body-parser');
var cors = require('cors');
var express = require('express');
var util = require('util');
var core = require('./src/core.js');
var router = require('./src/router.js');

var config = {
  express: {
    port: process.env.PORT || 4000,
  },
};

var startServer = function startServer() {
  var app = module.exports = express();

  app.use(function use(req, res, next) {
    console.log(util.format(
      '%s requested for %s',
      req.method,
      req.url
    ));
    next();
  });

  app.use(bodyParser.json({
    limit: '50mb',
  }));

  // Cors required for webpack-server-dev cross ports and for screenshots
  // (Request header field Content-Type is not allowed by Access-Control-Allow-Headers in preflight response)
  app.use(cors());

  app.use(express.static('client/dist'));

  router.init(app);

  // Error handling middleware
  app.use(function use(err, req, res) {
    console.error(err);
    res.sendStatus(500);
  });

  app.listen(config.express.port, function listen() {
    console.log(util.format('Express server listening on port %d in %s mode', config.express.port, app.settings.env));
  });
};

core.init().then(startServer).catch(function catchCoreErr(err) {
  console.error(err);
  process.exit(1);
});
