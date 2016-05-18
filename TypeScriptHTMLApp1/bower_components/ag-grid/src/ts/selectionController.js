System.register(['./utils', "./context/context", "./logger", "./eventService", "./events", "./gridOptionsWrapper", "./constants"], function(exports_1, context_1) {
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
    var utils_1, context_2, context_3, logger_1, eventService_1, events_1, context_4, gridOptionsWrapper_1, context_5, constants_1;
    var SelectionController;
    return {
        setters:[
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (context_2_1) {
                context_2 = context_2_1;
                context_3 = context_2_1;
                context_4 = context_2_1;
                context_5 = context_2_1;
            },
            function (logger_1_1) {
                logger_1 = logger_1_1;
            },
            function (eventService_1_1) {
                eventService_1 = eventService_1_1;
            },
            function (events_1_1) {
                events_1 = events_1_1;
            },
            function (gridOptionsWrapper_1_1) {
                gridOptionsWrapper_1 = gridOptionsWrapper_1_1;
            },
            function (constants_1_1) {
                constants_1 = constants_1_1;
            }],
        execute: function() {
            let SelectionController = class SelectionController {
                setBeans(loggerFactory) {
                    this.logger = loggerFactory.create('SelectionController');
                    this.reset();
                    if (this.gridOptionsWrapper.isRowModelDefault()) {
                        this.eventService.addEventListener(events_1.Events.EVENT_ROW_DATA_CHANGED, this.reset.bind(this));
                    }
                    else {
                        this.logger.log('dont know what to do here');
                    }
                }
                init() {
                    this.eventService.addEventListener(events_1.Events.EVENT_ROW_SELECTED, this.onRowSelected.bind(this));
                }
                getSelectedNodes() {
                    var selectedNodes = [];
                    utils_1.Utils.iterateObject(this.selectedNodes, (key, rowNode) => {
                        if (rowNode) {
                            selectedNodes.push(rowNode);
                        }
                    });
                    return selectedNodes;
                }
                getSelectedRows() {
                    var selectedRows = [];
                    utils_1.Utils.iterateObject(this.selectedNodes, (key, rowNode) => {
                        if (rowNode) {
                            selectedRows.push(rowNode.data);
                        }
                    });
                    return selectedRows;
                }
                removeGroupsFromSelection() {
                    utils_1.Utils.iterateObject(this.selectedNodes, (key, rowNode) => {
                        if (rowNode && rowNode.group) {
                            this.selectedNodes[rowNode.id] = undefined;
                        }
                    });
                }
                // should only be called if groupSelectsChildren=true
                updateGroupsFromChildrenSelections() {
                    if (this.rowModel.getType() !== constants_1.Constants.ROW_MODEL_TYPE_NORMAL) {
                        console.warn('updateGroupsFromChildrenSelections not available when rowModel is not normal');
                    }
                    var inMemoryRowModel = this.rowModel;
                    inMemoryRowModel.getTopLevelNodes().forEach((rowNode) => {
                        rowNode.deptFirstSearch((rowNode) => {
                            if (rowNode.group) {
                                rowNode.calculateSelectedFromChildren();
                            }
                        });
                    });
                }
                getNodeForIdIfSelected(id) {
                    return this.selectedNodes[id];
                }
                clearOtherNodes(rowNodeToKeepSelected) {
                    utils_1.Utils.iterateObject(this.selectedNodes, (key, otherRowNode) => {
                        if (otherRowNode && otherRowNode.id !== rowNodeToKeepSelected.id) {
                            this.selectedNodes[otherRowNode.id].setSelected(false, false, true);
                        }
                    });
                }
                onRowSelected(event) {
                    var rowNode = event.node;
                    if (rowNode.isSelected()) {
                        this.selectedNodes[rowNode.id] = rowNode;
                    }
                    else {
                        this.selectedNodes[rowNode.id] = undefined;
                    }
                }
                syncInRowNode(rowNode) {
                    if (this.selectedNodes[rowNode.id] !== undefined) {
                        rowNode.setSelectedInitialValue(true);
                        this.selectedNodes[rowNode.id] = rowNode;
                    }
                }
                reset() {
                    this.logger.log('reset');
                    this.selectedNodes = {};
                }
                // returns a list of all nodes at 'best cost' - a feature to be used
                // with groups / trees. if a group has all it's children selected,
                // then the group appears in the result, but not the children.
                // Designed for use with 'children' as the group selection type,
                // where groups don't actually appear in the selection normally.
                getBestCostNodeSelection() {
                    if (this.rowModel.getType() !== constants_1.Constants.ROW_MODEL_TYPE_NORMAL) {
                        console.warn('getBestCostNodeSelection is only avilable when using normal row model');
                    }
                    var inMemoryRowModel = this.rowModel;
                    var topLevelNodes = inMemoryRowModel.getTopLevelNodes();
                    if (topLevelNodes === null) {
                        console.warn('selectAll not available doing rowModel=virtual');
                        return;
                    }
                    var result = [];
                    // recursive function, to find the selected nodes
                    function traverse(nodes) {
                        for (var i = 0, l = nodes.length; i < l; i++) {
                            var node = nodes[i];
                            if (node.isSelected()) {
                                result.push(node);
                            }
                            else {
                                // if not selected, then if it's a group, and the group
                                // has children, continue to search for selections
                                if (node.group && node.children) {
                                    traverse(node.children);
                                }
                            }
                        }
                    }
                    traverse(topLevelNodes);
                    return result;
                }
                setRowModel(rowModel) {
                    this.rowModel = rowModel;
                }
                isEmpty() {
                    var count = 0;
                    utils_1.Utils.iterateObject(this.selectedNodes, (nodeId, rowNode) => {
                        if (rowNode) {
                            count++;
                        }
                    });
                    return count === 0;
                }
                deselectAllRowNodes() {
                    utils_1.Utils.iterateObject(this.selectedNodes, (nodeId, rowNode) => {
                        if (rowNode) {
                            rowNode.selectThisNode(false);
                        }
                    });
                    // we should not have to do this, as deselecting the nodes fires events
                    // that we pick up, however it's good to clean it down, as we are still
                    // left with entries pointing to 'undefined'
                    this.selectedNodes = {};
                    this.eventService.dispatchEvent(events_1.Events.EVENT_SELECTION_CHANGED);
                }
                selectAllRowNodes() {
                    if (this.rowModel.getType() !== constants_1.Constants.ROW_MODEL_TYPE_NORMAL) {
                        throw 'selectAll only available with norma row model, ie not virtual pagination';
                    }
                    this.rowModel.forEachNode((rowNode) => {
                        rowNode.setSelected(true, false, true);
                    });
                    this.eventService.dispatchEvent(events_1.Events.EVENT_SELECTION_CHANGED);
                }
                // Deprecated method
                selectNode(rowNode, tryMulti, suppressEvents) {
                    rowNode.setSelected(true, !tryMulti, suppressEvents);
                }
                // Deprecated method
                deselectIndex(rowIndex, suppressEvents = false) {
                    var node = this.rowModel.getRow(rowIndex);
                    this.deselectNode(node, suppressEvents);
                }
                // Deprecated method
                deselectNode(rowNode, suppressEvents = false) {
                    rowNode.setSelected(false, false, suppressEvents);
                }
                // Deprecated method
                selectIndex(index, tryMulti, suppressEvents = false) {
                    var node = this.rowModel.getRow(index);
                    this.selectNode(node, tryMulti, suppressEvents);
                }
            };
            __decorate([
                context_4.Autowired('eventService'), 
                __metadata('design:type', eventService_1.EventService)
            ], SelectionController.prototype, "eventService", void 0);
            __decorate([
                context_4.Autowired('rowModel'), 
                __metadata('design:type', Object)
            ], SelectionController.prototype, "rowModel", void 0);
            __decorate([
                context_4.Autowired('gridOptionsWrapper'), 
                __metadata('design:type', gridOptionsWrapper_1.GridOptionsWrapper)
            ], SelectionController.prototype, "gridOptionsWrapper", void 0);
            __decorate([
                __param(0, context_3.Qualifier('loggerFactory')), 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', [logger_1.LoggerFactory]), 
                __metadata('design:returntype', void 0)
            ], SelectionController.prototype, "setBeans", null);
            __decorate([
                context_5.PostConstruct, 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], SelectionController.prototype, "init", null);
            SelectionController = __decorate([
                context_2.Bean('selectionController'), 
                __metadata('design:paramtypes', [])
            ], SelectionController);
            exports_1("SelectionController", SelectionController);
        }
    }
});
//# sourceMappingURL=selectionController.js.map