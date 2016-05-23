var TestGridApp;
(function (TestGridApp) {
    var Services;
    (function (Services) {
        var AppServices = (function () {
            function AppServices($q, $http) {
                this.$q = $q;
                this.$http = $http;
            }
            AppServices.prototype.getGridData = function (criteria) {
                var deferred = this.$q.defer();
                console.log(criteria);
                this.$http.get('http://localhost:56075/Scripts/TestGrid/data.json').then(function (response) {
                    var result = [];
                    result = angular.fromJson(response.data.instructions);
                    /*if (!criteria.managerCode) {
                        result = angular.fromJson(response.data.instructions);
                    } else {
                        angular.forEach(angular.fromJson(response.data.instructions),
                            function(value, key) {
                                angular.forEach(value,
                                    function(value2, key2) {
                                        if (value2 === criteria.managerCode) {
                                            result.push(value2);
                                        }
                                    });
                            });
                    }*/
                    deferred.resolve(result);
                }, function (errors) {
                    //self.$log.debug(errors);
                    deferred.reject(errors.data);
                });
                return deferred.promise;
            };
            return AppServices;
        }());
        Services.AppServices = AppServices;
        angular.module('TestGridApp')
            .service("AppServices", AppServices);
    })(Services = TestGridApp.Services || (TestGridApp.Services = {}));
})(TestGridApp || (TestGridApp = {}));
var TestGridApp;
(function (TestGridApp) {
    var Services;
    (function (Services) {
        var Shared;
        (function (Shared) {
            var SiCriteria = TestGridApp.ViewModel.SiCriteria;
            var SharedDataService = (function () {
                function SharedDataService() {
                    this.siCriteria = new SiCriteria();
                    this.siCriteria.managerCode = "BNP";
                }
                return SharedDataService;
            }());
            Shared.SharedDataService = SharedDataService;
            angular.module("TestGridApp")
                .factory("SharedService", function () { return new SharedDataService(); });
        })(Shared = Services.Shared || (Services.Shared = {}));
    })(Services = TestGridApp.Services || (TestGridApp.Services = {}));
})(TestGridApp || (TestGridApp = {}));
//# sourceMappingURL=AppServices.js.map