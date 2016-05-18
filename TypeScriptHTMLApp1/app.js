var App;
(function (App) {
    "use strict";
    // Create the module and define its dependencies.
    angular.module("QtipDemo", []);
    class AngularModule {
        constructor(appModule, dependencies) {
            this.AppModule = angular.module(appModule, dependencies);
        }
    }
})(App || (App = {}));
//# sourceMappingURL=app.js.map