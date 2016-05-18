System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var VerticalStack;
    return {
        setters:[],
        execute: function() {
            class VerticalStack {
                constructor() {
                    this.isLayoutPanel = true;
                    this.childPanels = [];
                    this.eGui = document.createElement('div');
                    this.eGui.style.height = '100%';
                }
                addPanel(panel, height) {
                    var component;
                    if (panel.isLayoutPanel) {
                        this.childPanels.push(panel);
                        component = panel.getGui();
                    }
                    else {
                        component = panel;
                    }
                    if (height) {
                        component.style.height = height;
                    }
                    this.eGui.appendChild(component);
                }
                getGui() {
                    return this.eGui;
                }
                doLayout() {
                    for (var i = 0; i < this.childPanels.length; i++) {
                        this.childPanels[i].doLayout();
                    }
                }
            }
            exports_1("VerticalStack", VerticalStack);
        }
    }
});
//# sourceMappingURL=verticalStack.js.map