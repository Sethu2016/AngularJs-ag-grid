System.register(["../gridOptionsWrapper", "../entities/rowNode", "../context/context", "../eventService", "../events", "../constants", '../utils'], function(exports_1, context_1) {
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
    var gridOptionsWrapper_1, rowNode_1, context_2, eventService_1, context_3, events_1, context_4, constants_1, utils_1;
    var FloatingRowModel;
    return {
        setters:[
            function (gridOptionsWrapper_1_1) {
                gridOptionsWrapper_1 = gridOptionsWrapper_1_1;
            },
            function (rowNode_1_1) {
                rowNode_1 = rowNode_1_1;
            },
            function (context_2_1) {
                context_2 = context_2_1;
                context_3 = context_2_1;
                context_4 = context_2_1;
            },
            function (eventService_1_1) {
                eventService_1 = eventService_1_1;
            },
            function (events_1_1) {
                events_1 = events_1_1;
            },
            function (constants_1_1) {
                constants_1 = constants_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }],
        execute: function() {
            let FloatingRowModel = class FloatingRowModel {
                init() {
                    this.setFloatingTopRowData(this.gridOptionsWrapper.getFloatingTopRowData());
                    this.setFloatingBottomRowData(this.gridOptionsWrapper.getFloatingBottomRowData());
                }
                isEmpty(floating) {
                    var rows = floating === constants_1.Constants.FLOATING_TOP ? this.floatingTopRows : this.floatingBottomRows;
                    return utils_1.Utils.missingOrEmpty(rows);
                }
                isRowsToRender(floating) {
                    return !this.isEmpty(floating);
                }
                getRowAtPixel(pixel, floating) {
                    var rows = floating === constants_1.Constants.FLOATING_TOP ? this.floatingTopRows : this.floatingBottomRows;
                    if (utils_1.Utils.missingOrEmpty(rows)) {
                        return 0; // this should never happen, just in case, 0 is graceful failure
                    }
                    for (var i = 0; i < rows.length; i++) {
                        var rowNode = rows[i];
                        var rowTopPixel = rowNode.rowTop + rowNode.rowHeight - 1;
                        // only need to range check against the top pixel, as we are going through the list
                        // in order, first row to hit the pixel wins
                        if (rowTopPixel >= pixel) {
                            return i;
                        }
                    }
                    return rows.length - 1;
                }
                setFloatingTopRowData(rowData) {
                    this.floatingTopRows = this.createNodesFromData(rowData, true);
                    this.eventService.dispatchEvent(events_1.Events.EVENT_FLOATING_ROW_DATA_CHANGED);
                }
                setFloatingBottomRowData(rowData) {
                    this.floatingBottomRows = this.createNodesFromData(rowData, false);
                    this.eventService.dispatchEvent(events_1.Events.EVENT_FLOATING_ROW_DATA_CHANGED);
                }
                createNodesFromData(allData, isTop) {
                    var rowNodes = [];
                    if (allData) {
                        var nextRowTop = 0;
                        allData.forEach((dataItem) => {
                            var rowNode = new rowNode_1.RowNode();
                            this.context.wireBean(rowNode);
                            rowNode.data = dataItem;
                            rowNode.floating = isTop ? constants_1.Constants.FLOATING_TOP : constants_1.Constants.FLOATING_BOTTOM;
                            rowNode.rowTop = nextRowTop;
                            rowNode.rowHeight = this.gridOptionsWrapper.getRowHeightForNode(rowNode);
                            nextRowTop += rowNode.rowHeight;
                            rowNodes.push(rowNode);
                        });
                    }
                    return rowNodes;
                }
                getFloatingTopRowData() {
                    return this.floatingTopRows;
                }
                getFloatingBottomRowData() {
                    return this.floatingBottomRows;
                }
                getFloatingTopTotalHeight() {
                    return this.getTotalHeight(this.floatingTopRows);
                }
                getFloatingBottomTotalHeight() {
                    return this.getTotalHeight(this.floatingBottomRows);
                }
                getTotalHeight(rowNodes) {
                    if (!rowNodes || rowNodes.length === 0) {
                        return 0;
                    }
                    else {
                        var lastNode = rowNodes[rowNodes.length - 1];
                        return lastNode.rowTop + lastNode.rowHeight;
                    }
                }
            };
            __decorate([
                context_3.Autowired('gridOptionsWrapper'), 
                __metadata('design:type', gridOptionsWrapper_1.GridOptionsWrapper)
            ], FloatingRowModel.prototype, "gridOptionsWrapper", void 0);
            __decorate([
                context_3.Autowired('eventService'), 
                __metadata('design:type', eventService_1.EventService)
            ], FloatingRowModel.prototype, "eventService", void 0);
            __decorate([
                context_3.Autowired('context'), 
                __metadata('design:type', context_2.Context)
            ], FloatingRowModel.prototype, "context", void 0);
            __decorate([
                context_4.PostConstruct, 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], FloatingRowModel.prototype, "init", null);
            FloatingRowModel = __decorate([
                context_2.Bean('floatingRowModel'), 
                __metadata('design:paramtypes', [])
            ], FloatingRowModel);
            exports_1("FloatingRowModel", FloatingRowModel);
        }
    }
});
//# sourceMappingURL=floatingRowModel.js.map