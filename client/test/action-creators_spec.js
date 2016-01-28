/* eslint-env node, mocha */
import { expect } from 'chai';
import nock from 'nock'
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actionCreators from '../src/action-creators';
import { INITIAL_STATE, ACTION } from '../src/constants';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('actions', () => {
  it('generates schedule', function(done) {
    this.timeout(5000);

    nock('http://localhost')
    .post('/screenshot')
    .reply(200, {  } );

    const getState = INITIAL_STATE;
    const action = actionCreators.generateSchedule(getState);

    const expectedActions = [
      (incomingAction) => {
        expect(incomingAction.type).to.equal(ACTION.AJAX_START);
      },
      (incomingAction) => {
        expect(incomingAction.type).to.equal(ACTION.AJAX_SUCCESS);
      }
    ];

    const store = mockStore(getState, expectedActions, done);
    store.dispatch(action);
  });
});