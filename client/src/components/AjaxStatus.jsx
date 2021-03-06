import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default React.createClass({
  propTypes: {
    ajax: React.PropTypes.object,
  },
  mixins: [PureRenderMixin],
  render: function render() {
    const ajaxStatusStyle = {
      display: (this.props.ajax.working || this.props.ajax.error) ? 'block' : 'none',
    };

    const ajaxBackgroundStyle = {
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'black',
      opacity: 0.3,
      zIndex: 1000,
    };

    const ajaxSpinnerStyle = {
      display: (this.props.ajax.working && !this.props.ajax.error) ? 'block' : 'none',
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      margin: 'auto',
      backgroundImage: 'url(resources/images/ajax-spinner.gif)',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      zIndex: 999,
    };

    const ajaxErrorStyle = {
      display: (this.props.ajax.error) ? 'block' : 'none',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };

    return (
      <div style={ajaxStatusStyle}>
        <div style={ajaxBackgroundStyle}></div>
        <div style={ajaxSpinnerStyle}></div>
        <div style={ajaxErrorStyle}>
          <div className="alert alert-danger">
            <span className="glyphicon glyphicon-exclamation-sign"></span>
            <strong> Unexpected error occurred</strong>
          </div>
        </div>
      </div>
    );
  },
});
