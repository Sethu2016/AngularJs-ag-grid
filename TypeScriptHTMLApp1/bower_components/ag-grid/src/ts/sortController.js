System.register(["./entities/column", "./context/context", "./gridOptionsWrapper", "./columnController/columnController", "./eventService", "./events", './utils'], function(exports_1, context_1) {
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
    var column_1, context_2, gridOptionsWrapper_1, columnController_1, eventService_1, events_1, context_3, utils_1;
    var SortController;
    return {
        setters:[
            function (column_1_1) {
                column_1 = column_1_1;
            },
            function (context_2_1) {
                context_2 = context_2_1;
                context_3 = context_2_1;
            },
            function (gridOptionsWrapper_1_1) {
                gridOptionsWrapper_1 = gridOptionsWrapper_1_1;
            },
            function (columnController_1_1) {
                columnController_1 = columnController_1_1;
            },
            function (eventService_1_1) {
                eventService_1 = eventService_1_1;
            },
            function (events_1_1) {
                events_1 = events_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }],
        execute: function() {
            let SortController_1;
            let SortController = SortController_1 = class SortController {
                progressSort(column, multiSort) {
                    // update sort on current col
                    column.setSort(this.getNextSortDirection(column));
                    // sortedAt used for knowing order of cols when multi-col sort
                    if (column.getSort()) {
                        column.setSortedAt(new Date().valueOf());
                    }
                    else {
                        column.setSortedAt(null);
                    }
                    var doingMultiSort = multiSort && !this.gridOptionsWrapper.isSuppressMultiSort();
                    // clear sort on all columns except this one, and update the icons
                    if (!doingMultiSort) {
                        this.clearSortBarThisColumn(column);
                    }
                    this.dispatchSortChangedEvents();
                }
                dispatchSortChangedEvents() {
                    this.eventService.dispatchEvent(events_1.Events.EVENT_BEFORE_SORT_CHANGED);
                    this.eventService.dispatchEvent(events_1.Events.EVENT_SORT_CHANGED);
                    this.eventService.dispatchEvent(events_1.Events.EVENT_AFTER_SORT_CHANGED);
                }
                clearSortBarThisColumn(columnToSkip) {
                    this.columnController.getAllColumnsIncludingAuto().forEach((columnToClear) => {
                        // Do not clear if either holding shift, or if column in question was clicked
                        if (!(columnToClear === columnToSkip)) {
                            columnToClear.setSort(null);
                        }
                    });
                }
                getNextSortDirection(column) {
                    var sortingOrder;
                    if (column.getColDef().sortingOrder) {
                        sortingOrder = column.getColDef().sortingOrder;
                    }
                    else if (this.gridOptionsWrapper.getSortingOrder()) {
                        sortingOrder = this.gridOptionsWrapper.getSortingOrder();
                    }
                    else {
                        sortingOrder = SortController_1.DEFAULT_SORTING_ORDER;
                    }
                    if (!Array.isArray(sortingOrder) || sortingOrder.length <= 0) {
                        console.warn('ag-grid: sortingOrder must be an array with at least one element, currently it\'s ' + sortingOrder);
                        return;
                    }
                    var currentIndex = sortingOrder.indexOf(column.getSort());
                    var notInArray = currentIndex < 0;
                    var lastItemInArray = currentIndex == sortingOrder.length - 1;
                    var result;
                    if (notInArray || lastItemInArray) {
                        result = sortingOrder[0];
                    }
                    else {
                        result = sortingOrder[currentIndex + 1];
                    }
                    // verify the sort type exists, as the user could provide the sortOrder, need to make sure it's valid
                    if (SortController_1.DEFAULT_SORTING_ORDER.indexOf(result) < 0) {
                        console.warn('ag-grid: invalid sort type ' + result);
                        return null;
                    }
                    return result;
                }
                // used by the public api, for saving the sort model
                getSortModel() {
                    var columnsWithSorting = this.getColumnsWithSortingOrdered();
                    return utils_1.Utils.map(columnsWithSorting, (column) => {
                        return {
                            colId: column.getColId(),
                            sort: column.getSort()
                        };
                    });
                }
                setSortModel(sortModel) {
                    if (!this.gridOptionsWrapper.isEnableSorting()) {
                        console.warn('ag-grid: You are setting the sort model on a grid that does not have sorting enabled');
                        return;
                    }
                    // first up, clear any previous sort
                    var sortModelProvided = sortModel && sortModel.length > 0;
                    var allColumnsIncludingAuto = this.columnController.getAllColumnsIncludingAuto();
                    allColumnsIncludingAuto.forEach((column) => {
                        var sortForCol = null;
                        var sortedAt = -1;
                        if (sortModelProvided && !column.getColDef().suppressSorting) {
                            for (var j = 0; j < sortModel.length; j++) {
                                var sortModelEntry = sortModel[j];
                                if (typeof sortModelEntry.colId === 'string'
                                    && typeof column.getColId() === 'string'
                                    && sortModelEntry.colId === column.getColId()) {
                                    sortForCol = sortModelEntry.sort;
                                    sortedAt = j;
                                }
                            }
                        }
                        if (sortForCol) {
                            column.setSort(sortForCol);
                            column.setSortedAt(sortedAt);
                        }
                        else {
                            column.setSort(null);
                            column.setSortedAt(null);
                        }
                    });
                    this.dispatchSortChangedEvents();
                }
                getColumnsWithSortingOrdered() {
                    // pull out all the columns that have sorting set
                    var allColumnsIncludingAuto = this.columnController.getAllColumnsIncludingAuto();
                    var columnsWithSorting = utils_1.Utils.filter(allColumnsIncludingAuto, (column) => { return !!column.getSort(); });
                    // put the columns in order of which one got sorted first
                    columnsWithSorting.sort((a, b) => { return a.sortedAt - b.sortedAt; });
                    return columnsWithSorting;
                }
                // used by row controller, when doing the sorting
                getSortForRowController() {
                    var columnsWithSorting = this.getColumnsWithSortingOrdered();
                    return utils_1.Utils.map(columnsWithSorting, (column) => {
                        var ascending = column.getSort() === column_1.Column.SORT_ASC;
                        return {
                            inverter: ascending ? 1 : -1,
                            column: column
                        };
                    });
                }
            };
            SortController.DEFAULT_SORTING_ORDER = [column_1.Column.SORT_ASC, column_1.Column.SORT_DESC, null];
            __decorate([
                context_2.Autowired('gridOptionsWrapper'), 
                __metadata('design:type', gridOptionsWrapper_1.GridOptionsWrapper)
            ], SortController.prototype, "gridOptionsWrapper", void 0);
            __decorate([
                context_2.Autowired('columnController'), 
                __metadata('design:type', columnController_1.ColumnController)
            ], SortController.prototype, "columnController", void 0);
            __decorate([
                context_2.Autowired('eventService'), 
                __metadata('design:type', eventService_1.EventService)
            ], SortController.prototype, "eventService", void 0);
            SortController = SortController_1 = __decorate([
                context_3.Bean('sortController'), 
                __metadata('design:paramtypes', [])
            ], SortController);
            exports_1("SortController", SortController);
        }
    }
});
//# sourceMappingURL=sortController.js.map