(function backgroundPreviewModule() {
  var React = require('react');
  var PureRenderMixin = require('react-addons-pure-render-mixin');
  var Background = require('./Background');

  module.exports = React.createClass({
    propTypes: {
      background: React.PropTypes.object,
    },
    mixins: [PureRenderMixin],
    render: function render() {
      var style = {
        border: '3px dashed black',
        display: 'inline-block',
        WebkitTransformOrigin: '0 0 0',
        MozTransformOrigin: '0 0 0',
        msTransformOrigin: '0 0 0',
        OTransformOrigin: '0 0 0',
        WebkitTransform: 'scale(' + this.props.background.preview.scale + ')',
        MozTransform: 'scale(' + this.props.background.preview.scale + ')',
        msTransform: 'scale(' + this.props.background.preview.scale + ')',
        OTransform: 'scale(' + this.props.background.preview.scale + ')',
        marginBottom: '-' + this.props.background.size.height + 'px', // Remove empty whitespace created by scale
      };

      return (
        <div style={style}>
          <Background {...this.props} />
        </div>
      );
    },
  });
})();
