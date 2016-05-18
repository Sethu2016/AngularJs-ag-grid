System.register(["./selectCellEditor"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var selectCellEditor_1;
    var PopupSelectCellEditor;
    return {
        setters:[
            function (selectCellEditor_1_1) {
                selectCellEditor_1 = selectCellEditor_1_1;
            }],
        execute: function() {
            class PopupSelectCellEditor extends selectCellEditor_1.SelectCellEditor {
                isPopup() {
                    return true;
                }
            }
            exports_1("PopupSelectCellEditor", PopupSelectCellEditor);
        }
    }
});
//# sourceMappingURL=popupSelectCellEditor.js.map