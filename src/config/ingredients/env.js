const { EnvironmentPlugin } = require("webpack");

module.exports = function(keys) {
    return this.mergeConfig({
        plugins: [
            new EnvironmentPlugin(keys)
        ]
    });
};
