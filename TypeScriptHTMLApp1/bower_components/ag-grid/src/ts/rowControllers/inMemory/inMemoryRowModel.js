System.register(["../../utils", "../../constants", "../../gridOptionsWrapper", "../../columnController/columnController", "../../filter/filterManager", "../../entities/rowNode", "../../eventService", "../../events", "../../context/context", "../../selectionController"], function(exports_1, context_1) {
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
    var utils_1, constants_1, gridOptionsWrapper_1, columnController_1, filterManager_1, rowNode_1, eventService_1, events_1, context_2, selectionController_1;
    var RecursionType, InMemoryRowModel;
    return {
        setters:[
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (constants_1_1) {
                constants_1 = constants_1_1;
            },
            function (gridOptionsWrapper_1_1) {
                gridOptionsWrapper_1 = gridOptionsWrapper_1_1;
            },
            function (columnController_1_1) {
                columnController_1 = columnController_1_1;
            },
            function (filterManager_1_1) {
                filterManager_1 = filterManager_1_1;
            },
            function (rowNode_1_1) {
                rowNode_1 = rowNode_1_1;
            },
            function (eventService_1_1) {
                eventService_1 = eventService_1_1;
            },
            function (events_1_1) {
                events_1 = events_1_1;
            },
            function (context_2_1) {
                context_2 = context_2_1;
            },
            function (selectionController_1_1) {
                selectionController_1 = selectionController_1_1;
            }],
        execute: function() {
            (function (RecursionType) {
                RecursionType[RecursionType["Normal"] = 0] = "Normal";
                RecursionType[RecursionType["AfterFilter"] = 1] = "AfterFilter";
                RecursionType[RecursionType["AfterFilterAndSort"] = 2] = "AfterFilterAndSort";
            })(RecursionType || (RecursionType = {}));
            ;
            let InMemoryRowModel = class InMemoryRowModel {
                constructor() {
                    // the rows go through a pipeline of steps, each array below is the result
                    // after a certain step.
                    this.allRows = []; // the rows, in a list, as provided by the user, but wrapped in RowNode objects
                }
                init() {
                    this.eventService.addModalPriorityEventListener(events_1.Events.EVENT_COLUMN_EVERYTHING_CHANGED, this.refreshModel.bind(this, constants_1.Constants.STEP_EVERYTHING));
                    this.eventService.addModalPriorityEventListener(events_1.Events.EVENT_COLUMN_ROW_GROUP_CHANGE, this.refreshModel.bind(this, constants_1.Constants.STEP_EVERYTHING));
                    this.eventService.addModalPriorityEventListener(events_1.Events.EVENT_COLUMN_VALUE_CHANGE, this.refreshModel.bind(this, constants_1.Constants.STEP_AGGREGATE));
                    this.eventService.addModalPriorityEventListener(events_1.Events.EVENT_FILTER_CHANGED, this.refreshModel.bind(this, constants_1.Constants.STEP_FILTER));
                    this.eventService.addModalPriorityEventListener(events_1.Events.EVENT_SORT_CHANGED, this.refreshModel.bind(this, constants_1.Constants.STEP_SORT));
                    if (this.gridOptionsWrapper.isRowModelDefault()) {
                        this.setRowData(this.gridOptionsWrapper.getRowData(), this.columnController.isReady());
                    }
                }
                getType() {
                    return constants_1.Constants.ROW_MODEL_TYPE_NORMAL;
                }
                refreshModel(step, fromIndex, groupState) {
                    // this goes through the pipeline of stages. what's in my head is similar
                    // to the diagram on this page:
                    // http://commons.apache.org/sandbox/commons-pipeline/pipeline_basics.html
                    // however we want to keep the results of each stage, hence we manually call
                    // each step rather than have them chain each other.
                    // fallthrough in below switch is on purpose,
                    // eg if STEP_FILTER, then all steps below this
                    // step get done
                    switch (step) {
                        case constants_1.Constants.STEP_EVERYTHING:
                            this.doRowGrouping(groupState);
                        case constants_1.Constants.STEP_FILTER:
                            this.doFilter();
                        case constants_1.Constants.STEP_AGGREGATE:
                            this.doAggregate();
                        case constants_1.Constants.STEP_SORT:
                            this.doSort();
                        case constants_1.Constants.STEP_MAP:
                            this.doRowsToDisplay();
                    }
                    this.eventService.dispatchEvent(events_1.Events.EVENT_MODEL_UPDATED, { fromIndex: fromIndex });
                    if (this.$scope) {
                        setTimeout(() => {
                            this.$scope.$apply();
                        }, 0);
                    }
                }
                isEmpty() {
                    return this.allRows === null || this.allRows.length === 0 || !this.columnController.isReady();
                }
                isRowsToRender() {
                    return utils_1.Utils.exists(this.rowsToDisplay) && this.rowsToDisplay.length > 0;
                }
                setDatasource(datasource) {
                    console.error('ag-Grid: should never call setDatasource on inMemoryRowController');
                }
                getTopLevelNodes() {
                    return this.rowsAfterGroup;
                }
                getRow(index) {
                    return this.rowsToDisplay[index];
                }
                getVirtualRowCount() {
                    console.warn('ag-Grid: rowModel.getVirtualRowCount() is not longer a function, use rowModel.getRowCount() instead');
                    return this.getRowCount();
                }
                getRowCount() {
                    if (this.rowsToDisplay) {
                        return this.rowsToDisplay.length;
                    }
                    else {
                        return 0;
                    }
                }
                getRowIndexAtPixel(pixelToMatch) {
                    if (this.isEmpty()) {
                        return -1;
                    }
                    // do binary search of tree
                    // http://oli.me.uk/2013/06/08/searching-javascript-arrays-with-a-binary-search/
                    var bottomPointer = 0;
                    var topPointer = this.rowsToDisplay.length - 1;
                    // quick check, if the pixel is out of bounds, then return last row
                    if (pixelToMatch <= 0) {
                        // if pixel is less than or equal zero, it's always the first row
                        return 0;
                    }
                    var lastNode = this.rowsToDisplay[this.rowsToDisplay.length - 1];
                    if (lastNode.rowTop <= pixelToMatch) {
                        return this.rowsToDisplay.length - 1;
                    }
                    while (true) {
                        var midPointer = Math.floor((bottomPointer + topPointer) / 2);
                        var currentRowNode = this.rowsToDisplay[midPointer];
                        if (this.isRowInPixel(currentRowNode, pixelToMatch)) {
                            return midPointer;
                        }
                        else if (currentRowNode.rowTop < pixelToMatch) {
                            bottomPointer = midPointer + 1;
                        }
                        else if (currentRowNode.rowTop > pixelToMatch) {
                            topPointer = midPointer - 1;
                        }
                    }
                }
                isRowInPixel(rowNode, pixelToMatch) {
                    var topPixel = rowNode.rowTop;
                    var bottomPixel = rowNode.rowTop + rowNode.rowHeight;
                    var pixelInRow = topPixel <= pixelToMatch && bottomPixel > pixelToMatch;
                    return pixelInRow;
                }
                getRowCombinedHeight() {
                    if (this.rowsToDisplay && this.rowsToDisplay.length > 0) {
                        var lastRow = this.rowsToDisplay[this.rowsToDisplay.length - 1];
                        var lastPixel = lastRow.rowTop + lastRow.rowHeight;
                        return lastPixel;
                    }
                    else {
                        return 0;
                    }
                }
                forEachNode(callback) {
                    this.recursivelyWalkNodesAndCallback(this.rowsAfterGroup, callback, RecursionType.Normal, 0);
                }
                forEachNodeAfterFilter(callback) {
                    this.recursivelyWalkNodesAndCallback(this.rowsAfterFilter, callback, RecursionType.AfterFilter, 0);
                }
                forEachNodeAfterFilterAndSort(callback) {
                    this.recursivelyWalkNodesAndCallback(this.rowsAfterSort, callback, RecursionType.AfterFilterAndSort, 0);
                }
                // iterates through each item in memory, and calls the callback function
                // nodes - the rowNodes to traverse
                // callback - the user provided callback
                // recursion type - need this to know what child nodes to recurse, eg if looking at all nodes, or filtered notes etc
                // index - works similar to the index in forEach in javascripts array function
                recursivelyWalkNodesAndCallback(nodes, callback, recursionType, index) {
                    if (nodes) {
                        for (var i = 0; i < nodes.length; i++) {
                            var node = nodes[i];
                            callback(node, index++);
                            // go to the next level if it is a group
                            if (node.group) {
                                // depending on the recursion type, we pick a difference set of children
                                var nodeChildren;
                                switch (recursionType) {
                                    case RecursionType.Normal:
                                        nodeChildren = node.children;
                                        break;
                                    case RecursionType.AfterFilter:
                                        nodeChildren = node.childrenAfterFilter;
                                        break;
                                    case RecursionType.AfterFilterAndSort:
                                        nodeChildren = node.childrenAfterSort;
                                        break;
                                }
                                if (nodeChildren) {
                                    index = this.recursivelyWalkNodesAndCallback(nodeChildren, callback, recursionType, index);
                                }
                            }
                        }
                    }
                    return index;
                }
                // it's possible to recompute the aggregate without doing the other parts
                // + gridApi.recomputeAggregates()
                doAggregate() {
                    if (this.aggregationStage) {
                        this.aggregationStage.execute(this.rowsAfterFilter);
                    }
                }
                // + gridApi.expandAll()
                // + gridApi.collapseAll()
                expandOrCollapseAll(expand) {
                    recursiveExpandOrCollapse(this.rowsAfterGroup);
                    function recursiveExpandOrCollapse(rowNodes) {
                        if (!rowNodes) {
                            return;
                        }
                        rowNodes.forEach((rowNode) => {
                            if (rowNode.group) {
                                rowNode.expanded = expand;
                                recursiveExpandOrCollapse(rowNode.children);
                            }
                        });
                    }
                    this.refreshModel(constants_1.Constants.STEP_MAP);
                }
                doSort() {
                    this.rowsAfterSort = this.sortStage.execute(this.rowsAfterFilter);
                }
                doRowGrouping(groupState) {
                    // grouping is enterprise only, so if service missing, skip the step
                    var rowsAlreadyGrouped = utils_1.Utils.exists(this.gridOptionsWrapper.getNodeChildDetailsFunc());
                    if (this.groupStage && !rowsAlreadyGrouped) {
                        // remove old groups from the selection model, as we are about to replace them
                        // with new groups
                        this.selectionController.removeGroupsFromSelection();
                        this.rowsAfterGroup = this.groupStage.execute(this.allRows);
                        this.restoreGroupState(groupState);
                        if (this.gridOptionsWrapper.isGroupSelectsChildren()) {
                            this.selectionController.updateGroupsFromChildrenSelections();
                        }
                    }
                    else {
                        this.rowsAfterGroup = this.allRows;
                    }
                }
                restoreGroupState(groupState) {
                    if (!groupState) {
                        return;
                    }
                    utils_1.Utils.traverseNodesWithKey(this.rowsAfterGroup, (node, key) => {
                        // if the group was open last time, then open it this time. however
                        // if was not open last time, then don't touch the group, so the 'groupDefaultExpanded'
                        // setting will take effect.
                        if (groupState[key] === true) {
                            node.expanded = true;
                        }
                    });
                }
                doFilter() {
                    this.rowsAfterFilter = this.filterStage.execute(this.rowsAfterGroup);
                }
                // rows: the rows to put into the model
                // firstId: the first id to use, used for paging, where we are not on the first page
                setRowData(rowData, refresh, firstId) {
                    // remember group state, so we can expand groups that should be expanded
                    var groupState = this.getGroupState();
                    // place each row into a wrapper
                    this.allRows = this.createRowNodesFromData(rowData, firstId);
                    this.eventService.dispatchEvent(events_1.Events.EVENT_ROW_DATA_CHANGED);
                    if (refresh) {
                        this.refreshModel(constants_1.Constants.STEP_EVERYTHING, null, groupState);
                    }
                }
                getGroupState() {
                    if (!this.rowsAfterGroup || !this.gridOptionsWrapper.isRememberGroupStateWhenNewData()) {
                        return null;
                    }
                    var result = {};
                    utils_1.Utils.traverseNodesWithKey(this.rowsAfterGroup, (node, key) => result[key] = node.expanded);
                    return result;
                }
                createRowNodesFromData(rowData, firstId) {
                    var that = this;
                    if (!rowData) {
                        return [];
                    }
                    var rowNodeId = utils_1.Utils.exists(firstId) ? firstId : 0;
                    // func below doesn't have 'this' pointer, so need to pull out these bits
                    var nodeChildDetailsFunc = this.gridOptionsWrapper.getNodeChildDetailsFunc();
                    var suppressParentsInRowNodes = this.gridOptionsWrapper.isSuppressParentsInRowNodes();
                    // kick off recursion
                    var result = recursiveFunction(rowData, null, 0);
                    return result;
                    function recursiveFunction(rowData, parent, level) {
                        var rowNodes = [];
                        rowData.forEach((dataItem) => {
                            var node = new rowNode_1.RowNode();
                            that.context.wireBean(node);
                            var nodeChildDetails = nodeChildDetailsFunc ? nodeChildDetailsFunc(dataItem) : null;
                            if (nodeChildDetails && nodeChildDetails.group) {
                                node.group = true;
                                node.children = recursiveFunction(nodeChildDetails.children, node, level + 1);
                                node.expanded = nodeChildDetails.expanded === true;
                                node.field = nodeChildDetails.field;
                                node.key = nodeChildDetails.key;
                            }
                            if (parent && !suppressParentsInRowNodes) {
                                node.parent = parent;
                            }
                            node.level = level;
                            node.id = rowNodeId++;
                            node.data = dataItem;
                            rowNodes.push(node);
                        });
                        return rowNodes;
                    }
                }
                doRowsToDisplay() {
                    this.rowsToDisplay = this.flattenStage.execute(this.rowsAfterSort);
                }
            };
            __decorate([
                context_2.Autowired('gridOptionsWrapper'), 
                __metadata('design:type', gridOptionsWrapper_1.GridOptionsWrapper)
            ], InMemoryRowModel.prototype, "gridOptionsWrapper", void 0);
            __decorate([
                context_2.Autowired('columnController'), 
                __metadata('design:type', columnController_1.ColumnController)
            ], InMemoryRowModel.prototype, "columnController", void 0);
            __decorate([
                context_2.Autowired('filterManager'), 
                __metadata('design:type', filterManager_1.FilterManager)
            ], InMemoryRowModel.prototype, "filterManager", void 0);
            __decorate([
                context_2.Autowired('$scope'), 
                __metadata('design:type', Object)
            ], InMemoryRowModel.prototype, "$scope", void 0);
            __decorate([
                context_2.Autowired('selectionController'), 
                __metadata('design:type', selectionController_1.SelectionController)
            ], InMemoryRowModel.prototype, "selectionController", void 0);
            __decorate([
                context_2.Autowired('eventService'), 
                __metadata('design:type', eventService_1.EventService)
            ], InMemoryRowModel.prototype, "eventService", void 0);
            __decorate([
                context_2.Autowired('context'), 
                __metadata('design:type', context_2.Context)
            ], InMemoryRowModel.prototype, "context", void 0);
            __decorate([
                context_2.Autowired('filterStage'), 
                __metadata('design:type', Object)
            ], InMemoryRowModel.prototype, "filterStage", void 0);
            __decorate([
                context_2.Autowired('sortStage'), 
                __metadata('design:type', Object)
            ], InMemoryRowModel.prototype, "sortStage", void 0);
            __decorate([
                context_2.Autowired('flattenStage'), 
                __metadata('design:type', Object)
            ], InMemoryRowModel.prototype, "flattenStage", void 0);
            __decorate([
                context_2.Optional('groupStage'), 
                __metadata('design:type', Object)
            ], InMemoryRowModel.prototype, "groupStage", void 0);
            __decorate([
                context_2.Optional('aggregationStage'), 
                __metadata('design:type', Object)
            ], InMemoryRowModel.prototype, "aggregationStage", void 0);
            __decorate([
                // the rows mapped to rows to display
                context_2.PostConstruct, 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], InMemoryRowModel.prototype, "init", null);
            InMemoryRowModel = __decorate([
                context_2.Bean('rowModel'), 
                __metadata('design:paramtypes', [])
            ], InMemoryRowModel);
            exports_1("InMemoryRowModel", InMemoryRowModel);
        }
    }
});
//# sourceMappingURL=inMemoryRowModel.js.map