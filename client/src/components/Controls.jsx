import _ from 'lodash';
import querystring from 'querystring';
import { format } from 'util';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import classNames from 'classnames';
import { QUERY_PARAM_NAME, INITIAL_STATE } from '../constants';

export default React.createClass({
  propTypes: {
    selectedTeam: React.PropTypes.string,
    background: React.PropTypes.object,
    teams: React.PropTypes.array,
    location: React.PropTypes.object,
    updateSelectedTeam: React.PropTypes.func,
    generateSchedule: React.PropTypes.func,
    pushPath: React.PropTypes.func,
  },
  mixins: [PureRenderMixin],
  getDefaultProps: function getDefaultProps() {
    return INITIAL_STATE;
  },
  componentWillMount: function componentWillMount() {
    // http://stackoverflow.com/questions/23123138/perform-debounce-in-react-js
    // TODO: Not working ever since change to updating url instead of state directly
    // this.delayedOnInputChange = _.debounce(this.updateInput, 300);
  },
  /* onInputChange: function onInputChange(event) {
   event.persist();
   this.delayedOnInputChange(event);
   }, */
  onInputChangeWithoutDebounce: function onInputChangeWithoutDebounce(event) {
    this.updateInput(event);
  },
  onSelectTeam: function onSelectTeam(event) {
    const pathObject = _.merge(
      this.props.location.query, {
        selectedTeam: event.target.value,
      }
    );

    this.props.pushPath(format(
      '/?%s',
      querystring.stringify(pathObject)
    ));
  },
  onClickGenerateScreenshot: function onClickGenerateScreenshot() {
    this.props.generateSchedule(this.props);
  },
  updateInput: function updateInput(event) {
    const propName = event.target.id.replace(new RegExp('-', 'g'), '.');
    const queryParamName = QUERY_PARAM_NAME[propName];
    const updatedQueryObject = {};
    let pathObject;

    updatedQueryObject[queryParamName] = Number(event.target.value);

    pathObject = _.merge(this.props.location.query, updatedQueryObject);

    this.props.pushPath(format(
      '/?%s',
      querystring.stringify(pathObject)
    ));
  },
  render: function render() {
    const widthIsValid = this.props.background.size.error.width === null;
    const heightIsValid = this.props.background.size.error.height === null;
    const widthPlusPaddingIsValid = this.props.background.size.error.widthPlusPadding === null;
    const heightPlusPaddingIsValid = this.props.background.size.error.heightPlusPadding === null;
    const isValid = widthIsValid && heightIsValid && widthPlusPaddingIsValid && heightPlusPaddingIsValid;

    const widthInputControlClass = classNames({
      'input-group': true,
      'has-error': widthIsValid === false || widthPlusPaddingIsValid === false,
    });

    const heightInputControlClass = classNames({
      'input-group': true,
      'has-error': heightIsValid === false || heightPlusPaddingIsValid === false,
    });

    const widthPaddingInputControlClass = classNames({
      'input-group': true,
      'has-error': widthPlusPaddingIsValid === false,
    });

    const heightPaddingInputControlClass = classNames({
      'input-group': true,
      'has-error': heightPlusPaddingIsValid === false,
    });

    const teamOptionNodes = this.props.teams.map(function map(team, index) {
      return <option value={team} key={index}>{team}</option>;
    });

    let errorMessages;

    if (isValid === false) {
      errorMessages = (
        <div className="alert alert-danger" role="alert">
          {Object.keys(this.props.background.size.error).map(function map(errorType) {
            return <p key={errorType}><strong>{this.props.background.size.error[errorType]}</strong></p>;
          }.bind(this))}
        </div>
      );
    }

    return (
      <div id="controls">
        <div>
          <div className="form-group form-group-large">
            <label htmlFor="selectedTeam">Team</label>
            <select className="form-control" id="selectedTeam" value={this.props.selectedTeam} onChange={this.onSelectTeam}>
              <option disabled>Select a Team</option>
              {teamOptionNodes}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="width">Width</label>
            <div className={widthInputControlClass}>
              <input type="text" className="form-control" id="width" value={this.props.background.size.current.width} onChange={this.onInputChangeWithoutDebounce}/>
              <div className="input-group-addon">px</div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="height">Height</label>
            <div className={heightInputControlClass}>
              <input type="text" className="form-control" id="height" value={this.props.background.size.current.height} onChange={this.onInputChangeWithoutDebounce}/>
              <div className="input-group-addon">px</div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="padding-left">Left Padding</label>
            <div className={widthPaddingInputControlClass}>
              <input type="text" className="form-control" id="padding-left" value={this.props.background.size.current.padding.left} onChange={this.onInputChangeWithoutDebounce}/>
              <div className="input-group-addon">px</div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="padding-right">Right Padding</label>
            <div className={widthPaddingInputControlClass}>
              <input type="text" className="form-control" id="padding-right" value={this.props.background.size.current.padding.right} onChange={this.onInputChangeWithoutDebounce}/>
              <div className="input-group-addon">px</div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="padding-top">Top Padding</label>
            <div className={heightPaddingInputControlClass}>
              <input type="text" className="form-control" id="padding-top" value={this.props.background.size.current.padding.top} onChange={this.onInputChangeWithoutDebounce}/>
              <div className="input-group-addon">px</div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="padding-bottom">Bottom Padding</label>
            <div className={heightPaddingInputControlClass}>
              <input type="text" className="form-control" id="padding-bottom" value={this.props.background.size.current.padding.bottom} onChange={this.onInputChangeWithoutDebounce}/>
              <div className="input-group-addon">px</div>
            </div>
          </div>
        </div>
        { errorMessages }
        <div>
          <button type="button" className="btn btn-primary" onClick={this.onClickGenerateScreenshot}>Generate
            Screenshot
          </button>
        </div>
      </div>
    );
  },
});
