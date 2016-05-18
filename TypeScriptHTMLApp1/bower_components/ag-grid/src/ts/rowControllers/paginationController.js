System.register(['../utils', "../gridOptionsWrapper", "../context/context", "../gridPanel/gridPanel", "../selectionController", "../sortController", "../eventService", "../events", "../filter/filterManager", "../constants"], function(exports_1, context_1) {
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
    var utils_1, gridOptionsWrapper_1, context_2, gridPanel_1, selectionController_1, context_3, sortController_1, context_4, eventService_1, events_1, filterManager_1, constants_1;
    var template, PaginationController;
    return {
        setters:[
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (gridOptionsWrapper_1_1) {
                gridOptionsWrapper_1 = gridOptionsWrapper_1_1;
            },
            function (context_2_1) {
                context_2 = context_2_1;
                context_3 = context_2_1;
                context_4 = context_2_1;
            },
            function (gridPanel_1_1) {
                gridPanel_1 = gridPanel_1_1;
            },
            function (selectionController_1_1) {
                selectionController_1 = selectionController_1_1;
            },
            function (sortController_1_1) {
                sortController_1 = sortController_1_1;
            },
            function (eventService_1_1) {
                eventService_1 = eventService_1_1;
            },
            function (events_1_1) {
                events_1 = events_1_1;
            },
            function (filterManager_1_1) {
                filterManager_1 = filterManager_1_1;
            },
            function (constants_1_1) {
                constants_1 = constants_1_1;
            }],
        execute: function() {
            template = '<div class="ag-paging-panel ag-font-style">' +
                '<span id="pageRowSummaryPanel" class="ag-paging-row-summary-panel">' +
                '<span id="firstRowOnPage"></span>' +
                ' [TO] ' +
                '<span id="lastRowOnPage"></span>' +
                ' [OF] ' +
                '<span id="recordCount"></span>' +
                '</span>' +
                '<span class="ag-paging-page-summary-panel">' +
                '<button type="button" class="ag-paging-button" id="btFirst">[FIRST]</button>' +
                '<button type="button" class="ag-paging-button" id="btPrevious">[PREVIOUS]</button>' +
                '[PAGE] ' +
                '<span id="current"></span>' +
                ' [OF] ' +
                '<span id="total"></span>' +
                '<button type="button" class="ag-paging-button" id="btNext">[NEXT]</button>' +
                '<button type="button" class="ag-paging-button" id="btLast">[LAST]</button>' +
                '</span>' +
                '</div>';
            let PaginationController = class PaginationController {
                init() {
                    // if we are doing pagination, we are guaranteed that the model type
                    // is normal. if it is not, then this paginationController service
                    // will never be called.
                    if (this.rowModel.getType() === constants_1.Constants.ROW_MODEL_TYPE_NORMAL) {
                        this.inMemoryRowModel = this.rowModel;
                    }
                    this.setupComponents();
                    this.callVersion = 0;
                    var paginationEnabled = this.gridOptionsWrapper.isRowModelPagination();
                    this.eventService.addEventListener(events_1.Events.EVENT_FILTER_CHANGED, () => {
                        if (paginationEnabled && this.gridOptionsWrapper.isEnableServerSideFilter()) {
                            this.reset();
                        }
                    });
                    this.eventService.addEventListener(events_1.Events.EVENT_SORT_CHANGED, () => {
                        if (paginationEnabled && this.gridOptionsWrapper.isEnableServerSideSorting()) {
                            this.reset();
                        }
                    });
                    if (paginationEnabled && this.gridOptionsWrapper.getDatasource()) {
                        this.setDatasource(this.gridOptionsWrapper.getDatasource());
                    }
                }
                setDatasource(datasource) {
                    this.datasource = datasource;
                    if (!datasource) {
                        // only continue if we have a valid datasource to work with
                        return;
                    }
                    this.reset();
                }
                reset() {
                    // important to return here, as the user could be setting filter or sort before
                    // data-source is set
                    if (utils_1.Utils.missing(this.datasource)) {
                        return;
                    }
                    this.selectionController.reset();
                    // copy pageSize, to guard against it changing the the datasource between calls
                    if (this.datasource.pageSize && typeof this.datasource.pageSize !== 'number') {
                        console.warn('datasource.pageSize should be a number');
                    }
                    this.pageSize = this.datasource.pageSize;
                    // see if we know the total number of pages, or if it's 'to be decided'
                    if (typeof this.datasource.rowCount === 'number' && this.datasource.rowCount >= 0) {
                        this.rowCount = this.datasource.rowCount;
                        this.foundMaxRow = true;
                        this.calculateTotalPages();
                    }
                    else {
                        this.rowCount = 0;
                        this.foundMaxRow = false;
                        this.totalPages = null;
                    }
                    this.currentPage = 0;
                    // hide the summary panel until something is loaded
                    this.ePageRowSummaryPanel.style.visibility = 'hidden';
                    this.setTotalLabels();
                    this.loadPage();
                }
                // the native method number.toLocaleString(undefined, {minimumFractionDigits: 0}) puts in decimal places in IE
                myToLocaleString(input) {
                    if (typeof input !== 'number') {
                        return '';
                    }
                    else {
                        // took this from: http://blog.tompawlak.org/number-currency-formatting-javascript
                        return input.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                    }
                }
                setTotalLabels() {
                    if (this.foundMaxRow) {
                        this.lbTotal.innerHTML = this.myToLocaleString(this.totalPages);
                        this.lbRecordCount.innerHTML = this.myToLocaleString(this.rowCount);
                    }
                    else {
                        var moreText = this.gridOptionsWrapper.getLocaleTextFunc()('more', 'more');
                        this.lbTotal.innerHTML = moreText;
                        this.lbRecordCount.innerHTML = moreText;
                    }
                }
                calculateTotalPages() {
                    this.totalPages = Math.floor((this.rowCount - 1) / this.pageSize) + 1;
                }
                pageLoaded(rows, lastRowIndex) {
                    var firstId = this.currentPage * this.pageSize;
                    this.inMemoryRowModel.setRowData(rows, true, firstId);
                    // see if we hit the last row
                    if (!this.foundMaxRow && typeof lastRowIndex === 'number' && lastRowIndex >= 0) {
                        this.foundMaxRow = true;
                        this.rowCount = lastRowIndex;
                        this.calculateTotalPages();
                        this.setTotalLabels();
                        // if overshot pages, go back
                        if (this.currentPage > this.totalPages) {
                            this.currentPage = this.totalPages - 1;
                            this.loadPage();
                        }
                    }
                    this.enableOrDisableButtons();
                    this.updateRowLabels();
                }
                updateRowLabels() {
                    var startRow;
                    var endRow;
                    if (this.isZeroPagesToDisplay()) {
                        startRow = 0;
                        endRow = 0;
                    }
                    else {
                        startRow = (this.pageSize * this.currentPage) + 1;
                        endRow = startRow + this.pageSize - 1;
                        if (this.foundMaxRow && endRow > this.rowCount) {
                            endRow = this.rowCount;
                        }
                    }
                    this.lbFirstRowOnPage.innerHTML = this.myToLocaleString(startRow);
                    this.lbLastRowOnPage.innerHTML = this.myToLocaleString(endRow);
                    // show the summary panel, when first shown, this is blank
                    this.ePageRowSummaryPanel.style.visibility = "";
                }
                loadPage() {
                    this.enableOrDisableButtons();
                    var startRow = this.currentPage * this.datasource.pageSize;
                    var endRow = (this.currentPage + 1) * this.datasource.pageSize;
                    this.lbCurrent.innerHTML = this.myToLocaleString(this.currentPage + 1);
                    this.callVersion++;
                    var callVersionCopy = this.callVersion;
                    var that = this;
                    this.gridPanel.showLoadingOverlay();
                    var sortModel;
                    if (this.gridOptionsWrapper.isEnableServerSideSorting()) {
                        sortModel = this.sortController.getSortModel();
                    }
                    var filterModel;
                    if (this.gridOptionsWrapper.isEnableServerSideFilter()) {
                        filterModel = this.filterManager.getFilterModel();
                    }
                    var params = {
                        startRow: startRow,
                        endRow: endRow,
                        successCallback: successCallback,
                        failCallback: failCallback,
                        sortModel: sortModel,
                        filterModel: filterModel
                    };
                    // check if old version of datasource used
                    var getRowsParams = utils_1.Utils.getFunctionParameters(this.datasource.getRows);
                    if (getRowsParams.length > 1) {
                        console.warn('ag-grid: It looks like your paging datasource is of the old type, taking more than one parameter.');
                        console.warn('ag-grid: From ag-grid 1.9.0, now the getRows takes one parameter. See the documentation for details.');
                    }
                    this.datasource.getRows(params);
                    function successCallback(rows, lastRowIndex) {
                        if (that.isCallDaemon(callVersionCopy)) {
                            return;
                        }
                        that.pageLoaded(rows, lastRowIndex);
                    }
                    function failCallback() {
                        if (that.isCallDaemon(callVersionCopy)) {
                            return;
                        }
                        // set in an empty set of rows, this will at
                        // least get rid of the loading panel, and
                        // stop blocking things
                        that.inMemoryRowModel.setRowData([], true);
                    }
                }
                isCallDaemon(versionCopy) {
                    return versionCopy !== this.callVersion;
                }
                onBtNext() {
                    this.currentPage++;
                    this.loadPage();
                }
                onBtPrevious() {
                    this.currentPage--;
                    this.loadPage();
                }
                onBtFirst() {
                    this.currentPage = 0;
                    this.loadPage();
                }
                onBtLast() {
                    this.currentPage = this.totalPages - 1;
                    this.loadPage();
                }
                isZeroPagesToDisplay() {
                    return this.foundMaxRow && this.totalPages === 0;
                }
                enableOrDisableButtons() {
                    var disablePreviousAndFirst = this.currentPage === 0;
                    this.btPrevious.disabled = disablePreviousAndFirst;
                    this.btFirst.disabled = disablePreviousAndFirst;
                    var zeroPagesToDisplay = this.isZeroPagesToDisplay();
                    var onLastPage = this.foundMaxRow && this.currentPage === (this.totalPages - 1);
                    var disableNext = onLastPage || zeroPagesToDisplay;
                    this.btNext.disabled = disableNext;
                    var disableLast = !this.foundMaxRow || zeroPagesToDisplay || this.currentPage === (this.totalPages - 1);
                    this.btLast.disabled = disableLast;
                }
                createTemplate() {
                    var localeTextFunc = this.gridOptionsWrapper.getLocaleTextFunc();
                    return template
                        .replace('[PAGE]', localeTextFunc('page', 'Page'))
                        .replace('[TO]', localeTextFunc('to', 'to'))
                        .replace('[OF]', localeTextFunc('of', 'of'))
                        .replace('[OF]', localeTextFunc('of', 'of'))
                        .replace('[FIRST]', localeTextFunc('first', 'First'))
                        .replace('[PREVIOUS]', localeTextFunc('previous', 'Previous'))
                        .replace('[NEXT]', localeTextFunc('next', 'Next'))
                        .replace('[LAST]', localeTextFunc('last', 'Last'));
                }
                getGui() {
                    return this.eGui;
                }
                setupComponents() {
                    this.eGui = utils_1.Utils.loadTemplate(this.createTemplate());
                    this.btNext = this.eGui.querySelector('#btNext');
                    this.btPrevious = this.eGui.querySelector('#btPrevious');
                    this.btFirst = this.eGui.querySelector('#btFirst');
                    this.btLast = this.eGui.querySelector('#btLast');
                    this.lbCurrent = this.eGui.querySelector('#current');
                    this.lbTotal = this.eGui.querySelector('#total');
                    this.lbRecordCount = this.eGui.querySelector('#recordCount');
                    this.lbFirstRowOnPage = this.eGui.querySelector('#firstRowOnPage');
                    this.lbLastRowOnPage = this.eGui.querySelector('#lastRowOnPage');
                    this.ePageRowSummaryPanel = this.eGui.querySelector('#pageRowSummaryPanel');
                    var that = this;
                    this.btNext.addEventListener('click', function () {
                        that.onBtNext();
                    });
                    this.btPrevious.addEventListener('click', function () {
                        that.onBtPrevious();
                    });
                    this.btFirst.addEventListener('click', function () {
                        that.onBtFirst();
                    });
                    this.btLast.addEventListener('click', function () {
                        that.onBtLast();
                    });
                }
            };
            __decorate([
                context_3.Autowired('filterManager'), 
                __metadata('design:type', filterManager_1.FilterManager)
            ], PaginationController.prototype, "filterManager", void 0);
            __decorate([
                context_3.Autowired('gridPanel'), 
                __metadata('design:type', gridPanel_1.GridPanel)
            ], PaginationController.prototype, "gridPanel", void 0);
            __decorate([
                context_3.Autowired('gridOptionsWrapper'), 
                __metadata('design:type', gridOptionsWrapper_1.GridOptionsWrapper)
            ], PaginationController.prototype, "gridOptionsWrapper", void 0);
            __decorate([
                context_3.Autowired('selectionController'), 
                __metadata('design:type', selectionController_1.SelectionController)
            ], PaginationController.prototype, "selectionController", void 0);
            __decorate([
                context_3.Autowired('sortController'), 
                __metadata('design:type', sortController_1.SortController)
            ], PaginationController.prototype, "sortController", void 0);
            __decorate([
                context_3.Autowired('eventService'), 
                __metadata('design:type', eventService_1.EventService)
            ], PaginationController.prototype, "eventService", void 0);
            __decorate([
                context_3.Autowired('rowModel'), 
                __metadata('design:type', Object)
            ], PaginationController.prototype, "rowModel", void 0);
            __decorate([
                context_4.PostConstruct, 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], PaginationController.prototype, "init", null);
            PaginationController = __decorate([
                context_2.Bean('paginationController'), 
                __metadata('design:paramtypes', [])
            ], PaginationController);
            exports_1("PaginationController", PaginationController);
        }
    }
});
//# sourceMappingURL=paginationController.js.map