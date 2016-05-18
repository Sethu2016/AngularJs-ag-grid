System.register(["../../widgets/component", '../../utils'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var component_1, utils_1;
    var SelectCellEditor;
    return {
        setters:[
            function (component_1_1) {
                component_1 = component_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }],
        execute: function() {
            class SelectCellEditor extends component_1.Component {
                constructor() {
                    super('<div class="ag-cell-edit-input"><select class="ag-cell-edit-input"/></div>');
                }
                init(params) {
                    var eSelect = this.getGui().querySelector('select');
                    if (utils_1.Utils.missing(params.values)) {
                        console.log('ag-Grid: no values found for select cellEditor');
                        return;
                    }
                    params.values.forEach((value) => {
                        var option = document.createElement('option');
                        option.value = value;
                        option.text = value;
                        if (params.value === value) {
                            option.selected = true;
                        }
                        eSelect.appendChild(option);
                    });
                    this.addDestroyableEventListener(eSelect, 'change', () => params.stopEditing());
                }
                afterGuiAttached() {
                    var eSelect = this.getGui().querySelector('select');
                    eSelect.focus();
                }
                getValue() {
                    var eSelect = this.getGui().querySelector('select');
                    return eSelect.value;
                }
            }
            exports_1("SelectCellEditor", SelectCellEditor);
        }
    }
});
//# sourceMappingURL=selectCellEditor.js.map