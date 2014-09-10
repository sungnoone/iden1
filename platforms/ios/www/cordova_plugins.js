cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/com.aquto.cordova.AppleAdvertising/www/AppleAdvertising.js",
        "id": "com.aquto.cordova.AppleAdvertising.AppleAdvertising",
        "clobbers": [
            "window.plugins.AppleAdvertising"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "org.apache.cordova.device": "0.2.11",
    "com.aquto.cordova.AppleAdvertising": "0.0.1"
}
// BOTTOM OF METADATA
});