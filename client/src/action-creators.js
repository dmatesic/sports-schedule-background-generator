import { format } from 'util';
import React from 'react';
import ReactDomServer from 'react-dom/server';
import request from 'superagent';
import { ACTION } from './constants';

import Background from './components/Background';

export function windowResized(width, height) {
  return {
    type: ACTION.WINDOW_RESIZED,
    width: width,
    height: height,
  };
}

export function loadTeams() {
  return function dispatchFn(dispatch) {
    dispatch({ type: ACTION.AJAX_START });

    request
    .get('team')
    .end(function end(err, res) {
      if (err) {
        dispatch({
          type: ACTION.AJAX_ERROR,
          error: err,
        });
      } else {
        dispatch({ type: ACTION.AJAX_SUCCESS });

        dispatch({
          type: ACTION.UPDATE_TEAMS,
          teams: res.body,
        });
      }
    });
  };
}

export function loadSchedule(teamName) {
  return function dispatchFn(dispatch) {
    dispatch({ type: ACTION.AJAX_START });

    request
    .get('team/' + teamName + '/schedule')
    .end(function end(err, res) {
      if (err) {
        dispatch({
          type: ACTION.AJAX_ERROR,
          error: err,
        });
      } else {
        dispatch({ type: ACTION.AJAX_SUCCESS });

        dispatch({
          type: ACTION.UPDATE_SCHEDULE,
          schedule: res.body,
        });
      }
    });
  };
}

export function generateSchedule(props) {
  return function dispatchFn(dispatch) {
    let background;

    dispatch({ type: ACTION.AJAX_START });

    background = format(
      '<html>' +
      '<head><base href="%s"></head>' +
      '<body>%s</body>' +
      '</html>',
      window.location.origin,
      ReactDomServer.renderToStaticMarkup(< Background {...props}/>)
    );

    request
    .post('screenshot')
    .send({
      html: background,
      height: props.background.size.height,
      width: props.background.size.width,
    })
    .end(function end(err, res) {
      let link;

      if (err) {
        dispatch({
          type: ACTION.AJAX_ERROR,
          error: err,
        });
      } else {
        dispatch({ type: ACTION.AJAX_SUCCESS });

        link = document.createElement('a');

        link.download = 'schedule.png';
        link.href = res.text;

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
      }
    });

    /*
     var newWindow = window.open();
     newWindow.document.write(background);
     */
  };
}
