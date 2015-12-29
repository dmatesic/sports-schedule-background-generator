import ReduxSimpleRouter from 'redux-simple-router';

export const QUERY_PARAM_NAME = {
  'width': 'width',
  'height': 'height',
  'padding.top': 'topPadding',
  'padding.bottom': 'bottomPadding',
  'padding.left': 'leftPadding',
  'padding.right': 'rightPadding',
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
    size: {
      default: {
        width: 1242,
        height: 2208,
        padding: {
          top: 580,
          bottom: 298,
          right: 123,
          left: 123,
        },
      },
    },
    container: {
      size: {
        width: null,
        height: null,
      },
    },
    preview: {
      scale: null,
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
  // TODO, Use ReduxSimpleRouter.INIT_PATH when it is exported (https,//github.com/jlongster/redux-simple-router/issues/105)
  INIT_PATH: '@@router/INIT_PATH',
  UPDATE_PATH: ReduxSimpleRouter.UPDATE_PATH,
};
