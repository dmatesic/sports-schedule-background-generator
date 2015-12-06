var Immutable = require('immutable'),
    React = require('react'),
    ReactDOM = require('react-dom'),
    Redux = require ('redux'),
    thunk = require ('redux-thunk'),
    ReactRedux = require('react-redux'),
    App = require('./components/App'),
    reducer = require('./reducer'),
    actionCreators = require('./action-creators');
    //actionMiddleware = require('./action-middleware');

var createStoreWithMiddleware = Redux.applyMiddleware(
    thunk
    //actionMiddleware.logging
)(Redux.createStore);

var store = createStoreWithMiddleware(reducer);

store.dispatch(actionCreators.loadTeams());

ReactDOM.render(
    <ReactRedux.Provider store={store}>
        <App />
    </ReactRedux.Provider>,
    document.getElementById('app')
);