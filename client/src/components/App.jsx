(function() {

    var React = require('react'),
        ReactDOM = require('react-dom'),
        ReactRedux = require('react-redux'),
        Controls = require('./Controls'),
        BackgroundPreview = require('./BackgroundPreview'),
        actionCreators = require('../action-creators');

    var App = React.createClass({
        componentDidMount: function() {
            window.addEventListener('resize', this.onWindowResize);
            this.onWindowResize();
        },
        onWindowResize: function() {
            // TODO: Should be able to update all props in one dispatch
            this.props.updateProp('background.container.size.width', window.innerWidth);
            this.props.updateProp(
                'background.container.size.height',
                window.innerHeight -
                40 - //TODO: Why is ReactDOM.findDOMNode(this.refs.app).outerHeight undefined?
                ReactDOM.findDOMNode(this.refs.header).offsetHeight -
                ReactDOM.findDOMNode(this.refs.footer).offsetHeight
            );
        },
        render: function() {
            var appStyle = {
                padding: '20px'
            };

            var headerStyle = {
                paddingBottom: '20px'
            };

            var footerStyle = {
              height: '20px'
            };

            return (
                <div ref="app" style={appStyle}>
                    <div id="header" ref="header" style={headerStyle}>
                        <Controls{...this.props} />
                    </div>
                    <BackgroundPreview {...this.props} />
                    <div id="footer" ref="footer" style={footerStyle}></div>
                </div>
            );
        }
    });

    function mapStateToProps(state) {
        // TODO: This might be very inefficient
        return state.toJS();
    }

    module.exports = ReactRedux.connect(
        mapStateToProps,
        actionCreators
    )(App);

})();