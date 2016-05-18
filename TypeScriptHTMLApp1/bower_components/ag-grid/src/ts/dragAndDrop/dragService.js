System.register(["../context/context", "../logger", '../utils'], function(exports_1, context_1) {
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
    var context_2, context_3, logger_1, context_4, utils_1;
    var DragService;
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
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }],
        execute: function() {
            let DragService = class DragService {
                constructor() {
                    this.onMouseUpListener = this.onMouseUp.bind(this);
                    this.onMouseMoveListener = this.onMouseMove.bind(this);
                    this.destroyFunctions = [];
                }
                init() {
                    this.logger = this.loggerFactory.create('DragService');
                }
                destroy() {
                    this.destroyFunctions.forEach(func => func());
                }
                addDragSource(params) {
                    var listener = this.onMouseDown.bind(this, params);
                    params.eElement.addEventListener('mousedown', listener);
                    this.destroyFunctions.push(() => params.eElement.removeEventListener('mousedown', listener));
                }
                onMouseDown(params, mouseEvent) {
                    // only interested in left button clicks
                    if (mouseEvent.button !== 0) {
                        return;
                    }
                    this.currentDragParams = params;
                    this.dragging = false;
                    this.eventLastTime = mouseEvent;
                    this.dragStartEvent = mouseEvent;
                    document.addEventListener('mousemove', this.onMouseMoveListener);
                    document.addEventListener('mouseup', this.onMouseUpListener);
                    // see if we want to start dragging straight away
                    if (params.dragStartPixels === 0) {
                        this.onMouseMove(mouseEvent);
                    }
                }
                isEventNearStartEvent(event) {
                    // by default, we wait 4 pixels before starting the drag
                    var requiredPixelDiff = utils_1.Utils.exists(this.currentDragParams.dragStartPixels) ? this.currentDragParams.dragStartPixels : 4;
                    if (requiredPixelDiff === 0) {
                        return false;
                    }
                    var diffX = Math.abs(event.clientX - this.dragStartEvent.clientX);
                    var diffY = Math.abs(event.clientY - this.dragStartEvent.clientY);
                    return Math.max(diffX, diffY) <= requiredPixelDiff;
                }
                onMouseMove(mouseEvent) {
                    if (!this.dragging) {
                        // we want to have moved at least 4px before the drag starts
                        if (this.isEventNearStartEvent(mouseEvent)) {
                            return;
                        }
                        else {
                            this.dragging = true;
                            this.currentDragParams.onDragStart(this.dragStartEvent);
                        }
                    }
                    this.currentDragParams.onDragging(mouseEvent);
                }
                onMouseUp(mouseEvent) {
                    this.logger.log('onMouseUp');
                    document.removeEventListener('mouseup', this.onMouseUpListener);
                    document.removeEventListener('mousemove', this.onMouseMoveListener);
                    if (this.dragging) {
                        this.currentDragParams.onDragStop(mouseEvent);
                    }
                    this.dragStartEvent = null;
                    this.eventLastTime = null;
                    this.dragging = false;
                }
            };
            __decorate([
                context_3.Autowired('loggerFactory'), 
                __metadata('design:type', logger_1.LoggerFactory)
            ], DragService.prototype, "loggerFactory", void 0);
            __decorate([
                context_4.PostConstruct, 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], DragService.prototype, "init", null);
            __decorate([
                context_2.PreDestroy, 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], DragService.prototype, "destroy", null);
            DragService = __decorate([
                context_2.Bean('dragService'), 
                __metadata('design:paramtypes', [])
            ], DragService);
            exports_1("DragService", DragService);
        }
    }
});
//# sourceMappingURL=dragService.js.map