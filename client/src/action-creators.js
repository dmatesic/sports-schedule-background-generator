import { format } from 'util';
import React from 'react';
import ReactDomServer from 'react-dom/server';
import request from 'superagent';

import Background from './components/Background';

export function windowResized(width, height) {
  return {
    type: 'WINDOW_RESIZED',
    width: width,
    height: height,
  };
}

export function updateBackground(prop, val) {
  return {
    type: 'UPDATE_BACKGROUND',
    prop: prop,
    val: val,
  };
}

export function loadTeams() {
  return function dispatchFn(dispatch) {
    dispatch({ type: 'AJAX_START' });

    request
    .get('team')
    .end(function end(err, res) {
      if (err) {
        dispatch({
          type: 'AJAX_ERROR',
          error: err,
        });
      } else {
        dispatch({ type: 'AJAX_SUCCESS' });

        dispatch({
          type: 'UPDATE_TEAMS',
          teams: res.body,
        });
      }
    });
  };
}

export function loadSchedule(teamName) {
  return function dispatchFn(dispatch) {
    dispatch({ type: 'AJAX_START' });

    request
    .get('team/' + teamName + '/schedule')
    .end(function end(err, res) {
      if (err) {
        dispatch({
          type: 'AJAX_ERROR',
          error: err,
        });
      } else {
        dispatch({ type: 'AJAX_SUCCESS' });

        dispatch({
          type: 'UPDATE_SCHEDULE',
          schedule: res.body,
        });
      }
    });
  };
}

export function generateSchedule(props) {
  return function dispatchFn(dispatch) {
    let background;

    dispatch({ type: 'AJAX_START' });

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
          type: 'AJAX_ERROR',
          error: err,
        });
      } else {
        dispatch({ type: 'AJAX_SUCCESS' });

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
