System.register(["../context/context", '../utils', "./cellEditors/textCellEditor", "./cellEditors/selectCellEditor", "./cellEditors/popupEditorWrapper", "./cellEditors/popupTextCellEditor", "./cellEditors/popupSelectCellEditor", "./cellEditors/dateCellEditor", "../gridOptionsWrapper"], function(exports_1, context_1) {
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
    var context_2, utils_1, textCellEditor_1, selectCellEditor_1, popupEditorWrapper_1, popupTextCellEditor_1, popupSelectCellEditor_1, dateCellEditor_1, gridOptionsWrapper_1;
    var CellEditorFactory;
    return {
        setters:[
            function (context_2_1) {
                context_2 = context_2_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (textCellEditor_1_1) {
                textCellEditor_1 = textCellEditor_1_1;
            },
            function (selectCellEditor_1_1) {
                selectCellEditor_1 = selectCellEditor_1_1;
            },
            function (popupEditorWrapper_1_1) {
                popupEditorWrapper_1 = popupEditorWrapper_1_1;
            },
            function (popupTextCellEditor_1_1) {
                popupTextCellEditor_1 = popupTextCellEditor_1_1;
            },
            function (popupSelectCellEditor_1_1) {
                popupSelectCellEditor_1 = popupSelectCellEditor_1_1;
            },
            function (dateCellEditor_1_1) {
                dateCellEditor_1 = dateCellEditor_1_1;
            },
            function (gridOptionsWrapper_1_1) {
                gridOptionsWrapper_1 = gridOptionsWrapper_1_1;
            }],
        execute: function() {
            let CellEditorFactory_1;
            let CellEditorFactory = CellEditorFactory_1 = class CellEditorFactory {
                constructor() {
                    this.cellEditorMap = {};
                }
                init() {
                    this.cellEditorMap[CellEditorFactory_1.TEXT] = textCellEditor_1.TextCellEditor;
                    this.cellEditorMap[CellEditorFactory_1.SELECT] = selectCellEditor_1.SelectCellEditor;
                    this.cellEditorMap[CellEditorFactory_1.POPUP_TEXT] = popupTextCellEditor_1.PopupTextCellEditor;
                    this.cellEditorMap[CellEditorFactory_1.POPUP_SELECT] = popupSelectCellEditor_1.PopupSelectCellEditor;
                    this.cellEditorMap[CellEditorFactory_1.DATE] = dateCellEditor_1.DateCellEditor;
                }
                addCellEditor(key, cellEditor) {
                    this.cellEditorMap[key] = cellEditor;
                }
                // private registerEditorsFromGridOptions(): void {
                //     var userProvidedCellEditors = this.gridOptionsWrapper.getCellEditors();
                //     _.iterateObject(userProvidedCellEditors, (key: string, cellEditor: {new(): ICellEditor})=> {
                //         this.addCellEditor(key, cellEditor);
                //     });
                // }
                createCellEditor(key) {
                    var CellEditorClass;
                    if (utils_1.Utils.missing(key)) {
                        CellEditorClass = this.cellEditorMap[CellEditorFactory_1.TEXT];
                    }
                    else if (typeof key === 'string') {
                        CellEditorClass = this.cellEditorMap[key];
                        if (utils_1.Utils.missing(CellEditorClass)) {
                            console.warn('ag-Grid: unable to find cellEditor for key ' + key);
                            CellEditorClass = this.cellEditorMap[CellEditorFactory_1.TEXT];
                        }
                    }
                    else {
                        CellEditorClass = key;
                    }
                    var cellEditor = new CellEditorClass();
                    this.context.wireBean(cellEditor);
                    if (cellEditor.isPopup && cellEditor.isPopup()) {
                        cellEditor = new popupEditorWrapper_1.PopupEditorWrapper(cellEditor);
                    }
                    return cellEditor;
                }
            };
            CellEditorFactory.TEXT = 'text';
            CellEditorFactory.SELECT = 'select';
            CellEditorFactory.DATE = 'date';
            CellEditorFactory.POPUP_TEXT = 'popupText';
            CellEditorFactory.POPUP_SELECT = 'popupSelect';
            __decorate([
                context_2.Autowired('context'), 
                __metadata('design:type', context_2.Context)
            ], CellEditorFactory.prototype, "context", void 0);
            __decorate([
                context_2.Autowired('gridOptionsWrapper'), 
                __metadata('design:type', gridOptionsWrapper_1.GridOptionsWrapper)
            ], CellEditorFactory.prototype, "gridOptionsWrapper", void 0);
            __decorate([
                context_2.PostConstruct, 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], CellEditorFactory.prototype, "init", null);
            CellEditorFactory = CellEditorFactory_1 = __decorate([
                context_2.Bean('cellEditorFactory'), 
                __metadata('design:paramtypes', [])
            ], CellEditorFactory);
            exports_1("CellEditorFactory", CellEditorFactory);
        }
    }
});
//# sourceMappingURL=cellEditorFactory.js.map