System.register(["../../constants", "../../widgets/component"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var constants_1, component_1;
    var StartState, TextCellEditor;
    return {
        setters:[
            function (constants_1_1) {
                constants_1 = constants_1_1;
            },
            function (component_1_1) {
                component_1 = component_1_1;
            }],
        execute: function() {
            (function (StartState) {
                StartState[StartState["HighlightAll"] = 0] = "HighlightAll";
                StartState[StartState["CursorAtEnd"] = 1] = "CursorAtEnd";
            })(StartState || (StartState = {}));
            class TextCellEditor extends component_1.Component {
                constructor() {
                    super(TextCellEditor.TEMPLATE);
                }
                init(params) {
                    var eInput = this.getGui();
                    var startValue;
                    var keyPressBackspaceOrDelete = params.keyPress === constants_1.Constants.KEY_BACKSPACE
                        || params.keyPress === constants_1.Constants.KEY_DELETE;
                    if (keyPressBackspaceOrDelete) {
                        startValue = '';
                    }
                    else if (params.charPress) {
                        startValue = params.charPress;
                    }
                    else {
                        startValue = params.value;
                        if (params.keyPress === constants_1.Constants.KEY_F2) {
                            this.putCursorAtEndOnFocus = true;
                        }
                        else {
                            this.highlightAllOnFocus = true;
                        }
                    }
                    eInput.value = startValue;
                }
                afterGuiAttached() {
                    var eInput = this.getGui();
                    eInput.focus();
                    if (this.highlightAllOnFocus) {
                        eInput.select();
                    }
                    else {
                        // when we started editing, we want the carot at the end, not the start.
                        // this comes into play in two scenarios: a) when user hits F2 and b)
                        // when user hits a printable character, then on IE (and only IE) the carot
                        // was placed after the first character, thus 'apply' would end up as 'pplea'
                        var length = eInput.value ? eInput.value.length : 0;
                        if (length > 0) {
                            eInput.setSelectionRange(length, length);
                        }
                    }
                }
                getValue() {
                    var eInput = this.getGui();
                    return eInput.value;
                }
            }
            TextCellEditor.TEMPLATE = '<input class="ag-cell-edit-input" type="text"/>';
            exports_1("TextCellEditor", TextCellEditor);
        }
    }
});
//# sourceMappingURL=textCellEditor.js.map