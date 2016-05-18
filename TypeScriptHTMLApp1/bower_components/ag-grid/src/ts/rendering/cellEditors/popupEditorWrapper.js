System.register(["../../widgets/component"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var component_1;
    var PopupEditorWrapper;
    return {
        setters:[
            function (component_1_1) {
                component_1 = component_1_1;
            }],
        execute: function() {
            class PopupEditorWrapper extends component_1.Component {
                constructor(cellEditor) {
                    super('<div class="ag-popup-editor"/>');
                    this.getGuiCalledOnChild = false;
                    this.cellEditor = cellEditor;
                    this.addDestroyFunc(() => cellEditor.destroy());
                    this.addDestroyableEventListener(
                    // this needs to be 'super' and not 'this' as if we call 'this',
                    // it ends up called 'getGui()' on the child before 'init' was called,
                    // which is not good
                    super.getGui(), 'keydown', this.onKeyDown.bind(this));
                }
                onKeyDown(event) {
                    this.params.onKeyDown(event);
                }
                getGui() {
                    // we call getGui() on child here (rather than in the constructor)
                    // as we should wait for 'init' to be called on child first.
                    if (!this.getGuiCalledOnChild) {
                        this.appendChild(this.cellEditor.getGui());
                        this.getGuiCalledOnChild = true;
                    }
                    return super.getGui();
                }
                init(params) {
                    this.params = params;
                    if (this.cellEditor.init) {
                        this.cellEditor.init(params);
                    }
                }
                afterGuiAttached() {
                    if (this.cellEditor.afterGuiAttached) {
                        this.cellEditor.afterGuiAttached();
                    }
                }
                getValue() {
                    return this.cellEditor.getValue();
                }
                isPopup() {
                    return true;
                }
            }
            exports_1("PopupEditorWrapper", PopupEditorWrapper);
        }
    }
});
//# sourceMappingURL=popupEditorWrapper.js.map