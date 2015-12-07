(function() {
    
    var React = require('react'),
        ReactDOM = require('react-dom'),
        Team = require('./Team');

    module.exports = React.createClass({
        render: function() {
            var style = {
                width: this.props.background.size.width + 'px',
                height: this.props.background.size.height + 'px',
                paddingTop: this.props.background.padding.top + 'px',
                paddingBottom: this.props.background.padding.bottom + 'px',
                paddingLeft: this.props.background.padding.left + 'px',
                paddingRight: this.props.background.padding.right + 'px'
            };

            var opponentTeamNodes = this.props.schedule.map(function(opponentTeam, index){
                return <Team key={index} team={opponentTeam} {...this.props} />;
            }.bind(this));

            return (
                <div ref="opponentTeams" style={style}>{opponentTeamNodes}</div>
            );
        }
    });
    
})();