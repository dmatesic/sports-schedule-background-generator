(function appModule() {
  var _ = require('lodash');
  var React = require('react');
  var ReactDOM = require('react-dom');
  var ReactRedux = require('react-redux');
  var ReduxSimpleRouter = require('redux-simple-router');
  var actionCreators = require('../action-creators');
  var AjaxStatus = require('./AjaxStatus');
  var Controls = require('./Controls');
  var BackgroundPreview = require('./BackgroundPreview');

  var pushPath = ReduxSimpleRouter.pushPath;

  var App = React.createClass({
    propTypes: {
      selectedTeam: React.PropTypes.string,
      needToFetch: React.PropTypes.object,
      loadSchedule: React.PropTypes.func,
      windowResized: React.PropTypes.func,
    },
    componentDidMount: function componentDidMount() {
      window.addEventListener('resize', this.onWindowResize);
      this.onWindowResize();
      this.fetchAdditionalProps();
    },
    componentDidUpdate: function componentDidUpdate() {
      this.fetchAdditionalProps();
    },
    onWindowResize: function onWindowResize() {
      var width = window.innerWidth;
      var height =
          window.innerHeight -
          40 - // TODO: Why is ReactDOM.findDOMNode(this.refs.app).outerHeight undefined?
          ReactDOM.findDOMNode(this.refs.header).offsetHeight -
          ReactDOM.findDOMNode(this.refs.footer).offsetHeight;

      this.props.windowResized(width, height);
    },
    fetchAdditionalProps: function fetchAdditionalProps() {
      if (this.props.needToFetch.schedule === true) this.props.loadSchedule(this.props.selectedTeam);
    },
    render: function render() {
      var appStyle = {
        padding: '20px',
      };

      var headerStyle = {
        paddingBottom: '20px',
      };

      var footerStyle = {
        height: '20px',
      };

      return (
        <div ref="app" style={appStyle}>
          <AjaxStatus {...this.props} />
          <div id="header" ref="header" style={headerStyle}>
            <Controls {...this.props} />
          </div>
          <BackgroundPreview {...this.props} />
          <div id="footer" ref="footer" style={footerStyle}></div>
        </div>
      );
    },
  });

  function mapStateToProps(state) {
    return state.app.toJS();
  }

  module.exports = ReactRedux.connect(
    mapStateToProps,
    _.merge(
      actionCreators,
      { pushPath }
    )
  )(App);
})();
