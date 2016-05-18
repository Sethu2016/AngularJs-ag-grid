System.register(["./context/context", "./constants", "./columnController/columnController", "./rowControllers/floatingRowModel", "./utils", "./entities/gridRow", "./entities/gridCell"], function(exports_1, context_1) {
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
    var context_2, constants_1, columnController_1, floatingRowModel_1, utils_1, gridRow_1, gridCell_1;
    var CellNavigationService;
    return {
        setters:[
            function (context_2_1) {
                context_2 = context_2_1;
            },
            function (constants_1_1) {
                constants_1 = constants_1_1;
            },
            function (columnController_1_1) {
                columnController_1 = columnController_1_1;
            },
            function (floatingRowModel_1_1) {
                floatingRowModel_1 = floatingRowModel_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (gridRow_1_1) {
                gridRow_1 = gridRow_1_1;
            },
            function (gridCell_1_1) {
                gridCell_1 = gridCell_1_1;
            }],
        execute: function() {
            let CellNavigationService = class CellNavigationService {
                getNextCellToFocus(key, lastCellToFocus) {
                    switch (key) {
                        case constants_1.Constants.KEY_UP: return this.getCellAbove(lastCellToFocus);
                        case constants_1.Constants.KEY_DOWN: return this.getCellBelow(lastCellToFocus);
                        case constants_1.Constants.KEY_RIGHT: return this.getCellToRight(lastCellToFocus);
                        case constants_1.Constants.KEY_LEFT: return this.getCellToLeft(lastCellToFocus);
                        default: console.log('ag-Grid: unknown key for navigation ' + key);
                    }
                }
                getCellToLeft(lastCell) {
                    var colToLeft = this.columnController.getDisplayedColBefore(lastCell.column);
                    if (!colToLeft) {
                        return null;
                    }
                    else {
                        return new gridCell_1.GridCell(lastCell.rowIndex, lastCell.floating, colToLeft);
                    }
                }
                getCellToRight(lastCell) {
                    var colToRight = this.columnController.getDisplayedColAfter(lastCell.column);
                    // if already on right, do nothing
                    if (!colToRight) {
                        return null;
                    }
                    else {
                        return new gridCell_1.GridCell(lastCell.rowIndex, lastCell.floating, colToRight);
                    }
                }
                getRowBelow(lastRow) {
                    // if already on top row, do nothing
                    if (this.isLastRowInContainer(lastRow)) {
                        if (lastRow.isFloatingBottom()) {
                            return null;
                        }
                        else if (lastRow.isNotFloating()) {
                            if (this.floatingRowModel.isRowsToRender(constants_1.Constants.FLOATING_BOTTOM)) {
                                return new gridRow_1.GridRow(0, constants_1.Constants.FLOATING_BOTTOM);
                            }
                            else {
                                return null;
                            }
                        }
                        else {
                            if (this.rowModel.isRowsToRender()) {
                                return new gridRow_1.GridRow(0, null);
                            }
                            else if (this.floatingRowModel.isRowsToRender(constants_1.Constants.FLOATING_BOTTOM)) {
                                return new gridRow_1.GridRow(0, constants_1.Constants.FLOATING_BOTTOM);
                            }
                            else {
                                return null;
                            }
                        }
                    }
                    else {
                        return new gridRow_1.GridRow(lastRow.rowIndex + 1, lastRow.floating);
                    }
                }
                getCellBelow(lastCell) {
                    var rowBelow = this.getRowBelow(lastCell.getGridRow());
                    if (rowBelow) {
                        return new gridCell_1.GridCell(rowBelow.rowIndex, rowBelow.floating, lastCell.column);
                    }
                    else {
                        return null;
                    }
                }
                isLastRowInContainer(gridRow) {
                    if (gridRow.isFloatingTop()) {
                        var lastTopIndex = this.floatingRowModel.getFloatingTopRowData().length - 1;
                        return lastTopIndex === gridRow.rowIndex;
                    }
                    else if (gridRow.isFloatingBottom()) {
                        var lastBottomIndex = this.floatingRowModel.getFloatingBottomRowData().length - 1;
                        return lastBottomIndex === gridRow.rowIndex;
                    }
                    else {
                        var lastBodyIndex = this.rowModel.getRowCount() - 1;
                        return lastBodyIndex === gridRow.rowIndex;
                    }
                }
                getRowAbove(lastRow) {
                    // if already on top row, do nothing
                    if (lastRow.rowIndex === 0) {
                        if (lastRow.isFloatingTop()) {
                            return null;
                        }
                        else if (lastRow.isNotFloating()) {
                            if (this.floatingRowModel.isRowsToRender(constants_1.Constants.FLOATING_TOP)) {
                                return this.getLastFloatingTopRow();
                            }
                            else {
                                return null;
                            }
                        }
                        else {
                            // last floating bottom
                            if (this.rowModel.isRowsToRender()) {
                                return this.getLastBodyCell();
                            }
                            else if (this.floatingRowModel.isRowsToRender(constants_1.Constants.FLOATING_TOP)) {
                                return this.getLastFloatingTopRow();
                            }
                            else {
                                return null;
                            }
                        }
                    }
                    else {
                        return new gridRow_1.GridRow(lastRow.rowIndex - 1, lastRow.floating);
                    }
                }
                getCellAbove(lastCell) {
                    var rowAbove = this.getRowAbove(lastCell.getGridRow());
                    if (rowAbove) {
                        return new gridCell_1.GridCell(rowAbove.rowIndex, rowAbove.floating, lastCell.column);
                    }
                    else {
                        return null;
                    }
                }
                getLastBodyCell() {
                    var lastBodyRow = this.rowModel.getRowCount() - 1;
                    return new gridRow_1.GridRow(lastBodyRow, null);
                }
                getLastFloatingTopRow() {
                    var lastFloatingRow = this.floatingRowModel.getFloatingTopRowData().length - 1;
                    return new gridRow_1.GridRow(lastFloatingRow, constants_1.Constants.FLOATING_TOP);
                }
                getNextTabbedCell(gridCell, backwards) {
                    if (backwards) {
                        return this.getNextTabbedCellBackwards(gridCell);
                    }
                    else {
                        return this.getNextTabbedCellForwards(gridCell);
                    }
                }
                getNextTabbedCellForwards(gridCell) {
                    var displayedColumns = this.columnController.getAllDisplayedColumns();
                    var newRowIndex = gridCell.rowIndex;
                    var newFloating = gridCell.floating;
                    // move along to the next cell
                    var newColumn = this.columnController.getDisplayedColAfter(gridCell.column);
                    // check if end of the row, and if so, go forward a row
                    if (!newColumn) {
                        newColumn = displayedColumns[0];
                        var rowBelow = this.getRowBelow(gridCell.getGridRow());
                        if (utils_1.Utils.missing(rowBelow)) {
                            return;
                        }
                        newRowIndex = rowBelow.rowIndex;
                        newFloating = rowBelow.floating;
                    }
                    return new gridCell_1.GridCell(newRowIndex, newFloating, newColumn);
                }
                getNextTabbedCellBackwards(gridCell) {
                    var displayedColumns = this.columnController.getAllDisplayedColumns();
                    var newRowIndex = gridCell.rowIndex;
                    var newFloating = gridCell.floating;
                    // move along to the next cell
                    var newColumn = this.columnController.getDisplayedColBefore(gridCell.column);
                    // check if end of the row, and if so, go forward a row
                    if (!newColumn) {
                        newColumn = displayedColumns[displayedColumns.length - 1];
                        var rowAbove = this.getRowAbove(gridCell.getGridRow());
                        if (utils_1.Utils.missing(rowAbove)) {
                            return;
                        }
                        newRowIndex = rowAbove.rowIndex;
                        newFloating = rowAbove.floating;
                    }
                    return new gridCell_1.GridCell(newRowIndex, newFloating, newColumn);
                }
            };
            __decorate([
                context_2.Autowired('columnController'), 
                __metadata('design:type', columnController_1.ColumnController)
            ], CellNavigationService.prototype, "columnController", void 0);
            __decorate([
                context_2.Autowired('rowModel'), 
                __metadata('design:type', Object)
            ], CellNavigationService.prototype, "rowModel", void 0);
            __decorate([
                context_2.Autowired('floatingRowModel'), 
                __metadata('design:type', floatingRowModel_1.FloatingRowModel)
            ], CellNavigationService.prototype, "floatingRowModel", void 0);
            CellNavigationService = __decorate([
                context_2.Bean('cellNavigationService'), 
                __metadata('design:paramtypes', [])
            ], CellNavigationService);
            exports_1("CellNavigationService", CellNavigationService);
        }
    }
});
//# sourceMappingURL=cellNavigationService.js.map