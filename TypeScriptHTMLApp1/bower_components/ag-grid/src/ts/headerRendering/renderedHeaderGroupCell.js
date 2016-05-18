System.register(["../utils", "../svgFactory", "../columnController/columnController", "../filter/filterManager", "../gridOptionsWrapper", "../entities/column", "./horizontalDragService", "../context/context", "./cssClassApplier", "../dragAndDrop/dragAndDropService"], function(exports_1, context_1) {
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
    var utils_1, svgFactory_1, columnController_1, filterManager_1, gridOptionsWrapper_1, column_1, horizontalDragService_1, context_2, cssClassApplier_1, dragAndDropService_1;
    var svgFactory, RenderedHeaderGroupCell;
    return {
        setters:[
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (svgFactory_1_1) {
                svgFactory_1 = svgFactory_1_1;
            },
            function (columnController_1_1) {
                columnController_1 = columnController_1_1;
            },
            function (filterManager_1_1) {
                filterManager_1 = filterManager_1_1;
            },
            function (gridOptionsWrapper_1_1) {
                gridOptionsWrapper_1 = gridOptionsWrapper_1_1;
            },
            function (column_1_1) {
                column_1 = column_1_1;
            },
            function (horizontalDragService_1_1) {
                horizontalDragService_1 = horizontalDragService_1_1;
            },
            function (context_2_1) {
                context_2 = context_2_1;
            },
            function (cssClassApplier_1_1) {
                cssClassApplier_1 = cssClassApplier_1_1;
            },
            function (dragAndDropService_1_1) {
                dragAndDropService_1 = dragAndDropService_1_1;
            }],
        execute: function() {
            svgFactory = svgFactory_1.SvgFactory.getInstance();
            class RenderedHeaderGroupCell {
                constructor(columnGroup, eRoot, parentScope, dragSourceDropTarget) {
                    this.destroyFunctions = [];
                    this.columnGroup = columnGroup;
                    this.parentScope = parentScope;
                    this.eRoot = eRoot;
                    this.parentScope = parentScope;
                    this.dragSourceDropTarget = dragSourceDropTarget;
                }
                getGui() {
                    return this.eHeaderGroupCell;
                }
                onIndividualColumnResized(column) {
                    if (this.columnGroup.isChildInThisGroupDeepSearch(column)) {
                        this.setWidth();
                    }
                }
                init() {
                    this.eHeaderGroupCell = document.createElement('div');
                    cssClassApplier_1.CssClassApplier.addHeaderClassesFromCollDef(this.columnGroup.getColGroupDef(), this.eHeaderGroupCell, this.gridOptionsWrapper);
                    this.setupResize();
                    this.addClasses();
                    this.setupLabel();
                    // this.setupMove();
                    this.setWidth();
                }
                setupLabel() {
                    // no renderer, default text render
                    var groupName = this.columnGroup.getHeaderName();
                    if (groupName && groupName !== '') {
                        var eGroupCellLabel = document.createElement("div");
                        eGroupCellLabel.className = 'ag-header-group-cell-label';
                        this.eHeaderGroupCell.appendChild(eGroupCellLabel);
                        if (utils_1.Utils.isBrowserSafari()) {
                            eGroupCellLabel.style.display = 'table-cell';
                        }
                        var eInnerText = document.createElement("span");
                        eInnerText.className = 'ag-header-group-text';
                        eInnerText.innerHTML = groupName;
                        eGroupCellLabel.appendChild(eInnerText);
                        if (this.columnGroup.isExpandable()) {
                            this.addGroupExpandIcon(eGroupCellLabel);
                        }
                    }
                }
                addClasses() {
                    utils_1.Utils.addCssClass(this.eHeaderGroupCell, 'ag-header-group-cell');
                    // having different classes below allows the style to not have a bottom border
                    // on the group header, if no group is specified
                    if (this.columnGroup.getColGroupDef()) {
                        utils_1.Utils.addCssClass(this.eHeaderGroupCell, 'ag-header-group-cell-with-group');
                    }
                    else {
                        utils_1.Utils.addCssClass(this.eHeaderGroupCell, 'ag-header-group-cell-no-group');
                    }
                }
                setupResize() {
                    if (!this.gridOptionsWrapper.isEnableColResize()) {
                        return;
                    }
                    this.eHeaderCellResize = document.createElement("div");
                    this.eHeaderCellResize.className = "ag-header-cell-resize";
                    this.eHeaderGroupCell.appendChild(this.eHeaderCellResize);
                    this.dragService.addDragHandling({
                        eDraggableElement: this.eHeaderCellResize,
                        eBody: this.eRoot,
                        cursor: 'col-resize',
                        startAfterPixels: 0,
                        onDragStart: this.onDragStart.bind(this),
                        onDragging: this.onDragging.bind(this)
                    });
                    if (!this.gridOptionsWrapper.isSuppressAutoSize()) {
                        this.eHeaderCellResize.addEventListener('dblclick', (event) => {
                            // get list of all the column keys we are responsible for
                            var keys = [];
                            this.columnGroup.getDisplayedLeafColumns().forEach((column) => {
                                // not all cols in the group may be participating with auto-resize
                                if (!column.getColDef().suppressAutoSize) {
                                    keys.push(column.getColId());
                                }
                            });
                            if (keys.length > 0) {
                                this.columnController.autoSizeColumns(keys);
                            }
                        });
                    }
                }
                setupMove() {
                    var eLabel = this.eHeaderGroupCell.querySelector('.ag-header-group-cell-label');
                    if (!eLabel) {
                        return;
                    }
                    if (this.gridOptionsWrapper.isSuppressMovableColumns()) {
                        return;
                    }
                    // if any child is fixed, then don't allow moving
                    var atLeastOneChildNotMovable = false;
                    this.columnGroup.getLeafColumns().forEach((column) => {
                        if (column.getColDef().suppressMovable) {
                            atLeastOneChildNotMovable = true;
                        }
                    });
                    if (atLeastOneChildNotMovable) {
                        return;
                    }
                    // don't allow moving of headers when forPrint, as the header overlay doesn't exist
                    if (this.gridOptionsWrapper.isForPrint()) {
                        return;
                    }
                    if (eLabel) {
                        var dragSource = {
                            eElement: eLabel,
                            dragItem: this.columnGroup,
                            dragSourceDropTarget: this.dragSourceDropTarget
                        };
                        this.dragAndDropService.addDragSource(dragSource);
                    }
                }
                setWidth() {
                    var widthChangedListener = () => {
                        this.eHeaderGroupCell.style.width = this.columnGroup.getActualWidth() + 'px';
                    };
                    this.columnGroup.getLeafColumns().forEach(column => {
                        column.addEventListener(column_1.Column.EVENT_WIDTH_CHANGED, widthChangedListener);
                        this.destroyFunctions.push(() => {
                            column.removeEventListener(column_1.Column.EVENT_WIDTH_CHANGED, widthChangedListener);
                        });
                    });
                    widthChangedListener();
                }
                destroy() {
                    this.destroyFunctions.forEach((func) => {
                        func();
                    });
                }
                addGroupExpandIcon(eGroupCellLabel) {
                    var eGroupIcon;
                    if (this.columnGroup.isExpanded()) {
                        eGroupIcon = utils_1.Utils.createIcon('columnGroupOpened', this.gridOptionsWrapper, null, svgFactory.createArrowLeftSvg);
                    }
                    else {
                        eGroupIcon = utils_1.Utils.createIcon('columnGroupClosed', this.gridOptionsWrapper, null, svgFactory.createArrowRightSvg);
                    }
                    eGroupIcon.className = 'ag-header-expand-icon';
                    eGroupCellLabel.appendChild(eGroupIcon);
                    var that = this;
                    eGroupIcon.onclick = function () {
                        var newExpandedValue = !that.columnGroup.isExpanded();
                        that.columnController.setColumnGroupOpened(that.columnGroup, newExpandedValue);
                    };
                }
                onDragStart() {
                    this.groupWidthStart = this.columnGroup.getActualWidth();
                    this.childrenWidthStarts = [];
                    this.columnGroup.getDisplayedLeafColumns().forEach((column) => {
                        this.childrenWidthStarts.push(column.getActualWidth());
                    });
                }
                onDragging(dragChange, finished) {
                    var newWidth = this.groupWidthStart + dragChange;
                    var minWidth = this.columnGroup.getMinWidth();
                    if (newWidth < minWidth) {
                        newWidth = minWidth;
                    }
                    // distribute the new width to the child headers
                    var changeRatio = newWidth / this.groupWidthStart;
                    // keep track of pixels used, and last column gets the remaining,
                    // to cater for rounding errors, and min width adjustments
                    var pixelsToDistribute = newWidth;
                    var displayedColumns = this.columnGroup.getDisplayedLeafColumns();
                    displayedColumns.forEach((column, index) => {
                        var notLastCol = index !== (displayedColumns.length - 1);
                        var newChildSize;
                        if (notLastCol) {
                            // if not the last col, calculate the column width as normal
                            var startChildSize = this.childrenWidthStarts[index];
                            newChildSize = startChildSize * changeRatio;
                            if (newChildSize < column.getMinWidth()) {
                                newChildSize = column.getMinWidth();
                            }
                            pixelsToDistribute -= newChildSize;
                        }
                        else {
                            // if last col, give it the remaining pixels
                            newChildSize = pixelsToDistribute;
                        }
                        this.columnController.setColumnWidth(column, newChildSize, finished);
                    });
                }
            }
            __decorate([
                context_2.Autowired('filterManager'), 
                __metadata('design:type', filterManager_1.FilterManager)
            ], RenderedHeaderGroupCell.prototype, "filterManager", void 0);
            __decorate([
                context_2.Autowired('gridOptionsWrapper'), 
                __metadata('design:type', gridOptionsWrapper_1.GridOptionsWrapper)
            ], RenderedHeaderGroupCell.prototype, "gridOptionsWrapper", void 0);
            __decorate([
                context_2.Autowired('horizontalDragService'), 
                __metadata('design:type', horizontalDragService_1.HorizontalDragService)
            ], RenderedHeaderGroupCell.prototype, "dragService", void 0);
            __decorate([
                context_2.Autowired('columnController'), 
                __metadata('design:type', columnController_1.ColumnController)
            ], RenderedHeaderGroupCell.prototype, "columnController", void 0);
            __decorate([
                context_2.Autowired('dragAndDropService'), 
                __metadata('design:type', dragAndDropService_1.DragAndDropService)
            ], RenderedHeaderGroupCell.prototype, "dragAndDropService", void 0);
            __decorate([
                context_2.PostConstruct, 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], RenderedHeaderGroupCell.prototype, "init", null);
            exports_1("RenderedHeaderGroupCell", RenderedHeaderGroupCell);
        }
    }
});
//# sourceMappingURL=renderedHeaderGroupCell.js.map