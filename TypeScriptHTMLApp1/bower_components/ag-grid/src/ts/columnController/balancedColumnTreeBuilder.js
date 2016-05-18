System.register(['../gridOptionsWrapper', '../logger', '../columnController/columnUtils', "./columnKeyCreator", "../entities/originalColumnGroup", "../entities/column", "../context/context"], function(exports_1, context_1) {
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
    var gridOptionsWrapper_1, logger_1, columnUtils_1, columnKeyCreator_1, originalColumnGroup_1, column_1, context_2, context_3, context_4, context_5;
    var BalancedColumnTreeBuilder;
    return {
        setters:[
            function (gridOptionsWrapper_1_1) {
                gridOptionsWrapper_1 = gridOptionsWrapper_1_1;
            },
            function (logger_1_1) {
                logger_1 = logger_1_1;
            },
            function (columnUtils_1_1) {
                columnUtils_1 = columnUtils_1_1;
            },
            function (columnKeyCreator_1_1) {
                columnKeyCreator_1 = columnKeyCreator_1_1;
            },
            function (originalColumnGroup_1_1) {
                originalColumnGroup_1 = originalColumnGroup_1_1;
            },
            function (column_1_1) {
                column_1 = column_1_1;
            },
            function (context_2_1) {
                context_2 = context_2_1;
                context_3 = context_2_1;
                context_4 = context_2_1;
                context_5 = context_2_1;
            }],
        execute: function() {
            // takes in a list of columns, as specified by the column definitions, and returns column groups
            let BalancedColumnTreeBuilder = class BalancedColumnTreeBuilder {
                setBeans(loggerFactory) {
                    this.logger = loggerFactory.create('BalancedColumnTreeBuilder');
                }
                createBalancedColumnGroups(abstractColDefs) {
                    // column key creator dishes out unique column id's in a deterministic way,
                    // so if we have two grids (that cold be master/slave) with same column definitions,
                    // then this ensures the two grids use identical id's.
                    var columnKeyCreator = new columnKeyCreator_1.ColumnKeyCreator();
                    // create am unbalanced tree that maps the provided definitions
                    var unbalancedTree = this.recursivelyCreateColumns(abstractColDefs, 0, columnKeyCreator);
                    var treeDept = this.findMaxDept(unbalancedTree, 0);
                    this.logger.log('Number of levels for grouped columns is ' + treeDept);
                    var balancedTree = this.balanceColumnTree(unbalancedTree, 0, treeDept, columnKeyCreator);
                    this.columnUtils.deptFirstOriginalTreeSearch(balancedTree, (child) => {
                        if (child instanceof originalColumnGroup_1.OriginalColumnGroup) {
                            child.calculateExpandable();
                        }
                    });
                    return {
                        balancedTree: balancedTree,
                        treeDept: treeDept
                    };
                }
                balanceColumnTree(unbalancedTree, currentDept, columnDept, columnKeyCreator) {
                    var result = [];
                    // go through each child, for groups, recurse a level deeper,
                    // for columns we need to pad
                    unbalancedTree.forEach((child) => {
                        if (child instanceof originalColumnGroup_1.OriginalColumnGroup) {
                            var originalGroup = child;
                            var newChildren = this.balanceColumnTree(originalGroup.getChildren(), currentDept + 1, columnDept, columnKeyCreator);
                            originalGroup.setChildren(newChildren);
                            result.push(originalGroup);
                        }
                        else {
                            var newChild = child;
                            for (var i = columnDept - 1; i >= currentDept; i--) {
                                var newColId = columnKeyCreator.getUniqueKey(null, null);
                                var paddedGroup = new originalColumnGroup_1.OriginalColumnGroup(null, newColId);
                                paddedGroup.setChildren([newChild]);
                                newChild = paddedGroup;
                            }
                            result.push(newChild);
                        }
                    });
                    return result;
                }
                findMaxDept(treeChildren, dept) {
                    var maxDeptThisLevel = dept;
                    for (var i = 0; i < treeChildren.length; i++) {
                        var abstractColumn = treeChildren[i];
                        if (abstractColumn instanceof originalColumnGroup_1.OriginalColumnGroup) {
                            var originalGroup = abstractColumn;
                            var newDept = this.findMaxDept(originalGroup.getChildren(), dept + 1);
                            if (maxDeptThisLevel < newDept) {
                                maxDeptThisLevel = newDept;
                            }
                        }
                    }
                    return maxDeptThisLevel;
                }
                recursivelyCreateColumns(abstractColDefs, level, columnKeyCreator) {
                    var result = [];
                    if (!abstractColDefs) {
                        return result;
                    }
                    abstractColDefs.forEach((abstractColDef) => {
                        this.checkForDeprecatedItems(abstractColDef);
                        if (this.isColumnGroup(abstractColDef)) {
                            var groupColDef = abstractColDef;
                            var groupId = columnKeyCreator.getUniqueKey(groupColDef.groupId, null);
                            var originalGroup = new originalColumnGroup_1.OriginalColumnGroup(groupColDef, groupId);
                            var children = this.recursivelyCreateColumns(groupColDef.children, level + 1, columnKeyCreator);
                            originalGroup.setChildren(children);
                            result.push(originalGroup);
                        }
                        else {
                            var colDef = abstractColDef;
                            var colId = columnKeyCreator.getUniqueKey(colDef.colId, colDef.field);
                            var column = new column_1.Column(colDef, colId);
                            this.context.wireBean(column);
                            result.push(column);
                        }
                    });
                    return result;
                }
                checkForDeprecatedItems(colDef) {
                    if (colDef) {
                        var colDefNoType = colDef; // take out the type, so we can access attributes not defined in the type
                        if (colDefNoType.group !== undefined) {
                            console.warn('ag-grid: colDef.group is invalid, please check documentation on how to do grouping as it changed in version 3');
                        }
                        if (colDefNoType.headerGroup !== undefined) {
                            console.warn('ag-grid: colDef.headerGroup is invalid, please check documentation on how to do grouping as it changed in version 3');
                        }
                        if (colDefNoType.headerGroupShow !== undefined) {
                            console.warn('ag-grid: colDef.headerGroupShow is invalid, should be columnGroupShow, please check documentation on how to do grouping as it changed in version 3');
                        }
                    }
                }
                // if object has children, we assume it's a group
                isColumnGroup(abstractColDef) {
                    return abstractColDef.children !== undefined;
                }
            };
            __decorate([
                context_4.Autowired('gridOptionsWrapper'), 
                __metadata('design:type', gridOptionsWrapper_1.GridOptionsWrapper)
            ], BalancedColumnTreeBuilder.prototype, "gridOptionsWrapper", void 0);
            __decorate([
                context_4.Autowired('columnUtils'), 
                __metadata('design:type', columnUtils_1.ColumnUtils)
            ], BalancedColumnTreeBuilder.prototype, "columnUtils", void 0);
            __decorate([
                context_4.Autowired('context'), 
                __metadata('design:type', context_5.Context)
            ], BalancedColumnTreeBuilder.prototype, "context", void 0);
            __decorate([
                __param(0, context_3.Qualifier('loggerFactory')), 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', [logger_1.LoggerFactory]), 
                __metadata('design:returntype', void 0)
            ], BalancedColumnTreeBuilder.prototype, "setBeans", null);
            BalancedColumnTreeBuilder = __decorate([
                context_2.Bean('balancedColumnTreeBuilder'), 
                __metadata('design:paramtypes', [])
            ], BalancedColumnTreeBuilder);
            exports_1("BalancedColumnTreeBuilder", BalancedColumnTreeBuilder);
        }
    }
});
//# sourceMappingURL=balancedColumnTreeBuilder.js.map