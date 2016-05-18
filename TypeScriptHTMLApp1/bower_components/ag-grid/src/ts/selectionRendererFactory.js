System.register(["./context/context", "./entities/rowNode", "./rendering/renderedRow", './utils'], function(exports_1, context_1) {
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
    var context_2, rowNode_1, renderedRow_1, utils_1;
    var SelectionRendererFactory;
    return {
        setters:[
            function (context_2_1) {
                context_2 = context_2_1;
            },
            function (rowNode_1_1) {
                rowNode_1 = rowNode_1_1;
            },
            function (renderedRow_1_1) {
                renderedRow_1 = renderedRow_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }],
        execute: function() {
            let SelectionRendererFactory = class SelectionRendererFactory {
                createSelectionCheckbox(rowNode, addRenderedRowEventListener) {
                    var eCheckbox = document.createElement('input');
                    eCheckbox.type = "checkbox";
                    eCheckbox.name = "name";
                    eCheckbox.className = 'ag-selection-checkbox';
                    utils_1.Utils.setCheckboxState(eCheckbox, rowNode.isSelected());
                    eCheckbox.addEventListener('click', event => event.stopPropagation());
                    eCheckbox.addEventListener('change', () => {
                        var newValue = eCheckbox.checked;
                        if (newValue) {
                            rowNode.setSelected(newValue);
                        }
                        else {
                            rowNode.setSelected(newValue);
                        }
                    });
                    var selectionChangedCallback = () => utils_1.Utils.setCheckboxState(eCheckbox, rowNode.isSelected());
                    rowNode.addEventListener(rowNode_1.RowNode.EVENT_ROW_SELECTED, selectionChangedCallback);
                    addRenderedRowEventListener(renderedRow_1.RenderedRow.EVENT_RENDERED_ROW_REMOVED, () => {
                        rowNode.removeEventListener(rowNode_1.RowNode.EVENT_ROW_SELECTED, selectionChangedCallback);
                    });
                    return eCheckbox;
                }
            };
            SelectionRendererFactory = __decorate([
                context_2.Bean('selectionRendererFactory'), 
                __metadata('design:paramtypes', [])
            ], SelectionRendererFactory);
            exports_1("SelectionRendererFactory", SelectionRendererFactory);
        }
    }
});
//# sourceMappingURL=selectionRendererFactory.js.map