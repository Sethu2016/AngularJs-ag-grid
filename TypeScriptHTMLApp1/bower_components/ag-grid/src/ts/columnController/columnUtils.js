System.register(["../gridOptionsWrapper", "../entities/columnGroup", "../entities/originalColumnGroup", "../context/context"], function(exports_1, context_1) {
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
    var gridOptionsWrapper_1, columnGroup_1, originalColumnGroup_1, context_2, context_3;
    var ColumnUtils;
    return {
        setters:[
            function (gridOptionsWrapper_1_1) {
                gridOptionsWrapper_1 = gridOptionsWrapper_1_1;
            },
            function (columnGroup_1_1) {
                columnGroup_1 = columnGroup_1_1;
            },
            function (originalColumnGroup_1_1) {
                originalColumnGroup_1 = originalColumnGroup_1_1;
            },
            function (context_2_1) {
                context_2 = context_2_1;
                context_3 = context_2_1;
            }],
        execute: function() {
            // takes in a list of columns, as specified by the column definitions, and returns column groups
            let ColumnUtils = class ColumnUtils {
                calculateColInitialWidth(colDef) {
                    if (!colDef.width) {
                        // if no width defined in colDef, use default
                        return this.gridOptionsWrapper.getColWidth();
                    }
                    else if (colDef.width < this.gridOptionsWrapper.getMinColWidth()) {
                        // if width in col def to small, set to min width
                        return this.gridOptionsWrapper.getMinColWidth();
                    }
                    else {
                        // otherwise use the provided width
                        return colDef.width;
                    }
                }
                getPathForColumn(column, allDisplayedColumnGroups) {
                    var result = [];
                    var found = false;
                    recursePath(allDisplayedColumnGroups, 0);
                    // we should always find the path, but in case there is a bug somewhere, returning null
                    // will make it fail rather than provide a 'hard to track down' bug
                    if (found) {
                        return result;
                    }
                    else {
                        return null;
                    }
                    function recursePath(balancedColumnTree, dept) {
                        for (var i = 0; i < balancedColumnTree.length; i++) {
                            if (found) {
                                // quit the search, so 'result' is kept with the found result
                                return;
                            }
                            var node = balancedColumnTree[i];
                            if (node instanceof columnGroup_1.ColumnGroup) {
                                var nextNode = node;
                                recursePath(nextNode.getChildren(), dept + 1);
                                result[dept] = node;
                            }
                            else {
                                if (node === column) {
                                    found = true;
                                }
                            }
                        }
                    }
                }
                deptFirstOriginalTreeSearch(tree, callback) {
                    if (!tree) {
                        return;
                    }
                    tree.forEach((child) => {
                        if (child instanceof originalColumnGroup_1.OriginalColumnGroup) {
                            this.deptFirstOriginalTreeSearch(child.getChildren(), callback);
                        }
                        callback(child);
                    });
                }
                deptFirstAllColumnTreeSearch(tree, callback) {
                    if (!tree) {
                        return;
                    }
                    tree.forEach((child) => {
                        if (child instanceof columnGroup_1.ColumnGroup) {
                            this.deptFirstAllColumnTreeSearch(child.getChildren(), callback);
                        }
                        callback(child);
                    });
                }
                deptFirstDisplayedColumnTreeSearch(tree, callback) {
                    if (!tree) {
                        return;
                    }
                    tree.forEach((child) => {
                        if (child instanceof columnGroup_1.ColumnGroup) {
                            this.deptFirstDisplayedColumnTreeSearch(child.getDisplayedChildren(), callback);
                        }
                        callback(child);
                    });
                }
            };
            __decorate([
                context_3.Autowired('gridOptionsWrapper'), 
                __metadata('design:type', gridOptionsWrapper_1.GridOptionsWrapper)
            ], ColumnUtils.prototype, "gridOptionsWrapper", void 0);
            ColumnUtils = __decorate([
                context_2.Bean('columnUtils'), 
                __metadata('design:paramtypes', [])
            ], ColumnUtils);
            exports_1("ColumnUtils", ColumnUtils);
        }
    }
});
//# sourceMappingURL=columnUtils.js.map