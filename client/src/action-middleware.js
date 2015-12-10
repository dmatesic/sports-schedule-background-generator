(function actionMiddlewareModule(actionMiddleware) {
  actionMiddleware.logging = function logging() {
    return function nextFn(next) {
      return function actionFn(action) {
        /* eslint-disable no-console */
        // console.log(store, action);
        /* eslint-enable no-console */

        return next(action);
      };
    };
  };
})(module.exports);
