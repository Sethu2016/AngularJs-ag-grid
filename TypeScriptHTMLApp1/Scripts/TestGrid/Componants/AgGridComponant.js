var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TestGridApp;
(function (TestGridApp) {
    var Componants;
    (function (Componants) {
        Componants.Component = function (options) {
            return function (controller) {
                return angular.extend(options, { controller: controller });
            };
        };
        var AgGridComponent = (function () {
            function AgGridComponent($q) {
                this.$q = $q;
            }
            AgGridComponent.prototype.$onInit = function () {
                // do something with this.prop or this.$q upon initialization
            };
            AgGridComponent = __decorate([
                Componants.Component({
                    bindings: {
                        config: '='
                    },
                    template: "<div class='ag-blue' ag-grid='$ctrl.config.gridOptions' style='width:90%;'></div><p>{{$ctrl.prop}}</p>"
                }), 
                __metadata('design:paramtypes', [Function])
            ], AgGridComponent);
            return AgGridComponent;
        }());
        Componants.AgGridComponent = AgGridComponent;
        angular.module('TestGridApp')
            .component('agGridComponent', AgGridComponent);
    })(Componants = TestGridApp.Componants || (TestGridApp.Componants = {}));
})(TestGridApp || (TestGridApp = {}));
//# sourceMappingURL=AgGridComponant.js.map