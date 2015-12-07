(function appModule() {
  var React = require('react');
  var ReactDOM = require('react-dom');
  var ReactRedux = require('react-redux');
  var actionCreators = require('../action-creators');
  /* eslint-disable no-unused-vars */
  var AjaxStatus = require('./AjaxStatus');
  var Controls = require('./Controls');
  var BackgroundPreview = require('./BackgroundPreview');
  /* eslint-enable no-unused-vars */

  var App = React.createClass({
    componentDidMount: function componentDidMount() {
      window.addEventListener('resize', this.onWindowResize);
      this.onWindowResize();
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
    return state.toJS();
  }

  module.exports = ReactRedux.connect(
    mapStateToProps,
    actionCreators
  )(App);
})();
