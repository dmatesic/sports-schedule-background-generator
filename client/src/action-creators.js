(function(actionCreators) {

    var React = require('react'),
        ReactDomServer = require('react-dom/server'),
        request = require('superagent'),
        util = require('util'),
        Background = require('./components/Background');

    actionCreators.updateProp = function(prop, val) {
        return {
            type: 'UPDATE_PROP',
            prop: prop,
            val: val
        };
    };

    actionCreators.loadTeams = function() {
        return function(dispatch) {
            request
            .get('team')
            .end(function(err, res) {
                if (err) console.error(err);
                else {
                    dispatch({
                        type: 'UPDATE_PROP',
                        prop: 'teams',
                        val: res.body
                    })
                }
            });
        }
    };

    actionCreators.loadSchedule = function(teamName) {
        return function(dispatch) {
            request
            .get('team/' + teamName + '/schedule')
            .end(function (err, res) {
                if (err) console.error(err);
                else {
                    dispatch({
                        type: 'UPDATE_PROP',
                        prop: 'schedule',
                        val: res.body
                    })
                }
            });
        }
    };

    actionCreators.generateSchedule = function(props) {
        return function(dispatch) {
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
                if (err) console.error(err);
                else {
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