System.register(["../context/context", "../logger", "../columnController/columnController", "../entities/column", '../utils', "../dragAndDrop/dragAndDropService", "../gridPanel/gridPanel"], function(exports_1, context_1) {
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
    var context_2, logger_1, columnController_1, column_1, utils_1, dragAndDropService_1, gridPanel_1, context_3;
    var MoveColumnController;
    return {
        setters:[
            function (context_2_1) {
                context_2 = context_2_1;
                context_3 = context_2_1;
            },
            function (logger_1_1) {
                logger_1 = logger_1_1;
            },
            function (columnController_1_1) {
                columnController_1 = columnController_1_1;
            },
            function (column_1_1) {
                column_1 = column_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (dragAndDropService_1_1) {
                dragAndDropService_1 = dragAndDropService_1_1;
            },
            function (gridPanel_1_1) {
                gridPanel_1 = gridPanel_1_1;
            }],
        execute: function() {
            class MoveColumnController {
                constructor(pinned) {
                    this.needToMoveLeft = false;
                    this.needToMoveRight = false;
                    this.pinned = pinned;
                    this.centerContainer = !utils_1.Utils.exists(pinned);
                }
                init() {
                    this.logger = this.loggerFactory.create('MoveColumnController');
                }
                onDragEnter(draggingEvent) {
                    // we do dummy drag, so make sure column appears in the right location when first placed
                    this.columnController.setColumnVisible(draggingEvent.dragItem, true);
                    this.columnController.setColumnPinned(draggingEvent.dragItem, this.pinned);
                    this.onDragging(draggingEvent);
                }
                onDragLeave(draggingEvent) {
                    this.columnController.setColumnVisible(draggingEvent.dragItem, false);
                    this.ensureIntervalCleared();
                }
                onDragStop() {
                    this.ensureIntervalCleared();
                }
                adjustXForScroll(draggingEvent) {
                    if (this.centerContainer) {
                        return draggingEvent.x + this.gridPanel.getHorizontalScrollPosition();
                    }
                    else {
                        return draggingEvent.x;
                    }
                }
                workOutNewIndex(displayedColumns, allColumns, draggingEvent, xAdjustedForScroll) {
                    if (draggingEvent.direction === dragAndDropService_1.DragAndDropService.DIRECTION_LEFT) {
                        return this.getNewIndexForColMovingLeft(displayedColumns, allColumns, draggingEvent.dragItem, xAdjustedForScroll);
                    }
                    else {
                        return this.getNewIndexForColMovingRight(displayedColumns, allColumns, draggingEvent.dragItem, xAdjustedForScroll);
                    }
                }
                checkCenterForScrolling(xAdjustedForScroll) {
                    if (this.centerContainer) {
                        // scroll if the mouse has gone outside the grid (or just outside the scrollable part if pinning)
                        // putting in 50 buffer, so even if user gets to edge of grid, a scroll will happen
                        var firstVisiblePixel = this.gridPanel.getHorizontalScrollPosition();
                        var lastVisiblePixel = firstVisiblePixel + this.gridPanel.getCenterWidth();
                        this.needToMoveLeft = xAdjustedForScroll < (firstVisiblePixel + 50);
                        this.needToMoveRight = xAdjustedForScroll > (lastVisiblePixel - 50);
                        if (this.needToMoveLeft || this.needToMoveRight) {
                            this.ensureIntervalStarted();
                        }
                        else {
                            this.ensureIntervalCleared();
                        }
                    }
                }
                onDragging(draggingEvent) {
                    this.lastDraggingEvent = draggingEvent;
                    // if moving up or down (ie not left or right) then do nothing
                    if (!draggingEvent.direction) {
                        return;
                    }
                    var xAdjustedForScroll = this.adjustXForScroll(draggingEvent);
                    this.checkCenterForScrolling(xAdjustedForScroll);
                    // find out what the correct position is for this column
                    this.checkColIndexAndMove(draggingEvent, xAdjustedForScroll);
                }
                checkColIndexAndMove(draggingEvent, xAdjustedForScroll) {
                    var displayedColumns = this.columnController.getDisplayedColumns(this.pinned);
                    var allColumns = this.columnController.getAllColumns();
                    var newIndex = this.workOutNewIndex(displayedColumns, allColumns, draggingEvent, xAdjustedForScroll);
                    var oldColumn = allColumns[newIndex];
                    // if col already at required location, do nothing
                    if (oldColumn === draggingEvent.dragItem) {
                        return;
                    }
                    // we move one column, UNLESS the column is the only visible column
                    // of a group, in which case we move the whole group.
                    var columnsToMove = this.getColumnsAndOrphans(draggingEvent.dragItem);
                    this.columnController.moveColumns(columnsToMove.reverse(), newIndex);
                }
                getNewIndexForColMovingLeft(displayedColumns, allColumns, dragColumnOrGroup, x) {
                    var dragColumn = dragColumnOrGroup;
                    var usedX = 0;
                    var leftColumn = null;
                    for (var i = 0; i < displayedColumns.length; i++) {
                        var currentColumn = displayedColumns[i];
                        if (currentColumn === dragColumn) {
                            continue;
                        }
                        usedX += currentColumn.getActualWidth();
                        if (usedX > x) {
                            break;
                        }
                        leftColumn = currentColumn;
                    }
                    var newIndex;
                    if (leftColumn) {
                        newIndex = allColumns.indexOf(leftColumn) + 1;
                        var oldIndex = allColumns.indexOf(dragColumn);
                        if (oldIndex < newIndex) {
                            newIndex--;
                        }
                    }
                    else {
                        newIndex = 0;
                    }
                    return newIndex;
                }
                getNewIndexForColMovingRight(displayedColumns, allColumns, dragColumnOrGroup, x) {
                    var dragColumn = dragColumnOrGroup;
                    var usedX = dragColumn.getActualWidth();
                    var leftColumn = null;
                    for (var i = 0; i < displayedColumns.length; i++) {
                        if (usedX > x) {
                            break;
                        }
                        var currentColumn = displayedColumns[i];
                        if (currentColumn === dragColumn) {
                            continue;
                        }
                        usedX += currentColumn.getActualWidth();
                        leftColumn = currentColumn;
                    }
                    var newIndex;
                    if (leftColumn) {
                        newIndex = allColumns.indexOf(leftColumn) + 1;
                        var oldIndex = allColumns.indexOf(dragColumn);
                        if (oldIndex < newIndex) {
                            newIndex--;
                        }
                    }
                    else {
                        newIndex = 0;
                    }
                    return newIndex;
                }
                getColumnsAndOrphans(columnOrGroup) {
                    var column = columnOrGroup;
                    // if this column was to move, how many children would be left without a parent
                    var pathToChild = this.columnController.getPathForColumn(column);
                    for (var i = pathToChild.length - 1; i >= 0; i--) {
                        var columnGroup = pathToChild[i];
                        var onlyDisplayedChild = columnGroup.getDisplayedChildren().length === 1;
                        var moreThanOneChild = columnGroup.getChildren().length > 1;
                        if (onlyDisplayedChild && moreThanOneChild) {
                            // return total columns below here, not including the column under inspection
                            var leafColumns = columnGroup.getLeafColumns();
                            return leafColumns;
                        }
                    }
                    return [column];
                }
                ensureIntervalStarted() {
                    if (!this.movingIntervalId) {
                        this.intervalCount = 0;
                        this.failedMoveAttempts = 0;
                        this.movingIntervalId = setInterval(this.moveInterval.bind(this), 100);
                        if (this.needToMoveLeft) {
                            this.dragAndDropService.setGhostIcon(dragAndDropService_1.DragAndDropService.ICON_LEFT, true);
                        }
                        else {
                            this.dragAndDropService.setGhostIcon(dragAndDropService_1.DragAndDropService.ICON_RIGHT, true);
                        }
                    }
                }
                ensureIntervalCleared() {
                    if (this.moveInterval) {
                        clearInterval(this.movingIntervalId);
                        this.movingIntervalId = null;
                        this.dragAndDropService.setGhostIcon(dragAndDropService_1.DragAndDropService.ICON_MOVE);
                    }
                }
                moveInterval() {
                    var pixelsToMove;
                    this.intervalCount++;
                    pixelsToMove = 10 + (this.intervalCount * 5);
                    if (pixelsToMove > 100) {
                        pixelsToMove = 100;
                    }
                    var pixelsMoved;
                    if (this.needToMoveLeft) {
                        pixelsMoved = this.gridPanel.scrollHorizontally(-pixelsToMove);
                    }
                    else if (this.needToMoveRight) {
                        pixelsMoved = this.gridPanel.scrollHorizontally(pixelsToMove);
                    }
                    if (pixelsMoved !== 0) {
                        this.onDragging(this.lastDraggingEvent);
                        this.failedMoveAttempts = 0;
                    }
                    else {
                        this.failedMoveAttempts++;
                        if (this.failedMoveAttempts > 7) {
                            if (this.needToMoveLeft) {
                                this.columnController.setColumnPinned(this.lastDraggingEvent.dragItem, column_1.Column.PINNED_LEFT);
                            }
                            else {
                                this.columnController.setColumnPinned(this.lastDraggingEvent.dragItem, column_1.Column.PINNED_RIGHT);
                            }
                            this.dragAndDropService.nudge();
                        }
                    }
                }
            }
            __decorate([
                context_2.Autowired('loggerFactory'), 
                __metadata('design:type', logger_1.LoggerFactory)
            ], MoveColumnController.prototype, "loggerFactory", void 0);
            __decorate([
                context_2.Autowired('columnController'), 
                __metadata('design:type', columnController_1.ColumnController)
            ], MoveColumnController.prototype, "columnController", void 0);
            __decorate([
                context_2.Autowired('gridPanel'), 
                __metadata('design:type', gridPanel_1.GridPanel)
            ], MoveColumnController.prototype, "gridPanel", void 0);
            __decorate([
                context_2.Autowired('dragAndDropService'), 
                __metadata('design:type', dragAndDropService_1.DragAndDropService)
            ], MoveColumnController.prototype, "dragAndDropService", void 0);
            __decorate([
                context_3.PostConstruct, 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], MoveColumnController.prototype, "init", null);
            exports_1("MoveColumnController", MoveColumnController);
        }
    }
});
//# sourceMappingURL=moveColumnController.js.map