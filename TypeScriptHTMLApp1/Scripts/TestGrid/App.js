System.register(['../../bower_components/ag-grid/dist/lib/components/aggridng1'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var aggridng1_1;
    var TestGridApp;
    return {
        setters:[
            function (aggridng1_1_1) {
                aggridng1_1 = aggridng1_1_1;
            }],
        execute: function() {
            (function (TestGridApp) {
                aggridng1_1.initialiseAgGridWithAngular1(angular);
                angular.module('TestGridApp', ['agGrid']);
                class GridController {
                    constructor() {
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
                }
                GridController.$inject = [];
                TestGridApp.GridController = GridController;
                angular.module('TestGridApp')
                    .controller('TestGridApp.gridController', GridController);
            })(TestGridApp || (TestGridApp = {}));
        }
    }
});
//# sourceMappingURL=App.js.map