var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var Redux = require('redux');
var ReactRedux = require('react-redux');
var ReduxSimpleRouter = require('redux-simple-router');
var thunk = require('redux-thunk');
var history = require('history');
var appReducer = require('./reducer');
var actionMiddleware = require('./action-middleware');
var App = require('./components/App');

var routes = (
  <ReactRouter.Route path="/" component={App}/>
);

var reducer = Redux.combineReducers({
  routing: ReduxSimpleRouter.routeReducer,
  app: appReducer,
});

var store = Redux.applyMiddleware(
  thunk,
  actionMiddleware.logging
)(Redux.createStore)(reducer);

var createHistory = history.createHistory();

ReduxSimpleRouter.syncReduxAndRouter(createHistory, store);

ReactDOM.render(
  <ReactRedux.Provider store={store}>
    <ReactRouter.Router history={createHistory}>
      {routes}
    </ReactRouter.Router>
  </ ReactRedux.Provider >,
  document.getElementById('app')
);
