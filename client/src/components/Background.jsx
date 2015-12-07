(function backgroundModule() {
  var React = require('react');
  var Team = require('./Team');

  module.exports = React.createClass({
    propTypes: {
      background: React.PropTypes.object,
      schedule: React.PropTypes.array,
    },
    render: function render() {
      var style = {
        width: this.props.background.size.width + 'px',
        height: this.props.background.size.height + 'px',
        paddingTop: this.props.background.padding.top + 'px',
        paddingBottom: this.props.background.padding.bottom + 'px',
        paddingLeft: this.props.background.padding.left + 'px',
        paddingRight: this.props.background.padding.right + 'px',
      };

      var opponentTeamNodes = this.props.schedule.map(function map(opponentTeam, index) {
        return (
          <Team key={index} team={opponentTeam} {...this.props} />
        );
      }.bind(this));

      return (
        <div ref="opponentTeams" style={style}>{opponentTeamNodes}</div>
      );
    },
  });
})();
