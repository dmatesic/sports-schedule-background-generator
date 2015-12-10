(function reducerModule() {
  var _ = require('lodash');
  var querystring = require('querystring');
  var Immutable = require('immutable');
  var ReduxSimpleRouter = require('redux-simple-router');
  var util = require('./util');

  var _initialState = {
    needToFetch: {
      schedule: false,
    },
    ajax: {
      working: false,
      error: null,
    },
    teams: [],
    schedule: [],
    background: {
      container: {
        size: {
          width: null,
          height: null,
        },
      },
      preview: {
        scale: null,
      },
      size: {
        width: 1242,
        height: 2208,
      },
      padding: {
        top: 580,
        bottom: 298,
        right: 123,
        left: 123,
      },
      team: {
        size: {
          width: null,
        },
      },
    },
  };

  function _updateBackgroundPreviewSize(state) {
    return state.updateIn('background.preview.scale'.split('.'), null, function updateIn() {
      return Math.min(
        (state.getIn('background.container.size.height'.split('.'), 0) / state.getIn('background.size.height'.split('.'), 0)),
        1
      );
    });
  }

  function _updateTeamWidth(state) {
    return state.updateIn('background.team.size.width'.split('.'), null, function updateIn() {
      return util.maxSquareSize(
        state.getIn('background.size.width'.split('.'), 0) - state.getIn('background.padding.left'.split('.'), 0) - state.getIn('background.padding.right'.split('.'), 0),
        state.getIn('background.size.height'.split('.'), 0) - state.getIn('background.padding.top'.split('.'), 0) - state.getIn('background.padding.bottom'.split('.'), 0),
        state.get('schedule', Immutable.List()).size
      );
    });
  }

  function windowResized(state, width, height) {
    var nextState = state.updateIn('background.container.size'.split('.'), null, function updateIn() {
      return Immutable.fromJS({
        width: width,
        height: height,
      });
    });

    nextState = _updateBackgroundPreviewSize(nextState);
    nextState = _updateTeamWidth(nextState);

    return nextState;
  }

  function ajaxStart(state) {
    return state.updateIn('ajax.working'.split('.'), null, function updateIn() {
      return true;
    });
  }

  function ajaxSuccess(state) {
    return state.updateIn('ajax.working'.split('.'), null, function updateIn() {
      return false;
    });
  }

  function ajaxError(state, error) {
    return state.update('ajax', null, function update() {
      return Immutable.fromJS({
        working: false,
        error: error,
      });
    });
  }

  function updateTeams(state, teams) {
    return state.update('teams', null, function update() {
      return Immutable.fromJS(teams);
    });
  }

  function updateSelectedTeam(state, selectedTeam) {
    var nextState = state.update('selectedTeam', null, function update() {
      return selectedTeam;
    });

    nextState = nextState.updateIn('needToFetch.schedule'.split('.'), null, function updateIn() {
      return true;
    });

    return nextState;
  }

  function updateSchedule(state, schedule) {
    var previousScheduleLength = state.get('schedule').size;
    var immutableSchedule = Immutable.List(schedule);

    var nextState = state.update('schedule', null, function update() {
      return immutableSchedule;
    });

    nextState = nextState.updateIn('needToFetch.schedule'.split('.'), null, function updateIn() {
      return false;
    });

    if (previousScheduleLength !== immutableSchedule.size) {
      nextState = _updateBackgroundPreviewSize(nextState);
      nextState = _updateTeamWidth(nextState);
    }

    return nextState;
  }

  function updateBackground(state, prop, val) {
    var nextState = state.updateIn(prop.split('.'), null, function updateIn() {
      return val;
    });

    nextState = _updateBackgroundPreviewSize(nextState);
    nextState = _updateTeamWidth(nextState);

    return nextState;
  }

  function updatePath(state, path) {
    var pathString = path;
    var pathObject;
    var nextState;

    // Remove leading /? characters
    while (pathString.charAt(0) === '/' || pathString.charAt(0) === '?') pathString = pathString.substr(1);

    pathObject = querystring.parse(pathString);

    if (pathObject.selectedTeam && pathObject.selectedTeam !== state.get('selectedTeam')) {
      nextState = updateSelectedTeam(state, pathObject.selectedTeam);
    }

    return nextState || state;
  }

  module.exports = function exports(stateInput, action) {
    var state = stateInput;
    if (_.isUndefined(stateInput)) state = Immutable.fromJS(_initialState);

    switch (action.type) {
      case 'WINDOW_RESIZED':
        return windowResized(state, action.width, action.height);
      case 'AJAX_START':
        return ajaxStart(state);
      case 'AJAX_SUCCESS':
        return ajaxSuccess(state);
      case 'AJAX_ERROR':
        return ajaxError(state, action.error);
      case 'UPDATE_TEAMS':
        return updateTeams(state, action.teams);
      case 'UPDATE_SELECTED_TEAM':
        return updateSelectedTeam(state, action.selectedTeam);
      case 'UPDATE_SCHEDULE':
        return updateSchedule(state, action.schedule);
      case 'UPDATE_BACKGROUND':
        return updateBackground(state, action.prop, action.val);
      case ReduxSimpleRouter.UPDATE_PATH:
        return updatePath(state, action.path, action.avoidRouterUpdate);
      // TODO: Handle initPath
      default:
        return state;
    }
  };
})();
