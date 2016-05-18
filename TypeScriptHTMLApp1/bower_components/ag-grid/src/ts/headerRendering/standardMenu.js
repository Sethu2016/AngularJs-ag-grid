System.register(["../context/context", "../filter/filterManager", '../utils', "../widgets/popupService", "../gridOptionsWrapper"], function(exports_1, context_1) {
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
    var context_2, filterManager_1, utils_1, context_3, popupService_1, gridOptionsWrapper_1;
    var StandardMenuFactory;
    return {
        setters:[
            function (context_2_1) {
                context_2 = context_2_1;
                context_3 = context_2_1;
            },
            function (filterManager_1_1) {
                filterManager_1 = filterManager_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (popupService_1_1) {
                popupService_1 = popupService_1_1;
            },
            function (gridOptionsWrapper_1_1) {
                gridOptionsWrapper_1 = gridOptionsWrapper_1_1;
            }],
        execute: function() {
            let StandardMenuFactory = class StandardMenuFactory {
                showMenuAfterMouseEvent(column, mouseEvent) {
                    this.showPopup(column, (eMenu) => {
                        this.popupService.positionPopupUnderMouseEvent({
                            mouseEvent: mouseEvent,
                            ePopup: eMenu
                        });
                    });
                }
                showMenuAfterButtonClick(column, eventSource) {
                    this.showPopup(column, (eMenu) => {
                        this.popupService.positionPopupUnderComponent({ eventSource: eventSource, ePopup: eMenu, keepWithinBounds: true });
                    });
                }
                showPopup(column, positionCallback) {
                    var filterWrapper = this.filterManager.getOrCreateFilterWrapper(column);
                    var eMenu = document.createElement('div');
                    utils_1.Utils.addCssClass(eMenu, 'ag-menu');
                    eMenu.appendChild(filterWrapper.gui);
                    // need to show filter before positioning, as only after filter
                    // is visible can we find out what the width of it is
                    var hidePopup = this.popupService.addAsModalPopup(eMenu, true);
                    positionCallback(eMenu);
                    if (filterWrapper.filter.afterGuiAttached) {
                        var params = {
                            hidePopup: hidePopup
                        };
                        filterWrapper.filter.afterGuiAttached(params);
                    }
                }
                isMenuEnabled(column) {
                    // for standard, we show menu if filter is enabled, and he menu is not suppressed
                    return this.gridOptionsWrapper.isEnableFilter();
                }
            };
            __decorate([
                context_3.Autowired('filterManager'), 
                __metadata('design:type', filterManager_1.FilterManager)
            ], StandardMenuFactory.prototype, "filterManager", void 0);
            __decorate([
                context_3.Autowired('popupService'), 
                __metadata('design:type', popupService_1.PopupService)
            ], StandardMenuFactory.prototype, "popupService", void 0);
            __decorate([
                context_3.Autowired('gridOptionsWrapper'), 
                __metadata('design:type', gridOptionsWrapper_1.GridOptionsWrapper)
            ], StandardMenuFactory.prototype, "gridOptionsWrapper", void 0);
            StandardMenuFactory = __decorate([
                context_2.Bean('menuFactory'), 
                __metadata('design:paramtypes', [])
            ], StandardMenuFactory);
            exports_1("StandardMenuFactory", StandardMenuFactory);
        }
    }
});
//# sourceMappingURL=standardMenu.js.map