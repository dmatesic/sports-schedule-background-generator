import _ from 'lodash';
import querystring from 'querystring';
import { List, fromJS } from 'immutable';
import { maxSquareSize, parseIntStrict } from './math-functions';
import { INITIAL_STATE, ACTION, QUERY_PARAM_NAME } from './constants';

function _updateBackgroundPreviewSize(state) {
  return state.updateIn('background.preview.scale'.split('.'), null, function updateIn() {
    return Math.min(
      (state.getIn('background.container.size.height'.split('.'), 0) / state.getIn('background.size.valid.height'.split('.'), 0)),
      1
    );
  });
}

function _updateTeamWidth(state) {
  return state.updateIn('background.team.size.width'.split('.'), null, function updateIn() {
    return maxSquareSize(
      state.getIn('background.size.valid.width'.split('.'), 0) - state.getIn('background.size.valid.padding.left'.split('.'), 0) - state.getIn('background.size.valid.padding.right'.split('.'), 0),
      state.getIn('background.size.valid.height'.split('.'), 0) - state.getIn('background.size.valid.padding.top'.split('.'), 0) - state.getIn('background.size.valid.padding.bottom'.split('.'), 0),
      state.get('schedule', new List()).size
    );
  });
}

function _updateBackgroundSize(state, backgroundSize) {
  let nextState;
  const widthIsValid = backgroundSize.width >= 300 && backgroundSize.width <= 3000;
  const heightIsValid = backgroundSize.height >= 300 && backgroundSize.height <= 3000;
  const widthPlusPaddingIsValid = (((backgroundSize.padding.left || 0) + (backgroundSize.padding.right || 0)) <= (backgroundSize.width || 0) * 0.9);
  const heightPlusPaddingIsValid = (((backgroundSize.padding.top || 0) + (backgroundSize.padding.bottom || 0)) <= (backgroundSize.height || 0) * 0.9);
  const backgroundSizeIsValid = widthIsValid && heightIsValid && widthPlusPaddingIsValid && heightPlusPaddingIsValid;

  nextState = state.updateIn('background.size.error'.split('.'), null, function updateIn() {
    return fromJS({
      width: widthIsValid ? null : 'Width should be between 300 and 3000',
      height: heightIsValid ? null : 'Height should be between 300 and 3000',
      widthPlusPadding: widthPlusPaddingIsValid ? null : 'Padding should not exceed 90% of width',
      heightPlusPadding: heightPlusPaddingIsValid ? null : 'Padding should not exceed 90% of height',
    });
  });

  nextState = nextState.updateIn('background.size.current'.split('.'), null, function updateIn() {
    return fromJS(backgroundSize);
  });

  if (backgroundSizeIsValid) {
    nextState = nextState.updateIn('background.size.valid'.split('.'), null, function updateIn() {
      return fromJS(backgroundSize);
    });

    nextState = _updateBackgroundPreviewSize(nextState);
    nextState = _updateTeamWidth(nextState);
  }

  return nextState;
}

function windowResized(state, width, height) {
  let nextState = state.updateIn('background.container.size'.split('.'), null, function updateIn() {
    return fromJS({
      width,
      height,
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
    return fromJS({
      working: false,
      error,
    });
  });
}

function updateTeams(state, teams) {
  let nextState = state.update('teams', null, function update() {
    return fromJS(teams);
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
  const immutableSchedule = new List(schedule);

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

function updatePath(state, path) {
  let pathString = path;
  let pathObject;
  let nextState = state;
  const backgroundSize = {};
  let propVal;

  if (!pathString) return state;

  // Remove leading /? characters
  while (pathString.charAt(0) === '/' || pathString.charAt(0) === '?') pathString = pathString.substr(1);

  pathObject = querystring.parse(pathString);

  if (pathObject.selectedTeam && pathObject.selectedTeam !== state.get('selectedTeam')) {
    nextState = updateSelectedTeam(nextState, pathObject.selectedTeam);
  }

  _.each(QUERY_PARAM_NAME, function each(queryParamName, propName) {
    propVal = parseIntStrict(pathObject[queryParamName]) || 0;
    _.set(backgroundSize, propName, propVal);
  });

  nextState = _updateBackgroundSize(nextState, backgroundSize);

  return nextState;
}

export default function exports(state = fromJS(INITIAL_STATE), action) {
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
    case ACTION.INIT_PATH:
      return updatePath(state, action.payload.path);
    case ACTION.UPDATE_PATH:
      return updatePath(state, action.payload.path);
    default:
      return state;
  }
}
