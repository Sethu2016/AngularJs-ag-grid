System.register(["../context/context", '../utils', "../gridOptionsWrapper", "../eventService", "../expressionService", "../selectionRendererFactory", "./cellRenderers/animateSlideCellRenderer", "./cellRenderers/animateShowChangeCellRenderer", "./cellRenderers/groupCellRenderer"], function(exports_1, context_1) {
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
    var context_2, utils_1, gridOptionsWrapper_1, eventService_1, expressionService_1, selectionRendererFactory_1, animateSlideCellRenderer_1, animateShowChangeCellRenderer_1, groupCellRenderer_1;
    var CellRendererFactory;
    return {
        setters:[
            function (context_2_1) {
                context_2 = context_2_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (gridOptionsWrapper_1_1) {
                gridOptionsWrapper_1 = gridOptionsWrapper_1_1;
            },
            function (eventService_1_1) {
                eventService_1 = eventService_1_1;
            },
            function (expressionService_1_1) {
                expressionService_1 = expressionService_1_1;
            },
            function (selectionRendererFactory_1_1) {
                selectionRendererFactory_1 = selectionRendererFactory_1_1;
            },
            function (animateSlideCellRenderer_1_1) {
                animateSlideCellRenderer_1 = animateSlideCellRenderer_1_1;
            },
            function (animateShowChangeCellRenderer_1_1) {
                animateShowChangeCellRenderer_1 = animateShowChangeCellRenderer_1_1;
            },
            function (groupCellRenderer_1_1) {
                groupCellRenderer_1 = groupCellRenderer_1_1;
            }],
        execute: function() {
            let CellRendererFactory_1;
            let CellRendererFactory = CellRendererFactory_1 = class CellRendererFactory {
                constructor() {
                    this.cellRendererMap = {};
                }
                init() {
                    this.cellRendererMap[CellRendererFactory_1.ANIMATE_SLIDE] = animateSlideCellRenderer_1.AnimateSlideCellRenderer;
                    this.cellRendererMap[CellRendererFactory_1.ANIMATE_SHOW_CHANGE] = animateShowChangeCellRenderer_1.AnimateShowChangeCellRenderer;
                    this.cellRendererMap[CellRendererFactory_1.GROUP] = groupCellRenderer_1.GroupCellRenderer;
                    // this.registerRenderersFromGridOptions();
                }
                // private registerRenderersFromGridOptions(): void {
                //     var userProvidedCellRenderers = this.gridOptionsWrapper.getCellRenderers();
                //     _.iterateObject(userProvidedCellRenderers, (key: string, cellRenderer: {new(): ICellRenderer} | ICellRendererFunc)=> {
                //         this.addCellRenderer(key, cellRenderer);
                //     });
                // }
                addCellRenderer(key, cellRenderer) {
                    this.cellRendererMap[key] = cellRenderer;
                }
                getCellRenderer(key) {
                    var result = this.cellRendererMap[key];
                    if (utils_1.Utils.missing(result)) {
                        console.warn('ag-Grid: unable to find cellRenderer for key ' + key);
                        return null;
                    }
                    return result;
                }
            };
            CellRendererFactory.ANIMATE_SLIDE = 'animateSlide';
            CellRendererFactory.ANIMATE_SHOW_CHANGE = 'animateShowChange';
            CellRendererFactory.GROUP = 'group';
            __decorate([
                context_2.Autowired('gridOptionsWrapper'), 
                __metadata('design:type', gridOptionsWrapper_1.GridOptionsWrapper)
            ], CellRendererFactory.prototype, "gridOptionsWrapper", void 0);
            __decorate([
                context_2.Autowired('selectionRendererFactory'), 
                __metadata('design:type', selectionRendererFactory_1.SelectionRendererFactory)
            ], CellRendererFactory.prototype, "selectionRendererFactory", void 0);
            __decorate([
                context_2.Autowired('expressionService'), 
                __metadata('design:type', expressionService_1.ExpressionService)
            ], CellRendererFactory.prototype, "expressionService", void 0);
            __decorate([
                context_2.Autowired('eventService'), 
                __metadata('design:type', eventService_1.EventService)
            ], CellRendererFactory.prototype, "eventService", void 0);
            __decorate([
                context_2.PostConstruct, 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], CellRendererFactory.prototype, "init", null);
            CellRendererFactory = CellRendererFactory_1 = __decorate([
                context_2.Bean('cellRendererFactory'), 
                __metadata('design:paramtypes', [])
            ], CellRendererFactory);
            exports_1("CellRendererFactory", CellRendererFactory);
        }
    }
});
//# sourceMappingURL=cellRendererFactory.js.map