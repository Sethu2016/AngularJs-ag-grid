module TestGridApp.Componants {
    interface IGridComponantBindings {
        textBinding:string;
    }

    export const Component = function (options: ng.IComponentOptions): Function {
        return (controller: Function) => {
            return angular.extend(options, { controller });
        };
    };

    @Component({
        bindings: {
            config: '='
        },
        template: "<div class='ag-blue' ag-grid='$ctrl.config.gridOptions' style='width:90%;'></div><p>{{$ctrl.prop}}</p>"
})
    export class AgGridComponent {

        config: string;

        constructor(private $q: ng.IQService) { }

        $onInit() {
            // do something with this.prop or this.$q upon initialization
        }
    }

    angular.module('TestGridApp')
        .component('agGridComponent', AgGridComponent);
}