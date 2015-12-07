var React = require('react');
var ReactDOM = require('react-dom');
var Redux = require('redux');
var ReactRedux = require('react-redux');
var thunk = require('redux-thunk');
var reducer = require('./reducer');
var actionCreators = require('./action-creators');

var App = require('./components/App');
// actionMiddleware = require('./action-middleware');

var createStoreWithMiddleware = Redux.applyMiddleware(
  thunk
  // actionMiddleware.logging
)(Redux.createStore);

var store = createStoreWithMiddleware(reducer);

store.dispatch(actionCreators.loadTeams());

ReactDOM.render(
  <ReactRedux.Provider store={store}>
    <App />
  </ReactRedux.Provider>,
  document.getElementById('app')
);
