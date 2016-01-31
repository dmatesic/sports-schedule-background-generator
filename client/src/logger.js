import request from 'superagent';

// TODO: Should this be grabbed from the server?
export const LEVEL = {
  SILLY: 'silly', // 5
  DEBUG: 'debug', // 4
  VERBOSE: 'verbose', // 3
  INFO: 'info', // 2
  WARN: 'warn', // 1
  ERROR: 'error', // 0
};

export function log(opts) {
  const level = opts.level || LEVEL.ERROR;
  const message = opts.message;

  if (!message) throw new Error('Missing required parameter: message');

  request
  .post('log')
  .send({
    level,
    message,
  })
  .end(function end() { });
}
