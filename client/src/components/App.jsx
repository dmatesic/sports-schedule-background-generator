import { pushPath } from 'redux-simple-router';
import { merge } from 'lodash';
import { stringify } from 'querystring';
import { format } from 'util';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';

import AjaxStatus from './AjaxStatus';
import Controls from './Controls';
import BackgroundPreview from './BackgroundPreview';

const App = React.createClass({
  propTypes: {
    location: React.PropTypes.object,
    selectedTeam: React.PropTypes.string,
    needToFetch: React.PropTypes.object,
    pushPath: React.PropTypes.func,
    windowResized: React.PropTypes.func,
    loadTeams: React.PropTypes.func,
    loadSchedule: React.PropTypes.func,
  },
  componentDidMount: function componentDidMount() {
    window.addEventListener('resize', this.onWindowResize);
    this.onWindowResize();
    this.fetchAdditionalProps();
    this.initPath();
  },
  componentDidUpdate: function componentDidUpdate() {
    this.fetchAdditionalProps();
  },
  onWindowResize: function onWindowResize() {
    const width = window.innerWidth;
    const height =
      window.innerHeight -
      40 - // TODO: Why is ReactDOM.findDOMNode(this.refs.app).outerHeight undefined?
      ReactDOM.findDOMNode(this.refs.header).offsetHeight -
      ReactDOM.findDOMNode(this.refs.footer).offsetHeight;

    this.props.windowResized(width, height);
  },
  initPath: function initPath() {
    // TODO: Move these default values to reducer initial state
    const pathObject = merge(
      this.props.location.query, {
        width: this.props.location.query.width || 1242,
        height: this.props.location.query.height || 2208,
        topPadding: this.props.location.query.topPadding || 580,
        bottomPadding: this.props.location.query.bottomPadding || 298,
        leftPadding: this.props.location.query.leftPadding || 123,
        rightPadding: this.props.location.query.rightPadding || 123,
      }
    );

    this.props.pushPath(format(
      '/?%s',
      stringify(pathObject)
    ));
  },
  fetchAdditionalProps: function fetchAdditionalProps() {
    if (this.props.needToFetch.teams === true) this.props.loadTeams();
    if (this.props.needToFetch.schedule === true) this.props.loadSchedule(this.props.selectedTeam);
  },
  render: function render() {
    const appStyle = {
      padding: '20px',
    };

    const headerStyle = {
      paddingBottom: '20px',
    };

    const footerStyle = {
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

export default connect(
  state => state.app.toJS(),
  merge(
    actionCreators,
    { pushPath }
  )
)(App);
