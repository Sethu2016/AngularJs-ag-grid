System.register(["../utils", "../gridOptionsWrapper", "../widgets/popupService", "../valueService", "../columnController/columnController", "./textFilter", "./numberFilter", "../context/context", "../eventService", "../events"], function(exports_1, context_1) {
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
    var utils_1, gridOptionsWrapper_1, popupService_1, valueService_1, columnController_1, textFilter_1, numberFilter_1, context_2, eventService_1, events_1;
    var FilterManager;
    return {
        setters:[
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (gridOptionsWrapper_1_1) {
                gridOptionsWrapper_1 = gridOptionsWrapper_1_1;
            },
            function (popupService_1_1) {
                popupService_1 = popupService_1_1;
            },
            function (valueService_1_1) {
                valueService_1 = valueService_1_1;
            },
            function (columnController_1_1) {
                columnController_1 = columnController_1_1;
            },
            function (textFilter_1_1) {
                textFilter_1 = textFilter_1_1;
            },
            function (numberFilter_1_1) {
                numberFilter_1 = numberFilter_1_1;
            },
            function (context_2_1) {
                context_2 = context_2_1;
            },
            function (eventService_1_1) {
                eventService_1 = eventService_1_1;
            },
            function (events_1_1) {
                events_1 = events_1_1;
            }],
        execute: function() {
            let FilterManager = class FilterManager {
                constructor() {
                    this.allFilters = {};
                    this.quickFilter = null;
                    this.availableFilters = {
                        'text': textFilter_1.TextFilter,
                        'number': numberFilter_1.NumberFilter
                    };
                }
                init() {
                    this.eventService.addEventListener(events_1.Events.EVENT_ROW_DATA_CHANGED, this.onNewRowsLoaded.bind(this));
                    this.eventService.addEventListener(events_1.Events.EVENT_NEW_COLUMNS_LOADED, this.onNewColumnsLoaded.bind(this));
                }
                registerFilter(key, Filter) {
                    this.availableFilters[key] = Filter;
                }
                setFilterModel(model) {
                    if (model) {
                        // mark the filters as we set them, so any active filters left over we stop
                        var modelKeys = Object.keys(model);
                        utils_1.Utils.iterateObject(this.allFilters, (colId, filterWrapper) => {
                            utils_1.Utils.removeFromArray(modelKeys, colId);
                            var newModel = model[colId];
                            this.setModelOnFilterWrapper(filterWrapper.filter, newModel);
                        });
                        // at this point, processedFields contains data for which we don't have a filter working yet
                        utils_1.Utils.iterateArray(modelKeys, (colId) => {
                            var column = this.columnController.getColumn(colId);
                            if (!column) {
                                console.warn('Warning ag-grid setFilterModel - no column found for colId ' + colId);
                                return;
                            }
                            var filterWrapper = this.getOrCreateFilterWrapper(column);
                            this.setModelOnFilterWrapper(filterWrapper.filter, model[colId]);
                        });
                    }
                    else {
                        utils_1.Utils.iterateObject(this.allFilters, (key, filterWrapper) => {
                            this.setModelOnFilterWrapper(filterWrapper.filter, null);
                        });
                    }
                    this.onFilterChanged();
                }
                setModelOnFilterWrapper(filter, newModel) {
                    // because user can provide filters, we provide useful error checking and messages
                    if (typeof filter.getApi !== 'function') {
                        console.warn('Warning ag-grid - filter missing getApi method, which is needed for getFilterModel');
                        return;
                    }
                    var filterApi = filter.getApi();
                    if (typeof filterApi.setModel !== 'function') {
                        console.warn('Warning ag-grid - filter API missing setModel method, which is needed for setFilterModel');
                        return;
                    }
                    filterApi.setModel(newModel);
                }
                getFilterModel() {
                    var result = {};
                    utils_1.Utils.iterateObject(this.allFilters, function (key, filterWrapper) {
                        // because user can provide filters, we provide useful error checking and messages
                        if (typeof filterWrapper.filter.getApi !== 'function') {
                            console.warn('Warning ag-grid - filter missing getApi method, which is needed for getFilterModel');
                            return;
                        }
                        var filterApi = filterWrapper.filter.getApi();
                        if (typeof filterApi.getModel !== 'function') {
                            console.warn('Warning ag-grid - filter API missing getModel method, which is needed for getFilterModel');
                            return;
                        }
                        var model = filterApi.getModel();
                        if (utils_1.Utils.exists(model)) {
                            result[key] = model;
                        }
                    });
                    return result;
                }
                // returns true if any advanced filter (ie not quick filter) active
                isAdvancedFilterPresent() {
                    var atLeastOneActive = false;
                    utils_1.Utils.iterateObject(this.allFilters, function (key, filterWrapper) {
                        if (!filterWrapper.filter.isFilterActive) {
                            console.error('Filter is missing method isFilterActive');
                        }
                        if (filterWrapper.filter.isFilterActive()) {
                            atLeastOneActive = true;
                            filterWrapper.column.setFilterActive(true);
                        }
                        else {
                            filterWrapper.column.setFilterActive(false);
                        }
                    });
                    return atLeastOneActive;
                }
                // returns true if quickFilter or advancedFilter
                isAnyFilterPresent() {
                    return this.isQuickFilterPresent() || this.advancedFilterPresent || this.externalFilterPresent;
                }
                doesFilterPass(node, filterToSkip) {
                    var data = node.data;
                    var colKeys = Object.keys(this.allFilters);
                    for (var i = 0, l = colKeys.length; i < l; i++) {
                        var colId = colKeys[i];
                        var filterWrapper = this.allFilters[colId];
                        // if no filter, always pass
                        if (filterWrapper === undefined) {
                            continue;
                        }
                        if (filterWrapper.filter === filterToSkip) {
                            continue;
                        }
                        // don't bother with filters that are not active
                        if (!filterWrapper.filter.isFilterActive()) {
                            continue;
                        }
                        if (!filterWrapper.filter.doesFilterPass) {
                            console.error('Filter is missing method doesFilterPass');
                        }
                        var params = {
                            node: node,
                            data: data
                        };
                        if (!filterWrapper.filter.doesFilterPass(params)) {
                            return false;
                        }
                    }
                    // all filters passed
                    return true;
                }
                // returns true if it has changed (not just same value again)
                setQuickFilter(newFilter) {
                    if (newFilter === undefined || newFilter === "") {
                        newFilter = null;
                    }
                    if (this.quickFilter !== newFilter) {
                        if (this.gridOptionsWrapper.isRowModelVirtual()) {
                            console.warn('ag-grid: cannot do quick filtering when doing virtual paging');
                            return;
                        }
                        //want 'null' to mean to filter, so remove undefined and empty string
                        if (newFilter === undefined || newFilter === "") {
                            newFilter = null;
                        }
                        if (newFilter !== null) {
                            newFilter = newFilter.toUpperCase();
                        }
                        this.quickFilter = newFilter;
                        this.onFilterChanged();
                    }
                }
                onFilterChanged() {
                    this.eventService.dispatchEvent(events_1.Events.EVENT_BEFORE_FILTER_CHANGED);
                    this.advancedFilterPresent = this.isAdvancedFilterPresent();
                    this.externalFilterPresent = this.gridOptionsWrapper.isExternalFilterPresent();
                    utils_1.Utils.iterateObject(this.allFilters, function (key, filterWrapper) {
                        if (filterWrapper.filter.onAnyFilterChanged) {
                            filterWrapper.filter.onAnyFilterChanged();
                        }
                    });
                    this.eventService.dispatchEvent(events_1.Events.EVENT_FILTER_CHANGED);
                    this.eventService.dispatchEvent(events_1.Events.EVENT_AFTER_FILTER_CHANGED);
                }
                isQuickFilterPresent() {
                    return this.quickFilter !== null;
                }
                doesRowPassOtherFilters(filterToSkip, node) {
                    return this.doesRowPassFilter(node, filterToSkip);
                }
                doesRowPassFilter(node, filterToSkip) {
                    //first up, check quick filter
                    if (this.isQuickFilterPresent()) {
                        if (!node.quickFilterAggregateText) {
                            this.aggregateRowForQuickFilter(node);
                        }
                        if (node.quickFilterAggregateText.indexOf(this.quickFilter) < 0) {
                            //quick filter fails, so skip item
                            return false;
                        }
                    }
                    //secondly, give the client a chance to reject this row
                    if (this.externalFilterPresent) {
                        if (!this.gridOptionsWrapper.doesExternalFilterPass(node)) {
                            return false;
                        }
                    }
                    //lastly, check our internal advanced filter
                    if (this.advancedFilterPresent) {
                        if (!this.doesFilterPass(node, filterToSkip)) {
                            return false;
                        }
                    }
                    //got this far, all filters pass
                    return true;
                }
                aggregateRowForQuickFilter(node) {
                    var aggregatedText = '';
                    var that = this;
                    this.columnController.getAllColumns().forEach(function (column) {
                        var value = that.valueService.getValue(column, node);
                        if (value && value !== '') {
                            aggregatedText = aggregatedText + value.toString().toUpperCase() + "_";
                        }
                    });
                    node.quickFilterAggregateText = aggregatedText;
                }
                onNewRowsLoaded() {
                    var that = this;
                    Object.keys(this.allFilters).forEach(function (field) {
                        var filter = that.allFilters[field].filter;
                        if (filter.onNewRowsLoaded) {
                            filter.onNewRowsLoaded();
                        }
                    });
                }
                createValueGetter(column) {
                    var that = this;
                    return function valueGetter(node) {
                        return that.valueService.getValue(column, node);
                    };
                }
                getFilterApi(column) {
                    var filterWrapper = this.getOrCreateFilterWrapper(column);
                    if (filterWrapper) {
                        if (typeof filterWrapper.filter.getApi === 'function') {
                            return filterWrapper.filter.getApi();
                        }
                    }
                }
                getOrCreateFilterWrapper(column) {
                    var filterWrapper = this.allFilters[column.getColId()];
                    if (!filterWrapper) {
                        filterWrapper = this.createFilterWrapper(column);
                        this.allFilters[column.getColId()] = filterWrapper;
                    }
                    return filterWrapper;
                }
                // destroys the filter, so it not longer takes par
                destroyFilter(column) {
                    var filterWrapper = this.allFilters[column.getColId()];
                    if (filterWrapper) {
                        if (filterWrapper.destroy) {
                            filterWrapper.destroy();
                        }
                        delete this.allFilters[column.getColId()];
                        this.onFilterChanged();
                        filterWrapper.column.setFilterActive(false);
                    }
                }
                createFilterWrapper(column) {
                    var colDef = column.getColDef();
                    var filterWrapper = {
                        column: column,
                        filter: null,
                        scope: null,
                        gui: null
                    };
                    if (typeof colDef.filter === 'function') {
                        // if user provided a filter, just use it
                        // first up, create child scope if needed
                        if (this.gridOptionsWrapper.isAngularCompileFilters()) {
                            filterWrapper.scope = this.$scope.$new();
                        }
                        // now create filter (had to cast to any to get 'new' working)
                        this.assertMethodHasNoParameters(colDef.filter);
                        filterWrapper.filter = new colDef.filter();
                    }
                    else if (utils_1.Utils.missing(colDef.filter) || typeof colDef.filter === 'string') {
                        var Filter = this.getFilterFromCache(colDef.filter);
                        filterWrapper.filter = new Filter();
                    }
                    else {
                        console.error('ag-Grid: colDef.filter should be function or a string');
                    }
                    this.context.wireBean(filterWrapper.filter);
                    var filterChangedCallback = this.onFilterChanged.bind(this);
                    var filterModifiedCallback = () => this.eventService.dispatchEvent(events_1.Events.EVENT_FILTER_MODIFIED);
                    var doesRowPassOtherFilters = this.doesRowPassOtherFilters.bind(this, filterWrapper.filter);
                    var filterParams = colDef.filterParams;
                    var params = {
                        column: column,
                        colDef: colDef,
                        rowModel: this.rowModel,
                        filterChangedCallback: filterChangedCallback,
                        filterModifiedCallback: filterModifiedCallback,
                        filterParams: filterParams,
                        localeTextFunc: this.gridOptionsWrapper.getLocaleTextFunc(),
                        valueGetter: this.createValueGetter(column),
                        doesRowPassOtherFilter: doesRowPassOtherFilters,
                        context: this.gridOptionsWrapper.getContext(),
                        $scope: filterWrapper.scope
                    };
                    if (!filterWrapper.filter.init) {
                        throw 'Filter is missing method init';
                    }
                    filterWrapper.filter.init(params);
                    if (!filterWrapper.filter.getGui) {
                        throw 'Filter is missing method getGui';
                    }
                    var eFilterGui = document.createElement('div');
                    eFilterGui.className = 'ag-filter';
                    var guiFromFilter = filterWrapper.filter.getGui();
                    if (utils_1.Utils.isNodeOrElement(guiFromFilter)) {
                        //a dom node or element was returned, so add child
                        eFilterGui.appendChild(guiFromFilter);
                    }
                    else {
                        //otherwise assume it was html, so just insert
                        var eTextSpan = document.createElement('span');
                        eTextSpan.innerHTML = guiFromFilter;
                        eFilterGui.appendChild(eTextSpan);
                    }
                    if (filterWrapper.scope) {
                        filterWrapper.gui = this.$compile(eFilterGui)(filterWrapper.scope)[0];
                    }
                    else {
                        filterWrapper.gui = eFilterGui;
                    }
                    return filterWrapper;
                }
                getFilterFromCache(filterType) {
                    var defaultFilterType = this.enterprise ? 'set' : 'text';
                    var defaultFilter = this.availableFilters[defaultFilterType];
                    if (utils_1.Utils.missing(filterType)) {
                        return defaultFilter;
                    }
                    if (!this.enterprise && filterType === 'set') {
                        console.warn('ag-Grid: Set filter is only available in Enterprise ag-Grid');
                        filterType = 'text';
                    }
                    if (this.availableFilters[filterType]) {
                        return this.availableFilters[filterType];
                    }
                    else {
                        console.error('ag-Grid: Could not find filter type ' + filterType);
                        return this.availableFilters[defaultFilter];
                    }
                }
                onNewColumnsLoaded() {
                    this.destroy();
                }
                destroy() {
                    utils_1.Utils.iterateObject(this.allFilters, (key, filterWrapper) => {
                        if (filterWrapper.filter.destroy) {
                            filterWrapper.filter.destroy();
                            filterWrapper.column.setFilterActive(false);
                        }
                    });
                    this.allFilters = {};
                }
                assertMethodHasNoParameters(theMethod) {
                    var getRowsParams = utils_1.Utils.getFunctionParameters(theMethod);
                    if (getRowsParams.length > 0) {
                        console.warn('ag-grid: It looks like your filter is of the old type and expecting parameters in the constructor.');
                        console.warn('ag-grid: From ag-grid 1.14, the constructor should take no parameters and init() used instead.');
                    }
                }
            };
            __decorate([
                context_2.Autowired('$compile'), 
                __metadata('design:type', Object)
            ], FilterManager.prototype, "$compile", void 0);
            __decorate([
                context_2.Autowired('$scope'), 
                __metadata('design:type', Object)
            ], FilterManager.prototype, "$scope", void 0);
            __decorate([
                context_2.Autowired('gridOptionsWrapper'), 
                __metadata('design:type', gridOptionsWrapper_1.GridOptionsWrapper)
            ], FilterManager.prototype, "gridOptionsWrapper", void 0);
            __decorate([
                context_2.Autowired('gridCore'), 
                __metadata('design:type', Object)
            ], FilterManager.prototype, "gridCore", void 0);
            __decorate([
                context_2.Autowired('popupService'), 
                __metadata('design:type', popupService_1.PopupService)
            ], FilterManager.prototype, "popupService", void 0);
            __decorate([
                context_2.Autowired('valueService'), 
                __metadata('design:type', valueService_1.ValueService)
            ], FilterManager.prototype, "valueService", void 0);
            __decorate([
                context_2.Autowired('columnController'), 
                __metadata('design:type', columnController_1.ColumnController)
            ], FilterManager.prototype, "columnController", void 0);
            __decorate([
                context_2.Autowired('rowModel'), 
                __metadata('design:type', Object)
            ], FilterManager.prototype, "rowModel", void 0);
            __decorate([
                context_2.Autowired('eventService'), 
                __metadata('design:type', eventService_1.EventService)
            ], FilterManager.prototype, "eventService", void 0);
            __decorate([
                context_2.Autowired('enterprise'), 
                __metadata('design:type', Boolean)
            ], FilterManager.prototype, "enterprise", void 0);
            __decorate([
                context_2.Autowired('context'), 
                __metadata('design:type', context_2.Context)
            ], FilterManager.prototype, "context", void 0);
            __decorate([
                context_2.PostConstruct, 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], FilterManager.prototype, "init", null);
            __decorate([
                context_2.PreDestroy, 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], FilterManager.prototype, "destroy", null);
            FilterManager = __decorate([
                context_2.Bean('filterManager'), 
                __metadata('design:paramtypes', [])
            ], FilterManager);
            exports_1("FilterManager", FilterManager);
        }
    }
});
//# sourceMappingURL=filterManager.js.map