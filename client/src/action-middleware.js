(function(actionMiddleware) {

    actionMiddleware.logging = function(store) {
        return function(next) {
            return function(action) {
                console.log(action);

                return next(action);
            }
        }
    };

})(module.exports);