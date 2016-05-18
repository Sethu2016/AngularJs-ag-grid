System.register(["./column", "../eventService"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var column_1, eventService_1;
    var ColumnGroup;
    return {
        setters:[
            function (column_1_1) {
                column_1 = column_1_1;
            },
            function (eventService_1_1) {
                eventService_1 = eventService_1_1;
            }],
        execute: function() {
            class ColumnGroup {
                constructor(originalColumnGroup, groupId, instanceId) {
                    // depends on the open/closed state of the group, only displaying columns are stored here
                    this.displayedChildren = [];
                    this.moving = false;
                    this.eventService = new eventService_1.EventService();
                    this.groupId = groupId;
                    this.instanceId = instanceId;
                    this.originalColumnGroup = originalColumnGroup;
                }
                // returns header name if it exists, otherwise null. if will not exist if
                // this group is a padding group, as they don't have colGroupDef's
                getHeaderName() {
                    if (this.originalColumnGroup.getColGroupDef()) {
                        return this.originalColumnGroup.getColGroupDef().headerName;
                    }
                    else {
                        return null;
                    }
                }
                addEventListener(eventType, listener) {
                    this.eventService.addEventListener(eventType, listener);
                }
                removeEventListener(eventType, listener) {
                    this.eventService.removeEventListener(eventType, listener);
                }
                setMoving(moving) {
                    this.moving = moving;
                    this.eventService.dispatchEvent(column_1.Column.EVENT_MOVING_CHANGED);
                }
                isMoving() {
                    return this.moving;
                }
                getGroupId() {
                    return this.groupId;
                }
                getInstanceId() {
                    return this.instanceId;
                }
                isChildInThisGroupDeepSearch(wantedChild) {
                    var result = false;
                    this.children.forEach((foundChild) => {
                        if (wantedChild === foundChild) {
                            result = true;
                        }
                        if (foundChild instanceof ColumnGroup) {
                            if (foundChild.isChildInThisGroupDeepSearch(wantedChild)) {
                                result = true;
                            }
                        }
                    });
                    return result;
                }
                getActualWidth() {
                    var groupActualWidth = 0;
                    if (this.displayedChildren) {
                        this.displayedChildren.forEach((child) => {
                            groupActualWidth += child.getActualWidth();
                        });
                    }
                    return groupActualWidth;
                }
                getMinWidth() {
                    var result = 0;
                    this.displayedChildren.forEach((groupChild) => {
                        result += groupChild.getMinWidth();
                    });
                    return result;
                }
                addChild(child) {
                    if (!this.children) {
                        this.children = [];
                    }
                    this.children.push(child);
                }
                getDisplayedChildren() {
                    return this.displayedChildren;
                }
                getLeafColumns() {
                    var result = [];
                    this.addLeafColumns(result);
                    return result;
                }
                getDisplayedLeafColumns() {
                    var result = [];
                    this.addDisplayedLeafColumns(result);
                    return result;
                }
                // why two methods here doing the same thing?
                getDefinition() {
                    return this.originalColumnGroup.getColGroupDef();
                }
                getColGroupDef() {
                    return this.originalColumnGroup.getColGroupDef();
                }
                isExpandable() {
                    return this.originalColumnGroup.isExpandable();
                }
                isExpanded() {
                    return this.originalColumnGroup.isExpanded();
                }
                setExpanded(expanded) {
                    this.originalColumnGroup.setExpanded(expanded);
                }
                addDisplayedLeafColumns(leafColumns) {
                    this.displayedChildren.forEach((child) => {
                        if (child instanceof column_1.Column) {
                            leafColumns.push(child);
                        }
                        else if (child instanceof ColumnGroup) {
                            child.addDisplayedLeafColumns(leafColumns);
                        }
                    });
                }
                addLeafColumns(leafColumns) {
                    this.children.forEach((child) => {
                        if (child instanceof column_1.Column) {
                            leafColumns.push(child);
                        }
                        else if (child instanceof ColumnGroup) {
                            child.addLeafColumns(leafColumns);
                        }
                    });
                }
                getChildren() {
                    return this.children;
                }
                getColumnGroupShow() {
                    return this.originalColumnGroup.getColumnGroupShow();
                }
                calculateDisplayedColumns() {
                    // clear out last time we calculated
                    this.displayedChildren = [];
                    // it not expandable, everything is visible
                    if (!this.originalColumnGroup.isExpandable()) {
                        this.displayedChildren = this.children;
                        return;
                    }
                    // and calculate again
                    for (var i = 0, j = this.children.length; i < j; i++) {
                        var abstractColumn = this.children[i];
                        var headerGroupShow = abstractColumn.getColumnGroupShow();
                        switch (headerGroupShow) {
                            case ColumnGroup.HEADER_GROUP_SHOW_OPEN:
                                // when set to open, only show col if group is open
                                if (this.originalColumnGroup.isExpanded()) {
                                    this.displayedChildren.push(abstractColumn);
                                }
                                break;
                            case ColumnGroup.HEADER_GROUP_SHOW_CLOSED:
                                // when set to open, only show col if group is open
                                if (!this.originalColumnGroup.isExpanded()) {
                                    this.displayedChildren.push(abstractColumn);
                                }
                                break;
                            default:
                                // default is always show the column
                                this.displayedChildren.push(abstractColumn);
                                break;
                        }
                    }
                }
            }
            ColumnGroup.HEADER_GROUP_SHOW_OPEN = 'open';
            ColumnGroup.HEADER_GROUP_SHOW_CLOSED = 'closed';
            exports_1("ColumnGroup", ColumnGroup);
        }
    }
});
//# sourceMappingURL=columnGroup.js.map