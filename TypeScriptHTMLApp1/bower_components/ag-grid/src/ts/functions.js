System.register(['./utils'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var utils_1;
    function defaultGroupComparator(valueA, valueB, nodeA, nodeB) {
        var nodeAIsGroup = utils_1.Utils.exists(nodeA) && nodeA.group;
        var nodeBIsGroup = utils_1.Utils.exists(nodeB) && nodeB.group;
        var bothAreGroups = nodeAIsGroup && nodeBIsGroup;
        var bothAreNormal = !nodeAIsGroup && !nodeBIsGroup;
        if (bothAreGroups) {
            return utils_1.Utils.defaultComparator(nodeA.key, nodeB.key);
        }
        else if (bothAreNormal) {
            return utils_1.Utils.defaultComparator(valueA, valueB);
        }
        else if (nodeAIsGroup) {
            return 1;
        }
        else {
            return -1;
        }
    }
    exports_1("defaultGroupComparator", defaultGroupComparator);
    return {
        setters:[
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=functions.js.map