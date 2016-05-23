var App;
(function (App) {
    "use strict";
    // Create the module and define its dependencies.
    //angular.module("QtipDemo", []);
    /*class AngularModule {
        private AppModule: ng.IModule;

        constructor(appModule: string, dependencies: Array<string>) {
            this.AppModule = angular.module(appModule, dependencies);

        }

    }*/
    var TestController = (function () {
        function TestController($scope, $q) {
            this.$q = $q;
            this.config = {
                autoload: true,
                autoloadArgs: {},
                columns: [
                    { headerName: "Make", field: "make" },
                    { headerName: "Model", field: "model" },
                    { headerName: "Price", field: "price" }
                ],
                loader: function () {
                    var deferred = $q.defer();
                    var data = [
                        { make: "Toyota", model: "Celica", price: 35000 },
                        { make: "Ford", model: "Mondeo", price: 32000 },
                        { make: "Porsche", model: "Boxter", price: 72000 }
                    ];
                    deferred.resolve(data);
                    return deferred.promise;
                }
            };
        }
        TestController.prototype.getData = function () {
            var deferred = this.$q.defer();
            deferred.resolve([
                { make: "Toyota", model: "Celica", price: 35000 },
                { make: "Ford", model: "Mondeo", price: 32000 },
                { make: "Porsche", model: "Boxter", price: 72000 }
            ]);
            return deferred.promise;
        };
        TestController.$inject = ["$scope", "$q"];
        return TestController;
    }());
    /*
    
        function TestController($scope) {
    
            $scope.config = {
                autoload: true,
                columns: [
                    { headerName: "Make", field: "make" },
                    { headerName: "Model", field: "model" },
                    { headerName: "Price", field: "price" }
                ],
                loader:function() {
                    return [
                        { make: "Toyota", model: "Celica", price: 35000 },
                        { make: "Ford", model: "Mondeo", price: 32000 },
                        { make: "Porsche", model: "Boxter", price: 72000 }
                    ];
                }
            }
    
            //$scope.config.api.loadData();
    
        }
    */
    angular.module("commonGrid")
        .controller("TestController", TestController);
})(App || (App = {}));
//# sourceMappingURL=app.js.map