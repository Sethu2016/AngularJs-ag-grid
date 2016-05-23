

module App {
    "use strict";

    // Create the module and define its dependencies.
    //angular.module("QtipDemo", []);


    /*class AngularModule {
        private AppModule: ng.IModule;

        constructor(appModule: string, dependencies: Array<string>) {
            this.AppModule = angular.module(appModule, dependencies);

        }

    }*/

    class TestController {

        config: any;
        $q: ng.IQService;
        static $inject = ["$scope", "$q"];
        constructor($scope: ng.IScope, $q: ng.IQService) {

            this.$q = $q;
            this.config = {
                autoload: true,
                autoloadArgs:{},
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

            }
        }

        private getData(): any {
            var deferred = this.$q.defer();
            deferred.resolve([
                { make: "Toyota", model: "Celica", price: 35000 },
                { make: "Ford", model: "Mondeo", price: 32000 },
                { make: "Porsche", model: "Boxter", price: 72000 }
            ]);

            return deferred.promise;
        }

    }

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

}



