System.register(["../utils", "./gridRow"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var utils_1, gridRow_1;
    var GridCell;
    return {
        setters:[
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (gridRow_1_1) {
                gridRow_1 = gridRow_1_1;
            }],
        execute: function() {
            class GridCell {
                constructor(rowIndex, floating, column) {
                    this.rowIndex = rowIndex;
                    this.column = column;
                    this.floating = utils_1.Utils.makeNull(floating);
                }
                getGridRow() {
                    return new gridRow_1.GridRow(this.rowIndex, this.floating);
                }
                toString() {
                    return `rowIndex = ${this.rowIndex}, floating = ${this.floating}, column = ${this.column ? this.column.getId() : null}`;
                }
                createId() {
                    return `${this.rowIndex}.${this.floating}.${this.column.getId()}`;
                }
            }
            exports_1("GridCell", GridCell);
        }
    }
});
//# sourceMappingURL=gridCell.js.map