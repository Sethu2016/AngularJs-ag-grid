System.register(["../utils", "./renderedCell", "../entities/rowNode", "../gridOptionsWrapper", "../columnController/columnController", "../entities/column", "../events", "../eventService", "../context/context", "../focusedCellController", "../constants", "./cellRendererService", "./cellRendererFactory"], function(exports_1, context_1) {
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
    var utils_1, renderedCell_1, rowNode_1, gridOptionsWrapper_1, columnController_1, column_1, events_1, eventService_1, context_2, focusedCellController_1, constants_1, cellRendererService_1, cellRendererFactory_1;
    var RenderedRow;
    return {
        setters:[
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (renderedCell_1_1) {
                renderedCell_1 = renderedCell_1_1;
            },
            function (rowNode_1_1) {
                rowNode_1 = rowNode_1_1;
            },
            function (gridOptionsWrapper_1_1) {
                gridOptionsWrapper_1 = gridOptionsWrapper_1_1;
            },
            function (columnController_1_1) {
                columnController_1 = columnController_1_1;
            },
            function (column_1_1) {
                column_1 = column_1_1;
            },
            function (events_1_1) {
                events_1 = events_1_1;
            },
            function (eventService_1_1) {
                eventService_1 = eventService_1_1;
            },
            function (context_2_1) {
                context_2 = context_2_1;
            },
            function (focusedCellController_1_1) {
                focusedCellController_1 = focusedCellController_1_1;
            },
            function (constants_1_1) {
                constants_1 = constants_1_1;
            },
            function (cellRendererService_1_1) {
                cellRendererService_1 = cellRendererService_1_1;
            },
            function (cellRendererFactory_1_1) {
                cellRendererFactory_1 = cellRendererFactory_1_1;
            }],
        execute: function() {
            class RenderedRow {
                constructor(parentScope, rowRenderer, eBodyContainer, ePinnedLeftContainer, ePinnedRightContainer, node, rowIndex) {
                    this.renderedCells = {};
                    this.destroyFunctions = [];
                    this.parentScope = parentScope;
                    this.rowRenderer = rowRenderer;
                    this.eBodyContainer = eBodyContainer;
                    this.ePinnedLeftContainer = ePinnedLeftContainer;
                    this.ePinnedRightContainer = ePinnedRightContainer;
                    this.rowIndex = rowIndex;
                    this.rowNode = node;
                }
                init() {
                    this.pinningLeft = this.columnController.isPinningLeft();
                    this.pinningRight = this.columnController.isPinningRight();
                    this.createContainers();
                    var groupHeaderTakesEntireRow = this.gridOptionsWrapper.isGroupUseEntireRow();
                    this.rowIsHeaderThatSpans = this.rowNode.group && groupHeaderTakesEntireRow;
                    this.scope = this.createChildScopeOrNull(this.rowNode.data);
                    if (this.rowIsHeaderThatSpans) {
                        this.createGroupRow();
                    }
                    else {
                        this.refreshCellsIntoRow();
                    }
                    this.addDynamicStyles();
                    this.addDynamicClasses();
                    this.addRowIds();
                    this.setTopAndHeightCss();
                    this.addRowSelectedListener();
                    this.addCellFocusedListener();
                    this.addNodeDataChangedListener();
                    this.addColumnListener();
                    this.attachContainers();
                    this.gridOptionsWrapper.executeProcessRowPostCreateFunc({
                        eRow: this.eBodyRow,
                        ePinnedLeftRow: this.ePinnedLeftRow,
                        ePinnedRightRow: this.ePinnedRightRow,
                        node: this.rowNode,
                        api: this.gridOptionsWrapper.getApi(),
                        rowIndex: this.rowIndex,
                        addRenderedRowListener: this.addEventListener.bind(this),
                        columnApi: this.gridOptionsWrapper.getColumnApi(),
                        context: this.gridOptionsWrapper.getContext()
                    });
                    if (this.scope) {
                        this.eLeftCenterAndRightRows.forEach(row => this.$compile(row)(this.scope));
                    }
                }
                addColumnListener() {
                    var columnListener = this.onColumnChanged.bind(this);
                    this.mainEventService.addEventListener(events_1.Events.EVENT_COLUMN_GROUP_OPENED, columnListener);
                    //this.mainEventService.addEventListener(Events.EVENT_COLUMN_MOVED, columnListener);
                    //this.mainEventService.addEventListener(Events.EVENT_COLUMN_ROW_GROUP_CHANGE, columnListener);
                    //this.mainEventService.addEventListener(Events.EVENT_COLUMN_RESIZED, columnListener);
                    //this.mainEventService.addEventListener(Events.EVENT_COLUMN_VALUE_CHANGE, columnListener);
                    this.mainEventService.addEventListener(events_1.Events.EVENT_COLUMN_VISIBLE, columnListener);
                    this.mainEventService.addEventListener(events_1.Events.EVENT_COLUMN_PINNED, columnListener);
                    this.destroyFunctions.push(() => {
                        this.mainEventService.removeEventListener(events_1.Events.EVENT_COLUMN_GROUP_OPENED, columnListener);
                        //this.mainEventService.removeEventListener(Events.EVENT_COLUMN_MOVED, columnListener);
                        //this.mainEventService.removeEventListener(Events.EVENT_COLUMN_ROW_GROUP_CHANGE, columnListener);
                        //this.mainEventService.removeEventListener(Events.EVENT_COLUMN_RESIZED, columnListener);
                        //this.mainEventService.removeEventListener(Events.EVENT_COLUMN_VALUE_CHANGE, columnListener);
                        this.mainEventService.removeEventListener(events_1.Events.EVENT_COLUMN_VISIBLE, columnListener);
                        this.mainEventService.removeEventListener(events_1.Events.EVENT_COLUMN_PINNED, columnListener);
                    });
                }
                onColumnChanged(event) {
                    // if row is a group row that spans, then it's not impacted by column changes
                    if (this.rowIsHeaderThatSpans) {
                        return;
                    }
                    this.refreshCellsIntoRow();
                }
                // method makes sure the right cells are present, and are in the right container. so when this gets called for
                // the first time, it sets up all the cells. but then over time the cells might appear / dissappear or move
                // container (ie into pinned)
                refreshCellsIntoRow() {
                    var columns = this.columnController.getAllDisplayedColumns();
                    var renderedCellKeys = Object.keys(this.renderedCells);
                    columns.forEach((column) => {
                        var renderedCell = this.getOrCreateCell(column);
                        this.ensureCellInCorrectRow(renderedCell);
                        utils_1.Utils.removeFromArray(renderedCellKeys, column.getColId());
                    });
                    // remove old cells from gui, but we don't destroy them, we might use them again
                    renderedCellKeys.forEach((key) => {
                        var renderedCell = this.renderedCells[key];
                        // could be old reference, ie removed cell
                        if (!renderedCell) {
                            return;
                        }
                        if (renderedCell.getParentRow()) {
                            renderedCell.getParentRow().removeChild(renderedCell.getGui());
                            renderedCell.setParentRow(null);
                        }
                        renderedCell.destroy();
                        this.renderedCells[key] = null;
                    });
                }
                ensureCellInCorrectRow(renderedCell) {
                    var eRowGui = renderedCell.getGui();
                    var column = renderedCell.getColumn();
                    var rowWeWant;
                    switch (column.getPinned()) {
                        case column_1.Column.PINNED_LEFT:
                            rowWeWant = this.ePinnedLeftRow;
                            break;
                        case column_1.Column.PINNED_RIGHT:
                            rowWeWant = this.ePinnedRightRow;
                            break;
                        default:
                            rowWeWant = this.eBodyRow;
                            break;
                    }
                    // if in wrong container, remove it
                    var oldRow = renderedCell.getParentRow();
                    var inWrongRow = oldRow !== rowWeWant;
                    if (inWrongRow) {
                        // take out from old row
                        if (oldRow) {
                            oldRow.removeChild(eRowGui);
                        }
                        rowWeWant.appendChild(eRowGui);
                        renderedCell.setParentRow(rowWeWant);
                    }
                }
                getOrCreateCell(column) {
                    var colId = column.getColId();
                    if (this.renderedCells[colId]) {
                        return this.renderedCells[colId];
                    }
                    else {
                        var renderedCell = new renderedCell_1.RenderedCell(column, this.rowNode, this.rowIndex, this.scope, this);
                        this.context.wireBean(renderedCell);
                        this.renderedCells[colId] = renderedCell;
                        return renderedCell;
                    }
                }
                addRowSelectedListener() {
                    var rowSelectedListener = () => {
                        var selected = this.rowNode.isSelected();
                        this.eLeftCenterAndRightRows.forEach((row) => utils_1.Utils.addOrRemoveCssClass(row, 'ag-row-selected', selected));
                    };
                    this.rowNode.addEventListener(rowNode_1.RowNode.EVENT_ROW_SELECTED, rowSelectedListener);
                    this.destroyFunctions.push(() => {
                        this.rowNode.removeEventListener(rowNode_1.RowNode.EVENT_ROW_SELECTED, rowSelectedListener);
                    });
                }
                addCellFocusedListener() {
                    var rowFocusedLastTime = null;
                    var rowFocusedListener = () => {
                        var rowFocused = this.focusedCellController.isRowFocused(this.rowIndex, this.rowNode.floating);
                        if (rowFocused !== rowFocusedLastTime) {
                            this.eLeftCenterAndRightRows.forEach((row) => utils_1.Utils.addOrRemoveCssClass(row, 'ag-row-focus', rowFocused));
                            this.eLeftCenterAndRightRows.forEach((row) => utils_1.Utils.addOrRemoveCssClass(row, 'ag-row-no-focus', !rowFocused));
                            rowFocusedLastTime = rowFocused;
                        }
                    };
                    this.mainEventService.addEventListener(events_1.Events.EVENT_CELL_FOCUSED, rowFocusedListener);
                    this.destroyFunctions.push(() => {
                        this.mainEventService.removeEventListener(events_1.Events.EVENT_CELL_FOCUSED, rowFocusedListener);
                    });
                    rowFocusedListener();
                }
                forEachRenderedCell(callback) {
                    utils_1.Utils.iterateObject(this.renderedCells, (key, renderedCell) => {
                        if (renderedCell) {
                            callback(renderedCell);
                        }
                    });
                }
                addNodeDataChangedListener() {
                    var nodeDataChangedListener = () => {
                        var animate = false;
                        var newData = true;
                        this.forEachRenderedCell(renderedCell => renderedCell.refreshCell(animate, newData));
                    };
                    this.rowNode.addEventListener(rowNode_1.RowNode.EVENT_DATA_CHANGED, nodeDataChangedListener);
                    this.destroyFunctions.push(() => {
                        this.rowNode.removeEventListener(rowNode_1.RowNode.EVENT_DATA_CHANGED, nodeDataChangedListener);
                    });
                }
                createContainers() {
                    this.eBodyRow = this.createRowContainer();
                    this.eLeftCenterAndRightRows = [this.eBodyRow];
                    if (!this.gridOptionsWrapper.isForPrint()) {
                        this.ePinnedLeftRow = this.createRowContainer();
                        this.ePinnedRightRow = this.createRowContainer();
                        this.eLeftCenterAndRightRows.push(this.ePinnedLeftRow);
                        this.eLeftCenterAndRightRows.push(this.ePinnedRightRow);
                    }
                }
                attachContainers() {
                    this.eBodyContainer.appendChild(this.eBodyRow);
                    if (!this.gridOptionsWrapper.isForPrint()) {
                        this.ePinnedLeftContainer.appendChild(this.ePinnedLeftRow);
                        this.ePinnedRightContainer.appendChild(this.ePinnedRightRow);
                    }
                }
                onMouseEvent(eventName, mouseEvent, eventSource, cell) {
                    var renderedCell = this.renderedCells[cell.column.getId()];
                    if (renderedCell) {
                        renderedCell.onMouseEvent(eventName, mouseEvent, eventSource);
                    }
                }
                setTopAndHeightCss() {
                    // if showing scrolls, position on the container
                    if (!this.gridOptionsWrapper.isForPrint()) {
                        var topPx = this.rowNode.rowTop + "px";
                        this.eLeftCenterAndRightRows.forEach(row => row.style.top = topPx);
                    }
                    var heightPx = this.rowNode.rowHeight + 'px';
                    this.eLeftCenterAndRightRows.forEach(row => row.style.height = heightPx);
                }
                // adds in row and row-id attributes to the row
                addRowIds() {
                    var rowStr = this.rowIndex.toString();
                    if (this.rowNode.floating === constants_1.Constants.FLOATING_BOTTOM) {
                        rowStr = 'fb-' + rowStr;
                    }
                    else if (this.rowNode.floating === constants_1.Constants.FLOATING_TOP) {
                        rowStr = 'ft-' + rowStr;
                    }
                    this.eLeftCenterAndRightRows.forEach(row => row.setAttribute('row', rowStr));
                    if (typeof this.gridOptionsWrapper.getBusinessKeyForNodeFunc() === 'function') {
                        var businessKey = this.gridOptionsWrapper.getBusinessKeyForNodeFunc()(this.rowNode);
                        if (typeof businessKey === 'string' || typeof businessKey === 'number') {
                            this.eLeftCenterAndRightRows.forEach(row => row.setAttribute('row-id', businessKey));
                        }
                    }
                }
                addEventListener(eventType, listener) {
                    if (!this.renderedRowEventService) {
                        this.renderedRowEventService = new eventService_1.EventService();
                    }
                    this.renderedRowEventService.addEventListener(eventType, listener);
                }
                removeEventListener(eventType, listener) {
                    this.renderedRowEventService.removeEventListener(eventType, listener);
                }
                softRefresh() {
                    this.forEachRenderedCell(renderedCell => {
                        if (renderedCell.isVolatile()) {
                            renderedCell.refreshCell();
                        }
                    });
                }
                getRenderedCellForColumn(column) {
                    return this.renderedCells[column.getColId()];
                }
                getCellForCol(column) {
                    var renderedCell = this.renderedCells[column.getColId()];
                    if (renderedCell) {
                        return renderedCell.getGui();
                    }
                    else {
                        return null;
                    }
                }
                destroy() {
                    this.destroyFunctions.forEach(func => func());
                    this.destroyScope();
                    this.eBodyContainer.removeChild(this.eBodyRow);
                    if (!this.gridOptionsWrapper.isForPrint()) {
                        this.ePinnedLeftContainer.removeChild(this.ePinnedLeftRow);
                        this.ePinnedRightContainer.removeChild(this.ePinnedRightRow);
                    }
                    this.forEachRenderedCell(renderedCell => renderedCell.destroy());
                    if (this.renderedRowEventService) {
                        this.renderedRowEventService.dispatchEvent(RenderedRow.EVENT_RENDERED_ROW_REMOVED, { node: this.rowNode });
                    }
                }
                destroyScope() {
                    if (this.scope) {
                        this.scope.$destroy();
                        this.scope = null;
                    }
                }
                isDataInList(rows) {
                    return rows.indexOf(this.rowNode.data) >= 0;
                }
                isGroup() {
                    return this.rowNode.group === true;
                }
                createGroupRow() {
                    var eGroupRow = this.createGroupSpanningEntireRowCell(false);
                    if (this.pinningLeft) {
                        this.ePinnedLeftRow.appendChild(eGroupRow);
                        var eGroupRowPadding = this.createGroupSpanningEntireRowCell(true);
                        this.eBodyRow.appendChild(eGroupRowPadding);
                    }
                    else {
                        this.eBodyRow.appendChild(eGroupRow);
                    }
                    if (this.pinningRight) {
                        var ePinnedRightPadding = this.createGroupSpanningEntireRowCell(true);
                        this.ePinnedRightRow.appendChild(ePinnedRightPadding);
                    }
                }
                createGroupSpanningEntireRowCell(padding) {
                    var eRow;
                    // padding means we are on the right hand side of a pinned table, ie
                    // in the main body.
                    eRow = document.createElement('span');
                    if (!padding) {
                        var cellRenderer = this.gridOptionsWrapper.getGroupRowRenderer();
                        var cellRendererParams = this.gridOptionsWrapper.getGroupRowRendererParams();
                        if (!cellRenderer) {
                            cellRenderer = cellRendererFactory_1.CellRendererFactory.GROUP;
                            cellRendererParams = {
                                innerRenderer: this.gridOptionsWrapper.getGroupRowInnerRenderer(),
                            };
                        }
                        var params = {
                            data: this.rowNode.data,
                            node: this.rowNode,
                            $scope: this.scope,
                            rowIndex: this.rowIndex,
                            api: this.gridOptionsWrapper.getApi(),
                            columnApi: this.gridOptionsWrapper.getColumnApi(),
                            context: this.gridOptionsWrapper.getContext(),
                            eGridCell: eRow,
                            eParentOfValue: eRow,
                            addRenderedRowListener: this.addEventListener.bind(this),
                            colDef: {
                                cellRenderer: cellRenderer,
                                cellRendererParams: cellRendererParams
                            }
                        };
                        if (cellRendererParams) {
                            utils_1.Utils.assign(params, cellRendererParams);
                        }
                        this.cellRendererService.useCellRenderer(cellRenderer, eRow, params);
                    }
                    if (this.rowNode.footer) {
                        utils_1.Utils.addCssClass(eRow, 'ag-footer-cell-entire-row');
                    }
                    else {
                        utils_1.Utils.addCssClass(eRow, 'ag-group-cell-entire-row');
                    }
                    return eRow;
                }
                createChildScopeOrNull(data) {
                    if (this.gridOptionsWrapper.isAngularCompileRows()) {
                        var newChildScope = this.parentScope.$new();
                        newChildScope.data = data;
                        return newChildScope;
                    }
                    else {
                        return null;
                    }
                }
                addDynamicStyles() {
                    var rowStyle = this.gridOptionsWrapper.getRowStyle();
                    if (rowStyle) {
                        if (typeof rowStyle === 'function') {
                            console.log('ag-Grid: rowStyle should be an object of key/value styles, not be a function, use getRowStyle() instead');
                        }
                        else {
                            this.eLeftCenterAndRightRows.forEach(row => utils_1.Utils.addStylesToElement(row, rowStyle));
                        }
                    }
                    var rowStyleFunc = this.gridOptionsWrapper.getRowStyleFunc();
                    if (rowStyleFunc) {
                        var params = {
                            data: this.rowNode.data,
                            node: this.rowNode,
                            api: this.gridOptionsWrapper.getApi(),
                            context: this.gridOptionsWrapper.getContext(),
                            $scope: this.scope
                        };
                        var cssToUseFromFunc = rowStyleFunc(params);
                        this.eLeftCenterAndRightRows.forEach(row => utils_1.Utils.addStylesToElement(row, cssToUseFromFunc));
                    }
                }
                createParams() {
                    var params = {
                        node: this.rowNode,
                        data: this.rowNode.data,
                        rowIndex: this.rowIndex,
                        $scope: this.scope,
                        context: this.gridOptionsWrapper.getContext(),
                        api: this.gridOptionsWrapper.getApi()
                    };
                    return params;
                }
                createEvent(event, eventSource) {
                    var agEvent = this.createParams();
                    agEvent.event = event;
                    agEvent.eventSource = eventSource;
                    return agEvent;
                }
                createRowContainer() {
                    var vRow = document.createElement('div');
                    vRow.addEventListener("click", this.onRowClicked.bind(this));
                    vRow.addEventListener("dblclick", (event) => {
                        var agEvent = this.createEvent(event, this);
                        this.mainEventService.dispatchEvent(events_1.Events.EVENT_ROW_DOUBLE_CLICKED, agEvent);
                    });
                    return vRow;
                }
                onRowClicked(event) {
                    var agEvent = this.createEvent(event, this);
                    this.mainEventService.dispatchEvent(events_1.Events.EVENT_ROW_CLICKED, agEvent);
                    // ctrlKey for windows, metaKey for Apple
                    var multiSelectKeyPressed = event.ctrlKey || event.metaKey;
                    // we do not allow selecting groups by clicking (as the click here expands the group)
                    // so return if it's a group row
                    if (this.rowNode.group) {
                        return;
                    }
                    // we also don't allow selection of floating rows
                    if (this.rowNode.floating) {
                        return;
                    }
                    // making local variables to make the below more readable
                    var gridOptionsWrapper = this.gridOptionsWrapper;
                    // if no selection method enabled, do nothing
                    if (!gridOptionsWrapper.isRowSelection()) {
                        return;
                    }
                    // if click selection suppressed, do nothing
                    if (gridOptionsWrapper.isSuppressRowClickSelection()) {
                        return;
                    }
                    if (this.rowNode.isSelected()) {
                        if (multiSelectKeyPressed) {
                            if (gridOptionsWrapper.isRowDeselection()) {
                                this.rowNode.setSelected(false);
                            }
                        }
                        else {
                            // selected with no multi key, must make sure anything else is unselected
                            this.rowNode.setSelected(true, true);
                        }
                    }
                    else {
                        this.rowNode.setSelected(true, !multiSelectKeyPressed);
                    }
                }
                getRowNode() {
                    return this.rowNode;
                }
                getRowIndex() {
                    return this.rowIndex;
                }
                refreshCells(colIds, animate) {
                    if (!colIds) {
                        return;
                    }
                    var columnsToRefresh = this.columnController.getColumns(colIds);
                    this.forEachRenderedCell(renderedCell => {
                        var colForCel = renderedCell.getColumn();
                        if (columnsToRefresh.indexOf(colForCel) >= 0) {
                            renderedCell.refreshCell(animate);
                        }
                    });
                }
                addDynamicClasses() {
                    var classes = [];
                    classes.push('ag-row');
                    classes.push('ag-row-no-focus');
                    classes.push(this.rowIndex % 2 == 0 ? "ag-row-even" : "ag-row-odd");
                    if (this.rowNode.isSelected()) {
                        classes.push("ag-row-selected");
                    }
                    if (this.rowNode.group) {
                        classes.push("ag-row-group");
                        // if a group, put the level of the group in
                        classes.push("ag-row-level-" + this.rowNode.level);
                        if (!this.rowNode.footer && this.rowNode.expanded) {
                            classes.push("ag-row-group-expanded");
                        }
                        if (!this.rowNode.footer && !this.rowNode.expanded) {
                            // opposite of expanded is contracted according to the internet.
                            classes.push("ag-row-group-contracted");
                        }
                        if (this.rowNode.footer) {
                            classes.push("ag-row-footer");
                        }
                    }
                    else {
                        // if a leaf, and a parent exists, put a level of the parent, else put level of 0 for top level item
                        if (this.rowNode.parent) {
                            classes.push("ag-row-level-" + (this.rowNode.parent.level + 1));
                        }
                        else {
                            classes.push("ag-row-level-0");
                        }
                    }
                    // add in extra classes provided by the config
                    var gridOptionsRowClass = this.gridOptionsWrapper.getRowClass();
                    if (gridOptionsRowClass) {
                        if (typeof gridOptionsRowClass === 'function') {
                            console.warn('ag-Grid: rowClass should not be a function, please use getRowClass instead');
                        }
                        else {
                            if (typeof gridOptionsRowClass === 'string') {
                                classes.push(gridOptionsRowClass);
                            }
                            else if (Array.isArray(gridOptionsRowClass)) {
                                gridOptionsRowClass.forEach(function (classItem) {
                                    classes.push(classItem);
                                });
                            }
                        }
                    }
                    var gridOptionsRowClassFunc = this.gridOptionsWrapper.getRowClassFunc();
                    if (gridOptionsRowClassFunc) {
                        var params = {
                            node: this.rowNode,
                            data: this.rowNode.data,
                            rowIndex: this.rowIndex,
                            context: this.gridOptionsWrapper.getContext(),
                            api: this.gridOptionsWrapper.getApi()
                        };
                        var classToUseFromFunc = gridOptionsRowClassFunc(params);
                        if (classToUseFromFunc) {
                            if (typeof classToUseFromFunc === 'string') {
                                classes.push(classToUseFromFunc);
                            }
                            else if (Array.isArray(classToUseFromFunc)) {
                                classToUseFromFunc.forEach(function (classItem) {
                                    classes.push(classItem);
                                });
                            }
                        }
                    }
                    classes.forEach((classStr) => {
                        this.eLeftCenterAndRightRows.forEach(row => utils_1.Utils.addCssClass(row, classStr));
                    });
                }
            }
            RenderedRow.EVENT_RENDERED_ROW_REMOVED = 'renderedRowRemoved';
            __decorate([
                context_2.Autowired('gridOptionsWrapper'), 
                __metadata('design:type', gridOptionsWrapper_1.GridOptionsWrapper)
            ], RenderedRow.prototype, "gridOptionsWrapper", void 0);
            __decorate([
                context_2.Autowired('columnController'), 
                __metadata('design:type', columnController_1.ColumnController)
            ], RenderedRow.prototype, "columnController", void 0);
            __decorate([
                context_2.Autowired('$compile'), 
                __metadata('design:type', Object)
            ], RenderedRow.prototype, "$compile", void 0);
            __decorate([
                context_2.Autowired('eventService'), 
                __metadata('design:type', eventService_1.EventService)
            ], RenderedRow.prototype, "mainEventService", void 0);
            __decorate([
                context_2.Autowired('context'), 
                __metadata('design:type', context_2.Context)
            ], RenderedRow.prototype, "context", void 0);
            __decorate([
                context_2.Autowired('focusedCellController'), 
                __metadata('design:type', focusedCellController_1.FocusedCellController)
            ], RenderedRow.prototype, "focusedCellController", void 0);
            __decorate([
                context_2.Autowired('cellRendererService'), 
                __metadata('design:type', cellRendererService_1.CellRendererService)
            ], RenderedRow.prototype, "cellRendererService", void 0);
            __decorate([
                context_2.PostConstruct, 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], RenderedRow.prototype, "init", null);
            exports_1("RenderedRow", RenderedRow);
        }
    }
});
//# sourceMappingURL=renderedRow.js.map