System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var GroupInstanceIdCreator;
    return {
        setters:[],
        execute: function() {
            // class returns unique instance id's for columns.
            // eg, the following calls (in this order) will result in:
            //
            // getInstanceIdForKey('country') => 0
            // getInstanceIdForKey('country') => 1
            // getInstanceIdForKey('country') => 2
            // getInstanceIdForKey('country') => 3
            // getInstanceIdForKey('age') => 0
            // getInstanceIdForKey('age') => 1
            // getInstanceIdForKey('country') => 4
            class GroupInstanceIdCreator {
                constructor() {
                    // this map contains keys to numbers, so we remember what the last call was
                    this.existingIds = {};
                }
                getInstanceIdForKey(key) {
                    var lastResult = this.existingIds[key];
                    var result;
                    if (typeof lastResult !== 'number') {
                        // first time this key
                        result = 0;
                    }
                    else {
                        result = lastResult + 1;
                    }
                    this.existingIds[key] = result;
                    return result;
                }
            }
            exports_1("GroupInstanceIdCreator", GroupInstanceIdCreator);
        }
    }
});
//# sourceMappingURL=groupInstanceIdCreator.js.map