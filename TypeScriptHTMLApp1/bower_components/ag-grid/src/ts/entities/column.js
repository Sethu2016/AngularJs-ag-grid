System.register(["../eventService", '../utils', "../context/context", "../gridOptionsWrapper", "../columnController/columnUtils"], function(exports_1, context_1) {
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
    var eventService_1, utils_1, context_2, gridOptionsWrapper_1, context_3, columnUtils_1;
    var Column;
    return {
        setters:[
            function (eventService_1_1) {
                eventService_1 = eventService_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (context_2_1) {
                context_2 = context_2_1;
                context_3 = context_2_1;
            },
            function (gridOptionsWrapper_1_1) {
                gridOptionsWrapper_1 = gridOptionsWrapper_1_1;
            },
            function (columnUtils_1_1) {
                columnUtils_1 = columnUtils_1_1;
            }],
        execute: function() {
            // Wrapper around a user provide column definition. The grid treats the column definition as ready only.
            // This class contains all the runtime information about a column, plus some logic (the definition has no logic).
            // This class implements both interfaces ColumnGroupChild and OriginalColumnGroupChild as the class can
            // appear as a child of either the original tree or the displayed tree. However the relevant group classes
            // for each type only implements one, as each group can only appear in it's associated tree (eg OriginalColumnGroup
            // can only appear in OriginalColumn tree).
            class Column {
                constructor(colDef, colId) {
                    this.moving = false;
                    this.filterActive = false;
                    this.eventService = new eventService_1.EventService();
                    this.colDef = colDef;
                    this.visible = !colDef.hide;
                    this.sort = colDef.sort;
                    this.sortedAt = colDef.sortedAt;
                    this.colId = colId;
                }
                // this is done after constructor as it uses gridOptionsWrapper
                initialise() {
                    this.setPinned(this.colDef.pinned);
                    var minColWidth = this.gridOptionsWrapper.getMinColWidth();
                    var maxColWidth = this.gridOptionsWrapper.getMaxColWidth();
                    if (this.colDef.minWidth) {
                        this.minWidth = this.colDef.minWidth;
                    }
                    else {
                        this.minWidth = minColWidth;
                    }
                    if (this.colDef.maxWidth) {
                        this.maxWidth = this.colDef.maxWidth;
                    }
                    else {
                        this.maxWidth = maxColWidth;
                    }
                    this.actualWidth = this.columnUtils.calculateColInitialWidth(this.colDef);
                    this.validate();
                }
                validate() {
                    if (!this.gridOptionsWrapper.isEnterprise()) {
                        if (utils_1.Utils.exists(this.colDef.aggFunc)) {
                            console.warn('ag-Grid: aggFunc is only valid in ag-Grid-Enterprise');
                        }
                        if (utils_1.Utils.exists(this.colDef.rowGroupIndex)) {
                            console.warn('ag-Grid: rowGroupIndex is only valid in ag-Grid-Enterprise');
                        }
                    }
                }
                addEventListener(eventType, listener) {
                    this.eventService.addEventListener(eventType, listener);
                }
                removeEventListener(eventType, listener) {
                    this.eventService.removeEventListener(eventType, listener);
                }
                isCellEditable(rowNode) {
                    // if boolean set, then just use it
                    if (typeof this.colDef.editable === 'boolean') {
                        return this.colDef.editable;
                    }
                    // if function, then call the function to find out
                    if (typeof this.colDef.editable === 'function') {
                        var params = {
                            node: rowNode,
                            column: this,
                            colDef: this.colDef,
                            context: this.gridOptionsWrapper.getContext(),
                            api: this.gridOptionsWrapper.getApi(),
                            columnApi: this.gridOptionsWrapper.getColumnApi()
                        };
                        var editableFunc = this.colDef.editable;
                        return editableFunc(params);
                    }
                    return false;
                }
                setMoving(moving) {
                    this.moving = moving;
                    this.eventService.dispatchEvent(Column.EVENT_MOVING_CHANGED);
                }
                isMoving() {
                    return this.moving;
                }
                getSort() {
                    return this.sort;
                }
                setSort(sort) {
                    if (this.sort !== sort) {
                        this.sort = sort;
                        this.eventService.dispatchEvent(Column.EVENT_SORT_CHANGED);
                    }
                }
                isSortAscending() {
                    return this.sort === Column.SORT_ASC;
                }
                isSortDescending() {
                    return this.sort === Column.SORT_DESC;
                }
                isSortNone() {
                    return utils_1.Utils.missing(this.sort);
                }
                getSortedAt() {
                    return this.sortedAt;
                }
                setSortedAt(sortedAt) {
                    this.sortedAt = sortedAt;
                }
                setAggFunc(aggFunc) {
                    this.aggFunc = aggFunc;
                }
                getAggFunc() {
                    return this.aggFunc;
                }
                getLeft() {
                    return this.left;
                }
                getRight() {
                    return this.left + this.actualWidth;
                }
                setLeft(left) {
                    if (this.left !== left) {
                        this.left = left;
                        this.eventService.dispatchEvent(Column.EVENT_LEFT_CHANGED);
                    }
                }
                isFilterActive() {
                    return this.filterActive;
                }
                setFilterActive(active) {
                    if (this.filterActive !== active) {
                        this.filterActive = active;
                        this.eventService.dispatchEvent(Column.EVENT_FILTER_ACTIVE_CHANGED);
                    }
                }
                setPinned(pinned) {
                    // pinning is not allowed when doing 'forPrint'
                    if (this.gridOptionsWrapper.isForPrint()) {
                        return;
                    }
                    if (pinned === true || pinned === Column.PINNED_LEFT) {
                        this.pinned = Column.PINNED_LEFT;
                    }
                    else if (pinned === Column.PINNED_RIGHT) {
                        this.pinned = Column.PINNED_RIGHT;
                    }
                    else {
                        this.pinned = null;
                    }
                }
                setFirstRightPinned(firstRightPinned) {
                    if (this.firstRightPinned !== firstRightPinned) {
                        this.firstRightPinned = firstRightPinned;
                        this.eventService.dispatchEvent(Column.EVENT_FIRST_RIGHT_PINNED_CHANGED);
                    }
                }
                setLastLeftPinned(lastLeftPinned) {
                    if (this.lastLeftPinned !== lastLeftPinned) {
                        this.lastLeftPinned = lastLeftPinned;
                        this.eventService.dispatchEvent(Column.EVENT_LAST_LEFT_PINNED_CHANGED);
                    }
                }
                isFirstRightPinned() {
                    return this.firstRightPinned;
                }
                isLastLeftPinned() {
                    return this.lastLeftPinned;
                }
                isPinned() {
                    return this.pinned === Column.PINNED_LEFT || this.pinned === Column.PINNED_RIGHT;
                }
                isPinnedLeft() {
                    return this.pinned === Column.PINNED_LEFT;
                }
                isPinnedRight() {
                    return this.pinned === Column.PINNED_RIGHT;
                }
                getPinned() {
                    return this.pinned;
                }
                setVisible(visible) {
                    var newValue = visible === true;
                    if (this.visible !== newValue) {
                        this.visible = newValue;
                        this.eventService.dispatchEvent(Column.EVENT_VISIBLE_CHANGED);
                    }
                }
                isVisible() {
                    return this.visible;
                }
                getColDef() {
                    return this.colDef;
                }
                getColumnGroupShow() {
                    return this.colDef.columnGroupShow;
                }
                getColId() {
                    return this.colId;
                }
                getId() {
                    return this.getColId();
                }
                getDefinition() {
                    return this.colDef;
                }
                getActualWidth() {
                    return this.actualWidth;
                }
                setActualWidth(actualWidth) {
                    if (this.actualWidth !== actualWidth) {
                        this.actualWidth = actualWidth;
                        this.eventService.dispatchEvent(Column.EVENT_WIDTH_CHANGED);
                    }
                }
                isGreaterThanMax(width) {
                    if (this.maxWidth) {
                        return width > this.maxWidth;
                    }
                    else {
                        return false;
                    }
                }
                getMinWidth() {
                    return this.minWidth;
                }
                getMaxWidth() {
                    return this.maxWidth;
                }
                setMinimum() {
                    this.setActualWidth(this.minWidth);
                }
            }
            // + renderedHeaderCell - for making header cell transparent when moving
            Column.EVENT_MOVING_CHANGED = 'movingChanged';
            // + renderedCell - changing left position
            Column.EVENT_LEFT_CHANGED = 'leftChanged';
            // + renderedCell - changing width
            Column.EVENT_WIDTH_CHANGED = 'widthChanged';
            // + renderedCell - for changing pinned classes
            Column.EVENT_LAST_LEFT_PINNED_CHANGED = 'lastLeftPinnedChanged';
            Column.EVENT_FIRST_RIGHT_PINNED_CHANGED = 'firstRightPinnedChanged';
            // + renderedColumn - for changing visibility icon
            Column.EVENT_VISIBLE_CHANGED = 'visibleChanged';
            // + renderedHeaderCell - marks the header with filter icon
            Column.EVENT_FILTER_ACTIVE_CHANGED = 'filterChanged';
            // + renderedHeaderCell - marks the header with sort icon
            Column.EVENT_SORT_CHANGED = 'filterChanged';
            Column.PINNED_RIGHT = 'right';
            Column.PINNED_LEFT = 'left';
            Column.AGG_SUM = 'sum';
            Column.AGG_MIN = 'min';
            Column.AGG_MAX = 'max';
            Column.AGG_FIRST = 'first';
            Column.AGG_LAST = 'last';
            Column.SORT_ASC = 'asc';
            Column.SORT_DESC = 'desc';
            __decorate([
                context_2.Autowired('gridOptionsWrapper'), 
                __metadata('design:type', gridOptionsWrapper_1.GridOptionsWrapper)
            ], Column.prototype, "gridOptionsWrapper", void 0);
            __decorate([
                context_2.Autowired('columnUtils'), 
                __metadata('design:type', columnUtils_1.ColumnUtils)
            ], Column.prototype, "columnUtils", void 0);
            __decorate([
                context_3.PostConstruct, 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], Column.prototype, "initialise", null);
            exports_1("Column", Column);
        }
    }
});
//# sourceMappingURL=column.js.map