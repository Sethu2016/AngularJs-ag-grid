System.register(["../../utils", "../../widgets/component"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var utils_1, component_1;
    var ARROW_UP, ARROW_DOWN, AnimateShowChangeCellRenderer;
    return {
        setters:[
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (component_1_1) {
                component_1 = component_1_1;
            }],
        execute: function() {
            ARROW_UP = '&#65514;';
            ARROW_DOWN = '&#65516;';
            class AnimateShowChangeCellRenderer extends component_1.Component {
                constructor() {
                    super(AnimateShowChangeCellRenderer.TEMPLATE);
                    this.refreshCount = 0;
                }
                init(params) {
                    this.params = params;
                    this.eValue = this.queryForHtmlElement('.ag-value-change-value');
                    this.eDelta = this.queryForHtmlElement('.ag-value-change-delta');
                    this.refresh(params);
                }
                showDelta(params, delta) {
                    var absDelta = Math.abs(delta);
                    var valueFormatted = params.formatValue(absDelta);
                    var valueToUse = utils_1.Utils.exists(valueFormatted) ? valueFormatted : absDelta;
                    var deltaUp = (delta >= 0);
                    if (deltaUp) {
                        this.eDelta.innerHTML = ARROW_UP + valueToUse;
                    }
                    else {
                        // because negative, use ABS to remove sign
                        this.eDelta.innerHTML = ARROW_DOWN + valueToUse;
                    }
                    // class makes it green (in ag-fresh)
                    utils_1.Utils.addOrRemoveCssClass(this.eDelta, 'ag-value-change-delta-up', deltaUp);
                    // class makes it red (in ag-fresh)
                    utils_1.Utils.addOrRemoveCssClass(this.eDelta, 'ag-value-change-delta-down', !deltaUp);
                    // highlight the current value
                    utils_1.Utils.addCssClass(this.eValue, 'ag-value-change-value-highlight');
                    this.setTimerToRemoveDelta();
                }
                setTimerToRemoveDelta() {
                    // the refreshCount makes sure that if the value updates again while
                    // the below timer is waiting, then the below timer will realise it
                    // is not the most recent and will not try to remove the delta value.
                    this.refreshCount++;
                    var refreshCountCopy = this.refreshCount;
                    setTimeout(() => {
                        if (refreshCountCopy === this.refreshCount) {
                            this.hideDeltaValue();
                        }
                    }, 2000);
                }
                hideDeltaValue() {
                    utils_1.Utils.removeCssClass(this.eValue, 'ag-value-change-value-highlight');
                    this.eDelta.innerHTML = '';
                }
                refresh(params) {
                    var value = params.value;
                    if (value === this.lastValue) {
                        return;
                    }
                    if (utils_1.Utils.exists(params.valueFormatted)) {
                        this.eValue.innerHTML = params.valueFormatted;
                    }
                    else if (utils_1.Utils.exists(params.value)) {
                        this.eValue.innerHTML = value;
                    }
                    else {
                        this.eValue.innerHTML = '';
                    }
                    if (typeof value === 'number' && typeof this.lastValue === 'number') {
                        var delta = value - this.lastValue;
                        this.showDelta(params, delta);
                    }
                    this.lastValue = value;
                }
            }
            AnimateShowChangeCellRenderer.TEMPLATE = '<span>' +
                '<span class="ag-value-change-delta"></span>' +
                '<span class="ag-value-change-value"></span>' +
                '</span>';
            exports_1("AnimateShowChangeCellRenderer", AnimateShowChangeCellRenderer);
        }
    }
});
//# sourceMappingURL=animateShowChangeCellRenderer.js.map