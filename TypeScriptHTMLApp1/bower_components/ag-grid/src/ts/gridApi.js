System.register(["./csvCreator", "./rendering/rowRenderer", "./headerRendering/headerRenderer", "./filter/filterManager", "./columnController/columnController", "./selectionController", "./gridOptionsWrapper", "./gridPanel/gridPanel", "./valueService", "./masterSlaveService", "./eventService", "./rowControllers/floatingRowModel", "./constants", "./context/context", "./gridCore", "./sortController", "./rowControllers/paginationController", "./focusedCellController", "./utils", "./rendering/cellRendererFactory", "./rendering/cellEditorFactory"], function(exports_1, context_1) {
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
    var csvCreator_1, rowRenderer_1, headerRenderer_1, filterManager_1, columnController_1, selectionController_1, gridOptionsWrapper_1, gridPanel_1, valueService_1, masterSlaveService_1, eventService_1, floatingRowModel_1, constants_1, context_2, gridCore_1, sortController_1, paginationController_1, focusedCellController_1, utils_1, cellRendererFactory_1, cellEditorFactory_1;
    var GridApi;
    return {
        setters:[
            function (csvCreator_1_1) {
                csvCreator_1 = csvCreator_1_1;
            },
            function (rowRenderer_1_1) {
                rowRenderer_1 = rowRenderer_1_1;
            },
            function (headerRenderer_1_1) {
                headerRenderer_1 = headerRenderer_1_1;
            },
            function (filterManager_1_1) {
                filterManager_1 = filterManager_1_1;
            },
            function (columnController_1_1) {
                columnController_1 = columnController_1_1;
            },
            function (selectionController_1_1) {
                selectionController_1 = selectionController_1_1;
            },
            function (gridOptionsWrapper_1_1) {
                gridOptionsWrapper_1 = gridOptionsWrapper_1_1;
            },
            function (gridPanel_1_1) {
                gridPanel_1 = gridPanel_1_1;
            },
            function (valueService_1_1) {
                valueService_1 = valueService_1_1;
            },
            function (masterSlaveService_1_1) {
                masterSlaveService_1 = masterSlaveService_1_1;
            },
            function (eventService_1_1) {
                eventService_1 = eventService_1_1;
            },
            function (floatingRowModel_1_1) {
                floatingRowModel_1 = floatingRowModel_1_1;
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
            function (sortController_1_1) {
                sortController_1 = sortController_1_1;
            },
            function (paginationController_1_1) {
                paginationController_1 = paginationController_1_1;
            },
            function (focusedCellController_1_1) {
                focusedCellController_1 = focusedCellController_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (cellRendererFactory_1_1) {
                cellRendererFactory_1 = cellRendererFactory_1_1;
            },
            function (cellEditorFactory_1_1) {
                cellEditorFactory_1 = cellEditorFactory_1_1;
            }],
        execute: function() {
            let GridApi = class GridApi {
                init() {
                    if (this.rowModel.getType() === constants_1.Constants.ROW_MODEL_TYPE_NORMAL) {
                        this.inMemoryRowModel = this.rowModel;
                    }
                }
                /** Used internally by grid. Not intended to be used by the client. Interface may change between releases. */
                __getMasterSlaveService() {
                    return this.masterSlaveService;
                }
                getFirstRenderedRow() {
                    return this.rowRenderer.getFirstVirtualRenderedRow();
                }
                getLastRenderedRow() {
                    return this.rowRenderer.getLastVirtualRenderedRow();
                }
                getDataAsCsv(params) {
                    return this.csvCreator.getDataAsCsv(params);
                }
                exportDataAsCsv(params) {
                    this.csvCreator.exportDataAsCsv(params);
                }
                setDatasource(datasource) {
                    if (this.gridOptionsWrapper.isRowModelPagination()) {
                        this.paginationController.setDatasource(datasource);
                    }
                    else if (this.gridOptionsWrapper.isRowModelVirtual()) {
                        this.rowModel.setDatasource(datasource);
                    }
                    else {
                        console.warn(`ag-Grid: you can only use a datasource when gridOptions.rowModelType is '${constants_1.Constants.ROW_MODEL_TYPE_VIRTUAL}' or '${constants_1.Constants.ROW_MODEL_TYPE_PAGINATION}'`);
                    }
                }
                setViewportDatasource(viewportDatasource) {
                    if (this.gridOptionsWrapper.isRowModelViewport()) {
                        // this is bad coding, because it's using an interface that's exposed in the enterprise.
                        // really we should create an interface in the core for viewportDatasource and let
                        // the enterprise implement it, rather than casting to 'any' here
                        this.rowModel.setViewportDatasource(viewportDatasource);
                    }
                    else {
                        console.warn(`ag-Grid: you can only use a datasource when gridOptions.rowModelType is '${constants_1.Constants.ROW_MODEL_TYPE_VIEWPORT}'`);
                    }
                }
                setRowData(rowData) {
                    if (utils_1.Utils.missing(this.inMemoryRowModel)) {
                        console.log('cannot call setRowData unless using normal row model');
                    }
                    this.inMemoryRowModel.setRowData(rowData, true);
                }
                setFloatingTopRowData(rows) {
                    this.floatingRowModel.setFloatingTopRowData(rows);
                }
                setFloatingBottomRowData(rows) {
                    this.floatingRowModel.setFloatingBottomRowData(rows);
                }
                setColumnDefs(colDefs) {
                    this.columnController.setColumnDefs(colDefs);
                }
                refreshRows(rowNodes) {
                    this.rowRenderer.refreshRows(rowNodes);
                }
                refreshCells(rowNodes, colIds, animate = false) {
                    this.rowRenderer.refreshCells(rowNodes, colIds, animate);
                }
                rowDataChanged(rows) {
                    this.rowRenderer.rowDataChanged(rows);
                }
                refreshView() {
                    this.rowRenderer.refreshView();
                }
                softRefreshView() {
                    this.rowRenderer.softRefreshView();
                }
                refreshGroupRows() {
                    this.rowRenderer.refreshGroupRows();
                }
                refreshHeader() {
                    // need to review this - the refreshHeader should also refresh all icons in the header
                    this.headerRenderer.refreshHeader();
                }
                isAnyFilterPresent() {
                    return this.filterManager.isAnyFilterPresent();
                }
                isAdvancedFilterPresent() {
                    return this.filterManager.isAdvancedFilterPresent();
                }
                isQuickFilterPresent() {
                    return this.filterManager.isQuickFilterPresent();
                }
                getModel() {
                    return this.rowModel;
                }
                onGroupExpandedOrCollapsed(refreshFromIndex) {
                    if (utils_1.Utils.missing(this.inMemoryRowModel)) {
                        console.log('cannot call onGroupExpandedOrCollapsed unless using normal row model');
                    }
                    this.inMemoryRowModel.refreshModel(constants_1.Constants.STEP_MAP, refreshFromIndex);
                }
                expandAll() {
                    if (utils_1.Utils.missing(this.inMemoryRowModel)) {
                        console.log('cannot call expandAll unless using normal row model');
                    }
                    this.inMemoryRowModel.expandOrCollapseAll(true);
                }
                collapseAll() {
                    if (utils_1.Utils.missing(this.inMemoryRowModel)) {
                        console.log('cannot call collapseAll unless using normal row model');
                    }
                    this.inMemoryRowModel.expandOrCollapseAll(false);
                }
                addVirtualRowListener(eventName, rowIndex, callback) {
                    if (typeof eventName !== 'string') {
                        console.log('ag-Grid: addVirtualRowListener is deprecated, please use addRenderedRowListener.');
                    }
                    this.addRenderedRowListener(eventName, rowIndex, callback);
                }
                addRenderedRowListener(eventName, rowIndex, callback) {
                    if (eventName === 'virtualRowRemoved') {
                        console.log('ag-Grid: event virtualRowRemoved is deprecated, now called renderedRowRemoved');
                        eventName = '' +
                            '';
                    }
                    if (eventName === 'virtualRowSelected') {
                        console.log('ag-Grid: event virtualRowSelected is deprecated, to register for individual row ' +
                            'selection events, add a listener directly to the row node.');
                    }
                    this.rowRenderer.addRenderedRowListener(eventName, rowIndex, callback);
                }
                setQuickFilter(newFilter) {
                    this.filterManager.setQuickFilter(newFilter);
                }
                selectIndex(index, tryMulti, suppressEvents) {
                    console.log('ag-Grid: do not use api for selection, call node.setSelected(value) instead');
                    this.selectionController.selectIndex(index, tryMulti, suppressEvents);
                }
                deselectIndex(index, suppressEvents = false) {
                    console.log('ag-Grid: do not use api for selection, call node.setSelected(value) instead');
                    this.selectionController.deselectIndex(index, suppressEvents);
                }
                selectNode(node, tryMulti = false, suppressEvents = false) {
                    console.log('ag-Grid: API for selection is deprecated, call node.setSelected(value) instead');
                    node.setSelected(true, !tryMulti, suppressEvents);
                }
                deselectNode(node, suppressEvents = false) {
                    console.log('ag-Grid: API for selection is deprecated, call node.setSelected(value) instead');
                    node.setSelected(false, false, suppressEvents);
                }
                selectAll() {
                    this.selectionController.selectAllRowNodes();
                }
                deselectAll() {
                    this.selectionController.deselectAllRowNodes();
                }
                recomputeAggregates() {
                    if (utils_1.Utils.missing(this.inMemoryRowModel)) {
                        console.log('cannot call recomputeAggregates unless using normal row model');
                    }
                    this.inMemoryRowModel.refreshModel(constants_1.Constants.STEP_AGGREGATE);
                }
                sizeColumnsToFit() {
                    if (this.gridOptionsWrapper.isForPrint()) {
                        console.warn('ag-grid: sizeColumnsToFit does not work when forPrint=true');
                        return;
                    }
                    this.gridPanel.sizeColumnsToFit();
                }
                showLoadingOverlay() {
                    this.gridPanel.showLoadingOverlay();
                }
                showNoRowsOverlay() {
                    this.gridPanel.showNoRowsOverlay();
                }
                hideOverlay() {
                    this.gridPanel.hideOverlay();
                }
                isNodeSelected(node) {
                    console.log('ag-Grid: no need to call api.isNodeSelected(), just call node.isSelected() instead');
                    return node.isSelected();
                }
                getSelectedNodesById() {
                    console.error('ag-Grid: since version 3.4, getSelectedNodesById no longer exists, use getSelectedNodes() instead');
                    return null;
                }
                getSelectedNodes() {
                    return this.selectionController.getSelectedNodes();
                }
                getSelectedRows() {
                    return this.selectionController.getSelectedRows();
                }
                getBestCostNodeSelection() {
                    return this.selectionController.getBestCostNodeSelection();
                }
                getRenderedNodes() {
                    return this.rowRenderer.getRenderedNodes();
                }
                ensureColIndexVisible(index) {
                    console.warn('ag-Grid: ensureColIndexVisible(index) no longer supported, use ensureColumnVisible(colKey) instead.');
                }
                ensureColumnVisible(key) {
                    this.gridPanel.ensureColumnVisible(key);
                }
                ensureIndexVisible(index) {
                    this.gridPanel.ensureIndexVisible(index);
                }
                ensureNodeVisible(comparator) {
                    this.gridCore.ensureNodeVisible(comparator);
                }
                forEachNode(callback) {
                    this.rowModel.forEachNode(callback);
                }
                forEachNodeAfterFilter(callback) {
                    if (utils_1.Utils.missing(this.inMemoryRowModel)) {
                        console.log('cannot call forEachNodeAfterFilter unless using normal row model');
                    }
                    this.inMemoryRowModel.forEachNodeAfterFilter(callback);
                }
                forEachNodeAfterFilterAndSort(callback) {
                    if (utils_1.Utils.missing(this.inMemoryRowModel)) {
                        console.log('cannot call forEachNodeAfterFilterAndSort unless using normal row model');
                    }
                    this.inMemoryRowModel.forEachNodeAfterFilterAndSort(callback);
                }
                getFilterApiForColDef(colDef) {
                    console.warn('ag-grid API method getFilterApiForColDef deprecated, use getFilterApi instead');
                    return this.getFilterApi(colDef);
                }
                getFilterApi(key) {
                    var column = this.columnController.getColumn(key);
                    if (column) {
                        return this.filterManager.getFilterApi(column);
                    }
                }
                destroyFilter(key) {
                    var column = this.columnController.getColumn(key);
                    if (column) {
                        return this.filterManager.destroyFilter(column);
                    }
                }
                getColumnDef(key) {
                    var column = this.columnController.getColumn(key);
                    if (column) {
                        return column.getColDef();
                    }
                    else {
                        return null;
                    }
                }
                onFilterChanged() {
                    this.filterManager.onFilterChanged();
                }
                setSortModel(sortModel) {
                    this.sortController.setSortModel(sortModel);
                }
                getSortModel() {
                    return this.sortController.getSortModel();
                }
                setFilterModel(model) {
                    this.filterManager.setFilterModel(model);
                }
                getFilterModel() {
                    return this.filterManager.getFilterModel();
                }
                getFocusedCell() {
                    return this.focusedCellController.getFocusedCell();
                }
                setFocusedCell(rowIndex, colKey, floating) {
                    this.focusedCellController.setFocusedCell(rowIndex, colKey, floating, true);
                }
                setHeaderHeight(headerHeight) {
                    this.gridOptionsWrapper.setHeaderHeight(headerHeight);
                }
                showToolPanel(show) {
                    this.gridCore.showToolPanel(show);
                }
                isToolPanelShowing() {
                    return this.gridCore.isToolPanelShowing();
                }
                doLayout() {
                    this.gridCore.doLayout();
                }
                getValue(colKey, rowNode) {
                    var column = this.columnController.getColumn(colKey);
                    return this.valueService.getValue(column, rowNode);
                }
                addEventListener(eventType, listener) {
                    this.eventService.addEventListener(eventType, listener);
                }
                addGlobalListener(listener) {
                    this.eventService.addGlobalListener(listener);
                }
                removeEventListener(eventType, listener) {
                    this.eventService.removeEventListener(eventType, listener);
                }
                removeGlobalListener(listener) {
                    this.eventService.removeGlobalListener(listener);
                }
                dispatchEvent(eventType, event) {
                    this.eventService.dispatchEvent(eventType, event);
                }
                destroy() {
                    this.context.destroy();
                }
                resetQuickFilter() {
                    this.rowModel.forEachNode(node => node.quickFilterAggregateText = null);
                }
                getRangeSelections() {
                    if (this.rangeController) {
                        return this.rangeController.getCellRanges();
                    }
                    else {
                        console.warn('ag-Grid: cell range selection is only available in ag-Grid Enterprise');
                        return null;
                    }
                }
                addRangeSelection(rangeSelection) {
                    if (!this.rangeController) {
                        console.warn('ag-Grid: cell range selection is only available in ag-Grid Enterprise');
                    }
                    this.rangeController.addRange(rangeSelection);
                }
                clearRangeSelection() {
                    if (!this.rangeController) {
                        console.warn('ag-Grid: cell range selection is only available in ag-Grid Enterprise');
                    }
                    this.rangeController.clearSelection();
                }
                copySelectedRowsToClipboard() {
                    if (!this.clipboardService) {
                        console.warn('ag-Grid: clipboard is only available in ag-Grid Enterprise');
                    }
                    this.clipboardService.copySelectedRowsToClipboard();
                }
                copySelectedRangeToClipboard() {
                    if (!this.clipboardService) {
                        console.warn('ag-Grid: clipboard is only available in ag-Grid Enterprise');
                    }
                    this.clipboardService.copySelectedRangeToClipboard();
                }
                copySelectedRangeDown() {
                    if (!this.clipboardService) {
                        console.warn('ag-Grid: clipboard is only available in ag-Grid Enterprise');
                    }
                    this.clipboardService.copyRangeDown();
                }
                showColumnMenuAfterButtonClick(colKey, buttonElement) {
                    var column = this.columnController.getColumn(colKey);
                    this.menuFactory.showMenuAfterButtonClick(column, buttonElement);
                }
                showColumnMenuAfterMouseClick(colKey, mouseEvent) {
                    var column = this.columnController.getColumn(colKey);
                    this.menuFactory.showMenuAfterMouseEvent(column, mouseEvent);
                }
            };
            __decorate([
                context_2.Autowired('csvCreator'), 
                __metadata('design:type', csvCreator_1.CsvCreator)
            ], GridApi.prototype, "csvCreator", void 0);
            __decorate([
                context_2.Autowired('gridCore'), 
                __metadata('design:type', gridCore_1.GridCore)
            ], GridApi.prototype, "gridCore", void 0);
            __decorate([
                context_2.Autowired('rowRenderer'), 
                __metadata('design:type', rowRenderer_1.RowRenderer)
            ], GridApi.prototype, "rowRenderer", void 0);
            __decorate([
                context_2.Autowired('headerRenderer'), 
                __metadata('design:type', headerRenderer_1.HeaderRenderer)
            ], GridApi.prototype, "headerRenderer", void 0);
            __decorate([
                context_2.Autowired('filterManager'), 
                __metadata('design:type', filterManager_1.FilterManager)
            ], GridApi.prototype, "filterManager", void 0);
            __decorate([
                context_2.Autowired('columnController'), 
                __metadata('design:type', columnController_1.ColumnController)
            ], GridApi.prototype, "columnController", void 0);
            __decorate([
                context_2.Autowired('selectionController'), 
                __metadata('design:type', selectionController_1.SelectionController)
            ], GridApi.prototype, "selectionController", void 0);
            __decorate([
                context_2.Autowired('gridOptionsWrapper'), 
                __metadata('design:type', gridOptionsWrapper_1.GridOptionsWrapper)
            ], GridApi.prototype, "gridOptionsWrapper", void 0);
            __decorate([
                context_2.Autowired('gridPanel'), 
                __metadata('design:type', gridPanel_1.GridPanel)
            ], GridApi.prototype, "gridPanel", void 0);
            __decorate([
                context_2.Autowired('valueService'), 
                __metadata('design:type', valueService_1.ValueService)
            ], GridApi.prototype, "valueService", void 0);
            __decorate([
                context_2.Autowired('masterSlaveService'), 
                __metadata('design:type', masterSlaveService_1.MasterSlaveService)
            ], GridApi.prototype, "masterSlaveService", void 0);
            __decorate([
                context_2.Autowired('eventService'), 
                __metadata('design:type', eventService_1.EventService)
            ], GridApi.prototype, "eventService", void 0);
            __decorate([
                context_2.Autowired('floatingRowModel'), 
                __metadata('design:type', floatingRowModel_1.FloatingRowModel)
            ], GridApi.prototype, "floatingRowModel", void 0);
            __decorate([
                context_2.Autowired('context'), 
                __metadata('design:type', context_2.Context)
            ], GridApi.prototype, "context", void 0);
            __decorate([
                context_2.Autowired('rowModel'), 
                __metadata('design:type', Object)
            ], GridApi.prototype, "rowModel", void 0);
            __decorate([
                context_2.Autowired('sortController'), 
                __metadata('design:type', sortController_1.SortController)
            ], GridApi.prototype, "sortController", void 0);
            __decorate([
                context_2.Autowired('paginationController'), 
                __metadata('design:type', paginationController_1.PaginationController)
            ], GridApi.prototype, "paginationController", void 0);
            __decorate([
                context_2.Autowired('focusedCellController'), 
                __metadata('design:type', focusedCellController_1.FocusedCellController)
            ], GridApi.prototype, "focusedCellController", void 0);
            __decorate([
                context_2.Optional('rangeController'), 
                __metadata('design:type', Object)
            ], GridApi.prototype, "rangeController", void 0);
            __decorate([
                context_2.Optional('clipboardService'), 
                __metadata('design:type', Object)
            ], GridApi.prototype, "clipboardService", void 0);
            __decorate([
                context_2.Autowired('menuFactory'), 
                __metadata('design:type', Object)
            ], GridApi.prototype, "menuFactory", void 0);
            __decorate([
                context_2.Autowired('cellRendererFactory'), 
                __metadata('design:type', cellRendererFactory_1.CellRendererFactory)
            ], GridApi.prototype, "cellRendererFactory", void 0);
            __decorate([
                context_2.Autowired('cellEditorFactory'), 
                __metadata('design:type', cellEditorFactory_1.CellEditorFactory)
            ], GridApi.prototype, "cellEditorFactory", void 0);
            __decorate([
                context_2.PostConstruct, 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], GridApi.prototype, "init", null);
            GridApi = __decorate([
                context_2.Bean('gridApi'), 
                __metadata('design:paramtypes', [])
            ], GridApi);
            exports_1("GridApi", GridApi);
        }
    }
});
//# sourceMappingURL=gridApi.js.map