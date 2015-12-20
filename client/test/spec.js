/* eslint-env node, mocha */
import { expect } from 'chai';

describe('test suite', () => {
  it('adds 1+1', function it(done) {
    expect(1+1).to.equal(2);

    done();
  });
});
