var App;
(function (App) {
    "use strict";
    // Create the module and define its dependencies.
    angular.module("QtipDemo", []);
    var AngularModule = (function () {
        function AngularModule(appModule, dependencies) {
            this.AppModule = angular.module(appModule, dependencies);
        }
        return AngularModule;
    }());
})(App || (App = {}));
//# sourceMappingURL=app.js.map