System.register(["../../context/context", "../../entities/rowNode", "../../utils", "../../gridOptionsWrapper", "../../selectionController", "../../eventService"], function(exports_1, context_1) {
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
    var context_2, rowNode_1, utils_1, gridOptionsWrapper_1, selectionController_1, eventService_1;
    var FlattenStage;
    return {
        setters:[
            function (context_2_1) {
                context_2 = context_2_1;
            },
            function (rowNode_1_1) {
                rowNode_1 = rowNode_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (gridOptionsWrapper_1_1) {
                gridOptionsWrapper_1 = gridOptionsWrapper_1_1;
            },
            function (selectionController_1_1) {
                selectionController_1 = selectionController_1_1;
            },
            function (eventService_1_1) {
                eventService_1 = eventService_1_1;
            }],
        execute: function() {
            let FlattenStage = class FlattenStage {
                execute(rowsToFlatten) {
                    // even if not doing grouping, we do the mapping, as the client might
                    // of passed in data that already has a grouping in it somewhere
                    var result = [];
                    // putting value into a wrapper so it's passed by reference
                    var nextRowTop = { value: 0 };
                    this.recursivelyAddToRowsToDisplay(rowsToFlatten, result, nextRowTop);
                    return result;
                }
                recursivelyAddToRowsToDisplay(rowsToFlatten, result, nextRowTop) {
                    if (utils_1.Utils.missingOrEmpty(rowsToFlatten)) {
                        return;
                    }
                    var groupSuppressRow = this.gridOptionsWrapper.isGroupSuppressRow();
                    for (var i = 0; i < rowsToFlatten.length; i++) {
                        var rowNode = rowsToFlatten[i];
                        var skipGroupNode = groupSuppressRow && rowNode.group;
                        if (!skipGroupNode) {
                            this.addRowNodeToRowsToDisplay(rowNode, result, nextRowTop);
                        }
                        if (rowNode.group && rowNode.expanded) {
                            this.recursivelyAddToRowsToDisplay(rowNode.childrenAfterSort, result, nextRowTop);
                            // put a footer in if user is looking for it
                            if (this.gridOptionsWrapper.isGroupIncludeFooter()) {
                                var footerNode = this.createFooterNode(rowNode);
                                this.addRowNodeToRowsToDisplay(footerNode, result, nextRowTop);
                            }
                        }
                    }
                }
                // duplicated method, it's also in floatingRowModel
                addRowNodeToRowsToDisplay(rowNode, result, nextRowTop) {
                    result.push(rowNode);
                    rowNode.rowHeight = this.gridOptionsWrapper.getRowHeightForNode(rowNode);
                    rowNode.rowTop = nextRowTop.value;
                    nextRowTop.value += rowNode.rowHeight;
                }
                createFooterNode(groupNode) {
                    var footerNode = new rowNode_1.RowNode();
                    this.context.wireBean(footerNode);
                    Object.keys(groupNode).forEach(function (key) {
                        footerNode[key] = groupNode[key];
                    });
                    footerNode.footer = true;
                    // get both header and footer to reference each other as siblings. this is never undone,
                    // only overwritten. so if a group is expanded, then contracted, it will have a ghost
                    // sibling - but that's fine, as we can ignore this if the header is contracted.
                    footerNode.sibling = groupNode;
                    groupNode.sibling = footerNode;
                    return footerNode;
                }
            };
            __decorate([
                context_2.Autowired('gridOptionsWrapper'), 
                __metadata('design:type', gridOptionsWrapper_1.GridOptionsWrapper)
            ], FlattenStage.prototype, "gridOptionsWrapper", void 0);
            __decorate([
                context_2.Autowired('selectionController'), 
                __metadata('design:type', selectionController_1.SelectionController)
            ], FlattenStage.prototype, "selectionController", void 0);
            __decorate([
                context_2.Autowired('eventService'), 
                __metadata('design:type', eventService_1.EventService)
            ], FlattenStage.prototype, "eventService", void 0);
            __decorate([
                context_2.Autowired('context'), 
                __metadata('design:type', context_2.Context)
            ], FlattenStage.prototype, "context", void 0);
            FlattenStage = __decorate([
                context_2.Bean('flattenStage'), 
                __metadata('design:paramtypes', [])
            ], FlattenStage);
            exports_1("FlattenStage", FlattenStage);
        }
    }
});
//# sourceMappingURL=flattenStage.js.map