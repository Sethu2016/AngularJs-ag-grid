System.register(["./gridOptionsWrapper", "./rowControllers/paginationController", "./columnController/columnController", "./rendering/rowRenderer", "./filter/filterManager", "./eventService", "./gridPanel/gridPanel", "./logger", "./constants", "./widgets/popupService", "./events", "./layout/borderLayout", "./context/context", "./focusedCellController", "./widgets/component"], function(exports_1, context_1) {
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
    var gridOptionsWrapper_1, paginationController_1, columnController_1, rowRenderer_1, filterManager_1, eventService_1, gridPanel_1, logger_1, constants_1, popupService_1, events_1, borderLayout_1, context_2, focusedCellController_1, component_1;
    var GridCore;
    return {
        setters:[
            function (gridOptionsWrapper_1_1) {
                gridOptionsWrapper_1 = gridOptionsWrapper_1_1;
            },
            function (paginationController_1_1) {
                paginationController_1 = paginationController_1_1;
            },
            function (columnController_1_1) {
                columnController_1 = columnController_1_1;
            },
            function (rowRenderer_1_1) {
                rowRenderer_1 = rowRenderer_1_1;
            },
            function (filterManager_1_1) {
                filterManager_1 = filterManager_1_1;
            },
            function (eventService_1_1) {
                eventService_1 = eventService_1_1;
            },
            function (gridPanel_1_1) {
                gridPanel_1 = gridPanel_1_1;
            },
            function (logger_1_1) {
                logger_1 = logger_1_1;
            },
            function (constants_1_1) {
                constants_1 = constants_1_1;
            },
            function (popupService_1_1) {
                popupService_1 = popupService_1_1;
            },
            function (events_1_1) {
                events_1 = events_1_1;
            },
            function (borderLayout_1_1) {
                borderLayout_1 = borderLayout_1_1;
            },
            function (context_2_1) {
                context_2 = context_2_1;
            },
            function (focusedCellController_1_1) {
                focusedCellController_1 = focusedCellController_1_1;
            },
            function (component_1_1) {
                component_1 = component_1_1;
            }],
        execute: function() {
            let GridCore = class GridCore {
                constructor(loggerFactory) {
                    this.logger = loggerFactory.create('GridCore');
                }
                init() {
                    // and the last bean, done in it's own section, as it's optional
                    var toolPanelGui;
                    var eSouthPanel = this.createSouthPanel();
                    if (this.toolPanel && !this.gridOptionsWrapper.isForPrint()) {
                        toolPanelGui = this.toolPanel.getGui();
                    }
                    var rowGroupGui;
                    if (this.rowGroupPanel) {
                        rowGroupGui = this.rowGroupPanel.getGui();
                    }
                    this.eRootPanel = new borderLayout_1.BorderLayout({
                        center: this.gridPanel.getLayout(),
                        east: toolPanelGui,
                        north: rowGroupGui,
                        south: eSouthPanel,
                        dontFill: this.gridOptionsWrapper.isForPrint(),
                        name: 'eRootPanel'
                    });
                    // see what the grid options are for default of toolbar
                    this.showToolPanel(this.gridOptionsWrapper.isShowToolPanel());
                    this.eGridDiv.appendChild(this.eRootPanel.getGui());
                    // if using angular, watch for quickFilter changes
                    if (this.$scope) {
                        this.$scope.$watch(this.quickFilterOnScope, (newFilter) => this.filterManager.setQuickFilter(newFilter));
                    }
                    if (!this.gridOptionsWrapper.isForPrint()) {
                        this.addWindowResizeListener();
                    }
                    this.doLayout();
                    this.finished = false;
                    this.periodicallyDoLayout();
                    this.eventService.addEventListener(events_1.Events.EVENT_COLUMN_ROW_GROUP_CHANGE, this.onRowGroupChanged.bind(this));
                    this.eventService.addEventListener(events_1.Events.EVENT_COLUMN_EVERYTHING_CHANGED, this.onRowGroupChanged.bind(this));
                    this.onRowGroupChanged();
                    this.logger.log('ready');
                }
                getRootGui() {
                    return this.eRootPanel.getGui();
                }
                createSouthPanel() {
                    if (!this.statusBar && this.gridOptionsWrapper.isEnableStatusBar()) {
                        console.warn('ag-Grid: status bar is only available in ag-Grid-Enterprise');
                    }
                    var statusBarEnabled = this.statusBar && this.gridOptionsWrapper.isEnableStatusBar();
                    var paginationPanelEnabled = this.gridOptionsWrapper.isRowModelPagination() && !this.gridOptionsWrapper.isForPrint();
                    if (!statusBarEnabled && !paginationPanelEnabled) {
                        return null;
                    }
                    var eSouthPanel = document.createElement('div');
                    if (statusBarEnabled) {
                        eSouthPanel.appendChild(this.statusBar.getGui());
                    }
                    if (paginationPanelEnabled) {
                        eSouthPanel.appendChild(this.paginationController.getGui());
                    }
                    return eSouthPanel;
                }
                onRowGroupChanged() {
                    if (!this.rowGroupPanel) {
                        return;
                    }
                    var rowGroupPanelShow = this.gridOptionsWrapper.getRowGroupPanelShow();
                    if (rowGroupPanelShow === constants_1.Constants.ALWAYS) {
                        this.eRootPanel.setNorthVisible(true);
                    }
                    else if (rowGroupPanelShow === constants_1.Constants.ONLY_WHEN_GROUPING) {
                        var grouping = !this.columnController.isRowGroupEmpty();
                        this.eRootPanel.setNorthVisible(grouping);
                    }
                    else {
                        this.eRootPanel.setNorthVisible(false);
                    }
                }
                addWindowResizeListener() {
                    var that = this;
                    // putting this into a function, so when we remove the function,
                    // we are sure we are removing the exact same function (i'm not
                    // sure what 'bind' does to the function reference, if it's safe
                    // the result from 'bind').
                    this.windowResizeListener = function resizeListener() {
                        that.doLayout();
                    };
                    window.addEventListener('resize', this.windowResizeListener);
                }
                periodicallyDoLayout() {
                    if (!this.finished) {
                        var that = this;
                        setTimeout(function () {
                            that.doLayout();
                            that.gridPanel.periodicallyCheck();
                            that.periodicallyDoLayout();
                        }, 500);
                    }
                }
                showToolPanel(show) {
                    if (show && !this.toolPanel) {
                        console.warn('ag-Grid: toolPanel is only available in ag-Grid Enterprise');
                        this.toolPanelShowing = false;
                        return;
                    }
                    this.toolPanelShowing = show;
                    this.eRootPanel.setEastVisible(show);
                }
                isToolPanelShowing() {
                    return this.toolPanelShowing;
                }
                destroy() {
                    if (this.windowResizeListener) {
                        window.removeEventListener('resize', this.windowResizeListener);
                        this.logger.log('Removing windowResizeListener');
                    }
                    this.finished = true;
                    this.eGridDiv.removeChild(this.eRootPanel.getGui());
                    this.logger.log('Grid DOM removed');
                }
                ensureNodeVisible(comparator) {
                    if (this.doingVirtualPaging) {
                        throw 'Cannot use ensureNodeVisible when doing virtual paging, as we cannot check rows that are not in memory';
                    }
                    // look for the node index we want to display
                    var rowCount = this.rowModel.getRowCount();
                    var comparatorIsAFunction = typeof comparator === 'function';
                    var indexToSelect = -1;
                    // go through all the nodes, find the one we want to show
                    for (var i = 0; i < rowCount; i++) {
                        var node = this.rowModel.getRow(i);
                        if (comparatorIsAFunction) {
                            if (comparator(node)) {
                                indexToSelect = i;
                                break;
                            }
                        }
                        else {
                            // check object equality against node and data
                            if (comparator === node || comparator === node.data) {
                                indexToSelect = i;
                                break;
                            }
                        }
                    }
                    if (indexToSelect >= 0) {
                        this.gridPanel.ensureIndexVisible(indexToSelect);
                    }
                }
                doLayout() {
                    // need to do layout first, as drawVirtualRows and setPinnedColHeight
                    // need to know the result of the resizing of the panels.
                    var sizeChanged = this.eRootPanel.doLayout();
                    // both of the two below should be done in gridPanel, the gridPanel should register 'resize' to the panel
                    if (sizeChanged) {
                        this.rowRenderer.drawVirtualRows();
                        var event = {
                            clientWidth: this.eRootPanel.getGui().clientWidth,
                            clientHeight: this.eRootPanel.getGui().clientHeight
                        };
                        this.eventService.dispatchEvent(events_1.Events.EVENT_GRID_SIZE_CHANGED, event);
                    }
                }
            };
            __decorate([
                context_2.Autowired('gridOptions'), 
                __metadata('design:type', Object)
            ], GridCore.prototype, "gridOptions", void 0);
            __decorate([
                context_2.Autowired('gridOptionsWrapper'), 
                __metadata('design:type', gridOptionsWrapper_1.GridOptionsWrapper)
            ], GridCore.prototype, "gridOptionsWrapper", void 0);
            __decorate([
                context_2.Autowired('paginationController'), 
                __metadata('design:type', paginationController_1.PaginationController)
            ], GridCore.prototype, "paginationController", void 0);
            __decorate([
                context_2.Autowired('rowModel'), 
                __metadata('design:type', Object)
            ], GridCore.prototype, "rowModel", void 0);
            __decorate([
                context_2.Autowired('columnController'), 
                __metadata('design:type', columnController_1.ColumnController)
            ], GridCore.prototype, "columnController", void 0);
            __decorate([
                context_2.Autowired('rowRenderer'), 
                __metadata('design:type', rowRenderer_1.RowRenderer)
            ], GridCore.prototype, "rowRenderer", void 0);
            __decorate([
                context_2.Autowired('filterManager'), 
                __metadata('design:type', filterManager_1.FilterManager)
            ], GridCore.prototype, "filterManager", void 0);
            __decorate([
                context_2.Autowired('eventService'), 
                __metadata('design:type', eventService_1.EventService)
            ], GridCore.prototype, "eventService", void 0);
            __decorate([
                context_2.Autowired('gridPanel'), 
                __metadata('design:type', gridPanel_1.GridPanel)
            ], GridCore.prototype, "gridPanel", void 0);
            __decorate([
                context_2.Autowired('eGridDiv'), 
                __metadata('design:type', HTMLElement)
            ], GridCore.prototype, "eGridDiv", void 0);
            __decorate([
                context_2.Autowired('$scope'), 
                __metadata('design:type', Object)
            ], GridCore.prototype, "$scope", void 0);
            __decorate([
                context_2.Autowired('quickFilterOnScope'), 
                __metadata('design:type', String)
            ], GridCore.prototype, "quickFilterOnScope", void 0);
            __decorate([
                context_2.Autowired('popupService'), 
                __metadata('design:type', popupService_1.PopupService)
            ], GridCore.prototype, "popupService", void 0);
            __decorate([
                context_2.Autowired('focusedCellController'), 
                __metadata('design:type', focusedCellController_1.FocusedCellController)
            ], GridCore.prototype, "focusedCellController", void 0);
            __decorate([
                context_2.Optional('rowGroupPanel'), 
                __metadata('design:type', component_1.Component)
            ], GridCore.prototype, "rowGroupPanel", void 0);
            __decorate([
                context_2.Optional('toolPanel'), 
                __metadata('design:type', component_1.Component)
            ], GridCore.prototype, "toolPanel", void 0);
            __decorate([
                context_2.Optional('statusBar'), 
                __metadata('design:type', component_1.Component)
            ], GridCore.prototype, "statusBar", void 0);
            __decorate([
                context_2.PostConstruct, 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], GridCore.prototype, "init", null);
            __decorate([
                context_2.PreDestroy, 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], GridCore.prototype, "destroy", null);
            GridCore = __decorate([
                context_2.Bean('gridCore'),
                __param(0, context_2.Qualifier('loggerFactory')), 
                __metadata('design:paramtypes', [logger_1.LoggerFactory])
            ], GridCore);
            exports_1("GridCore", GridCore);
        }
    }
});
//# sourceMappingURL=gridCore.js.map