System.register(["./textCellEditor"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var textCellEditor_1;
    var PopupTextCellEditor;
    return {
        setters:[
            function (textCellEditor_1_1) {
                textCellEditor_1 = textCellEditor_1_1;
            }],
        execute: function() {
            class PopupTextCellEditor extends textCellEditor_1.TextCellEditor {
                isPopup() {
                    return true;
                }
            }
            exports_1("PopupTextCellEditor", PopupTextCellEditor);
        }
    }
});
//# sourceMappingURL=popupTextCellEditor.js.map