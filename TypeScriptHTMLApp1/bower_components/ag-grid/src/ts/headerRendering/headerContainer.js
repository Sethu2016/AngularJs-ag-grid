System.register(['../utils', "../entities/columnGroup", "../gridOptionsWrapper", "../context/context", "../entities/column", "./renderedHeaderGroupCell", "./renderedHeaderCell", "../dragAndDrop/dragAndDropService", "./moveColumnController", "../columnController/columnController", "../gridPanel/gridPanel"], function(exports_1, context_1) {
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
    var utils_1, columnGroup_1, gridOptionsWrapper_1, context_2, column_1, context_3, renderedHeaderGroupCell_1, renderedHeaderCell_1, dragAndDropService_1, moveColumnController_1, columnController_1, gridPanel_1, context_4;
    var HeaderContainer;
    return {
        setters:[
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (columnGroup_1_1) {
                columnGroup_1 = columnGroup_1_1;
            },
            function (gridOptionsWrapper_1_1) {
                gridOptionsWrapper_1 = gridOptionsWrapper_1_1;
            },
            function (context_2_1) {
                context_2 = context_2_1;
                context_3 = context_2_1;
                context_4 = context_2_1;
            },
            function (column_1_1) {
                column_1 = column_1_1;
            },
            function (renderedHeaderGroupCell_1_1) {
                renderedHeaderGroupCell_1 = renderedHeaderGroupCell_1_1;
            },
            function (renderedHeaderCell_1_1) {
                renderedHeaderCell_1 = renderedHeaderCell_1_1;
            },
            function (dragAndDropService_1_1) {
                dragAndDropService_1 = dragAndDropService_1_1;
            },
            function (moveColumnController_1_1) {
                moveColumnController_1 = moveColumnController_1_1;
            },
            function (columnController_1_1) {
                columnController_1 = columnController_1_1;
            },
            function (gridPanel_1_1) {
                gridPanel_1 = gridPanel_1_1;
            }],
        execute: function() {
            class HeaderContainer {
                constructor(eContainer, eViewport, eRoot, pinned) {
                    this.headerElements = [];
                    this.eContainer = eContainer;
                    this.eRoot = eRoot;
                    this.pinned = pinned;
                    this.eViewport = eViewport;
                }
                init() {
                    var moveColumnController = new moveColumnController_1.MoveColumnController(this.pinned);
                    this.context.wireBean(moveColumnController);
                    var secondaryContainers;
                    switch (this.pinned) {
                        case column_1.Column.PINNED_LEFT:
                            secondaryContainers = this.gridPanel.getDropTargetLeftContainers();
                            break;
                        case column_1.Column.PINNED_RIGHT:
                            secondaryContainers = this.gridPanel.getDropTargetPinnedRightContainers();
                            break;
                        default:
                            secondaryContainers = this.gridPanel.getDropTargetBodyContainers();
                            break;
                    }
                    var icon = this.pinned ? dragAndDropService_1.DragAndDropService.ICON_PINNED : dragAndDropService_1.DragAndDropService.ICON_MOVE;
                    this.dropTarget = {
                        eContainer: this.eViewport ? this.eViewport : this.eContainer,
                        iconName: icon,
                        eSecondaryContainers: secondaryContainers,
                        onDragging: moveColumnController.onDragging.bind(moveColumnController),
                        onDragEnter: moveColumnController.onDragEnter.bind(moveColumnController),
                        onDragLeave: moveColumnController.onDragLeave.bind(moveColumnController),
                        onDragStop: moveColumnController.onDragStop.bind(moveColumnController)
                    };
                    this.dragAndDropService.addDropTarget(this.dropTarget);
                }
                removeAllChildren() {
                    this.headerElements.forEach((headerElement) => {
                        headerElement.destroy();
                    });
                    this.headerElements.length = 0;
                    utils_1.Utils.removeAllChildren(this.eContainer);
                }
                insertHeaderRowsIntoContainer() {
                    var cellTree = this.columnController.getDisplayedColumnGroups(this.pinned);
                    // if we are displaying header groups, then we have many rows here.
                    // go through each row of the header, one by one.
                    var rowHeight = this.gridOptionsWrapper.getHeaderHeight();
                    for (var dept = 0;; dept++) {
                        var nodesAtDept = [];
                        this.addTreeNodesAtDept(cellTree, dept, nodesAtDept);
                        // we want to break the for loop when we get to an empty set of cells,
                        // that's how we know we have finished rendering the last row.
                        if (nodesAtDept.length === 0) {
                            break;
                        }
                        var eRow = document.createElement('div');
                        eRow.className = 'ag-header-row';
                        eRow.style.top = (dept * rowHeight) + 'px';
                        eRow.style.height = rowHeight + 'px';
                        nodesAtDept.forEach((child) => {
                            // skip groups that have no displayed children. this can happen when the group is broken,
                            // and this section happens to have nothing to display for the open / closed state
                            if (child instanceof columnGroup_1.ColumnGroup && child.getDisplayedChildren().length == 0) {
                                return;
                            }
                            var renderedHeaderElement = this.createHeaderElement(child);
                            this.headerElements.push(renderedHeaderElement);
                            var eGui = renderedHeaderElement.getGui();
                            eRow.appendChild(eGui);
                        });
                        this.eContainer.appendChild(eRow);
                    }
                }
                addTreeNodesAtDept(cellTree, dept, result) {
                    cellTree.forEach((abstractColumn) => {
                        if (dept === 0) {
                            result.push(abstractColumn);
                        }
                        else if (abstractColumn instanceof columnGroup_1.ColumnGroup) {
                            var columnGroup = abstractColumn;
                            this.addTreeNodesAtDept(columnGroup.getDisplayedChildren(), dept - 1, result);
                        }
                        else {
                        }
                    });
                }
                createHeaderElement(columnGroupChild) {
                    var result;
                    if (columnGroupChild instanceof columnGroup_1.ColumnGroup) {
                        result = new renderedHeaderGroupCell_1.RenderedHeaderGroupCell(columnGroupChild, this.eRoot, this.$scope, this.dropTarget);
                    }
                    else {
                        result = new renderedHeaderCell_1.RenderedHeaderCell(columnGroupChild, this.$scope, this.eRoot, this.dropTarget);
                    }
                    this.context.wireBean(result);
                    return result;
                }
                onIndividualColumnResized(column) {
                    this.headerElements.forEach((headerElement) => {
                        headerElement.onIndividualColumnResized(column);
                    });
                }
            }
            __decorate([
                context_2.Autowired('gridOptionsWrapper'), 
                __metadata('design:type', gridOptionsWrapper_1.GridOptionsWrapper)
            ], HeaderContainer.prototype, "gridOptionsWrapper", void 0);
            __decorate([
                context_2.Autowired('context'), 
                __metadata('design:type', context_3.Context)
            ], HeaderContainer.prototype, "context", void 0);
            __decorate([
                context_2.Autowired('$scope'), 
                __metadata('design:type', Object)
            ], HeaderContainer.prototype, "$scope", void 0);
            __decorate([
                context_2.Autowired('dragAndDropService'), 
                __metadata('design:type', dragAndDropService_1.DragAndDropService)
            ], HeaderContainer.prototype, "dragAndDropService", void 0);
            __decorate([
                context_2.Autowired('columnController'), 
                __metadata('design:type', columnController_1.ColumnController)
            ], HeaderContainer.prototype, "columnController", void 0);
            __decorate([
                context_2.Autowired('gridPanel'), 
                __metadata('design:type', gridPanel_1.GridPanel)
            ], HeaderContainer.prototype, "gridPanel", void 0);
            __decorate([
                context_4.PostConstruct, 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], HeaderContainer.prototype, "init", null);
            exports_1("HeaderContainer", HeaderContainer);
        }
    }
});
//# sourceMappingURL=headerContainer.js.map