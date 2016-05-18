System.register(["./eventService", "./constants", "./components/componentUtil", "./gridApi", "./context/context", "./columnController/columnController", "./events", "./utils"], function(exports_1, context_1) {
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
    var eventService_1, constants_1, componentUtil_1, gridApi_1, context_2, columnController_1, events_1, utils_1;
    var DEFAULT_ROW_HEIGHT, DEFAULT_VIEWPORT_ROW_MODEL_PAGE_SIZE, DEFAULT_VIEWPORT_ROW_MODEL_BUFER_SIZE, GridOptionsWrapper;
    function isTrue(value) {
        return value === true || value === 'true';
    }
    function positiveNumberOrZero(value, defaultValue) {
        if (value > 0) {
            return value;
        }
        else {
            // zero gets returned if number is missing or the wrong type
            return defaultValue;
        }
    }
    return {
        setters:[
            function (eventService_1_1) {
                eventService_1 = eventService_1_1;
            },
            function (constants_1_1) {
                constants_1 = constants_1_1;
            },
            function (componentUtil_1_1) {
                componentUtil_1 = componentUtil_1_1;
            },
            function (gridApi_1_1) {
                gridApi_1 = gridApi_1_1;
            },
            function (context_2_1) {
                context_2 = context_2_1;
            },
            function (columnController_1_1) {
                columnController_1 = columnController_1_1;
            },
            function (events_1_1) {
                events_1 = events_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }],
        execute: function() {
            DEFAULT_ROW_HEIGHT = 25;
            DEFAULT_VIEWPORT_ROW_MODEL_PAGE_SIZE = 5;
            DEFAULT_VIEWPORT_ROW_MODEL_BUFER_SIZE = 5;
            let GridOptionsWrapper_1;
            let GridOptionsWrapper = GridOptionsWrapper_1 = class GridOptionsWrapper {
                agWire(gridApi, columnApi) {
                    this.headerHeight = this.gridOptions.headerHeight;
                    this.gridOptions.api = gridApi;
                    this.gridOptions.columnApi = columnApi;
                    this.checkForDeprecated();
                }
                init() {
                    this.eventService.addGlobalListener(this.globalEventHandler.bind(this));
                    if (this.isGroupSelectsChildren() && this.isSuppressParentsInRowNodes()) {
                        console.warn('ag-Grid: groupSelectsChildren does not work wth suppressParentsInRowNodes, this selection method needs the part in rowNode to work');
                    }
                    if (this.isGroupSelectsChildren() && !this.isRowSelectionMulti()) {
                        console.warn('ag-Grid: rowSelectionMulti must be true for groupSelectsChildren to make sense');
                    }
                }
                isEnterprise() { return this.enterprise; }
                isRowSelection() { return this.gridOptions.rowSelection === "single" || this.gridOptions.rowSelection === "multiple"; }
                isRowDeselection() { return isTrue(this.gridOptions.rowDeselection); }
                isRowSelectionMulti() { return this.gridOptions.rowSelection === 'multiple'; }
                getContext() { return this.gridOptions.context; }
                isRowModelPagination() { return this.gridOptions.rowModelType === constants_1.Constants.ROW_MODEL_TYPE_PAGINATION; }
                isRowModelVirtual() { return this.gridOptions.rowModelType === constants_1.Constants.ROW_MODEL_TYPE_VIRTUAL; }
                isRowModelViewport() { return this.gridOptions.rowModelType === constants_1.Constants.ROW_MODEL_TYPE_VIEWPORT; }
                isRowModelDefault() { return !(this.isRowModelPagination() || this.isRowModelVirtual() || this.isRowModelViewport()); }
                isShowToolPanel() { return isTrue(this.gridOptions.showToolPanel); }
                isToolPanelSuppressGroups() { return isTrue(this.gridOptions.toolPanelSuppressGroups); }
                isToolPanelSuppressValues() { return isTrue(this.gridOptions.toolPanelSuppressValues); }
                isEnableCellChangeFlash() { return isTrue(this.gridOptions.enableCellChangeFlash); }
                isGroupSelectsChildren() { return isTrue(this.gridOptions.groupSelectsChildren); }
                isGroupIncludeFooter() { return isTrue(this.gridOptions.groupIncludeFooter); }
                isGroupSuppressBlankHeader() { return isTrue(this.gridOptions.groupSuppressBlankHeader); }
                isSuppressRowClickSelection() { return isTrue(this.gridOptions.suppressRowClickSelection); }
                isSuppressCellSelection() { return isTrue(this.gridOptions.suppressCellSelection); }
                isSuppressMultiSort() { return isTrue(this.gridOptions.suppressMultiSort); }
                isGroupSuppressAutoColumn() { return isTrue(this.gridOptions.groupSuppressAutoColumn); }
                isForPrint() { return isTrue(this.gridOptions.forPrint); }
                isSuppressHorizontalScroll() { return isTrue(this.gridOptions.suppressHorizontalScroll); }
                isSuppressLoadingOverlay() { return isTrue(this.gridOptions.suppressLoadingOverlay); }
                isSuppressNoRowsOverlay() { return isTrue(this.gridOptions.suppressNoRowsOverlay); }
                isSuppressFieldDotNotation() { return isTrue(this.gridOptions.suppressFieldDotNotation); }
                getFloatingTopRowData() { return this.gridOptions.floatingTopRowData; }
                getFloatingBottomRowData() { return this.gridOptions.floatingBottomRowData; }
                isUnSortIcon() { return isTrue(this.gridOptions.unSortIcon); }
                isSuppressMenuHide() { return isTrue(this.gridOptions.suppressMenuHide); }
                getRowStyle() { return this.gridOptions.rowStyle; }
                getRowClass() { return this.gridOptions.rowClass; }
                getRowStyleFunc() { return this.gridOptions.getRowStyle; }
                getRowClassFunc() { return this.gridOptions.getRowClass; }
                getBusinessKeyForNodeFunc() { return this.gridOptions.getBusinessKeyForNode; }
                getHeaderCellRenderer() { return this.gridOptions.headerCellRenderer; }
                getApi() { return this.gridOptions.api; }
                getColumnApi() { return this.gridOptions.columnApi; }
                isEnableColResize() { return isTrue(this.gridOptions.enableColResize); }
                isSingleClickEdit() { return isTrue(this.gridOptions.singleClickEdit); }
                getGroupDefaultExpanded() { return this.gridOptions.groupDefaultExpanded; }
                getGroupAggFunction() { return this.gridOptions.groupAggFunction; }
                getRowData() { return this.gridOptions.rowData; }
                isGroupUseEntireRow() { return isTrue(this.gridOptions.groupUseEntireRow); }
                getGroupColumnDef() { return this.gridOptions.groupColumnDef; }
                isGroupSuppressRow() { return isTrue(this.gridOptions.groupSuppressRow); }
                getRowGroupPanelShow() { return this.gridOptions.rowGroupPanelShow; }
                isAngularCompileRows() { return isTrue(this.gridOptions.angularCompileRows); }
                isAngularCompileFilters() { return isTrue(this.gridOptions.angularCompileFilters); }
                isAngularCompileHeaders() { return isTrue(this.gridOptions.angularCompileHeaders); }
                isDebug() { return isTrue(this.gridOptions.debug); }
                getColumnDefs() { return this.gridOptions.columnDefs; }
                getDatasource() { return this.gridOptions.datasource; }
                getViewportDatasource() { return this.gridOptions.viewportDatasource; }
                isEnableSorting() { return isTrue(this.gridOptions.enableSorting) || isTrue(this.gridOptions.enableServerSideSorting); }
                isEnableCellExpressions() { return isTrue(this.gridOptions.enableCellExpressions); }
                isEnableServerSideSorting() { return isTrue(this.gridOptions.enableServerSideSorting); }
                isSuppressContextMenu() { return isTrue(this.gridOptions.suppressContextMenu); }
                isEnableFilter() { return isTrue(this.gridOptions.enableFilter) || isTrue(this.gridOptions.enableServerSideFilter); }
                isEnableServerSideFilter() { return this.gridOptions.enableServerSideFilter; }
                isSuppressScrollLag() { return isTrue(this.gridOptions.suppressScrollLag); }
                isSuppressMovableColumns() { return isTrue(this.gridOptions.suppressMovableColumns); }
                isSuppressColumnMoveAnimation() { return isTrue(this.gridOptions.suppressColumnMoveAnimation); }
                isSuppressMenuColumnPanel() { return isTrue(this.gridOptions.suppressMenuColumnPanel); }
                isSuppressMenuFilterPanel() { return isTrue(this.gridOptions.suppressMenuFilterPanel); }
                isSuppressMenuMainPanel() { return isTrue(this.gridOptions.suppressMenuMainPanel); }
                isEnableRangeSelection() { return isTrue(this.gridOptions.enableRangeSelection); }
                isRememberGroupStateWhenNewData() { return isTrue(this.gridOptions.rememberGroupStateWhenNewData); }
                getIcons() { return this.gridOptions.icons; }
                getIsScrollLag() { return this.gridOptions.isScrollLag; }
                getSortingOrder() { return this.gridOptions.sortingOrder; }
                getSlaveGrids() { return this.gridOptions.slaveGrids; }
                getGroupRowRenderer() { return this.gridOptions.groupRowRenderer; }
                getGroupRowRendererParams() { return this.gridOptions.groupRowRendererParams; }
                getGroupRowInnerRenderer() { return this.gridOptions.groupRowInnerRenderer; }
                getOverlayLoadingTemplate() { return this.gridOptions.overlayLoadingTemplate; }
                getOverlayNoRowsTemplate() { return this.gridOptions.overlayNoRowsTemplate; }
                getCheckboxSelection() { return this.gridOptions.checkboxSelection; }
                isSuppressAutoSize() { return isTrue(this.gridOptions.suppressAutoSize); }
                isSuppressParentsInRowNodes() { return isTrue(this.gridOptions.suppressParentsInRowNodes); }
                isEnableStatusBar() { return isTrue(this.gridOptions.enableStatusBar); }
                getHeaderCellTemplate() { return this.gridOptions.headerCellTemplate; }
                getHeaderCellTemplateFunc() { return this.gridOptions.getHeaderCellTemplate; }
                getNodeChildDetailsFunc() { return this.gridOptions.getNodeChildDetails; }
                getContextMenuItemsFunc() { return this.gridOptions.getContextMenuItems; }
                getMainMenuItemsFunc() { return this.gridOptions.getMainMenuItems; }
                getProcessCellForClipboardFunc() { return this.gridOptions.processCellForClipboard; }
                getViewportRowModelPageSize() { return positiveNumberOrZero(this.gridOptions.viewportRowModelPageSize, DEFAULT_VIEWPORT_ROW_MODEL_PAGE_SIZE); }
                getViewportRowModelBufferSize() { return positiveNumberOrZero(this.gridOptions.viewportRowModelBufferSize, DEFAULT_VIEWPORT_ROW_MODEL_BUFER_SIZE); }
                // public getCellRenderers(): {[key: string]: {new(): ICellRenderer} | ICellRendererFunc} { return this.gridOptions.cellRenderers; }
                // public getCellEditors(): {[key: string]: {new(): ICellEditor}} { return this.gridOptions.cellEditors; }
                executeProcessRowPostCreateFunc(params) {
                    if (this.gridOptions.processRowPostCreate) {
                        this.gridOptions.processRowPostCreate(params);
                    }
                }
                // properties
                getHeaderHeight() {
                    if (typeof this.headerHeight === 'number') {
                        return this.headerHeight;
                    }
                    else {
                        return 25;
                    }
                }
                setHeaderHeight(headerHeight) {
                    this.headerHeight = headerHeight;
                    this.eventService.dispatchEvent(events_1.Events.EVENT_HEADER_HEIGHT_CHANGED);
                }
                isExternalFilterPresent() {
                    if (typeof this.gridOptions.isExternalFilterPresent === 'function') {
                        return this.gridOptions.isExternalFilterPresent();
                    }
                    else {
                        return false;
                    }
                }
                doesExternalFilterPass(node) {
                    if (typeof this.gridOptions.doesExternalFilterPass === 'function') {
                        return this.gridOptions.doesExternalFilterPass(node);
                    }
                    else {
                        return false;
                    }
                }
                getMinColWidth() {
                    if (this.gridOptions.minColWidth > GridOptionsWrapper_1.MIN_COL_WIDTH) {
                        return this.gridOptions.minColWidth;
                    }
                    else {
                        return GridOptionsWrapper_1.MIN_COL_WIDTH;
                    }
                }
                getMaxColWidth() {
                    if (this.gridOptions.maxColWidth > GridOptionsWrapper_1.MIN_COL_WIDTH) {
                        return this.gridOptions.maxColWidth;
                    }
                    else {
                        return null;
                    }
                }
                getColWidth() {
                    if (typeof this.gridOptions.colWidth !== 'number' || this.gridOptions.colWidth < GridOptionsWrapper_1.MIN_COL_WIDTH) {
                        return 200;
                    }
                    else {
                        return this.gridOptions.colWidth;
                    }
                }
                getRowBuffer() {
                    if (typeof this.gridOptions.rowBuffer === 'number') {
                        if (this.gridOptions.rowBuffer < 0) {
                            console.warn('ag-Grid: rowBuffer should not be negative');
                        }
                        return this.gridOptions.rowBuffer;
                    }
                    else {
                        return constants_1.Constants.ROW_BUFFER_SIZE;
                    }
                }
                checkForDeprecated() {
                    // casting to generic object, so typescript compiles even though
                    // we are looking for attributes that don't exist
                    var options = this.gridOptions;
                    if (options.suppressUnSort) {
                        console.warn('ag-grid: as of v1.12.4 suppressUnSort is not used. Please use sortOrder instead.');
                    }
                    if (options.suppressDescSort) {
                        console.warn('ag-grid: as of v1.12.4 suppressDescSort is not used. Please use sortOrder instead.');
                    }
                    if (options.groupAggFields) {
                        console.warn('ag-grid: as of v3 groupAggFields is not used. Please add appropriate agg fields to your columns.');
                    }
                    if (options.groupHidePivotColumns) {
                        console.warn('ag-grid: as of v3 groupHidePivotColumns is not used as pivot columns are now called rowGroup columns. Please refer to the documentation');
                    }
                    if (options.groupKeys) {
                        console.warn('ag-grid: as of v3 groupKeys is not used. You need to set rowGroupIndex on the columns to group. Please refer to the documentation');
                    }
                    if (options.ready || options.onReady) {
                        console.warn('ag-grid: as of v3.3 ready event is now called gridReady, so the callback should be onGridReady');
                    }
                    if (typeof options.groupDefaultExpanded === 'boolean') {
                        console.warn('ag-grid: groupDefaultExpanded can no longer be boolean. for groupDefaultExpanded=true, use groupDefaultExpanded=9999 instead, to expand all the groups');
                    }
                    if (options.onRowDeselected || options.rowDeselected) {
                        console.warn('ag-grid: since version 3.4 event rowDeselected no longer exists, please check the docs');
                    }
                    if (options.rowsAlreadyGrouped) {
                        console.warn('ag-grid: since version 3.4 rowsAlreadyGrouped no longer exists, please use getNodeChildDetails() instead');
                    }
                }
                getLocaleTextFunc() {
                    if (this.gridOptions.localeTextFunc) {
                        return this.gridOptions.localeTextFunc;
                    }
                    var that = this;
                    return function (key, defaultValue) {
                        var localeText = that.gridOptions.localeText;
                        if (localeText && localeText[key]) {
                            return localeText[key];
                        }
                        else {
                            return defaultValue;
                        }
                    };
                }
                // responsible for calling the onXXX functions on gridOptions
                globalEventHandler(eventName, event) {
                    var callbackMethodName = componentUtil_1.ComponentUtil.getCallbackForEvent(eventName);
                    if (typeof this.gridOptions[callbackMethodName] === 'function') {
                        this.gridOptions[callbackMethodName](event);
                    }
                }
                // we don't allow dynamic row height for virtual paging
                getRowHeightAsNumber() {
                    var rowHeight = this.gridOptions.rowHeight;
                    if (utils_1.Utils.missing(rowHeight)) {
                        return DEFAULT_ROW_HEIGHT;
                    }
                    else if (typeof this.gridOptions.rowHeight === 'number') {
                        return this.gridOptions.rowHeight;
                    }
                    else {
                        console.warn('ag-Grid row height must be a number if not using standard row model');
                        return DEFAULT_ROW_HEIGHT;
                    }
                }
                getRowHeightForNode(rowNode) {
                    if (typeof this.gridOptions.rowHeight === 'number') {
                        return this.gridOptions.rowHeight;
                    }
                    else if (typeof this.gridOptions.getRowHeight === 'function') {
                        var params = {
                            node: rowNode,
                            data: rowNode.data,
                            api: this.gridOptions.api,
                            context: this.gridOptions.context
                        };
                        return this.gridOptions.getRowHeight(params);
                    }
                    else {
                        return DEFAULT_ROW_HEIGHT;
                    }
                }
            };
            GridOptionsWrapper.MIN_COL_WIDTH = 10;
            __decorate([
                context_2.Autowired('gridOptions'), 
                __metadata('design:type', Object)
            ], GridOptionsWrapper.prototype, "gridOptions", void 0);
            __decorate([
                context_2.Autowired('columnController'), 
                __metadata('design:type', columnController_1.ColumnController)
            ], GridOptionsWrapper.prototype, "columnController", void 0);
            __decorate([
                context_2.Autowired('eventService'), 
                __metadata('design:type', eventService_1.EventService)
            ], GridOptionsWrapper.prototype, "eventService", void 0);
            __decorate([
                context_2.Autowired('enterprise'), 
                __metadata('design:type', Boolean)
            ], GridOptionsWrapper.prototype, "enterprise", void 0);
            __decorate([
                __param(0, context_2.Qualifier('gridApi')),
                __param(1, context_2.Qualifier('columnApi')), 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', [gridApi_1.GridApi, columnController_1.ColumnApi]), 
                __metadata('design:returntype', void 0)
            ], GridOptionsWrapper.prototype, "agWire", null);
            __decorate([
                context_2.PostConstruct, 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], GridOptionsWrapper.prototype, "init", null);
            GridOptionsWrapper = GridOptionsWrapper_1 = __decorate([
                context_2.Bean('gridOptionsWrapper'), 
                __metadata('design:paramtypes', [])
            ], GridOptionsWrapper);
            exports_1("GridOptionsWrapper", GridOptionsWrapper);
        }
    }
});
//# sourceMappingURL=gridOptionsWrapper.js.map