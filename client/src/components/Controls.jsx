(function controlsModule() {
  var _ = require('lodash');
  var querystring = require('querystring');
  var util = require('util');
  var React = require('react');
  var PureRenderMixin = require('react-addons-pure-render-mixin');

  module.exports = React.createClass({
    propTypes: {
      background: React.PropTypes.object,
      teams: React.PropTypes.array,
      updateBackground: React.PropTypes.func,
      updateSelectedTeam: React.PropTypes.func,
      generateSchedule: React.PropTypes.func,
      updatePath: React.PropTypes.func,
    },
    mixins: [PureRenderMixin],
    componentWillMount: function componentWillMount() {
      // http://stackoverflow.com/questions/23123138/perform-debounce-in-react-js
      this.delayedOnInputChange = _.debounce(this.updateProp, 300);
    },
    onInputChange: function onInputChange(event) {
      event.persist();
      this.delayedOnInputChange(event);
    },
    /* onInputChangeWithoutDebounce: function(event) {
     this.updateProp(event);
     }, */
    onSelectTeam: function onSelectTeam(event) {
      this.props.updatePath(util.format(
        '/?%s',
        querystring.stringify({ selectedTeam: event.target.value })
      ));
    },
    onClickGenerateScreenshot: function onClickGenerateScreenshot() {
      this.props.generateSchedule(this.props);
    },
    updateProp: function updateProp(event) {
      this.props.updateBackground(event.target.id.replace(new RegExp('-', 'g'), '.'), Number(event.target.value));
    },
    render: function render() {
      var teamOptionNodes = this.props.teams.map(function map(team, index) {
        return <option value={team} key={index}>{team}</option>;
      });

      return (
        <div id="controls">
          <div>
            <div className="form-group form-group-large">
              <label htmlFor="selectedTeam">Team</label>
              <select className="form-control" id="selectedTeam" onChange={this.onSelectTeam}>
                <option disabled value>Select a Team</option>
                {teamOptionNodes}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="background-size-width">Width</label>
              <div className="input-group">
                <input type="text" className="form-control" id="background-size-width"
                       defaultValue={this.props.background.size.width} onChange={this.onInputChange}/>
                <div className="input-group-addon">px</div>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="background-size-height">Height</label>
              <div className="input-group">
                <input type="text" className="form-control" id="background-size-height"
                       defaultValue={this.props.background.size.height} onChange={this.onInputChange}/>
                <div className="input-group-addon">px</div>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="background-padding-top">Top Padding</label>
              <div className="input-group">
                <input type="text" className="form-control" id="background-padding-top"
                       defaultValue={this.props.background.padding.top} onChange={this.onInputChange}/>
                <div className="input-group-addon">px</div>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="background-padding-bottom">Bottom Padding</label>
              <div className="input-group">
                <input type="text" className="form-control" id="background-padding-bottom"
                       defaultValue={this.props.background.padding.bottom} onChange={this.onInputChange}/>
                <div className="input-group-addon">px</div>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="background-padding-left">Left Padding</label>
              <div className="input-group">
                <input type="text" className="form-control" id="background-padding-left"
                       defaultValue={this.props.background.padding.left} onChange={this.onInputChange}/>
                <div className="input-group-addon">px</div>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="background-padding-right">Right Padding</label>
              <div className="input-group">
                <input type="text" className="form-control" id="background-padding-right"
                       defaultValue={this.props.background.padding.right} onChange={this.onInputChange}/>
                <div className="input-group-addon">px</div>
              </div>
            </div>
          </div>
          <div>
            <button type="button" className="btn btn-primary" onClick={this.onClickGenerateScreenshot}>Generate
              Screenshot
            </button>
          </div>
        </div>
      );
    },
  });
})();
