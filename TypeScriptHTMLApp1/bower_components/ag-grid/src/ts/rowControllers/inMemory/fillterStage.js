System.register(["../../context/context", "../../gridOptionsWrapper", "../../filter/filterManager"], function(exports_1, context_1) {
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
    var context_2, context_3, gridOptionsWrapper_1, filterManager_1;
    var FilterStage;
    return {
        setters:[
            function (context_2_1) {
                context_2 = context_2_1;
                context_3 = context_2_1;
            },
            function (gridOptionsWrapper_1_1) {
                gridOptionsWrapper_1 = gridOptionsWrapper_1_1;
            },
            function (filterManager_1_1) {
                filterManager_1 = filterManager_1_1;
            }],
        execute: function() {
            let FilterStage = class FilterStage {
                execute(rowsToFilter) {
                    var filterActive;
                    if (this.gridOptionsWrapper.isEnableServerSideFilter()) {
                        filterActive = false;
                    }
                    else {
                        filterActive = this.filterManager.isAnyFilterPresent();
                    }
                    var result;
                    if (filterActive) {
                        result = this.filterItems(rowsToFilter);
                    }
                    else {
                        // do it here
                        result = rowsToFilter;
                        this.recursivelyResetFilter(rowsToFilter);
                    }
                    return result;
                }
                filterItems(rowNodes) {
                    var result = [];
                    for (var i = 0, l = rowNodes.length; i < l; i++) {
                        var node = rowNodes[i];
                        if (node.group) {
                            // deal with group
                            node.childrenAfterFilter = this.filterItems(node.children);
                            if (node.childrenAfterFilter.length > 0) {
                                node.allChildrenCount = this.getTotalChildCount(node.childrenAfterFilter);
                                result.push(node);
                            }
                        }
                        else {
                            if (this.filterManager.doesRowPassFilter(node)) {
                                result.push(node);
                            }
                        }
                    }
                    return result;
                }
                recursivelyResetFilter(nodes) {
                    if (!nodes) {
                        return;
                    }
                    for (var i = 0, l = nodes.length; i < l; i++) {
                        var node = nodes[i];
                        if (node.group && node.children) {
                            node.childrenAfterFilter = node.children;
                            this.recursivelyResetFilter(node.children);
                            node.allChildrenCount = this.getTotalChildCount(node.childrenAfterFilter);
                        }
                    }
                }
                getTotalChildCount(rowNodes) {
                    var count = 0;
                    for (var i = 0, l = rowNodes.length; i < l; i++) {
                        var item = rowNodes[i];
                        if (item.group) {
                            count += item.allChildrenCount;
                        }
                        else {
                            count++;
                        }
                    }
                    return count;
                }
            };
            __decorate([
                context_3.Autowired('gridOptionsWrapper'), 
                __metadata('design:type', gridOptionsWrapper_1.GridOptionsWrapper)
            ], FilterStage.prototype, "gridOptionsWrapper", void 0);
            __decorate([
                context_3.Autowired('filterManager'), 
                __metadata('design:type', filterManager_1.FilterManager)
            ], FilterStage.prototype, "filterManager", void 0);
            FilterStage = __decorate([
                context_2.Bean('filterStage'), 
                __metadata('design:paramtypes', [])
            ], FilterStage);
            exports_1("FilterStage", FilterStage);
        }
    }
});
//# sourceMappingURL=fillterStage.js.map