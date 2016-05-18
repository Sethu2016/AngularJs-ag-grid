System.register(['../utils', "../eventService"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var utils_1, eventService_1;
    var Component;
    return {
        setters:[
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (eventService_1_1) {
                eventService_1 = eventService_1_1;
            }],
        execute: function() {
            class Component {
                constructor(template) {
                    this.destroyFunctions = [];
                    this.childComponents = [];
                    if (template) {
                        this.eGui = utils_1.Utils.loadTemplate(template);
                    }
                }
                setTemplate(template) {
                    this.eGui = utils_1.Utils.loadTemplate(template);
                }
                addEventListener(eventType, listener) {
                    if (!this.localEventService) {
                        this.localEventService = new eventService_1.EventService();
                    }
                    this.localEventService.addEventListener(eventType, listener);
                }
                removeEventListener(eventType, listener) {
                    if (this.localEventService) {
                        this.localEventService.removeEventListener(eventType, listener);
                    }
                }
                dispatchEvent(eventType, event) {
                    if (this.localEventService) {
                        this.localEventService.dispatchEvent(eventType, event);
                    }
                }
                getGui() {
                    return this.eGui;
                }
                queryForHtmlElement(cssSelector) {
                    return this.eGui.querySelector(cssSelector);
                }
                queryForHtmlInputElement(cssSelector) {
                    return this.eGui.querySelector(cssSelector);
                }
                appendChild(newChild) {
                    if (utils_1.Utils.isNodeOrElement(newChild)) {
                        this.eGui.appendChild(newChild);
                    }
                    else {
                        var childComponent = newChild;
                        this.eGui.appendChild(childComponent.getGui());
                        this.childComponents.push(childComponent);
                    }
                }
                setVisible(visible) {
                    utils_1.Utils.addOrRemoveCssClass(this.eGui, 'ag-hidden', !visible);
                }
                destroy() {
                    this.childComponents.forEach(childComponent => childComponent.destroy());
                    this.destroyFunctions.forEach(func => func());
                }
                addGuiEventListener(event, listener) {
                    this.getGui().addEventListener(event, listener);
                    this.destroyFunctions.push(() => this.getGui().removeEventListener(event, listener));
                }
                addDestroyableEventListener(eElement, event, listener) {
                    if (eElement instanceof HTMLElement) {
                        eElement.addEventListener(event, listener);
                    }
                    else {
                        eElement.addEventListener(event, listener);
                    }
                    this.destroyFunctions.push(() => {
                        if (eElement instanceof HTMLElement) {
                            eElement.removeEventListener(event, listener);
                        }
                        else {
                            eElement.removeEventListener(event, listener);
                        }
                    });
                }
                addDestroyFunc(func) {
                    this.destroyFunctions.push(func);
                }
            }
            exports_1("Component", Component);
        }
    }
});
//# sourceMappingURL=component.js.map