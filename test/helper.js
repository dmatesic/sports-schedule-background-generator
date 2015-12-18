import chai from 'chai';
import dirtyChai from 'dirty-chai';
import request from 'supertest';

chai.use(dirtyChai);

request.prototype.then = function then(onFulfilled, onRejected) {
  const self = this;
  return new Promise(function promise(resolve, reject) {
    self.end(function end(err, res) {
      if (err) return reject(err);
      resolve(res);
    });
  }).then(onFulfilled, onRejected);
};
