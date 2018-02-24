module.exports = function(options = {}) {
    this.dependencies(["browser-sync", "browser-sync-webpack-plugin"]);
    Object.assign(options, {
        host: "localhost",
        port: 3000,
        proxy: "http://localhost:8888",
        files: "**/*"
    });
    const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
    return this.mergeConfig({
        plugins: [new BrowserSyncPlugin(options)]
    });
};
