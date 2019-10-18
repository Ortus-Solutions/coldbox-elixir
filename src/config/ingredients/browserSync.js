module.exports = function(options = {}) {
    if (this.dependencies(["browser-sync", "browser-sync-webpack-plugin"])) {
        return;
    }
    const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
    return this.mergeConfig({
        plugins: [new BrowserSyncPlugin(Object.assign({
            host: "localhost",
            port: 3000,
            proxy: "http://localhost:8888",
            files: "**/*"
        }, options))]
    });
};
