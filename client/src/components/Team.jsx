(function() {

    // TODO: Use pure component mixin

    var React = require('react'),
        moment = require('moment');

    module.exports = React.createClass({
        render: function () {

            var containerStyle = {
                display: 'inline-block',
                position: 'relative',
                height: 'auto',
                // NOTE: Unable to set padding globally and overwrite passingBottom, React doesn't like it
                paddingTop: this.props.background.team.size.width * 0.2 + 'px',
                paddingBottom: 0,
                paddingLeft: this.props.background.team.size.width * 0.2 + 'px',
                paddingRight: this.props.background.team.size.width * 0.2 + 'px'
            };

            var imageStyle = {
                width: this.props.background.team.size.width * 0.6 + 'px',
                height: this.props.background.team.size.width * 0.6 + 'px',
                verticalAlign: 'middle',
                backgroundImage: 'url("' + this.props.team.imageUri + '")',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'center'
            };

            var dateStyle = {
                textAlign: 'center',
                padding: this.props.background.team.size.width * 0.015 + 'px',
                fontFamily: 'Helvetica, sans-serif',
                fontSize: this.props.background.team.size.width * 0.12 + 'px',
                fontWeight: 'bold'
            };

            return (
                <div style={containerStyle}>
                    <div style={imageStyle}></div>
                    <div style={dateStyle}>{moment(this.props.team.date, 'M/D/YYYY').format('M/D')}</div>
                </div>
            )
        }
    });
})();