System.register(["../constants", '../utils', "./gridCell"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var constants_1, utils_1, gridCell_1;
    var GridRow;
    return {
        setters:[
            function (constants_1_1) {
                constants_1 = constants_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (gridCell_1_1) {
                gridCell_1 = gridCell_1_1;
            }],
        execute: function() {
            class GridRow {
                constructor(rowIndex, floating) {
                    this.rowIndex = rowIndex;
                    this.floating = utils_1.Utils.makeNull(floating);
                }
                isFloatingTop() {
                    return this.floating === constants_1.Constants.FLOATING_TOP;
                }
                isFloatingBottom() {
                    return this.floating === constants_1.Constants.FLOATING_BOTTOM;
                }
                isNotFloating() {
                    return !this.isFloatingBottom() && !this.isFloatingTop();
                }
                equals(otherSelection) {
                    return this.rowIndex === otherSelection.rowIndex
                        && this.floating === otherSelection.floating;
                }
                toString() {
                    return `rowIndex = ${this.rowIndex}, floating = ${this.floating}`;
                }
                getGridCell(column) {
                    return new gridCell_1.GridCell(this.rowIndex, this.floating, column);
                }
                // tests if this row selection is before the other row selection
                before(otherSelection) {
                    var otherFloating = otherSelection.floating;
                    switch (this.floating) {
                        case constants_1.Constants.FLOATING_TOP:
                            // we we are floating top, and other isn't, then we are always before
                            if (otherFloating !== constants_1.Constants.FLOATING_TOP) {
                                return true;
                            }
                            break;
                        case constants_1.Constants.FLOATING_BOTTOM:
                            // if we are floating bottom, and the other isn't, then we are never before
                            if (otherFloating !== constants_1.Constants.FLOATING_BOTTOM) {
                                return false;
                            }
                            break;
                        default:
                            // if we are not floating, but the other one is floating...
                            if (utils_1.Utils.exists(otherFloating)) {
                                if (otherFloating === constants_1.Constants.FLOATING_TOP) {
                                    // we are not floating, other is floating top, we are first
                                    return false;
                                }
                                else {
                                    // we are not floating, other is floating bottom, we are always first
                                    return true;
                                }
                            }
                            break;
                    }
                    return this.rowIndex <= otherSelection.rowIndex;
                }
            }
            exports_1("GridRow", GridRow);
        }
    }
});
//# sourceMappingURL=gridRow.js.map