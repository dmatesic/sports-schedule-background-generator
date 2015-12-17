import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Router } from 'react-router';
import { combineReducers, applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import { syncReduxAndRouter, routeReducer } from 'redux-simple-router';
import thunk from 'redux-thunk';
import { createHistory } from 'history';
import appReducer from './reducer';
import { logging } from './action-middleware';
import App from './components/App';

const routes = (
  <Route path="/" component={App}/>
);

const reducer = combineReducers({
  routing: routeReducer,
  app: appReducer,
});

const store = applyMiddleware(
  thunk,
  logging
)(createStore)(reducer);

const history = createHistory();

syncReduxAndRouter(history, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      {routes}
    </Router>
  </Provider >,
  document.getElementById('app')
);
