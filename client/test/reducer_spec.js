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

    expect(nextState.getIn('background.size.current'.split('.'))).to.equal(fromJS({
      width: 1000,
      height: 1000,
      padding: {
        top: 400,
        bottom: 400,
        left: 400,
        right: 400,
      },
    }));

    expect(nextState.getIn('background.size.valid'.split('.'))).to.equal(fromJS({
      width: 1000,
      height: 1000,
      padding: {
        top: 400,
        bottom: 400,
        left: 400,
        right: 400,
      },
    }));
  });

  it('does not allow background padding to be greater than 90% of background size', function it() {
    let state;
    const action = {
      type: ACTION.INIT_PATH,
      payload: {
        path: format(
          '/?width=%s&height=%s&topPadding=%s&bottomPadding=%s&leftPadding=%s&rightPadding=%s',
          1000,
          1000,
          451,
          451,
          901,
          0
        )
      }
    };
    const nextState = reducer(state, action);

    expect(nextState.getIn('background.size.current'.split('.'))).to.equal(fromJS({
      width: 1000,
      height: 1000,
      padding: {
        top: 451,
        bottom: 451,
        left: 901,
        right: 0,
      },
    }));

    expect(nextState.getIn('background.size.valid'.split('.'))).to.equal(fromJS(
      INITIAL_STATE.background.size.default
    ));
  });

  it('sets valid background size back to default if there are any errors', function it() {
    let state;
    const action = {
      type: ACTION.INIT_PATH,
      payload: {
        path: format(
          '/?width=%s&height=%s&topPadding=%s&bottomPadding=%s&leftPadding=%s&rightPadding=%s',
          1,
          1,
          0,
          0,
          0,
          0
        )
      }
    };
    const nextState = reducer(state, action);

    expect(nextState.getIn('background.size.current'.split('.'))).to.equal(fromJS({
      width: 1,
      height: 1,
      padding: {
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
      },
    }));

    expect(nextState.getIn('background.size.valid'.split('.'))).to.equal(fromJS(
      INITIAL_STATE.background.size.default
    ));
  });
});