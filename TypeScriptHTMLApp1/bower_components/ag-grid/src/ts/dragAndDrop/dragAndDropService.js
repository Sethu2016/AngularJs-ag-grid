System.register(["../context/context", "../logger", "../entities/column", "../headerRendering/headerTemplateLoader", '../utils', "../gridOptionsWrapper", "../svgFactory", "./dragService"], function(exports_1, context_1) {
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
    var context_2, logger_1, context_3, column_1, headerTemplateLoader_1, utils_1, gridOptionsWrapper_1, context_4, svgFactory_1, dragService_1;
    var svgFactory, DragAndDropService;
    return {
        setters:[
            function (context_2_1) {
                context_2 = context_2_1;
                context_3 = context_2_1;
                context_4 = context_2_1;
            },
            function (logger_1_1) {
                logger_1 = logger_1_1;
            },
            function (column_1_1) {
                column_1 = column_1_1;
            },
            function (headerTemplateLoader_1_1) {
                headerTemplateLoader_1 = headerTemplateLoader_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (gridOptionsWrapper_1_1) {
                gridOptionsWrapper_1 = gridOptionsWrapper_1_1;
            },
            function (svgFactory_1_1) {
                svgFactory_1 = svgFactory_1_1;
            },
            function (dragService_1_1) {
                dragService_1 = dragService_1_1;
            }],
        execute: function() {
            svgFactory = svgFactory_1.SvgFactory.getInstance();
            let DragAndDropService_1;
            let DragAndDropService = DragAndDropService_1 = class DragAndDropService {
                constructor() {
                    this.dropTargets = [];
                    this.ePinnedIcon = svgFactory.createPinIcon();
                    this.ePlusIcon = svgFactory.createPlusIcon();
                    this.eHiddenIcon = svgFactory.createColumnHiddenIcon();
                    this.eMoveIcon = svgFactory.createMoveIcon();
                    this.eLeftIcon = svgFactory.createLeftIcon();
                    this.eRightIcon = svgFactory.createRightIcon();
                    this.eGroupIcon = svgFactory.createGroupIcon();
                }
                setBeans(loggerFactory) {
                    this.logger = loggerFactory.create('OldToolPanelDragAndDropService');
                    this.eBody = document.querySelector('body');
                    if (!this.eBody) {
                        console.warn('ag-Grid: could not find document body, it is needed for dragging columns');
                    }
                }
                // we do not need to clean up drag sources, as we are just adding a listener to the element.
                // when the element is disposed, the drag source is also disposed, even though this service
                // remains. this is a bit different to normal 'addListener' methods
                addDragSource(params) {
                    this.dragService.addDragSource({
                        eElement: params.eElement,
                        onDragStart: this.onDragStart.bind(this, params),
                        onDragStop: this.onDragStop.bind(this),
                        onDragging: this.onDragging.bind(this)
                    });
                    //params.eElement.addEventListener('mousedown', this.onMouseDown.bind(this, params));
                }
                nudge() {
                    if (this.dragging) {
                        this.onDragging(this.eventLastTime);
                    }
                }
                onDragStart(dragSource, mouseEvent) {
                    this.logger.log('startDrag');
                    this.dragging = true;
                    this.dragSource = dragSource;
                    this.eventLastTime = mouseEvent;
                    this.dragSource.dragItem.setMoving(true);
                    this.dragItem = this.dragSource.dragItem;
                    this.lastDropTarget = this.dragSource.dragSourceDropTarget;
                    this.createGhost();
                }
                onDragStop(mouseEvent) {
                    this.logger.log('onDragStop');
                    this.eventLastTime = null;
                    this.dragging = false;
                    this.dragItem.setMoving(false);
                    if (this.lastDropTarget && this.lastDropTarget.onDragStop) {
                        var draggingEvent = this.createDropTargetEvent(this.lastDropTarget, mouseEvent, null);
                        this.lastDropTarget.onDragStop(draggingEvent);
                    }
                    this.lastDropTarget = null;
                    this.dragItem = null;
                    this.removeGhost();
                }
                onDragging(mouseEvent) {
                    var direction = this.workOutDirection(mouseEvent);
                    this.eventLastTime = mouseEvent;
                    this.positionGhost(mouseEvent);
                    // check if mouseEvent intersects with any of the drop targets
                    var dropTarget = utils_1.Utils.find(this.dropTargets, (dropTarget) => {
                        var targetsToCheck = [dropTarget.eContainer];
                        if (dropTarget.eSecondaryContainers) {
                            targetsToCheck = targetsToCheck.concat(dropTarget.eSecondaryContainers);
                        }
                        var gotMatch = false;
                        targetsToCheck.forEach((eContainer) => {
                            if (!eContainer) {
                                return;
                            } // secondary can be missing
                            var rect = eContainer.getBoundingClientRect();
                            // if element is not visible, then width and height are zero
                            if (rect.width === 0 || rect.height === 0) {
                                return;
                            }
                            var horizontalFit = mouseEvent.clientX >= rect.left && mouseEvent.clientX <= rect.right;
                            var verticalFit = mouseEvent.clientY >= rect.top && mouseEvent.clientY <= rect.bottom;
                            //console.log(`rect.width = ${rect.width} || rect.height = ${rect.height} ## verticalFit = ${verticalFit}, horizontalFit = ${horizontalFit}, `);
                            if (horizontalFit && verticalFit) {
                                gotMatch = true;
                            }
                        });
                        return gotMatch;
                    });
                    if (dropTarget !== this.lastDropTarget) {
                        if (this.lastDropTarget) {
                            this.logger.log('onDragLeave');
                            var dragLeaveEvent = this.createDropTargetEvent(this.lastDropTarget, mouseEvent, direction);
                            this.lastDropTarget.onDragLeave(dragLeaveEvent);
                            this.setGhostIcon(null);
                        }
                        if (dropTarget) {
                            this.logger.log('onDragEnter');
                            var dragEnterEvent = this.createDropTargetEvent(dropTarget, mouseEvent, direction);
                            dropTarget.onDragEnter(dragEnterEvent);
                            this.setGhostIcon(dropTarget.iconName);
                        }
                        this.lastDropTarget = dropTarget;
                    }
                    else if (dropTarget) {
                        var draggingEvent = this.createDropTargetEvent(dropTarget, mouseEvent, direction);
                        dropTarget.onDragging(draggingEvent);
                    }
                }
                addDropTarget(dropTarget) {
                    this.dropTargets.push(dropTarget);
                }
                workOutDirection(event) {
                    var direction;
                    if (this.eventLastTime.clientX > event.clientX) {
                        direction = DragAndDropService_1.DIRECTION_LEFT;
                    }
                    else if (this.eventLastTime.clientX < event.clientX) {
                        direction = DragAndDropService_1.DIRECTION_RIGHT;
                    }
                    else {
                        direction = null;
                    }
                    return direction;
                }
                createDropTargetEvent(dropTarget, event, direction) {
                    // localise x and y to the target component
                    var rect = dropTarget.eContainer.getBoundingClientRect();
                    var x = event.clientX - rect.left;
                    var y = event.clientY - rect.top;
                    var dropTargetEvent = {
                        event: event,
                        x: x,
                        y: y,
                        direction: direction,
                        dragItem: this.dragItem,
                        dragSource: this.dragSource
                    };
                    return dropTargetEvent;
                }
                positionGhost(event) {
                    var ghostRect = this.eGhost.getBoundingClientRect();
                    var ghostHeight = ghostRect.height;
                    // for some reason, without the '-2', it still overlapped by 1 or 2 pixels, which
                    // then brought in scrollbars to the browser. no idea why, but putting in -2 here
                    // works around it which is good enough for me.
                    var browserWidth = utils_1.Utils.getBodyWidth() - 2;
                    var browserHeight = utils_1.Utils.getBodyHeight() - 2;
                    // put ghost vertically in middle of cursor
                    var top = event.pageY - (ghostHeight / 2);
                    // horizontally, place cursor just right of icon
                    var left = event.pageX - 30;
                    // check ghost is not positioned outside of the browser
                    if (browserWidth > 0) {
                        if ((left + this.eGhost.clientWidth) > browserWidth) {
                            left = browserWidth - this.eGhost.clientWidth;
                        }
                    }
                    if (left < 0) {
                        left = 0;
                    }
                    if (browserHeight > 0) {
                        if ((top + this.eGhost.clientHeight) > browserHeight) {
                            top = browserHeight - this.eGhost.clientHeight;
                        }
                    }
                    if (top < 0) {
                        top = 0;
                    }
                    this.eGhost.style.left = left + 'px';
                    this.eGhost.style.top = top + 'px';
                }
                removeGhost() {
                    if (this.eGhost) {
                        this.eBody.removeChild(this.eGhost);
                    }
                    this.eGhost = null;
                }
                createGhost() {
                    this.eGhost = utils_1.Utils.loadTemplate(headerTemplateLoader_1.HeaderTemplateLoader.HEADER_CELL_DND_TEMPLATE);
                    this.eGhostIcon = this.eGhost.querySelector('#eGhostIcon');
                    if (this.lastDropTarget) {
                        this.setGhostIcon(this.lastDropTarget.iconName);
                    }
                    var dragItem = this.dragSource.dragItem;
                    var eText = this.eGhost.querySelector('#agText');
                    eText.innerHTML = this.getNameForGhost(dragItem);
                    this.eGhost.style.width = this.getActualWidth(dragItem) + 'px';
                    this.eGhost.style.height = this.gridOptionsWrapper.getHeaderHeight() + 'px';
                    this.eGhost.style.top = '20px';
                    this.eGhost.style.left = '20px';
                    this.eBody.appendChild(this.eGhost);
                }
                getActualWidth(dragItem) {
                    if (dragItem instanceof column_1.Column) {
                        return dragItem.getActualWidth();
                    }
                    else {
                        return dragItem.getActualWidth();
                    }
                }
                getNameForGhost(dragItem) {
                    if (dragItem instanceof column_1.Column) {
                        var column = dragItem;
                        if (column.getColDef().headerName) {
                            return column.getColDef().headerName;
                        }
                        else {
                            return column.getColId();
                        }
                    }
                    else {
                        var columnGroup = dragItem;
                        if (columnGroup.getColGroupDef().headerName) {
                            return columnGroup.getColGroupDef().headerName;
                        }
                        else {
                            return columnGroup.getGroupId();
                        }
                    }
                }
                setGhostIcon(iconName, shake = false) {
                    utils_1.Utils.removeAllChildren(this.eGhostIcon);
                    var eIcon;
                    switch (iconName) {
                        case DragAndDropService_1.ICON_ADD:
                            eIcon = this.ePlusIcon;
                            break;
                        case DragAndDropService_1.ICON_PINNED:
                            eIcon = this.ePinnedIcon;
                            break;
                        case DragAndDropService_1.ICON_MOVE:
                            eIcon = this.eMoveIcon;
                            break;
                        case DragAndDropService_1.ICON_LEFT:
                            eIcon = this.eLeftIcon;
                            break;
                        case DragAndDropService_1.ICON_RIGHT:
                            eIcon = this.eRightIcon;
                            break;
                        case DragAndDropService_1.ICON_GROUP:
                            eIcon = this.eGroupIcon;
                            break;
                        default:
                            eIcon = this.eHiddenIcon;
                            break;
                    }
                    this.eGhostIcon.appendChild(eIcon);
                    utils_1.Utils.addOrRemoveCssClass(this.eGhostIcon, 'ag-shake-left-to-right', shake);
                }
            };
            DragAndDropService.DIRECTION_LEFT = 'left';
            DragAndDropService.DIRECTION_RIGHT = 'right';
            DragAndDropService.ICON_PINNED = 'pinned';
            DragAndDropService.ICON_ADD = 'add';
            DragAndDropService.ICON_MOVE = 'move';
            DragAndDropService.ICON_LEFT = 'left';
            DragAndDropService.ICON_RIGHT = 'right';
            DragAndDropService.ICON_GROUP = 'group';
            __decorate([
                context_4.Autowired('gridOptionsWrapper'), 
                __metadata('design:type', gridOptionsWrapper_1.GridOptionsWrapper)
            ], DragAndDropService.prototype, "gridOptionsWrapper", void 0);
            __decorate([
                context_4.Autowired('dragService'), 
                __metadata('design:type', dragService_1.DragService)
            ], DragAndDropService.prototype, "dragService", void 0);
            __decorate([
                __param(0, context_2.Qualifier('loggerFactory')), 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', [logger_1.LoggerFactory]), 
                __metadata('design:returntype', void 0)
            ], DragAndDropService.prototype, "setBeans", null);
            DragAndDropService = DragAndDropService_1 = __decorate([
                context_3.Bean('dragAndDropService'), 
                __metadata('design:paramtypes', [])
            ], DragAndDropService);
            exports_1("DragAndDropService", DragAndDropService);
        }
    }
});
//# sourceMappingURL=dragAndDropService.js.map