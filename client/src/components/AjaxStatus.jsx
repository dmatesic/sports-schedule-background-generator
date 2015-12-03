(function() {

    var React = require('react'),
        moment = require('moment');

    module.exports = React.createClass({
        render: function () {

            var ajaxStatusStyle = {
                display: (this.props.ajax.working) ? 'block' : 'none'
            };

            var ajaxBackgroundtyle = {
                position: 'absolute',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'black',
                opacity: 0.3,
                zIndex: 1000
            }

            var ajaxSpinnerStyle = {
                position: 'absolute',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                margin: 'auto',
                backgroundImage: 'url(resources/images/ajax-spinner.gif)',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                zIndex: 999
            };

            return (
                <div style={ajaxStatusStyle}>
                    <div style={ajaxBackgroundtyle}></div>
                    <div style={ajaxSpinnerStyle}></div>
                </div>
            )
        }
    });
})();