import _ from 'lodash';
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
      width: (_.get(this, 'props.background.size.valid.width') || 0) + 'px',
      height: (_.get(this, 'props.background.size.valid.height') || 0) + 'px',
      paddingTop: (_.get(this, 'props.background.size.valid.padding.top') || 0) + 'px',
      paddingBottom: (_.get(this, 'props.background.size.valid.padding.bottom') || 0) + 'px',
      paddingLeft: (_.get(this, 'props.background.size.valid.padding.left') || 0) + 'px',
      paddingRight: (_.get(this, 'props.background.size.valid.padding.right') || 0) + 'px',
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
