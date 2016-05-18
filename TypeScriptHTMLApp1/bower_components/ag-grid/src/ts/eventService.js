System.register(["./logger", './utils', "./context/context"], function(exports_1, context_1) {
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
    var logger_1, utils_1, context_2, context_3;
    var EventService;
    return {
        setters:[
            function (logger_1_1) {
                logger_1 = logger_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (context_2_1) {
                context_2 = context_2_1;
                context_3 = context_2_1;
            }],
        execute: function() {
            let EventService_1;
            let EventService = EventService_1 = class EventService {
                constructor() {
                    this.allListeners = {};
                    this.globalListeners = [];
                }
                agWire(loggerFactory, globalEventListener = null) {
                    this.logger = loggerFactory.create('EventService');
                    if (globalEventListener) {
                        this.addGlobalListener(globalEventListener);
                    }
                }
                getListenerList(eventType) {
                    var listenerList = this.allListeners[eventType];
                    if (!listenerList) {
                        listenerList = [];
                        this.allListeners[eventType] = listenerList;
                    }
                    return listenerList;
                }
                addEventListener(eventType, listener) {
                    var listenerList = this.getListenerList(eventType);
                    if (listenerList.indexOf(listener) < 0) {
                        listenerList.push(listener);
                    }
                }
                // for some events, it's important that the model gets to hear about them before the view,
                // as the model may need to update before the view works on the info. if you register
                // via this method, you get notified before the view parts
                addModalPriorityEventListener(eventType, listener) {
                    this.addEventListener(eventType + EventService_1.PRIORITY, listener);
                }
                addGlobalListener(listener) {
                    this.globalListeners.push(listener);
                }
                removeEventListener(eventType, listener) {
                    var listenerList = this.getListenerList(eventType);
                    utils_1.Utils.removeFromArray(listenerList, listener);
                }
                removeGlobalListener(listener) {
                    utils_1.Utils.removeFromArray(this.globalListeners, listener);
                }
                // why do we pass the type here? the type is in ColumnChangeEvent, so unless the
                // type is not in other types of events???
                dispatchEvent(eventType, event) {
                    if (!event) {
                        event = {};
                    }
                    //this.logger.log('dispatching: ' + event);
                    // this allows the columnController to get events before anyone else
                    var p1ListenerList = this.getListenerList(eventType + EventService_1.PRIORITY);
                    p1ListenerList.forEach((listener) => {
                        listener(event);
                    });
                    var listenerList = this.getListenerList(eventType);
                    listenerList.forEach((listener) => {
                        listener(event);
                    });
                    this.globalListeners.forEach((listener) => {
                        listener(eventType, event);
                    });
                }
            };
            EventService.PRIORITY = '-P1';
            __decorate([
                __param(0, context_3.Qualifier('loggerFactory')),
                __param(1, context_3.Qualifier('globalEventListener')), 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', [logger_1.LoggerFactory, Function]), 
                __metadata('design:returntype', void 0)
            ], EventService.prototype, "agWire", null);
            EventService = EventService_1 = __decorate([
                context_2.Bean('eventService'), 
                __metadata('design:paramtypes', [])
            ], EventService);
            exports_1("EventService", EventService);
        }
    }
});
//# sourceMappingURL=eventService.js.map