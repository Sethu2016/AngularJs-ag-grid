System.register(["./events"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var events_1;
    var ColumnChangeEvent;
    return {
        setters:[
            function (events_1_1) {
                events_1 = events_1_1;
            }],
        execute: function() {
            class ColumnChangeEvent {
                constructor(type) {
                    this.type = type;
                }
                toString() {
                    var result = 'ColumnChangeEvent {type: ' + this.type;
                    if (this.column) {
                        result += ', column: ' + this.column.getColId();
                    }
                    if (this.columnGroup) {
                        result += ', columnGroup: ' + this.columnGroup.getColGroupDef() ? this.columnGroup.getColGroupDef().headerName : '(not defined]';
                    }
                    if (this.toIndex) {
                        result += ', toIndex: ' + this.toIndex;
                    }
                    if (this.visible) {
                        result += ', visible: ' + this.visible;
                    }
                    if (this.pinned) {
                        result += ', pinned: ' + this.pinned;
                    }
                    if (typeof this.finished == 'boolean') {
                        result += ', finished: ' + this.finished;
                    }
                    result += '}';
                    return result;
                }
                withPinned(pinned) {
                    this.pinned = pinned;
                    return this;
                }
                withVisible(visible) {
                    this.visible = visible;
                    return this;
                }
                isVisible() {
                    return this.visible;
                }
                getPinned() {
                    return this.pinned;
                }
                withColumn(column) {
                    this.column = column;
                    return this;
                }
                withColumns(columns) {
                    this.columns = columns;
                    return this;
                }
                withFinished(finished) {
                    this.finished = finished;
                    return this;
                }
                withColumnGroup(columnGroup) {
                    this.columnGroup = columnGroup;
                    return this;
                }
                withToIndex(toIndex) {
                    this.toIndex = toIndex;
                    return this;
                }
                getToIndex() {
                    return this.toIndex;
                }
                getType() {
                    return this.type;
                }
                getColumn() {
                    return this.column;
                }
                getColumns() {
                    return this.columns;
                }
                getColumnGroup() {
                    return this.columnGroup;
                }
                isPinnedPanelVisibilityImpacted() {
                    return this.type === events_1.Events.EVENT_COLUMN_EVERYTHING_CHANGED ||
                        this.type === events_1.Events.EVENT_COLUMN_GROUP_OPENED ||
                        this.type === events_1.Events.EVENT_COLUMN_VISIBLE ||
                        this.type === events_1.Events.EVENT_COLUMN_PINNED;
                }
                isContainerWidthImpacted() {
                    return this.type === events_1.Events.EVENT_COLUMN_EVERYTHING_CHANGED ||
                        this.type === events_1.Events.EVENT_COLUMN_GROUP_OPENED ||
                        this.type === events_1.Events.EVENT_COLUMN_VISIBLE ||
                        this.type === events_1.Events.EVENT_COLUMN_RESIZED ||
                        this.type === events_1.Events.EVENT_COLUMN_PINNED ||
                        this.type === events_1.Events.EVENT_COLUMN_ROW_GROUP_CHANGE;
                }
                isIndividualColumnResized() {
                    return this.type === events_1.Events.EVENT_COLUMN_RESIZED && this.column !== undefined && this.column !== null;
                }
                isFinished() {
                    return this.finished;
                }
            }
            exports_1("ColumnChangeEvent", ColumnChangeEvent);
        }
    }
});
//# sourceMappingURL=columnChangeEvent.js.map