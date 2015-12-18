/* eslint-env node, mocha */
import { expect } from 'chai';
import request from 'supertest';
import { format } from 'util';
import _ from 'lodash';
import app from '../start';

describe('server routes', () => {
  it('GET /', function it(done) {
    request(app)
    .get('/')
    .expect(200, done);
  });

  it('GET favicon', function it(done) {
    request(app)
    .get('/favicon.ico')
    .expect(204, done);
  });

  it('GET team', function it(done) {
    request(app)
    .get('/team')
    .expect(200)
    .end(function end(err, res) {
      expect(err).to.not.exist();
      expect(res).to.exist();
      expect(res.body).to.be.a('array');
      expect(res.body).to.have.length.above(0);
      done();
    });
  });

  it('GET team schedule', function it(done) {
    let teamName;
    let schedule;

    request(app)
    .get('/team')
    .end(function teamEnd(teamErr, teamRes) {
      teamName = _.first(_.get(teamRes, 'body'));

      expect(teamErr).to.not.exist();
      expect(teamName).to.exist();

      request(app)
      .get(format('/team/%s/schedule', teamName))
      .expect(200)
      .end(function scheduleEnd(scheduleErr, scheduleRes) {
        expect(scheduleErr).to.not.exist();
        expect(scheduleRes).to.exist();
        expect(scheduleRes.body).to.be.a('array');
        expect(scheduleRes.body).to.have.length.above(0);

        schedule = scheduleRes.body[0];

        expect(schedule).to.be.a('object');
        expect(schedule).to.have.property('opponentName');
        expect(schedule).to.have.property('date');
        expect(schedule).to.have.property('location');
        expect(schedule).to.have.property('imageUri');

        request(app)
        .get(schedule.imageUri)
        .expect(200, done);
      });
    });
  });

  it('GET team schedule with invalid params', function it(done) {
    request(app)
    .get('/team/null/schedule')
    .expect(404, done);
  });
});
