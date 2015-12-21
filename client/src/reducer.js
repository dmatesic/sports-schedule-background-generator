import _ from 'lodash';
import querystring from 'querystring';
import Immutable from 'immutable';
import { maxSquareSize, parseIntStrict } from './math-functions';
import { INITIAL_STATE, ACTION, QUERY_PARAM_NAME } from './constants';

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
    return maxSquareSize(
      state.getIn('background.size.width'.split('.'), 0) - state.getIn('background.padding.left'.split('.'), 0) - state.getIn('background.padding.right'.split('.'), 0),
      state.getIn('background.size.height'.split('.'), 0) - state.getIn('background.padding.top'.split('.'), 0) - state.getIn('background.padding.bottom'.split('.'), 0),
      state.get('schedule', Immutable.List()).size
    );
  });
}

function windowResized(state, width, height) {
  let nextState = state.updateIn('background.container.size'.split('.'), null, function updateIn() {
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
  let nextState = state.update('teams', null, function update() {
    return Immutable.fromJS(teams);
  });

  // Don't need to fetch teams once list is loaded
  nextState = nextState.updateIn('needToFetch.teams'.split('.'), null, function updateIn() {
    return false;
  });

  return nextState;
}

function updateSelectedTeam(state, selectedTeam) {
  let nextState = state.update('selectedTeam', null, function update() {
    return selectedTeam;
  });

  // Need to fetch schedule after selecting a team
  nextState = nextState.updateIn('needToFetch.schedule'.split('.'), null, function updateIn() {
    return true;
  });

  return nextState;
}

function updateSchedule(state, schedule) {
  const previousScheduleLength = state.get('schedule').size;
  const immutableSchedule = Immutable.List(schedule);

  let nextState = state.update('schedule', null, function update() {
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
  let nextState;
  const valAsInt = parseIntStrict(val);

  if (_.isNaN(valAsInt)) return state;

  nextState = state.updateIn(prop.split('.'), null, function updateIn() {
    return valAsInt;
  });

  nextState = _updateBackgroundPreviewSize(nextState);
  nextState = _updateTeamWidth(nextState);

  return nextState;
}

function updatePath(state, path) {
  let pathString = path;
  let pathObject;
  let nextState = state;

  if (!pathString) return state;

  // Remove leading /? characters
  while (pathString.charAt(0) === '/' || pathString.charAt(0) === '?') pathString = pathString.substr(1);

  pathObject = querystring.parse(pathString);

  if (pathObject.selectedTeam && pathObject.selectedTeam !== state.get('selectedTeam')) {
    nextState = updateSelectedTeam(nextState, pathObject.selectedTeam);
  }

  // TODO: Would probably be more efficient to update the whole background object at once, but is it worth it?
  _.each(QUERY_PARAM_NAME, function each(queryParamName, propName) {
    if (pathObject[queryParamName] && pathObject[queryParamName] !== state.getIn(propName.split('.'))) {
      nextState = updateBackground(nextState, propName, pathObject[queryParamName]);
    }
  });

  return nextState;
}

export default function exports(state = Immutable.fromJS(INITIAL_STATE), action) {
  switch (action.type) {
    case ACTION.WINDOW_RESIZED:
      return windowResized(state, action.width, action.height);
    case ACTION.AJAX_START:
      return ajaxStart(state);
    case ACTION.AJAX_SUCCESS:
      return ajaxSuccess(state);
    case ACTION.AJAX_ERROR:
      return ajaxError(state, action.error);
    case ACTION.UPDATE_TEAMS:
      return updateTeams(state, action.teams);
    case ACTION.UPDATE_SELECTED_TEAM:
      return updateSelectedTeam(state, action.selectedTeam);
    case ACTION.UPDATE_SCHEDULE:
      return updateSchedule(state, action.schedule);
    case ACTION.UPDATE_BACKGROUND:
      return updateBackground(state, action.prop, action.val);
    case ACTION.INIT_PATH:
      return updatePath(state, action.payload.path);
    case ACTION.UPDATE_PATH:
      return updatePath(state, action.payload.path);
    default:
      return state;
  }
}
