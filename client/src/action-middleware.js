import _ from 'lodash';
import { log } from './logger';
import { ACTION } from './constants';

const _history = [];

export function logging(store) {
  return function nextFn(next) {
    return function actionFn(action) {
      const state = store.getState();

      const reducers = _.reduce(state, function reduce(memo, val, key) {
        if (_.isFunction(val.toJS)) memo[key] = val.toJS();
        else memo[key] = val;

        return memo;
      }, {});

      // TODO: Create new data structure for history (fixed length array)
      if (_history.length >= 25) _history.shift();
      _history.push({
        action,
        reducers,
      });

      if (action.type === ACTION.AJAX_ERROR) log({ message: _history });

      return next(action);
    };
  };
}
