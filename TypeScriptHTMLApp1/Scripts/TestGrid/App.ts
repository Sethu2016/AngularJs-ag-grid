

module TestGridApp {

    agGrid.initialiseAgGridWithAngular1(angular);
    angular.module('TestGridApp', ['agGrid']);

}
module TestGridApp.ViewModel {
    export interface ISiViewModel {
        managerCode: string;
        id: number;
        name: string;
        bankBranch: string;
        bankAddress: string;
        routingNo: string;
        currency:string;

    }
    export class SiViewModel implements ISiViewModel{
        managerCode: string;
        id: number;
        name: string;
        bankBranch: string;
        bankAddress: string;
        routingNo: string;
        currency: string;
    }

    export interface ISiCriteria {
        managerCode:string;
    }
    export class SiCriteria implements ISiCriteria{
        managerCode: string;
    }
}

module TestGridApp.Controllers {
    import ISiCriteria = ViewModel.ISiCriteria;
    import SiCriteria = ViewModel.SiCriteria;
    import SharedDataService = TestGridApp.Services.Shared.SharedDataService;

    export class SiCriteriaController {

        siCriteia:ISiCriteria;

        static $inject = ["SharedService"];
        constructor(sharedService: SharedDataService) {
            this.siCriteia = sharedService.siCriteria;
            //this.siCriteia.managerCode = "BNP";
        }
    }

    angular.module('TestGridApp')
        .controller('TestGridApp.Cotrollers.SiCriteriaController', SiCriteriaController);

}


module TestGridApp.Controllers
{
    import AppServices = Services.AppServices;
    import ISiViewModel = ViewModel.ISiViewModel;
    import SharedDataService = TestGridApp.Services.Shared.SharedDataService;
    interface IGridDefinitions {
        gridOptions: ag.grid.GridOptions;
    }

    export class GridController implements IGridDefinitions {

        gridOptions: ag.grid.GridOptions;
        config: any;
        //instructions: Array<ISiViewModel>;
        appServices: AppServices;
        sharedService : SharedDataService;

        static $inject = ["AppServices","SharedService"];

        constructor(appservices: AppServices, sharedService: SharedDataService) {
            this.appServices = appservices;
            this.sharedService = sharedService;
            appservices.getGridData(sharedService.siCriteria)
                .then((response: any) => {
                    console.log(response);
                    //this.instructions = response;
                    this.gridOptions.api.setRowData(response);


                });

            this.gridOptions = {
                columnDefs: [
                    { headerName: "Id", field: "id" },
                    { headerName: "Manager Code", field: "ManagerCode" },
                    { headerName: "Instruction name", field: "Name" },
                    { headerName: "Currency", field: "Currency" },
                    { headerName: "BankBranch", field: "BankBranch" },
                    { headerName: "BankAddress", field: "BankAddress" }

                ]
                , rowData: null
            },

            this.config = {gridOptions:this.gridOptions}
        }

        getGridData() {
            this.appServices.getGridData(this.sharedService.siCriteria)
                .then((response: any) => {
                    console.log(response);
                    //this.instructions = response;
                    this.gridOptions.api.setRowData(response);


                });
        }
    }

    angular.module('TestGridApp')
        .controller('TestGridApp.gridController', GridController);

}

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