System.register(["../context/context", "../gridOptionsWrapper"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var context_2, gridOptionsWrapper_1;
    var ValueFormatterService;
    return {
        setters:[
            function (context_2_1) {
                context_2 = context_2_1;
            },
            function (gridOptionsWrapper_1_1) {
                gridOptionsWrapper_1 = gridOptionsWrapper_1_1;
            }],
        execute: function() {
            let ValueFormatterService = class ValueFormatterService {
                formatValue(column, rowNode, $scope, rowIndex, value) {
                    var formatter;
                    var colDef = column.getColDef();
                    // if floating, give preference to the floating formatter
                    if (rowNode.floating) {
                        formatter = colDef.floatingCellFormatter ? colDef.floatingCellFormatter : colDef.cellFormatter;
                    }
                    else {
                        formatter = colDef.cellFormatter;
                    }
                    var result = null;
                    if (formatter) {
                        var params = {
                            value: value,
                            node: rowNode,
                            column: column,
                            $scope: $scope,
                            rowIndex: rowIndex,
                            api: this.gridOptionsWrapper.getApi(),
                            context: this.gridOptionsWrapper.getContext()
                        };
                        result = formatter(params);
                    }
                    return result;
                }
            };
            __decorate([
                context_2.Autowired('gridOptionsWrapper'), 
                __metadata('design:type', gridOptionsWrapper_1.GridOptionsWrapper)
            ], ValueFormatterService.prototype, "gridOptionsWrapper", void 0);
            ValueFormatterService = __decorate([
                context_2.Bean('valueFormatterService'), 
                __metadata('design:paramtypes', [])
            ], ValueFormatterService);
            exports_1("ValueFormatterService", ValueFormatterService);
        }
    }
});
//# sourceMappingURL=valueFormatterService.js.map