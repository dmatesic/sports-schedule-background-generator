(function() {

    var _ = require('lodash'),
        Immutable = require('immutable'),
        util = require('./util');

    function updateProp(state, prop, val) {
        // TODO: Update state with padding values to center x/y, would be max val for padding on each side where team width doesn't decrease
        // TODO: Validation before updating the state

        // TODO: Is updateIn the correct function to use here? Don't care about the pre-existing val
        var nextState = state.updateIn(prop.split('.'), null, function() {
            return val;
        })

        // TODO: Should only update teamWidth if schedule.length changes, not schedule
        var updateTeamWidth = _.some([
            'schedule',
            'background.size',
            'background.padding'
        ], function(validPropStart) {
            return prop.startsWith(validPropStart)
        });

        var updateBackgroundPreviewSize = _.some([
            'schedule',
            'background.container',
            'background.size',
            'background.padding'
        ], function(validPropStart) {
            return prop.startsWith(validPropStart)
        });

        // Update size of background preview
        if (updateBackgroundPreviewSize) {
            nextState = nextState.updateIn('background.preview.scale'.split('.'), null, function() {
                return Math.min(
                    (nextState.getIn('background.container.size.height'.split('.'), 0) / nextState.getIn('background.size.height'.split('.'), 0)),
                    1
                );
            });
        }

        // Update size of team objects
        if (updateTeamWidth) {
            nextState = nextState.updateIn('background.team.size.width'.split('.'), null, function() {
                return util.maxSquareSize(
                    nextState.getIn('background.size.width'.split('.'), 0) - nextState.getIn('background.padding.left'.split('.'), 0) - nextState.getIn('background.padding.right'.split('.'), 0),
                    nextState.getIn('background.size.height'.split('.'), 0) - nextState.getIn('background.padding.top'.split('.'), 0) - nextState.getIn('background.padding.bottom'.split('.'), 0),
                    nextState.getIn('schedule'.split('.'), []).length
                );
            });
        }

        return nextState;
    }

    module.exports = function(state, action) {
        switch (action.type) {
            case 'UPDATE_PROP':
                return updateProp(state, action.prop, action.val);
        }

        return state;
    }
})();