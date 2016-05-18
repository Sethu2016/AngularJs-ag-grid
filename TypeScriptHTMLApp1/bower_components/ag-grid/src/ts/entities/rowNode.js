System.register(["../eventService", "../events", "../gridOptionsWrapper", "../selectionController", "../valueService", "../columnController/columnController", "../context/context"], function(exports_1, context_1) {
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
    var eventService_1, events_1, gridOptionsWrapper_1, selectionController_1, valueService_1, columnController_1, context_2;
    var RowNode;
    return {
        setters:[
            function (eventService_1_1) {
                eventService_1 = eventService_1_1;
            },
            function (events_1_1) {
                events_1 = events_1_1;
            },
            function (gridOptionsWrapper_1_1) {
                gridOptionsWrapper_1 = gridOptionsWrapper_1_1;
            },
            function (selectionController_1_1) {
                selectionController_1 = selectionController_1_1;
            },
            function (valueService_1_1) {
                valueService_1 = valueService_1_1;
            },
            function (columnController_1_1) {
                columnController_1 = columnController_1_1;
            },
            function (context_2_1) {
                context_2 = context_2_1;
            }],
        execute: function() {
            class RowNode {
                constructor() {
                    this.selected = false;
                }
                setData(data) {
                    var oldData = this.data;
                    this.data = data;
                    var event = { oldData: oldData, newData: data };
                    this.dispatchLocalEvent(RowNode.EVENT_DATA_CHANGED, event);
                }
                dispatchLocalEvent(eventName, event) {
                    if (this.eventService) {
                        this.eventService.dispatchEvent(eventName, event);
                    }
                }
                // we also allow editing the value via the editors. when it is done via
                // the editors, no 'cell changed' event gets fired, as it's assumed that
                // the cell knows about the change given it's in charge of the editing.
                // this method is for the client to call, so the cell listens for the change
                // event, and also flashes the cell when the change occurs.
                setDataValue(colKey, newValue) {
                    var column = this.columnController.getColumn(colKey);
                    this.valueService.setValue(this, column, newValue);
                    var event = { column: column, newValue: newValue };
                    this.dispatchLocalEvent(RowNode.EVENT_CELL_CHANGED, event);
                }
                resetQuickFilterAggregateText() {
                    this.quickFilterAggregateText = null;
                }
                isSelected() {
                    // for footers, we just return what our sibling selected state is, as cannot select a footer
                    if (this.footer) {
                        return this.sibling.isSelected();
                    }
                    return this.selected;
                }
                deptFirstSearch(callback) {
                    if (this.children) {
                        this.children.forEach(child => child.deptFirstSearch(callback));
                    }
                    callback(this);
                }
                // + rowController.updateGroupsInSelection()
                calculateSelectedFromChildren() {
                    var atLeastOneSelected = false;
                    var atLeastOneDeSelected = false;
                    var atLeastOneMixed = false;
                    var newSelectedValue;
                    if (this.children) {
                        for (var i = 0; i < this.children.length; i++) {
                            var childState = this.children[i].isSelected();
                            switch (childState) {
                                case true:
                                    atLeastOneSelected = true;
                                    break;
                                case false:
                                    atLeastOneDeSelected = true;
                                    break;
                                default:
                                    atLeastOneMixed = true;
                                    break;
                            }
                        }
                    }
                    if (atLeastOneMixed) {
                        newSelectedValue = undefined;
                    }
                    else if (atLeastOneSelected && !atLeastOneDeSelected) {
                        newSelectedValue = true;
                    }
                    else if (!atLeastOneSelected && atLeastOneDeSelected) {
                        newSelectedValue = false;
                    }
                    else {
                        newSelectedValue = undefined;
                    }
                    this.selectThisNode(newSelectedValue);
                }
                calculateSelectedFromChildrenBubbleUp() {
                    this.calculateSelectedFromChildren();
                    if (this.parent) {
                        this.parent.calculateSelectedFromChildren();
                    }
                }
                setSelectedInitialValue(selected) {
                    this.selected = selected;
                }
                /** Returns true if this row is selected */
                setSelected(newValue, clearSelection = false, tailingNodeInSequence = false) {
                    if (this.floating) {
                        console.log('ag-Grid: cannot select floating rows');
                        return;
                    }
                    // if we are a footer, we don't do selection, just pass the info
                    // to the sibling (the parent of the group)
                    if (this.footer) {
                        this.sibling.setSelected(newValue, clearSelection, tailingNodeInSequence);
                        return;
                    }
                    this.selectThisNode(newValue);
                    var groupSelectsChildren = this.gridOptionsWrapper.isGroupSelectsChildren();
                    if (groupSelectsChildren && this.group) {
                        this.selectChildNodes(newValue);
                    }
                    // clear other nodes if not doing multi select
                    var actionWasOnThisNode = !tailingNodeInSequence;
                    if (actionWasOnThisNode) {
                        if (newValue && (clearSelection || !this.gridOptionsWrapper.isRowSelectionMulti())) {
                            this.selectionController.clearOtherNodes(this);
                        }
                        if (groupSelectsChildren && this.parent) {
                            this.parent.calculateSelectedFromChildrenBubbleUp();
                        }
                        // this is the very end of the 'action node', so we are finished all the updates,
                        // include any parent / child changes that this method caused
                        this.mainEventService.dispatchEvent(events_1.Events.EVENT_SELECTION_CHANGED);
                    }
                }
                selectThisNode(newValue) {
                    if (this.selected !== newValue) {
                        this.selected = newValue;
                        if (this.eventService) {
                            this.dispatchLocalEvent(RowNode.EVENT_ROW_SELECTED);
                        }
                        var event = { node: this };
                        this.mainEventService.dispatchEvent(events_1.Events.EVENT_ROW_SELECTED, event);
                    }
                }
                selectChildNodes(newValue) {
                    for (var i = 0; i < this.children.length; i++) {
                        this.children[i].setSelected(newValue, false, true);
                    }
                }
                addEventListener(eventType, listener) {
                    if (!this.eventService) {
                        this.eventService = new eventService_1.EventService();
                    }
                    this.eventService.addEventListener(eventType, listener);
                }
                removeEventListener(eventType, listener) {
                    this.eventService.removeEventListener(eventType, listener);
                }
            }
            RowNode.EVENT_ROW_SELECTED = 'rowSelected';
            RowNode.EVENT_DATA_CHANGED = 'dataChanged';
            RowNode.EVENT_CELL_CHANGED = 'cellChanged';
            __decorate([
                context_2.Autowired('eventService'), 
                __metadata('design:type', eventService_1.EventService)
            ], RowNode.prototype, "mainEventService", void 0);
            __decorate([
                context_2.Autowired('gridOptionsWrapper'), 
                __metadata('design:type', gridOptionsWrapper_1.GridOptionsWrapper)
            ], RowNode.prototype, "gridOptionsWrapper", void 0);
            __decorate([
                context_2.Autowired('selectionController'), 
                __metadata('design:type', selectionController_1.SelectionController)
            ], RowNode.prototype, "selectionController", void 0);
            __decorate([
                context_2.Autowired('columnController'), 
                __metadata('design:type', columnController_1.ColumnController)
            ], RowNode.prototype, "columnController", void 0);
            __decorate([
                context_2.Autowired('valueService'), 
                __metadata('design:type', valueService_1.ValueService)
            ], RowNode.prototype, "valueService", void 0);
            exports_1("RowNode", RowNode);
        }
    }
});
//# sourceMappingURL=rowNode.js.map