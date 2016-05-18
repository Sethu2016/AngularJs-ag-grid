System.register(["../utils", "../entities/column", "../filter/filterManager", "../columnController/columnController", "./headerTemplateLoader", "../gridOptionsWrapper", "./horizontalDragService", "../gridCore", "../context/context", "./cssClassApplier", "../dragAndDrop/dragAndDropService", "../sortController"], function(exports_1, context_1) {
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
    var utils_1, column_1, filterManager_1, columnController_1, headerTemplateLoader_1, gridOptionsWrapper_1, horizontalDragService_1, gridCore_1, context_2, cssClassApplier_1, dragAndDropService_1, sortController_1;
    var RenderedHeaderCell;
    return {
        setters:[
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (column_1_1) {
                column_1 = column_1_1;
            },
            function (filterManager_1_1) {
                filterManager_1 = filterManager_1_1;
            },
            function (columnController_1_1) {
                columnController_1 = columnController_1_1;
            },
            function (headerTemplateLoader_1_1) {
                headerTemplateLoader_1 = headerTemplateLoader_1_1;
            },
            function (gridOptionsWrapper_1_1) {
                gridOptionsWrapper_1 = gridOptionsWrapper_1_1;
            },
            function (horizontalDragService_1_1) {
                horizontalDragService_1 = horizontalDragService_1_1;
            },
            function (gridCore_1_1) {
                gridCore_1 = gridCore_1_1;
            },
            function (context_2_1) {
                context_2 = context_2_1;
            },
            function (cssClassApplier_1_1) {
                cssClassApplier_1 = cssClassApplier_1_1;
            },
            function (dragAndDropService_1_1) {
                dragAndDropService_1 = dragAndDropService_1_1;
            },
            function (sortController_1_1) {
                sortController_1 = sortController_1_1;
            }],
        execute: function() {
            class RenderedHeaderCell {
                constructor(column, parentScope, eRoot, dragSourceDropTarget) {
                    // for better structured code, anything we need to do when this column gets destroyed,
                    // we put a function in here. otherwise we would have a big destroy function with lots
                    // of 'if / else' mapping to things that got created.
                    this.destroyFunctions = [];
                    this.column = column;
                    this.parentScope = parentScope;
                    this.eRoot = eRoot;
                    this.dragSourceDropTarget = dragSourceDropTarget;
                }
                init() {
                    this.eHeaderCell = this.headerTemplateLoader.createHeaderElement(this.column);
                    utils_1.Utils.addCssClass(this.eHeaderCell, 'ag-header-cell');
                    this.createScope(this.parentScope);
                    this.addAttributes();
                    cssClassApplier_1.CssClassApplier.addHeaderClassesFromCollDef(this.column.getColDef(), this.eHeaderCell, this.gridOptionsWrapper);
                    // label div
                    var eHeaderCellLabel = this.eHeaderCell.querySelector('#agHeaderCellLabel');
                    this.setupMovingCss();
                    this.setupTooltip();
                    this.setupResize();
                    this.setupMove(eHeaderCellLabel);
                    this.setupMenu();
                    this.setupSort(eHeaderCellLabel);
                    this.setupFilterIcon();
                    this.setupText();
                    this.setupWidth();
                }
                setupTooltip() {
                    var colDef = this.column.getColDef();
                    // add tooltip if exists
                    if (colDef.headerTooltip) {
                        this.eHeaderCell.title = colDef.headerTooltip;
                    }
                }
                setupText() {
                    var colDef = this.column.getColDef();
                    // render the cell, use a renderer if one is provided
                    var headerCellRenderer;
                    if (colDef.headerCellRenderer) {
                        headerCellRenderer = colDef.headerCellRenderer;
                    }
                    else if (this.gridOptionsWrapper.getHeaderCellRenderer()) {
                        headerCellRenderer = this.gridOptionsWrapper.getHeaderCellRenderer();
                    }
                    var headerNameValue = this.columnController.getDisplayNameForCol(this.column);
                    var eText = this.eHeaderCell.querySelector('#agText');
                    if (eText) {
                        if (headerCellRenderer) {
                            this.useRenderer(headerNameValue, headerCellRenderer, eText);
                        }
                        else {
                            // no renderer, default text render
                            eText.className = 'ag-header-cell-text';
                            eText.innerHTML = headerNameValue;
                        }
                    }
                }
                setupFilterIcon() {
                    var eFilterIcon = this.eHeaderCell.querySelector('#agFilter');
                    if (!eFilterIcon) {
                        return;
                    }
                    var filterChangedListener = () => {
                        var filterPresent = this.column.isFilterActive();
                        utils_1.Utils.addOrRemoveCssClass(this.eHeaderCell, 'ag-header-cell-filtered', filterPresent);
                        utils_1.Utils.addOrRemoveCssClass(eFilterIcon, 'ag-hidden', !filterPresent);
                    };
                    this.column.addEventListener(column_1.Column.EVENT_FILTER_ACTIVE_CHANGED, filterChangedListener);
                    this.destroyFunctions.push(() => {
                        this.column.removeEventListener(column_1.Column.EVENT_FILTER_ACTIVE_CHANGED, filterChangedListener);
                    });
                    filterChangedListener();
                }
                setupWidth() {
                    var widthChangedListener = () => {
                        this.eHeaderCell.style.width = this.column.getActualWidth() + 'px';
                    };
                    this.column.addEventListener(column_1.Column.EVENT_WIDTH_CHANGED, widthChangedListener);
                    this.destroyFunctions.push(() => {
                        this.column.removeEventListener(column_1.Column.EVENT_WIDTH_CHANGED, widthChangedListener);
                    });
                    widthChangedListener();
                }
                getGui() {
                    return this.eHeaderCell;
                }
                destroy() {
                    this.destroyFunctions.forEach((func) => {
                        func();
                    });
                }
                createScope(parentScope) {
                    if (this.gridOptionsWrapper.isAngularCompileHeaders()) {
                        this.childScope = parentScope.$new();
                        this.childScope.colDef = this.column.getColDef();
                        this.childScope.colDefWrapper = this.column;
                        this.destroyFunctions.push(() => {
                            this.childScope.$destroy();
                        });
                    }
                }
                addAttributes() {
                    this.eHeaderCell.setAttribute("colId", this.column.getColId());
                }
                setupMenu() {
                    var eMenu = this.eHeaderCell.querySelector('#agMenu');
                    // if no menu provided in template, do nothing
                    if (!eMenu) {
                        return;
                    }
                    var weWantMenu = this.menuFactory.isMenuEnabled(this.column) && !this.column.getColDef().suppressMenu;
                    if (!weWantMenu) {
                        utils_1.Utils.removeFromParent(eMenu);
                        return;
                    }
                    eMenu.addEventListener('click', () => this.showMenu(eMenu));
                    if (!this.gridOptionsWrapper.isSuppressMenuHide()) {
                        eMenu.style.opacity = '0';
                        this.eHeaderCell.addEventListener('mouseover', function () {
                            eMenu.style.opacity = '1';
                        });
                        this.eHeaderCell.addEventListener('mouseout', function () {
                            eMenu.style.opacity = '0';
                        });
                    }
                    var style = eMenu.style;
                    style['transition'] = 'opacity 0.2s, border 0.2s';
                    style['-webkit-transition'] = 'opacity 0.2s, border 0.2s';
                }
                showMenu(eventSource) {
                    this.menuFactory.showMenuAfterButtonClick(this.column, eventSource);
                }
                setupMovingCss() {
                    // this function adds or removes the moving css, based on if the col is moving
                    var addMovingCssFunc = () => {
                        if (this.column.isMoving()) {
                            utils_1.Utils.addCssClass(this.eHeaderCell, 'ag-header-cell-moving');
                        }
                        else {
                            utils_1.Utils.removeCssClass(this.eHeaderCell, 'ag-header-cell-moving');
                        }
                    };
                    // call it now once, so the col is set up correctly
                    addMovingCssFunc();
                    // then call it every time we are informed of a moving state change in the col
                    this.column.addEventListener(column_1.Column.EVENT_MOVING_CHANGED, addMovingCssFunc);
                    // finally we remove the listener when this cell is no longer rendered
                    this.destroyFunctions.push(() => {
                        this.column.removeEventListener(column_1.Column.EVENT_MOVING_CHANGED, addMovingCssFunc);
                    });
                }
                setupMove(eHeaderCellLabel) {
                    if (this.gridOptionsWrapper.isSuppressMovableColumns() || this.column.getColDef().suppressMovable) {
                        return;
                    }
                    if (this.gridOptionsWrapper.isForPrint()) {
                        // don't allow moving of headers when forPrint, as the header overlay doesn't exist
                        return;
                    }
                    if (eHeaderCellLabel) {
                        var dragSource = {
                            eElement: eHeaderCellLabel,
                            dragItem: this.column,
                            dragSourceDropTarget: this.dragSourceDropTarget
                        };
                        this.dragAndDropService.addDragSource(dragSource);
                    }
                }
                setupResize() {
                    var colDef = this.column.getColDef();
                    var eResize = this.eHeaderCell.querySelector('#agResizeBar');
                    // if no eResize in template, do nothing
                    if (!eResize) {
                        return;
                    }
                    var weWantResize = this.gridOptionsWrapper.isEnableColResize() && !colDef.suppressResize;
                    if (!weWantResize) {
                        utils_1.Utils.removeFromParent(eResize);
                        return;
                    }
                    this.dragService.addDragHandling({
                        eDraggableElement: eResize,
                        eBody: this.eRoot,
                        cursor: 'col-resize',
                        startAfterPixels: 0,
                        onDragStart: this.onDragStart.bind(this),
                        onDragging: this.onDragging.bind(this)
                    });
                    var weWantAutoSize = !this.gridOptionsWrapper.isSuppressAutoSize() && !colDef.suppressAutoSize;
                    if (weWantAutoSize) {
                        eResize.addEventListener('dblclick', () => {
                            this.columnController.autoSizeColumn(this.column);
                        });
                    }
                }
                useRenderer(headerNameValue, headerCellRenderer, eText) {
                    // renderer provided, use it
                    var cellRendererParams = {
                        colDef: this.column.getColDef(),
                        $scope: this.childScope,
                        context: this.gridOptionsWrapper.getContext(),
                        value: headerNameValue,
                        api: this.gridOptionsWrapper.getApi(),
                        eHeaderCell: this.eHeaderCell
                    };
                    var cellRendererResult = headerCellRenderer(cellRendererParams);
                    var childToAppend;
                    if (utils_1.Utils.isNodeOrElement(cellRendererResult)) {
                        // a dom node or element was returned, so add child
                        childToAppend = cellRendererResult;
                    }
                    else {
                        // otherwise assume it was html, so just insert
                        var eTextSpan = document.createElement("span");
                        eTextSpan.innerHTML = cellRendererResult;
                        childToAppend = eTextSpan;
                    }
                    // angular compile header if option is turned on
                    if (this.gridOptionsWrapper.isAngularCompileHeaders()) {
                        var childToAppendCompiled = this.$compile(childToAppend)(this.childScope)[0];
                        eText.appendChild(childToAppendCompiled);
                    }
                    else {
                        eText.appendChild(childToAppend);
                    }
                }
                setupSort(eHeaderCellLabel) {
                    var enableSorting = this.gridOptionsWrapper.isEnableSorting() && !this.column.getColDef().suppressSorting;
                    if (!enableSorting) {
                        utils_1.Utils.removeFromParent(this.eHeaderCell.querySelector('#agSortAsc'));
                        utils_1.Utils.removeFromParent(this.eHeaderCell.querySelector('#agSortDesc'));
                        utils_1.Utils.removeFromParent(this.eHeaderCell.querySelector('#agNoSort'));
                        return;
                    }
                    // add the event on the header, so when clicked, we do sorting
                    if (eHeaderCellLabel) {
                        eHeaderCellLabel.addEventListener("click", (event) => {
                            this.sortController.progressSort(this.column, event.shiftKey);
                        });
                    }
                    // add listener for sort changing, and update the icons accordingly
                    var eSortAsc = this.eHeaderCell.querySelector('#agSortAsc');
                    var eSortDesc = this.eHeaderCell.querySelector('#agSortDesc');
                    var eSortNone = this.eHeaderCell.querySelector('#agNoSort');
                    var sortChangedListener = () => {
                        utils_1.Utils.addOrRemoveCssClass(this.eHeaderCell, 'ag-header-cell-sorted-asc', this.column.isSortAscending());
                        utils_1.Utils.addOrRemoveCssClass(this.eHeaderCell, 'ag-header-cell-sorted-desc', this.column.isSortDescending());
                        utils_1.Utils.addOrRemoveCssClass(this.eHeaderCell, 'ag-header-cell-sorted-none', this.column.isSortNone());
                        if (eSortAsc) {
                            utils_1.Utils.addOrRemoveCssClass(eSortAsc, 'ag-hidden', !this.column.isSortAscending());
                        }
                        if (eSortDesc) {
                            utils_1.Utils.addOrRemoveCssClass(eSortDesc, 'ag-hidden', !this.column.isSortDescending());
                        }
                        if (eSortNone) {
                            var alwaysHideNoSort = !this.column.getColDef().unSortIcon && !this.gridOptionsWrapper.isUnSortIcon();
                            utils_1.Utils.addOrRemoveCssClass(eSortNone, 'ag-hidden', alwaysHideNoSort || !this.column.isSortNone());
                        }
                    };
                    this.column.addEventListener(column_1.Column.EVENT_SORT_CHANGED, sortChangedListener);
                    this.destroyFunctions.push(() => {
                        this.column.removeEventListener(column_1.Column.EVENT_SORT_CHANGED, sortChangedListener);
                    });
                    sortChangedListener();
                }
                onDragStart() {
                    this.startWidth = this.column.getActualWidth();
                }
                onDragging(dragChange, finished) {
                    var newWidth = this.startWidth + dragChange;
                    this.columnController.setColumnWidth(this.column, newWidth, finished);
                }
                onIndividualColumnResized(column) {
                    if (this.column !== column) {
                        return;
                    }
                    var newWidthPx = column.getActualWidth() + "px";
                    this.eHeaderCell.style.width = newWidthPx;
                }
            }
            __decorate([
                context_2.Autowired('context'), 
                __metadata('design:type', context_2.Context)
            ], RenderedHeaderCell.prototype, "context", void 0);
            __decorate([
                context_2.Autowired('filterManager'), 
                __metadata('design:type', filterManager_1.FilterManager)
            ], RenderedHeaderCell.prototype, "filterManager", void 0);
            __decorate([
                context_2.Autowired('columnController'), 
                __metadata('design:type', columnController_1.ColumnController)
            ], RenderedHeaderCell.prototype, "columnController", void 0);
            __decorate([
                context_2.Autowired('$compile'), 
                __metadata('design:type', Object)
            ], RenderedHeaderCell.prototype, "$compile", void 0);
            __decorate([
                context_2.Autowired('gridCore'), 
                __metadata('design:type', gridCore_1.GridCore)
            ], RenderedHeaderCell.prototype, "gridCore", void 0);
            __decorate([
                context_2.Autowired('headerTemplateLoader'), 
                __metadata('design:type', headerTemplateLoader_1.HeaderTemplateLoader)
            ], RenderedHeaderCell.prototype, "headerTemplateLoader", void 0);
            __decorate([
                context_2.Autowired('horizontalDragService'), 
                __metadata('design:type', horizontalDragService_1.HorizontalDragService)
            ], RenderedHeaderCell.prototype, "dragService", void 0);
            __decorate([
                context_2.Autowired('menuFactory'), 
                __metadata('design:type', Object)
            ], RenderedHeaderCell.prototype, "menuFactory", void 0);
            __decorate([
                context_2.Autowired('gridOptionsWrapper'), 
                __metadata('design:type', gridOptionsWrapper_1.GridOptionsWrapper)
            ], RenderedHeaderCell.prototype, "gridOptionsWrapper", void 0);
            __decorate([
                context_2.Autowired('dragAndDropService'), 
                __metadata('design:type', dragAndDropService_1.DragAndDropService)
            ], RenderedHeaderCell.prototype, "dragAndDropService", void 0);
            __decorate([
                context_2.Autowired('sortController'), 
                __metadata('design:type', sortController_1.SortController)
            ], RenderedHeaderCell.prototype, "sortController", void 0);
            __decorate([
                context_2.PostConstruct, 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], RenderedHeaderCell.prototype, "init", null);
            exports_1("RenderedHeaderCell", RenderedHeaderCell);
        }
    }
});
//# sourceMappingURL=renderedHeaderCell.js.map