System.register(["./gridOptionsWrapper", "./rowControllers/paginationController", "./rowControllers/floatingRowModel", "./selectionController", "./columnController/columnController", "./rendering/rowRenderer", "./headerRendering/headerRenderer", "./filter/filterManager", "./valueService", "./masterSlaveService", "./eventService", "./dragAndDrop/oldToolPanelDragAndDropService", "./gridPanel/gridPanel", "./gridApi", "./headerRendering/headerTemplateLoader", "./columnController/balancedColumnTreeBuilder", "./columnController/displayedGroupCreator", "./selectionRendererFactory", "./expressionService", "./templateService", "./widgets/popupService", "./logger", "./columnController/columnUtils", "./rendering/autoWidthCalculator", "./headerRendering/horizontalDragService", "./context/context", "./csvCreator", "./gridCore", "./headerRendering/standardMenu", "./dragAndDrop/dragAndDropService", "./dragAndDrop/dragService", "./sortController", "./focusedCellController", "./gridPanel/mouseEventService", "./cellNavigationService", "./utils", "./rowControllers/inMemory/fillterStage", "./rowControllers/inMemory/sortStage", "./rowControllers/inMemory/flattenStage", "./misc/focusService", "./rendering/cellEditorFactory", "./events", "./rowControllers/virtualPageRowModel", "./rowControllers/inMemory/inMemoryRowModel", "./rendering/cellRendererFactory", "./rendering/cellRendererService", "./rendering/valueFormatterService"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var gridOptionsWrapper_1, paginationController_1, floatingRowModel_1, selectionController_1, columnController_1, rowRenderer_1, headerRenderer_1, filterManager_1, valueService_1, masterSlaveService_1, eventService_1, oldToolPanelDragAndDropService_1, gridPanel_1, gridApi_1, headerTemplateLoader_1, balancedColumnTreeBuilder_1, displayedGroupCreator_1, selectionRendererFactory_1, expressionService_1, templateService_1, popupService_1, logger_1, columnUtils_1, autoWidthCalculator_1, horizontalDragService_1, context_2, csvCreator_1, gridCore_1, standardMenu_1, dragAndDropService_1, dragService_1, sortController_1, focusedCellController_1, mouseEventService_1, cellNavigationService_1, utils_1, fillterStage_1, sortStage_1, flattenStage_1, focusService_1, cellEditorFactory_1, events_1, virtualPageRowModel_1, inMemoryRowModel_1, cellRendererFactory_1, cellRendererService_1, valueFormatterService_1;
    var Grid;
    return {
        setters:[
            function (gridOptionsWrapper_1_1) {
                gridOptionsWrapper_1 = gridOptionsWrapper_1_1;
            },
            function (paginationController_1_1) {
                paginationController_1 = paginationController_1_1;
            },
            function (floatingRowModel_1_1) {
                floatingRowModel_1 = floatingRowModel_1_1;
            },
            function (selectionController_1_1) {
                selectionController_1 = selectionController_1_1;
            },
            function (columnController_1_1) {
                columnController_1 = columnController_1_1;
            },
            function (rowRenderer_1_1) {
                rowRenderer_1 = rowRenderer_1_1;
            },
            function (headerRenderer_1_1) {
                headerRenderer_1 = headerRenderer_1_1;
            },
            function (filterManager_1_1) {
                filterManager_1 = filterManager_1_1;
            },
            function (valueService_1_1) {
                valueService_1 = valueService_1_1;
            },
            function (masterSlaveService_1_1) {
                masterSlaveService_1 = masterSlaveService_1_1;
            },
            function (eventService_1_1) {
                eventService_1 = eventService_1_1;
            },
            function (oldToolPanelDragAndDropService_1_1) {
                oldToolPanelDragAndDropService_1 = oldToolPanelDragAndDropService_1_1;
            },
            function (gridPanel_1_1) {
                gridPanel_1 = gridPanel_1_1;
            },
            function (gridApi_1_1) {
                gridApi_1 = gridApi_1_1;
            },
            function (headerTemplateLoader_1_1) {
                headerTemplateLoader_1 = headerTemplateLoader_1_1;
            },
            function (balancedColumnTreeBuilder_1_1) {
                balancedColumnTreeBuilder_1 = balancedColumnTreeBuilder_1_1;
            },
            function (displayedGroupCreator_1_1) {
                displayedGroupCreator_1 = displayedGroupCreator_1_1;
            },
            function (selectionRendererFactory_1_1) {
                selectionRendererFactory_1 = selectionRendererFactory_1_1;
            },
            function (expressionService_1_1) {
                expressionService_1 = expressionService_1_1;
            },
            function (templateService_1_1) {
                templateService_1 = templateService_1_1;
            },
            function (popupService_1_1) {
                popupService_1 = popupService_1_1;
            },
            function (logger_1_1) {
                logger_1 = logger_1_1;
            },
            function (columnUtils_1_1) {
                columnUtils_1 = columnUtils_1_1;
            },
            function (autoWidthCalculator_1_1) {
                autoWidthCalculator_1 = autoWidthCalculator_1_1;
            },
            function (horizontalDragService_1_1) {
                horizontalDragService_1 = horizontalDragService_1_1;
            },
            function (context_2_1) {
                context_2 = context_2_1;
            },
            function (csvCreator_1_1) {
                csvCreator_1 = csvCreator_1_1;
            },
            function (gridCore_1_1) {
                gridCore_1 = gridCore_1_1;
            },
            function (standardMenu_1_1) {
                standardMenu_1 = standardMenu_1_1;
            },
            function (dragAndDropService_1_1) {
                dragAndDropService_1 = dragAndDropService_1_1;
            },
            function (dragService_1_1) {
                dragService_1 = dragService_1_1;
            },
            function (sortController_1_1) {
                sortController_1 = sortController_1_1;
            },
            function (focusedCellController_1_1) {
                focusedCellController_1 = focusedCellController_1_1;
            },
            function (mouseEventService_1_1) {
                mouseEventService_1 = mouseEventService_1_1;
            },
            function (cellNavigationService_1_1) {
                cellNavigationService_1 = cellNavigationService_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (fillterStage_1_1) {
                fillterStage_1 = fillterStage_1_1;
            },
            function (sortStage_1_1) {
                sortStage_1 = sortStage_1_1;
            },
            function (flattenStage_1_1) {
                flattenStage_1 = flattenStage_1_1;
            },
            function (focusService_1_1) {
                focusService_1 = focusService_1_1;
            },
            function (cellEditorFactory_1_1) {
                cellEditorFactory_1 = cellEditorFactory_1_1;
            },
            function (events_1_1) {
                events_1 = events_1_1;
            },
            function (virtualPageRowModel_1_1) {
                virtualPageRowModel_1 = virtualPageRowModel_1_1;
            },
            function (inMemoryRowModel_1_1) {
                inMemoryRowModel_1 = inMemoryRowModel_1_1;
            },
            function (cellRendererFactory_1_1) {
                cellRendererFactory_1 = cellRendererFactory_1_1;
            },
            function (cellRendererService_1_1) {
                cellRendererService_1 = cellRendererService_1_1;
            },
            function (valueFormatterService_1_1) {
                valueFormatterService_1 = valueFormatterService_1_1;
            }],
        execute: function() {
            class Grid {
                constructor(eGridDiv, gridOptions, globalEventListener = null, $scope = null, $compile = null, quickFilterOnScope = null) {
                    if (!eGridDiv) {
                        console.error('ag-Grid: no div element provided to the grid');
                    }
                    if (!gridOptions) {
                        console.error('ag-Grid: no gridOptions provided to the grid');
                    }
                    var rowModelClass = this.getRowModelClass(gridOptions);
                    var enterprise = utils_1.Utils.exists(Grid.enterpriseBeans);
                    this.context = new context_2.Context({
                        overrideBeans: Grid.enterpriseBeans,
                        seed: {
                            enterprise: enterprise,
                            gridOptions: gridOptions,
                            eGridDiv: eGridDiv,
                            $scope: $scope,
                            $compile: $compile,
                            quickFilterOnScope: quickFilterOnScope,
                            globalEventListener: globalEventListener
                        },
                        beans: [rowModelClass, cellRendererFactory_1.CellRendererFactory, horizontalDragService_1.HorizontalDragService, headerTemplateLoader_1.HeaderTemplateLoader, floatingRowModel_1.FloatingRowModel, dragService_1.DragService,
                            displayedGroupCreator_1.DisplayedGroupCreator, eventService_1.EventService, gridOptionsWrapper_1.GridOptionsWrapper, selectionController_1.SelectionController,
                            filterManager_1.FilterManager, selectionRendererFactory_1.SelectionRendererFactory, columnController_1.ColumnController, rowRenderer_1.RowRenderer,
                            headerRenderer_1.HeaderRenderer, expressionService_1.ExpressionService, balancedColumnTreeBuilder_1.BalancedColumnTreeBuilder, csvCreator_1.CsvCreator,
                            templateService_1.TemplateService, gridPanel_1.GridPanel, popupService_1.PopupService, valueService_1.ValueService, masterSlaveService_1.MasterSlaveService,
                            logger_1.LoggerFactory, oldToolPanelDragAndDropService_1.OldToolPanelDragAndDropService, columnUtils_1.ColumnUtils, autoWidthCalculator_1.AutoWidthCalculator, gridApi_1.GridApi,
                            paginationController_1.PaginationController, popupService_1.PopupService, gridCore_1.GridCore, standardMenu_1.StandardMenuFactory,
                            dragAndDropService_1.DragAndDropService, sortController_1.SortController, columnController_1.ColumnApi, focusedCellController_1.FocusedCellController, mouseEventService_1.MouseEventService,
                            cellNavigationService_1.CellNavigationService, fillterStage_1.FilterStage, sortStage_1.SortStage, flattenStage_1.FlattenStage, focusService_1.FocusService,
                            cellEditorFactory_1.CellEditorFactory, cellRendererService_1.CellRendererService, valueFormatterService_1.ValueFormatterService],
                        debug: !!gridOptions.debug
                    });
                    var eventService = this.context.getBean('eventService');
                    var readyEvent = {
                        api: gridOptions.api,
                        columnApi: gridOptions.columnApi
                    };
                    eventService.dispatchEvent(events_1.Events.EVENT_GRID_READY, readyEvent);
                }
                static setEnterpriseBeans(enterpriseBeans, rowModelClasses) {
                    this.enterpriseBeans = enterpriseBeans;
                    // the enterprise can inject additional row models. this is how it injects the viewportRowModel
                    utils_1.Utils.iterateObject(rowModelClasses, (key, value) => Grid.RowModelClasses[key] = value);
                }
                getRowModelClass(gridOptions) {
                    var rowModelType = gridOptions.rowModelType;
                    if (utils_1.Utils.exists(rowModelType)) {
                        var rowModelClass = Grid.RowModelClasses[rowModelType];
                        if (utils_1.Utils.exists(rowModelClass)) {
                            return rowModelClass;
                        }
                        else {
                            console.error('ag-Grid: count not find matching row model for rowModelType ' + rowModelType);
                            if (rowModelType === 'viewport') {
                                console.error('ag-Grid: rowModelType viewport is only available in ag-Grid Enterprise');
                            }
                        }
                    }
                    return inMemoryRowModel_1.InMemoryRowModel;
                }
                ;
                destroy() {
                    this.context.destroy();
                }
            }
            // the default is InMemoryRowModel, which is also used for pagination.
            // the enterprise adds viewport to this list.
            Grid.RowModelClasses = {
                virtual: virtualPageRowModel_1.VirtualPageRowModel,
                pagination: inMemoryRowModel_1.InMemoryRowModel
            };
            exports_1("Grid", Grid);
        }
    }
});
//# sourceMappingURL=grid.js.map