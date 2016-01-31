import winston from 'winston';
import 'winston-loggly';
import config from '../src/config.js';

const logger = new (winston.Logger)({});

export const LEVEL = {
  SILLY: 'silly', // 5
  DEBUG: 'debug', // 4
  VERBOSE: 'verbose', // 3
  INFO: 'info', // 2
  WARN: 'warn', // 1
  ERROR: 'error', // 0
};

export function log(opts) {
  const level = opts.level || LEVEL.INFO;
  const message = opts.message;
  const tags = [config.env];

  if (!message) throw new Error('Missing required parameter: message');

  if (opts.client) tags.push('client');
  else tags.push('server');

  // TODO: Is there a better way to update the tags after instantiating logger?
  logger.configure({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.Loggly)({
        token: config.loggly.token,
        subdomain: config.loggly.subdomain,
        json: true,
        tags,
      }),
    ],
  });

  logger.log(level, message);
}
