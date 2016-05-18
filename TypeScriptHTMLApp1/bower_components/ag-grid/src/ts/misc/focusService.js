System.register(["../context/context", '../utils', "../gridCore", "../columnController/columnController", "../constants", "../entities/gridCell"], function(exports_1, context_1) {
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
    var context_2, utils_1, gridCore_1, columnController_1, constants_1, gridCell_1;
    var FocusService;
    return {
        setters:[
            function (context_2_1) {
                context_2 = context_2_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (gridCore_1_1) {
                gridCore_1 = gridCore_1_1;
            },
            function (columnController_1_1) {
                columnController_1 = columnController_1_1;
            },
            function (constants_1_1) {
                constants_1 = constants_1_1;
            },
            function (gridCell_1_1) {
                gridCell_1 = gridCell_1_1;
            }],
        execute: function() {
            // tracks when focus goes into a cell. cells listen to this, so they know to stop editing
            // if focus goes into another cell.
            let FocusService = class FocusService {
                constructor() {
                    this.destroyMethods = [];
                    this.listeners = [];
                }
                addListener(listener) {
                    this.listeners.push(listener);
                }
                removeListener(listener) {
                    utils_1.Utils.removeFromArray(this.listeners, listener);
                }
                init() {
                    var focusListener = (focusEvent) => {
                        var gridCell = this.getCellForFocus(focusEvent);
                        if (gridCell) {
                            this.informListeners({ gridCell: gridCell });
                        }
                    };
                    var eRootGui = this.gridCore.getRootGui();
                    eRootGui.addEventListener('focus', focusListener, true);
                    this.destroyMethods.push(() => {
                        eRootGui.removeEventListener('focus', focusListener);
                    });
                }
                getCellForFocus(focusEvent) {
                    var column = null;
                    var row = null;
                    var floating = null;
                    var that = this;
                    var eTarget = focusEvent.target;
                    while (eTarget) {
                        checkRow(eTarget);
                        checkColumn(eTarget);
                        eTarget = eTarget.parentNode;
                    }
                    if (utils_1.Utils.exists(column) && utils_1.Utils.exists(row)) {
                        var gridCell = new gridCell_1.GridCell(row, floating, column);
                        return gridCell;
                    }
                    else {
                        return null;
                    }
                    function checkRow(eTarget) {
                        // match the column by checking a) it has a valid colId and b) it has the 'ag-cell' class
                        var rowId = utils_1.Utils.getElementAttribute(eTarget, 'row');
                        if (utils_1.Utils.exists(rowId) && utils_1.Utils.containsClass(eTarget, 'ag-row')) {
                            if (rowId.indexOf('ft') === 0) {
                                floating = constants_1.Constants.FLOATING_TOP;
                                rowId = rowId.substr(3);
                            }
                            else if (rowId.indexOf('fb') === 0) {
                                floating = constants_1.Constants.FLOATING_BOTTOM;
                                rowId = rowId.substr(3);
                            }
                            else {
                                floating = null;
                            }
                            row = parseInt(rowId);
                        }
                    }
                    function checkColumn(eTarget) {
                        // match the column by checking a) it has a valid colId and b) it has the 'ag-cell' class
                        var colId = utils_1.Utils.getElementAttribute(eTarget, 'colid');
                        if (utils_1.Utils.exists(colId) && utils_1.Utils.containsClass(eTarget, 'ag-cell')) {
                            var foundColumn = that.columnController.getColumn(colId);
                            if (foundColumn) {
                                column = foundColumn;
                            }
                        }
                    }
                }
                informListeners(event) {
                    this.listeners.forEach(listener => listener(event));
                }
                destroy() {
                    this.destroyMethods.forEach(destroyMethod => destroyMethod());
                }
            };
            __decorate([
                context_2.Autowired('gridCore'), 
                __metadata('design:type', gridCore_1.GridCore)
            ], FocusService.prototype, "gridCore", void 0);
            __decorate([
                context_2.Autowired('columnController'), 
                __metadata('design:type', columnController_1.ColumnController)
            ], FocusService.prototype, "columnController", void 0);
            __decorate([
                context_2.PostConstruct, 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], FocusService.prototype, "init", null);
            __decorate([
                context_2.PreDestroy, 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], FocusService.prototype, "destroy", null);
            FocusService = __decorate([
                context_2.Bean('focusService'), 
                __metadata('design:paramtypes', [])
            ], FocusService);
            exports_1("FocusService", FocusService);
        }
    }
});
//# sourceMappingURL=focusService.js.map