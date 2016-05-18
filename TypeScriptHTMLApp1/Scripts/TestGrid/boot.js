System.register(['../../bower_components/ag-grid/dist/lib/components/aggridng1'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var g;
    var TestGridApp;
    return {
        setters:[
            function (g_1) {
                g = g_1;
            }],
        execute: function() {
            (function (TestGridApp) {
                g.initialiseAgGridWithAngular1(angular);
            })(TestGridApp || (TestGridApp = {}));
        }
    }
});
//# sourceMappingURL=boot.js.map