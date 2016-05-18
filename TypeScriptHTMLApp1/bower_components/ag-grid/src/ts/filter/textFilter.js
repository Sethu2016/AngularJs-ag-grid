System.register(['../utils'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var utils_1;
    var template, CONTAINS, EQUALS, NOT_EQUALS, STARTS_WITH, ENDS_WITH, TextFilter;
    return {
        setters:[
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }],
        execute: function() {
            template = '<div>' +
                '<div>' +
                '<select class="ag-filter-select" id="filterType">' +
                '<option value="1">[CONTAINS]</option>' +
                '<option value="2">[EQUALS]</option>' +
                '<option value="3">[NOT EQUALS]</option>' +
                '<option value="4">[STARTS WITH]</option>' +
                '<option value="5">[ENDS WITH]</option>' +
                '</select>' +
                '</div>' +
                '<div>' +
                '<input class="ag-filter-filter" id="filterText" type="text" placeholder="[FILTER...]"/>' +
                '</div>' +
                '<div class="ag-filter-apply-panel" id="applyPanel">' +
                '<button type="button" id="applyButton">[APPLY FILTER]</button>' +
                '</div>' +
                '</div>';
            CONTAINS = 1;
            EQUALS = 2;
            NOT_EQUALS = 3;
            STARTS_WITH = 4;
            ENDS_WITH = 5;
            class TextFilter {
                init(params) {
                    this.filterParams = params.filterParams;
                    this.applyActive = this.filterParams && this.filterParams.apply === true;
                    this.filterChangedCallback = params.filterChangedCallback;
                    this.filterModifiedCallback = params.filterModifiedCallback;
                    this.localeTextFunc = params.localeTextFunc;
                    this.valueGetter = params.valueGetter;
                    this.createGui();
                    this.filterText = null;
                    this.filterType = CONTAINS;
                    this.createApi();
                }
                onNewRowsLoaded() {
                    var keepSelection = this.filterParams && this.filterParams.newRowsAction === 'keep';
                    if (!keepSelection) {
                        this.api.setType(CONTAINS);
                        this.api.setFilter(null);
                    }
                }
                afterGuiAttached() {
                    this.eFilterTextField.focus();
                }
                doesFilterPass(node) {
                    if (!this.filterText) {
                        return true;
                    }
                    var value = this.valueGetter(node);
                    if (!value) {
                        return false;
                    }
                    var valueLowerCase = value.toString().toLowerCase();
                    switch (this.filterType) {
                        case CONTAINS:
                            return valueLowerCase.indexOf(this.filterText) >= 0;
                        case EQUALS:
                            return valueLowerCase === this.filterText;
                        case NOT_EQUALS:
                            return valueLowerCase != this.filterText;
                        case STARTS_WITH:
                            return valueLowerCase.indexOf(this.filterText) === 0;
                        case ENDS_WITH:
                            var index = valueLowerCase.lastIndexOf(this.filterText);
                            return index >= 0 && index === (valueLowerCase.length - this.filterText.length);
                        default:
                            // should never happen
                            console.warn('invalid filter type ' + this.filterType);
                            return false;
                    }
                }
                getGui() {
                    return this.eGui;
                }
                isFilterActive() {
                    return this.filterText !== null;
                }
                createTemplate() {
                    return template
                        .replace('[FILTER...]', this.localeTextFunc('filterOoo', 'Filter...'))
                        .replace('[EQUALS]', this.localeTextFunc('equals', 'Equals'))
                        .replace('[NOT EQUALS]', this.localeTextFunc('notEquals', 'Not equals'))
                        .replace('[CONTAINS]', this.localeTextFunc('contains', 'Contains'))
                        .replace('[STARTS WITH]', this.localeTextFunc('startsWith', 'Starts with'))
                        .replace('[ENDS WITH]', this.localeTextFunc('endsWith', 'Ends with'))
                        .replace('[APPLY FILTER]', this.localeTextFunc('applyFilter', 'Apply Filter'));
                }
                createGui() {
                    this.eGui = utils_1.Utils.loadTemplate(this.createTemplate());
                    this.eFilterTextField = this.eGui.querySelector("#filterText");
                    this.eTypeSelect = this.eGui.querySelector("#filterType");
                    utils_1.Utils.addChangeListener(this.eFilterTextField, this.onFilterChanged.bind(this));
                    this.eTypeSelect.addEventListener("change", this.onTypeChanged.bind(this));
                    this.setupApply();
                }
                setupApply() {
                    if (this.applyActive) {
                        this.eApplyButton = this.eGui.querySelector('#applyButton');
                        this.eApplyButton.addEventListener('click', () => {
                            this.filterChangedCallback();
                        });
                    }
                    else {
                        utils_1.Utils.removeElement(this.eGui, '#applyPanel');
                    }
                }
                onTypeChanged() {
                    this.filterType = parseInt(this.eTypeSelect.value);
                    this.filterChanged();
                }
                onFilterChanged() {
                    var filterText = utils_1.Utils.makeNull(this.eFilterTextField.value);
                    if (filterText && filterText.trim() === '') {
                        filterText = null;
                    }
                    var newFilterText;
                    if (filterText !== null && filterText !== undefined) {
                        newFilterText = filterText.toLowerCase();
                    }
                    else {
                        newFilterText = null;
                    }
                    if (this.filterText !== newFilterText) {
                        this.filterText = newFilterText;
                        this.filterChanged();
                    }
                }
                filterChanged() {
                    this.filterModifiedCallback();
                    if (!this.applyActive) {
                        this.filterChangedCallback();
                    }
                }
                createApi() {
                    var that = this;
                    this.api = {
                        EQUALS: EQUALS,
                        NOT_EQUALS: NOT_EQUALS,
                        CONTAINS: CONTAINS,
                        STARTS_WITH: STARTS_WITH,
                        ENDS_WITH: ENDS_WITH,
                        setType: function (type) {
                            that.filterType = type;
                            that.eTypeSelect.value = type;
                        },
                        setFilter: function (filter) {
                            filter = utils_1.Utils.makeNull(filter);
                            if (filter) {
                                that.filterText = filter.toLowerCase();
                                that.eFilterTextField.value = filter;
                            }
                            else {
                                that.filterText = null;
                                that.eFilterTextField.value = null;
                            }
                        },
                        getType: function () {
                            return that.filterType;
                        },
                        getFilter: function () {
                            return that.filterText;
                        },
                        getModel: function () {
                            if (that.isFilterActive()) {
                                return {
                                    type: that.filterType,
                                    filter: that.filterText
                                };
                            }
                            else {
                                return null;
                            }
                        },
                        setModel: function (dataModel) {
                            if (dataModel) {
                                this.setType(dataModel.type);
                                this.setFilter(dataModel.filter);
                            }
                            else {
                                this.setFilter(null);
                            }
                        }
                    };
                }
                getApi() {
                    return this.api;
                }
            }
            exports_1("TextFilter", TextFilter);
        }
    }
});
//# sourceMappingURL=textFilter.js.map