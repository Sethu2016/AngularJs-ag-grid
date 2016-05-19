var TestGridApp;
(function (TestGridApp) {
    agGrid.initialiseAgGridWithAngular1(angular);
    angular.module('TestGridApp', ['agGrid']);
    var GridController = (function () {
        function GridController() {
            this.gridOptions = {
                columnDefs: [
                    { headerName: "Make", field: "make" },
                    { headerName: "Model", field: "model" },
                    { headerName: "Price", field: "price" }
                ],
                rowData: [
                    { make: "Toyota", model: "Celica", price: 35000 },
                    { make: "Ford", model: "Mondeo", price: 32000 },
                    { make: "Porsche", model: "Boxter", price: 72000 }
                ]
            };
        }
        GridController.$inject = [];
        return GridController;
    }());
    TestGridApp.GridController = GridController;
    angular.module('TestGridApp')
        .controller('TestGridApp.gridController', GridController);
})(TestGridApp || (TestGridApp = {}));
//# sourceMappingURL=App.js.map