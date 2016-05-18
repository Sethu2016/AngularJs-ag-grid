System.register(["../../utils", "../../widgets/component"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var utils_1, component_1;
    var AnimateSlideCellRenderer;
    return {
        setters:[
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (component_1_1) {
                component_1 = component_1_1;
            }],
        execute: function() {
            class AnimateSlideCellRenderer extends component_1.Component {
                constructor() {
                    super(AnimateSlideCellRenderer.TEMPLATE);
                    this.refreshCount = 0;
                    this.eCurrent = this.queryForHtmlElement('.ag-value-slide-current');
                }
                init(params) {
                    this.params = params;
                    this.refresh(params);
                }
                addSlideAnimation() {
                    this.refreshCount++;
                    // below we keep checking this, and stop working on the animation
                    // if it no longer matches - this means another animation has started
                    // and this one is stale.
                    var refreshCountCopy = this.refreshCount;
                    // if old animation, remove it
                    if (this.ePrevious) {
                        this.getGui().removeChild(this.ePrevious);
                    }
                    this.ePrevious = utils_1.Utils.loadTemplate('<span class="ag-value-slide-previous ag-fade-out"></span>');
                    this.ePrevious.innerHTML = this.eCurrent.innerHTML;
                    this.getGui().insertBefore(this.ePrevious, this.eCurrent);
                    // having timeout of 0 allows use to skip to the next css turn,
                    // so we know the previous css classes have been applied. so the
                    // complex set of setTimeout below creates the animation
                    setTimeout(() => {
                        if (refreshCountCopy !== this.refreshCount) {
                            return;
                        }
                        utils_1.Utils.addCssClass(this.ePrevious, 'ag-fade-out-end');
                    }, 50);
                    setTimeout(() => {
                        if (refreshCountCopy !== this.refreshCount) {
                            return;
                        }
                        this.getGui().removeChild(this.ePrevious);
                        this.ePrevious = null;
                    }, 3000);
                }
                refresh(params) {
                    var value = params.value;
                    if (utils_1.Utils.missing(value)) {
                        value = '';
                    }
                    if (value === this.lastValue) {
                        return;
                    }
                    this.addSlideAnimation();
                    this.lastValue = value;
                    if (utils_1.Utils.exists(params.valueFormatted)) {
                        this.eCurrent.innerHTML = params.valueFormatted;
                    }
                    else if (utils_1.Utils.exists(params.value)) {
                        this.eCurrent.innerHTML = value;
                    }
                    else {
                        this.eCurrent.innerHTML = '';
                    }
                }
            }
            AnimateSlideCellRenderer.TEMPLATE = '<span>' +
                '<span class="ag-value-slide-current"></span>' +
                '</span>';
            exports_1("AnimateSlideCellRenderer", AnimateSlideCellRenderer);
        }
    }
});
//# sourceMappingURL=animateSlideCellRenderer.js.map