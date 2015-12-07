var ReactDOM = require('react-dom');
var Redux = require('redux');
var thunk = require('redux-thunk');
var reducer = require('./reducer');
var actionCreators = require('./action-creators');
// actionMiddleware = require('./action-middleware');
/* eslint-disable no-unused-vars */
var App = require('./components/App');
/* eslint-enable no-unused-vars */

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
