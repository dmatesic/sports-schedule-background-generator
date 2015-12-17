import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Team from './Team';

export default React.createClass({
  propTypes: {
    background: React.PropTypes.object,
    schedule: React.PropTypes.array,
  },
  mixins: [PureRenderMixin],
  render: function render() {
    const style = {
      width: this.props.background.size.width + 'px',
      height: this.props.background.size.height + 'px',
      paddingTop: this.props.background.padding.top + 'px',
      paddingBottom: this.props.background.padding.bottom + 'px',
      paddingLeft: this.props.background.padding.left + 'px',
      paddingRight: this.props.background.padding.right + 'px',
    };

    const opponentTeamNodes = this.props.schedule.map(function map(opponentTeam, index) {
      return (
        <Team key={index} team={opponentTeam} {...this.props} />
      );
    }.bind(this));

    return (
      <div ref="opponentTeams" style={style}>{opponentTeamNodes}</div>
    );
  },
});
