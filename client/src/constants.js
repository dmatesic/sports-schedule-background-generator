import ReduxSimpleRouter from 'redux-simple-router';

export const QUERY_PARAM_NAME = {
  'background.size.width': 'width',
  'background.size.height': 'height',
  'background.padding.top': 'topPadding',
  'background.padding.bottom': 'bottomPadding',
  'background.padding.left': 'leftPadding',
  'background.padding.right': 'rightPadding',
};

export const INITIAL_STATE = {
  needToFetch: {
    teams: true,
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
      width: null, // 1242,
      height: null, // 2208,
    },
    padding: {
      top: null, // 580,
      bottom: null, // 298,
      right: null, // 123,
      left: null, // 123,
    },
    team: {
      size: {
        width: null,
      },
    },
  },
};

export const ACTION = {
  WINDOW_RESIZED: 'WINDOW_RESIZED',
  AJAX_START: 'AJAX_START',
  AJAX_SUCCESS: 'AJAX_SUCCESS',
  AJAX_ERROR: 'AJAX_ERROR',
  UPDATE_TEAMS: 'UPDATE_TEAMS',
  UPDATE_SELECTED_TEAM: 'UPDATE_SELECTED_TEAM',
  UPDATE_SCHEDULE: 'UPDATE_SCHEDULE',
  UPDATE_BACKGROUND: 'UPDATE_BACKGROUND',
  // TODO, Use ReduxSimpleRouter.INIT_PATH when it is exported (https,//github.com/jlongster/redux-simple-router/issues/105)
  INIT_PATH: '@@router/INIT_PATH',
  UPDATE_PATH: ReduxSimpleRouter.UPDATE_PATH,
};
