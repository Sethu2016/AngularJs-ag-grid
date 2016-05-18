System.register(['../utils'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var utils_1;
    var CssClassApplier;
    return {
        setters:[
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }],
        execute: function() {
            class CssClassApplier {
                static addHeaderClassesFromCollDef(abstractColDef, eHeaderCell, gridOptionsWrapper) {
                    if (abstractColDef && abstractColDef.headerClass) {
                        var classToUse;
                        if (typeof abstractColDef.headerClass === 'function') {
                            var params = {
                                // bad naming, as colDef here can be a group or a column,
                                // however most people won't appreciate the difference,
                                // so keeping it as colDef to avoid confusion.
                                colDef: abstractColDef,
                                context: gridOptionsWrapper.getContext(),
                                api: gridOptionsWrapper.getApi()
                            };
                            var headerClassFunc = abstractColDef.headerClass;
                            classToUse = headerClassFunc(params);
                        }
                        else {
                            classToUse = abstractColDef.headerClass;
                        }
                        if (typeof classToUse === 'string') {
                            utils_1.Utils.addCssClass(eHeaderCell, classToUse);
                        }
                        else if (Array.isArray(classToUse)) {
                            classToUse.forEach((cssClassItem) => {
                                utils_1.Utils.addCssClass(eHeaderCell, cssClassItem);
                            });
                        }
                    }
                }
            }
            exports_1("CssClassApplier", CssClassApplier);
        }
    }
});
//# sourceMappingURL=cssClassApplier.js.map