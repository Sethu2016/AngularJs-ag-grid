System.register(["../utils", "../gridOptionsWrapper", "../selectionRendererFactory", "../gridPanel/gridPanel", "../expressionService", "../templateService", "../valueService", "../eventService", "../rowControllers/floatingRowModel", "./renderedRow", "../events", "../constants", "../context/context", "../gridCore", "../columnController/columnController", "../logger", "../focusedCellController", "../cellNavigationService", "../entities/gridCell"], function(exports_1, context_1) {
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
    var __param = (this && this.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };
    var utils_1, gridOptionsWrapper_1, selectionRendererFactory_1, gridPanel_1, expressionService_1, templateService_1, valueService_1, eventService_1, floatingRowModel_1, renderedRow_1, events_1, constants_1, context_2, gridCore_1, columnController_1, logger_1, focusedCellController_1, cellNavigationService_1, gridCell_1;
    var RowRenderer;
    return {
        setters:[
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (gridOptionsWrapper_1_1) {
                gridOptionsWrapper_1 = gridOptionsWrapper_1_1;
            },
            function (selectionRendererFactory_1_1) {
                selectionRendererFactory_1 = selectionRendererFactory_1_1;
            },
            function (gridPanel_1_1) {
                gridPanel_1 = gridPanel_1_1;
            },
            function (expressionService_1_1) {
                expressionService_1 = expressionService_1_1;
            },
            function (templateService_1_1) {
                templateService_1 = templateService_1_1;
            },
            function (valueService_1_1) {
                valueService_1 = valueService_1_1;
            },
            function (eventService_1_1) {
                eventService_1 = eventService_1_1;
            },
            function (floatingRowModel_1_1) {
                floatingRowModel_1 = floatingRowModel_1_1;
            },
            function (renderedRow_1_1) {
                renderedRow_1 = renderedRow_1_1;
            },
            function (events_1_1) {
                events_1 = events_1_1;
            },
            function (constants_1_1) {
                constants_1 = constants_1_1;
            },
            function (context_2_1) {
                context_2 = context_2_1;
            },
            function (gridCore_1_1) {
                gridCore_1 = gridCore_1_1;
            },
            function (columnController_1_1) {
                columnController_1 = columnController_1_1;
            },
            function (logger_1_1) {
                logger_1 = logger_1_1;
            },
            function (focusedCellController_1_1) {
                focusedCellController_1 = focusedCellController_1_1;
            },
            function (cellNavigationService_1_1) {
                cellNavigationService_1 = cellNavigationService_1_1;
            },
            function (gridCell_1_1) {
                gridCell_1 = gridCell_1_1;
            }],
        execute: function() {
            let RowRenderer = class RowRenderer {
                constructor() {
                    // map of row ids to row objects. keeps track of which elements
                    // are rendered for which rows in the dom.
                    this.renderedRows = {};
                    this.renderedTopFloatingRows = [];
                    this.renderedBottomFloatingRows = [];
                }
                agWire(loggerFactory) {
                    this.logger = this.loggerFactory.create('RowRenderer');
                    this.logger = loggerFactory.create('BalancedColumnTreeBuilder');
                }
                init() {
                    this.getContainersFromGridPanel();
                    this.eventService.addEventListener(events_1.Events.EVENT_COLUMN_GROUP_OPENED, this.onColumnEvent.bind(this));
                    this.eventService.addEventListener(events_1.Events.EVENT_COLUMN_VISIBLE, this.onColumnEvent.bind(this));
                    this.eventService.addEventListener(events_1.Events.EVENT_COLUMN_RESIZED, this.onColumnEvent.bind(this));
                    this.eventService.addEventListener(events_1.Events.EVENT_COLUMN_PINNED, this.onColumnEvent.bind(this));
                    this.eventService.addEventListener(events_1.Events.EVENT_COLUMN_ROW_GROUP_CHANGE, this.onColumnEvent.bind(this));
                    this.eventService.addEventListener(events_1.Events.EVENT_MODEL_UPDATED, this.refreshView.bind(this));
                    this.eventService.addEventListener(events_1.Events.EVENT_FLOATING_ROW_DATA_CHANGED, this.refreshView.bind(this, null));
                    //this.eventService.addEventListener(Events.EVENT_COLUMN_VALUE_CHANGE, this.refreshView.bind(this, null));
                    //this.eventService.addEventListener(Events.EVENT_COLUMN_EVERYTHING_CHANGED, this.refreshView.bind(this, null));
                    //this.eventService.addEventListener(Events.EVENT_COLUMN_ROW_GROUP_CHANGE, this.refreshView.bind(this, null));
                    this.refreshView();
                }
                onColumnEvent(event) {
                    if (event.isContainerWidthImpacted()) {
                        this.setMainRowWidths();
                    }
                }
                getContainersFromGridPanel() {
                    this.eBodyContainer = this.gridPanel.getBodyContainer();
                    this.ePinnedLeftColsContainer = this.gridPanel.getPinnedLeftColsContainer();
                    this.ePinnedRightColsContainer = this.gridPanel.getPinnedRightColsContainer();
                    this.eFloatingTopContainer = this.gridPanel.getFloatingTopContainer();
                    this.eFloatingTopPinnedLeftContainer = this.gridPanel.getPinnedLeftFloatingTop();
                    this.eFloatingTopPinnedRightContainer = this.gridPanel.getPinnedRightFloatingTop();
                    this.eFloatingBottomContainer = this.gridPanel.getFloatingBottomContainer();
                    this.eFloatingBottomPinnedLeftContainer = this.gridPanel.getPinnedLeftFloatingBottom();
                    this.eFloatingBottomPinnedRightContainer = this.gridPanel.getPinnedRightFloatingBottom();
                    this.eBodyViewport = this.gridPanel.getBodyViewport();
                    this.eAllBodyContainers = [this.eBodyContainer, this.eFloatingBottomContainer,
                        this.eFloatingTopContainer];
                    this.eAllPinnedLeftContainers = [
                        this.ePinnedLeftColsContainer,
                        this.eFloatingBottomPinnedLeftContainer,
                        this.eFloatingTopPinnedLeftContainer];
                    this.eAllPinnedRightContainers = [
                        this.ePinnedRightColsContainer,
                        this.eFloatingBottomPinnedRightContainer,
                        this.eFloatingTopPinnedRightContainer];
                }
                setRowModel(rowModel) {
                    this.rowModel = rowModel;
                }
                getAllCellsForColumn(column) {
                    var eCells = [];
                    utils_1.Utils.iterateObject(this.renderedRows, callback);
                    utils_1.Utils.iterateObject(this.renderedBottomFloatingRows, callback);
                    utils_1.Utils.iterateObject(this.renderedBottomFloatingRows, callback);
                    function callback(key, renderedRow) {
                        var eCell = renderedRow.getCellForCol(column);
                        if (eCell) {
                            eCells.push(eCell);
                        }
                    }
                    return eCells;
                }
                setMainRowWidths() {
                    var mainRowWidth = this.columnController.getBodyContainerWidth() + "px";
                    this.eAllBodyContainers.forEach(function (container) {
                        var unpinnedRows = container.querySelectorAll(".ag-row");
                        for (var i = 0; i < unpinnedRows.length; i++) {
                            unpinnedRows[i].style.width = mainRowWidth;
                        }
                    });
                }
                refreshAllFloatingRows() {
                    this.refreshFloatingRows(this.renderedTopFloatingRows, this.floatingRowModel.getFloatingTopRowData(), this.eFloatingTopPinnedLeftContainer, this.eFloatingTopPinnedRightContainer, this.eFloatingTopContainer);
                    this.refreshFloatingRows(this.renderedBottomFloatingRows, this.floatingRowModel.getFloatingBottomRowData(), this.eFloatingBottomPinnedLeftContainer, this.eFloatingBottomPinnedRightContainer, this.eFloatingBottomContainer);
                }
                refreshFloatingRows(renderedRows, rowNodes, pinnedLeftContainer, pinnedRightContainer, bodyContainer) {
                    renderedRows.forEach((row) => {
                        row.destroy();
                    });
                    renderedRows.length = 0;
                    // if no cols, don't draw row - can we get rid of this???
                    var columns = this.columnController.getAllDisplayedColumns();
                    if (!columns || columns.length == 0) {
                        return;
                    }
                    if (rowNodes) {
                        rowNodes.forEach((node, rowIndex) => {
                            var renderedRow = new renderedRow_1.RenderedRow(this.$scope, this, bodyContainer, pinnedLeftContainer, pinnedRightContainer, node, rowIndex);
                            this.context.wireBean(renderedRow);
                            renderedRows.push(renderedRow);
                        });
                    }
                }
                refreshView(refreshEvent) {
                    this.logger.log('refreshView');
                    var focusedCell = this.focusedCellController.getFocusCellIfBrowserFocused();
                    this.focusedCellController.getFocusedCell();
                    var refreshFromIndex = refreshEvent ? refreshEvent.fromIndex : null;
                    if (!this.gridOptionsWrapper.isForPrint()) {
                        var containerHeight = this.rowModel.getRowCombinedHeight();
                        this.eBodyContainer.style.height = containerHeight + "px";
                        this.ePinnedLeftColsContainer.style.height = containerHeight + "px";
                        this.ePinnedRightColsContainer.style.height = containerHeight + "px";
                    }
                    this.refreshAllVirtualRows(refreshFromIndex);
                    this.refreshAllFloatingRows();
                    this.restoreFocusedCell(focusedCell);
                }
                // sets the focus to the provided cell, if the cell is provided. this way, the user can call refresh without
                // worry about the focus been lost. this is important when the user is using keyboard navigation to do edits
                // and the cellEditor is calling 'refresh' to get other cells to update (as other cells might depend on the
                // edited cell).
                restoreFocusedCell(gridCell) {
                    if (gridCell) {
                        this.focusedCellController.setFocusedCell(gridCell.rowIndex, gridCell.column, gridCell.floating, true);
                    }
                }
                softRefreshView() {
                    var focusedCell = this.focusedCellController.getFocusCellIfBrowserFocused();
                    utils_1.Utils.iterateObject(this.renderedRows, (key, renderedRow) => {
                        renderedRow.softRefresh();
                    });
                    this.restoreFocusedCell(focusedCell);
                }
                addRenderedRowListener(eventName, rowIndex, callback) {
                    var renderedRow = this.renderedRows[rowIndex];
                    renderedRow.addEventListener(eventName, callback);
                }
                refreshRows(rowNodes) {
                    if (!rowNodes || rowNodes.length == 0) {
                        return;
                    }
                    var focusedCell = this.focusedCellController.getFocusCellIfBrowserFocused();
                    // we only need to be worried about rendered rows, as this method is
                    // called to whats rendered. if the row isn't rendered, we don't care
                    var indexesToRemove = [];
                    utils_1.Utils.iterateObject(this.renderedRows, (key, renderedRow) => {
                        var rowNode = renderedRow.getRowNode();
                        if (rowNodes.indexOf(rowNode) >= 0) {
                            indexesToRemove.push(key);
                        }
                    });
                    // remove the rows
                    this.removeVirtualRow(indexesToRemove);
                    // add draw them again
                    this.drawVirtualRows();
                    this.restoreFocusedCell(focusedCell);
                }
                refreshCells(rowNodes, colIds, animate = false) {
                    if (!rowNodes || rowNodes.length == 0) {
                        return;
                    }
                    // we only need to be worried about rendered rows, as this method is
                    // called to whats rendered. if the row isn't rendered, we don't care
                    utils_1.Utils.iterateObject(this.renderedRows, (key, renderedRow) => {
                        var rowNode = renderedRow.getRowNode();
                        if (rowNodes.indexOf(rowNode) >= 0) {
                            renderedRow.refreshCells(colIds, animate);
                        }
                    });
                }
                rowDataChanged(rows) {
                    // we only need to be worried about rendered rows, as this method is
                    // called to whats rendered. if the row isn't rendered, we don't care
                    var indexesToRemove = [];
                    var renderedRows = this.renderedRows;
                    Object.keys(renderedRows).forEach(function (key) {
                        var renderedRow = renderedRows[key];
                        // see if the rendered row is in the list of rows we have to update
                        if (renderedRow.isDataInList(rows)) {
                            indexesToRemove.push(key);
                        }
                    });
                    // remove the rows
                    this.removeVirtualRow(indexesToRemove);
                    // add draw them again
                    this.drawVirtualRows();
                }
                destroy() {
                    var rowsToRemove = Object.keys(this.renderedRows);
                    this.removeVirtualRow(rowsToRemove);
                }
                refreshAllVirtualRows(fromIndex) {
                    // remove all current virtual rows, as they have old data
                    var rowsToRemove = Object.keys(this.renderedRows);
                    this.removeVirtualRow(rowsToRemove, fromIndex);
                    // add in new rows
                    this.drawVirtualRows();
                }
                // public - removes the group rows and then redraws them again
                refreshGroupRows() {
                    // find all the group rows
                    var rowsToRemove = [];
                    var that = this;
                    Object.keys(this.renderedRows).forEach(function (key) {
                        var renderedRow = that.renderedRows[key];
                        if (renderedRow.isGroup()) {
                            rowsToRemove.push(key);
                        }
                    });
                    // remove the rows
                    this.removeVirtualRow(rowsToRemove);
                    // and draw them back again
                    this.ensureRowsRendered();
                }
                // takes array of row indexes
                removeVirtualRow(rowsToRemove, fromIndex) {
                    var that = this;
                    // if no fromIndex then set to -1, which will refresh everything
                    var realFromIndex = (typeof fromIndex === 'number') ? fromIndex : -1;
                    rowsToRemove.forEach(function (indexToRemove) {
                        if (indexToRemove >= realFromIndex) {
                            that.unbindVirtualRow(indexToRemove);
                        }
                    });
                }
                unbindVirtualRow(indexToRemove) {
                    var renderedRow = this.renderedRows[indexToRemove];
                    renderedRow.destroy();
                    var event = { node: renderedRow.getRowNode(), rowIndex: indexToRemove };
                    this.eventService.dispatchEvent(events_1.Events.EVENT_VIRTUAL_ROW_REMOVED, event);
                    delete this.renderedRows[indexToRemove];
                }
                drawVirtualRows() {
                    this.workOutFirstAndLastRowsToRender();
                    this.ensureRowsRendered();
                }
                workOutFirstAndLastRowsToRender() {
                    var newFirst;
                    var newLast;
                    if (!this.rowModel.isRowsToRender()) {
                        newFirst = 0;
                        newLast = -1; // setting to -1 means nothing in range
                    }
                    else {
                        var rowCount = this.rowModel.getRowCount();
                        if (this.gridOptionsWrapper.isForPrint()) {
                            newFirst = 0;
                            newLast = rowCount;
                        }
                        else {
                            var topPixel = this.eBodyViewport.scrollTop;
                            var bottomPixel = topPixel + this.eBodyViewport.offsetHeight;
                            var first = this.rowModel.getRowIndexAtPixel(topPixel);
                            var last = this.rowModel.getRowIndexAtPixel(bottomPixel);
                            //add in buffer
                            var buffer = this.gridOptionsWrapper.getRowBuffer();
                            first = first - buffer;
                            last = last + buffer;
                            // adjust, in case buffer extended actual size
                            if (first < 0) {
                                first = 0;
                            }
                            if (last > rowCount - 1) {
                                last = rowCount - 1;
                            }
                            newFirst = first;
                            newLast = last;
                        }
                    }
                    var firstDiffers = newFirst !== this.firstRenderedRow;
                    var lastDiffers = newLast !== this.lastRenderedRow;
                    if (firstDiffers || lastDiffers) {
                        this.firstRenderedRow = newFirst;
                        this.lastRenderedRow = newLast;
                        var event = { firstRow: newFirst, lastRow: newLast };
                        this.eventService.dispatchEvent(events_1.Events.EVENT_VIEWPORT_CHANGED, event);
                    }
                }
                getFirstVirtualRenderedRow() {
                    return this.firstRenderedRow;
                }
                getLastVirtualRenderedRow() {
                    return this.lastRenderedRow;
                }
                ensureRowsRendered() {
                    //var start = new Date().getTime();
                    // at the end, this array will contain the items we need to remove
                    var rowsToRemove = Object.keys(this.renderedRows);
                    // add in new rows
                    for (var rowIndex = this.firstRenderedRow; rowIndex <= this.lastRenderedRow; rowIndex++) {
                        // see if item already there, and if yes, take it out of the 'to remove' array
                        if (rowsToRemove.indexOf(rowIndex.toString()) >= 0) {
                            rowsToRemove.splice(rowsToRemove.indexOf(rowIndex.toString()), 1);
                            continue;
                        }
                        // check this row actually exists (in case overflow buffer window exceeds real data)
                        var node = this.rowModel.getRow(rowIndex);
                        if (node) {
                            this.insertRow(node, rowIndex);
                        }
                    }
                    // at this point, everything in our 'rowsToRemove' . . .
                    this.removeVirtualRow(rowsToRemove);
                    // if we are doing angular compiling, then do digest the scope here
                    if (this.gridOptionsWrapper.isAngularCompileRows()) {
                        // we do it in a timeout, in case we are already in an apply
                        setTimeout(() => { this.$scope.$apply(); }, 0);
                    }
                    //var end = new Date().getTime();
                    //console.log(end-start);
                }
                onMouseEvent(eventName, mouseEvent, eventSource, cell) {
                    var renderedRow;
                    switch (cell.floating) {
                        case constants_1.Constants.FLOATING_TOP:
                            renderedRow = this.renderedTopFloatingRows[cell.rowIndex];
                            break;
                        case constants_1.Constants.FLOATING_BOTTOM:
                            renderedRow = this.renderedBottomFloatingRows[cell.rowIndex];
                            break;
                        default:
                            renderedRow = this.renderedRows[cell.rowIndex];
                            break;
                    }
                    if (renderedRow) {
                        renderedRow.onMouseEvent(eventName, mouseEvent, eventSource, cell);
                    }
                }
                insertRow(node, rowIndex) {
                    var columns = this.columnController.getAllDisplayedColumns();
                    // if no cols, don't draw row
                    if (!columns || columns.length == 0) {
                        return;
                    }
                    var renderedRow = new renderedRow_1.RenderedRow(this.$scope, this, this.eBodyContainer, this.ePinnedLeftColsContainer, this.ePinnedRightColsContainer, node, rowIndex);
                    this.context.wireBean(renderedRow);
                    this.renderedRows[rowIndex] = renderedRow;
                }
                getRenderedNodes() {
                    var renderedRows = this.renderedRows;
                    return Object.keys(renderedRows).map(key => {
                        return renderedRows[key].getRowNode();
                    });
                }
                // we use index for rows, but column object for columns, as the next column (by index) might not
                // be visible (header grouping) so it's not reliable, so using the column object instead.
                navigateToNextCell(key, rowIndex, column, floating) {
                    var nextCell = new gridCell_1.GridCell(rowIndex, floating, column);
                    // we keep searching for a next cell until we find one. this is how the group rows get skipped
                    while (true) {
                        nextCell = this.cellNavigationService.getNextCellToFocus(key, nextCell);
                        if (utils_1.Utils.missing(nextCell)) {
                            break;
                        }
                        var skipGroupRows = this.gridOptionsWrapper.isGroupUseEntireRow();
                        if (skipGroupRows) {
                            var rowNode = this.rowModel.getRow(nextCell.rowIndex);
                            if (!rowNode.group) {
                                break;
                            }
                        }
                        else {
                            break;
                        }
                    }
                    // no next cell means we have reached a grid boundary, eg left, right, top or bottom of grid
                    if (!nextCell) {
                        return;
                    }
                    // this scrolls the row into view
                    if (utils_1.Utils.missing(nextCell.floating)) {
                        this.gridPanel.ensureIndexVisible(nextCell.rowIndex);
                    }
                    if (!nextCell.column.isPinned()) {
                        this.gridPanel.ensureColumnVisible(nextCell.column);
                    }
                    // need to nudge the scrolls for the floating items. otherwise when we set focus on a non-visible
                    // floating cell, the scrolls get out of sync
                    this.gridPanel.horizontallyScrollHeaderCenterAndFloatingCenter();
                    this.focusedCellController.setFocusedCell(nextCell.rowIndex, nextCell.column, nextCell.floating, true);
                    if (this.rangeController) {
                        this.rangeController.setRangeToCell(new gridCell_1.GridCell(nextCell.rowIndex, nextCell.floating, nextCell.column));
                    }
                }
                getComponentForCell(gridCell) {
                    var rowComponent;
                    switch (gridCell.floating) {
                        case constants_1.Constants.FLOATING_TOP:
                            rowComponent = this.renderedTopFloatingRows[gridCell.rowIndex];
                            break;
                        case constants_1.Constants.FLOATING_BOTTOM:
                            rowComponent = this.renderedBottomFloatingRows[gridCell.rowIndex];
                            break;
                        default:
                            rowComponent = this.renderedRows[gridCell.rowIndex];
                            break;
                    }
                    if (!rowComponent) {
                        return null;
                    }
                    var cellComponent = rowComponent.getRenderedCellForColumn(gridCell.column);
                    return cellComponent;
                }
                // called by the cell, when tab is pressed while editing
                moveFocusToNextCell(rowIndex, column, floating, shiftKey, startEditing) {
                    var nextCell = new gridCell_1.GridCell(rowIndex, floating, column);
                    while (true) {
                        nextCell = this.cellNavigationService.getNextTabbedCell(nextCell, shiftKey);
                        var nextRenderedCell = this.getComponentForCell(nextCell);
                        // if no 'next cell', means we have got to last cell of grid, so nothing to move to,
                        // so bottom right cell going forwards, or top left going backwards
                        if (!nextRenderedCell) {
                            return;
                        }
                        // if editing, but cell not editable, skip cell
                        if (startEditing && !nextRenderedCell.isCellEditable()) {
                            continue;
                        }
                        // this scrolls the row into view
                        var cellIsNotFloating = utils_1.Utils.missing(nextCell.floating);
                        if (cellIsNotFloating) {
                            this.gridPanel.ensureIndexVisible(nextCell.rowIndex);
                        }
                        this.gridPanel.ensureColumnVisible(nextCell.column);
                        // need to nudge the scrolls for the floating items. otherwise when we set focus on a non-visible
                        // floating cell, the scrolls get out of sync
                        this.gridPanel.horizontallyScrollHeaderCenterAndFloatingCenter();
                        if (startEditing) {
                            nextRenderedCell.startEditingIfEnabled();
                            nextRenderedCell.focusCell(false);
                        }
                        else {
                            nextRenderedCell.focusCell(true);
                        }
                        // by default, when we click a cell, it gets selected into a range, so to keep keyboard navigation
                        // consistent, we set into range here also.
                        if (this.rangeController) {
                            this.rangeController.setRangeToCell(new gridCell_1.GridCell(nextCell.rowIndex, nextCell.floating, nextCell.column));
                        }
                        return;
                    }
                }
            };
            __decorate([
                context_2.Autowired('columnController'), 
                __metadata('design:type', columnController_1.ColumnController)
            ], RowRenderer.prototype, "columnController", void 0);
            __decorate([
                context_2.Autowired('gridOptionsWrapper'), 
                __metadata('design:type', gridOptionsWrapper_1.GridOptionsWrapper)
            ], RowRenderer.prototype, "gridOptionsWrapper", void 0);
            __decorate([
                context_2.Autowired('gridCore'), 
                __metadata('design:type', gridCore_1.GridCore)
            ], RowRenderer.prototype, "gridCore", void 0);
            __decorate([
                context_2.Autowired('selectionRendererFactory'), 
                __metadata('design:type', selectionRendererFactory_1.SelectionRendererFactory)
            ], RowRenderer.prototype, "selectionRendererFactory", void 0);
            __decorate([
                context_2.Autowired('gridPanel'), 
                __metadata('design:type', gridPanel_1.GridPanel)
            ], RowRenderer.prototype, "gridPanel", void 0);
            __decorate([
                context_2.Autowired('$compile'), 
                __metadata('design:type', Object)
            ], RowRenderer.prototype, "$compile", void 0);
            __decorate([
                context_2.Autowired('$scope'), 
                __metadata('design:type', Object)
            ], RowRenderer.prototype, "$scope", void 0);
            __decorate([
                context_2.Autowired('expressionService'), 
                __metadata('design:type', expressionService_1.ExpressionService)
            ], RowRenderer.prototype, "expressionService", void 0);
            __decorate([
                context_2.Autowired('templateService'), 
                __metadata('design:type', templateService_1.TemplateService)
            ], RowRenderer.prototype, "templateService", void 0);
            __decorate([
                context_2.Autowired('valueService'), 
                __metadata('design:type', valueService_1.ValueService)
            ], RowRenderer.prototype, "valueService", void 0);
            __decorate([
                context_2.Autowired('eventService'), 
                __metadata('design:type', eventService_1.EventService)
            ], RowRenderer.prototype, "eventService", void 0);
            __decorate([
                context_2.Autowired('floatingRowModel'), 
                __metadata('design:type', floatingRowModel_1.FloatingRowModel)
            ], RowRenderer.prototype, "floatingRowModel", void 0);
            __decorate([
                context_2.Autowired('context'), 
                __metadata('design:type', context_2.Context)
            ], RowRenderer.prototype, "context", void 0);
            __decorate([
                context_2.Autowired('loggerFactory'), 
                __metadata('design:type', logger_1.LoggerFactory)
            ], RowRenderer.prototype, "loggerFactory", void 0);
            __decorate([
                context_2.Autowired('rowModel'), 
                __metadata('design:type', Object)
            ], RowRenderer.prototype, "rowModel", void 0);
            __decorate([
                context_2.Autowired('focusedCellController'), 
                __metadata('design:type', focusedCellController_1.FocusedCellController)
            ], RowRenderer.prototype, "focusedCellController", void 0);
            __decorate([
                context_2.Optional('rangeController'), 
                __metadata('design:type', Object)
            ], RowRenderer.prototype, "rangeController", void 0);
            __decorate([
                context_2.Autowired('cellNavigationService'), 
                __metadata('design:type', cellNavigationService_1.CellNavigationService)
            ], RowRenderer.prototype, "cellNavigationService", void 0);
            __decorate([
                __param(0, context_2.Qualifier('loggerFactory')), 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', [logger_1.LoggerFactory]), 
                __metadata('design:returntype', void 0)
            ], RowRenderer.prototype, "agWire", null);
            __decorate([
                context_2.PostConstruct, 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], RowRenderer.prototype, "init", null);
            __decorate([
                context_2.PreDestroy, 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], RowRenderer.prototype, "destroy", null);
            RowRenderer = __decorate([
                context_2.Bean('rowRenderer'), 
                __metadata('design:paramtypes', [])
            ], RowRenderer);
            exports_1("RowRenderer", RowRenderer);
        }
    }
});
//# sourceMappingURL=rowRenderer.js.map