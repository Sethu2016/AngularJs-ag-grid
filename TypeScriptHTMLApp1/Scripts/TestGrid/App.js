var TestGridApp;
(function (TestGridApp) {
    agGrid.initialiseAgGridWithAngular1(angular);
    angular.module('TestGridApp', ['agGrid']);
})(TestGridApp || (TestGridApp = {}));
var TestGridApp;
(function (TestGridApp) {
    var ViewModel;
    (function (ViewModel) {
        var SiViewModel = (function () {
            function SiViewModel() {
            }
            return SiViewModel;
        }());
        ViewModel.SiViewModel = SiViewModel;
        var SiCriteria = (function () {
            function SiCriteria() {
            }
            return SiCriteria;
        }());
        ViewModel.SiCriteria = SiCriteria;
    })(ViewModel = TestGridApp.ViewModel || (TestGridApp.ViewModel = {}));
})(TestGridApp || (TestGridApp = {}));
var TestGridApp;
(function (TestGridApp) {
    var Controllers;
    (function (Controllers) {
        var SiCriteriaController = (function () {
            function SiCriteriaController(sharedService) {
                this.siCriteia = sharedService.siCriteria;
                //this.siCriteia.managerCode = "BNP";
            }
            SiCriteriaController.$inject = ["SharedService"];
            return SiCriteriaController;
        }());
        Controllers.SiCriteriaController = SiCriteriaController;
        angular.module('TestGridApp')
            .controller('TestGridApp.Cotrollers.SiCriteriaController', SiCriteriaController);
    })(Controllers = TestGridApp.Controllers || (TestGridApp.Controllers = {}));
})(TestGridApp || (TestGridApp = {}));
var TestGridApp;
(function (TestGridApp) {
    var Controllers;
    (function (Controllers) {
        var GridController = (function () {
            function GridController(appservices, sharedService) {
                var _this = this;
                this.appServices = appservices;
                this.sharedService = sharedService;
                appservices.getGridData(sharedService.siCriteria)
                    .then(function (response) {
                    console.log(response);
                    //this.instructions = response;
                    _this.gridOptions.api.setRowData(response);
                });
                this.gridOptions = {
                    columnDefs: [
                        { headerName: "Id", field: "id" },
                        { headerName: "Manager Code", field: "ManagerCode" },
                        { headerName: "Instruction name", field: "Name" },
                        { headerName: "Currency", field: "Currency" },
                        { headerName: "BankBranch", field: "BankBranch" },
                        { headerName: "BankAddress", field: "BankAddress" }
                    ],
                    rowData: null
                },
                    this.config = { gridOptions: this.gridOptions };
            }
            GridController.prototype.getGridData = function () {
                var _this = this;
                this.appServices.getGridData(this.sharedService.siCriteria)
                    .then(function (response) {
                    console.log(response);
                    //this.instructions = response;
                    _this.gridOptions.api.setRowData(response);
                });
            };
            GridController.$inject = ["AppServices", "SharedService"];
            return GridController;
        }());
        Controllers.GridController = GridController;
        angular.module('TestGridApp')
            .controller('TestGridApp.gridController', GridController);
    })(Controllers = TestGridApp.Controllers || (TestGridApp.Controllers = {}));
})(TestGridApp || (TestGridApp = {}));
/*var app = angular.module('app', []);

interface AppControllerScope extends ng.IScope {
    app: AppController;
}

app.controller('appController', AppController);

class AppController {
    static $inject = ['$scope'];
    constructor(public $scope: AppControllerScope) {
        $scope.app = this;
    }
    doTask = () => {
        var x = 99;
    }
}

interface AdminHomeControllerScope extends AppControllerScope {
    home: AdminHomeController;
}

class AdminHomeController {

    public app: AppController;

    static $inject = ['$scope'];
    constructor(public $scope: AdminHomeControllerScope) { // << What should my interface look like?
        $scope.home = this;
        $scope.app.doTask();

        // For easier access if you want it
        this.app = $scope.app;
    }
}*/ 
//# sourceMappingURL=App.js.map