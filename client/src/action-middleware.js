(function actionMiddlewareModule(actionMiddleware) {
  actionMiddleware.logging = function logging(store) {
    return function (next) {
      return function (action) {
        console.log(action);

        return next(action);
      }
    }
  };
})(module.exports);
