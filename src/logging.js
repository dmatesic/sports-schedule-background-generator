import _ from 'lodash';
import winston from 'winston';
import 'winston-loggly';
import config from '../src/config.js';

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.Loggly)({
      token: '015cf025-66ab-4411-8b10-254b628f1146',
      subdomain: 'dmatesic',
      tags: ['ssbg-server', config.env],
      json: true
    })
  ]
});

export const LEVEL = {
  SILLY: 'silly', // 5
  DEBUG: 'debug', // 4
  VERBOSE: 'verbose', // 3
  INFO: 'info', // 2
  WARN: 'warn', // 1
  ERROR: 'error' // 0
};

export function log(message, level = LEVEL.INFO) {
  logger.log(level, message);
}