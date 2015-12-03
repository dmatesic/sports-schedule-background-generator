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

var store = createStoreWithMiddleware(reducer, Immutable.fromJS({
    ajax: {
        working: false,
        error: null
    },
    teams: [],
    schedule: [],
    background: {
        container: {
            size: {
                width: null,
                height: null
            }
        },
        preview: {
            scale: null
        },
        size: {
            width: 1242,
            height: 2208
        },
        padding: {
            top: 580,
            bottom: 298,
            right: 123,
            left: 123
        },
        team: {
            size: {
                width: null
            }
        }
    }
}));

store.dispatch(actionCreators.loadTeams());

ReactDOM.render(
    <ReactRedux.Provider store={store}>
        <App />
    </ReactRedux.Provider>,
    document.getElementById('app')
);