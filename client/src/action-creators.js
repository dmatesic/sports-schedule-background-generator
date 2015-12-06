(function(actionCreators) {

    var React = require('react'),
        ReactDomServer = require('react-dom/server'),
        request = require('superagent'),
        util = require('util'),
        Background = require('./components/Background');

    actionCreators.windowResized = function(width, height) {
        return {
            type: 'WINDOW_RESIZED',
            width: width,
            height: height
        };
    };

    actionCreators.updateBackground = function(prop, val) {
        return {
            type: 'UPDATE_BACKGROUND',
            prop: prop,
            val: val
        };
    };

    actionCreators.loadTeams = function() {
        return function(dispatch) {
            dispatch({ type: 'AJAX_START' });

            request
            .get('team')
            .end(function(err, res) {
                if (err) {
                    dispatch({
                        type: 'AJAX_ERROR',
                        error: err
                    });
                }
                else {
                    dispatch({type: 'AJAX_SUCCESS'});

                    dispatch({
                        type: 'UPDATE_TEAMS',
                        teams: res.body
                    });
                }
            });
        }
    };

    actionCreators.updateSelectedTeam = function(teamName) {
        return function(dispatch) {
            dispatch({
                type: 'UPDATE_SELECTED_TEAM',
                selectedTeam: teamName
            });

            dispatch({ type: 'AJAX_START' });

            request
            .get('team/' + teamName + '/schedule')
            .end(function (err, res) {
                if (err) {
                    dispatch({
                        type: 'AJAX_ERROR',
                        error: err
                    });
                }
                else {
                    dispatch({type: 'AJAX_SUCCESS'});

                    dispatch({
                        type: 'UPDATE_SCHEDULE',
                        schedule: res.body
                    })
                }
            });
        }
    };

    actionCreators.generateSchedule = function(props) {
        return function(dispatch) {
            dispatch({ type: 'AJAX_START' });

            var background = util.format(
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
                width: props.background.size.width
            })
            .end(function (err, res) {
                if (err) {
                    dispatch({
                        type: 'AJAX_ERROR',
                        error: err
                    });
                }
                else {
                    dispatch({type: 'AJAX_SUCCESS'});

                    var link = document.createElement('a');

                    link.download = 'schedule.png';
                    link.href = res.text;

                    document.body.appendChild(link);
                    link.click();

                    document.body.removeChild(link);
                    delete link;
                }
            });

            /*
             var newWindow = window.open();
             newWindow.document.write(background);
             */
        }
    };

})(module.exports);