System.register(["../context/context", "./gridPanel", "../columnController/columnController", "../entities/column", "../constants", "../rowControllers/floatingRowModel", '../utils', "../entities/gridCell", "../gridOptionsWrapper"], function(exports_1, context_1) {
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
    var context_2, context_3, gridPanel_1, columnController_1, column_1, constants_1, floatingRowModel_1, utils_1, gridCell_1, gridOptionsWrapper_1;
    var MouseEventService;
    return {
        setters:[
            function (context_2_1) {
                context_2 = context_2_1;
                context_3 = context_2_1;
            },
            function (gridPanel_1_1) {
                gridPanel_1 = gridPanel_1_1;
            },
            function (columnController_1_1) {
                columnController_1 = columnController_1_1;
            },
            function (column_1_1) {
                column_1 = column_1_1;
            },
            function (constants_1_1) {
                constants_1 = constants_1_1;
            },
            function (floatingRowModel_1_1) {
                floatingRowModel_1 = floatingRowModel_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (gridCell_1_1) {
                gridCell_1 = gridCell_1_1;
            },
            function (gridOptionsWrapper_1_1) {
                gridOptionsWrapper_1 = gridOptionsWrapper_1_1;
            }],
        execute: function() {
            let MouseEventService = class MouseEventService {
                getCellForMouseEvent(mouseEvent) {
                    var floating = this.getFloating(mouseEvent);
                    var rowIndex = this.getRowIndex(mouseEvent, floating);
                    var column = this.getColumn(mouseEvent);
                    if (rowIndex >= 0 && utils_1.Utils.exists(column)) {
                        return new gridCell_1.GridCell(rowIndex, floating, column);
                    }
                    else {
                        return null;
                    }
                }
                getFloating(mouseEvent) {
                    var floatingTopRect = this.gridPanel.getFloatingTopClientRect();
                    var floatingBottomRect = this.gridPanel.getFloatingBottomClientRect();
                    var floatingTopRowsExist = !this.floatingRowModel.isEmpty(constants_1.Constants.FLOATING_TOP);
                    var floatingBottomRowsExist = !this.floatingRowModel.isEmpty(constants_1.Constants.FLOATING_BOTTOM);
                    if (floatingTopRowsExist && floatingTopRect.bottom >= mouseEvent.clientY) {
                        return constants_1.Constants.FLOATING_TOP;
                    }
                    else if (floatingBottomRowsExist && floatingBottomRect.top <= mouseEvent.clientY) {
                        return constants_1.Constants.FLOATING_BOTTOM;
                    }
                    else {
                        return null;
                    }
                }
                getFloatingRowIndex(mouseEvent, floating) {
                    var clientRect;
                    switch (floating) {
                        case constants_1.Constants.FLOATING_TOP:
                            clientRect = this.gridPanel.getFloatingTopClientRect();
                            break;
                        case constants_1.Constants.FLOATING_BOTTOM:
                            clientRect = this.gridPanel.getFloatingBottomClientRect();
                            break;
                    }
                    var bodyY = mouseEvent.clientY - clientRect.top;
                    var rowIndex = this.floatingRowModel.getRowAtPixel(bodyY, floating);
                    return rowIndex;
                }
                getRowIndex(mouseEvent, floating) {
                    switch (floating) {
                        case constants_1.Constants.FLOATING_TOP:
                        case constants_1.Constants.FLOATING_BOTTOM:
                            return this.getFloatingRowIndex(mouseEvent, floating);
                        default: return this.getBodyRowIndex(mouseEvent);
                    }
                }
                getBodyRowIndex(mouseEvent) {
                    var clientRect = this.gridPanel.getBodyViewportClientRect();
                    var scrollY = this.gridPanel.getVerticalScrollPosition();
                    var bodyY = mouseEvent.clientY - clientRect.top + scrollY;
                    var rowIndex = this.rowModel.getRowIndexAtPixel(bodyY);
                    return rowIndex;
                }
                getContainer(mouseEvent) {
                    var centerRect = this.gridPanel.getBodyViewportClientRect();
                    var mouseX = mouseEvent.clientX;
                    if (mouseX < centerRect.left && this.columnController.isPinningLeft()) {
                        return column_1.Column.PINNED_LEFT;
                    }
                    else if (mouseX > centerRect.right && this.columnController.isPinningRight()) {
                        return column_1.Column.PINNED_RIGHT;
                    }
                    else {
                        return null;
                    }
                }
                getColumn(mouseEvent) {
                    if (this.columnController.isEmpty()) {
                        return null;
                    }
                    var container = this.getContainer(mouseEvent);
                    var columns = this.getColumnsForContainer(container);
                    var containerX = this.getXForContainer(container, mouseEvent);
                    var hoveringColumn;
                    if (containerX < 0) {
                        hoveringColumn = columns[0];
                    }
                    columns.forEach(column => {
                        var afterLeft = containerX >= column.getLeft();
                        var beforeRight = containerX <= column.getRight();
                        if (afterLeft && beforeRight) {
                            hoveringColumn = column;
                        }
                    });
                    if (!hoveringColumn) {
                        hoveringColumn = columns[columns.length - 1];
                    }
                    return hoveringColumn;
                }
                getColumnsForContainer(container) {
                    switch (container) {
                        case column_1.Column.PINNED_LEFT: return this.columnController.getDisplayedLeftColumns();
                        case column_1.Column.PINNED_RIGHT: return this.columnController.getDisplayedRightColumns();
                        default: return this.columnController.getDisplayedCenterColumns();
                    }
                }
                getXForContainer(container, mouseEvent) {
                    var containerX;
                    switch (container) {
                        case column_1.Column.PINNED_LEFT:
                            containerX = this.gridPanel.getPinnedLeftColsViewportClientRect().left;
                            break;
                        case column_1.Column.PINNED_RIGHT:
                            containerX = this.gridPanel.getPinnedRightColsViewportClientRect().left;
                            break;
                        default:
                            var centerRect = this.gridPanel.getBodyViewportClientRect();
                            var centerScroll = this.gridPanel.getHorizontalScrollPosition();
                            containerX = centerRect.left - centerScroll;
                    }
                    var result = mouseEvent.clientX - containerX;
                    return result;
                }
            };
            __decorate([
                context_3.Autowired('gridPanel'), 
                __metadata('design:type', gridPanel_1.GridPanel)
            ], MouseEventService.prototype, "gridPanel", void 0);
            __decorate([
                context_3.Autowired('columnController'), 
                __metadata('design:type', columnController_1.ColumnController)
            ], MouseEventService.prototype, "columnController", void 0);
            __decorate([
                context_3.Autowired('rowModel'), 
                __metadata('design:type', Object)
            ], MouseEventService.prototype, "rowModel", void 0);
            __decorate([
                context_3.Autowired('floatingRowModel'), 
                __metadata('design:type', floatingRowModel_1.FloatingRowModel)
            ], MouseEventService.prototype, "floatingRowModel", void 0);
            __decorate([
                context_3.Autowired('gridOptionsWrapper'), 
                __metadata('design:type', gridOptionsWrapper_1.GridOptionsWrapper)
            ], MouseEventService.prototype, "gridOptionsWrapper", void 0);
            MouseEventService = __decorate([
                context_2.Bean('mouseEventService'), 
                __metadata('design:paramtypes', [])
            ], MouseEventService);
            exports_1("MouseEventService", MouseEventService);
        }
    }
});
//# sourceMappingURL=mouseEventService.js.map