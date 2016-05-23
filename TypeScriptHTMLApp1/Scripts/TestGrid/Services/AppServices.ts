module TestGridApp.Services {
    import ISiViewModel = TestGridApp.ViewModel.ISiViewModel;
    import SiCriteria = TestGridApp.ViewModel.ISiCriteria;

    export class AppServices {

        $q: ng.IQService;
        $http: ng.IHttpService;

        constructor($q: ng.IQService, $http: ng.IHttpService) {
            this.$q = $q;
            this.$http = $http;
        }

        getGridData(criteria:SiCriteria): ng.IPromise<Array<ISiViewModel>> {
            var deferred = this.$q.defer();
            console.log(criteria);
            this.$http.get('http://localhost:56075/Scripts/TestGrid/data.json').then(
                (response: any) => {

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
                },
                errors => {
                    //self.$log.debug(errors);
                    deferred.reject(errors.data);
                }
            );

            return deferred.promise;
        }
    }

    angular.module('TestGridApp')
        .service("AppServices", AppServices);
}

module TestGridApp.Services.Shared {
    import ISiCriteria = TestGridApp.ViewModel.ISiCriteria;
    import SiCriteria = TestGridApp.ViewModel.SiCriteria;
    export class SharedDataService {
        siCriteria: ISiCriteria;

        constructor() {
            this.siCriteria = new SiCriteria();
            this.siCriteria.managerCode = "BNP";
        }
    }

    angular.module("TestGridApp")
        .factory("SharedService",
            () => new SharedDataService());
}