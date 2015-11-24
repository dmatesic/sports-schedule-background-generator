(function() {

    var _ = require('lodash'),
        React = require('react');

    module.exports = React.createClass({
        componentWillMount: function() {
            // http://stackoverflow.com/questions/23123138/perform-debounce-in-react-js
            this.delayedOnInputChange = _.debounce(this.updateProp, 300);
        },
        updateProp: function(event) {
            this.props.updateProp(event.target.id.replace(new RegExp('-', 'g'), '.'), Number(event.target.value));
        },
        onInputChange: function(event) {
            event.persist();
            this.delayedOnInputChange(event);
        },
        /*onInputChangeWithoutDebounce: function(event) {
            this.updateProp(event);
        },*/
        onSelectTeam: function(event) {
            this.props.loadSchedule(event.target.value);
        },
        onClickGenerateScreenshot: function() {
            this.props.generateSchedule(this.props);
        },
        render: function() {
            var teamOptionNodes = this.props.teams.map(function(team, index){
                return <option value={team} key={index}>{team}</option>
            });

            return (
                <div id="controls">
                    <div>
                        <div className="form-group form-group-large">
                            <label htmlFor="selectedTeam">Team</label>
                            <select className="form-control" id="selectedTeam" onChange={this.onSelectTeam}>
                                <option disabled value={true}>Select a Team</option>
                                {teamOptionNodes}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="background-size-width">Width</label>
                            <div className="input-group">
                                <input type="text" className="form-control" id="background-size-width" defaultValue={this.props.background.size.width} onChange={this.onInputChange} />
                                <div className="input-group-addon">px</div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="background-size-height">Height</label>
                            <div className="input-group">
                                <input type="text" className="form-control" id="background-size-height" defaultValue={this.props.background.size.height} onChange={this.onInputChange} />
                                <div className="input-group-addon">px</div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="background-padding-top">Top Padding</label>
                            <div className="input-group">
                                <input type="text" className="form-control" id="background-padding-top" defaultValue={this.props.background.padding.top} onChange={this.onInputChange} />
                                <div className="input-group-addon">px</div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="background-padding-bottom">Bottom Padding</label>
                            <div className="input-group">
                                <input type="text" className="form-control" id="background-padding-bottom" defaultValue={this.props.background.padding.bottom} onChange={this.onInputChange} />
                                <div className="input-group-addon">px</div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="background-padding-left">Left Padding</label>
                            <div className="input-group">
                                <input type="text" className="form-control" id="background-padding-left" defaultValue={this.props.background.padding.left} onChange={this.onInputChange} />
                                <div className="input-group-addon">px</div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="background-padding-right">Right Padding</label>
                            <div className="input-group">
                                <input type="text" className="form-control" id="background-padding-right" defaultValue={this.props.background.padding.right} onChange={this.onInputChange} />
                                <div className="input-group-addon">px</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button type="button" className="btn btn-primary" onClick={this.onClickGenerateScreenshot}>Generate Screenshot</button>
                    </div>
                </div>
            );
        }
    });

})();