(function actionCreatorsModule(actionCreators) {
  var React = require('react');
  var ReactDomServer = require('react-dom/server');
  var request = require('superagent');
  var util = require('util');
  var Background = require('./components/Background');

  actionCreators.windowResized = function windowResized(width, height) {
    return {
      type: 'WINDOW_RESIZED',
      width: width,
      height: height,
    };
  };

  actionCreators.updateBackground = function updateBackground(prop, val) {
    return {
      type: 'UPDATE_BACKGROUND',
      prop: prop,
      val: val,
    };
  };

  actionCreators.loadTeams = function loadTeams() {
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
  };

  actionCreators.loadSchedule = function loadSchedule(teamName) {
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
  };

  actionCreators.generateSchedule = function generateSchedule(props) {
    return function dispatchFn(dispatch) {
      var background;

      dispatch({ type: 'AJAX_START' });

      background = util.format(
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
        var link;

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
  };
})(module.exports);
