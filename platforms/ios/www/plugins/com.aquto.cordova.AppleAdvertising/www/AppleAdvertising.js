cordova.define("com.aquto.cordova.AppleAdvertising.AppleAdvertising", function(require, exports, module) { var exec = require('cordova/exec');

module.exports = {
    getIDFA: function(success, error) {
        exec(success, error, "AppleAdvertising", "getIDFA", []);
    },
    getIDFV: function(success, error) {
        exec(success, error, "AppleAdvertising", "getIDFV", []);
    },
    trackingEnabled : function(success, error) {
        exec(success, error, "AppleAdvertising", "isTrackingEnabled", []);
    },
    getIdentifiers: function(success, error) {
        exec(success, error, "AppleAdvertising", "getTracking", []);
    }

};
});
