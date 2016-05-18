System.register(["./gridOptionsWrapper", "./context/context"], function(exports_1, context_1) {
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
    var gridOptionsWrapper_1, context_2, context_3;
    var LoggerFactory, Logger;
    return {
        setters:[
            function (gridOptionsWrapper_1_1) {
                gridOptionsWrapper_1 = gridOptionsWrapper_1_1;
            },
            function (context_2_1) {
                context_2 = context_2_1;
                context_3 = context_2_1;
            }],
        execute: function() {
            let LoggerFactory = class LoggerFactory {
                setBeans(gridOptionsWrapper) {
                    this.logging = gridOptionsWrapper.isDebug();
                }
                create(name) {
                    return new Logger(name, this.logging);
                }
            };
            __decorate([
                __param(0, context_3.Qualifier('gridOptionsWrapper')), 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', [gridOptionsWrapper_1.GridOptionsWrapper]), 
                __metadata('design:returntype', void 0)
            ], LoggerFactory.prototype, "setBeans", null);
            LoggerFactory = __decorate([
                context_2.Bean('loggerFactory'), 
                __metadata('design:paramtypes', [])
            ], LoggerFactory);
            exports_1("LoggerFactory", LoggerFactory);
            class Logger {
                constructor(name, logging) {
                    this.name = name;
                    this.logging = logging;
                }
                log(message) {
                    if (this.logging) {
                        console.log('ag-Grid.' + this.name + ': ' + message);
                    }
                }
            }
            exports_1("Logger", Logger);
        }
    }
});
//# sourceMappingURL=logger.js.map