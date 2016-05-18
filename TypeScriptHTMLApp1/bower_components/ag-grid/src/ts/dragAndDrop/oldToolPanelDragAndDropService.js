System.register(['../utils', "../logger", "../context/context"], function(exports_1, context_1) {
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
    var utils_1, logger_1, context_2, context_3;
    var OldToolPanelDragAndDropService;
    return {
        setters:[
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (logger_1_1) {
                logger_1 = logger_1_1;
            },
            function (context_2_1) {
                context_2 = context_2_1;
                context_3 = context_2_1;
            }],
        execute: function() {
            /** Functionality for internal DnD functionality between GUI widgets. Eg this service is used to drag columns
             * from the 'available columns' list and putting them into the 'grouped columns' in the tool panel.
             * This service is NOT used by the column headers for resizing and moving, that is a different use case. */
            let OldToolPanelDragAndDropService = class OldToolPanelDragAndDropService {
                constructor() {
                    this.destroyFunctions = [];
                }
                agWire(loggerFactory) {
                    this.logger = loggerFactory.create('OldToolPanelDragAndDropService');
                    // need to clean this up, add to 'finished' logic in grid
                    var mouseUpListener = this.stopDragging.bind(this);
                    document.addEventListener('mouseup', mouseUpListener);
                    this.destroyFunctions.push(() => { document.removeEventListener('mouseup', mouseUpListener); });
                }
                destroy() {
                    this.destroyFunctions.forEach(func => func());
                    document.removeEventListener('mouseup', this.mouseUpEventListener);
                }
                stopDragging() {
                    if (this.dragItem) {
                        this.setDragCssClasses(this.dragItem.eDragSource, false);
                        this.dragItem = null;
                    }
                }
                setDragCssClasses(eListItem, dragging) {
                    utils_1.Utils.addOrRemoveCssClass(eListItem, 'ag-dragging', dragging);
                    utils_1.Utils.addOrRemoveCssClass(eListItem, 'ag-not-dragging', !dragging);
                }
                addDragSource(eDragSource, dragSourceCallback) {
                    this.setDragCssClasses(eDragSource, false);
                    eDragSource.addEventListener('mousedown', this.onMouseDownDragSource.bind(this, eDragSource, dragSourceCallback));
                }
                onMouseDownDragSource(eDragSource, dragSourceCallback) {
                    if (this.dragItem) {
                        this.stopDragging();
                    }
                    var data;
                    if (dragSourceCallback.getData) {
                        data = dragSourceCallback.getData();
                    }
                    var containerId;
                    if (dragSourceCallback.getContainerId) {
                        containerId = dragSourceCallback.getContainerId();
                    }
                    this.dragItem = {
                        eDragSource: eDragSource,
                        data: data,
                        containerId: containerId
                    };
                    this.setDragCssClasses(this.dragItem.eDragSource, true);
                }
                addDropTarget(eDropTarget, dropTargetCallback) {
                    var mouseIn = false;
                    var acceptDrag = false;
                    eDropTarget.addEventListener('mouseover', () => {
                        if (!mouseIn) {
                            mouseIn = true;
                            if (this.dragItem) {
                                acceptDrag = dropTargetCallback.acceptDrag(this.dragItem);
                            }
                            else {
                                acceptDrag = false;
                            }
                        }
                    });
                    eDropTarget.addEventListener('mouseout', () => {
                        if (acceptDrag) {
                            dropTargetCallback.noDrop();
                        }
                        mouseIn = false;
                        acceptDrag = false;
                    });
                    eDropTarget.addEventListener('mouseup', () => {
                        // dragItem should never be null, checking just in case
                        if (acceptDrag && this.dragItem) {
                            dropTargetCallback.drop(this.dragItem);
                        }
                    });
                }
            };
            __decorate([
                __param(0, context_3.Qualifier('loggerFactory')), 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', [logger_1.LoggerFactory]), 
                __metadata('design:returntype', void 0)
            ], OldToolPanelDragAndDropService.prototype, "agWire", null);
            __decorate([
                context_2.PreDestroy, 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], OldToolPanelDragAndDropService.prototype, "destroy", null);
            OldToolPanelDragAndDropService = __decorate([
                context_2.Bean('oldToolPanelDragAndDropService'), 
                __metadata('design:paramtypes', [])
            ], OldToolPanelDragAndDropService);
            exports_1("OldToolPanelDragAndDropService", OldToolPanelDragAndDropService);
        }
    }
});
//# sourceMappingURL=oldToolPanelDragAndDropService.js.map