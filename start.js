import _ from 'lodash';
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

const app = express();
export default app;

function startServer() {
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
  // NOTE: next needs to be defined for express error handling to work, but it is also an unused var
  /* eslint-disable no-unused-vars */
  app.use(function use(err, req, res, next) {
    /* eslint-enable no-unused-vars */
    const errMessage = (_.isString(err)) ? err : err.message;

    if (_.isNumber(errMessage) && Number(errMessage) > 0) res.sendStatus(errMessage);
    else {
      console.error(errMessage);
      res.sendStatus(500);
    }
  });

  // NOTE: Make sure mocha tests don't listen “twice”, one time in the test and one time here
  // See http://www.marcusoft.net/2015/10/eaddrinuse-when-watching-tests-with-mocha-and-supertest.html
  if (module.parent.id === '.') {
    app.listen(config.express.port, function listen() {
      console.log(util.format('Express server listening on port %d in %s mode', config.express.port, app.settings.env));
    });
  }
}

core.init().then(startServer).catch(function catchCoreErr(err) {
  console.error(err);
  process.exit(1);
});
