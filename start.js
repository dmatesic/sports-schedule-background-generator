import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import util from 'util';
import * as core from './src/core.js';
import * as router from './src/router.js';

const config = {
  express: {
    port: process.env.PORT || 4000,
  },
};

function startServer() {
  const app = module.exports = express();

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
}

core.init().then(startServer).catch(function catchCoreErr(err) {
  console.error(err);
  process.exit(1);
});
