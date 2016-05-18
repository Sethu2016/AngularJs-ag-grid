System.register(["./gridOptionsWrapper", "./expressionService", "./columnController/columnController", "./context/context", './utils', "./events", "./eventService"], function(exports_1, context_1) {
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
    var gridOptionsWrapper_1, expressionService_1, columnController_1, context_2, context_3, context_4, utils_1, events_1, eventService_1;
    var ValueService;
    return {
        setters:[
            function (gridOptionsWrapper_1_1) {
                gridOptionsWrapper_1 = gridOptionsWrapper_1_1;
            },
            function (expressionService_1_1) {
                expressionService_1 = expressionService_1_1;
            },
            function (columnController_1_1) {
                columnController_1 = columnController_1_1;
            },
            function (context_2_1) {
                context_2 = context_2_1;
                context_3 = context_2_1;
                context_4 = context_2_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (events_1_1) {
                events_1 = events_1_1;
            },
            function (eventService_1_1) {
                eventService_1 = eventService_1_1;
            }],
        execute: function() {
            let ValueService = class ValueService {
                init() {
                    this.suppressDotNotation = this.gridOptionsWrapper.isSuppressFieldDotNotation();
                }
                getValue(column, node) {
                    return this.getValueUsingSpecificData(column, node.data, node);
                }
                getValueUsingSpecificData(column, data, node) {
                    var cellExpressions = this.gridOptionsWrapper.isEnableCellExpressions();
                    var colDef = column.getColDef();
                    var field = colDef.field;
                    var result;
                    // if there is a value getter, this gets precedence over a field
                    if (colDef.valueGetter) {
                        result = this.executeValueGetter(colDef.valueGetter, data, column, node);
                    }
                    else if (field && data) {
                        result = this.getValueUsingField(data, field);
                    }
                    else {
                        result = undefined;
                    }
                    // the result could be an expression itself, if we are allowing cell values to be expressions
                    if (cellExpressions && (typeof result === 'string') && result.indexOf('=') === 0) {
                        var cellValueGetter = result.substring(1);
                        result = this.executeValueGetter(cellValueGetter, data, column, node);
                    }
                    return result;
                }
                getValueUsingField(data, field) {
                    if (!field || !data) {
                        return;
                    }
                    // if no '.', then it's not a deep value
                    if (this.suppressDotNotation || field.indexOf('.') < 0) {
                        return data[field];
                    }
                    else {
                        // otherwise it is a deep value, so need to dig for it
                        var fields = field.split('.');
                        var currentObject = data;
                        for (var i = 0; i < fields.length; i++) {
                            currentObject = currentObject[fields[i]];
                            if (utils_1.Utils.missing(currentObject)) {
                                return null;
                            }
                        }
                        return currentObject;
                    }
                }
                setValue(rowNode, colKey, newValue) {
                    var column = this.columnController.getColumn(colKey);
                    if (!rowNode || !column) {
                        return;
                    }
                    // this will only happen if user is trying to paste into a group row, which doesn't make sense
                    // the user should not be trying to paste into group rows
                    var data = rowNode.data;
                    if (utils_1.Utils.missing(data)) {
                        return;
                    }
                    var field = column.getColDef().field;
                    var newValueHandler = column.getColDef().newValueHandler;
                    // need either a field or a newValueHandler for this to work
                    if (utils_1.Utils.missing(field) && utils_1.Utils.missing(newValueHandler)) {
                        return;
                    }
                    var paramsForCallbacks = {
                        node: rowNode,
                        data: rowNode.data,
                        oldValue: this.getValue(column, rowNode),
                        newValue: newValue,
                        colDef: column.getColDef(),
                        api: this.gridOptionsWrapper.getApi(),
                        context: this.gridOptionsWrapper.getContext()
                    };
                    if (newValueHandler) {
                        newValueHandler(paramsForCallbacks);
                    }
                    else {
                        this.setValueUsingField(data, field, newValue);
                    }
                    // reset quick filter on this row
                    rowNode.resetQuickFilterAggregateText();
                    paramsForCallbacks.newValue = this.getValue(column, rowNode);
                    if (typeof column.getColDef().onCellValueChanged === 'function') {
                        column.getColDef().onCellValueChanged(paramsForCallbacks);
                    }
                    this.eventService.dispatchEvent(events_1.Events.EVENT_CELL_VALUE_CHANGED, paramsForCallbacks);
                }
                setValueUsingField(data, field, newValue) {
                    // if no '.', then it's not a deep value
                    if (this.suppressDotNotation || field.indexOf('.') < 0) {
                        data[field] = newValue;
                    }
                    else {
                        // otherwise it is a deep value, so need to dig for it
                        var fieldPieces = field.split('.');
                        var currentObject = data;
                        while (fieldPieces.length > 0 && currentObject) {
                            let fieldPiece = fieldPieces.shift();
                            if (fieldPieces.length === 0) {
                                currentObject[fieldPiece] = newValue;
                            }
                            else {
                                currentObject = currentObject[fieldPiece];
                            }
                        }
                    }
                }
                executeValueGetter(valueGetter, data, column, node) {
                    var context = this.gridOptionsWrapper.getContext();
                    var api = this.gridOptionsWrapper.getApi();
                    var params = {
                        data: data,
                        node: node,
                        colDef: column.getColDef(),
                        api: api,
                        context: context,
                        getValue: this.getValueCallback.bind(this, data, node)
                    };
                    if (typeof valueGetter === 'function') {
                        // valueGetter is a function, so just call it
                        return valueGetter(params);
                    }
                    else if (typeof valueGetter === 'string') {
                        // valueGetter is an expression, so execute the expression
                        return this.expressionService.evaluate(valueGetter, params);
                    }
                }
                getValueCallback(data, node, field) {
                    var otherColumn = this.columnController.getColumn(field);
                    if (otherColumn) {
                        return this.getValueUsingSpecificData(otherColumn, data, node);
                    }
                    else {
                        return null;
                    }
                }
            };
            __decorate([
                context_3.Autowired('gridOptionsWrapper'), 
                __metadata('design:type', gridOptionsWrapper_1.GridOptionsWrapper)
            ], ValueService.prototype, "gridOptionsWrapper", void 0);
            __decorate([
                context_3.Autowired('expressionService'), 
                __metadata('design:type', expressionService_1.ExpressionService)
            ], ValueService.prototype, "expressionService", void 0);
            __decorate([
                context_3.Autowired('columnController'), 
                __metadata('design:type', columnController_1.ColumnController)
            ], ValueService.prototype, "columnController", void 0);
            __decorate([
                context_3.Autowired('eventService'), 
                __metadata('design:type', eventService_1.EventService)
            ], ValueService.prototype, "eventService", void 0);
            __decorate([
                context_4.PostConstruct, 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], ValueService.prototype, "init", null);
            ValueService = __decorate([
                context_2.Bean('valueService'), 
                __metadata('design:paramtypes', [])
            ], ValueService);
            exports_1("ValueService", ValueService);
        }
    }
});
//# sourceMappingURL=valueService.js.map