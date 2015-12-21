/* eslint-env node, mocha */
import { expect } from 'chai';
import { List, Map, fromJS } from 'immutable';
import { format } from 'util';
import reducer from '../src/reducer';
import { INITIAL_STATE, ACTION } from '../src/constants';

describe('reducer', () => {
  it('sets initial state', () => {
    let state;
    const action = {
      type: null
    };
    const nextState = reducer(state, action);

    expect(fromJS(INITIAL_STATE)).to.equal(fromJS(INITIAL_STATE));
  });

  it('allows background padding to be less than or equal to 90% of background size', function it() {
    let state;
    const action = {
      type: ACTION.INIT_PATH,
      payload: {
        path: format(
          '/?width=%s&height=%s&topPadding=%s&bottomPadding=%s&leftPadding=%s&rightPadding=%s',
          1000,
          1000,
          400,
          400,
          400,
          400
        )
      }
    };
    const nextState = reducer(state, action);

    expect(nextState.getIn('background.size'.split('.'))).to.equal(fromJS({
      width: 1000,
      height: 1000
    }));

    expect(nextState.getIn('background.padding'.split('.'))).to.equal(fromJS({
      top: 400,
      bottom: 400,
      right: 400,
      left: 400
    }));
  });
});

