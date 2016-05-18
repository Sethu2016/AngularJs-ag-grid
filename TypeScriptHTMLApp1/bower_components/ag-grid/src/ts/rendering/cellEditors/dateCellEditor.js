System.register(["../../widgets/component", "../../context/context", "../../widgets/popupService", '../../utils'], function(exports_1, context_1) {
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
    var component_1, context_2, popupService_1, utils_1;
    var DateCellEditor;
    return {
        setters:[
            function (component_1_1) {
                component_1 = component_1_1;
            },
            function (context_2_1) {
                context_2 = context_2_1;
            },
            function (popupService_1_1) {
                popupService_1 = popupService_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }],
        execute: function() {
            class DateCellEditor extends component_1.Component {
                constructor() {
                    super(DateCellEditor.TEMPLATE);
                    this.eText = this.queryForHtmlInputElement('input');
                    this.eButton = this.queryForHtmlElement('button');
                    this.eButton.addEventListener('click', this.onBtPush.bind(this));
                }
                getValue() {
                    return this.eText.value;
                }
                onBtPush() {
                    var ePopup = utils_1.Utils.loadTemplate('<div style="position: absolute; border: 1px solid darkgreen; background: lightcyan">' +
                        '<div>This is the popup</div>' +
                        '<div><input/></div>' +
                        '<div>Under the input</div>' +
                        '</div>');
                    this.popupService.addAsModalPopup(ePopup, true, () => {
                        console.log('popup was closed');
                    });
                    this.popupService.positionPopupUnderComponent({
                        eventSource: this.getGui(),
                        ePopup: ePopup
                    });
                    var eText = ePopup.querySelector('input');
                    eText.focus();
                }
                afterGuiAttached() {
                    this.eText.focus();
                }
            }
            DateCellEditor.TEMPLATE = '<span>' +
                '<input type="text" style="width: 80%"/>' +
                '<button style="width: 20%">+</button>' +
                '</span>';
            __decorate([
                context_2.Autowired('popupService'), 
                __metadata('design:type', popupService_1.PopupService)
            ], DateCellEditor.prototype, "popupService", void 0);
            exports_1("DateCellEditor", DateCellEditor);
        }
    }
});
//# sourceMappingURL=dateCellEditor.js.map