/* eslint-env node, mocha */
import { expect } from 'chai';
import request from 'supertest';
import { format } from 'util';
import _ from 'lodash';
import app from '../start';

describe('server routes', () => {
  it('GET /', function it(done) {
    // NOTE: Sometimes the first request(app) call fails with 404.. not sure why, this little hack fixes the issue
    request(app)
    .get('/')
    .end(function end() {
      request(app)
      .get('/')
      .expect(200, done);
    });
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

    // Find a valid team name
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

  it('GET team schedule with invalid query param', function it(done) {
    request(app)
    .get('/team/null/schedule')
    .expect(404, done);
  });

  it('POST screenshot', function it(done) {
    request(app)
    .post('/screenshot')
    .send({
      html: '<div>test</div>',
      height: 100,
      width: 100,
    })
    .end(function end(err, res) {
      expect(err).to.not.exist();
      expect(res).to.exist();
      expect(res.text).to.match(/schedule_(.*)\.png/);

      // Download the generated screenshot
      request(app)
      .get(format('/%s', res.text))
      .expect(200, done);
    });
  });

  it('POST screenshot with missing request params', function it(done) {
    request(app)
    .post('/screenshot')
    .send({ })
    .expect(500, done);
  });

  it('GET invalid path', function it(done) {
    request(app)
    .get('/null')
    .expect(404, done);
  });
});
