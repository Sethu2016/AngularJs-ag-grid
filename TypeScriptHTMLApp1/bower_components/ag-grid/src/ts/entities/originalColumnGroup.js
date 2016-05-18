System.register(["./columnGroup", "./column"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var columnGroup_1, column_1;
    var OriginalColumnGroup;
    return {
        setters:[
            function (columnGroup_1_1) {
                columnGroup_1 = columnGroup_1_1;
            },
            function (column_1_1) {
                column_1 = column_1_1;
            }],
        execute: function() {
            class OriginalColumnGroup {
                constructor(colGroupDef, groupId) {
                    this.expandable = false;
                    this.expanded = false;
                    this.colGroupDef = colGroupDef;
                    this.groupId = groupId;
                }
                setExpanded(expanded) {
                    this.expanded = expanded;
                }
                isExpandable() {
                    return this.expandable;
                }
                isExpanded() {
                    return this.expanded;
                }
                getGroupId() {
                    return this.groupId;
                }
                getId() {
                    return this.getGroupId();
                }
                setChildren(children) {
                    this.children = children;
                }
                getChildren() {
                    return this.children;
                }
                getColGroupDef() {
                    return this.colGroupDef;
                }
                getLeafColumns() {
                    var result = [];
                    this.addLeafColumns(result);
                    return result;
                }
                addLeafColumns(leafColumns) {
                    this.children.forEach((child) => {
                        if (child instanceof column_1.Column) {
                            leafColumns.push(child);
                        }
                        else if (child instanceof OriginalColumnGroup) {
                            child.addLeafColumns(leafColumns);
                        }
                    });
                }
                getColumnGroupShow() {
                    if (this.colGroupDef) {
                        return this.colGroupDef.columnGroupShow;
                    }
                    else {
                        // if there is no col def, then this must be a padding
                        // group, which means we have exactly only child. we then
                        // take the value from the child and push it up, making
                        // this group 'invisible'.
                        return this.children[0].getColumnGroupShow();
                    }
                }
                // need to check that this group has at least one col showing when both expanded and contracted.
                // if not, then we don't allow expanding and contracting on this group
                calculateExpandable() {
                    // want to make sure the group doesn't disappear when it's open
                    var atLeastOneShowingWhenOpen = false;
                    // want to make sure the group doesn't disappear when it's closed
                    var atLeastOneShowingWhenClosed = false;
                    // want to make sure the group has something to show / hide
                    var atLeastOneChangeable = false;
                    for (var i = 0, j = this.children.length; i < j; i++) {
                        var abstractColumn = this.children[i];
                        // if the abstractColumn is a grid generated group, there will be no colDef
                        var headerGroupShow = abstractColumn.getColumnGroupShow();
                        if (headerGroupShow === columnGroup_1.ColumnGroup.HEADER_GROUP_SHOW_OPEN) {
                            atLeastOneShowingWhenOpen = true;
                            atLeastOneChangeable = true;
                        }
                        else if (headerGroupShow === columnGroup_1.ColumnGroup.HEADER_GROUP_SHOW_CLOSED) {
                            atLeastOneShowingWhenClosed = true;
                            atLeastOneChangeable = true;
                        }
                        else {
                            atLeastOneShowingWhenOpen = true;
                            atLeastOneShowingWhenClosed = true;
                        }
                    }
                    this.expandable = atLeastOneShowingWhenOpen && atLeastOneShowingWhenClosed && atLeastOneChangeable;
                }
            }
            exports_1("OriginalColumnGroup", OriginalColumnGroup);
        }
    }
});
//# sourceMappingURL=originalColumnGroup.js.map