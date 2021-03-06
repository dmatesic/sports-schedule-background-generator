import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import moment from 'moment';

export default React.createClass({
  propTypes: {
    background: React.PropTypes.object,
    team: React.PropTypes.object,
  },
  mixins: [PureRenderMixin],
  render: function render() {
    const containerStyle = {
      display: 'inline-block',
      position: 'relative',
      height: 'auto',
      // NOTE: Unable to set padding globally and overwrite passingBottom, React doesn't like it
      paddingTop: this.props.background.team.size.width * 0.2 + 'px',
      paddingBottom: 0,
      paddingLeft: this.props.background.team.size.width * 0.2 + 'px',
      paddingRight: this.props.background.team.size.width * 0.2 + 'px',
    };

    const imageStyle = {
      width: this.props.background.team.size.width * 0.6 + 'px',
      height: this.props.background.team.size.width * 0.6 + 'px',
      verticalAlign: 'middle',
      backgroundImage: 'url("' + this.props.team.imageUri + '")',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      backgroundPosition: 'center',
    };

    const dateStyle = {
      textAlign: 'center',
      padding: this.props.background.team.size.width * 0.015 + 'px',
      fontFamily: 'Helvetica, sans-serif',
      fontSize: this.props.background.team.size.width * 0.12 + 'px',
      fontWeight: 'bold',
    };

    return (
      <div style={containerStyle}>
        <div style={imageStyle}></div>
        <div style={dateStyle}>{moment(this.props.team.date, 'M/D/YYYY').format('M/D')}</div>
      </div>
    );
  },
});
